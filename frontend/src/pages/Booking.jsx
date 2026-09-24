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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium text-sm">Loading booking checkout...</p>
      </div>
    );
  }

  if (successBooking) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 py-12">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 text-center max-w-lg shadow-xl space-y-6 animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
              Booking Request Received
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-3">Reservation Pending Confirmation</h2>
            <p className="text-slate-500 text-sm mt-1">
              Your booking request for <strong className="text-slate-800">{property?.title}</strong> has been submitted to the host.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Dates:</span>
              <span className="font-bold text-slate-800">
                {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()} ({diffDays} nights)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Guests:</span>
              <span className="font-bold text-slate-800">{guests} Guest(s)</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-800">Estimated Total:</span>
              <span className="font-black text-slate-900 text-sm">₹{estimatedTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/my-bookings"
              className="flex-1 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all text-center"
            >
              View My Bookings
            </Link>
            <Link
              to="/properties"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all text-center"
            >
              Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            to={`/properties/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Property Details
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Confirm & Book Rental</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review dates and reserve your stay securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Booking Form (2 Cols) */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Reservation Dates & Guests
            </h2>

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Booking unavailable</p>
                  <p className="text-xs text-rose-700 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="checkin">
                    Check-in Date *
                  </label>
                  <input
                    id="checkin"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="checkout">
                    Check-out Date *
                  </label>
                  <input
                    id="checkout"
                    type="date"
                    required
                    min={startDate || new Date().toISOString().split('T')[0]}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="guests">
                  Number of Guests
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Price Calculation
                </h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Rate per night:</span>
                    <span className="font-semibold text-slate-800">₹{pricePerNight.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stay duration:</span>
                    <span className="font-semibold text-slate-800">{diffDays} {diffDays === 1 ? 'night' : 'nights'}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                    <span className="font-bold text-slate-900">Total Price:</span>
                    <span className="font-black text-indigo-700 text-base">₹{estimatedTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Request...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm & Request Booking</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Property Summary Card (1 Col) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 h-fit">
            <h3 className="text-sm font-bold text-slate-900">Property Details</h3>

            {property?.images && property.images.length > 0 ? (
              <div className="h-40 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
              </div>
            ) : null}

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {property?.propertyType}
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">{property?.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{property?.location}, {property?.city}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <p>Hosted by: <strong className="text-slate-700">{property?.owner?.name}</strong></p>
              <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified host listing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
