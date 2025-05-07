// Hàm tạo prompt cho OpenAI để gán nhãn
export function buildLabelPrompt(content: string, labels: string[]): string {
    return `
      You are a helpful assistant. Review the issue content: ${content}
      and label it appropriately from these labels: ${labels.join(", ")}.
      Return only the suitable label, no explanation.
    `.trim();
  }