// backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('cookie-session');
const app = express();
const port = process.env.PORT || 5000;

// Middleware configuration:
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
})); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(session({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'default-secret'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Mount authentication routes:
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


// Mount Admin Routes
const adminGameControl = require('./routes/adminGameControl');
const adminDashboard = require('./routes/adminDashboard');
const adminTeams = require('./routes/adminTeams');
const adminStages = require('./routes/adminStages');
const adminQuestions = require('./routes/adminQuestions');

app.use('/api/admin/game-control', adminGameControl);
app.use('/api/admin/dashboard', adminDashboard);
app.use('/api/admin/teams', adminTeams);
app.use('/api/admin/stages', adminStages);
app.use('/api/admin/questions', adminQuestions);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});