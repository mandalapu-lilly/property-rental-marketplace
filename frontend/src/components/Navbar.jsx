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
    <header className="sticky top-0 z-50 bg-[#fbfbf9]/90 backdrop-blur-md border-b border-[#e8e3da] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Minimal Editorial Style */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 font-bold text-slate-900 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#18181b] flex items-center justify-center text-[#fbfbf9] shadow-sm group-hover:scale-105 transition-all duration-300">
              <span className="font-editorial text-lg italic tracking-wider">H</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-[0.2em] uppercase text-[#18181b] flex items-center gap-1">
                HavenStay
              </span>
              <span className="text-[9px] font-medium tracking-[0.25em] uppercase text-[#8c827a]">
                Luxury Residences
              </span>
            </div>
          </Link>

          {/* Centered Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] tracking-wide font-medium text-[#52525b]">
            <Link
              to="/"
              className={`transition-colors duration-200 py-1 border-b-2 ${
                isActive('/')
                  ? 'text-[#18181b] font-semibold border-[#18181b]'
                  : 'border-transparent hover:text-[#18181b]'
              }`}
            >
              Explore
            </Link>

            <Link
              to="/properties"
              className={`transition-colors duration-200 py-1 border-b-2 ${
                isActive('/properties')
                  ? 'text-[#18181b] font-semibold border-[#18181b]'
                  : 'border-transparent hover:text-[#18181b]'
              }`}
            >
              All Stays
            </Link>

            <Link
              to="/recommendations"
              className={`inline-flex items-center gap-1.5 transition-colors duration-200 py-1 border-b-2 ${
                isActive('/recommendations')
                  ? 'text-[#18181b] font-semibold border-[#18181b]'
                  : 'border-transparent hover:text-[#18181b]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#b58d59]" />
              <span>AI Match</span>
            </Link>

            <Link
              to="/compare"
              className={`inline-flex items-center gap-1.5 transition-colors duration-200 py-1 border-b-2 ${
                isActive('/compare')
                  ? 'text-[#18181b] font-semibold border-[#18181b]'
                  : 'border-transparent hover:text-[#18181b]'
              }`}
            >
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#18181b] text-white text-[10px] rounded-full font-bold">
                  {compareCount}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/favorites"
                  className={`inline-flex items-center gap-1 transition-colors duration-200 py-1 border-b-2 ${
                    isActive('/favorites')
                      ? 'text-[#18181b] font-semibold border-[#18181b]'
                      : 'border-transparent hover:text-[#18181b]'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Saved</span>
                </Link>

                <Link
                  to="/my-bookings"
                  className={`transition-colors duration-200 py-1 border-b-2 ${
                    isActive('/my-bookings')
                      ? 'text-[#18181b] font-semibold border-[#18181b]'
                      : 'border-transparent hover:text-[#18181b]'
                  }`}
                >
                  Trips
                </Link>

                {isHostOrAdmin && (
                  <Link
                    to="/host-dashboard"
                    className={`transition-colors duration-200 py-1 border-b-2 ${
                      isActive('/host-dashboard')
                        ? 'text-[#18181b] font-semibold border-[#18181b]'
                        : 'border-transparent hover:text-[#18181b]'
                    }`}
                  >
                    Host Hub
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin-dashboard"
                    className={`transition-colors duration-200 py-1 border-b-2 ${
                      isActive('/admin-dashboard')
                        ? 'text-[#18181b] font-semibold border-[#18181b]'
                        : 'border-transparent hover:text-[#18181b]'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Right Side / Auth & Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated && isHostOrAdmin && (
              <Link
                to="/properties/add"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f4f0e8] hover:bg-[#eae3d6] text-[#18181b] text-xs font-semibold rounded-full border border-[#ded7cb] transition-all duration-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>List Property</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Notification Dropdown */}
                <NotificationDropdown />

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#f4f0e8] border border-[#e5e0d8] shadow-sm text-[#18181b] text-xs font-semibold transition-all duration-200 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#18181b] text-white flex items-center justify-center text-xs font-medium uppercase">
                      {user?.name ? user.name.charAt(0) : <User className="w-3.5 h-3.5" />}
                    </div>
                    <span className="max-w-[120px] truncate font-medium text-[#18181b]">{user?.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#71717a]" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-editorial border border-[#e5e0d8] py-2 z-50"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-[#f4f0e8]">
                        <p className="text-xs font-bold text-[#18181b] truncate">{user?.name}</p>
                        <p className="text-[11px] text-[#71717a] truncate">{user?.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f4f0e8] text-[#18181b]">
                          {user?.role} Account
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#52525b] hover:bg-[#f8f6f0] hover:text-[#18181b] transition-colors"
                        >
                          <User className="w-4 h-4 text-[#a1a1aa]" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#52525b] hover:bg-[#f8f6f0] hover:text-[#18181b] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#a1a1aa]" />
                          <span>User Dashboard</span>
                        </Link>

                        {isHostOrAdmin && (
                          <Link
                            to="/my-properties"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#52525b] hover:bg-[#f8f6f0] hover:text-[#18181b] transition-colors"
                          >
                            <Building className="w-4 h-4 text-[#a1a1aa]" />
                            <span>My Properties</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-[#f4f0e8] pt-1">
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
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-[#52525b] hover:text-[#18181b] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold tracking-wide text-white bg-[#18181b] hover:bg-black rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-[#18181b] hover:bg-[#f4f0e8] focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e8e3da] bg-[#fbfbf9] px-6 pt-4 pb-8 space-y-4 shadow-xl animate-fadeIn">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-[#18181b] text-white' : 'text-[#18181b] hover:bg-[#f4f0e8]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Explore</span>
            </Link>

            <Link
              to="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive('/properties') ? 'bg-[#18181b] text-white' : 'text-[#18181b] hover:bg-[#f4f0e8]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>All Stays & Hotels</span>
            </Link>

            <Link
              to="/recommendations"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive('/recommendations') ? 'bg-[#18181b] text-white' : 'text-[#18181b] hover:bg-[#f4f0e8]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#b58d59]" />
              <span>AI Recommendations</span>
            </Link>

            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive('/compare') ? 'bg-[#18181b] text-white' : 'text-[#18181b] hover:bg-[#f4f0e8]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-[#71717a]" />
                <span>Compare Stays</span>
              </div>
              {compareCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#18181b] text-white text-xs font-bold">
                  {compareCount}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] hover:bg-[#f4f0e8]"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-[#71717a]" />
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
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] hover:bg-[#f4f0e8]"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Saved Favorites</span>
                </Link>

                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] hover:bg-[#f4f0e8]"
                >
                  <Calendar className="w-4 h-4 text-[#71717a]" />
                  <span>My Trips & Bookings</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] hover:bg-[#f4f0e8]"
                >
                  <User className="w-4 h-4 text-[#71717a]" />
                  <span>Profile Settings</span>
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] hover:bg-[#f4f0e8]"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#71717a]" />
                  <span>User Dashboard</span>
                </Link>

                {isHostOrAdmin && (
                  <>
                    <Link
                      to="/host-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] bg-[#f4f0e8]"
                    >
                      <Building className="w-4 h-4 text-[#b58d59]" />
                      <span>Host Hub</span>
                    </Link>

                    <Link
                      to="/properties/add"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] bg-[#f4f0e8]"
                    >
                      <Plus className="w-4 h-4 text-[#18181b]" />
                      <span>List New Property</span>
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] bg-[#f4f0e8]"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Admin Control Center</span>
                  </Link>
                )}

                <div className="pt-2 border-t border-[#e8e3da]">
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
              <div className="pt-4 border-t border-[#e8e3da] flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold text-[#18181b] bg-[#f4f0e8] rounded-full transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-bold text-white bg-[#18181b] rounded-full shadow-md transition-colors"
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
