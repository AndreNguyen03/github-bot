import { OpenAI } from "openai"; // Import OpenAI client

// Khởi tạo đối tượng OpenAI với API key của bạn
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Thay bằng API key thực tế của bạn
});

export async function summaryCodeChanges(
  filename: string,
  patch: string
): Promise<string> {
  // Xây dựng prompt yêu cầu AI đánh giá các thay đổi mã nguồn
  const prompt = `
  Bạn là một chuyên gia review code giàu kinh nghiệm. Hãy phân tích các thay đổi code sau trong file "${filename}" và cung cấp:

  1. TÓM TẮT NGẮN GỌN (1-2 câu): Tóm tắt mục đích chính của thay đổi này
  2. CÁC THAY ĐỔI CHÍNH: Liệt kê 3-5 thay đổi quan trọng nhất
  3. LỢI ÍCH: Những cải thiện mà thay đổi này mang lại
  4. RỦI RO (nếu có): Các vấn đề tiềm ẩn cần lưu ý
  5. ĐỀ XUẤT (nếu có): Gợi ý cải thiện thêm

  Hãy viết bằng tiếng Việt, ngắn gọn và dễ hiểu. Nếu thay đổi quá nhỏ hoặc đơn giản, chỉ cần cung cấp tóm tắt và bất kỳ đề xuất nào.

  Đây là nội dung thay đổi:s
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
