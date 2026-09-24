import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building,
  Building2,
  Calendar,
  DollarSign,
  Star,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FolderHeart,
  Loader2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export default function HostDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHostStats = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/host/stats');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Error fetching host dashboard stats:', err);
        setError(err.response?.data?.error || 'Failed to load host metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchHostStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium text-sm">Loading host dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 uppercase tracking-wider">
                Host Management Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Overview of your listings, guest reservations, and earnings performance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/host-bookings"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Manage Bookings
            </Link>
            <Link
              to="/properties/add"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </Link>
          </div>
        </div>

        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Properties */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Properties
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{stats?.totalProperties || 0}</span>
              <span className="text-xs text-slate-500 font-medium">({stats?.availableProperties || 0} Active)</span>
            </div>
          </div>

          {/* Card 2: Bookings */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Bookings
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{stats?.totalBookings || 0}</span>
              <span className="text-xs text-amber-600 font-bold">({stats?.pendingBookings || 0} Pending)</span>
            </div>
          </div>

          {/* Card 3: Earnings */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Estimated Earnings
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                ₹{(stats?.totalEarnings || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Card 4: Average Rating */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Rating Average
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{stats?.avgRating ? stats.avgRating : '5.0'}</span>
              <span className="text-xs text-slate-500 font-medium">({stats?.totalReviews || 0} Reviews)</span>
            </div>
          </div>
        </div>

        {/* Action Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/my-properties"
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">My Property Listings</h3>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              View, edit, or remove your published properties. Update pricing and amenities.
            </p>
          </Link>

          <Link
            to="/host-bookings"
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Reservation Requests</h3>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review guest check-in requests, confirm available dates, and manage active stays.
            </p>
          </Link>

          <Link
            to="/properties/add"
            className="group bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-md hover:shadow-lg transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-300 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Publish a New Stay</h3>
              <ArrowUpRight className="w-4 h-4 text-indigo-300" />
            </div>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Add photos, specify GPS coordinates, set rent, and reach verified tenants.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
