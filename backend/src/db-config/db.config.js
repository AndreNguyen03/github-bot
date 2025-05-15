// config/db.config.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.1jlcl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  mongoose
    .connect(dbUri)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Could not connect to MongoDB", err);
      process.exit(1); // Dừng ứng dụng nếu không thể kết nối
    });
};
module.exports = connectDB;
