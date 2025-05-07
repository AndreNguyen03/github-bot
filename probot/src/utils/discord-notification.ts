import { EmbedBuilder, WebhookClient } from "discord.js";

export async function sendDiscordNotification(
  webhookUrl: string,
  message: string,
  embedTitle: string,
  embedUrl?: string
): Promise<void> {
  try {
    const webhookClient = new WebhookClient({ url: webhookUrl });
    const embed = new EmbedBuilder()
      .setTitle(embedTitle)
      .setDescription(message)
      .setColor(0x00ff00)
      .setTimestamp();

    if (embedUrl) {
      embed.setURL(embedUrl);
    }

    await webhookClient.send({ embeds: [embed] });
  } catch (error) {}
}