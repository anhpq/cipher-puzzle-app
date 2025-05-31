// backend/src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();

// Middleware: enable CORS and JSON body parsing
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Configure express-session with a maximum age of 2 days (in milliseconds)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 24 * 60 * 60 * 1000 }, // 2 days
  })
);

// Load routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const supportRouter = require('./routes/support');
app.use('/api/admin/support', supportRouter);


const reportsRouter = require('./routes/reports');
app.use('/api/admin/reports', reportsRouter);

const stagesRoutes = require('./routes/stages');
app.use('/api/admin/stages', stagesRoutes);

const teamsRoutes = require('./routes/teams');
app.use('/api/admin/teams', teamsRoutes);

const questionsRoutes = require('./routes/questions');
app.use('/api/admin/questions', questionsRoutes);

const teamRoutesRouter = require('./routes/teamRoutes');
app.use('/api/admin/team-routes', teamRoutesRouter);

app.get('/', (req, res) => {
  res.send('Cipher Puzzle Game API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
