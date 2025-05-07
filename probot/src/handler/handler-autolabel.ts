import { Context, Probot } from "probot";
import { buildLabelPrompt } from "../utils/build-label-prompt.js";
import OpenAI from "openai";

export async function handleAutoLabel(context:Context<'issues.opened'>, app:Probot, config: any, openai:OpenAI) {

    const { issue } = context.payload;
    const issueNumber = issue.number;

    if(!issue.body) return;

    try {
        const prompt = buildLabelPrompt(
          issue.body.toLowerCase(),
          config.auto_label.issue.labels
        );
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful code review assistant.",
            },
            { role: "user", content: prompt },
          ],
        });
        const label = response.choices[0].message.content?.trim();
        if (label) {
          await context.octokit.issues.addLabels(
            context.issue({ labels: [label] })
          );
          app.log.info(`Added label "${label}" to issue #${issueNumber}`);
        }
      } catch (error) {
        app.log.error(`Error labeling issue #${issueNumber}: ${error}`);
      }
}