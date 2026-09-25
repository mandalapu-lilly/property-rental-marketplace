import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import {
  Home,
  Building2,
  LayoutDashboard,
  LogOut,
  User,
  LogIn,
  UserPlus,
  Compass,
  Plus,
  Heart,
  Calendar,
  ShieldCheck,
  Building,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  Bell,
} from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { compareCount } = useCompare();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const isHost = user?.role === 'host';
  const isAdmin = user?.role === 'admin';
  const isHostOrAdmin = isHost || isAdmin;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 font-bold text-xl text-slate-900 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-900/20 group-hover:scale-105 transition-all duration-300">
              <Building2 className="w-5 h-5 text-indigo-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                HavenStay
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block"></span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Premium Stays & Rentals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                isActive('/')
                  ? 'text-white bg-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Explore</span>
            </Link>

            <Link
              to="/properties"
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                isActive('/properties')
                  ? 'text-white bg-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>All Stays</span>
            </Link>

            <Link
              to="/recommendations"
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                isActive('/recommendations')
                  ? 'text-indigo-900 bg-indigo-100/90 shadow-sm'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>AI Match</span>
            </Link>

            <Link
              to="/compare"
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                isActive('/compare')
                  ? 'text-white bg-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                  {compareCount}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/favorites"
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                    isActive('/favorites')
                      ? 'text-white bg-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-rose-600 hover:bg-white/60'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Saved</span>
                </Link>

                <Link
                  to="/my-bookings"
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                    isActive('/my-bookings')
                      ? 'text-white bg-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Trips</span>
                </Link>

                {isHostOrAdmin && (
                  <Link
                    to="/host-dashboard"
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                      isActive('/host-dashboard')
                        ? 'text-white bg-amber-700 shadow-sm'
                        : 'text-amber-800 hover:text-amber-900 hover:bg-amber-100/50'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5 text-amber-500" />
                    <span>Host Hub</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin-dashboard"
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                      isActive('/admin-dashboard')
                        ? 'text-white bg-purple-700 shadow-sm'
                        : 'text-purple-800 hover:text-purple-900 hover:bg-purple-100/50'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Right Side / Auth Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && isHostOrAdmin && (
              <Link
                to="/properties/add"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200/80 transition-all duration-200 hover:shadow-sm"
              >
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>List Property</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                {/* Interactive Notification Bell Dropdown */}
                <NotificationDropdown />

                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm text-slate-800 text-xs font-semibold transition-all duration-200 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-800 text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                      {user?.name ? user.name.charAt(0) : <User className="w-3.5 h-3.5" />}
                    </div>
                    <span className="max-w-[120px] truncate font-medium text-slate-800">{user?.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 animate-fadeIn"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                          {user?.role} Account
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          <span>User Dashboard</span>
                        </Link>

                        {isHostOrAdmin && (
                          <Link
                            to="/my-properties"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                          >
                            <Building className="w-4 h-4 text-slate-400" />
                            <span>My Properties</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-5 pt-4 pb-8 space-y-4 shadow-xl animate-fadeIn">
          <nav className="flex flex-col space-y-1.5">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/') ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Explore</span>
            </Link>

            <Link
              to="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/properties') ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>All Stays & Hotels</span>
            </Link>

            <Link
              to="/recommendations"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/recommendations') ? 'bg-indigo-600 text-white' : 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Recommendations</span>
            </Link>

            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/compare') ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Compare Stays</span>
              </div>
              {compareCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-bold">
                  {compareCount}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-indigo-500" />
                    <span>Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Saved Favorites</span>
                </Link>

                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>My Trips & Bookings</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Profile Settings</span>
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>User Dashboard</span>
                </Link>

                {isHostOrAdmin && (
                  <>
                    <Link
                      to="/host-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-800 bg-amber-50 hover:bg-amber-100/70"
                    >
                      <Building className="w-4 h-4 text-amber-600" />
                      <span>Host Hub & Management</span>
                    </Link>

                    <Link
                      to="/properties/add"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100/70"
                    >
                      <Plus className="w-4 h-4 text-indigo-600" />
                      <span>List New Property</span>
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-purple-800 bg-purple-50 hover:bg-purple-100/70"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Admin Control Center</span>
                  </Link>
                )}

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl shadow-md transition-colors"
                >
                  Create Free Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
