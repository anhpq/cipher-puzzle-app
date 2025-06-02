// backend/src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();

// Middleware: enable CORS and JSON body parsing
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://cipher-puzzle-app.vercel.app"
        : true,
    credentials: true,
  })
);
app.use(express.json());

// Configure express-session with a maximum age of 2 days (in milliseconds)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      secure: process.env.NODE_ENV === "production", // Bắt buộc dùng HTTPS khi production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cho phép cross-origin cookie
    },
  })
);

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
