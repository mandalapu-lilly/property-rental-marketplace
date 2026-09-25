import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Sparkles, MapPin, Bed, Bath, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RecommendationsSection({ limit = 3, title = '✨ Recommended for You' }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api
      .get('/api/recommendations', { params: { limit } })
      .then((res) => {
        if (isMounted && res.data && res.data.success) {
          setRecommendations(res.data.recommendations || []);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch recommendations for section:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [limit]);

  if (loading) {
    return null; // Silent while loading on landing pages
  }

  if (recommendations.length === 0) {
    return null;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="py-12 bg-[#fbfbf9] dark:bg-[#121214] border-y border-[#e8e3da] dark:border-[#27272a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f0e8] dark:bg-[#27272a] text-[#b58d59] dark:text-[#d4b996] text-xs font-bold uppercase tracking-wider mb-2 border border-[#ded7cb] dark:border-[#3f3f46]">
              <Sparkles className="w-3.5 h-3.5 text-[#b58d59] dark:text-[#d4b996]" />
              <span>AI Recommendations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181b] dark:text-[#fbfbf9] tracking-tight">
              {title}
            </h2>
            <p className="mt-1 text-sm text-[#71717a] dark:text-[#a1a1aa]">
              Hand-picked properties tailored to top amenities, budget, and guest satisfaction.
            </p>
          </div>

          <Link
            to="/recommendations"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#b58d59] dark:text-[#d4b996] hover:text-[#8c6b3e] dark:hover:text-white group shrink-0"
          >
            <span>Explore All AI Recommendations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((property) => (
            <div
              key={property._id}
              className="group bg-white dark:bg-[#1c1c20] rounded-2xl border border-[#e5e0d8] dark:border-[#27272a] shadow-editorial hover:shadow-editorial-lg hover:border-[#b58d59]/50 transition-all flex flex-col overflow-hidden"
            >
              <div className="relative h-48 w-full overflow-hidden bg-[#f4f0e8] dark:bg-[#27272a]">
                <img
                  src={
                    property.images && property.images.length > 0
                      ? property.images[0]
                      : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Match Percentage Badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#18181b]/90 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                  <Sparkles className="w-3 h-3 text-[#d4b996]" />
                  <span className="text-emerald-400 font-extrabold">{property.matchPercentage}</span>
                  <span>Match</span>
                </div>

                <div className="absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded-lg bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md text-[#18181b] dark:text-[#fbfbf9] text-[10px] font-bold border border-[#e5e0d8] dark:border-[#27272a]">
                  {property.propertyType}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-xs text-[#71717a] dark:text-[#a1a1aa] mb-1">
                  <span className="flex items-center gap-1 truncate max-w-[180px]">
                    <MapPin className="w-3 h-3 text-[#b58d59] dark:text-[#d4b996]" />
                    {property.location}, {property.city}
                  </span>
                  <span className="flex items-center gap-0.5 font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-[11px]">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {property.averageRating ? property.averageRating.toFixed(1) : 'New'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1 mb-1">
                  <Link to={`/properties/${property._id}`} className="font-bold text-[#18181b] dark:text-[#fbfbf9] text-sm line-clamp-1 hover:text-[#b58d59] dark:hover:text-[#d4b996] transition-colors flex-1">
                    {property.title}
                  </Link>
                  {(property.verificationStatus === 'approved' || !property.verificationStatus) && (
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded-full font-bold shrink-0">
                      ✓ Verified
                    </span>
                  )}
                </div>

                <div className="my-2">
                  <span className="text-lg font-extrabold text-[#18181b] dark:text-[#fbfbf9]">
                    {formatCurrency(property.price)}
                  </span>
                  <span className="text-xs text-[#71717a] dark:text-[#a1a1aa]"> / mo</span>
                </div>

                {/* Top Reason */}
                {property.reasons && property.reasons.length > 0 && (
                  <div className="bg-[#fbfbf9] dark:bg-[#141417] border border-[#e8e3da] dark:border-[#27272a] rounded-lg p-2.5 mb-3 mt-auto flex items-start gap-1.5 text-xs text-[#52525b] dark:text-[#d4d4d8]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-tight">{property.reasons[0]}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <Link
                    to={`/properties/${property._id}`}
                    className="py-2 px-2 rounded-xl border border-[#e5e0d8] dark:border-[#27272a] hover:bg-[#fbfbf9] dark:hover:bg-[#27272a] text-[#18181b] dark:text-[#fbfbf9] text-xs font-semibold text-center transition-colors"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/properties/${property._id}/book`}
                    className="py-2 px-2 rounded-xl bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] text-xs font-semibold text-center flex items-center justify-center gap-1 shadow-sm transition-colors"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
