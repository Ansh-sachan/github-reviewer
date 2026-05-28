import { github } from "./github.client.js";

export async function getPullRequestFiles(
  owner: string,
  repo: string,
  pull_number: number
) {

  const response = await github.pulls.listFiles({
    owner,
    repo,
    pull_number
  });

  return response.data;
}