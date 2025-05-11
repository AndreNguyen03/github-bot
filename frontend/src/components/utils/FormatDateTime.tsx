export function formatDateTime(isoString: string): string {
  if (!isoString) {
    return "Invalid date";
  }

  let date;
  try {
    date = new Date(isoString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
  } catch {
    return "Invalid date";
  }
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng tính từ 0
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
