This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Cloudflare Worker for downloads

The `dl.rustfs.com/artifacts/*` download path is served by a Cloudflare Worker that reads objects from the `dl-rustfs` R2 bucket.

The Worker entrypoint is `worker/index.ts`, and the R2 binding is pinned in `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "R2_DOWNLOAD_BUCKET"
bucket_name = "dl-rustfs"
```

Deploy the Worker with Wrangler from this repository:

```bash
pnpm dlx wrangler deploy
```

After deployment, verify the custom domain route:

```bash
curl -I https://dl.rustfs.com/artifacts/rustfs/release/rustfs-macos-x86_64-v1.0.0-beta.8.zip
```

The expected result is `200 OK`. If the public R2 URL works but this URL returns `404`, check the Worker logs for the requested object key. The Worker maps `/artifacts/...` directly to the R2 key `artifacts/...`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
