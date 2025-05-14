import { Context, Probot } from "probot";
import { isCodeFile, isNonCodeFile } from "../utils/check-file.js";
import { generateAIReview } from "../ai/reviewAI.js";

export async function handleAiReviewPullRequest(
  context: Context<"pull_request.labeled">,
  app: Probot,
  config: any
) {
  // Kiểm tra label có phải 'ai-review'
  const labelName = context.payload.label.name;
  if (labelName !== config.ai_pr_review_while_labeled.label) return;

  const { owner, repo } = context.repo();
  const pull_number = context.payload.pull_request.number;

  const { data: pr } = await context.octokit.pulls.get({
    owner,
    repo,
    pull_number,
  });

  const filesResponse = await context.octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: pull_number,
  });

  for (let i = 0; i < filesResponse.data.length; i++) {
    const file = filesResponse.data[i];
    const filename = file.filename;
    app.log.info("Review file: ", filename);
    if (!isCodeFile(filename) || isNonCodeFile(filename)) continue;

    // Lấy nội dung file từ raw_url
    const content = await fetch(file.raw_url).then((res) => res.text());

    // Sinh nhận xét từ AI
    const body = await generateAIReview(content, filename, file.status);

    // Gửi review comment lên PR
    await context.octokit.pulls.createReviewComment({
      owner,
      repo,
      pull_number,
      body,
      commit_id: pr.head.sha,
      path: filename,
      line: 0,
    });

    app.log.info("Sent review to ", filename);

  }

  await context.octokit.issues.createComment({
    owner,
    repo,
    issue_number: pull_number,
    body: "AI completed review, please check out!",
  });

  app.log.info("AI code review completed");
}
