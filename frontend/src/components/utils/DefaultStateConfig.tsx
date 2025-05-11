import { UIConfigState } from "../../types";

export const defaultUIConfig: UIConfigState = {
  autoLabelIssue: false,
  autoLabelPullRequest: false,

  assign: false,

  welcomeCommentIssueEnabled: false,
  welcomeCommentIssueMessage: "",
  welcomeCommentPullRequestEnabled: false,
  welcomeCommentPullRequestMessage: "",

  prSummaryEnabled: false,

  discordEnabled: false,
};
