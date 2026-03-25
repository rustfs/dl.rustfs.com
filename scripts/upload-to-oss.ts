import OSS from 'ali-oss';
import fs from 'fs/promises';
import path from 'path';
import { lookup as lookupMimeType } from 'mime-types';

const UPLOAD_TIMEOUT_MS = 10 * 60 * 1000;

function getEnv(name: string, options?: { required?: boolean }) {
  const value = process.env[name]?.trim();

  if (options?.required && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectFiles(fullPath);
      }

      if (entry.isFile()) {
        return [fullPath];
      }

      return [];
    })
  );

  return nestedFiles.flat().sort();
}

function normalizeObjectKey(filePath: string, sourceDir: string, destinationPrefix: string) {
  const relativePath = path.relative(sourceDir, filePath).split(path.sep).join('/');
  const normalizedPrefix = destinationPrefix.replace(/^\/+|\/+$/g, '');

  return normalizedPrefix ? `${normalizedPrefix}/${relativePath}` : relativePath;
}

async function main() {
  const sourceDirInput = getEnv('OSS_SOURCE_DIR', { required: true })!;
  const destinationPrefix = getEnv('OSS_DEST_PREFIX') ?? '';
  const dryRun = getEnv('OSS_DRY_RUN') === 'true';

  const sourceDir = path.isAbsolute(sourceDirInput)
    ? sourceDirInput
    : path.join(process.cwd(), sourceDirInput);

  const files = await collectFiles(sourceDir);

  if (files.length === 0) {
    throw new Error(`No files found under ${sourceDir}`);
  }

  const bucket = getEnv('OSS_BUCKET', { required: true })!;
  const region = getEnv('OSS_REGION');
  const endpoint = getEnv('OSS_ENDPOINT');

  if (!region && !endpoint) {
    throw new Error('Either OSS_REGION or OSS_ENDPOINT must be provided');
  }

  console.log(`Preparing to upload ${files.length} file(s) from ${sourceDir} to oss://${bucket}/${destinationPrefix}`);

  if (dryRun) {
    for (const filePath of files) {
      console.log(`[dry-run] ${filePath} -> ${normalizeObjectKey(filePath, sourceDir, destinationPrefix)}`);
    }
    return;
  }

  const client = new OSS({
    accessKeyId: getEnv('OSS_KEY_ID', { required: true })!,
    accessKeySecret: getEnv('OSS_KEY_SECRET', { required: true })!,
    bucket,
    ...(region ? { region } : {}),
    ...(endpoint ? { endpoint } : {}),
  });

  for (const filePath of files) {
    const objectKey = normalizeObjectKey(filePath, sourceDir, destinationPrefix);
    const contentType = lookupMimeType(filePath) || undefined;

    console.log(`Uploading ${filePath} -> oss://${bucket}/${objectKey}`);

    await client.put(objectKey, filePath, {
      timeout: UPLOAD_TIMEOUT_MS,
      ...(contentType
        ? {
            headers: {
              'Content-Type': contentType,
            },
          }
        : {}),
    });
  }

  console.log(`Uploaded ${files.length} file(s) to oss://${bucket}/${destinationPrefix}`);
}

main().catch((error) => {
  console.error('Failed to upload files to OSS:', error);
  process.exit(1);
});
