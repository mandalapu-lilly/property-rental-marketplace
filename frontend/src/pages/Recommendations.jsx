import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Sparkles,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Star,
  SlidersHorizontal,
  CheckCircle2,
  Heart,
  ArrowRight,
  RotateCcw,
  Building,
  TrendingUp,
  Loader2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function Recommendations() {
  const { isAuthenticated, user } = useAuth();

  const [recommendations, setRecommendations] = useState([]);
  const [profileApplied, setProfileApplied] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  // Interactive Preference Tuner State
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [showTuner, setShowTuner] = useState(false);

  // Fetch user favorites to highlight wishlist state
  useEffect(() => {
    if (isAuthenticated) {
      api
        .get('/api/favorites')
        .then((res) => {
          if (res.data && res.data.favorites) {
            const ids = new Set(
              res.data.favorites.map((f) => (f.property?._id ? f.property._id : f.property))
            );
            setFavorites(ids);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (city.trim()) params.city = city.trim();
      if (propertyType && propertyType !== 'All') params.propertyType = propertyType;
      if (maxPrice && Number(maxPrice) > 0) params.maxPrice = Number(maxPrice);
      if (bedrooms && bedrooms !== 'Any') params.bedrooms = Number(bedrooms);

      const res = await api.get('/api/recommendations', { params });

      if (res.data && res.data.success) {
        setRecommendations(res.data.recommendations || []);
        setProfileApplied(res.data.profileApplied || null);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      setError('Unable to calculate recommendations. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [city, propertyType, maxPrice, bedrooms]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleToggleFavorite = async (e, propertyId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please sign in to save properties to your wishlist.');
      return;
    }

    try {
      if (favorites.has(propertyId)) {
        await api.delete(`/api/favorites/${propertyId}`);
        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(propertyId);
          return next;
        });
      } else {
        await api.post('/api/favorites', { propertyId });
        setFavorites((prev) => new Set(prev).add(propertyId));
      }
    } catch (err) {
      console.error('Favorite toggle failed:', err);
    }
  };

  const handleResetFilters = () => {
    setCity('');
    setPropertyType('');
    setMaxPrice('');
    setBedrooms('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 mb-8 shadow-xl border border-indigo-900/50">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI-Powered Smart Match Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Recommended for You
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-300">
              Personalized property selections matching your budget, preferred locations, and lifestyle
              preferences with transparent match reasoning.
            </p>

            {isAuthenticated && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-indigo-200">
                <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Personalized for <strong>{user?.name}</strong>
                </span>
                {profileApplied?.hasUserHistory && (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Informed by your saved favorites & bookings
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preference Tuner Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 mb-8 transition-all">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Fine-Tune AI Match Criteria</h2>
              <span className="text-xs text-slate-500 hidden sm:inline">
                (Adjust parameters to recalculate compatibility scores in real-time)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {(city || propertyType || maxPrice || bedrooms) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Preferred City */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target City / Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Guntur, Hyderabad, Goa"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              >
                <option value="">All Property Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="House">House</option>
                <option value="Studio">Studio</option>
                <option value="Room">Room</option>
              </select>
            </div>

            {/* Max Budget */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Monthly Rent (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 35000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1+ BHK</option>
                <option value="2">2+ BHK</option>
                <option value="3">3+ BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-slate-700">
            Showing <span className="text-indigo-600 font-bold">{recommendations.length}</span>{' '}
            AI-Matched Properties
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm animate-pulse flex flex-col space-y-3"
              >
                <div className="h-52 bg-slate-200 rounded-xl w-full"></div>
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-20 bg-slate-100 rounded-xl"></div>
                <div className="h-10 bg-slate-200 rounded-xl w-full mt-auto"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && recommendations.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No matching properties found</h3>
            <p className="mt-2 text-sm text-slate-600">
              Try adjusting your max rent, target city, or property type to view more available recommendations.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All Filters
            </button>
          </div>
        )}

        {/* Recommendations Grid */}
        {!loading && !error && recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((property) => {
              const isFav = favorites.has(property._id);
              const score = property.matchScore || 85;

              return (
                <div
                  key={property._id}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Image Container */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <img
                      src={
                        property.images && property.images.length > 0
                          ? property.images[0]
                          : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Match Score Badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span className="text-emerald-400 font-extrabold">{property.matchPercentage}</span>
                      <span className="text-slate-200">Match</span>
                    </div>

                    {/* Property Type Pill */}
                    <div className="absolute bottom-3 left-3 z-10 px-2.5 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow">
                      {property.propertyType}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleToggleFavorite(e, property._id)}
                      className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isFav
                          ? 'bg-rose-500 text-white shadow-md scale-110'
                          : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Location & Rating */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <div className="flex items-center gap-1 truncate max-w-[200px]">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate font-medium">
                          {property.location}, {property.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-bold text-xs shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{property.averageRating ? property.averageRating.toFixed(1) : 'New'}</span>
                      </div>
                    </div>

                    {/* Title & Verified Badge */}
                    <div className="space-y-1">
                      {(property.verificationStatus === 'approved' || !property.verificationStatus) && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/90 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          ✓ Verified Property
                        </span>
                      )}
                      <Link to={`/properties/${property._id}`} className="block group-hover:text-indigo-600 transition-colors">
                        <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                          {property.title}
                        </h3>
                      </Link>
                    </div>

                    {/* Price */}
                    <div className="mt-2 mb-3">
                      <span className="text-xl font-extrabold text-slate-900">
                        {formatCurrency(property.price)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium"> / month</span>
                    </div>

                    {/* Specs / Features */}
                    <div className="flex items-center gap-4 py-2 border-y border-slate-100 text-xs text-slate-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        <span>{property.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-slate-400" />
                        <span>{property.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{property.area} sqft</span>
                      </div>
                    </div>

                    {/* "Why Recommended" Box */}
                    <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 mb-4 mt-auto">
                      <div className="flex items-center gap-1.5 text-indigo-950 font-bold text-xs mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Why Recommended:</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {property.reasons && property.reasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-tight">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/properties/${property._id}`}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold text-center transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/properties/${property._id}/book`}
                        className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold text-center shadow-sm shadow-indigo-600/30 flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>Book Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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
