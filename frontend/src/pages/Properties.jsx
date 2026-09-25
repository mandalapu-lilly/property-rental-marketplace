import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import PropertyMap from '../components/PropertyMap';
import SavedSearchesDrawer from '../components/SavedSearchesDrawer';
import RecentlyViewed from '../components/RecentlyViewed';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ArrowRight,
  RefreshCw,
  Home,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Heart,
  Star,
  List,
  Map as MapIcon,
  ShieldCheck,
  Layers,
  Compass,
} from 'lucide-react';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { toggleCompare, isInCompare } = useCompare();

  // Initialize filter state from URL search params
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'All Types');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'Any');
  const [bathrooms, setBathrooms] = useState(searchParams.get('bathrooms') || 'Any');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || 'Any');
  const [verificationStatus, setVerificationStatus] = useState(searchParams.get('verificationStatus') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'

  const propertyTypes = [
    'All Types',
    'Hotel',
    'Resort',
    'Homestay',
    'Guest House',
    'Apartment',
    'Villa',
    'House',
    'Studio',
    'Room',
    'Other',
  ];

  const bedroomOptions = [
    { label: 'Any Beds', value: 'Any' },
    { label: '1+ Bed', value: '1' },
    { label: '2+ Beds', value: '2' },
    { label: '3+ Beds', value: '3' },
    { label: '4+ Beds', value: '4' },
    { label: '5+ Beds', value: '5' },
  ];

  const ratingOptions = [
    { label: 'Any Rating', value: 'Any' },
    { label: '4.5+ Stars', value: '4.5' },
    { label: '4.0+ Stars', value: '4.0' },
    { label: '3.5+ Stars', value: '3.5' },
  ];

  const popularCities = [
    'All Cities',
    'Guntur',
    'Vijayawada',
    'Hyderabad',
    'Bangalore',
    'Goa',
    'Visakhapatnam',
    'Tirupati',
    'Mumbai',
    'Delhi',
    'Jaipur',
    'Kochi',
    'Ooty',
    'Manali',
    'Pondicherry',
    'Chennai',
  ];

  const sortOptions = [
    { label: 'Newest Additions', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Highest Rated', value: 'rating_desc' },
  ];

  const handleSelectCityChip = (selectedCity) => {
    const updated = selectedCity === 'All Cities' ? '' : selectedCity;
    setCity(updated);
  };

  // Fetch tenant wishlist if authenticated
  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      api
        .get('/api/favorites')
        .then((res) => {
          if (isMounted && res.data?.favorites) {
            const favIds = new Set(
              res.data.favorites.map((f) => (typeof f.property === 'object' ? f.property._id : f.property))
            );
            setFavorites(favIds);
          }
        })
        .catch(() => {});
    } else {
      setFavorites(new Set());
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const toggleFavorite = async (propertyId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please log in to save properties to your wishlist.');
      return;
    }

    const isFav = favorites.has(propertyId);

    try {
      if (isFav) {
        await api.delete(`/api/favorites/${propertyId}`);
        setFavorites((prev) => {
          const updated = new Set(prev);
          updated.delete(propertyId);
          return updated;
        });
      } else {
        await api.post('/api/favorites', { propertyId });
        setFavorites((prev) => new Set(prev).add(propertyId));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Main Fetch Function with Multi-Filter Support
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (city.trim()) params.city = city.trim();
      if (propertyType && propertyType !== 'All Types') params.propertyType = propertyType;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (bedrooms && bedrooms !== 'Any') params.bedrooms = bedrooms;
      if (bathrooms && bathrooms !== 'Any') params.bathrooms = bathrooms;
      if (minRating && minRating !== 'Any') params.minRating = minRating;
      if (verificationStatus && verificationStatus !== 'All') params.verificationStatus = verificationStatus;
      if (sort) params.sort = sort;

      const res = await api.get('/api/properties', { params });
      setProperties(res.data.properties || []);
    } catch (err) {
      console.error('Fetch properties error:', err);
      setError(
        err.response?.data?.message ||
        'Unable to load properties. Please ensure the backend server is active.'
      );
    } finally {
      setLoading(false);
    }
  }, [city, propertyType, minPrice, maxPrice, bedrooms, bathrooms, minRating, verificationStatus, sort]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set('city', city.trim());
    if (propertyType && propertyType !== 'All Types') params.set('propertyType', propertyType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms && bedrooms !== 'Any') params.set('bedrooms', bedrooms);
    if (bathrooms && bathrooms !== 'Any') params.set('bathrooms', bathrooms);
    if (minRating && minRating !== 'Any') params.set('minRating', minRating);
    if (verificationStatus && verificationStatus !== 'All') params.set('verificationStatus', verificationStatus);
    if (sort) params.set('sort', sort);

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setCity('');
    setPropertyType('All Types');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('Any');
    setBathrooms('Any');
    setMinRating('Any');
    setVerificationStatus('All');
    setSort('newest');
    setSearchParams(new URLSearchParams());
  };

  const handleApplySavedFilters = (filters) => {
    if (filters.city !== undefined) setCity(filters.city);
    if (filters.propertyType !== undefined) setPropertyType(filters.propertyType);
    if (filters.minPrice !== undefined) setMinPrice(filters.minPrice);
    if (filters.maxPrice !== undefined) setMaxPrice(filters.maxPrice);
    if (filters.bedrooms !== undefined) setBedrooms(filters.bedrooms);
    if (filters.bathrooms !== undefined) setBathrooms(filters.bathrooms);
    if (filters.minRating !== undefined) setMinRating(filters.minRating);
    if (filters.verificationStatus !== undefined) setVerificationStatus(filters.verificationStatus);
    if (filters.sort !== undefined) setSort(filters.sort);
  };

  const hasActiveFilters =
    city.trim() !== '' ||
    (propertyType && propertyType !== 'All Types') ||
    minPrice !== '' ||
    maxPrice !== '' ||
    (bedrooms && bedrooms !== 'Any') ||
    (bathrooms && bathrooms !== 'Any') ||
    (minRating && minRating !== 'Any') ||
    (verificationStatus && verificationStatus !== 'All') ||
    sort !== 'newest';

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#fbfbf9] dark:bg-[#121214] py-10 sm:py-14 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Page Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#71717a] dark:text-[#a1a1aa] block mb-1">
              / The Complete Collection /
            </span>
            <h1 className="font-editorial text-5xl sm:text-6xl font-light text-[#18181b] dark:text-[#fbfbf9] tracking-tight uppercase">
              Explore Homes
            </h1>
            <p className="text-[#71717a] dark:text-[#a1a1aa] text-xs sm:text-sm mt-1 max-w-xl font-normal">
              Search, filter, and discover architectural villas, luxury hotels, penthouses, and peaceful homestays.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Saved Searches Drawer */}
            <SavedSearchesDrawer
              currentFilters={{
                city,
                propertyType,
                minPrice,
                maxPrice,
                bedrooms,
                bathrooms,
                minRating,
                verificationStatus,
                sort,
              }}
              onApplySearch={handleApplySavedFilters}
            />

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-full p-1 bg-[#f4f0e8] dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a]">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] shadow-sm'
                    : 'text-[#71717a] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] shadow-sm'
                    : 'text-[#71717a] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
            </div>

            <button
              onClick={() => handleApplyFilters()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#e5e0d8] dark:border-[#27272a] bg-white dark:bg-[#1c1c20] hover:bg-[#f4f0e8] dark:hover:bg-[#27272a] text-[#18181b] dark:text-[#fbfbf9] text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              title="Refresh Listings"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#18181b] dark:text-[#d4b996]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Search, Filter & Sort Control Panel */}
        <form
          onSubmit={handleApplyFilters}
          className="bg-white dark:bg-[#1c1c20] p-6 sm:p-8 rounded-[2rem] border border-[#e5e0d8] dark:border-[#27272a] shadow-editorial space-y-6"
        >
          <div className="flex items-center justify-between border-b border-[#f4f0e8] dark:border-[#27272a] pb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#18181b] dark:text-[#fbfbf9] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#8c827a] dark:text-[#d4b996]" />
              <span>Search & Refine Stays</span>
            </h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          {/* Quick Popular City Selection Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-[#71717a] dark:text-[#a1a1aa] shrink-0 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#d4b996]" />
              Cities:
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {popularCities.map((c) => {
                const isSelected =
                  (c === 'All Cities' && !city) ||
                  (city && city.toLowerCase() === c.toLowerCase());
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleSelectCityChip(c)}
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] shadow-sm'
                        : 'bg-[#f4f0e8] dark:bg-[#27272a] text-[#52525b] dark:text-[#a1a1aa] hover:bg-[#ede7dc] dark:hover:bg-[#3f3f46] hover:text-[#18181b] dark:hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* 1. Search by City / Location */}
            <div className="xl:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] mb-1" htmlFor="city-input">
                City / Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a1a1aa]">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="city-input"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Search city or location..."
                  className="w-full pl-10 pr-3 py-2.5 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] placeholder-[#a1a1aa] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
                />
              </div>
            </div>

            {/* 2. Property Type */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] mb-1" htmlFor="property-type">
                Category
              </label>
              <select
                id="property-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all cursor-pointer"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type} className="dark:bg-[#1c1c20]">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Min Price */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] mb-1" htmlFor="min-price">
                Min Price (₹)
              </label>
              <input
                id="min-price"
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min ₹"
                className="w-full px-3 py-2.5 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] placeholder-[#a1a1aa] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
              />
            </div>

            {/* 4. Max Price */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] mb-1" htmlFor="max-price">
                Max Price (₹)
              </label>
              <input
                id="max-price"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max ₹"
                className="w-full px-3 py-2.5 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] placeholder-[#a1a1aa] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all"
              />
            </div>

            {/* 5. Bedrooms */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] mb-1" htmlFor="bedrooms-select">
                Bedrooms
              </label>
              <select
                id="bedrooms-select"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] focus:outline-none focus:ring-1 focus:ring-[#b58d59] transition-all cursor-pointer"
              >
                {bedroomOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="dark:bg-[#1c1c20]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary Filter Row: Rating & Verified */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] mb-1" htmlFor="rating-select">
                Minimum Rating
              </label>
              <select
                id="rating-select"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] focus:outline-none focus:ring-1 focus:ring-[#b58d59] cursor-pointer"
              >
                {ratingOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="dark:bg-[#1c1c20]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] mb-1" htmlFor="verification-select">
                Host Verification
              </label>
              <select
                id="verification-select"
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-xl text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] focus:outline-none focus:ring-1 focus:ring-[#b58d59] cursor-pointer"
              >
                <option value="All" className="dark:bg-[#1c1c20]">All Properties</option>
                <option value="approved" className="dark:bg-[#1c1c20]">✓ Verified Only</option>
              </select>
            </div>
          </div>

          {/* Sort By & Submit Buttons Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-[#f4f0e8] dark:border-[#27272a]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#a1a1aa]" />
                Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3.5 py-1.5 bg-[#fbfbf9] dark:bg-[#141417] border border-[#e5e0d8] dark:border-[#27272a] rounded-full text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] focus:outline-none focus:ring-1 focus:ring-[#b58d59]"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="dark:bg-[#1c1c20]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-5 py-2.5 bg-[#f4f0e8] hover:bg-[#ede7dc] dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-[#18181b] dark:text-[#fbfbf9] font-semibold text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider rounded-full shadow-editorial disabled:opacity-50 transition-all cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        </form>

        {/* Results Area */}
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#71717a] dark:text-[#a1a1aa] font-medium">
              <span>Applying filters...</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white dark:bg-[#1c1c20] rounded-[2rem] border border-[#e5e0d8] dark:border-[#27272a] overflow-hidden animate-pulse p-6 h-96"
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-[2rem] p-8 text-center max-w-xl mx-auto space-y-3">
            <p className="text-rose-800 dark:text-rose-300 font-bold">{error}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleApplyFilters()}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-full hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Retry
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-[#e5e0d8] dark:bg-[#27272a] text-[#18181b] dark:text-[#fbfbf9] text-xs font-semibold rounded-full hover:bg-[#d4cdc3] dark:hover:bg-[#3f3f46] transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white dark:bg-[#1c1c20] rounded-[2rem] border border-[#e5e0d8] dark:border-[#27272a] p-12 text-center max-w-lg mx-auto shadow-editorial space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center mx-auto border border-[#e5e0d8] dark:border-[#3f3f46]">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#18181b] dark:text-[#fbfbf9]">
              No properties found matching your filters.
            </h3>
            <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
              Try adjusting your price range, location search, or bedroom count to discover available listings.
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] text-xs font-semibold uppercase tracking-wider rounded-full shadow-editorial transition-all cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === 'map' ? (
          /* Map View Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#71717a] dark:text-[#a1a1aa] font-semibold px-1">
              <span>Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'} on Map</span>
              {hasActiveFilters && (
                <span className="text-[#18181b] dark:text-[#d4b996] font-medium">Filtered results</span>
              )}
            </div>
            <div className="bg-white dark:bg-[#1c1c20] p-4 rounded-[2rem] border border-[#e5e0d8] dark:border-[#27272a] shadow-editorial overflow-hidden">
              <PropertyMap properties={properties} height="600px" />
            </div>
          </div>
        ) : (
          /* List / Card Grid View Mode */
          <div className="space-y-6">
            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-[#71717a] dark:text-[#a1a1aa] font-semibold px-1">
              <span>Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}</span>
              {hasActiveFilters && (
                <span className="text-[#18181b] dark:text-[#d4b996] font-medium">Filtered results</span>
              )}
            </div>

            {/* Properties Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white dark:bg-[#1c1c20] rounded-[2rem] border border-[#e5e0d8] dark:border-[#27272a] shadow-editorial hover:shadow-editorial-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Property Image Cover */}
                    <div className="relative h-64 bg-[#f4f0e8] dark:bg-[#27272a] overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-full h-full items-center justify-center bg-[#f4f0e8] dark:bg-[#27272a] text-[#71717a] ${
                          property.images && property.images.length > 0 ? 'hidden' : 'flex'
                        }`}
                      >
                        <Building2 className="w-12 h-12" />
                      </div>

                      {/* Property Type Badge */}
                      <span className="absolute top-4 left-4 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#18181b] dark:text-[#fbfbf9] shadow-sm border border-[#e5e0d8] dark:border-[#27272a]">
                        {property.propertyType}
                      </span>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(property._id, e)}
                        className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md shadow-sm transition-all duration-200 hover:scale-110 cursor-pointer ${
                          favorites.has(property._id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/85 dark:bg-[#18181b]/85 text-[#18181b] dark:text-[#fbfbf9] hover:text-rose-500 hover:bg-white dark:hover:bg-[#27272a]'
                        }`}
                        title={favorites.has(property._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favorites.has(property._id) ? 'fill-current' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Body Details */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-1.5 text-xs text-[#71717a] dark:text-[#a1a1aa]">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#a1a1aa] shrink-0" />
                          <span className="truncate">
                            {property.location}, {property.city}
                          </span>
                        </div>
                        {property.totalReviews > 0 && (
                          <div className="flex items-center gap-1 text-[#18181b] dark:text-[#fbfbf9] shrink-0 font-bold">
                            <Star className="w-3.5 h-3.5 fill-[#d4b996] text-[#d4b996]" />
                            <span>{property.averageRating?.toFixed(1)}</span>
                            <span className="text-[#a1a1aa] font-normal text-[11px]">({property.totalReviews})</span>
                          </div>
                        )}
                      </div>

                      {/* Verified Badge */}
                      {(property.verificationStatus === 'approved' || !property.verificationStatus) && (
                        <div className="flex items-center">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ✓ Verified Property
                          </span>
                        </div>
                      )}

                      <h2 className="font-editorial text-xl font-bold text-[#18181b] dark:text-[#fbfbf9] line-clamp-1 group-hover:text-[#b58d59] dark:group-hover:text-[#d4b996] transition-colors">
                        {property.title}
                      </h2>

                      <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] line-clamp-2 leading-relaxed">
                        {property.description}
                      </p>

                      {/* Specs Row */}
                      <div className="pt-2 flex items-center gap-4 text-xs font-medium text-[#71717a] dark:text-[#a1a1aa] border-t border-[#f4f0e8] dark:border-[#27272a]">
                        <div className="flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5 text-[#a1a1aa]" />
                          <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5 text-[#a1a1aa]" />
                          <span>{property.area} sqft</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-[#f4f0e8] dark:border-[#27272a] mt-2 gap-2">
                    <div>
                      <span className="text-[9px] text-[#a1a1aa] block font-semibold uppercase tracking-wider">Rate</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-[#18181b] dark:text-[#fbfbf9]">
                          ₹{property.price?.toLocaleString()}
                        </span>
                        <span className="text-xs text-[#71717a] dark:text-[#a1a1aa] font-normal">/mo</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCompare(property)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                          isInCompare(property._id)
                            ? 'bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] shadow-sm'
                            : 'bg-[#f4f0e8] hover:bg-[#ede7dc] dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-[#18181b] dark:text-[#fbfbf9]'
                        }`}
                        title={isInCompare(property._id) ? 'Remove from Comparison' : 'Add to Comparison'}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{isInCompare(property._id) ? 'Added' : 'Compare'}</span>
                      </button>

                      <Link
                        to={`/properties/${property._id}`}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] text-xs font-semibold rounded-full transition-all shadow-sm"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Properties Strip */}
        <RecentlyViewed />
      </div>
    </div>
  );
}
