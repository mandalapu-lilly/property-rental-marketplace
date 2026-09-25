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
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] text-[10px] font-bold border border-[#e5e0d8] dark:border-[#3f3f46] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#b58d59]" />
                Guest Portal
              </span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-4xl font-light text-[#18181b] dark:text-[#f4f0e8] tracking-tight mt-2">
              My Rental Itinerary
            </h1>
            <p className="text-[#71717a] dark:text-[#a1a1aa] text-xs sm:text-sm mt-1">
              Review reservation progress, connect with hosts, and provide feedback on completed stays.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full transition-all shadow-editorial w-fit"
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

        {/* Content Area */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] flex items-center justify-center text-[#18181b] dark:text-[#d4b996] animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-[#71717a] dark:text-[#a1a1aa] font-medium text-xs uppercase tracking-wider">Retrieving your reservations...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 text-center text-rose-800 dark:text-rose-300 text-sm font-semibold max-w-md mx-auto">
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-[#1c1c20] rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] p-12 text-center max-w-lg mx-auto shadow-editorial space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-editorial text-2xl font-light text-[#18181b] dark:text-[#f4f0e8]">No {filterTab !== 'all' ? filterTab : ''} bookings on record</h3>
            <p className="text-xs sm:text-sm text-[#71717a] dark:text-[#a1a1aa] max-w-xs mx-auto">
              You don't have any bookings matching this category. Discover verified luxury properties and plan your next journey!
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full shadow-editorial transition-all cursor-pointer"
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
                  className="bg-white dark:bg-[#1c1c20] rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#b58d59] dark:hover:border-[#d4b996] transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#2e2e34] shrink-0">
                      {prop?.images && prop.images.length > 0 ? (
                        <img src={prop.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#71717a] dark:text-[#a1a1aa] bg-[#f4f0e8] dark:bg-[#27272a]">
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
                        <span className="text-[11px] text-[#71717a] dark:text-[#a1a1aa]">
                          Reserved on {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-editorial text-lg font-bold text-[#18181b] dark:text-[#f4f0e8] line-clamp-1">
                        {prop?.title || 'Property Listing'}
                      </h3>

                      <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#b58d59] shrink-0" />
                        <span>{prop?.location}, {prop?.city}</span>
                      </p>

                      <div className="flex items-center gap-4 text-xs text-[#52525b] dark:text-[#d4d4d8] pt-1 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#d4b996]" />
                          {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{booking.guests} Guest(s)</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-[#f4f0e8] dark:border-[#2e2e34] gap-3">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-[#71717a] dark:text-[#a1a1aa] block font-bold uppercase tracking-wider">Total Value</span>
                      <span className="font-editorial text-xl font-bold text-[#18181b] dark:text-[#d4b996]">
                        ₹{booking.totalPrice?.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {prop && (
                        <Link
                          to={`/properties/${prop._id}`}
                          className="px-4 py-2 bg-[#f4f0e8] hover:bg-[#ede7dc] dark:bg-[#27272a] dark:hover:bg-[#323236] text-[#18181b] dark:text-[#f4f0e8] text-xs font-semibold uppercase tracking-wider rounded-full transition-colors border border-[#e5e0d8] dark:border-[#3f3f46]"
                        >
                          View Listing
                        </Link>
                      )}

                      {canReview && prop && (
                        <button
                          onClick={() => handleOpenReview(prop)}
                          className="px-4 py-2 bg-[#f4f0e8] hover:bg-[#ede7dc] dark:bg-[#27272a] dark:hover:bg-[#323236] text-[#18181b] dark:text-[#d4b996] text-xs font-semibold uppercase tracking-wider rounded-full transition-colors cursor-pointer flex items-center gap-1.5 border border-[#e5e0d8] dark:border-[#3f3f46]"
                        >
                          <Star className="w-3.5 h-3.5 fill-[#b58d59] text-[#b58d59]" />
                          <span>Review</span>
                        </button>
                      )}

                      {canCancel && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-semibold uppercase tracking-wider rounded-full border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1c1c20] rounded-[2.5rem] max-w-md w-full p-7 sm:p-8 shadow-2xl space-y-5 animate-fadeIn border border-[#e5e0d8] dark:border-[#2e2e34]">
            <div className="flex items-center justify-between border-b border-[#f4f0e8] dark:border-[#2e2e34] pb-3">
              <h3 className="font-editorial text-xl font-bold text-[#18181b] dark:text-[#f4f0e8] flex items-center gap-2">
                <Star className="w-5 h-5 text-[#b58d59] fill-[#b58d59]" />
                <span>Rate & Review Stay</span>
              </h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="p-1.5 text-[#71717a] hover:text-[#18181b] dark:text-[#a1a1aa] dark:hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-[10px] text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-wider font-bold">Reviewing:</p>
              <h4 className="text-sm font-bold text-[#18181b] dark:text-[#f4f0e8] mt-0.5">{reviewProperty?.title}</h4>
            </div>

            {reviewSuccess && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs rounded-2xl font-bold">
                {reviewSuccess}
              </div>
            )}

            {reviewError && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs rounded-2xl font-bold">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#18181b] dark:text-[#f4f0e8] uppercase tracking-wider mb-2">
                  Rating (1 to 5 stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                        rating >= num ? 'text-[#b58d59]' : 'text-stone-300 dark:text-stone-700 hover:text-[#b58d59]'
                      }`}
                    >
                      <Star className="w-7 h-7 fill-current" />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#18181b] dark:text-[#f4f0e8] ml-2">{rating} / 5</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#18181b] dark:text-[#f4f0e8] uppercase tracking-wider" htmlFor="comment">
                  Your Feedback *
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your stay, amenities, cleanliness, and overall experience..."
                  className="w-full px-4 py-3 bg-[#fbfbf9] dark:bg-[#121214] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-2xl text-xs font-medium text-[#18181b] dark:text-[#f4f0e8] focus:outline-none focus:ring-1 focus:ring-[#b58d59]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] hover:bg-[#f4f0e8] dark:hover:bg-[#27272a] rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-6 py-2.5 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] text-xs font-semibold uppercase tracking-wider rounded-full shadow-editorial disabled:opacity-50 cursor-pointer"
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
