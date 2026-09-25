import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Calendar,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Star,
  Compass,
  Sparkles,
  X,
  ChevronRight,
} from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewProperty, setReviewProperty] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/bookings/my');
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.error || 'Failed to fetch your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.put(`/api/bookings/${bookingId}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const handleOpenReview = (property) => {
    setReviewProperty(property);
    setRating(5);
    setComment('');
    setReviewError('');
    setReviewSuccess('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 5) {
      setReviewError('Review comment must be at least 5 characters long.');
      return;
    }

    setReviewSubmitting(true);
    setReviewError('');

    try {
      await api.post(`/api/properties/${reviewProperty._id}/reviews`, {
        rating: Number(rating),
        comment: comment.trim(),
      });
      setReviewSuccess('Review published successfully!');
      setTimeout(() => {
        setReviewModalOpen(false);
      }, 1500);
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
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
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Guest Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              My Rental Itinerary
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Review reservation progress, connect with hosts, and provide feedback on completed stays.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition-all shadow-md w-fit"
          >
            <Compass className="w-4 h-4" />
            <span>Discover More Rentals</span>
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
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

        {/* Content Area */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-slate-500 font-medium text-sm">Retrieving your reservations...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center text-rose-800 text-sm font-semibold max-w-md mx-auto">
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No {filterTab !== 'all' ? filterTab : ''} bookings on record</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
              You don't have any bookings matching this category. Discover verified luxury properties and plan your next journey!
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Marketplace</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const prop = booking.property;
              const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
              const canReview = booking.status === 'confirmed' || booking.status === 'completed';

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-[28px] border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      {prop?.images && prop.images.length > 0 ? (
                        <img src={prop.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-indigo-400 bg-indigo-50">
                          <Building2 className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Reserved on {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                        {prop?.title || 'Property Listing'}
                      </h3>

                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{prop?.location}, {prop?.city}</span>
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-600 pt-1 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{booking.guests} Guest(s)</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-3">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">Total Value</span>
                      <span className="text-lg font-black text-slate-900">
                        ₹{booking.totalPrice?.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {prop && (
                        <Link
                          to={`/properties/${prop._id}`}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                        >
                          View Listing
                        </Link>
                      )}

                      {canReview && prop && (
                        <button
                          onClick={() => handleOpenReview(prop)}
                          className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>Review</span>
                        </button>
                      )}

                      {canCancel && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-7 sm:p-8 shadow-2xl space-y-5 animate-fadeIn border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Rate & Review Stay</span>
              </h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-medium">Reviewing:</p>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{reviewProperty?.title}</h4>
            </div>

            {reviewSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl font-bold">
                {reviewSuccess}
              </div>
            )}

            {reviewError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl font-bold">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Rating (1 to 5 stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                        rating >= num ? 'text-amber-500' : 'text-slate-200 hover:text-amber-300'
                      }`}
                    >
                      <Star className="w-7 h-7 fill-current" />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-800 ml-2">{rating} / 5</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700" htmlFor="comment">
                  Your Feedback *
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your stay, amenities, cleanliness, and overall experience..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
