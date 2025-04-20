export function findFirstPlusLinePosition(
  patchLines: string[],
  blockStartIndex: number
): number {
  let position = 0;
  for (let i = 0; i <= blockStartIndex; i++) {
    const line = patchLines[i];
    if (
      line.startsWith("+") ||
      line.startsWith("-") ||
      line.startsWith(" ") ||
      line.startsWith("@@")
    ) {
      position++;
    }
  }
  return position;
}
