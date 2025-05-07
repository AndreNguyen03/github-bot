import { Context } from "probot";
import { summaryCodeChanges } from "../ai/summaryChanges.js";

export async function handlePrSummary(context:Context<'pull_request.opened' | 'pull_request.reopened'>) {
  const prComment = context.issue({
    body: "Bạn đã tạo PR! PR của bạn sẽ được xem xét! Nice a day 😊",
  });

  //app.log.info(`PR Number: ${context.payload.pull_request.number}`);
  await context.octokit.issues.createComment(prComment);

  const files = await context.octokit.pulls.listFiles(
    context.pullRequest({ per_page: 100 })
  );

  //app.log.info(`Toàn bộ thông tin files.data: ${files}`);
  let allPatches = "";
  for (const file of files.data) {
    if (!file.patch) continue; // Bỏ file nhị phân hoặc không có diff
    allPatches += `File: ${file.filename}\n${file.patch}\n\n`;
  }
  const summary = await summaryCodeChanges("Tổng thể Pull Request", allPatches);
  if (summary && summary.trim() !== "") {
    await context.octokit.issues.createComment(
      context.issue({
        body: `🤖 **Bản tóm tắt PR:**\n ${summary}`,
      })
    );
  }
}
