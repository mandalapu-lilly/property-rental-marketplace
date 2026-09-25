import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AiRentalAssistant from './components/AiRentalAssistant';
import CompareBar from './components/CompareBar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Compare from './pages/Compare';
import Recommendations from './pages/Recommendations';
import Notifications from './pages/Notifications';
import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty';
import MyProperties from './pages/MyProperties';
import EditProperty from './pages/EditProperty';
import Favorites from './pages/Favorites';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import HostBookings from './pages/HostBookings';
import HostDashboard from './pages/HostDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Support from './pages/Support';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <CompareProvider>
            <Router>
              <div className="min-h-screen bg-[#fbfbf9] text-[#18181b] dark:bg-[#121214] dark:text-[#f4f0e8] flex flex-col font-sans antialiased transition-colors duration-300">
                <Navbar />
                <div className="flex-1">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/properties/:id" element={<PropertyDetails />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/recommendations" element={<Recommendations />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/help" element={<Support />} />
                    <Route path="/contact" element={<Support />} />

                    {/* Authenticated User Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/favorites"
                      element={
                        <ProtectedRoute>
                          <Favorites />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/properties/:id/book"
                      element={
                        <ProtectedRoute>
                          <Booking />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-bookings"
                      element={
                        <ProtectedRoute>
                          <MyBookings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute>
                          <Notifications />
                        </ProtectedRoute>
                      }
                    />

                    {/* Host & Admin Routes */}
                    <Route
                      path="/properties/add"
                      element={
                        <ProtectedRoute allowedRoles={['host', 'admin']}>
                          <AddProperty />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-properties"
                      element={
                        <ProtectedRoute allowedRoles={['host', 'admin']}>
                          <MyProperties />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/properties/edit/:id"
                      element={
                        <ProtectedRoute allowedRoles={['host', 'admin']}>
                          <EditProperty />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/host-dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['host', 'admin']}>
                          <HostDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/host-bookings"
                      element={
                        <ProtectedRoute allowedRoles={['host', 'admin']}>
                          <HostBookings />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Only Routes */}
                    <Route
                      path="/admin-dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
                {/* Floating AI Rental Assistant */}
                <AiRentalAssistant />
                {/* Floating Bottom Property Compare Bar */}
                <CompareBar />
              </div>
            </Router>
          </CompareProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
