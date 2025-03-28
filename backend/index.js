const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./database/database');
const analyticsRoutes = require('./routes/analyticsRoutes');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();

// API routes
app.use("/api/analytics", analyticsRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});