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
    <div className="min-h-screen bg-[#fafafa] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-white p-7 sm:p-9 rounded-[32px] border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                Curated Wishlist
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              My Saved Favorites
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Your wishlist of shortlisted properties and luxury vacation retreats.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-2xl shadow-lg transition-all w-fit"
          >
            <Compass className="w-4 h-4" />
            <span>Explore More Stays</span>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-slate-500 font-medium text-sm">Loading your curated wishlist...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center text-rose-800 text-sm font-semibold max-w-md mx-auto">
            {error}
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-[36px] border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Your wishlist is empty</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
              Browse listings and tap the heart icon on any property to save it for future consideration.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-lg transition-all cursor-pointer"
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
                  className="bg-white rounded-[32px] border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Image Cover */}
                    <div className="relative h-56 bg-slate-100 overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-400">
                          <Building2 className="w-12 h-12" />
                        </div>
                      )}

                      <span className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 shadow-sm border border-white/50">
                        {property.propertyType}
                      </span>

                      {/* Remove Favorite Button */}
                      <button
                        onClick={() => handleRemoveFavorite(property._id)}
                        disabled={removingId === property._id}
                        title="Remove from favorites"
                        className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-rose-500 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {property.location}, {property.city}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {property.title}
                      </h2>

                      {/* Specs */}
                      <div className="pt-2 flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 font-semibold">
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
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-50 mt-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">Rent</span>
                      <span className="text-lg font-black text-slate-900">
                        ₹{property.price?.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">/mo</span>
                    </div>

                    <Link
                      to={`/properties/${property._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold rounded-xl transition-all shadow-sm"
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
