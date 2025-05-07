import { Context, Probot } from "probot";
import { scanPullRequestFormat } from "../ai/scanPullRequestFormat.js";
import { scanIssueFormat } from "../ai/scanIssueFormat.js";

export async function handleScanPullRequest(
  context: Context<"pull_request.opened" | "pull_request.reopened">,
  app: Probot,
  config: any
) {
  const { pull_request, repository } = context.payload;
  const { title, body } = pull_request;
  const owner = repository.owner.login;
  const repo = repository.name;
  const prNumber = pull_request.number;

  const { isValid, feedback } = await scanPullRequestFormat(
    title,
    body,
    config.scan.pull_request.prompt
  );
  app.log.info(`Pull Request format validation result: ${isValid} ${feedback}`);
  if (!isValid) {
    await context.octokit.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: `❌ **Pull Request không đúng định dạng chuẩn.**\n\n${feedback}`,
    });

    await context.octokit.issues.update({
      owner,
      repo,
      issue_number: prNumber,
      state: "closed",
    });

    await context.octokit.issues.addLabels(
      context.issue({ labels: ["invalid"] })
    );
    app.log.info(`Added label "invalid" to pr #${prNumber}`);
  } else {
    await context.octokit.issues.removeLabel({
      owner,
      repo,
      issue_number: prNumber,
      name: "invalid",
    });
  }
}

export async function handleScanIssue(
  context: Context<"issues.opened">,
  app: Probot,
  config: any
) {
  const { issue, repository } = context.payload;
  const { title, body } = issue;
  const owner = repository.owner.login;
  const repo = repository.name;
  const issueNumber = issue.number;

  const { isValid, feedback } = await scanIssueFormat(
    title,
    body,
    config.scan.issue.prompt
  );
  app.log.info(`Issue format validation result: ${isValid} ${feedback}`);
  if (!isValid) {
    await context.octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: `❌ **Issue không đúng định dạng chuẩn.**\n\n${feedback}`,
    });

    await context.octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: "closed",
    });

    await context.octokit.issues.addLabels(
      context.issue({ labels: ["invalid"] })
    );
    app.log.info(`Added label "invalid" to issue #${issueNumber}`);
  }
}
