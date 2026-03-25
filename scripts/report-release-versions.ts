import { projects } from '@/projects.config';
import type { Release } from '@/types';
import fs from 'fs/promises';
import path from 'path';

type ReleaseVersionEntry = {
  project: string;
  repo: string;
  latest: {
    version: string;
    tag_name: string;
    published_at: string | null;
    html_url: string;
    prerelease: boolean;
    assets_count: number;
  } | null;
};

function parseArgs(args: string[]) {
  let writePath: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--write') {
      writePath = args[index + 1];
      index += 1;
    }
  }

  return { writePath };
}

async function readLatestRelease(repo: string): Promise<Release | null> {
  const releasesPath = path.join(process.cwd(), 'data', repo, 'releases.json');
  const raw = await fs.readFile(releasesPath, 'utf8');
  const releases = JSON.parse(raw) as Release[];

  return releases[0] ?? null;
}

async function collectReleaseVersions() {
  return Promise.all(
    projects.map(async (project): Promise<ReleaseVersionEntry> => {
      const latest = await readLatestRelease(project.repo);

      return {
        project: project.title,
        repo: project.repo,
        latest: latest
          ? {
              version: latest.name || latest.tag_name,
              tag_name: latest.tag_name,
              published_at: latest.published_at,
              html_url: latest.html_url,
              prerelease: latest.prerelease,
              assets_count: latest.assets.length,
            }
          : null,
      };
    })
  );
}

function formatPublishedAt(publishedAt: string | null) {
  return publishedAt ?? 'Unknown';
}

function printConsoleReport(entries: ReleaseVersionEntry[]) {
  console.log('Release versions used for this build:');

  for (const entry of entries) {
    if (!entry.latest) {
      console.log(`- ${entry.project} (${entry.repo}): no releases found`);
      continue;
    }

    const prereleaseLabel = entry.latest.prerelease ? ' [pre-release]' : '';
    console.log(
      `- ${entry.project} (${entry.repo}): ${entry.latest.version}${prereleaseLabel} | published ${formatPublishedAt(entry.latest.published_at)} | assets ${entry.latest.assets_count}`
    );
  }
}

async function appendGitHubSummary(entries: ReleaseVersionEntry[]) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;

  if (!summaryPath) {
    return;
  }

  const generatedAt = new Date().toISOString();
  const sha = process.env.GITHUB_SHA ?? 'local';
  const lines = [
    '## Release Versions Used For Build',
    '',
    `Generated at: \`${generatedAt}\``,
    '',
    `Commit: \`${sha}\``,
    '',
    '| Project | Repo | Version | Published At | Release |',
    '| --- | --- | --- | --- | --- |',
    ...entries.map((entry) => {
      if (!entry.latest) {
        return `| ${entry.project} | \`${entry.repo}\` | No releases found | Unknown | - |`;
      }

      const version = `\`${entry.latest.version}${entry.latest.prerelease ? ' (pre-release)' : ''}\``;
      const releaseLink = `[GitHub](${entry.latest.html_url})`;

      return `| ${entry.project} | \`${entry.repo}\` | ${version} | ${formatPublishedAt(entry.latest.published_at)} | ${releaseLink} |`;
    }),
    '',
  ];

  await fs.appendFile(summaryPath, `${lines.join('\n')}\n`, 'utf8');
}

async function writeManifest(entries: ReleaseVersionEntry[], outputPath: string) {
  const absoluteOutputPath = path.isAbsolute(outputPath)
    ? outputPath
    : path.join(process.cwd(), outputPath);

  await fs.mkdir(path.dirname(absoluteOutputPath), { recursive: true });
  await fs.writeFile(
    absoluteOutputPath,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        git_sha: process.env.GITHUB_SHA ?? null,
        run_id: process.env.GITHUB_RUN_ID ?? null,
        entries,
      },
      null,
      2
    ),
    'utf8'
  );

  console.log(`Release version manifest written to ${absoluteOutputPath}`);
}

async function main() {
  const { writePath } = parseArgs(process.argv.slice(2));
  const entries = await collectReleaseVersions();

  printConsoleReport(entries);
  await appendGitHubSummary(entries);

  if (writePath) {
    await writeManifest(entries, writePath);
  }
}

main().catch((error) => {
  console.error('Failed to report release versions:', error);
  process.exit(1);
});
