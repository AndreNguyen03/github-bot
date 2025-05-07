import { Context } from "probot";
import { BotConfig } from "../interface/bot-config.js";
import * as yaml from 'js-yaml'

export async function getConfigFromRepo(
  context: Context,
  owner: string,
  repo: string
): Promise<BotConfig | null> {
  try {
    const response = await context.octokit.repos.getContent({
      owner,
      repo,
      path: ".github/config.yml",
    });

    // Kiểm tra xem response.data là file hay thư mục
    if (Array.isArray(response.data)) {
      context.log.error(
        `Error: .github/config.yml is a directory in ${owner}/${repo}`
      );
      return null;
    }

    // Đảm bảo response.data là file và có content
    if (!("content" in response.data)) {
      context.log.error(
        `Error: .github/config.yml has no content in ${owner}/${repo}`
      );
      return null;
    }

    const content = Buffer.from(response.data.content, "base64").toString();
    return yaml.load(content) as BotConfig;
  } catch (error) {
    context.log.error(`Error reading config.yml in ${owner}/${repo}: ${error}`);
    return null;
  }
}
