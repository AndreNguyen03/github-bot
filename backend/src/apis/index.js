const passport = require("passport");

function api(app) {
  // 👉 Route GitHub login
  app.get(
    "/auth/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );

  // 👉 Callback từ GitHub
  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("http://localhost:5173");
    }
  );

  // app.get("/api/installations", async (req, res) => {
  //   try {
  //     const { Octokit } = await import("@octokit/rest");
  //     const { createAppAuth } = await import("@octokit/auth-app");
  //     const octokit = new Octokit({
  //       authStrategy: createAppAuth,
  //       auth: {
  //         appId: process.env.APP_ID,
  //         privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  //       },
  //     });
  //     const response = await octokit.request("GET /app/installations");
  //     res.json(response.data[0].id);
  //   } catch (err) {
  //     console.error("Error fetching installations", err);
  //     res.status(500).json({ error: err.message });
  //   }
  // });

  app.get("/api/installations/repositories", async (req, res) => {
    try {
      const { Octokit } = await import("@octokit/rest");
      const { createAppAuth } = await import("@octokit/auth-app");

      const octokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
          appId: process.env.APP_ID,
          privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
        },
      });

      // Installation ID được cung cấp (hoặc lấy từ query parameter)
      const responseInstallationList = await octokit.request(
        "GET /app/installations"
      );
      //lấy installationId từ response đầu tiên là install trên áy hiện tại của người này
      const installationId = responseInstallationList.data[0].id;

      // Lấy token truy cập cho installation này
      const authResponse = await octokit.request(
        `POST /app/installations/${installationId}/access_tokens`
      );
      const installationAccessToken = authResponse.data.token; // Token truy cập của installation
      console.log("Token truy cập của installation:", installationAccessToken);
      // Tạo một Octokit mới với token của installation
      const octokitWithAuth = new Octokit({
        auth: installationAccessToken,
      });

      // Lấy danh sách repositories của installation
      const response = await octokitWithAuth.request(
        `GET /installation/repositories`,
        {
          installation_id: installationId,
        }
      );

      // Trả về danh sách repositories
      res.json(response.data);
    } catch (err) {
      console.error("Error fetching repositories", err);
      res.status(500).json({ error: err.message });
    }
  });

  // 👉 API trả user hiện tại
  app.get("/api/user", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }
    res.json(req.user);
  });

  //👉 Logout
  app.post("/auth/logout", (req, res) => {
    // Xóa session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi hủy session" });
      }
      // Xóa cookie trên client
      res.clearCookie("connect.sid", {
        path: "/",
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
      });
      res.json({ message: "Đã logout" });
    });
  });
}

module.exports = api;
