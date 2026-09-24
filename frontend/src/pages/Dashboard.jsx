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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome, {user?.name || 'User'}!
              </h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${getRoleBadgeColor(
                  user?.role
                )}`}
              >
                {user?.role || 'user'}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Manage your profile, active rentals, and account settings.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-sm transition-colors cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Profile Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Account Profile
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Authenticated Session
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                  <User className="w-3.5 h-3.5" />
                  Full Name
                </div>
                <div className="text-base font-bold text-slate-900">
                  {user?.name || 'N/A'}
                </div>
              </div>

              {/* Email */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  Email Address
                </div>
                <div className="text-base font-bold text-slate-900 truncate">
                  {user?.email || 'N/A'}
                </div>
              </div>

              {/* Account Role */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                  <Shield className="w-3.5 h-3.5" />
                  Account Role
                </div>
                <div className="text-base font-bold text-slate-900 capitalize">
                  {user?.role || 'user'}
                </div>
              </div>

              {/* User ID */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                  <Key className="w-3.5 h-3.5" />
                  User ID
                </div>
                <div className="text-xs font-mono font-medium text-slate-600 truncate">
                  {user?.id || user?._id || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info & Security Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 text-indigo-300">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Secure JWT Session</h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Your authentication token is stored safely and sent with every protected API request via Bearer headers.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-indigo-200/80">
              Session status: <span className="text-emerald-400 font-semibold">Active & Valid</span>
            </div>
          </div>
        </div>

        {/* Next Features Placeholder Tiles */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Marketplace Modules (Ready for Step 3)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200/70 opacity-80">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Home className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Property Listings</h4>
              <p className="text-xs text-slate-500 mt-1">
                Browse and list houses, villas, and apartments.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200/70 opacity-80">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">My Bookings</h4>
              <p className="text-xs text-slate-500 mt-1">
                Manage upcoming rental stays and reservations.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200/70 opacity-80">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Saved Wishlist</h4>
              <p className="text-xs text-slate-500 mt-1">
                Bookmark and favorite top destinations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
