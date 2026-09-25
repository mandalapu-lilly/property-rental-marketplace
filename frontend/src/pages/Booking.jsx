import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
} from 'lucide-react';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  // Form states
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 8);

  const [startDate, setStartDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(nextWeek.toISOString().split('T')[0]);
  const [guests, setGuests] = useState(1);

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

  // Calculate nights and estimated total price
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const pricePerNight = property ? Number(property.price) || 0 : 0;
  const estimatedTotal = diffDays * pricePerNight;

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
        <p className="text-[#71717a] dark:text-[#a1a1aa] font-medium text-xs uppercase tracking-wider">Preparing checkout & reservation summary...</p>
      </div>
    );
  }

  if (successBooking) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#fbfbf9] dark:bg-[#121214] py-16">
        <div className="bg-white dark:bg-[#1c1c20] p-8 sm:p-12 rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] text-center max-w-lg shadow-editorial-lg space-y-7 animate-fadeIn">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-emerald-100 dark:border-emerald-900/50">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <span className="inline-block text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/50">
              Reservation Confirmed with Host
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-light text-[#18181b] dark:text-[#f4f0e8] tracking-tight">Stay Successfully Requested</h2>
            <p className="text-[#71717a] dark:text-[#a1a1aa] text-xs sm:text-sm leading-relaxed">
              Your reservation request for <strong className="text-[#18181b] dark:text-[#f4f0e8] font-bold">{property?.title}</strong> has been transmitted. The host will confirm availability shortly.
            </p>
          </div>

          <div className="p-5 bg-[#f4f0e8] dark:bg-[#27272a] rounded-2xl border border-[#e5e0d8] dark:border-[#3f3f46] text-left space-y-3 text-xs text-[#52525b] dark:text-[#d4d4d8]">
            <div className="flex justify-between items-center">
              <span className="text-[#71717a] dark:text-[#a1a1aa] font-medium">Selected Dates:</span>
              <span className="font-bold text-[#18181b] dark:text-[#f4f0e8]">
                {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()} ({diffDays} nights)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#71717a] dark:text-[#a1a1aa] font-medium">Occupancy:</span>
              <span className="font-bold text-[#18181b] dark:text-[#f4f0e8]">{guests} Guest(s)</span>
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-[#e5e0d8] dark:border-[#3f3f46]">
              <span className="font-bold text-[#18181b] dark:text-[#f4f0e8]">Total Booking Value:</span>
              <span className="font-editorial font-bold text-[#18181b] dark:text-[#d4b996] text-lg">₹{estimatedTotal.toLocaleString()}</span>
            </div>
          </div>

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
              Explore More Stays
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
          <h1 className="font-editorial text-3xl sm:text-5xl font-light text-[#18181b] dark:text-[#f4f0e8] tracking-tight">Confirm & Reserve</h1>
          <p className="text-xs sm:text-sm text-[#71717a] dark:text-[#a1a1aa] mt-1 font-normal">
            Specify check-in dates and lock in your reservation with host protection guarantee.
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
                  <p className="font-bold">Reservation Not Available</p>
                  <p className="text-rose-700 dark:text-rose-400 mt-0.5">{error}</p>
                </div>
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
                    onChange={(e) => setStartDate(e.target.value)}
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

              {/* Price Calculation Summary */}
              <div className="p-5 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#3f3f46] space-y-3">
                <h3 className="text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-wider">
                  Transparent Pricing
                </h3>
                <div className="space-y-2.5 text-xs text-[#52525b] dark:text-[#d4d4d8]">
                  <div className="flex justify-between items-center">
                    <span>Nightly Rate:</span>
                    <span className="font-bold text-[#18181b] dark:text-[#f4f0e8]">₹{pricePerNight.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Duration:</span>
                    <span className="font-bold text-[#18181b] dark:text-[#f4f0e8]">{diffDays} {diffDays === 1 ? 'night' : 'nights'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t border-[#e5e0d8] dark:border-[#3f3f46]">
                    <span className="font-bold text-[#18181b] dark:text-[#f4f0e8]">Total Stay Price:</span>
                    <span className="font-editorial font-bold text-[#18181b] dark:text-[#d4b996] text-lg">₹{estimatedTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] active:scale-[0.98] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full shadow-editorial transition-all cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Request...</span>
                  </>
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
