import { Probot } from "probot";
//import OpenAI from "openai";
// import { generateAIReview } from "./AI/reviewAI.js";
// import { postInlineComment } from "./github.js";
// import { Octokit } from "@octokit/rest";
// import { extractContextualBlocks } from "./Process/extract.js";
// import { findFirstPlusLinePosition } from "./Process/position.js";
//const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export default (app: Probot) => {
  app.log.info("🚀 Bot đã sẵn sàng!");

  // app.on("pull_request.opened", async (context) => {
  //   const { owner, repo } = context.repo();
  //   const prNumber = context.payload.pull_request.number;
  //   app.log.info(`📦 Đang xử lý PR #${prNumber} tại ${owner}/${repo}`);

  //   const filesChanged = await context.octokit.pulls.listFiles({
  //     owner,
  //     repo,
  //     pull_number: prNumber,
  //   });

  //   for (const file of filesChanged.data) {
  //     if (!file.patch) continue;
  //     const addedBlocks = extractContextualBlocks(file.patch);
  //     for (const block of addedBlocks) {
  //       const blockContent = block.lines.join("\n");
  //       const patchLines = file.patch.split("\n");

  //       const position = findFirstPlusLinePosition(
  //         patchLines,
  //         block.startIndex
  //       );

  //       const aiFeedback = await generateAIReview(file.filename, blockContent);

  //       if (aiFeedback && aiFeedback.trim() !== "") {
  //         app.log.info(
  //           `💬 Đang comment vào ${file.filename} tại dòng ${position}`
  //         );
  //         await postInlineComment(
  //           context.octokit as unknown as Octokit,
  //           owner,
  //           repo,
  //           prNumber,
  //           {
  //             ...file,
  //             position,
  //           },
  //           aiFeedback
  //         );
  //       }
  //     }
  //   }
  //   app.log.info("✅ Đã xử lý xong PR.");
  // });
  app.on(["pull_request.opened", "pull_request.reopened"], async (context) => {
    const prComment = context.issue({
      body: "Bạn đã tạo PR! PR của bạn sẽ được xem xét! Nice a day 😊",
    });

    //app.log.info(`PR Number: ${context.payload.pull_request.number}`);
    await context.octokit.issues.createComment(prComment);

    const files = await context.octokit.pulls.listFiles(
      context.pullRequest({ per_page: 100 })
    );

    //app.log.info(`Toàn bộ thông tin files.data: ${files}`);
    const changedFiles = files.data.map((file) => file.filename);
    //app.log.info(`Danh sách file thay đổi: ${changedFiles}`);

    const labelsToAdd: string[] = [];

    for (const file of changedFiles) {
      if (file.includes("docs/") && !labelsToAdd.includes("documentation")) {
        labelsToAdd.push("documentation");
      }
      if (file.includes("src/") && !labelsToAdd.includes("feature")) {
        labelsToAdd.push("feature");
      }
    }
    app.log.info(`Nhãn cần gắn: ${labelsToAdd}`);
    if (labelsToAdd.length > 0) {
      await context.octokit.issues.addLabels(
        context.issue({ labels: labelsToAdd }) // ✅ dùng "labels"
      );
      app.log.info(`Đã gắn nhãn ${labelsToAdd}`);
    }
    app.log.info(`Xong`);
  });

  // app.on("issue_comment.created", async (context) => {
  //   const comment = context.payload.comment.body;
  //   const repo = context.payload.repository;
  //   const issueNumber = context.payload.issue.number;

  //   // Kiểm tra xem comment có phải là lệnh "/ask"
  //   if (comment.startsWith("/ask")) {
  //     const question = comment.replace("/ask", "").trim();

  //     // Nếu người dùng không nhập câu hỏi
  //     if (!question) {
  //       await context.octokit.issues.createComment(
  //         context.issue({ body: "❌ **Bạn cần nhập câu hỏi sau lệnh /ask!**" })
  //       );
  //       return;
  //     }

  //     // Lấy nội dung PR
  //     const pr = await context.octokit.pulls.get({
  //       owner: repo.owner.login,
  //       repo: repo.name,
  //       pull_number: issueNumber,
  //     });

  //     const prContent = pr.data.body || "Không có mô tả PR.";

  //     // Lấy danh sách file thay đổi để cung cấp bối cảnh
  //     const { data: files } = await context.octokit.pulls.listFiles({
  //       owner: repo.owner.login,
  //       repo: repo.name,
  //       pull_number: issueNumber,
  //     });

  //     let codeDiffs = "";
  //     for (const file of files) {
  //       if (file.patch) {
  //         codeDiffs += `File: ${file.filename}\n${file.patch}\n\n`;
  //       }
  //     }

  //     // Gửi câu hỏi và thông tin PR đến OpenAI
  //     const aiResponse = await openai.chat.completions.create({
  //       model: "gpt-4o-mini",
  //       messages: [
  //         {
  //           role: "system",
  //           content: "Bạn là một trợ lý phân tích mã nguồn thông minh.",
  //         },
  //         {
  //           role: "user",
  //           content: `Nội dung PR:\n\n${prContent}\n\nCode thay đổi:\n${codeDiffs}\n\nCâu hỏi của người dùng: ${question}`,
  //         },
  //       ],
  //     });

  //     const botReply =
  //       aiResponse.choices[0]?.message?.content ||
  //       "Không thể trả lời câu hỏi này.";

  //     // Phản hồi lại người dùng
  //     await context.octokit.issues.createComment(
  //       context.issue({ body: `🤖 **Trả lời:** ${botReply}` })
  //     );

  //     app.log.info(
  //       `📌 Đã trả lời câu hỏi của người dùng trong PR #${issueNumber}.`
  //     );
  //   }
  // });

  //người dùng tạo issuess

  app.on("issue_comment.created", async (context) => {
    // cấp quyền
    if (!context.payload.issue.pull_request) return;

    app.log.info("issue comment");
    const commentBody = context.payload.comment.body.toLowerCase();
    if (commentBody.includes("rv code")) {
      await context.octokit.issues.createComment(
        context.issue({ body: "Đã ghi nhận yêu cầu review, sẽ phản hồi sớm." })
      );
    }
  });

  app.on("issues.opened", async (context) => {
    // const issueComment = context.issue({ body: "Cảm ơn bạn đã tạo issue!" });
    // await context.octokit.issues.createComment(issueComment);
    const issueBody = context.payload.issue.body?.toLowerCase() || "";
    if (issueBody.includes("bug")) {
      const issueLabel = context.issue({
        labels: ["bug"],
      });
      await context.octokit.issues.addLabels(issueLabel);
      app.log.info("Đã gắn nhãn bug cho issue");
    }
  });
};
