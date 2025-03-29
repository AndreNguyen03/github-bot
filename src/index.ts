import { Probot } from "probot";

export default (app: Probot) => {
  app.on("pull_request.opened", async (context) => {
    console.log("Bot nhận sự kiện PR");
    const issueComment = context.issue({
      body: "Thanks for opening your first PR!",
    });
    await context.octokit.issues.createComment(issueComment);
  });

};
