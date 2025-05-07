import { Context, Probot } from "probot";
import { getCommitSummaries } from "../utils/get-commit-summaries.js";
import { buildAssigneePrompt } from "../utils/build-assignee-prompt.js";
import OpenAI from "openai";

export async function handleAutoAssign(context:Context<'issues.opened'>, app: Probot, openai:OpenAI) {

    const { issue, repository } = context.payload;
    const owner = repository.owner.login;
    const repo = repository.name;
    const issueNumber = issue.number;

    if(!issue.body) return;

    try {
        const commits = await getCommitSummaries(context, owner, repo);
        const authors = new Set(commits.map((c) => c.author));

        if (authors.size === 1) {
          const [onlyAuthor] = authors;
          await context.octokit.issues.addAssignees(
            context.issue({ assignees: [onlyAuthor] })
          );
          app.log.info(
            `Assigned issue #${issueNumber} to @${onlyAuthor} (only contributor)`
          );
        } else if (commits.length > 0) {
          const prompt = buildAssigneePrompt(issue.title, issue.body, commits);
          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
          });
          const assignee = response.choices[0].message.content
            ?.trim()
            .replace("@", "");
          if (assignee) {
            await context.octokit.issues.addAssignees(
              context.issue({ assignees: [assignee] })
            );
            app.log.info(`Assigned issue #${issueNumber} to @${assignee}`);
          }
        }
      } catch (error) {
        app.log.error(`Error assigning issue #${issueNumber}: ${error}`);
      }
}