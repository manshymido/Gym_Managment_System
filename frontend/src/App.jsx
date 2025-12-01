import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Home Page
import Home from './pages/Home';
import Subscribe from './pages/Subscribe';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import GymManagers from './pages/admin/GymManagers';
import Subscriptions from './pages/admin/Subscriptions';
import Plans from './pages/admin/Plans';

// Gym Manager Pages
import GymLogin from './pages/gym/GymLogin';
import GymRegister from './pages/gym/GymRegister';
import GymDashboard from './pages/gym/Dashboard';
import Members from './pages/gym/Members';
import MemberSubscriptions from './pages/gym/MemberSubscriptions';
import MemberPlans from './pages/gym/MemberPlans';
import Payments from './pages/gym/Payments';
import Attendance from './pages/gym/Attendance';
import Reports from './pages/gym/Reports';

const PrivateRoute = ({ children, requiredUserType }) => {
  const { user, userType, loading } = useAuth();

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (!user) {
    return <Navigate to={requiredUserType === 'admin' ? '/admin/login' : '/gym/login'} />;
  }

  if (userType !== requiredUserType) {
    return <Navigate to="/" />;
  }

  return children;
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
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

