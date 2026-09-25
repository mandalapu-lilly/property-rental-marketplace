import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Key, LogOut, CheckCircle2, Home, Calendar, Heart, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#fbfbf9] dark:bg-[#121214] py-10 sm:py-14 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white dark:bg-[#1c1c20] p-8 sm:p-10 rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-[#18181b] dark:bg-[#121214] text-white dark:text-[#d4b996] border border-transparent dark:border-[#3f3f46] flex items-center justify-center font-editorial italic text-2xl shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-editorial text-3xl sm:text-4xl font-light text-[#18181b] dark:text-[#f4f0e8] tracking-tight">
                  Welcome, {user?.name || 'Guest'}
                </h1>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] border border-[#e5e0d8] dark:border-[#3f3f46]">
                  {user?.role || 'user'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#71717a] dark:text-[#a1a1aa] mt-1 font-normal">
                Manage your trips, profile credentials, and saved destinations.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Profile Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white dark:bg-[#1c1c20] rounded-[2rem] p-8 border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-6 card-3d-elevation">
            <div className="flex items-center justify-between border-b border-[#f4f0e8] dark:border-[#2e2e34] pb-4">
              <h2 className="font-editorial text-2xl font-bold text-[#18181b] dark:text-[#f4f0e8]">
                Account Credentials
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/50">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Session
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="p-5 rounded-2xl bg-[#fbfbf9] dark:bg-[#161618] border border-[#e5e0d8] dark:border-[#2e2e34] card-3d-elevation">
                <div className="flex items-center gap-1.5 text-[#71717a] dark:text-[#a1a1aa] text-[10px] font-bold uppercase tracking-wider mb-1">
                  <User className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#b58d59]" />
                  Full Name
                </div>
                <div className="text-sm font-bold text-[#18181b] dark:text-[#f4f0e8]">
                  {user?.name || 'N/A'}
                </div>
              </div>

              {/* Email */}
              <div className="p-5 rounded-2xl bg-[#fbfbf9] dark:bg-[#161618] border border-[#e5e0d8] dark:border-[#2e2e34] card-3d-elevation">
                <div className="flex items-center gap-1.5 text-[#71717a] dark:text-[#a1a1aa] text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Mail className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#b58d59]" />
                  Email Address
                </div>
                <div className="text-sm font-bold text-[#18181b] dark:text-[#f4f0e8] truncate">
                  {user?.email || 'N/A'}
                </div>
              </div>

              {/* Account Role */}
              <div className="p-5 rounded-2xl bg-[#fbfbf9] dark:bg-[#161618] border border-[#e5e0d8] dark:border-[#2e2e34] card-3d-elevation">
                <div className="flex items-center gap-1.5 text-[#71717a] dark:text-[#a1a1aa] text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Shield className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#b58d59]" />
                  Role Privilege
                </div>
                <div className="text-sm font-bold text-[#18181b] dark:text-[#f4f0e8] capitalize">
                  {user?.role || 'Guest'}
                </div>
              </div>

              {/* Account ID */}
              <div className="p-5 rounded-2xl bg-[#fbfbf9] dark:bg-[#161618] border border-[#e5e0d8] dark:border-[#2e2e34] card-3d-elevation">
                <div className="flex items-center gap-1.5 text-[#71717a] dark:text-[#a1a1aa] text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Key className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#b58d59]" />
                  User Identifier
                </div>
                <div className="text-xs font-mono font-bold text-[#71717a] dark:text-[#a1a1aa] truncate">
                  {user?._id || user?.id || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-[#1c1c20] rounded-[2rem] p-8 border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-6 card-3d-elevation">
            <h2 className="font-editorial text-2xl font-bold text-[#18181b] dark:text-[#f4f0e8]">
              Quick Access
            </h2>

            <div className="space-y-3">
              <Link
                to="/my-bookings"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#fbfbf9] hover:bg-[#f4f0e8] dark:bg-[#161618] dark:hover:bg-[#27272a] border border-[#e5e0d8] dark:border-[#2e2e34] text-xs font-semibold uppercase tracking-wider text-[#18181b] dark:text-[#f4f0e8] transition-all"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#8c827a] dark:text-[#d4b996]" />
                  <span>My Trips & Bookings</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#a1a1aa]" />
              </Link>

              <Link
                to="/favorites"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#fbfbf9] hover:bg-[#f4f0e8] dark:bg-[#161618] dark:hover:bg-[#27272a] border border-[#e5e0d8] dark:border-[#2e2e34] text-xs font-semibold uppercase tracking-wider text-[#18181b] dark:text-[#f4f0e8] transition-all"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Saved Favorites</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#a1a1aa]" />
              </Link>

              <Link
                to="/properties"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#fbfbf9] hover:bg-[#f4f0e8] dark:bg-[#161618] dark:hover:bg-[#27272a] border border-[#e5e0d8] dark:border-[#2e2e34] text-xs font-semibold uppercase tracking-wider text-[#18181b] dark:text-[#f4f0e8] transition-all"
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-[#8c827a] dark:text-[#d4b996]" />
                  <span>Explore All Stays</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#a1a1aa]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
