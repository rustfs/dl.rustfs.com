import {
  getReleases,
  hasGitHubToken,
  isRecoverableReleaseFetchError,
} from '@/lib/github';
import {
  dataReleasesPath,
  loadFallbackReleases,
} from '@/lib/release-fallback';
import { fetchExistingR2Packages } from '@/lib/r2-packages';
import { projects } from '@/projects.config';
import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';

const isErrnoException = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' && error !== null && 'code' in error;

const RELEASE_CACHE_TTL_MS = 60 * 60 * 1000;

async function writeReleases(repo: string, releases: unknown) {
  const releasesPath = dataReleasesPath(repo);
  await fs.mkdir(path.dirname(releasesPath), { recursive: true });
  await fs.writeFile(releasesPath, JSON.stringify(releases, null, 2), 'utf8');
}

async function applyFallback(repo: string, error: unknown) {
  const fallback = await loadFallbackReleases(repo);

  if (!fallback) {
    return false;
  }

  const rateLimited = isRecoverableReleaseFetchError(error);
  console.warn(
    [
      `⚠️  Using last-known release data for ${repo} from ${fallback.source}`,
      `(${fallback.releases.length} release(s)).`,
      rateLimited
        ? 'GitHub API returned a rate-limit/403 response.'
        : 'GitHub release fetch failed.',
      hasGitHubToken()
        ? 'The configured GH_TOKEN/GITHUB_TOKEN did not prevent this failure.'
        : 'Set GH_TOKEN or GITHUB_TOKEN in the Cloudflare build environment to fetch live releases.',
    ].join(' ')
  );

  if (fallback.source !== path.relative(process.cwd(), dataReleasesPath(repo))) {
    await writeReleases(repo, fallback.releases);
  }

  return true;
}

export async function fetchReleases() {
  const org = 'rustfs';
  const failures: { repo: string; error: unknown }[] = [];
  let fallbackCount = 0;

  console.log(`Fetching releases for ${projects.length} projects from ${org}...`);
  if (!hasGitHubToken()) {
    console.warn(
      'GH_TOKEN/GITHUB_TOKEN is unset; unauthenticated GitHub requests often fail on Cloudflare shared build IPs.'
    );
  }

  try {
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });

    for (const project of projects) {
      console.log(`Fetching ${org}/${project.repo}...`);

      await fs.mkdir(path.join(process.cwd(), 'data', project.repo), { recursive: true });

      const releasesPath = dataReleasesPath(project.repo);

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
        if (process.env.RELEASE_FETCH_FORCE_ERROR === 'rate_limit') {
          throw Object.assign(new Error('API rate limit exceeded'), { status: 403 });
        }

        const releases = await getReleases(project.repo);

        if (project.r2PackagesBase) {
          for (const release of releases) {
            const r2Assets = await fetchExistingR2Packages(release.tag_name);

            if (r2Assets.length > 0) {
              release.assets.push(...r2Assets);
            }
          }
        }

        await writeReleases(project.repo, releases);
        console.log(`✅ Successfully saved releases data for ${project.repo}`);
      } catch (error) {
        const recovered = await applyFallback(project.repo, error);
        if (recovered) {
          fallbackCount += 1;
          continue;
        }

        failures.push({ repo: project.repo, error });
        console.error(`❌ Error fetching releases for ${project.repo}:`, error);
      }
    }

    if (failures.length > 0) {
      throw new Error(`Failed to fetch releases for ${failures.length} project(s)`);
    }

    if (fallbackCount > 0) {
      console.warn(
        `⚠️  Build continued with last-known release JSON for ${fallbackCount} project(s). Live GitHub data was not used.`
      );
      return;
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
