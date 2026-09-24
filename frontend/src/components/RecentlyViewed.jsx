import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2, MapPin, ArrowRight, IndianRupee, ShieldCheck } from 'lucide-react';

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
    <div className="my-10 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Recently Viewed Properties</h3>
            <p className="text-xs text-slate-500">Pick up right where you left off</p>
          </div>
        </div>
        <button
          onClick={clearHistory}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-rose-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recentItems.slice(0, 4).map((prop) => (
          <Link
            key={prop._id}
            to={`/properties/${prop._id}`}
            className="group block bg-slate-50 rounded-xl overflow-hidden border border-slate-200/70 hover:shadow-md hover:border-indigo-200 transition-all"
          >
            <div className="aspect-[16/10] relative overflow-hidden bg-slate-200">
              <img
                src={prop.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'}
                alt={prop.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-md">
                ₹{prop.price?.toLocaleString()}
                <span className="text-[10px] font-normal text-slate-300">/mo</span>
              </span>
              {prop.verificationStatus === 'approved' && (
                <span className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-xs text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                {prop.title}
              </h4>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 truncate">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                {prop.location}, {prop.city}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
