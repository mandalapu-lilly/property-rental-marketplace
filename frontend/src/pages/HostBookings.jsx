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
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <Link
              to="/host-dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Host Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Incoming Reservation Requests
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Review guest booking requests and confirm or decline dates.
            </p>
          </div>

          <button
            onClick={fetchHostBookings}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer w-fit"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'pending', 'confirmed', 'completed', 'rejected', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                filterTab === tab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-slate-500 font-medium text-sm">Loading incoming bookings...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-800 text-sm font-semibold max-w-md mx-auto">
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No {filterTab !== 'all' ? filterTab : ''} bookings</h3>
            <p className="text-xs text-slate-500">
              When tenants book your properties, their reservation requests will appear here.
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
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                      <span className="text-xs text-slate-400">
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

                    <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{booking.guests} Guest(s)</span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-3">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-slate-400 block font-medium">Earnings</span>
                      <span className="text-lg font-black text-slate-900">
                        ₹{booking.totalPrice?.toLocaleString()}
                      </span>
                    </div>

                    {isPending && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleConfirm(booking._id)}
                          disabled={actionLoading === booking._id}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleReject(booking._id)}
                          disabled={actionLoading === booking._id}
                          className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
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
