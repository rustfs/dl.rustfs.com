import fs from "fs/promises";
import path from "path";
import type { Release } from "@/types";

export const COMMITTED_RELEASE_FALLBACK_DIR = path.join(
  process.cwd(),
  "fallback",
  "releases"
);

export function dataReleasesPath(repo: string) {
  return path.join(process.cwd(), "data", repo, "releases.json");
}

export function committedReleaseFallbackPath(repo: string) {
  return path.join(COMMITTED_RELEASE_FALLBACK_DIR, `${repo}.json`);
}

export async function readReleasesJson(
  filePath: string
): Promise<Release[] | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return null;
    }

    return parsed as Release[];
  } catch {
    return null;
  }
}

export async function loadFallbackReleases(repo: string): Promise<{
  releases: Release[];
  source: string;
} | null> {
  const cachedPath = dataReleasesPath(repo);
  const cached = await readReleasesJson(cachedPath);
  if (cached) {
    return { releases: cached, source: path.relative(process.cwd(), cachedPath) };
  }

  const committedPath = committedReleaseFallbackPath(repo);
  const committed = await readReleasesJson(committedPath);
  if (committed) {
    return {
      releases: committed,
      source: path.relative(process.cwd(), committedPath),
    };
  }

  return null;
}
