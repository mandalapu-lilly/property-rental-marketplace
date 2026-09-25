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
      <div className="min-h-screen bg-[#fbfbf9] dark:bg-[#121214] py-16 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[#1c1c20] rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] p-8 sm:p-14 text-center shadow-editorial space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center mx-auto shadow-inner">
              <Layers className="w-10 h-10" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h1 className="font-editorial text-2xl sm:text-4xl font-light text-[#18181b] dark:text-[#f4f0e8] tracking-tight">
                No Properties to Compare
              </h1>
              <p className="text-[#71717a] dark:text-[#a1a1aa] text-xs sm:text-sm leading-relaxed">
                Add 2 to 4 properties from listings or search results to evaluate pricing, room sizes, and facilities side-by-side.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full shadow-editorial transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Browse & Select Properties</span>
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#f4f0e8] hover:bg-[#ede7dc] dark:bg-[#27272a] dark:hover:bg-[#323236] text-[#18181b] dark:text-[#f4f0e8] font-semibold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer border border-[#e5e0d8] dark:border-[#3f3f46]"
              >
                <Home className="w-4 h-4" />
                <span>Return Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbf9] dark:bg-[#121214] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-white dark:bg-[#1c1c20] p-7 sm:p-9 rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial">
          <div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#71717a] hover:text-[#18181b] dark:text-[#a1a1aa] dark:hover:text-[#f4f0e8] transition-colors mb-2 group px-3.5 py-1.5 rounded-full bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#3f3f46] w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Marketplace</span>
            </Link>
            <div className="flex items-center gap-3 flex-wrap mt-2">
              <h1 className="font-editorial text-2xl sm:text-4xl font-light text-[#18181b] dark:text-[#f4f0e8] tracking-tight">
                Side-by-Side Property Matrix
              </h1>
              <span className="bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-[#e5e0d8] dark:border-[#3f3f46]">
                Comparing {properties.length} of {maxLimit} stays
              </span>
            </div>
            <p className="text-[#71717a] dark:text-[#a1a1aa] text-xs sm:text-sm mt-1">
              Detailed breakdown of rent rates, room dimensions, verified host safety, and amenities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {properties.length < maxLimit && (
              <Link
                to="/properties"
                className="inline-flex items-center gap-1.5 px-5 py-3 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full transition-all shadow-editorial cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add More Stays</span>
              </Link>
            )}

            <button
              onClick={clearCompare}
              className="inline-flex items-center gap-1.5 px-4 py-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-semibold text-xs uppercase tracking-wider rounded-full border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Responsive Comparison Grid */}
        <div className="bg-white dark:bg-[#1c1c20] rounded-[2.5rem] border border-[#e5e0d8] dark:border-[#2e2e34] shadow-editorial overflow-x-auto">
          <table className="w-full border-collapse min-w-[750px]">
            {/* 1. PROPERTY HEADER CARDS */}
            <thead>
              <tr className="border-b border-[#e5e0d8] dark:border-[#2e2e34] bg-[#fbfbf9] dark:bg-[#161618]">
                <th className="p-6 text-left w-56 min-w-56 text-[10px] font-bold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.2em] align-top">
                  Property Highlights
                </th>
                {properties.map((property) => (
                  <th
                    key={property._id}
                    className="p-6 text-left w-72 min-w-72 align-top border-l border-[#e5e0d8] dark:border-[#2e2e34]"
                  >
                    <div className="space-y-3.5">
                      {/* Image Preview */}
                      <div className="relative h-44 rounded-2xl overflow-hidden bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e5e0d8] dark:border-[#2e2e34]">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#71717a] dark:text-[#a1a1aa]">
                            <Building2 className="w-10 h-10" />
                          </div>
                        )}

                        {/* Property Type Pill */}
                        <span className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#18181b] dark:text-[#d4b996] shadow-sm border border-white/50 dark:border-zinc-800">
                          {property.propertyType}
                        </span>

                        {/* Remove Action Button */}
                        <button
                          onClick={() => removeFromCompare(property._id)}
                          className="absolute top-2.5 right-2.5 p-1.5 bg-[#18181b]/80 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-colors shadow-md cursor-pointer"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Verified Badge */}
                      {(property.verificationStatus === 'approved' || !property.verificationStatus) && (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            Verified Stay
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <Link
                        to={`/properties/${property._id}`}
                        className="block font-editorial font-bold text-[#18181b] dark:text-[#f4f0e8] text-base line-clamp-2 hover:text-[#b58d59] dark:hover:text-[#d4b996] transition-colors"
                      >
                        {property.title}
                      </Link>

                      {/* Action CTA buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          to={`/properties/${property._id}`}
                          className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider rounded-full border border-[#e5e0d8] dark:border-[#3f3f46] hover:bg-[#f4f0e8] dark:hover:bg-[#27272a] text-[#18181b] dark:text-[#f4f0e8] transition-colors"
                        >
                          Details
                        </Link>
                        <Link
                          to={`/properties/${property._id}/book`}
                          className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider rounded-full bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] shadow-sm transition-colors"
                        >
                          Book Stay
                        </Link>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f4f0e8] dark:divide-[#2e2e34] text-xs">
              {/* 2. RENT / PRICING */}
              <tr className="hover:bg-[#fbfbf9] dark:hover:bg-[#161618] transition-colors">
                <td className="p-5 font-bold text-[#18181b] dark:text-[#f4f0e8] uppercase tracking-wider bg-[#fbfbf9] dark:bg-[#161618]">
                  Nightly Rate
                </td>
                {properties.map((p) => {
                  const isLowest = lowestRent && Number(p.price) === lowestRent;
                  return (
                    <td key={p._id} className="p-5 border-l border-[#f4f0e8] dark:border-[#2e2e34]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-editorial text-xl font-bold text-[#18181b] dark:text-[#d4b996]">
                          ₹{p.price?.toLocaleString()}
                        </span>
                        <span className="text-[#71717a] dark:text-[#a1a1aa] font-medium">/night</span>
                        {isLowest && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            Best Price
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* 3. BEDROOMS & BATHROOMS */}
              <tr className="hover:bg-[#fbfbf9] dark:hover:bg-[#161618] transition-colors">
                <td className="p-5 font-bold text-[#18181b] dark:text-[#f4f0e8] uppercase tracking-wider bg-[#fbfbf9] dark:bg-[#161618]">
                  Bedrooms & Baths
                </td>
                {properties.map((p) => (
                  <td key={p._id} className="p-5 border-l border-[#f4f0e8] dark:border-[#2e2e34]">
                    <div className="flex items-center gap-4 text-[#18181b] dark:text-[#f4f0e8] font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-[#8c827a] dark:text-[#d4b996]" />
                        {p.bedrooms} BHK ({p.bedrooms} {p.bedrooms === 1 ? 'Bed' : 'Beds'})
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4 text-[#8c827a] dark:text-[#d4b996]" />
                        {p.bathrooms} {p.bathrooms === 1 ? 'Bath' : 'Baths'}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* 4. TOTAL LIVING AREA */}
              <tr className="hover:bg-[#fbfbf9] dark:hover:bg-[#161618] transition-colors">
                <td className="p-5 font-bold text-[#18181b] dark:text-[#f4f0e8] uppercase tracking-wider bg-[#fbfbf9] dark:bg-[#161618]">
                  Total Area
                </td>
                {properties.map((p) => (
                  <td key={p._id} className="p-5 border-l border-[#f4f0e8] dark:border-[#2e2e34] font-semibold text-[#18181b] dark:text-[#f4f0e8]">
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-[#8c827a] dark:text-[#d4b996]" />
                      <span>{p.area ? `${p.area} sqft` : 'N/A'}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* 5. LOCATION & CITY */}
              <tr className="hover:bg-[#fbfbf9] dark:hover:bg-[#161618] transition-colors">
                <td className="p-5 font-bold text-[#18181b] dark:text-[#f4f0e8] uppercase tracking-wider bg-[#fbfbf9] dark:bg-[#161618]">
                  Location
                </td>
                {properties.map((p) => (
                  <td key={p._id} className="p-5 border-l border-[#f4f0e8] dark:border-[#2e2e34] text-[#52525b] dark:text-[#d4d4d8]">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-[#8c827a] dark:text-[#b58d59] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-[#18181b] dark:text-[#f4f0e8]">{p.city}</span>
                        <span className="text-[#71717a] dark:text-[#a1a1aa]">{p.location || p.address}</span>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* 6. RATINGS & REVIEWS */}
              <tr className="hover:bg-[#fbfbf9] dark:hover:bg-[#161618] transition-colors">
                <td className="p-5 font-bold text-[#18181b] dark:text-[#f4f0e8] uppercase tracking-wider bg-[#fbfbf9] dark:bg-[#161618]">
                  Tenant Rating
                </td>
                {properties.map((p) => (
                  <td key={p._id} className="p-5 border-l border-[#f4f0e8] dark:border-[#2e2e34]">
                    {p.totalReviews > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[#18181b] dark:text-[#d4b996] font-bold bg-[#f4f0e8] dark:bg-[#27272a] px-2 py-0.5 rounded-lg border border-[#e5e0d8] dark:border-[#3f3f46]">
                          <Star className="w-3.5 h-3.5 fill-[#b58d59] text-[#b58d59]" />
                          <span>{p.averageRating ? Number(p.averageRating).toFixed(1) : '5.0'}</span>
                        </div>
                        <span className="text-[#71717a] dark:text-[#a1a1aa]">
                          ({p.totalReviews} {p.totalReviews === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#71717a] dark:text-[#a1a1aa] italic">No reviews yet</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* 7. AVAILABILITY STATUS */}
              <tr className="hover:bg-[#fbfbf9] dark:hover:bg-[#161618] transition-colors">
                <td className="p-5 font-bold text-[#18181b] dark:text-[#f4f0e8] uppercase tracking-wider bg-[#fbfbf9] dark:bg-[#161618]">
                  Availability
                </td>
                {properties.map((p) => (
                  <td key={p._id} className="p-5 border-l border-[#f4f0e8] dark:border-[#2e2e34]">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.status === 'available'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'available' ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                      {p.status || 'Available'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* SECTION HEADER: AMENITIES MATRIX */}
              <tr className="bg-[#18181b] dark:bg-[#121214] text-white">
                <td
                  colSpan={properties.length + 1}
                  className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4b996]"
                >
                  Amenities & Facilities Matrix
                </td>
              </tr>

              {/* 8. AMENITIES ROWS */}
              {standardAmenities.map((amenity) => {
                const Icon = amenity.icon;
                return (
                  <tr key={amenity.name} className="hover:bg-[#fbfbf9] dark:hover:bg-[#161618] transition-colors">
                    <td className="p-5 font-bold text-[#18181b] dark:text-[#f4f0e8] flex items-center gap-2 bg-[#fbfbf9] dark:bg-[#161618]">
                      <Icon className="w-4 h-4 text-[#8c827a] dark:text-[#d4b996] shrink-0" />
                      <span>{amenity.name}</span>
                    </td>
                    {properties.map((p) => {
                      const included = hasAmenity(p.amenities, amenity);
                      return (
                        <td key={p._id} className="p-5 border-l border-[#f4f0e8] dark:border-[#2e2e34]">
                          {included ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>Included</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#71717a] dark:text-[#a1a1aa] bg-[#f4f0e8] dark:bg-[#27272a] px-2.5 py-1 rounded-full">
                              <XCircle className="w-3.5 h-3.5 text-[#a1a1aa] dark:text-[#71717a] shrink-0" />
                              <span>Not listed</span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
