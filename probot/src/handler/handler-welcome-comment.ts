import { Context, Probot } from "probot";

export async function handleWelcomeComment(
  context: Context<"issues.opened">,
  app: Probot,
  config: any
) {
  const { issue } = context.payload;
  const issueNumber = issue.number;
  await context.octokit.issues.createComment(
    context.issue({ body: config.welcome_comment.issue.message })
  );
  app.log.info(`Sent welcome comment to issue #${issueNumber}`);
}
