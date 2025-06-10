// server/app.js - Updated version with JWT authentication
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware: enable CORS and JSON body parsing
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cipher-puzzle-app.vercel.app",
      "https://cipher-puzzle-frontend.up.railway.app",
      "https://cipher-puzzle-app.onrender.com",
    ],
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Request logging middleware (optional)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Import authentication middleware
const { 
  authenticateToken, 
  requireAdmin, 
  requireTeam, 
  requireAuth,
  checkTeamOwnership 
} = require("./middleware/auth");

// ==================== PUBLIC ROUTES ====================
// Authentication routes (login, logout, verify, refresh)
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// ==================== ADMIN PROTECTED ROUTES ====================
// All admin routes require authentication + admin role
const assignmentRoutes = require("./routes/admin/assignments");
app.use("/api/admin/assignments", authenticateToken, requireAdmin, assignmentRoutes);

const supportRouter = require("./routes/admin/support");
app.use("/api/admin/support", authenticateToken, requireAdmin, supportRouter);

const reportsRouter = require("./routes/admin/reports");
app.use("/api/admin/reports", authenticateToken, requireAdmin, reportsRouter);

const stagesRoutes = require("./routes/admin/stages");
app.use("/api/admin/stages", authenticateToken, requireAdmin, stagesRoutes);

const teamsRoutes = require("./routes/admin/teams");
app.use("/api/admin/teams", authenticateToken, requireAdmin, teamsRoutes);

const questionsRoutes = require("./routes/admin/questions");
app.use("/api/admin/questions", authenticateToken, requireAdmin, questionsRoutes);

const teamRoutesRouter = require("./routes/admin/teamRoutes");
app.use("/api/admin/team-routes", authenticateToken, requireAdmin, teamRoutesRouter);

// ==================== TEAM PROTECTED ROUTES ====================
// All team routes require authentication + team role + ownership check
const teamProgressRouter = require("./routes/team/teamProgress");
app.use("/api/team-progress", authenticateToken, requireTeam, checkTeamOwnership, teamProgressRouter);

const teamInfoRouter = require("./routes/team/teamInfo");
app.use("/api/team-info", authenticateToken, requireTeam, checkTeamOwnership, teamInfoRouter);

// ==================== MIXED ACCESS ROUTES ====================
// Routes that both admin and team can access (with proper permissions)
// Example: app.use("/api/shared", authenticateToken, requireAuth, sharedRoutes);

// ==================== HEALTH CHECK ====================
app.get("/", (req, res) => {
  res.json({
    message: "Cipher Puzzle Game API is running!",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    status: "healthy"
  });
});

// API status endpoint
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

// ==================== ERROR HANDLING ====================
// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    code: "ROUTE_NOT_FOUND",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', {
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
  
  // JWT specific errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: 'Invalid token format',
      code: 'INVALID_TOKEN'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      error: 'Token has expired',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.message
    });
  }

  // Database errors
  if (err.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({ 
      error: 'Duplicate entry',
      code: 'DUPLICATE_ENTRY'
    });
  }

  // Default server error
  res.status(500).json({ 
    error: 'Internal server error',
    code: 'SERVER_ERROR',
    timestamp: new Date().toISOString()
  });
});

// ==================== SERVER STARTUP ====================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT Authentication: Enabled (1 day expiry)`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;