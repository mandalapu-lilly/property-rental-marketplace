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
    <div className="min-h-screen bg-[#fbfbf9] dark:bg-[#121214] py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#18181b] dark:bg-[#1c1c20] text-white p-8 sm:p-12 shadow-editorial border border-[#2e2e34]">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#d4b996] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#d4b996]" />
              <span>AI-Powered Match Engine</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-light tracking-tight text-white">
              Recommended for You
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed font-normal">
              Tailored property recommendations calculated based on your budget, search history, and amenities preferences.
            </p>

            {isAuthenticated && (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-[#d4b996]">
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Personalized for <strong>{user?.name}</strong></span>
                </span>
                {profileApplied?.hasUserHistory && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 px-3.5 py-1.5 rounded-full font-semibold text-[11px]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Informed by your activity</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preference Tuner Bar */}
        <div className="bg-white dark:bg-[#1c1c20] rounded-[2.5rem] p-7 sm:p-8 shadow-editorial border border-[#e5e0d8] dark:border-[#2e2e34] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#18181b] dark:text-[#f4f0e8]">Fine-Tune AI Match Criteria</h2>
                <span className="text-xs text-[#71717a] dark:text-[#a1a1aa]">Adjust parameters to recalculate compatibility scores</span>
              </div>
            </div>

            {(city || propertyType || maxPrice || bedrooms) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#18181b] dark:text-[#f4f0e8] bg-[#f4f0e8] hover:bg-[#ede7dc] dark:bg-[#27272a] dark:hover:bg-[#323236] rounded-full transition-colors cursor-pointer border border-[#e5e0d8] dark:border-[#3f3f46]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Quick Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.2em]">
                Target City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#8c827a] dark:text-[#b58d59] absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs font-medium bg-[#fbfbf9] dark:bg-[#121214] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-2xl text-[#18181b] dark:text-[#f4f0e8] focus:ring-1 focus:ring-[#b58d59] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.2em]">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-[#18181b] dark:text-[#f4f0e8] bg-[#fbfbf9] dark:bg-[#121214] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-2xl focus:ring-1 focus:ring-[#b58d59] focus:outline-none cursor-pointer"
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
              <label className="block text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.2em]">
                Max Monthly Rent (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 35000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-[#18181b] dark:text-[#f4f0e8] bg-[#fbfbf9] dark:bg-[#121214] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-2xl focus:ring-1 focus:ring-[#b58d59] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.2em]">Bedrooms</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-[#18181b] dark:text-[#f4f0e8] bg-[#fbfbf9] dark:bg-[#121214] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-2xl focus:ring-1 focus:ring-[#b58d59] focus:outline-none cursor-pointer"
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
                className="bg-white dark:bg-[#1c1c20] rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] p-5 shadow-sm animate-pulse flex flex-col space-y-3"
              >
                <div className="h-52 bg-[#f4f0e8] dark:bg-[#27272a] rounded-2xl w-full"></div>
                <div className="h-4 bg-[#e5e0d8] dark:bg-[#2e2e34] rounded w-3/4"></div>
                <div className="h-3 bg-[#f4f0e8] dark:bg-[#27272a] rounded w-1/2"></div>
                <div className="h-16 bg-[#fbfbf9] dark:bg-[#161618] rounded-2xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 rounded-[2rem] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && recommendations.length === 0 && (
          <div className="bg-white dark:bg-[#1c1c20] rounded-[2.5rem] p-12 text-center border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center mx-auto">
              <Building className="w-8 h-8" />
            </div>
            <h3 className="font-editorial text-2xl font-light text-[#18181b] dark:text-[#f4f0e8]">No matching recommendations found</h3>
            <p className="text-xs sm:text-sm text-[#71717a] dark:text-[#a1a1aa]">
              Try adjusting your max rent, target city, or property type to view more available recommendations.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] text-xs font-semibold uppercase tracking-wider rounded-full shadow-editorial transition-colors cursor-pointer"
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
                  className="group bg-white dark:bg-[#1c1c20] rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial hover:shadow-editorial-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Image Container */}
                  <div>
                    <div className="relative h-56 w-full overflow-hidden bg-[#f4f0e8] dark:bg-[#27272a]">
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
                      <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18181b]/90 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                        <Sparkles className="w-3 h-3 text-[#d4b996] animate-pulse" />
                        <span className="text-emerald-400 font-extrabold">{property.matchPercentage}</span>
                        <span className="text-zinc-200">Match</span>
                      </div>

                      {/* Property Type Pill */}
                      <div className="absolute bottom-3.5 left-3.5 z-10 px-3 py-0.5 rounded-full bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md text-[#18181b] dark:text-[#d4b996] text-[10px] font-bold uppercase tracking-wider shadow border border-white/50 dark:border-zinc-800">
                        {property.propertyType}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => handleToggleFavorite(e, property._id)}
                        className={`absolute top-3.5 right-3.5 z-10 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                          isFav
                            ? 'bg-rose-500 text-white shadow-md scale-110'
                            : 'bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black text-[#18181b] dark:text-[#f4f0e8] hover:text-rose-500'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#71717a] dark:text-[#a1a1aa]">
                        <div className="flex items-center gap-1 truncate max-w-[200px]">
                          <MapPin className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#b58d59] shrink-0" />
                          <span className="truncate font-medium text-[#71717a] dark:text-[#a1a1aa]">
                            {property.location}, {property.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#18181b] dark:text-[#d4b996] font-bold text-xs bg-[#f4f0e8] dark:bg-[#27272a] px-2 py-0.5 rounded-full border border-[#e5e0d8] dark:border-[#3f3f46] shrink-0">
                          <Star className="w-3 h-3 fill-[#b58d59] text-[#b58d59]" />
                          <span>{property.averageRating ? property.averageRating.toFixed(1) : '5.0'}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <Link to={`/properties/${property._id}`} className="block group-hover:text-[#b58d59] dark:group-hover:text-[#d4b996] transition-colors">
                        <h3 className="font-editorial font-bold text-[#18181b] dark:text-[#f4f0e8] text-lg line-clamp-1">
                          {property.title}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="flex items-baseline gap-1">
                        <span className="font-editorial text-2xl font-bold text-[#18181b] dark:text-[#d4b996]">
                          {formatCurrency(property.price)}
                        </span>
                        <span className="text-xs text-[#71717a] dark:text-[#a1a1aa] font-medium">/mo</span>
                      </div>

                      {/* Specs */}
                      <div className="flex items-center gap-4 py-2 border-y border-[#f4f0e8] dark:border-[#2e2e34] text-xs text-[#71717a] dark:text-[#a1a1aa] font-medium">
                        <div className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#d4b996]" />
                          <span>{property.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#d4b996]" />
                          <span>{property.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#d4b996]" />
                          <span>{property.area} sqft</span>
                        </div>
                      </div>

                      {/* Why Recommended */}
                      <div className="bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#3f3f46] rounded-2xl p-3 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[#18181b] dark:text-[#d4b996] font-bold text-[10px] uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-[#b58d59] shrink-0" />
                          <span>Why Recommended:</span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-[#52525b] dark:text-[#d4d4d8]">
                          {property.reasons && property.reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
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
                        className="w-full py-2.5 px-3 rounded-full border border-[#e5e0d8] dark:border-[#3f3f46] hover:bg-[#f4f0e8] dark:hover:bg-[#27272a] text-[#18181b] dark:text-[#f4f0e8] text-xs font-semibold uppercase tracking-wider text-center transition-colors"
                      >
                        Details
                      </Link>
                      <Link
                        to={`/properties/${property._id}/book`}
                        className="w-full py-2.5 px-3 rounded-full bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] text-xs font-semibold uppercase tracking-wider text-center shadow-sm flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>Reserve</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleCompare(property)}
                      className={`w-full py-2 px-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isInCompare(property._id)
                          ? 'bg-[#18181b] text-white dark:bg-[#d4b996] dark:text-[#18181b]'
                          : 'bg-[#f4f0e8] hover:bg-[#ede7dc] dark:bg-[#27272a] dark:hover:bg-[#323236] text-[#18181b] dark:text-[#f4f0e8]'
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
