import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
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
  AlertCircle,
  Layers,
} from 'lucide-react';

export default function Recommendations() {
  const { isAuthenticated, user } = useAuth();
  const { toggleCompare, isInCompare } = useCompare();

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
    <div className="min-h-screen bg-[#fafafa] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-[36px] bg-slate-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI-Powered Match Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Recommended for You
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
              Tailored property recommendations calculated based on your budget, search history, and amenities preferences.
            </p>

            {isAuthenticated && (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-indigo-200">
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Personalized for <strong>{user?.name}</strong></span>
                </span>
                {profileApplied?.hasUserHistory && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Informed by your activity</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preference Tuner Bar */}
        <div className="bg-white rounded-[32px] p-7 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Fine-Tune AI Match Criteria</h2>
                <span className="text-xs text-slate-400">Adjust parameters to recalculate compatibility scores</span>
              </div>
            </div>

            {(city || propertyType || maxPrice || bedrooms) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Quick Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Target City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="Hotel">Hotel</option>
                <option value="Resort">Resort</option>
                <option value="Homestay">Homestay</option>
                <option value="Guest House">Guest House</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="House">House</option>
                <option value="Studio">Studio</option>
                <option value="Room">Room</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Max Monthly Rent (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 35000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bedrooms</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
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

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[32px] border border-slate-200/80 p-5 shadow-sm animate-pulse flex flex-col space-y-3"
              >
                <div className="h-52 bg-slate-100 rounded-2xl w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                <div className="h-16 bg-slate-50 rounded-xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 rounded-[28px] bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && recommendations.length === 0 && (
          <div className="bg-white rounded-[36px] p-12 text-center border border-slate-200/80 shadow-sm max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Building className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No matching recommendations found</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Try adjusting your max rent, target city, or property type to view more available recommendations.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Recommendations Grid */}
        {!loading && !error && recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((property) => {
              const isFav = favorites.has(property._id);

              return (
                <div
                  key={property._id}
                  className="group bg-white rounded-[32px] border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Image Container */}
                  <div>
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
                      <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-lg">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                        <span className="text-emerald-400 font-extrabold">{property.matchPercentage}</span>
                        <span className="text-slate-200 font-medium">Match</span>
                      </div>

                      {/* Property Type Pill */}
                      <div className="absolute bottom-3.5 left-3.5 z-10 px-3 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold shadow border border-white/50">
                        {property.propertyType}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => handleToggleFavorite(e, property._id)}
                        className={`absolute top-3.5 right-3.5 z-10 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
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
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1 truncate max-w-[200px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate font-medium text-slate-500">
                            {property.location}, {property.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{property.averageRating ? property.averageRating.toFixed(1) : '5.0'}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <Link to={`/properties/${property._id}`} className="block group-hover:text-indigo-600 transition-colors">
                        <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                          {property.title}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-slate-900">
                          {formatCurrency(property.price)}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">/mo</span>
                      </div>

                      {/* Specs */}
                      <div className="flex items-center gap-4 py-2 border-y border-slate-100 text-xs text-slate-500 font-medium">
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

                      {/* Why Recommended */}
                      <div className="bg-indigo-50/50 border border-indigo-100/80 rounded-2xl p-3 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-indigo-950 font-bold text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>Why Recommended:</span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-slate-600">
                          {property.reasons && property.reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-tight">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-6 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/properties/${property._id}`}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold text-center transition-colors"
                      >
                        Details
                      </Link>
                      <Link
                        to={`/properties/${property._id}/book`}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center shadow-sm flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>Reserve</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleCompare(property)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isInCompare(property._id)
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{isInCompare(property._id) ? '✓ In Comparison List' : 'Compare'}</span>
                    </button>
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
