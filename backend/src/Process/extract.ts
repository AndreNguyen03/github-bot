type Block = {
  lines: string[]; // nội dung block
  startIndex: number; // dòng đầu tiên trong toàn bộ patch
};

export function extractContextualBlocks(patch: string): Block[] {
  const lines = patch.split("\n");
  const blocks: Block[] = [];

  let currentBlock: string[] = [];
  let startIndex = -1;
  let isInRelevantBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("@@")) {
      // metadata: ngắt mọi khối
      if (currentBlock.length > 0 && isInRelevantBlock) {
        blocks.push({ lines: [...currentBlock], startIndex });
      }
      currentBlock = [line];
      startIndex = i;
      isInRelevantBlock = false;
      continue;
    }

    if (line.startsWith("+") && !line.startsWith("+++")) {
      if (currentBlock.length === 0) {
        startIndex = i;
      }
      currentBlock.push(line);
      isInRelevantBlock = true;
    } else if (
      line.startsWith("-") ||
      line.startsWith(" ") ||
      line.trim() === ""
    ) {
      if (isInRelevantBlock || currentBlock.length > 0) {
        currentBlock.push(line);
      }
    } else {
      // dòng không liên quan, kết thúc block nếu có
      if (currentBlock.length > 0 && isInRelevantBlock) {
        blocks.push({ lines: [...currentBlock], startIndex });
      }
      currentBlock = [];
      isInRelevantBlock = false;
      startIndex = -1;
    }
  }

  // Đẩy khối cuối cùng nếu còn
  if (currentBlock.length > 0 && isInRelevantBlock) {
    blocks.push({ lines: [...currentBlock], startIndex });
  }

  return blocks;
}
