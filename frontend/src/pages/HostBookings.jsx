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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'cancelled':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-7 sm:p-9 rounded-[32px] border border-slate-200/80 shadow-sm">
          <div>
            <Link
              to="/host-dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-2 group transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Host Overview</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Incoming Guest Reservations
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Review guest bookings, confirm dates, and manage your property schedule.
            </p>
          </div>

          <button
            onClick={fetchHostBookings}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer w-fit"
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
              className={`px-5 py-2.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                filterTab === tab
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-slate-500 font-medium text-sm">Fetching incoming guest bookings...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center text-rose-800 text-sm font-semibold max-w-md mx-auto">
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-sm space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No {filterTab !== 'all' ? filterTab : ''} booking requests</h3>
            <p className="text-xs sm:text-sm text-slate-500">
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
                  className="bg-white rounded-[28px] border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-all"
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
                      <span className="text-[11px] text-slate-400">
                        Received on {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {prop?.title || 'Property Listing'}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Guest: <strong className="text-slate-800">{booking.user?.name}</strong> ({booking.user?.email})</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-600 pt-1 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{booking.guests} Guest(s)</span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-3">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">Gross Booking Value</span>
                      <span className="text-lg font-black text-slate-900">
                        ₹{booking.totalPrice?.toLocaleString()}
                      </span>
                    </div>

                    {isPending && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleConfirm(booking._id)}
                          disabled={actionLoading === booking._id}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Stay</span>
                        </button>
                        <button
                          onClick={() => handleReject(booking._id)}
                          disabled={actionLoading === booking._id}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
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
