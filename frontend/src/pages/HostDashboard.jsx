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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#fbfbf9] dark:bg-[#121214]">
        <Loader2 className="w-8 h-8 animate-spin text-[#18181b] dark:text-[#d4b996]" />
        <p className="text-[#71717a] dark:text-[#a1a1aa] font-medium text-xs uppercase tracking-wider">Loading host dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#fbfbf9] dark:bg-[#121214] py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#1c1c20] p-6 sm:p-8 rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] text-[10px] font-bold border border-[#e5e0d8] dark:border-[#3f3f46] uppercase tracking-wider">
              <span>Host Management Hub</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-4xl font-light text-[#18181b] dark:text-[#f4f0e8] tracking-tight mt-2.5">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-[#71717a] dark:text-[#a1a1aa] text-xs sm:text-sm mt-1">
              Overview of your property portfolio, guest reservations, and earnings metrics.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              to="/host-bookings"
              className="px-5 py-2.5 bg-[#f4f0e8] hover:bg-[#ede7dc] dark:bg-[#27272a] dark:hover:bg-[#323236] text-[#18181b] dark:text-[#f4f0e8] font-semibold text-xs uppercase tracking-wider rounded-full transition-colors border border-[#e5e0d8] dark:border-[#3f3f46]"
            >
              Manage Bookings
            </Link>
            <Link
              to="/properties/add"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full shadow-editorial transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>List New Stay</span>
            </Link>
          </div>
        </div>

        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Properties */}
          <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.2em]">
                Total Properties
              </span>
              <div className="w-9 h-9 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-3xl font-bold text-[#18181b] dark:text-[#f4f0e8]">{stats?.totalProperties || 0}</span>
              <span className="text-xs text-[#71717a] dark:text-[#a1a1aa] font-semibold">({stats?.availableProperties || 0} Active)</span>
            </div>
          </div>

          {/* Card 2: Bookings */}
          <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.2em]">
                Total Bookings
              </span>
              <div className="w-9 h-9 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-3xl font-bold text-[#18181b] dark:text-[#f4f0e8]">{stats?.totalBookings || 0}</span>
              <span className="text-xs text-amber-700 dark:text-amber-400 font-bold">({stats?.pendingBookings || 0} Pending)</span>
            </div>
          </div>

          {/* Card 3: Earnings */}
          <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.2em]">
                Estimated Revenue
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-[#18181b] dark:text-[#d4b996]">
                ₹{(stats?.totalEarnings || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Card 4: Average Rating */}
          <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.2em]">
                Rating Average
              </span>
              <div className="w-9 h-9 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#b58d59] flex items-center justify-center">
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-3xl font-bold text-[#18181b] dark:text-[#f4f0e8]">{stats?.avgRating ? stats.avgRating : '5.0'}</span>
              <span className="text-xs text-[#71717a] dark:text-[#a1a1aa] font-semibold">({stats?.totalReviews || 0} Reviews)</span>
            </div>
          </div>
        </div>

        {/* Action Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/my-properties"
            className="group bg-white dark:bg-[#1c1c20] p-6 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial hover:shadow-editorial-lg hover:-translate-y-0.5 transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-editorial font-bold text-[#18181b] dark:text-[#f4f0e8] text-lg group-hover:text-[#b58d59] dark:group-hover:text-[#d4b996] transition-colors">My Property Listings</h3>
              <ArrowUpRight className="w-4 h-4 text-[#71717a] group-hover:text-[#b58d59] dark:group-hover:text-[#d4b996] transition-colors" />
            </div>
            <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
              View, edit, or remove your published properties. Update pricing, photos, and amenities.
            </p>
          </Link>

          <Link
            to="/host-bookings"
            className="group bg-white dark:bg-[#1c1c20] p-6 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial hover:shadow-editorial-lg hover:-translate-y-0.5 transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-editorial font-bold text-[#18181b] dark:text-[#f4f0e8] text-lg group-hover:text-[#b58d59] dark:group-hover:text-[#d4b996] transition-colors">Reservation Requests</h3>
              <ArrowUpRight className="w-4 h-4 text-[#71717a] group-hover:text-[#b58d59] dark:group-hover:text-[#d4b996] transition-colors" />
            </div>
            <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
              Review guest check-in requests, confirm available dates, and manage active stays.
            </p>
          </Link>

          <Link
            to="/properties/add"
            className="group bg-[#18181b] dark:bg-[#27272a] text-white p-6 rounded-[2rem] shadow-editorial hover:shadow-editorial-lg hover:-translate-y-0.5 transition-all space-y-3 border border-[#2e2e34]"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#d4b996] group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-editorial font-bold text-white text-lg">Publish a New Stay</h3>
              <ArrowUpRight className="w-4 h-4 text-[#d4b996]" />
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Add photos, specify GPS coordinates, set rent, and reach verified tenants instantly.
            </p>
          </Link>
        </div>

        {/* Host Analytics & Performance Breakdown */}
        <div className="bg-white dark:bg-[#1c1c20] p-6 sm:p-8 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-6">
          <div className="flex items-center justify-between border-b border-[#f4f0e8] dark:border-[#2e2e34] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#18181b] dark:text-[#f4f0e8]">Performance & Occupancy Analytics</h2>
                <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">Live booking conversion and listing statistics</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 bg-[#fbfbf9] dark:bg-[#161618] rounded-2xl border border-[#e5e0d8] dark:border-[#2e2e34] space-y-1">
              <span className="text-[10px] text-[#71717a] dark:text-[#a1a1aa] font-bold uppercase tracking-[0.2em]">Booking Conversion</span>
              <div className="font-editorial text-3xl font-bold text-[#18181b] dark:text-[#d4b996]">
                {stats?.totalBookings > 0
                  ? Math.round(((stats?.confirmedBookings || 0) / stats.totalBookings) * 100)
                  : 100}%
              </div>
              <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa]">Confirmed vs total reservations</p>
            </div>

            <div className="p-5 bg-[#fbfbf9] dark:bg-[#161618] rounded-2xl border border-[#e5e0d8] dark:border-[#2e2e34] space-y-1">
              <span className="text-[10px] text-[#71717a] dark:text-[#a1a1aa] font-bold uppercase tracking-[0.2em]">Listing Occupancy</span>
              <div className="font-editorial text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                {stats?.totalProperties > 0
                  ? Math.round((((stats?.totalProperties - stats?.availableProperties) || 0) / stats.totalProperties) * 100)
                  : 0}%
              </div>
              <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa]">Currently reserved listings</p>
            </div>

            <div className="p-5 bg-[#fbfbf9] dark:bg-[#161618] rounded-2xl border border-[#e5e0d8] dark:border-[#2e2e34] space-y-1">
              <span className="text-[10px] text-[#71717a] dark:text-[#a1a1aa] font-bold uppercase tracking-[0.2em]">Average Revenue / Stay</span>
              <div className="font-editorial text-3xl font-bold text-[#18181b] dark:text-[#d4b996]">
                ₹{stats?.confirmedBookings > 0
                  ? Math.round((stats?.totalEarnings || 0) / stats.confirmedBookings).toLocaleString()
                  : '0'}
              </div>
              <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa]">Average realized booking value</p>
            </div>
          </div>
        </div>

        {/* Received Tenant Inquiries Section */}
        <div className="bg-white dark:bg-[#1c1c20] p-6 sm:p-8 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-6">
          <div className="flex items-center justify-between border-b border-[#f4f0e8] dark:border-[#2e2e34] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#18181b] dark:text-[#f4f0e8]">
                  Guest Inquiries ({inquiries.length})
                </h2>
                <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">Messages sent directly by prospective renters</p>
              </div>
            </div>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-8 text-[#71717a] dark:text-[#a1a1aa] text-xs sm:text-sm">
              No inquiries received yet. When tenants contact you from your listing pages, they will appear here.
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div
                  key={inq._id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    inq.status === 'unread'
                      ? 'bg-[#f4f0e8]/50 dark:bg-[#27272a]/50 border-[#e5e0d8] dark:border-[#3f3f46] shadow-sm'
                      : 'bg-[#fbfbf9] dark:bg-[#161618] border-[#e5e0d8] dark:border-[#2e2e34]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#18181b] dark:text-[#f4f0e8]">
                          {inq.sender?.name || 'Prospective Guest'}
                        </span>
                        <span className="text-xs text-[#71717a] dark:text-[#a1a1aa]">({inq.sender?.email})</span>
                        {inq.phone && (
                          <span className="text-xs text-[#18181b] dark:text-[#d4b996] bg-[#f4f0e8] dark:bg-[#27272a] px-2 py-0.5 rounded-md font-medium border border-[#e5e0d8] dark:border-[#3f3f46]">
                            📞 {inq.phone}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] mt-0.5">
                        Inquiry regarding listing:{' '}
                        <span className="font-semibold text-[#18181b] dark:text-[#f4f0e8]">{inq.property?.title}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                          inq.status === 'unread'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                            : inq.status === 'replied'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300'
                        }`}
                      >
                        {inq.status}
                      </span>
                      {inq.status === 'unread' && (
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq._id, 'read')}
                          className="text-xs font-semibold text-[#18181b] dark:text-[#f4f0e8] hover:bg-[#ede7dc] px-3 py-1 rounded-full bg-white dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#3f3f46] cursor-pointer"
                        >
                          Mark Read
                        </button>
                      )}
                      {inq.status !== 'replied' && (
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq._id, 'replied')}
                          className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 px-3 py-1 rounded-full bg-white dark:bg-[#27272a] border border-emerald-300 dark:border-emerald-800 cursor-pointer"
                        >
                          Mark Replied
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#52525b] dark:text-[#d4d4d8] bg-white dark:bg-[#1c1c20] p-3.5 rounded-xl border border-[#e5e0d8] dark:border-[#2e2e34] whitespace-pre-line leading-relaxed">
                    "{inq.message}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#71717a] dark:text-[#a1a1aa]">
                    <span>
                      {inq.preferredMoveInDate && (
                        <>Target Move-in: {new Date(inq.preferredMoveInDate).toLocaleDateString()} • </>
                      )}
                      Received: {new Date(inq.createdAt).toLocaleString()}
                    </span>
                    <Link
                      to={`/properties/${inq.property?._id}`}
                      className="text-[#b58d59] dark:text-[#d4b996] hover:underline font-semibold"
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
