import { OpenAI } from "openai"; // Import OpenAI client

// Khởi tạo đối tượng OpenAI với API key của bạn
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Thay bằng API key thực tế của bạn
});

export async function generateAIReview(
  filename: string,
  patch: string
): Promise<string> {
  // Xây dựng prompt yêu cầu AI đánh giá các thay đổi mã nguồn
  const prompt = `
  You are a code review assistant. Please review the following code changes in the file: ${filename}.
  Provide constructive feedback, including:
  - Potential bugs or security issues
  - Code quality improvements
  - Best practices or performance optimizations
  
  Here is the patch:
  \`\`\`diff
  ${patch}
  \`\`\`
  `;

  try {
    // Gọi API Chat completions để nhận phản hồi từ OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful code review assistant." },
        { role: "user", content: prompt },
      ],
    });

    // Trả về nội dung phản hồi từ AI
    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating AI review:", error);
    throw new Error("Failed to generate AI review.");
  }
}
