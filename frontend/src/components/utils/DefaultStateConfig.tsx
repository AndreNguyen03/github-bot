import { UIConfigState } from "../../types";

export const defaultUIConfig: UIConfigState = {
  autoLabelIssue: true,
  autoLabelPullRequest: true,

  assign: false,

  welcomeCommentIssueEnabled: false,
  welcomeCommentIssueMessage: "",
  welcomeCommentPullRequestEnabled: true,
  welcomeCommentPullRequestMessage: "",

  prSummaryEnabled: false,

  discordEnabled: true,
  discordLabel: "",
};
