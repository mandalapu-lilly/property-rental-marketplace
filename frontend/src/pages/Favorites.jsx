import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Heart,
  Building2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Trash2,
  ArrowRight,
  Loader2,
  Compass,
} from 'lucide-react';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/favorites');
      setFavorites(res.data.favorites || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err.response?.data?.error || 'Failed to load your favorite properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (propertyId) => {
    setRemovingId(propertyId);
    try {
      await api.delete(`/api/favorites/${propertyId}`);
      setFavorites(favorites.filter((fav) => fav.property?._id !== propertyId));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove from favorites');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] dark:bg-[#121214] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-white dark:bg-[#1c1c20] p-7 sm:p-9 rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[10px] font-bold border border-rose-200 dark:border-rose-900/50 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                Curated Wishlist
              </span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-4xl font-light text-[#18181b] dark:text-[#f4f0e8] tracking-tight mt-2">
              My Saved Favorites
            </h1>
            <p className="text-[#71717a] dark:text-[#a1a1aa] text-xs sm:text-sm mt-1">
              Your wishlist of shortlisted properties and luxury vacation retreats.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] active:scale-95 text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full shadow-editorial transition-all w-fit"
          >
            <Compass className="w-4 h-4" />
            <span>Explore More Stays</span>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500 animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-[#71717a] dark:text-[#a1a1aa] font-medium text-xs uppercase tracking-wider">Loading your curated wishlist...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 text-center text-rose-800 dark:text-rose-300 text-sm font-semibold max-w-md mx-auto">
            {error}
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white dark:bg-[#1c1c20] rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] p-12 text-center max-w-lg mx-auto shadow-editorial space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-editorial text-2xl font-light text-[#18181b] dark:text-[#f4f0e8]">Your wishlist is empty</h3>
            <p className="text-xs sm:text-sm text-[#71717a] dark:text-[#a1a1aa] max-w-xs mx-auto">
              Browse listings and tap the heart icon on any property to save it for future consideration.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full shadow-editorial transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Marketplace</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => {
              const property = fav.property;
              if (!property) return null;

              return (
                <div
                  key={fav._id}
                  className="bg-white dark:bg-[#1c1c20] rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial hover:shadow-editorial-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Image Cover */}
                    <div className="relative h-56 bg-[#f4f0e8] dark:bg-[#27272a] overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#f4f0e8] dark:bg-[#27272a] text-[#71717a] dark:text-[#a1a1aa]">
                          <Building2 className="w-12 h-12" />
                        </div>
                      )}

                      <span className="absolute top-3.5 left-3.5 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#18181b] dark:text-[#d4b996] shadow-sm border border-white/50 dark:border-zinc-800">
                        {property.propertyType}
                      </span>

                      {/* Remove Favorite Button */}
                      <button
                        onClick={() => handleRemoveFavorite(property._id)}
                        disabled={removingId === property._id}
                        title="Remove from favorites"
                        className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-rose-500 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer border border-rose-100 dark:border-rose-900/50"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#71717a] dark:text-[#a1a1aa] truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#b58d59] shrink-0" />
                        <span>
                          {property.location}, {property.city}
                        </span>
                      </div>

                      <h2 className="font-editorial text-lg font-bold text-[#18181b] dark:text-[#f4f0e8] line-clamp-1 group-hover:text-[#b58d59] dark:group-hover:text-[#d4b996] transition-colors">
                        {property.title}
                      </h2>

                      {/* Specs */}
                      <div className="pt-2 flex items-center gap-4 text-xs text-[#71717a] dark:text-[#a1a1aa] border-t border-[#f4f0e8] dark:border-[#2e2e34] font-medium">
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
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-[#f4f0e8] dark:border-[#2e2e34] mt-2 pt-4">
                    <div>
                      <span className="text-[10px] text-[#71717a] dark:text-[#a1a1aa] block font-bold uppercase tracking-wider">Rate</span>
                      <span className="font-editorial text-xl font-bold text-[#18181b] dark:text-[#d4b996]">
                        ₹{property.price?.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#71717a] dark:text-[#a1a1aa] font-normal">/night</span>
                    </div>

                    <Link
                      to={`/properties/${property._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f4f0e8] dark:bg-[#27272a] hover:bg-[#18181b] hover:text-white dark:hover:bg-[#d4b996] dark:hover:text-[#18181b] text-[#18181b] dark:text-[#f4f0e8] text-xs font-semibold uppercase tracking-wider rounded-full transition-all shadow-sm border border-[#e5e0d8] dark:border-[#3f3f46]"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
