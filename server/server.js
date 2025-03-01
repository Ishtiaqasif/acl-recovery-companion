const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const config = require('./config/config');
const path = require('path');

// Route files
const authRoutes = require('./routes/auth.routes');
const progressRoutes = require('./routes/progress.routes');
const goalRoutes = require('./routes/goal.routes');
const postRoutes = require('./routes/post.routes');
const resourceRoutes = require('./routes/resource.routes');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/resources', resourceRoutes);

// Serve static assets in production
if (config.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../dist/magic')));

  // Any route that is not an API route should be handled by the Angular app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/magic/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong on the server'
  });
});

// Start server
const PORT = config.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});