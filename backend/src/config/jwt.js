require("dotenv").config();

const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  expiresIn: "1d", // 1 ngày
  algorithm: "HS256"
};

module.exports = JWT_CONFIG;