// backend/src/db.js
const { Pool } = require('pg');

// Cấu hình kết nối, bạn có thể thay đổi theo biến môi trường
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;
