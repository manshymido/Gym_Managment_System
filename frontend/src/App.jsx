import React, { Suspense, lazy, useTransition } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ToastContainer from './components/common/Toast';
import LoadingSpinner from './components/common/LoadingSpinner';

// Home Page - loaded immediately
import Home from './pages/Home';
import Subscribe from './pages/Subscribe';

// Auth Pages - loaded immediately
import AdminLogin from './pages/admin/AdminLogin';
import GymLogin from './pages/gym/GymLogin';
import GymRegister from './pages/gym/GymRegister';

// Lazy load admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const GymManagers = lazy(() => import('./pages/admin/GymManagers'));
const Subscriptions = lazy(() => import('./pages/admin/Subscriptions'));
const Plans = lazy(() => import('./pages/admin/Plans'));

// Lazy load gym manager pages
const GymDashboard = lazy(() => import('./pages/gym/Dashboard'));
const Members = lazy(() => import('./pages/gym/Members'));
const MemberSubscriptions = lazy(() => import('./pages/gym/MemberSubscriptions'));
const MemberPlans = lazy(() => import('./pages/gym/MemberPlans'));
const Payments = lazy(() => import('./pages/gym/Payments'));
const Attendance = lazy(() => import('./pages/gym/Attendance'));
const Reports = lazy(() => import('./pages/gym/Reports'));

// Enhanced Suspense fallback component
const SuspenseFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh' 
  }}>
    <LoadingSpinner />
  </div>
);

const PrivateRoute = ({ children, requiredUserType }) => {
  const { user, userType, loading } = useAuth();
  const [isPending] = useTransition();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to={requiredUserType === 'admin' ? '/admin/login' : '/gym/login'} replace />;
  }

  if (userType !== requiredUserType) {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense fallback={<SuspenseFallback />}>
      {isPending && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 9999,
          height: '3px',
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          animation: 'pulse 1s ease-in-out infinite'
        }} />
      )}
      {children}
    </Suspense>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/subscribe" element={<Subscribe />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute requiredUserType="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/gym-managers"
        element={
          <PrivateRoute requiredUserType="admin">
            <GymManagers />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/subscriptions"
        element={
          <PrivateRoute requiredUserType="admin">
            <Subscriptions />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/plans"
        element={
          <PrivateRoute requiredUserType="admin">
            <Plans />
          </PrivateRoute>
        }
      />

      {/* Gym Manager Routes */}
      <Route path="/gym/login" element={<GymLogin />} />
      <Route path="/gym/register" element={<GymRegister />} />
      <Route
        path="/gym/dashboard"
        element={
          <PrivateRoute requiredUserType="gym_manager">
            <GymDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/gym/members"
        element={
          <PrivateRoute requiredUserType="gym_manager">
            <Members />
          </PrivateRoute>
        }
      />
      <Route
        path="/gym/subscriptions"
        element={
          <PrivateRoute requiredUserType="gym_manager">
            <MemberSubscriptions />
          </PrivateRoute>
        }
      />
      <Route
        path="/gym/member-plans"
        element={
          <PrivateRoute requiredUserType="gym_manager">
            <MemberPlans />
          </PrivateRoute>
        }
      />
      <Route
        path="/gym/payments"
        element={
          <PrivateRoute requiredUserType="gym_manager">
            <Payments />
          </PrivateRoute>
        }
      />
      <Route
        path="/gym/attendance"
        element={
          <PrivateRoute requiredUserType="gym_manager">
            <Attendance />
          </PrivateRoute>
        }
      />
      <Route
        path="/gym/reports"
        element={
          <PrivateRoute requiredUserType="gym_manager">
            <Reports />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AuthProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <ErrorBoundary>
              <Suspense fallback={<SuspenseFallback />}>
                <AppRoutes />
              </Suspense>
              <ToastContainer />
            </ErrorBoundary>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;

