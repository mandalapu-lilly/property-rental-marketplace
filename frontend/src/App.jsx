import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AiRentalAssistant from './components/AiRentalAssistant';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
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
import Recommendations from './pages/Recommendations';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/recommendations" element={<Recommendations />} />

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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
