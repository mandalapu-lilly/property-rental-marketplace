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
  const pricePerNight = property ? Math.max(1, Math.round(property.price / 30)) : 0;
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
      <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-slate-500 font-medium text-sm">Preparing checkout & reservation summary...</p>
      </div>
    );
  }

  if (successBooking) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#fafafa] py-16">
        <div className="bg-white p-8 sm:p-12 rounded-[36px] border border-slate-200/80 text-center max-w-lg shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] space-y-7 animate-fadeIn">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-emerald-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <span className="inline-block text-[11px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              Reservation Confirmed with Host
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Stay Successfully Requested</h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Your reservation request for <strong className="text-slate-800 font-bold">{property?.title}</strong> has been transmitted. The host will confirm availability shortly.
            </p>
          </div>

          <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/60 text-left space-y-3 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Selected Dates:</span>
              <span className="font-bold text-slate-800">
                {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()} ({diffDays} nights)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Occupancy:</span>
              <span className="font-bold text-slate-800">{guests} Guest(s)</span>
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-slate-200">
              <span className="font-bold text-slate-900">Total Booking Value:</span>
              <span className="font-black text-slate-900 text-base">₹{estimatedTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/my-bookings"
              className="flex-1 py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-lg transition-all text-center"
            >
              View My Bookings
            </Link>
            <Link
              to="/properties"
              className="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all text-center"
            >
              Explore More Stays
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            to={`/properties/${id}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 mb-3 group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Listing</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Confirm & Reserve</h1>
          <p className="text-sm text-slate-500 mt-1">
            Specify check-in dates and lock in your reservation with host protection guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Booking Form (2 Cols) */}
          <div className="md:col-span-2 bg-white p-7 sm:p-9 rounded-[32px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Stay Schedule & Occupancy
              </h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Secure Checkout
              </span>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs font-semibold animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Reservation Not Available</p>
                  <p className="text-rose-700 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="checkin">
                    Check-in Date *
                  </label>
                  <input
                    id="checkin"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="checkout">
                    Check-out Date *
                  </label>
                  <input
                    id="checkout"
                    type="date"
                    required
                    min={startDate || new Date().toISOString().split('T')[0]}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="guests">
                  Number of Guests
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
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
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Transparent Pricing
                </h3>
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between items-center">
                    <span>Nightly Rate (Pro-rated):</span>
                    <span className="font-bold text-slate-800">₹{pricePerNight.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Duration:</span>
                    <span className="font-bold text-slate-800">{diffDays} {diffDays === 1 ? 'night' : 'nights'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 text-sm">
                    <span className="font-bold text-slate-900">Total Stay Price:</span>
                    <span className="font-black text-slate-900 text-lg">₹{estimatedTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs rounded-2xl shadow-xl transition-all cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Request...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Confirm & Request Reservation</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Property Summary Card (1 Col) */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Property</h3>

            {property?.images && property.images.length > 0 ? (
              <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60">
                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
              </div>
            ) : null}

            <div className="space-y-1">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                {property?.propertyType}
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{property?.title}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{property?.location}, {property?.city}</span>
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <p>Hosted by: <strong className="text-slate-800 font-bold">{property?.owner?.name}</strong></p>
              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-700 flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Listing & Booking Guard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
