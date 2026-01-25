import { Octokit } from "@octokit/rest";

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

if (!token) {
  console.warn("No GitHub token found in environment. Using unauthenticated requests.");
}

const octokit = new Octokit(token ? { auth: token } : {});

export default octokit;

export async function getReleases(repo: string) {
  const releasesResponse = await octokit.repos.listReleases({
    owner: "rustfs",
    repo,
  });

  return releasesResponse.data;
}
