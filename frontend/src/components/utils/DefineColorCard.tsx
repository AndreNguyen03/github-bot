export default function defineColorCard(
  hasBotConfig: boolean,
  hasAccessiblePermissionBot: boolean,
) {
  const condition = `${hasBotConfig}-${hasAccessiblePermissionBot}`;
  switch (condition) {
    case "true-true":
      return "green";
    case "true-false":
      return "red";
    default:
      return "gray";
  }
}
