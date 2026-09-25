import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Calendar,
  Building2,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ArrowLeft,
  Mail,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

export default function HostBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchHostBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/bookings/host');
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Error fetching host bookings:', err);
      setError(err.response?.data?.error || 'Failed to fetch incoming property bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostBookings();
  }, []);

  const handleConfirm = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await api.put(`/api/bookings/${bookingId}/confirm`);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'confirmed' } : b))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to confirm booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (bookingId) => {
    if (!window.confirm('Are you sure you want to decline this reservation request?')) {
      return;
    }

    setActionLoading(bookingId);
    try {
      await api.put(`/api/bookings/${bookingId}/reject`);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'rejected' } : b))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reject booking');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings =
    filterTab === 'all'
      ? bookings
      : bookings.filter((b) => b.status === filterTab);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50';
      case 'completed':
        return 'bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] border-[#e5e0d8] dark:border-[#3f3f46]';
      case 'rejected':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50';
      case 'cancelled':
        return 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700';
      default:
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50';
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] dark:bg-[#121214] py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#1c1c20] p-7 sm:p-9 rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial">
          <div>
            <Link
              to="/host-dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#71717a] hover:text-[#18181b] dark:text-[#a1a1aa] dark:hover:text-[#f4f0e8] mb-2 group transition-colors px-3.5 py-1.5 rounded-full bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#3f3f46] w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Host Overview</span>
            </Link>
            <h1 className="font-editorial text-2xl sm:text-4xl font-light text-[#18181b] dark:text-[#f4f0e8] tracking-tight mt-2">
              Incoming Guest Reservations
            </h1>
            <p className="text-[#71717a] dark:text-[#a1a1aa] text-xs sm:text-sm mt-1">
              Review guest bookings, confirm dates, and manage your property schedule.
            </p>
          </div>

          <button
            onClick={fetchHostBookings}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f4f0e8] hover:bg-[#ede7dc] dark:bg-[#27272a] dark:hover:bg-[#323236] text-[#18181b] dark:text-[#f4f0e8] font-semibold text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer w-fit border border-[#e5e0d8] dark:border-[#3f3f46]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Requests</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {['all', 'pending', 'confirmed', 'completed', 'rejected', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider capitalize transition-all cursor-pointer whitespace-nowrap ${
                filterTab === tab
                  ? 'bg-[#18181b] text-white dark:bg-[#d4b996] dark:text-[#18181b] shadow-editorial'
                  : 'bg-white dark:bg-[#1c1c20] text-[#71717a] dark:text-[#a1a1aa] border border-[#e5e0d8] dark:border-[#2e2e34] hover:bg-[#f4f0e8] dark:hover:bg-[#27272a]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] flex items-center justify-center text-[#18181b] dark:text-[#d4b996] animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-[#71717a] dark:text-[#a1a1aa] font-medium text-xs uppercase tracking-wider">Fetching incoming guest bookings...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 text-center text-rose-800 dark:text-rose-300 text-sm font-semibold max-w-md mx-auto">
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-[#1c1c20] rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] p-12 text-center max-w-lg mx-auto shadow-editorial space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-editorial text-2xl font-light text-[#18181b] dark:text-[#f4f0e8]">No {filterTab !== 'all' ? filterTab : ''} booking requests</h3>
            <p className="text-xs sm:text-sm text-[#71717a] dark:text-[#a1a1aa]">
              When prospective tenants place reservations on your properties, they will appear in this inbox.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const prop = booking.property;
              const isPending = booking.status === 'pending';

              return (
                <div
                  key={booking._id}
                  className="bg-white dark:bg-[#1c1c20] rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#b58d59] dark:hover:border-[#d4b996] transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                      <span className="text-[11px] text-[#71717a] dark:text-[#a1a1aa]">
                        Received on {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-editorial text-lg font-bold text-[#18181b] dark:text-[#f4f0e8]">
                      {prop?.title || 'Property Listing'}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-[#52525b] dark:text-[#d4d4d8]">
                      <User className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#d4b996]" />
                      <span>Guest: <strong className="text-[#18181b] dark:text-[#f4f0e8]">{booking.user?.name}</strong> ({booking.user?.email})</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#71717a] dark:text-[#a1a1aa] pt-1 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#d4b996]" />
                        {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{booking.guests} Guest(s)</span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-[#f4f0e8] dark:border-[#2e2e34] gap-3">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-[#71717a] dark:text-[#a1a1aa] block font-bold uppercase tracking-wider">Gross Booking Value</span>
                      <span className="font-editorial text-xl font-bold text-[#18181b] dark:text-[#d4b996]">
                        ₹{booking.totalPrice?.toLocaleString()}
                      </span>
                    </div>

                    {isPending && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleConfirm(booking._id)}
                          disabled={actionLoading === booking._id}
                          className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Stay</span>
                        </button>
                        <button
                          onClick={() => handleReject(booking._id)}
                          disabled={actionLoading === booking._id}
                          className="px-5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-semibold uppercase tracking-wider rounded-full border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
