const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();
require("./auth/github");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
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
  res.json(req.user || null);
});

// 👉 Logout
app.post("/auth/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Đã logout" });
  });
});

app.listen(3001, () => {
  console.log("✅ Backend chạy tại http://localhost:3001");
});
