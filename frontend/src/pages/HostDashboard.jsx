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
        {/* Host Analytics & Performance Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Host Performance & Occupancy Analytics</h2>
                <p className="text-xs text-slate-500">Live booking conversion and listing statistics</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Booking Conversion</span>
              <div className="text-2xl font-black text-indigo-600">
                {stats?.totalBookings > 0
                  ? Math.round(((stats?.confirmedBookings || 0) / stats.totalBookings) * 100)
                  : 100}%
              </div>
              <p className="text-[11px] text-slate-400">Confirmed vs total reservations</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Listing Occupancy</span>
              <div className="text-2xl font-black text-emerald-600">
                {stats?.totalProperties > 0
                  ? Math.round((((stats?.totalProperties - stats?.availableProperties) || 0) / stats.totalProperties) * 100)
                  : 0}%
              </div>
              <p className="text-[11px] text-slate-400">Currently reserved listings</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Average Revenue / Stay</span>
              <div className="text-2xl font-black text-slate-900">
                ₹{stats?.confirmedBookings > 0
                  ? Math.round((stats?.totalEarnings || 0) / stats.confirmedBookings).toLocaleString()
                  : '0'}
              </div>
              <p className="text-[11px] text-slate-400">Average realized booking value</p>
            </div>
          </div>
        </div>

        {/* Received Tenant Inquiries Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Guest Inquiries ({inquiries.length})
                </h2>
                <p className="text-xs text-slate-500">Messages sent directly by prospective renters</p>
              </div>
            </div>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No inquiries received yet. When tenants contact you from your listing pages, they will appear here.
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div
                  key={inq._id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    inq.status === 'unread'
                      ? 'bg-indigo-50/40 border-indigo-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
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
                        className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
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
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded bg-white border border-indigo-200"
                        >
                          Mark Read
                        </button>
                      )}
                      {inq.status !== 'replied' && (
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq._id, 'replied')}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 px-2 py-1 rounded bg-white border border-emerald-200"
                        >
                          Mark Replied
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/70 whitespace-pre-line">
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
