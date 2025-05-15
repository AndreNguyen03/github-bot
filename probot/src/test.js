import { Octokit } from "@octokit/rest";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();


const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = "AndreNguyen03";
const repo = "ecommerce-backend-learn";
const path = ".github/github-bot-config.yml";
const branch = "main";

// Đọc file và mã hóa base64
const content = fs.readFileSync("config.yml", "utf8");
const encodedContent = Buffer.from(content).toString("base64");

async function pushFile() {
  try {
    // Kiểm tra xem file đã tồn tại chưa (để lấy sha nếu cần)
    let sha = undefined;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });
      sha = data.sha;
    } catch (err) {
      // Nếu 404 thì file chưa tồn tại, không cần sha
      if (err.status !== 404) throw err;
    }

    // Gửi request PUT
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: "Add or update github-bot-config.yml",
      content: encodedContent,
      branch,
      sha,
    });

    console.log("✅ File pushed successfully.");
  } catch (err) {
    console.error("❌ Error pushing file:", err.message);
  }
}

pushFile();
