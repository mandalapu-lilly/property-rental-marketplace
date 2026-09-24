import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import api from '../services/api';
import {
  Layers,
  Building2,
  Trash2,
  Plus,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Star,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  DollarSign,
  Wifi,
  Car,
  Home,
  Tv,
  Utensils,
  Dumbbell,
  Waves,
  Shield,
  Sun,
  Zap,
} from 'lucide-react';

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare, maxLimit } = useCompare();
  const [properties, setProperties] = useState(compareList);
  const [loading, setLoading] = useState(false);

  // Sync state with context
  useEffect(() => {
    setProperties(compareList);
  }, [compareList]);

  // Attempt to fetch fresh data for compared properties if available
  useEffect(() => {
    if (compareList.length === 0) return;

    let isMounted = true;
    const fetchLatestData = async () => {
      try {
        const updatedList = await Promise.all(
          compareList.map(async (item) => {
            try {
              const res = await api.get(`/api/properties/${item._id}`);
              return res.data.property || item;
            } catch (err) {
              // If property was deleted or API fails, keep cached representation
              return item;
            }
          })
        );
        if (isMounted) {
          setProperties(updatedList);
        }
      } catch (e) {
        console.warn('Could not refresh compared properties:', e);
      }
    };

    fetchLatestData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute lowest rent among compared properties for highlighting
  const lowestRent =
    properties.length > 1
      ? Math.min(...properties.map((p) => Number(p.price) || Infinity))
      : null;

  // Comprehensive standard amenities list to check against
  const standardAmenities = [
    { name: 'Parking', icon: Car, keywords: ['parking', 'car parking', 'garage'] },
    { name: 'Wi-Fi / Internet', icon: Wifi, keywords: ['wifi', 'wi-fi', 'internet', 'high-speed wifi'] },
    { name: 'Air Conditioning (AC)', icon: Sun, keywords: ['ac', 'air conditioning', 'air conditioner'] },
    { name: 'Furnished', icon: Home, keywords: ['furnished', 'fully furnished', 'semi-furnished'] },
    { name: 'Modular Kitchen', icon: Utensils, keywords: ['kitchen', 'modular kitchen', 'cooking'] },
    { name: 'Swimming Pool', icon: Waves, keywords: ['swimming pool', 'pool'] },
    { name: 'Gym / Fitness', icon: Dumbbell, keywords: ['gym', 'fitness', 'workout'] },
    { name: '24/7 Security / CCTV', icon: Shield, keywords: ['security', 'cctv', 'gated security', '24/7 security'] },
    { name: 'Power Backup / Generator', icon: Zap, keywords: ['power backup', 'generator', 'inverter', 'backup'] },
    { name: 'TV / Entertainment', icon: Tv, keywords: ['tv', 'television', 'smart tv', 'cable'] },
  ];

  const hasAmenity = (propAmenities, amenityConfig) => {
    if (!Array.isArray(propAmenities)) return false;
    return propAmenities.some((a) => {
      const lower = String(a).toLowerCase();
      return amenityConfig.keywords.some((kw) => lower.includes(kw));
    });
  };

  // 1. EMPTY STATE
  if (properties.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center shadow-sm space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
              <Layers className="w-10 h-10" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                No Properties in Comparison
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Add 2 to 4 properties to compare rent, bedrooms, area, ratings, and amenities side-by-side.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Browse & Select Properties</span>
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to="/properties"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Listings</span>
              </Link>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Side-by-Side Property Comparison
              </h1>
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200">
                Comparing {properties.length} of {maxLimit} stays
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Detailed side-by-side analysis of pricing, amenities, coordinates, and tenant satisfaction.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {properties.length < maxLimit && (
              <Link
                to="/properties"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add More Stays</span>
              </Link>
            )}

            <button
              onClick={clearCompare}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Responsive Comparison Grid / Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-x-auto">
          <table className="w-full border-collapse min-w-[750px]">
            {/* 1. PROPERTY HEADER CARDS */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="p-5 text-left w-56 min-w-56 text-xs font-bold text-slate-400 uppercase tracking-wider align-top">
                  Property Overview
                </th>
                {properties.map((property) => (
                  <th
                    key={property._id}
                    className="p-5 text-left w-72 min-w-72 align-top border-l border-slate-100"
                  >
                    <div className="space-y-3">
                      {/* Image Preview */}
                      <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Building2 className="w-10 h-10" />
                          </div>
                        )}

                        {/* Property Type Pill */}
                        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-indigo-700 shadow-sm border border-white/50">
                          {property.propertyType}
                        </span>

                        {/* Remove Action Button */}
                        <button
                          onClick={() => removeFromCompare(property._id)}
                          className="absolute top-2.5 right-2.5 p-1.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-colors shadow-md cursor-pointer"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Verified Badge */}
                      {(property.verificationStatus === 'approved' || !property.verificationStatus) && (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/90 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ✓ Verified Property
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <Link
                        to={`/properties/${property._id}`}
                        className="block font-bold text-slate-900 text-base line-clamp-2 hover:text-indigo-600 transition-colors"
                      >
                        {property.title}
                      </Link>

                      {/* Action CTA buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          to={`/properties/${property._id}`}
                          className="px-3 py-2 text-center text-xs font-bold rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
                        >
                          Details
                        </Link>
                        <Link
                          to={`/properties/${property._id}/book`}
                          className="px-3 py-2 text-center text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 transition-colors"
                        >
                          Book Stay
                        </Link>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {/* 2. RENT / PRICING */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-700 text-xs uppercase tracking-wider bg-slate-50/30">
                  Monthly Rent
                </td>
                {properties.map((p) => {
                  const isLowest = lowestRent && Number(p.price) === lowestRent;
                  return (
                    <td key={p._id} className="p-4 border-l border-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xl font-black text-slate-900">
                          ₹{p.price?.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500">/mo</span>
                        {isLowest && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            Best Price
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* 3. BEDROOMS & BATHROOMS */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-700 text-xs uppercase tracking-wider bg-slate-50/30">
                  Bedrooms & Baths
                </td>
                {properties.map((p) => (
                  <td key={p._id} className="p-4 border-l border-slate-100">
                    <div className="flex items-center gap-4 text-slate-800 font-semibold text-xs">
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4 text-indigo-500" />
                        {p.bedrooms} BHK ({p.bedrooms} {p.bedrooms === 1 ? 'Bed' : 'Beds'})
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4 text-indigo-500" />
                        {p.bathrooms} {p.bathrooms === 1 ? 'Bath' : 'Baths'}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* 4. TOTAL LIVING AREA */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-700 text-xs uppercase tracking-wider bg-slate-50/30">
                  Total Area (sqft)
                </td>
                {properties.map((p) => (
                  <td key={p._id} className="p-4 border-l border-slate-100 font-semibold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-slate-400" />
                      <span>{p.area ? `${p.area} sqft` : 'N/A'}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* 5. LOCATION & CITY */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-700 text-xs uppercase tracking-wider bg-slate-50/30">
                  Location & City
                </td>
                {properties.map((p) => (
                  <td key={p._id} className="p-4 border-l border-slate-100 text-xs text-slate-700">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-slate-900">{p.city}</span>
                        <span className="text-slate-500">{p.location || p.address}</span>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* 6. RATINGS & REVIEWS */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-700 text-xs uppercase tracking-wider bg-slate-50/30">
                  Tenant Rating
                </td>
                {properties.map((p) => (
                  <td key={p._id} className="p-4 border-l border-slate-100">
                    {p.totalReviews > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{p.averageRating ? Number(p.averageRating).toFixed(1) : '5.0'}</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          ({p.totalReviews} {p.totalReviews === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No reviews yet</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* 7. AVAILABILITY STATUS */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-700 text-xs uppercase tracking-wider bg-slate-50/30">
                  Availability
                </td>
                {properties.map((p) => (
                  <td key={p._id} className="p-4 border-l border-slate-100">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        p.status === 'available'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'available' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {p.status || 'Available'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* SECTION HEADER: AMENITIES MATRIX */}
              <tr className="bg-indigo-50/60 border-t-2 border-b border-indigo-100">
                <td
                  colSpan={properties.length + 1}
                  className="p-3.5 text-xs font-extrabold text-indigo-950 uppercase tracking-wider"
                >
                  Amenities & Facilities Matrix
                </td>
              </tr>

              {/* 8. AMENITIES ROWS */}
              {standardAmenities.map((amenity) => {
                const Icon = amenity.icon;
                return (
                  <tr key={amenity.name} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-700 text-xs flex items-center gap-2 bg-slate-50/30">
                      <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>{amenity.name}</span>
                    </td>
                    {properties.map((p) => {
                      const included = hasAmenity(p.amenities, amenity);
                      return (
                        <td key={p._id} className="p-4 border-l border-slate-100">
                          {included ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/90 px-2.5 py-1 rounded-lg">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>Included</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                              <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                              <span>Not listed</span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* 9. DESCRIPTION SUMMARY */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-700 text-xs uppercase tracking-wider bg-slate-50/30">
                  Property Description
                </td>
                {properties.map((p) => (
                  <td key={p._id} className="p-4 border-l border-slate-100 text-xs text-slate-600 leading-relaxed">
                    <p className="line-clamp-4">{p.description || 'No detailed description provided.'}</p>
                  </td>
                ))}
              </tr>

              {/* 10. HOST / OWNER DETAILS */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-700 text-xs uppercase tracking-wider bg-slate-50/30">
                  Host / Listed By
                </td>
                {properties.map((p) => (
                  <td key={p._id} className="p-4 border-l border-slate-100 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block">
                      {p.owner?.name || 'Verified Host'}
                    </span>
                    <span className="text-slate-500">{p.owner?.email || 'Contact via HavenStay'}</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
