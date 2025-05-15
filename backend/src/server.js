const express = require("express");
const session = require("express-session");
const api = require("./apis/index");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();
require("./auth/github");
const connectDB = require("./db-config/db.config.js");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      name: "connect.sid",
      path: "/",
      secure: false, // BẮT BUỘC để dùng với http://localhost
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 tiếng (hoặc tùy)
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

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

// 👉 API trả user hiện tại
app.get("/api/user", (req, res) => {
  if (!req.user) {
    return res.json({ message: "Chưa đăng nhập" });
  }
  res.json(req.user);
});

// 👉 Logout
app.post("/auth/logout", (req, res) => {
  console.log("Trước khi logout:", req.session);

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

api(app);

connectDB().then(() => {
  app.listen(3001, () => {
    console.log("✅ Backend chạy tại http://localhost:3001");
  });
});
