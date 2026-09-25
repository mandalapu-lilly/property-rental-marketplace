import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Bed, Bath, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function SimilarProperties({ currentProperty }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!currentProperty?._id) return;

    // Fetch similar properties by city / type
    const query = new URLSearchParams({
      city: currentProperty.city || '',
      propertyType: currentProperty.propertyType || '',
      limit: '4',
    }).toString();

    api.get(`/api/properties?${query}`)
      .then((res) => {
        if (isMounted && res.data?.properties) {
          const filtered = res.data.properties.filter((p) => p._id !== currentProperty._id);
          setSimilar(filtered.slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentProperty?._id, currentProperty?.city, currentProperty?.propertyType]);

  if (similar.length === 0) return null;

  return (
    <div className="my-10 bg-white dark:bg-[#1c1c20] rounded-2xl border border-[#e5e0d8] dark:border-[#27272a] p-5 sm:p-6 shadow-editorial">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e8e3da] dark:border-[#27272a]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f4f0e8] dark:bg-[#27272a] text-[#b58d59] dark:text-[#d4b996] flex items-center justify-center border border-[#ded7cb] dark:border-[#3f3f46]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#18181b] dark:text-[#fbfbf9]">Similar Recommended Rentals</h3>
            <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">Comparable properties in {currentProperty.city}</p>
          </div>
        </div>
        <Link
          to={`/properties?city=${encodeURIComponent(currentProperty.city || '')}&propertyType=${encodeURIComponent(currentProperty.propertyType || '')}`}
          className="text-xs font-semibold text-[#b58d59] dark:text-[#d4b996] hover:text-[#8c6b3e] dark:hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>View all in {currentProperty.city}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {similar.map((prop) => (
          <Link
            key={prop._id}
            to={`/properties/${prop._id}`}
            className="group block bg-[#fbfbf9] dark:bg-[#141417] rounded-xl overflow-hidden border border-[#e5e0d8] dark:border-[#27272a] hover:shadow-editorial hover:border-[#b58d59]/50 transition-all flex flex-col"
          >
            <div className="aspect-[16/10] relative overflow-hidden bg-[#f4f0e8] dark:bg-[#27272a]">
              <img
                src={prop.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'}
                alt={prop.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 left-2 bg-[#18181b]/85 dark:bg-[#121214]/90 backdrop-blur-sm text-white dark:text-[#fbfbf9] text-xs font-bold px-2 py-0.5 rounded-md border border-white/10">
                ₹{prop.price?.toLocaleString()}
                <span className="text-[10px] font-normal text-[#d4cdc3] dark:text-[#a1a1aa]">/night</span>
              </span>
              {prop.verificationStatus === 'approved' && (
                <span className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-xs text-[#18181b] dark:text-[#fbfbf9] group-hover:text-[#b58d59] dark:group-hover:text-[#d4b996] transition-colors line-clamp-1">
                  {prop.title}
                </h4>
                <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] flex items-center gap-1 mt-1 truncate">
                  <MapPin className="w-3 h-3 text-[#8c827a] shrink-0" />
                  {prop.location}, {prop.city}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-3 pt-2 border-t border-[#e8e3da] dark:border-[#27272a] text-[11px] text-[#71717a] dark:text-[#a1a1aa]">
                <span className="flex items-center gap-1">
                  <Bed className="w-3 h-3 text-[#b58d59] dark:text-[#d4b996]" />
                  {prop.bedrooms} Bed
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="w-3 h-3 text-[#b58d59] dark:text-[#d4b996]" />
                  {prop.bathrooms} Bath
                </span>
                <span className="ml-auto font-bold text-amber-500">
                  ★ {prop.averageRating ? prop.averageRating.toFixed(1) : 'New'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
