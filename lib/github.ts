import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export default octokit;

export async function getReleases(repo: string) {
  const releasesResponse = await octokit.repos.listReleases({
    owner: "rustfs",
    repo,
  });

  return releasesResponse.data;
}
