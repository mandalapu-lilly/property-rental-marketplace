import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
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
  Sun,
  Moon,
} from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { compareCount } = useCompare();
  const { unreadCount } = useNotifications();
  const { isDark, toggleTheme } = useTheme();
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
    <header className="sticky top-0 z-50 bg-[#fbfbf9]/90 dark:bg-[#121214]/90 backdrop-blur-md border-b border-[#e8e3da] dark:border-[#27272a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Exact Finalized HAVENSTAY Asset */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.01] shrink-0"
          >
            <div className="p-1 sm:p-1.5 rounded-xl bg-[#fbfbf9] dark:bg-[#1c1c20] border border-[#e8e3da] dark:border-[#27272a] shadow-xs flex items-center justify-center">
              <img
                src="/havenstay-logo.png"
                alt="HavenStay Logo"
                className="h-9 sm:h-10 md:h-[44px] lg:h-[46px] w-auto object-contain rounded"
              />
            </div>
          </Link>

          {/* Centered Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] tracking-wide font-medium text-[#52525b] dark:text-[#a1a1aa]">
            <Link
              to="/"
              className={`transition-colors duration-200 py-1 border-b-2 ${
                isActive('/')
                  ? 'text-[#18181b] dark:text-[#fbfbf9] font-semibold border-[#18181b] dark:border-[#d4b996]'
                  : 'border-transparent hover:text-[#18181b] dark:hover:text-[#fbfbf9]'
              }`}
            >
              Explore
            </Link>

            <Link
              to="/properties"
              className={`transition-colors duration-200 py-1 border-b-2 ${
                isActive('/properties')
                  ? 'text-[#18181b] dark:text-[#fbfbf9] font-semibold border-[#18181b] dark:border-[#d4b996]'
                  : 'border-transparent hover:text-[#18181b] dark:hover:text-[#fbfbf9]'
              }`}
            >
              All Stays
            </Link>

            <Link
              to="/recommendations"
              className={`inline-flex items-center gap-1.5 transition-colors duration-200 py-1 border-b-2 ${
                isActive('/recommendations')
                  ? 'text-[#18181b] dark:text-[#fbfbf9] font-semibold border-[#18181b] dark:border-[#d4b996]'
                  : 'border-transparent hover:text-[#18181b] dark:hover:text-[#fbfbf9]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#b58d59] dark:text-[#d4b996]" />
              <span>AI Match</span>
            </Link>

            <Link
              to="/compare"
              className={`inline-flex items-center gap-1.5 transition-colors duration-200 py-1 border-b-2 ${
                isActive('/compare')
                  ? 'text-[#18181b] dark:text-[#fbfbf9] font-semibold border-[#18181b] dark:border-[#d4b996]'
                  : 'border-transparent hover:text-[#18181b] dark:hover:text-[#fbfbf9]'
              }`}
            >
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] text-[10px] rounded-full font-bold">
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
                      ? 'text-[#18181b] dark:text-[#fbfbf9] font-semibold border-[#18181b] dark:border-[#d4b996]'
                      : 'border-transparent hover:text-[#18181b] dark:hover:text-[#fbfbf9]'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Saved</span>
                </Link>

                <Link
                  to="/my-bookings"
                  className={`transition-colors duration-200 py-1 border-b-2 ${
                    isActive('/my-bookings')
                      ? 'text-[#18181b] dark:text-[#fbfbf9] font-semibold border-[#18181b] dark:border-[#d4b996]'
                      : 'border-transparent hover:text-[#18181b] dark:hover:text-[#fbfbf9]'
                  }`}
                >
                  Trips
                </Link>

                {isHostOrAdmin && (
                  <Link
                    to="/host-dashboard"
                    className={`transition-colors duration-200 py-1 border-b-2 ${
                      isActive('/host-dashboard')
                        ? 'text-[#18181b] dark:text-[#fbfbf9] font-semibold border-[#18181b] dark:border-[#d4b996]'
                        : 'border-transparent hover:text-[#18181b] dark:hover:text-[#fbfbf9]'
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
                        ? 'text-[#18181b] dark:text-[#fbfbf9] font-semibold border-[#18181b] dark:border-[#d4b996]'
                        : 'border-transparent hover:text-[#18181b] dark:hover:text-[#fbfbf9]'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Right Side / Theme Toggle, Auth & Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme mode"
              className="p-2.5 rounded-full text-[#71717a] hover:text-[#18181b] dark:text-[#a1a1aa] dark:hover:text-[#fbfbf9] hover:bg-[#f4f0e8] dark:hover:bg-[#1c1c20] border border-transparent hover:border-[#e5e0d8] dark:hover:border-[#27272a] transition-all duration-200 cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[#d4b996]" />
              ) : (
                <Moon className="w-4 h-4 text-[#71717a]" />
              )}
            </button>

            {isAuthenticated && isHostOrAdmin && (
              <Link
                to="/properties/add"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f4f0e8] hover:bg-[#eae3d6] dark:bg-[#1c1c20] dark:hover:bg-[#27272a] text-[#18181b] dark:text-[#fbfbf9] text-xs font-semibold rounded-full border border-[#ded7cb] dark:border-[#3f3f46] transition-all duration-200"
              >
                <Plus className="w-3.5 h-3.5 text-[#b58d59] dark:text-[#d4b996]" />
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
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1c1c20] hover:bg-[#f4f0e8] dark:hover:bg-[#27272a] border border-[#e5e0d8] dark:border-[#27272a] shadow-sm text-[#18181b] dark:text-[#fbfbf9] text-xs font-semibold transition-all duration-200 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] flex items-center justify-center text-xs font-medium uppercase">
                      {user?.name ? user.name.charAt(0) : <User className="w-3.5 h-3.5" />}
                    </div>
                    <span className="max-w-[120px] truncate font-medium text-[#18181b] dark:text-[#fbfbf9]">{user?.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#71717a] dark:text-[#a1a1aa]" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2.5 w-56 bg-white dark:bg-[#1c1c20] rounded-2xl shadow-editorial border border-[#e5e0d8] dark:border-[#27272a] py-2 z-50 animate-fadeIn"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-[#f4f0e8] dark:border-[#27272a]">
                        <p className="text-xs font-bold text-[#18181b] dark:text-[#fbfbf9] truncate">{user?.name}</p>
                        <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] truncate">{user?.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] border border-[#e5e0d8] dark:border-[#3f3f46]">
                          {user?.role} Account
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#52525b] dark:text-[#d4d4d8] hover:bg-[#f8f6f0] dark:hover:bg-[#27272a] hover:text-[#18181b] dark:hover:text-[#fbfbf9] transition-colors"
                        >
                          <User className="w-4 h-4 text-[#a1a1aa]" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#52525b] dark:text-[#d4d4d8] hover:bg-[#f8f6f0] dark:hover:bg-[#27272a] hover:text-[#18181b] dark:hover:text-[#fbfbf9] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#a1a1aa]" />
                          <span>User Dashboard</span>
                        </Link>

                        {isHostOrAdmin && (
                          <Link
                            to="/my-properties"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#52525b] dark:text-[#d4d4d8] hover:bg-[#f8f6f0] dark:hover:bg-[#27272a] hover:text-[#18181b] dark:hover:text-[#fbfbf9] transition-colors"
                          >
                            <Building className="w-4 h-4 text-[#a1a1aa]" />
                            <span>My Properties</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-[#f4f0e8] dark:border-[#27272a] pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-colors"
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
                  className="px-4 py-2 text-xs font-semibold text-[#52525b] dark:text-[#d4d4d8] hover:text-[#18181b] dark:hover:text-[#fbfbf9] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold tracking-wide text-white bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] dark:text-[#18181b] rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme mode"
              className="p-2 rounded-full text-[#71717a] dark:text-[#a1a1aa] hover:bg-[#f4f0e8] dark:hover:bg-[#1c1c20] focus:outline-none cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-[#d4b996]" />
              ) : (
                <Moon className="w-5 h-5 text-[#71717a]" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-[#18181b] dark:text-[#fbfbf9] hover:bg-[#f4f0e8] dark:hover:bg-[#1c1c20] focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e8e3da] dark:border-[#27272a] bg-[#fbfbf9] dark:bg-[#121214] px-6 pt-4 pb-8 space-y-4 shadow-xl animate-fadeIn">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b]'
                  : 'text-[#18181b] dark:text-[#fbfbf9] hover:bg-[#f4f0e8] dark:hover:bg-[#1c1c20]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Explore</span>
            </Link>

            <Link
              to="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive('/properties')
                  ? 'bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b]'
                  : 'text-[#18181b] dark:text-[#fbfbf9] hover:bg-[#f4f0e8] dark:hover:bg-[#1c1c20]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>All Stays & Hotels</span>
            </Link>

            <Link
              to="/recommendations"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive('/recommendations')
                  ? 'bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b]'
                  : 'text-[#18181b] dark:text-[#fbfbf9] hover:bg-[#f4f0e8] dark:hover:bg-[#1c1c20]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#b58d59] dark:text-[#d4b996]" />
              <span>AI Recommendations</span>
            </Link>

            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive('/compare')
                  ? 'bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b]'
                  : 'text-[#18181b] dark:text-[#fbfbf9] hover:bg-[#f4f0e8] dark:hover:bg-[#1c1c20]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-[#71717a] dark:text-[#a1a1aa]" />
                <span>Compare Stays</span>
              </div>
              {compareCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] text-xs font-bold">
                  {compareCount}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] dark:text-[#fbfbf9] hover:bg-[#f4f0e8] dark:hover:bg-[#1c1c20]"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-[#71717a] dark:text-[#a1a1aa]" />
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
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] dark:text-[#fbfbf9] hover:bg-[#f4f0e8] dark:hover:bg-[#1c1c20]"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Saved Favorites</span>
                </Link>

                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] dark:text-[#fbfbf9] hover:bg-[#f4f0e8] dark:hover:bg-[#1c1c20]"
                >
                  <Calendar className="w-4 h-4 text-[#71717a] dark:text-[#a1a1aa]" />
                  <span>My Trips & Bookings</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] dark:text-[#fbfbf9] hover:bg-[#f4f0e8] dark:hover:bg-[#1c1c20]"
                >
                  <User className="w-4 h-4 text-[#71717a] dark:text-[#a1a1aa]" />
                  <span>Profile Settings</span>
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] dark:text-[#fbfbf9] hover:bg-[#f4f0e8] dark:hover:bg-[#1c1c20]"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#71717a] dark:text-[#a1a1aa]" />
                  <span>User Dashboard</span>
                </Link>

                {isHostOrAdmin && (
                  <>
                    <Link
                      to="/host-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] dark:text-[#fbfbf9] bg-[#f4f0e8] dark:bg-[#1c1c20]"
                    >
                      <Building className="w-4 h-4 text-[#b58d59] dark:text-[#d4b996]" />
                      <span>Host Hub</span>
                    </Link>

                    <Link
                      to="/properties/add"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] dark:text-[#fbfbf9] bg-[#f4f0e8] dark:bg-[#1c1c20]"
                    >
                      <Plus className="w-4 h-4 text-[#18181b] dark:text-[#d4b996]" />
                      <span>List New Property</span>
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#18181b] dark:text-[#fbfbf9] bg-[#f4f0e8] dark:bg-[#1c1c20]"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#b58d59] dark:text-[#d4b996]" />
                    <span>Admin Control Center</span>
                  </Link>
                )}

                <div className="pt-2 border-t border-[#e8e3da] dark:border-[#27272a]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="pt-4 border-t border-[#e8e3da] dark:border-[#27272a] flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold text-[#18181b] dark:text-[#fbfbf9] bg-[#f4f0e8] dark:bg-[#1c1c20] rounded-full transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-bold text-white bg-[#18181b] dark:bg-[#d4b996] dark:text-[#18181b] rounded-full shadow-md transition-colors"
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
