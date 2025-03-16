import { Octokit } from "@octokit/rest";

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

if (!token) {
  console.error("No GitHub token found in environment");
  process.exit(1);
}

const octokit = new Octokit({
  auth: process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
});

export default octokit;

export async function getReleases(repo: string) {
  const releasesResponse = await octokit.repos.listReleases({
    owner: "rustfs",
    repo,
  });

  return releasesResponse.data;
}
