import { OpenAI } from "openai"; // Import OpenAI client

// Khởi tạo đối tượng OpenAI với API key của bạn
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Thay bằng API key thực tế của bạn
});

// export async function generateAIReview2(
//   filename: string,
//   patch: string
// ): Promise<string> {
//   // Xây dựng prompt yêu cầu AI đánh giá các thay đổi mã nguồn
//   const prompt = `
//   You are a code review assistant. Please review the following code changes in the file: ${filename}.
//   Provide constructive feedback, including:
//   - Potential bugs or security issues
//   - Code quality improvements
//   - Best practices or performance optimizations
  
//   Here is the patch:
//   \`\`\`diff
//   ${patch}
//   \`\`\`
//   `;

//   try {
//     // Gọi API Chat completions để nhận phản hồi từ OpenAI
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are a helpful code review assistant." },
//         { role: "user", content: prompt },
//       ],
//     });

//     // Trả về nội dung phản hồi từ AI
//     return response.choices[0].message.content || "";
//   } catch (error) {
//     console.error("Error generating AI review:", error);
//     throw new Error("Failed to generate AI review.");
//   }
// }

export async function generateAIReview(content: string, filename: string, status: string): Promise<string> {
  let prompt = '';

  if (status === 'added') {
    prompt = `
Bạn là một code reviewer chuyên nghiệp. Một lập trình viên vừa thêm một file mới có tên \`${filename}\`. Dưới đây là toàn bộ nội dung file:

<code>
${content}
</code>

Hãy:
- Nhận xét về tổ chức code, logic, biến, cấu trúc hàm, hiệu suất, lỗi tiềm ẩn.
- Gợi ý cải thiện nếu cần.
- Đánh giá tổng thể.
- Trả về kết quả body ngắn gọn nhất khoảng 100-200 chữ thôi

trả về kết quả theo format:
{
  summary: "Code looks clean overall but has minor issues.",
  shouldRequestChanges: false, // hoặc true
  comments: [
    {
      path: "src/example.ts",
      line: 10,
      body: "Consider renaming this variable for clarity."
    },
    ...
  ]
}`;

  } else if (status === 'modified') {
    prompt = `
Bạn là một code reviewer giàu kinh nghiệm. File \`${filename}\` đã được sửa đổi. Dưới đây là phần diff của các thay đổi:

<diff>
${content}
</diff>

Hãy:
- Đánh giá các thay đổi.
- Góp ý nếu có vấn đề về logic, hiệu suất, readability.
- Phản hồi ngắn gọn nếu thay đổi tốt.
- Trả về kết quả ngắn gọn nhất khoảng 100 chữ thôi

trả về kết quả theo format:
{
  summary: "Code looks clean overall but has minor issues.",
  shouldRequestChanges: false, // hoặc true
  comments: [
    {
      path: "src/example.ts",
      line: 10,
      body: "Consider renaming this variable for clarity."
    },
    ...
  ]
}
`;
  }

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
