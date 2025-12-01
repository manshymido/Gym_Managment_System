import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

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

// Security Headers
app.use((req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy - Allow unsafe-eval only in development
  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
    );
  } else {
    // In development, allow unsafe-eval for Vite HMR and Chrome DevTools
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:3000 http://localhost:5000 ws://localhost:3000 ws://localhost:* https: chrome-extension:;"
    );
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

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
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

