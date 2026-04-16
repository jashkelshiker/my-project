import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout
import Layout from './componts/layout';

// Public Components
import Home from './componts/home';
import AuthPage from './components/auth/AuthPage';
import Booking from './componts/booking';
import BookingSummary from './componts/vehiclerentalsummery';
import Payment from './componts/payment';
import BookingConfirmation from './componts/bookingConfirmation';
import MyBookings from './components/booking/MyBookings';
import Favorites from './components/booking/Favorites';
import VehicleList from './components/booking/VehicleList';
import BrowseByType from './components/booking/BrowseByType';
import BudgetVehicles from './components/booking/BudgetVehicles';
import PopularVehicles from './components/booking/PopularVehicles';

// Protected Components
import ProtectedRoute from './components/ProtectedRoute';

// Admin Componets
import AdminDashboard from './componts/admin/Dashboard';
import AdminVehicles from './componts/admin/Vehicles';
import AdminBookings from './componts/admin/Bookings';
import AdminUsers from './componts/admin/Users';

// User Components
import UserDashboard from './componts/user/Dashboard';
import Profile from './componts/user/Profile';

// Debug: log imported component types to detect invalid imports
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('Imported components:', {
    Layout,
    Home,
    AuthPage,
    Booking,
    BookingSummary,
    Payment,
    BookingConfirmation,
    MyBookings,
    Favorites,
    VehicleList,
    BrowseByType,
    BudgetVehicles,
    PopularVehicles,
    ProtectedRoute,
    AdminDashboard,
    AdminVehicles,
    AdminBookings,
    AdminUsers,
    UserDashboard,
  });
}

/**
 * Main App Component
 * Defines all routes for the application
 */
function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen">
          <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/browse-by-type" element={<BrowseByType />} />
          <Route path="/budget-vehicles" element={<BudgetVehicles />} />
          <Route path="/popular-vehicles" element={<PopularVehicles />} />
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/favorites" element={<Favorites />} />
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
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
