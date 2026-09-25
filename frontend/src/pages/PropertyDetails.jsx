import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import PropertyMap from '../components/PropertyMap';
import CostCalculator from '../components/CostCalculator';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import InquiryModal from '../components/InquiryModal';
import ReviewStats from '../components/ReviewStats';
import SimilarProperties from '../components/SimilarProperties';
import { trackRecentlyViewed } from '../components/RecentlyViewed';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  User,
  Mail,
  Shield,
  CheckCircle2,
  Calendar,
  Sparkles,
  Edit,
  Trash2,
  Loader2,
  Home,
  Tag,
  Heart,
  Star,
  MessageSquare,
  ArrowRight,
  Layers,
  ThumbsUp,
  Box,
  Eye,
  ShieldAlert,
  HelpCircle,
  Clock,
  Check,
  XCircle,
} from 'lucide-react';

export default function PropertyDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toggleCompare, isInCompare } = useCompare();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // Search parameters / Date selection state
  const initialCheckIn = searchParams.get('checkIn') || '';
  const initialCheckOut = searchParams.get('checkOut') || '';
  const initialGuests = searchParams.get('guests') || '1';

  const [selectedCheckIn, setSelectedCheckIn] = useState(initialCheckIn);
  const [selectedCheckOut, setSelectedCheckOut] = useState(initialCheckOut);
  const [selectedGuests, setSelectedGuests] = useState(initialGuests);
  const [isDateAvailable, setIsDateAvailable] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    const fetchPropertyData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [propRes, reviewsRes, similarRes] = await Promise.all([
          api.get(`/api/properties/${id}`),
          api.get(`/api/properties/${id}/reviews`).catch(() => ({ data: { reviews: [] } })),
          api.get(`/api/properties/${id}/similar`).catch(() => ({ data: { properties: [] } })),
        ]);

        const fetchedProp = propRes.data.property;
        setProperty(fetchedProp);
        setReviews(reviewsRes.data.reviews || []);
        setSimilarProperties(similarRes.data.properties || []);

        if (fetchedProp) {
          trackRecentlyViewed(fetchedProp);
        }

        // Check favorite if user is logged in
        if (isAuthenticated) {
          api.get(`/api/favorites/check/${id}`)
            .then((favRes) => setIsFavorite(favRes.data.isFavorite))
            .catch(() => {});
        }
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError(err.response?.data?.error || 'Property not found or server error');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id, isAuthenticated]);

  // Live availability verification
  useEffect(() => {
    let isSubscribed = true;
    if (selectedCheckIn && selectedCheckOut && id) {
      setCheckingAvailability(true);
      api
        .get(`/api/properties/${id}/availability`, {
          params: { startDate: selectedCheckIn, endDate: selectedCheckOut },
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
  }, [id, selectedCheckIn, selectedCheckOut]);

  // Derived nights & total calculation
  const calculatedNights = useMemo(() => {
    if (!selectedCheckIn || !selectedCheckOut) return 1;
    const start = new Date(selectedCheckIn);
    const end = new Date(selectedCheckOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [selectedCheckIn, selectedCheckOut]);

  const staySubtotal = (property?.price || 0) * calculatedNights;

  // Review highlights analysis from actual reviews
  const reviewHighlight = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      if (property?.averageRating >= 4.5) {
        return 'Guests highly rate this stay for its prime location and exceptional ambiance.';
      }
      return null;
    }
    const allText = reviews.map((r) => (r.comment || '').toLowerCase()).join(' ');
    const features = [];
    if (allText.includes('clean') || allText.includes('spotless') || allText.includes('tidy'))
      features.push('cleanliness');
    if (
      allText.includes('location') ||
      allText.includes('view') ||
      allText.includes('beach') ||
      allText.includes('central')
    )
      features.push('scenic location');
    if (
      allText.includes('host') ||
      allText.includes('staff') ||
      allText.includes('helpful') ||
      allText.includes('friendly')
    )
      features.push('attentive hospitality');
    if (
      allText.includes('peaceful') ||
      allText.includes('quiet') ||
      allText.includes('cozy') ||
      allText.includes('comfort')
    )
      features.push('peaceful comfort');

    if (features.length >= 2) {
      return `Guests especially appreciated the ${features[0]} and ${features[1]}.`;
    } else if (features.length === 1) {
      return `Guests especially appreciated the ${features[0]}.`;
    }
    return property?.averageRating >= 4.5
      ? 'Guests consistently praise this stay for comfort and ambiance.'
      : 'Guests appreciated their short stay at this residence.';
  }, [reviews, property]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Please log in to add this property to your favorites wishlist.');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/api/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post('/api/favorites', { propertyId: id });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error updating favorites:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this property listing?')) {
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/api/properties/${id}`);
      navigate('/properties');
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.error || 'Failed to delete listing.');
      setDeleting(false);
    }
  };

  const isOwnerOrAdmin =
    isAuthenticated &&
    (user?.role === 'admin' ||
      user?._id === property?.owner?._id ||
      user?.id === property?.owner?._id ||
      user?._id === property?.owner ||
      user?.id === property?.owner);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 bg-[#fbfbf9] dark:bg-[#121214]">
        <Loader2 className="w-8 h-8 text-[#18181b] dark:text-[#d4b996] animate-spin" />
        <p className="text-xs uppercase tracking-widest font-semibold text-[#71717a] dark:text-[#a1a1aa]">
          Loading residence details...
        </p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-[#fbfbf9] dark:bg-[#121214]">
        <div className="max-w-md w-full bg-white dark:bg-[#1c1c20] p-8 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial text-center space-y-4">
          <Building2 className="w-12 h-12 text-[#a1a1aa] mx-auto" />
          <h2 className="font-editorial text-3xl font-light text-[#18181b] dark:text-[#f4f0e8]">Listing Unavailable</h2>
          <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">{error || 'The requested property could not be found.'}</p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] dark:text-[#18181b] text-white font-semibold text-xs uppercase tracking-wider rounded-full transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Stays
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#fbfbf9] dark:bg-[#121214] py-10 sm:py-14 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#71717a] hover:text-[#18181b] dark:text-[#a1a1aa] dark:hover:text-[#f4f0e8] transition-colors w-fit px-4 py-2 rounded-full bg-white dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Stays</span>
          </Link>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Compare Button */}
            {property && (
              <button
                onClick={() => toggleCompare(property)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isInCompare(property._id)
                    ? 'bg-[#18181b] text-white border-[#18181b] dark:bg-[#d4b996] dark:text-[#18181b] dark:border-[#d4b996] shadow-sm'
                    : 'bg-white text-[#18181b] border-[#e5e0d8] hover:bg-[#f4f0e8] dark:bg-[#1c1c20] dark:text-[#f4f0e8] dark:border-[#2e2e34] dark:hover:bg-[#27272a]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isInCompare(property._id) ? 'In Compare (✓)' : 'Add to Compare'}</span>
              </button>
            )}

            {/* Wishlist Heart Button */}
            <button
              onClick={toggleFavorite}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-900/50'
                  : 'bg-white text-[#18181b] border-[#e5e0d8] hover:bg-[#f4f0e8] dark:bg-[#1c1c20] dark:text-[#f4f0e8] dark:border-[#2e2e34] dark:hover:bg-[#27272a]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current text-rose-600 dark:text-rose-400' : ''}`} />
              <span>{isFavorite ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
            </button>

            {isOwnerOrAdmin && (
              <>
                <Link
                  to={`/properties/edit/${property._id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full shadow-sm transition-all"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Listing</span>
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-semibold text-xs uppercase tracking-wider rounded-full border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Title & Gallery Container */}
        <div className="bg-white dark:bg-[#1c1c20] p-6 sm:p-10 rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#18181b] dark:bg-[#27272a] text-white dark:text-[#d4b996] px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {property.propertyType}
                </span>
                <span
                  className={`px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    property.status === 'available'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {property.status}
                </span>
                {(property.verificationStatus === 'approved' || !property.verificationStatus) && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Verified Stay
                  </span>
                )}
                {property.totalReviews > 0 && (
                  <span className="inline-flex items-center gap-1 bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#f4f0e8] border border-[#e5e0d8] dark:border-[#3f3f46] px-3.5 py-1 rounded-full text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#b58d59] text-[#b58d59]" />
                    {property.averageRating?.toFixed(1)} ({property.totalReviews} {property.totalReviews === 1 ? 'review' : 'reviews'})
                  </span>
                )}
              </div>

              <h1 className="font-editorial text-3xl sm:text-5xl font-light text-[#18181b] dark:text-[#f4f0e8] tracking-tight leading-tight">
                {property.title}
              </h1>
              <p className="flex items-center gap-1.5 text-[#71717a] dark:text-[#a1a1aa] text-xs sm:text-sm font-normal">
                <MapPin className="w-4 h-4 text-[#8c827a] dark:text-[#b58d59] shrink-0" />
                <span>
                  {property.address}, {property.location}, {property.city}, {property.state},{' '}
                  {property.country}
                </span>
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-[#f4f0e8] dark:bg-[#27272a] rounded-[2rem] border border-[#e5e0d8] dark:border-[#3f3f46] shrink-0 text-left md:text-right">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#71717a] dark:text-[#a1a1aa] block">Nightly Rate</span>
              <div className="flex items-baseline md:justify-end gap-1 mt-1">
                <span className="font-editorial text-3xl sm:text-4xl font-bold text-[#18181b] dark:text-[#d4b996]">
                  ₹{property.price?.toLocaleString()}
                </span>
                <span className="text-xs text-[#71717a] dark:text-[#a1a1aa] font-normal">/night</span>
              </div>
            </div>
          </div>

          {/* High-Res Photo Gallery */}
          {property.images && property.images.length > 0 ? (
            <div className="space-y-4">
              <div className="h-80 sm:h-[480px] w-full rounded-[2rem] overflow-hidden bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#2e2e34] relative shadow-inner">
                <img
                  src={property.images[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>

              {property.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-24 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        selectedImage === idx
                          ? 'border-[#18181b] dark:border-[#d4b996] scale-105 shadow-md'
                          : 'border-[#e5e0d8] dark:border-[#3f3f46] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 rounded-[2rem] bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#2e2e34] flex flex-col items-center justify-center text-[#71717a] dark:text-[#a1a1aa] space-y-2">
              <Building2 className="w-16 h-16" />
              <span className="text-xs uppercase tracking-wider font-semibold text-[#71717a] dark:text-[#a1a1aa]">No Image Uploaded</span>
            </div>
          )}

          {/* Key Specs Row */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-[#fbfbf9] dark:bg-[#161618] rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34]">
            <div className="flex flex-col items-center justify-center text-center">
              <Bed className="w-5 h-5 text-[#8c827a] dark:text-[#d4b996] mb-1" />
              <span className="text-xl font-bold text-[#18181b] dark:text-[#f4f0e8]">{property.bedrooms}</span>
              <span className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-wider font-semibold">Bedrooms</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center border-x border-[#e5e0d8] dark:border-[#2e2e34]">
              <Bath className="w-5 h-5 text-[#8c827a] dark:text-[#d4b996] mb-1" />
              <span className="text-xl font-bold text-[#18181b] dark:text-[#f4f0e8]">{property.bathrooms}</span>
              <span className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-wider font-semibold">Bathrooms</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <Maximize2 className="w-5 h-5 text-[#8c827a] dark:text-[#d4b996] mb-1" />
              <span className="text-xl font-bold text-[#18181b] dark:text-[#f4f0e8]">{property.area}</span>
              <span className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-wider font-semibold">Sq Ft Area</span>
            </div>
          </div>
        </div>

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white dark:bg-[#1c1c20] p-8 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#18181b] dark:text-[#f4f0e8]">About this sanctuary</h2>
              <p className="text-[#52525b] dark:text-[#d4d4d8] text-sm leading-relaxed whitespace-pre-line font-normal">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-[#1c1c20] p-8 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#18181b] dark:text-[#f4f0e8]">Amenities & Features</h2>
              {property.amenities && property.amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {property.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#3f3f46] text-[#18181b] dark:text-[#f4f0e8] text-xs font-semibold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      {amenity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] italic">No specific amenities listed.</p>
              )}
            </div>

            {/* Rent & Move-In Cost Estimator */}
            <CostCalculator baseRent={property.price} />

            {/* Property Availability Calendar */}
            <AvailabilityCalendar propertyId={property._id} price={property.price} />

            {/* Property Map */}
            <div className="bg-white dark:bg-[#1c1c20] p-8 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#18181b] dark:text-[#f4f0e8] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#8c827a] dark:text-[#b58d59]" />
                <span>Property Location on Map</span>
              </h2>
              <PropertyMap property={property} height="360px" />
            </div>

            {/* Reviews and Ratings Section */}
            <div className="bg-white dark:bg-[#1c1c20] p-8 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-6">
              <div className="flex items-center justify-between border-b border-[#f4f0e8] dark:border-[#2e2e34] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] rounded-full">
                    <Star className="w-6 h-6 fill-[#b58d59] text-[#b58d59]" />
                  </div>
                  <div>
                    <h2 className="font-editorial text-2xl font-bold text-[#18181b] dark:text-[#f4f0e8]">
                      {property.totalReviews > 0
                        ? `${property.averageRating?.toFixed(1)} Rating`
                        : 'Guest Reviews'}
                    </h2>
                    <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
                      {property.totalReviews > 0
                        ? `Based on ${property.totalReviews} verified guest reviews`
                        : 'No reviews yet for this property.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Statistics & Rating Breakdown */}
              {reviewHighlight && (
                <div className="p-4 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#3f3f46] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-medium text-[#18181b] dark:text-[#fbfbf9] italic">
                    "{reviewHighlight}"
                  </p>
                </div>
              )}

              <ReviewStats
                reviews={reviews}
                averageRating={property.averageRating}
                totalReviews={property.totalReviews}
              />

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <p className="text-sm text-[#71717a] dark:text-[#a1a1aa]">
                    Be the first guest to review this property after completing your stay!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-5 rounded-2xl bg-[#fbfbf9] dark:bg-[#161618] border border-[#e5e0d8] dark:border-[#2e2e34] space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#18181b] dark:bg-[#27272a] text-white dark:text-[#d4b996] text-xs font-bold flex items-center justify-center font-editorial italic">
                            {rev.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#18181b] dark:text-[#f4f0e8] block">
                                {rev.user?.name || 'Verified Guest'}
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-2 py-0.2 rounded-full flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Verified Stay
                              </span>
                            </div>
                            <span className="text-[10px] text-[#a1a1aa] dark:text-[#71717a]">
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1 text-[#b58d59]">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating ? 'fill-current' : 'text-[#e5e0d8] dark:text-[#3f3f46]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-[#52525b] dark:text-[#d4d4d8] leading-relaxed pt-1">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (1 Col): Booking Card & Host Card */}
          <div className="space-y-6">
            {/* Booking Action Card */}
            <div className="bg-white dark:bg-[#1c1c20] p-6 sm:p-8 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial-lg space-y-5 sticky top-24">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-editorial text-3xl font-bold text-[#18181b] dark:text-[#d4b996]">
                    ₹{property.price?.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#71717a] dark:text-[#a1a1aa] font-normal"> / night</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-3 py-1 rounded-full">
                  {property.status === 'available' ? 'Available' : 'Reserved'}
                </span>
              </div>

              {/* Date & Guest Picker Controls */}
              <div className="p-4 bg-[#fbfbf9] dark:bg-[#141417] rounded-2xl border border-[#e5e0d8] dark:border-[#27272a] space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedCheckIn}
                      onChange={(e) => {
                        setSelectedCheckIn(e.target.value);
                        if (selectedCheckOut && new Date(e.target.value) >= new Date(selectedCheckOut)) {
                          setSelectedCheckOut('');
                        }
                      }}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-xl text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] focus:outline-none focus:ring-1 focus:ring-[#b58d59]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] mb-1">
                      Check-out
                    </label>
                    <input
                      type="date"
                      min={selectedCheckIn || new Date().toISOString().split('T')[0]}
                      value={selectedCheckOut}
                      onChange={(e) => setSelectedCheckOut(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-xl text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] focus:outline-none focus:ring-1 focus:ring-[#b58d59]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] mb-1">
                    Guests
                  </label>
                  <select
                    value={selectedGuests}
                    onChange={(e) => setSelectedGuests(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-xl text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] focus:outline-none focus:ring-1 focus:ring-[#b58d59]"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                  </select>
                </div>
              </div>

              {/* Availability Alert */}
              {selectedCheckIn && selectedCheckOut && !isDateAvailable && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Unavailable for selected dates</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="p-4 bg-[#f4f0e8] dark:bg-[#27272a] rounded-2xl border border-[#e5e0d8] dark:border-[#3f3f46] space-y-2 text-xs text-[#52525b] dark:text-[#d4d4d8]">
                <div className="flex justify-between items-center">
                  <span>
                    ₹{property.price?.toLocaleString()} × {calculatedNights} {calculatedNights === 1 ? 'night' : 'nights'}
                  </span>
                  <span className="font-semibold text-[#18181b] dark:text-[#f4f0e8]">
                    ₹{staySubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Stay subtotal</span>
                  <span className="font-semibold text-[#18181b] dark:text-[#f4f0e8]">₹{staySubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Service fee</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Included</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Taxes</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Included in rate</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#e5e0d8] dark:border-[#3f3f46] text-xs">
                  <span className="font-bold text-[#18181b] dark:text-[#f4f0e8]">Estimated Total</span>
                  <span className="font-editorial font-bold text-[#18181b] dark:text-[#d4b996] text-base">
                    ₹{staySubtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Cancellation Policy Banner */}
              <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Free Cancellation</span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-snug">
                  Cancel up to 24 hours before check-in for a full refund.
                </p>
              </div>

              {/* Reserve Button */}
              {isDateAvailable ? (
                <Link
                  to={`/properties/${property._id}/book?checkIn=${selectedCheckIn}&checkOut=${selectedCheckOut}&guests=${selectedGuests}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full shadow-editorial transition-all text-center cursor-pointer"
                >
                  <span>Reserve Sanctuary</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-4 bg-stone-300 dark:bg-stone-800 text-stone-500 font-semibold text-xs uppercase tracking-wider rounded-full cursor-not-allowed text-center"
                >
                  Unavailable for selected dates
                </button>
              )}
            </div>

            {/* Host Details */}
            <div className="bg-white dark:bg-[#1c1c20] p-6 sm:p-8 rounded-[2rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#71717a] dark:text-[#a1a1aa]">Host Profile</h3>
              <div className="flex items-center gap-3 p-3.5 bg-[#f4f0e8] dark:bg-[#27272a] rounded-2xl border border-[#e5e0d8] dark:border-[#3f3f46]">
                <div className="w-10 h-10 rounded-full bg-[#18181b] dark:bg-[#121214] text-white dark:text-[#d4b996] flex items-center justify-center font-editorial italic text-base">
                  {property.owner?.name?.charAt(0) || 'H'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#18181b] dark:text-[#f4f0e8]">{property.owner?.name || 'Property Host'}</h4>
                  <p className="text-[10px] uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] font-semibold">{property.owner?.role || 'Host'}</p>
                </div>
              </div>

              <div className="space-y-2 pt-1 text-xs text-[#71717a] dark:text-[#a1a1aa]">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#a1a1aa] dark:text-[#71717a]" />
                  <span className="truncate">{property.owner?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#a1a1aa] dark:text-[#71717a]" />
                  <span>Listed on {new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Contact Host Button */}
              {isAuthenticated && user?.id !== property.owner?._id && user?._id !== property.owner?._id && (
                <button
                  type="button"
                  onClick={() => setIsInquiryOpen(true)}
                  className="w-full mt-3 py-3 px-4 bg-[#f4f0e8] hover:bg-[#ede7dc] dark:bg-[#27272a] dark:hover:bg-[#323236] text-[#18181b] dark:text-[#f4f0e8] font-semibold text-xs uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#ded7cb] dark:border-[#3f3f46]"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Host an Inquiry</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inquiry Modal */}
        <InquiryModal
          isOpen={isInquiryOpen}
          onClose={() => setIsInquiryOpen(false)}
          property={property}
          hostName={property.owner?.name}
        />

        {/* Similar / Recommended Properties Section */}
        <SimilarProperties currentProperty={property} />
      </div>
    </div>
  );
}
