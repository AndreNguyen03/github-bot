import { Octokit } from "@octokit/rest";

export async function postInlineComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number,
  file: any,
  aiFeedback: string
) {
  if (!aiFeedback.trim()) return;

  // Tìm dòng đầu tiên thay đổi
  const firstChangedLine = file.patch
    .split("\n")
    .find((line: string) => line.startsWith("+"));
  if (firstChangedLine) {
    const lineNumber = file.patch.split("\n").indexOf(firstChangedLine) + 1;
    const { data: commits } = await octokit.pulls.listCommits({
      owner,
      repo,
      pull_number: prNumber,
    });
    const commitId = commits[0].sha;
    const diffHunk = file.patch;
    // Tạo review comment với hoặc không có commit_id
    await octokit.pulls.createReviewComment({
      owner,
      repo,
      pull_number: prNumber,
      body: aiFeedback,
      commit_id: commitId,
      path: file.filename,
      position: lineNumber,
      diff_hunk: diffHunk,
    });
  }
}
