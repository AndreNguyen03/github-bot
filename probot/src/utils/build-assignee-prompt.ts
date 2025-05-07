import { CommitSummary } from "../interface/commit-summary.js";

export function buildAssigneePrompt(
    title: string,
    body: string,
    commits: CommitSummary[]
  ): string {
    const formattedCommits = commits.map(
      (c) => `Author: ${c.author}\nMessage: ${c.message}\nFiles: ${c.files}`
    );
    return `
      You are a helpful assistant for a GitHub repository.
      Given the issue and recent commits, identify the most relevant developer to assign this issue to.
      Consider commit authors, their recent changes, and files they worked on.
      
      Issue:
      Title: ${title}
      Body: ${body}
      
      Recent Commits:
      ${formattedCommits.join("\n\n")}
      
      Reply with the GitHub username (e.g., @alice) of the best-suited developer.
    `.trim();
  }