import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import hostRoutes from './routes/hostRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Dynamic CORS configuration for production and local development
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman, health checkers)
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    // Allow any Vercel preview/production deployment or Render domains
    if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com') || origin.endsWith('.netlify.app')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'API is running'
  });
});

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Property Rental Marketplace API',
    status: 'online',
    healthCheck: '/api/health',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      favorites: '/api/favorites',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
      host: '/api/host',
      admin: '/api/admin',
    }
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Resource not found'
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack || err.message);

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      error: `Duplicate value for ${field}. A record with this ${field} already exists.`,
    });
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: messages.join(', '),
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(404).json({
      error: 'Resource not found (invalid ID format)',
    });
  }

  // Handle Mongoose disconnected buffering error
  if (err.message && err.message.includes('buffering timed out')) {
    return res.status(503).json({
      error: 'Database unavailable: MONGODB_URI is not connected. Please verify your MongoDB Atlas cluster settings.',
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
