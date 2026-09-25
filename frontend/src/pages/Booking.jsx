import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Calendar,
  Users,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Lock,
  Check,
  HelpCircle,
  XCircle,
  Hash,
} from 'lucide-react';

export default function Booking() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  // Form states with fallback or search param defaults
  const paramCheckIn = searchParams.get('checkIn');
  const paramCheckOut = searchParams.get('checkOut');
  const paramGuests = searchParams.get('guests');

  const defaultTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const defaultNextWeek = () => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(paramCheckIn || defaultTomorrow());
  const [endDate, setEndDate] = useState(paramCheckOut || defaultNextWeek());
  const [guests, setGuests] = useState(paramGuests ? Number(paramGuests) : 1);
  const [isDateAvailable, setIsDateAvailable] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/api/properties/${id}`);
        setProperty(res.data.property);
      } catch (err) {
        console.error('Error fetching property for booking:', err);
        setError(err.response?.data?.error || 'Property not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Live availability verification
  useEffect(() => {
    let isSubscribed = true;
    if (startDate && endDate && id) {
      setCheckingAvailability(true);
      api
        .get(`/api/properties/${id}/availability`, {
          params: { startDate, endDate },
        })
        .then((res) => {
          if (isSubscribed) {
            setIsDateAvailable(res.data?.available !== false);
          }
        })
        .catch(() => {
          if (isSubscribed) setIsDateAvailable(true);
        })
        .finally(() => {
          if (isSubscribed) setCheckingAvailability(false);
        });
    } else {
      setIsDateAvailable(true);
      setCheckingAvailability(false);
    }
    return () => {
      isSubscribed = false;
    };
  }, [id, startDate, endDate]);

  // Calculate nights and price breakdown
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const pricePerNight = property ? Number(property.price) || 0 : 0;
  const staySubtotal = diffDays * pricePerNight;
  const estimatedTotal = staySubtotal;

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('Please select both check-in and check-out dates.');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    if (!isDateAvailable) {
      setError('Unavailable for selected dates. Please choose different dates.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post('/api/bookings', {
        propertyId: id,
        startDate,
        endDate,
        guests: Number(guests),
      });

      setSuccessBooking(res.data.booking);
    } catch (err) {
      console.error('Booking error:', err);
      setError(
        err.response?.data?.error ||
          'Failed to complete booking request. Please check date availability.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-4 bg-[#fbfbf9] dark:bg-[#121214]">
        <div className="w-12 h-12 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] flex items-center justify-center text-[#18181b] dark:text-[#d4b996] animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-[#71717a] dark:text-[#a1a1aa] font-medium text-xs uppercase tracking-wider">
          Preparing checkout & reservation summary...
        </p>
      </div>
    );
  }

  // Polished Booking Confirmation Screen
  if (successBooking) {
    const bookingRef = successBooking._id || 'HST-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#fbfbf9] dark:bg-[#121214] py-16">
        <div className="bg-white dark:bg-[#1c1c20] p-8 sm:p-12 rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] text-center max-w-xl shadow-editorial-lg space-y-7 animate-fadeIn">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-emerald-100 dark:border-emerald-900/50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-block text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/50">
              ✓ Booking Confirmed
            </span>
            <h2 className="font-editorial text-3xl font-light text-[#18181b] dark:text-[#f4f0e8] tracking-tight">
              Reservation Transmitted
            </h2>
            <p className="text-[#71717a] dark:text-[#a1a1aa] text-xs sm:text-sm leading-relaxed">
              Your booking for <strong className="text-[#18181b] dark:text-[#f4f0e8] font-bold">{property?.title}</strong> is confirmed. A receipt has been generated.
            </p>
          </div>

          {/* Detailed Summary Card */}
          <div className="p-6 bg-[#f4f0e8] dark:bg-[#27272a] rounded-2xl border border-[#e5e0d8] dark:border-[#3f3f46] text-left space-y-3.5 text-xs text-[#52525b] dark:text-[#d4d4d8]">
            <div className="flex justify-between items-center pb-2.5 border-b border-[#e5e0d8] dark:border-[#3f3f46]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-[#b58d59]" />
                Booking Reference ID:
              </span>
              <span className="font-mono font-bold text-[#18181b] dark:text-[#d4b996] text-[11px]">
                {bookingRef}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#71717a] dark:text-[#a1a1aa]">Property:</span>
              <span className="font-bold text-[#18181b] dark:text-[#f4f0e8]">{property?.title}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#71717a] dark:text-[#a1a1aa]">Location:</span>
              <span className="font-medium text-[#18181b] dark:text-[#f4f0e8]">{property?.location}, {property?.city}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#71717a] dark:text-[#a1a1aa]">Check-in & Check-out:</span>
              <span className="font-bold text-[#18181b] dark:text-[#f4f0e8]">
                {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#71717a] dark:text-[#a1a1aa]">Duration & Guests:</span>
              <span className="font-medium text-[#18181b] dark:text-[#f4f0e8]">
                {diffDays} {diffDays === 1 ? 'Night' : 'Nights'} • {guests} {guests === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#71717a] dark:text-[#a1a1aa]">Price per Night:</span>
              <span className="font-medium text-[#18181b] dark:text-[#f4f0e8]">
                ₹{pricePerNight.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-[#e5e0d8] dark:border-[#3f3f46]">
              <span className="font-bold text-[#18181b] dark:text-[#f4f0e8] text-sm">Total Amount:</span>
              <span className="font-editorial font-bold text-[#18181b] dark:text-[#d4b996] text-xl">
                ₹{estimatedTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/my-bookings"
              className="flex-1 py-3.5 px-6 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full shadow-editorial transition-all text-center"
            >
              View My Bookings
            </Link>
            <Link
              to="/properties"
              className="py-3.5 px-6 bg-[#f4f0e8] hover:bg-[#ede7dc] dark:bg-[#27272a] dark:hover:bg-[#323236] text-[#18181b] dark:text-[#f4f0e8] font-semibold text-xs uppercase tracking-wider rounded-full transition-all text-center border border-[#e5e0d8] dark:border-[#3f3f46]"
            >
              Explore Stays
            </Link>
            <Link
              to="/support"
              className="inline-flex items-center justify-center gap-1.5 py-3.5 px-5 bg-white dark:bg-[#141417] text-[#18181b] dark:text-[#fbfbf9] font-semibold text-xs uppercase tracking-wider rounded-full transition-all text-center border border-[#e5e0d8] dark:border-[#3f3f46] hover:bg-[#f4f0e8] dark:hover:bg-[#27272a]"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#b58d59]" />
              <span>Support</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbf9] dark:bg-[#121214] py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            to={`/properties/${id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#71717a] hover:text-[#18181b] dark:text-[#a1a1aa] dark:hover:text-[#f4f0e8] mb-3 group transition-colors px-4 py-2 rounded-full bg-white dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#2e2e34]"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Listing</span>
          </Link>
          <h1 className="font-editorial text-3xl sm:text-5xl font-light text-[#18181b] dark:text-[#f4f0e8] tracking-tight">
            Confirm & Reserve
          </h1>
          <p className="text-xs sm:text-sm text-[#71717a] dark:text-[#a1a1aa] mt-1 font-normal">
            Review your stay schedule and finalize your reservation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Booking Form (2 Cols) */}
          <div className="md:col-span-2 bg-white dark:bg-[#1c1c20] p-7 sm:p-9 rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-6">
            <div className="flex items-center justify-between border-b border-[#f4f0e8] dark:border-[#2e2e34] pb-4">
              <h2 className="font-editorial text-xl font-bold text-[#18181b] dark:text-[#f4f0e8] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#b58d59]" />
                Stay Schedule & Occupancy
              </h2>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-1 uppercase tracking-wider">
                <Lock className="w-3 h-3" /> Secure Checkout
              </span>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs font-semibold animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Reservation Notice</p>
                  <p className="text-rose-700 dark:text-rose-400 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {!isDateAvailable && (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs font-bold">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Unavailable for selected dates. Please adjust your stay schedule.</span>
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-[#18181b] dark:text-[#f4f0e8] uppercase tracking-wider" htmlFor="checkin">
                    Check-in Date *
                  </label>
                  <input
                    id="checkin"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate && new Date(e.target.value) >= new Date(endDate)) {
                        setEndDate('');
                      }
                    }}
                    className="w-full px-4 py-3 bg-[#fbfbf9] dark:bg-[#121214] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-2xl text-xs font-semibold text-[#18181b] dark:text-[#f4f0e8] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-[#18181b] dark:text-[#f4f0e8] uppercase tracking-wider" htmlFor="checkout">
                    Check-out Date *
                  </label>
                  <input
                    id="checkout"
                    type="date"
                    required
                    min={startDate || new Date().toISOString().split('T')[0]}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#fbfbf9] dark:bg-[#121214] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-2xl text-xs font-semibold text-[#18181b] dark:text-[#f4f0e8] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#18181b] dark:text-[#f4f0e8] uppercase tracking-wider" htmlFor="guests">
                  Number of Guests
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#71717a] dark:text-[#a1a1aa]">
                    <Users className="w-4 h-4" />
                  </div>
                  <input
                    id="guests"
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#fbfbf9] dark:bg-[#121214] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-2xl text-xs font-semibold text-[#18181b] dark:text-[#f4f0e8] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
                  />
                </div>
              </div>

              {/* Cancellation Policy Box */}
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Free Cancellation Policy</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Cancel up to 24 hours before check-in for a full 100% refund. No questions asked.
                </p>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-5 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#3f3f46] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-wider">
                    Transparent Price Breakdown
                  </h3>
                  <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/50">
                    No Hidden Fees
                  </span>
                </div>
                <div className="space-y-2.5 text-xs text-[#52525b] dark:text-[#d4d4d8]">
                  <div className="flex justify-between items-center">
                    <span>
                      ₹{pricePerNight.toLocaleString()} × {diffDays} {diffDays === 1 ? 'night' : 'nights'}
                    </span>
                    <span className="font-semibold text-[#18181b] dark:text-[#f4f0e8]">
                      ₹{staySubtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Stay subtotal:</span>
                    <span className="font-semibold text-[#18181b] dark:text-[#f4f0e8]">
                      ₹{staySubtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Service fee:</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Included (₹0)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taxes:</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Included in rate</span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t border-[#e5e0d8] dark:border-[#3f3f46]">
                    <span className="font-bold text-[#18181b] dark:text-[#f4f0e8] text-sm">Total Reservation Price:</span>
                    <span className="font-editorial font-bold text-[#18181b] dark:text-[#d4b996] text-xl">
                      ₹{estimatedTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !isDateAvailable}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] active:scale-[0.98] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full shadow-editorial transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Request...</span>
                  </>
                ) : !isDateAvailable ? (
                  <span>Unavailable for selected dates</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#d4b996] dark:text-[#18181b]" />
                    <span>Confirm & Request Reservation</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Property Summary Card (1 Col) */}
          <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa]">Selected Property</h3>

            {property?.images && property.images.length > 0 ? (
              <div className="h-44 rounded-2xl overflow-hidden bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#2e2e34]">
                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
              </div>
            ) : null}

            <div className="space-y-1.5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#18181b] dark:text-[#d4b996] bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#3f3f46] px-2.5 py-0.5 rounded-full">
                {property?.propertyType}
              </span>
              <h4 className="font-bold text-[#18181b] dark:text-[#f4f0e8] text-sm leading-snug">{property?.title}</h4>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#b58d59] shrink-0" />
                <span>{property?.location}, {property?.city}</span>
              </p>
            </div>

            <div className="pt-4 border-t border-[#f4f0e8] dark:border-[#2e2e34] text-xs text-[#71717a] dark:text-[#a1a1aa] space-y-2">
              <p>Hosted by: <strong className="text-[#18181b] dark:text-[#f4f0e8] font-bold">{property?.owner?.name}</strong></p>
              <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Verified Listing & Booking Guard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

