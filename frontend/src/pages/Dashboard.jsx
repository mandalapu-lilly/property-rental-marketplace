import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Key, LogOut, CheckCircle2, Home, Calendar, Heart, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'host':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#fafafa] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-800 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome, {user?.name || 'Guest'}!
                </h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getRoleBadgeColor(
                    user?.role
                  )}`}
                >
                  {user?.role || 'user'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Manage your trips, profile settings, and favorite destinations.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Profile Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Account Credentials</span>
              </h2>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Session
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Full Name
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {user?.name || 'N/A'}
                </div>
              </div>

              {/* Email */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Address
                </div>
                <div className="text-sm font-bold text-slate-900 truncate">
                  {user?.email || 'N/A'}
                </div>
              </div>

              {/* Account Role */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  Account Role
                </div>
                <div className="text-sm font-bold text-slate-900 capitalize">
                  {user?.role || 'user'} Account
                </div>
              </div>

              {/* User ID */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  User ID
                </div>
                <div className="text-xs font-mono font-medium text-slate-600 truncate">
                  {user?.id || user?._id || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info & Security Card */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center mb-4 text-indigo-300">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">Secure JWT Session</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your authentication token is stored safely and verified on every protected rental request.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
              <span>Token Status</span>
              <span className="text-emerald-400 font-bold">Active & Valid</span>
            </div>
          </div>
        </div>

        {/* Quick Hub Navigation Cards */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Quick Hub Navigation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/properties')}
              className="p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-slate-900 hover:shadow-xl hover:-translate-y-0.5 transition-all text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                <Home className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Browse Stays
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Explore luxury hotels, resorts, villas, and homestays.
              </p>
            </button>

            <button
              onClick={() => navigate('/my-bookings')}
              className="p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-slate-900 hover:shadow-xl hover:-translate-y-0.5 transition-all text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                My Bookings & Trips
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                View confirmed check-ins and reservation statuses.
              </p>
            </button>

            <button
              onClick={() => navigate('/favorites')}
              className="p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-slate-900 hover:shadow-xl hover:-translate-y-0.5 transition-all text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                Saved Wishlist
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Access your bookmarked stays and favorite properties.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
