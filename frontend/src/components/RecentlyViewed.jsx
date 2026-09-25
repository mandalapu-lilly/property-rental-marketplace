import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'havenstay_recently_viewed';

export const trackRecentlyViewed = (property) => {
  if (!property || !property._id) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let items = raw ? JSON.parse(raw) : [];
    // Remove if existing
    items = items.filter((p) => p._id !== property._id);
    // Add to front
    items.unshift({
      _id: property._id,
      title: property.title,
      price: property.price,
      city: property.city,
      location: property.location,
      images: property.images || [],
      propertyType: property.propertyType,
      bedrooms: property.bedrooms,
      averageRating: property.averageRating,
      verificationStatus: property.verificationStatus,
      viewedAt: new Date().toISOString(),
    });
    // Keep max 10
    if (items.length > 10) items = items.slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('Could not store recently viewed:', err);
  }
};

export default function RecentlyViewed({ currentPropertyId = null }) {
  const [recentItems, setRecentItems] = useState([]);

  const loadRecent = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items = JSON.parse(raw);
        setRecentItems(currentPropertyId ? items.filter((i) => i._id !== currentPropertyId) : items);
      }
    } catch {
      setRecentItems([]);
    }
  };

  useEffect(() => {
    loadRecent();
  }, [currentPropertyId]);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentItems([]);
  };

  if (recentItems.length === 0) return null;

  return (
    <div className="my-10 bg-white rounded-[2rem] border border-[#e5e0d8] p-6 sm:p-8 shadow-editorial">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#f4f0e8]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f4f0e8] text-[#18181b] flex items-center justify-center border border-[#e5e0d8]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#18181b]">Recently Viewed Stays</h3>
            <p className="text-xs text-[#71717a]">Pick up right where you left off</p>
          </div>
        </div>
        <button
          onClick={clearHistory}
          className="text-xs font-semibold uppercase tracking-wider text-[#71717a] hover:text-rose-600 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-rose-50 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recentItems.slice(0, 4).map((prop) => (
          <Link
            key={prop._id}
            to={`/properties/${prop._id}`}
            className="group block bg-[#fbfbf9] rounded-2xl overflow-hidden border border-[#e5e0d8] hover:shadow-editorial hover:border-[#18181b] transition-all"
          >
            <div className="aspect-[16/10] relative overflow-hidden bg-[#f4f0e8]">
              <img
                src={prop.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'}
                alt={prop.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2.5 left-2.5 bg-[#18181b]/85 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                ₹{prop.price?.toLocaleString()}
                <span className="text-[10px] font-normal text-[#d4cdc3]">/mo</span>
              </span>
            </div>

            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between gap-1 text-[11px] text-[#71717a]">
                <span className="truncate">{prop.location}, {prop.city}</span>
                <span className="text-[10px] font-bold uppercase text-[#18181b]">{prop.propertyType}</span>
              </div>
              <h4 className="font-editorial text-base font-bold text-[#18181b] truncate group-hover:text-[#8c827a] transition-colors">
                {prop.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
