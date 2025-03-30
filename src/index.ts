import { Probot } from "probot";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export default (app: Probot) => {
  app.log.info("🚀 Bot đã sẵn sàng!");
  app.on("pull_request.opened", async (context) => {
    const pr = context.payload.pull_request;
    const repo = context.payload.repository;
    // Lấy danh sách các file thay đổi trong PR
    const { data: files } = await context.octokit.pulls.listFiles({
      owner: repo.owner.login,
      repo: repo.name,
      pull_number: pr.number,
    });

    let codeDiffs = "";
    for (const file of files) {
      if (file.patch) {
        codeDiffs += `File: ${file.filename}\n${file.patch}\n\n`;
      }
    }
    // Gửi code đến OpenAI để phân tích
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Bạn là một chuyên gia code review." },
        {
          role: "user",
          content: `Hãy review đoạn code sau và đưa ra nhận xét:\n\n${codeDiffs}`,
        },
      ],
    });
    const reviewComments =
      aiResponse.choices[0]?.message?.content || "Không thể review code.";

    // Thêm comment vào PR
    await context.octokit.issues.createComment(
      context.issue({
        body: `🤖 **AI Code Review:**\n\n${reviewComments}`,
      })
    );
    app.log.info(`📌 Đã comment vào PR #${pr.number} của ${repo.full_name}`);
  });
};
