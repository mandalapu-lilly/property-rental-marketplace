import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

export default function MyProperties() {
  const { user } = useAuth();
  const location = useLocation();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(location.state?.message || '');
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/properties/my');
      setProperties(res.data.properties || []);
    } catch (err) {
      console.error('Error fetching my properties:', err);
      setError(err.response?.data?.error || 'Failed to fetch your properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/api/properties/${id}`);
      setMessage('Property deleted successfully.');
      setProperties(properties.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete property');
    } finally {
      setDeletingId(null);
    }
  };

  const isHostOrAdmin = user?.role === 'host' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#fbfbf9] dark:bg-[#121214] py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Console */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-white dark:bg-[#1c1c20] p-7 sm:p-9 rounded-[32px] border border-stone-200/80 dark:border-white/10 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#b58d59]/10 text-[#b58d59] dark:text-[#d4b996] text-xs font-bold border border-[#b58d59]/20 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Host Portfolio
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-[#fbfbf9] tracking-tight mt-2">
              My Rental Portfolio
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1">
              Oversee and audit published listings, manage real-time availability, and update amenities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchMyProperties}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-3 bg-stone-100 hover:bg-stone-200 dark:bg-[#27272a] dark:hover:bg-[#323238] text-stone-700 dark:text-stone-200 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Listings</span>
            </button>
            {isHostOrAdmin && (
              <Link
                to="/properties/add"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#18181b] hover:bg-stone-800 dark:bg-[#d4b996] dark:hover:bg-[#c5a880] dark:text-[#18181b] active:scale-95 text-white font-bold text-xs rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Listing</span>
              </Link>
            )}
          </div>
        </div>

        {/* Flash Message */}
        {message && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-sm animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{message}</p>
            </div>
            <button
              onClick={() => setMessage('')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-200 cursor-pointer underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 text-xs font-bold animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Error Occurred</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-[#1c1c20] rounded-[32px] border border-stone-200/80 dark:border-white/10 h-72 animate-pulse p-6 space-y-4"
              >
                <div className="h-36 bg-stone-100 dark:bg-[#27272a] rounded-2xl" />
                <div className="h-4 bg-stone-200 dark:bg-[#323238] rounded w-1/2" />
                <div className="h-4 bg-stone-100 dark:bg-[#27272a] rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white dark:bg-[#1c1c20] rounded-[36px] border border-stone-200/80 dark:border-white/10 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#b58d59]/10 text-[#b58d59] dark:text-[#d4b996] flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-[#fbfbf9]">No active properties published</h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              {isHostOrAdmin
                ? 'Your property inventory is currently empty. Add your first listing to start hosting guests.'
                : 'Your current account role is standard user. Upgrade or sign up as a host to list properties.'}
            </p>
            {isHostOrAdmin ? (
              <Link
                to="/properties/add"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181b] hover:bg-stone-800 dark:bg-[#d4b996] dark:hover:bg-[#c5a880] dark:text-[#18181b] text-white font-bold text-xs rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Listing</span>
              </Link>
            ) : (
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181b] hover:bg-stone-800 dark:bg-[#d4b996] dark:hover:bg-[#c5a880] dark:text-[#18181b] text-white font-bold text-xs rounded-2xl shadow-lg transition-all"
              >
                Browse Marketplace
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white dark:bg-[#1c1c20] rounded-[32px] border border-stone-200/80 dark:border-white/10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image Cover */}
                  <div className="relative h-52 bg-stone-100 dark:bg-[#27272a] overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full items-center justify-center bg-stone-100 dark:bg-[#27272a] text-[#b58d59] ${
                        property.images && property.images.length > 0 ? 'hidden' : 'flex'
                      }`}
                    >
                      <Building2 className="w-12 h-12 opacity-50" />
                    </div>

                    {/* Property Type Badge */}
                    <span className="absolute top-3.5 left-3.5 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-stone-900 dark:text-[#fbfbf9] shadow-sm border border-white/50 dark:border-white/10">
                      {property.propertyType}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`absolute top-3.5 right-3.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                        property.status === 'available'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-stone-800 text-white'
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3.5">
                    {/* Verification Status Pill */}
                    <div className="flex items-center justify-between">
                      {property.verificationStatus === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
                          <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                          Verification Action Needed
                        </span>
                      ) : property.verificationStatus === 'pending' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                          <RefreshCw className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                          Under Moderation
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          Verified Listing
                        </span>
                      )}
                    </div>

                    {/* Rejection Note */}
                    {property.verificationStatus === 'rejected' && (
                      <div className="p-3 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-800 dark:text-rose-300 space-y-1">
                        <span className="font-bold block text-rose-900 dark:text-rose-200">Admin Audit Note:</span>
                        <p className="italic text-[11px]">{property.rejectionReason || 'Details need update or more verification photos required.'}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 dark:text-stone-500 truncate">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>
                        {property.location}, {property.city}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-stone-900 dark:text-[#fbfbf9] line-clamp-1">
                      {property.title}
                    </h2>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-white/5">
                      <div>
                        <span className="text-[11px] text-stone-400 block font-semibold uppercase tracking-wider">Rate</span>
                        <span className="text-lg font-black text-stone-900 dark:text-[#fbfbf9]">
                          ₹{property.price?.toLocaleString()}
                        </span>
                        <span className="text-xs text-stone-400 font-medium">/night</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-semibold text-stone-500 dark:text-stone-400">
                        <span>{property.bedrooms} Beds</span>
                        <span>•</span>
                        <span>{property.bathrooms} Baths</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-stone-50/80 dark:bg-[#18181b]/80 border-t border-stone-100 dark:border-white/5 flex items-center justify-between gap-2">
                  <Link
                    to={`/properties/${property._id}`}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white dark:bg-[#27272a] border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-200 hover:text-[#b58d59] dark:hover:text-[#d4b996] font-bold text-xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/properties/edit/${property._id}`}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#b58d59]/10 dark:bg-[#d4b996]/10 border border-[#b58d59]/20 text-[#b58d59] dark:text-[#d4b996] hover:bg-[#b58d59]/20 font-bold text-xs transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(property._id, property.title)}
                      disabled={deletingId === property._id}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deletingId === property._id ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
