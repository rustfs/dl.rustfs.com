import { getReleases } from '@/lib/github';
import { projects } from '@/projects.config';
import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';

const isErrnoException = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' && error !== null && 'code' in error;

const RELEASE_CACHE_TTL_MS = 60 * 60 * 1000;

export async function fetchReleases() {
  const org = 'rustfs';
  const failures: { repo: string; error: unknown }[] = [];

  console.log(`Fetching releases for ${projects.length} projects from ${org}...`);

  try {
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });

    for (const project of projects) {
      console.log(`Fetching ${org}/${project.repo}...`);

      await fs.mkdir(path.join(process.cwd(), 'data', project.repo), { recursive: true });

      const releasesPath = path.join(process.cwd(), 'data', project.repo, 'releases.json');

      try {
        const stats = await fs.stat(releasesPath);
        if (Date.now() - stats.mtime.getTime() < RELEASE_CACHE_TTL_MS) {
          console.log(`⏭ Skipping ${project.repo} as the data was updated less than an hour ago`);
          continue;
        }
      } catch (error) {
        if (!isErrnoException(error) || error.code !== 'ENOENT') {
          console.error(`file check failed for ${releasesPath}:`, error);
        }
      }

      try {
        const releases = await getReleases(project.repo);
        await fs.writeFile(
          path.join(process.cwd(), 'data', project.repo, 'releases.json'),
          JSON.stringify(releases, null, 2),
          'utf8'
        );
        console.log(`✅ Successfully saved releases data for ${project.repo}`);
      } catch (error) {
        failures.push({ repo: project.repo, error });
        console.error(`❌ Error fetching releases for ${project.repo}:`, error);
      }
    }

    if (failures.length > 0) {
      throw new Error(`Failed to fetch releases for ${failures.length} project(s)`);
    }

    console.log(`✅ Successfully saved releases data for ${projects.length} projects`);
  } catch (error) {
    console.error('❌ Error fetching releases:', error);
    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  fetchReleases().catch(() => {
    process.exit(1);
  });
}
