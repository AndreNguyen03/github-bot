import { Context } from "probot";
import { CommitSummary } from "../interface/commit-summary.js";

// Hàm lấy commit summaries
export async function getCommitSummaries(
  context: Context,
  owner: string,
  repo: string,
  limit: number = 10
): Promise<CommitSummary[]> {
  const commits = await context.octokit.repos.listCommits({
    owner,
    repo,
    per_page: limit,
  });

  const summaries: CommitSummary[] = [];
  for (const commit of commits.data) {
    const detail = await context.octokit.repos.getCommit({
      owner,
      repo,
      ref: commit.sha,
    });
    summaries.push({
      author: commit.author?.login || "unknown",
      message: commit.commit.message,
      files: detail.data.files?.map((f) => f.filename).join(", ") || "",
    });
  }
  return summaries;
}