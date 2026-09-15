import { Octokit } from "@octokit/rest";

const token =
  process.env.GH_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim() || undefined;

if (!token) {
  console.warn(
    [
      "No GitHub token found in environment (GH_TOKEN or GITHUB_TOKEN).",
      "Using unauthenticated requests (60 req/hour per IP).",
      "Cloudflare shared build IPs are frequently already over that limit;",
      "without a token this build will likely be rate-limited (403) and must fall back to last-known release data.",
      "Set GH_TOKEN (or GITHUB_TOKEN) in the Cloudflare project build environment (Workers Builds / Pages → Settings → Variables/Secrets).",
    ].join(" ")
  );
}

const octokit = new Octokit(token ? { auth: token } : {});

export default octokit;

export function hasGitHubToken() {
  return Boolean(token);
}

export function isRecoverableReleaseFetchError(error: unknown) {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = Number((error as { status: unknown }).status);
    if (status === 403 || status === 429) {
      return true;
    }
  }

  const message = error instanceof Error ? error.message : String(error);
  return /rate limit|secondary rate|API rate limit exceeded/i.test(message);
}

export async function getReleases(repo: string) {
  const releasesResponse = await octokit.repos.listReleases({
    owner: "rustfs",
    repo,
  });

  return releasesResponse.data;
}
