const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet());

// CORS config
const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public health check route (used by AWS Application Load Balancer health checking)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// App routes
app.use('/auth', authRoutes);
app.use('/files', fileRoutes);
app.use('/users', userRoutes);

// Root route welcome
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CloudDrive SaaS API' });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Server startup
app.listen(PORT, '0.0.0.0', () => {
  console.log(`========================================`);
  console.log(`  CloudDrive API Server Running`);
  console.log(`  Port:        ${PORT}`);
  console.log(`  Environment: ${NODE_ENV}`);
  console.log(`  CORS Origin: ${corsOrigin}`);
  console.log(`========================================`);
});

