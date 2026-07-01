type R2HttpMetadata = {
  contentType?: string;
  contentLanguage?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
};

type R2Object = {
  size: number;
  etag: string;
  uploaded: Date;
  httpEtag?: string;
  httpMetadata?: R2HttpMetadata;
  writeHttpMetadata?: (headers: Headers) => void;
};

type R2ObjectBody = R2Object & {
  body: ReadableStream;
};

type R2BucketBinding = {
  head: (key: string) => Promise<R2Object | null>;
  get: (key: string) => Promise<R2ObjectBody | null>;
};

type Env = {
  R2_DOWNLOAD_BUCKET?: R2BucketBinding;
};

function objectKeyFromRequest(url: URL) {
  const path = url.pathname.replace(/^\/+/, '');

  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

function metadataHeaders(object: R2Object) {
  const headers = new Headers();

  if (object.writeHttpMetadata) {
    object.writeHttpMetadata(headers);
  } else {
    const metadata = object.httpMetadata;

    if (metadata?.contentType) headers.set('content-type', metadata.contentType);
    if (metadata?.contentLanguage) headers.set('content-language', metadata.contentLanguage);
    if (metadata?.contentDisposition) headers.set('content-disposition', metadata.contentDisposition);
    if (metadata?.contentEncoding) headers.set('content-encoding', metadata.contentEncoding);
    if (metadata?.cacheControl) headers.set('cache-control', metadata.cacheControl);
    if (metadata?.cacheExpiry) headers.set('expires', metadata.cacheExpiry.toUTCString());
  }

  headers.set('etag', object.httpEtag ?? object.etag);
  headers.set('content-length', object.size.toString());

  if (!headers.has('cache-control')) {
    headers.set('cache-control', 'public, max-age=31536000, immutable');
  }

  return headers;
}

function notFound() {
  return new Response('Not found', { status: 404 });
}

const worker = {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', {
        status: 405,
        headers: {
          allow: 'GET, HEAD',
        },
      });
    }

    if (!url.pathname.startsWith('/artifacts/')) {
      return notFound();
    }

    const bucket = env.R2_DOWNLOAD_BUCKET;

    if (!bucket) {
      return new Response('R2_DOWNLOAD_BUCKET binding is missing', { status: 500 });
    }

    const key = objectKeyFromRequest(url);

    if (!key || key === 'artifacts') {
      return notFound();
    }

    if (request.method === 'HEAD') {
      const object = await bucket.head(key);

      if (!object) {
        return notFound();
      }

      return new Response(null, {
        headers: metadataHeaders(object),
      });
    }

    const object = await bucket.get(key);

    if (!object) {
      return notFound();
    }

    return new Response(object.body, {
      headers: metadataHeaders(object),
    });
  },
};

export default worker;