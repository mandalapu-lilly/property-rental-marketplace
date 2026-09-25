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
  Mail,
  TrendingUp,
  Percent,
} from 'lucide-react';

export default function HostDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHostData = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsRes, inqRes] = await Promise.all([
          api.get('/api/host/stats'),
          api.get('/api/inquiries/host').catch(() => ({ data: { inquiries: [] } })),
        ]);
        setStats(statsRes.data.stats);
        setInquiries(inqRes.data.inquiries || []);
      } catch (err) {
        console.error('Error fetching host dashboard data:', err);
        setError(err.response?.data?.error || 'Failed to load host metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchHostData();
  }, []);

  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      await api.patch(`/api/inquiries/${inquiryId}/status`, { status: newStatus });
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === inquiryId ? { ...inq, status: newStatus } : inq))
      );
    } catch (err) {
      alert('Could not update inquiry status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium text-sm">Loading host dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#fafafa] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80 uppercase tracking-wider">
              <span>Host Management Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Overview of your property portfolio, guest reservations, and earnings metrics.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              to="/host-bookings"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              Manage Bookings
            </Link>
            <Link
              to="/properties/add"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>List New Stay</span>
            </Link>
          </div>
        </div>

        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Properties */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Properties
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{stats?.totalProperties || 0}</span>
              <span className="text-xs text-slate-400 font-semibold">({stats?.availableProperties || 0} Active)</span>
            </div>
          </div>

          {/* Card 2: Bookings */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Bookings
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{stats?.totalBookings || 0}</span>
              <span className="text-xs text-amber-600 font-bold">({stats?.pendingBookings || 0} Pending)</span>
            </div>
          </div>

          {/* Card 3: Earnings */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Estimated Revenue
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                ₹{(stats?.totalEarnings || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Card 4: Average Rating */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Rating Average
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{stats?.avgRating ? stats.avgRating : '5.0'}</span>
              <span className="text-xs text-slate-400 font-semibold">({stats?.totalReviews || 0} Reviews)</span>
            </div>
          </div>
        </div>

        {/* Action Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/my-properties"
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-0.5 transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">My Property Listings</h3>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              View, edit, or remove your published properties. Update pricing, photos, and amenities.
            </p>
          </Link>

          <Link
            to="/host-bookings"
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-0.5 transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">Reservation Requests</h3>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review guest check-in requests, confirm available dates, and manage active stays.
            </p>
          </Link>

          <Link
            to="/properties/add"
            className="group bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-300 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Publish a New Stay</h3>
              <ArrowUpRight className="w-4 h-4 text-indigo-300" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Add photos, specify GPS coordinates, set rent, and reach verified tenants instantly.
            </p>
          </Link>
        </div>

        {/* Host Analytics & Performance Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Performance & Occupancy Analytics</h2>
                <p className="text-xs text-slate-500">Live booking conversion and listing statistics</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Booking Conversion</span>
              <div className="text-2xl font-extrabold text-indigo-600">
                {stats?.totalBookings > 0
                  ? Math.round(((stats?.confirmedBookings || 0) / stats.totalBookings) * 100)
                  : 100}%
              </div>
              <p className="text-[11px] text-slate-400">Confirmed vs total reservations</p>
            </div>

            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Listing Occupancy</span>
              <div className="text-2xl font-extrabold text-emerald-600">
                {stats?.totalProperties > 0
                  ? Math.round((((stats?.totalProperties - stats?.availableProperties) || 0) / stats.totalProperties) * 100)
                  : 0}%
              </div>
              <p className="text-[11px] text-slate-400">Currently reserved listings</p>
            </div>

            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Average Revenue / Stay</span>
              <div className="text-2xl font-extrabold text-slate-900">
                ₹{stats?.confirmedBookings > 0
                  ? Math.round((stats?.totalEarnings || 0) / stats.confirmedBookings).toLocaleString()
                  : '0'}
              </div>
              <p className="text-[11px] text-slate-400">Average realized booking value</p>
            </div>
          </div>
        </div>

        {/* Received Tenant Inquiries Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Guest Inquiries ({inquiries.length})
                </h2>
                <p className="text-xs text-slate-500">Messages sent directly by prospective renters</p>
              </div>
            </div>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs sm:text-sm">
              No inquiries received yet. When tenants contact you from your listing pages, they will appear here.
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div
                  key={inq._id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    inq.status === 'unread'
                      ? 'bg-indigo-50/40 border-indigo-200/80 shadow-sm'
                      : 'bg-slate-50/80 border-slate-200/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">
                          {inq.sender?.name || 'Prospective Guest'}
                        </span>
                        <span className="text-xs text-slate-400">({inq.sender?.email})</span>
                        {inq.phone && (
                          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-medium">
                            📞 {inq.phone}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Inquiry regarding listing:{' '}
                        <span className="font-semibold text-slate-800">{inq.property?.title}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          inq.status === 'unread'
                            ? 'bg-rose-100 text-rose-700'
                            : inq.status === 'replied'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {inq.status}
                      </span>
                      {inq.status === 'unread' && (
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq._id, 'read')}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2.5 py-1 rounded-lg bg-white border border-indigo-200 cursor-pointer"
                        >
                          Mark Read
                        </button>
                      )}
                      {inq.status !== 'replied' && (
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq._id, 'replied')}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 cursor-pointer"
                        >
                          Mark Replied
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200/70 whitespace-pre-line leading-relaxed">
                    "{inq.message}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {inq.preferredMoveInDate && (
                        <>Target Move-in: {new Date(inq.preferredMoveInDate).toLocaleDateString()} • </>
                      )}
                      Received: {new Date(inq.createdAt).toLocaleString()}
                    </span>
                    <Link
                      to={`/properties/${inq.property?._id}`}
                      className="text-indigo-600 hover:underline font-semibold"
                    >
                      View Property &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
