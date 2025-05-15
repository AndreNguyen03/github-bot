import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
class BotController {
  async pushConfigFileToGithub(req, res) {
    const {
      accessToken,
      repoOwnerName,
      repoName,
      yamlContent,
      filePath,
      branch,
    } = req.body;
    console.log(req.body);
    // Kiểm tra thiếu tham số
    if (
      !accessToken ||
      !repoOwnerName ||
      !repoName ||
      !yamlContent ||
      !filePath ||
      !branch
    ) {
      return res.status(400).json({ message: "Thiếu tham số cần thiết." });
    }
    const octokit = new Octokit({ auth: accessToken });
    const contentEncoded = Buffer.from(yamlContent).toString("base64");
    let sha;

    try {
      // Kiểm tra xem file đã tồn tại để lấy SHA (nếu có)
      try {
        const { data: fileData } = await octokit.repos.getContent({
          owner: repoOwnerName,
          repo: repoName,
          path: filePath,
          ref: branch,
        });

        if (!Array.isArray(fileData) && fileData.sha) {
          sha = fileData.sha;
        }
      } catch (err) {
        if (err.status !== 404) {
        }
        // Nếu là 404 thì tiếp tục, coi như file chưa tồn tại
      }

      // Encode nội dung YAML sang Base64
      // Push hoặc cập nhật file
      const result = await octokit.repos.createOrUpdateFileContents({
        owner: repoOwnerName,
        repo: repoName,
        path: filePath,
        message: "Update file .github/bot-config.yml",
        content: contentEncoded,
        branch: branch,
        sha,
      });
      console.log("tôiisd");
      console.log(result);
      const status = result.status;
      if (status === 200 || status === 201) {
        return res.status(200).json({
          isSuccess: true,
          message: "✅ File pushed to GitHub thành công.",
        });
      } else {
        return res.status(500).json({ error: "❌ Push file thất bại." });
      }
    } catch (err) {
      // Xử lý lỗi từ GitHub API
      switch (err.status) {
        case 401:
          return res.status(401).json({
            error: "⚠️ Unauthorized: Token không hợp lệ hoặc đã hết hạn.",
          });
        case 403:
          return res.status(403).json({
            error: "🚫 Forbidden: Không có quyền ghi vào repository.",
          });
        case 404:
          return res
            .status(404)
            .json({ error: "❓ Not Found: Không tìm thấy file hoặc branch." });
        default:
          return res
            .status(404)
            .json({ error: `❌ GitHub API Error: ${err.message}` });
      }
    }
  }
}

export default new BotController();
