import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export async function scanIssueFormat(
  issueTitle: string,
  issueBody: string | null,
  promptPattern: string
): Promise<{
  isValid: boolean;
  feedback: string;
}> {
  const prompt = `
  Bạn là một trợ lý QA chuyên đánh giá nội dung issue trên GitHub.
  
  Người dùng đã tạo một issue với nội dung như sau:
  
  ---
  Tiêu đề: ${issueTitle}
  
  Nội dung:
  ${issueBody}
  ---
   ${promptPattern}
  ---
  
  Nếu issue hợp lệ, hãy trả lời:\n
  - VALID: true\n
  - FEEDBACK: [Không cần phản hồi thêm]\n
  
  Nếu issue không hợp lệ, hãy trả lời:\n
  - VALID: false\n
  - FEEDBACK: Đưa ra phản hồi cụ thể cho người dùng: thiếu mục nào, cần bổ sung gì.\n
  
  Chỉ phản hồi theo đúng định dạng:
  {VALID: true/false,
  FEEDBACK: [nội dung phản hồi]}
  `;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful QA assistant for GitHub issues.",
        },
        { role: "user", content: prompt },
      ],
    });

    const content = response.choices[0].message.content || "";

    const validMatch = content.match(/VALID:\s*(true|false)/i);
    const feedbackMatch = content.match(/FEEDBACK:\s*([\s\S]*)/i);

    const isValid = validMatch?.[1].toLowerCase() === "true";
    const feedback = feedbackMatch?.[1]?.trim() || "Không có phản hồi.";

    return { isValid, feedback };
  } catch (error) {
    console.error("Error validating issue format:", error);
    throw new Error("Failed to validate issue format.");
  }
}
