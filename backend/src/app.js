// backend/src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const pg = require("pg");
const PgSession = require("connect-pg-simple")(session);

const app = express();

// Middleware: enable CORS and JSON body parsing
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cipher-puzzle-frontend.up.railway.app",
      "https://cipher-puzzle-app.vercel.app", // nếu vẫn deploy song song trên Vercel
    ],
    credentials: true,
  })
);
app.use(express.json());

// Tạo pool kết nối Postgres
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, // URL hoặc chuỗi kết nối DB của bạn
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false, // nếu dùng SSL trên prod
});

console.log("trust proxy");
app.set("trust proxy", 1);

console.log("Postgres pool created");
// Configure express-session with a maximum age of 2 days (in milliseconds)
app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      tableName: "session",
    }),
    name: "connect.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  console.log("🧪 Incoming cookie:", req.headers.cookie);
  next();
});

// Load routes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

const assignmentRoutes = require("./routes/admin/assignments");
app.use("/api/admin/assignments", assignmentRoutes);

const supportRouter = require("./routes/admin/support");
app.use("/api/admin/support", supportRouter);

const reportsRouter = require("./routes/admin/reports");
app.use("/api/admin/reports", reportsRouter);

const stagesRoutes = require("./routes/admin/stages");
app.use("/api/admin/stages", stagesRoutes);

const teamsRoutes = require("./routes/admin/teams");
app.use("/api/admin/teams", teamsRoutes);

const questionsRoutes = require("./routes/admin/questions");
app.use("/api/admin/questions", questionsRoutes);

const teamRoutesRouter = require("./routes/admin/teamRoutes");
app.use("/api/admin/team-routes", teamRoutesRouter);

const teamProgressRouter = require("./routes/team/teamProgress");
app.use("/api/team-progress", teamProgressRouter);

const teamInfoRouter = require("./routes/team/teamInfo");
app.use("/api/team-info", teamInfoRouter);

app.get("/", (req, res) => {
  res.send("Cipher Puzzle Game API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// route test login dummy (login giả)
app.post("/api/test-login", (req, res) => {
  req.session.admin = true; // hoặc req.session.user = 'admin'
  res.json({ message: "Logged in", sessionID: req.sessionID });
});

// route test verify session
app.get("/api/test-verify", (req, res) => {
  console.log("🔐 Session ID verify:", req.sessionID);
  console.log("🔐 Session content:", req.session);
  res.json({
    isAuthenticated: !!req.session.admin,
    sessionID: req.sessionID,
    session: req.session,
  });
});
