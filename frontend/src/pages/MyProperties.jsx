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
  Bed,
  Bath,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Home,
  ShieldAlert,
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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Property Listings
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your published rental properties, update availability, or edit pricing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchMyProperties}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            {isHostOrAdmin && (
              <Link
                to="/properties/add"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Property</span>
              </Link>
            )}
          </div>
        </div>

        {/* Flash Message */}
        {message && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{message}</p>
            </div>
            <button
              onClick={() => setMessage('')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-950"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 h-64 animate-pulse p-6 space-y-4"
              >
                <div className="h-6 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No properties listed yet</h3>
            <p className="text-sm text-slate-500">
              {isHostOrAdmin
                ? 'You have not published any properties yet. Click below to add your first property listing.'
                : 'Your current account role is standard user. Upgrade or sign up as a host to list properties.'}
            </p>
            {isHostOrAdmin ? (
              <Link
                to="/properties/add"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Property</span>
              </Link>
            ) : (
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all"
              >
                Browse All Properties
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Image Cover */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-100 to-violet-50 text-indigo-400 ${
                        property.images && property.images.length > 0 ? 'hidden' : 'flex'
                      }`}
                    >
                      <Building2 className="w-12 h-12" />
                    </div>

                    {/* Property Type Badge */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-700 shadow-sm border border-white/50">
                      {property.propertyType}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize shadow-sm ${
                        property.status === 'available'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {property.location}, {property.city}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 line-clamp-1">
                      {property.title}
                    </h2>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Rent</span>
                        <span className="text-lg font-black text-slate-900">
                          ₹{property.price?.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500">/mo</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{property.bedrooms} Beds</span>
                        <span>•</span>
                        <span>{property.bathrooms} Baths</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/properties/${property._id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 font-semibold text-xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/properties/edit/${property._id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(property._id, property.title)}
                      disabled={deletingId === property._id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 hover:bg-rose-100 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
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
