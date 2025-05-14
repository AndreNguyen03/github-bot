import { BotInfo } from "../../types";
interface BotInforProps {
  bot: BotInfo | undefined;
}
export default function BotInfoComponent({ bot }: BotInforProps) {
  if (!bot || Object.keys(bot).length === 0) return;
  return (
    <div className="rounded-xl border bg-white p-4 shadow-md">
      <h2 className="mb-2 text-xl font-semibold">🤖 Bot của bạn</h2>
      <p>
        <strong>Tên Bot:</strong> {bot?.githubAppName}
      </p>
      <p>
        <strong>Slug:</strong> {bot?.githubAppSlug}
      </p>
      <p>
        <strong>Chủ sở hữu:</strong> {bot?.user.username}
      </p>
      <p>
        <strong>App ID:</strong> {bot?.githubAppId}
      </p>
      <p>
        <strong>Ngày tạo:</strong>{" "}
        {new Date(bot?.createdAt || "undefined").toLocaleString()}
      </p>
      <p>
        <strong>Cập nhật gần nhất:</strong>{" "}
        {new Date(bot?.updatedAt || "undefined").toLocaleString()}
      </p>
    </div>
  );
}
