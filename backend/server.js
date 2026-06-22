const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const contributionRoutes = require('./routes/contributions');
const updateRoutes = require('./routes/updates');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/updates", updateRoutes);
// Test route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Crowdfunding API is running'
  });
});
app.get("/", (req, res) => {
  res.send("Crowdfunding API is running...");
});
// MongoDB Connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
}

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});