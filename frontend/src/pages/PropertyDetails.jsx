import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

export default function PropertyDetails() {
  const { id } = useParams();
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
        await api.post(`/api/favorites/${id}`);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  const isOwnerOrAdmin =
    isAuthenticated &&
    property &&
    (user?.id === property.owner?._id || user?._id === property.owner?._id || user?.role === 'admin');

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this property listing?')) {
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/api/properties/${id}`);
      navigate('/my-properties', {
        state: { message: 'Property deleted successfully' },
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete property');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium text-sm">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md shadow-sm space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Property Not Found</h2>
          <p className="text-slate-500 text-sm">{error || 'The requested property listing does not exist.'}</p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#fafafa] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors w-fit px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stays</span>
          </Link>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Compare Button */}
            {property && (
              <button
                onClick={() => toggleCompare(property)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isInCompare(property._id)
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isInCompare(property._id) ? 'In Compare (✓)' : 'Add to Compare'}</span>
              </button>
            )}

            {/* Wishlist Heart Button */}
            <button
              onClick={toggleFavorite}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current text-rose-600' : ''}`} />
              <span>{isFavorite ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
            </button>

            {isOwnerOrAdmin && (
              <>
                <Link
                  to={`/properties/edit/${property._id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Listing</span>
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Title & Gallery */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-extrabold tracking-wide">
                  {property.propertyType}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    property.status === 'available'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {property.status}
                </span>
                {(property.verificationStatus === 'approved' || !property.verificationStatus) && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ✓ Verified Stay
                  </span>
                )}
                {property.totalReviews > 0 && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                    {property.averageRating?.toFixed(1)} ({property.totalReviews} {property.totalReviews === 1 ? 'review' : 'reviews'})
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {property.title}
              </h1>
              <p className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm font-medium">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>
                  {property.address}, {property.location}, {property.city}, {property.state},{' '}
                  {property.country}
                </span>
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/70 shrink-0 text-left md:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Monthly Rate</span>
              <div className="flex items-baseline md:justify-end gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  ₹{property.price?.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/mo</span>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          {property.images && property.images.length > 0 ? (
            <div className="space-y-3.5">
              <div className="h-80 sm:h-[450px] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 relative shadow-inner">
                <img
                  src={property.images[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-all duration-300"
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
                          ? 'border-slate-900 scale-105 shadow-md'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 rounded-3xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200 flex flex-col items-center justify-center text-indigo-400 space-y-2">
              <Building2 className="w-16 h-16" />
              <span className="text-sm font-semibold text-slate-500">No Image Uploaded</span>
            </div>
          )}

          {/* Key Specs Row */}
          <div className="grid grid-cols-3 gap-4 p-5 bg-slate-50/80 rounded-2xl border border-slate-200/60">
            <div className="flex flex-col items-center justify-center text-center">
              <Bed className="w-5 h-5 text-indigo-600 mb-1" />
              <span className="text-lg font-extrabold text-slate-900">{property.bedrooms}</span>
              <span className="text-xs text-slate-400 font-semibold">Bedrooms</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center border-x border-slate-200">
              <Bath className="w-5 h-5 text-indigo-600 mb-1" />
              <span className="text-lg font-extrabold text-slate-900">{property.bathrooms}</span>
              <span className="text-xs text-slate-400 font-semibold">Bathrooms</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <Maximize2 className="w-5 h-5 text-indigo-600 mb-1" />
              <span className="text-lg font-extrabold text-slate-900">{property.area}</span>
              <span className="text-xs text-slate-400 font-semibold">Sq Ft Area</span>
            </div>
          </div>
        </div>

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] space-y-4">
              <h2 className="text-lg font-bold text-slate-900">About this property</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Amenities & Features</h2>
              {property.amenities && property.amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {property.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {amenity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No specific amenities listed.</p>
              )}
            </div>

            {/* Rent & Move-In Cost Estimator */}
            <CostCalculator baseRent={property.price} />

            {/* Property Availability Calendar */}
            <AvailabilityCalendar propertyId={property._id} price={property.price} />

            {/* Property Map */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span>Property Location on Map</span>
              </h2>
              <PropertyMap property={property} height="360px" />
            </div>

            {/* Reviews and Ratings Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {property.totalReviews > 0
                        ? `${property.averageRating?.toFixed(1)} Rating`
                        : 'Customer Reviews'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {property.totalReviews > 0
                        ? `Based on ${property.totalReviews} verified guest reviews`
                        : 'No reviews yet for this property.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Statistics & Rating Breakdown */}
              <ReviewStats
                reviews={reviews}
                averageRating={property.averageRating}
                totalReviews={property.totalReviews}
              />

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <p className="text-sm text-slate-500">
                    Be the first guest to review this property after completing your stay!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                            {rev.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 block">
                                {rev.user?.name || 'Verified Tenant'}
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Verified Stay
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1 text-amber-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating ? 'fill-current' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed pt-1">
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
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-5 sticky top-24">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-slate-900">
                    ₹{property.price?.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold"> / mo</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  {property.status === 'available' ? 'Available' : 'Reserved'}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Minimum Stay</span>
                  <span className="font-bold text-slate-900">1 Month</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit</span>
                  <span className="font-bold text-slate-900">1 Month Rent</span>
                </div>
                <div className="flex justify-between">
                  <span>Host Verified</span>
                  <span className="font-bold text-emerald-600">Yes</span>
                </div>
              </div>

              <Link
                to={`/properties/${property._id}/book`}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-indigo-600 active:bg-slate-950 text-white font-bold text-sm rounded-xl shadow-lg transition-all text-center"
              >
                <span>Reserve Stay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Host Details */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Host Details</h3>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-800 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {property.owner?.name?.charAt(0) || 'H'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{property.owner?.name || 'Property Host'}</h4>
                  <p className="text-[11px] text-slate-500 capitalize">{property.owner?.role || 'Host'}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{property.owner?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Listed on {new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Contact Host Button */}
              {isAuthenticated && user?.id !== property.owner?._id && user?._id !== property.owner?._id && (
                <button
                  type="button"
                  onClick={() => setIsInquiryOpen(true)}
                  className="w-full mt-3 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
