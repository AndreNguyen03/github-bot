import passport from "passport";
import installationEndpoint from "./installation.js";
import repositoryControler from "../controller/RepositoryController.js";
export default function api(app) {
  // 👉 Route GitHub login
  app.get("/auth/github", passport.authenticate("github", { scope: ["repo"] }));

  // 👉 Callback từ GitHub
  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("http://localhost:5173");
    }
  );

  //xem bot có thể handle những repository nào
  app.get("/api/installations", installationEndpoint);

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
  app.get("/api/user/repositories", repositoryControler.getRepositories);
}
