import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// Public Components
import Home from './components/home/Home';
import AuthPage from './components/auth/AuthPage';
import Booking from './components/booking/Booking';
import BookingSummary from './components/booking/BookingSummary';
import Payment from './components/payment/Payment';
import BookingConfirmation from './components/booking/BookingConfirmation';

// Protected Components
import ProtectedRoute from './components/ProtectedRoute';

// Admin Components
import AdminDashboard from './componts/admin/Dashboard';
import AdminVehicles from './componts/admin/Vehicles';
import AdminBookings from './componts/admin/Bookings';
import AdminUsers from './componts/admin/Users';

// User Components
import UserDashboard from './componts/user/Dashboard';

/**
 * Main App Component
 * Defines all routes for the application
 */
function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/summary" element={<BookingSummary />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        </Route>

        {/* Auth Route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected User Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route
          element={
            <ProtectedRoute requireAdmin={true}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/vehicles" element={<AdminVehicles />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        {/* Redirects */}
        <Route path="/test1" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
