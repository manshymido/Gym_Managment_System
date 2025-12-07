import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB, { disconnectDB } from './config/database.js';

// Load environment variables
dotenv.config();

// Import routes
import adminAuthRoutes from './routes/admin/auth.js';
import adminGymManagerRoutes from './routes/admin/gymManagers.js';
import adminSubscriptionRoutes from './routes/admin/subscriptions.js';
import adminPlanRoutes from './routes/admin/plans.js';
import adminPaymentRoutes from './routes/admin/payments.js';

import gymAuthRoutes from './routes/gym/auth.js';
import gymMemberRoutes from './routes/gym/members.js';
import gymSubscriptionRoutes from './routes/gym/subscriptions.js';
import gymPaymentRoutes from './routes/gym/payments.js';
import gymAttendanceRoutes from './routes/gym/attendance.js';
import gymReportRoutes from './routes/gym/reports.js';
import gymMemberPlanRoutes from './routes/gym/memberPlans.js';

import stripePaymentRoutes from './routes/payment/stripe.js';
import paypalPaymentRoutes from './routes/payment/paypal.js';
import localPaymentRoutes from './routes/payment/local.js';

import publicPlanRoutes from './routes/public/plans.js';
import publicSubscriptionRoutes from './routes/public/subscriptions.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Compression middleware - يجب أن يكون قبل routes
app.use(compression());

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Short format for development
} else {
  app.use(morgan('combined')); // Apache combined format for production
}

// Security Headers using Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", process.env.NODE_ENV === 'development' ? "'unsafe-inline' 'unsafe-eval'" : "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https:"].concat(
        process.env.NODE_ENV === 'development' 
          ? ["http://localhost:3000", "http://localhost:5000", "ws://localhost:*"] 
          : []
      ),
    },
  },
  frameguard: {
    action: 'deny' // X-Frame-Options: DENY
  },
  xssFilter: true, // X-XSS-Protection: 1; mode=block (deprecated but still used)
  crossOriginEmbedderPolicy: false, // Allow embedding for development
}));

// Rate Limiting
// General API rate limiter - applies to all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
});

// Request Size Limits (configurable via environment variables)
const jsonLimit = process.env.REQUEST_SIZE_LIMIT_JSON || '10mb';
const urlEncodedLimit = process.env.REQUEST_SIZE_LIMIT_URLENCODED || '10mb';

app.use(express.json({ limit: jsonLimit }));
app.use(express.urlencoded({ extended: true, limit: urlEncodedLimit }));

// Request timeout middleware
// Set timeout for all requests (30 seconds default)
const requestTimeout = parseInt(process.env.REQUEST_TIMEOUT_MS) || 30000;

app.use((req, res, next) => {
  // Set timeout for the request
  req.setTimeout(requestTimeout, () => {
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        message: 'Request timeout'
      });
    }
  });
  
  next();
});

// Connect to MongoDB
connectDB();

// Apply general limiter to all API routes
app.use('/api/', apiLimiter);

// Apply stricter limiter to auth routes (before route definitions)
app.use('/api/admin/auth/login', authLimiter);
app.use('/api/admin/auth/register', authLimiter);
app.use('/api/gym/auth/login', authLimiter);
app.use('/api/gym/auth/register', authLimiter);

// Admin Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/gym-managers', adminGymManagerRoutes);
app.use('/api/admin/subscriptions', adminSubscriptionRoutes);
app.use('/api/admin/plans', adminPlanRoutes);
app.use('/api/admin/payments', adminPaymentRoutes);

// Gym Manager Routes
app.use('/api/gym/auth', gymAuthRoutes);
app.use('/api/gym/members', gymMemberRoutes);
app.use('/api/gym/subscriptions', gymSubscriptionRoutes);
app.use('/api/gym/payments', gymPaymentRoutes);
app.use('/api/gym/attendance', gymAttendanceRoutes);
app.use('/api/gym/reports', gymReportRoutes);
app.use('/api/gym/member-plans', gymMemberPlanRoutes);

// Payment Routes
app.use('/api/payment/stripe', stripePaymentRoutes);
app.use('/api/payment/paypal', paypalPaymentRoutes);
app.use('/api/payment/local', localPaymentRoutes);

// Public Routes (no authentication required)
app.use('/api/public/plans', publicPlanRoutes);
app.use('/api/public/subscribe', publicSubscriptionRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Gym Management System API',
    version: '1.0.0',
    endpoints: {
      admin: '/api/admin',
      gym: '/api/gym',
      health: '/api/health'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Handle Payload Too Large errors (413)
app.use((err, req, res, next) => {
  if (err.status === 413 || err.type === 'entity.too.large') {
    // Log the attempt for security monitoring
    console.warn(`⚠️  Payload Too Large Request: ${req.method} ${req.path} from ${req.ip}`);
    console.warn(`   Content-Type: ${req.get('Content-Type')}, Content-Length: ${req.get('Content-Length')}`);
    
    return res.status(413).json({
      success: false,
      message: 'Payload too large. Request body exceeds the maximum allowed size.',
      limit: err.limit || (req.get('Content-Type')?.includes('json') ? jsonLimit : urlEncodedLimit)
    });
  }
  next(err);
});

// Handle JSON parsing errors (e.g., when body is "null")
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // If JSON parsing failed (e.g., body was "null"), set body to empty object and continue
    req.body = {};
    return next();
  }
  // For other errors, pass to next error handler
  next(err);
});

// General error handler
app.use((err, req, res, next) => {
  // Log error details with more context
  const errorLog = {
    message: err.message,
    status: err.status || 500,
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  };

  // In development, include stack trace
  if (process.env.NODE_ENV === 'development') {
    errorLog.stack = err.stack;
    console.error('❌ Error Details:', errorLog);
  } else {
    // In production, log to console without sensitive data
    console.error('❌ Error:', {
      message: err.message,
      status: errorLog.status,
      path: errorLog.path,
      method: errorLog.method
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error response
  // في production: لا تعرض تفاصيل الخطأ للمستخدم
  // في development: اعرض تفاصيل أكثر للمساعدة في التطوير
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: errorLog
    })
  });
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 Server Started Successfully');
  console.log('='.repeat(50));
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(50) + '\n');
});

// Graceful Shutdown Handler
let isShuttingDown = false;

const gracefulShutdown = async (signal) => {
  // Prevent multiple shutdown attempts
  if (isShuttingDown) {
    console.log('⚠️  Shutdown already in progress...');
    return;
  }
  
  isShuttingDown = true;
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  // Set a timeout for forced shutdown
  const forceShutdownTimeout = setTimeout(() => {
    console.error('⚠️  Forcing shutdown after 10 seconds timeout');
    process.exit(1);
  }, 10000);
  
  try {
    // Stop accepting new requests
    server.close(async () => {
      console.log('✅ HTTP server closed');
      
      // Close database connection
      await disconnectDB();
      
      // Clear the force shutdown timeout
      clearTimeout(forceShutdownTimeout);
      
      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    });
    
    // If server.close doesn't complete, handle it
    server.on('close', async () => {
      await disconnectDB();
      clearTimeout(forceShutdownTimeout);
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    clearTimeout(forceShutdownTimeout);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

