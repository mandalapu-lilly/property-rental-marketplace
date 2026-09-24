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
    'Apartment',
    'House',
    'Villa',
    'Room',
    'Studio',
    'Other',
  ];

  const bedroomOptions = [
    { label: 'Any', value: 'Any' },
    { label: '1+', value: '1' },
    { label: '2+', value: '2' },
    { label: '3+', value: '3' },
    { label: '4+', value: '4' },
    { label: '5+', value: '5' },
  ];

  const bathroomOptions = [
    { label: 'Any', value: 'Any' },
    { label: '1+', value: '1' },
    { label: '2+', value: '2' },
    { label: '3+', value: '3' },
    { label: '4+', value: '4' },
  ];

  const ratingOptions = [
    { label: 'Any Rating', value: 'Any' },
    { label: '4.5+ Stars', value: '4.5' },
    { label: '4.0+ Stars', value: '4.0' },
    { label: '3.5+ Stars', value: '3.5' },
  ];

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Highest Rated', value: 'rating_desc' },
  ];

  // Fetch user favorites if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/api/favorites')
        .then((res) => {
          const favIds = new Set((res.data.favorites || []).map((f) => f.property?._id || f.property));
          setFavorites(favIds);
        })
        .catch(() => {});
    } else {
      setFavorites(new Set());
    }
  }, [isAuthenticated]);

  const toggleFavorite = async (propertyId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in to add properties to your favorites wishlist.');
      return;
    }

    try {
      if (favorites.has(propertyId)) {
        await api.delete(`/api/favorites/${propertyId}`);
        setFavorites((prev) => {
          const updated = new Set(prev);
          updated.delete(propertyId);
          return updated;
        });
      } else {
        await api.post(`/api/favorites/${propertyId}`);
        setFavorites((prev) => {
          const updated = new Set(prev);
          updated.add(propertyId);
          return updated;
        });
      }
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  // Fetch properties from backend API based on current filters
  const fetchProperties = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};

      if (filters.city && filters.city.trim() !== '') {
        params.city = filters.city.trim();
      }

      if (
        filters.propertyType &&
        filters.propertyType !== 'All Types' &&
        filters.propertyType !== 'All'
      ) {
        params.propertyType = filters.propertyType;
      }

      if (filters.minPrice && filters.minPrice !== '') {
        params.minPrice = filters.minPrice;
      }

      if (filters.maxPrice && filters.maxPrice !== '') {
        params.maxPrice = filters.maxPrice;
      }

      if (filters.bedrooms && filters.bedrooms !== 'Any') {
        params.bedrooms = filters.bedrooms;
      }

      if (filters.bathrooms && filters.bathrooms !== 'Any') {
        params.bathrooms = filters.bathrooms;
      }

      if (filters.minRating && filters.minRating !== 'Any') {
        params.minRating = filters.minRating;
      }

      if (filters.verificationStatus && filters.verificationStatus !== 'All') {
        params.verificationStatus = filters.verificationStatus;
      }

      if (filters.sort && filters.sort !== 'newest') {
        params.sort = filters.sort;
      }

      const res = await api.get('/api/properties', { params });
      setProperties(res.data.properties || []);
    } catch (err) {
      console.error('Error fetching filtered properties:', err);
      setError(
        err.response?.data?.error ||
          'Failed to load properties. Please check your filter inputs and backend connection.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync state on URL param changes
  useEffect(() => {
    const currentFilters = {
      city: searchParams.get('city') || '',
      propertyType: searchParams.get('propertyType') || 'All Types',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      bedrooms: searchParams.get('bedrooms') || 'Any',
      bathrooms: searchParams.get('bathrooms') || 'Any',
      minRating: searchParams.get('minRating') || 'Any',
      verificationStatus: searchParams.get('verificationStatus') || 'All',
      sort: searchParams.get('sort') || 'newest',
    };

    setCity(currentFilters.city);
    setPropertyType(currentFilters.propertyType);
    setMinPrice(currentFilters.minPrice);
    setMaxPrice(currentFilters.maxPrice);
    setBedrooms(currentFilters.bedrooms);
    setBathrooms(currentFilters.bathrooms);
    setMinRating(currentFilters.minRating);
    setVerificationStatus(currentFilters.verificationStatus);
    setSort(currentFilters.sort);

    fetchProperties(currentFilters);
  }, [searchParams, fetchProperties]);

  // Handle Apply Filters
  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();

    const newParams = new URLSearchParams();

    if (city.trim()) newParams.set('city', city.trim());
    if (propertyType && propertyType !== 'All Types') newParams.set('propertyType', propertyType);
    if (minPrice) newParams.set('minPrice', minPrice);
    if (maxPrice) newParams.set('maxPrice', maxPrice);
    if (bedrooms && bedrooms !== 'Any') newParams.set('bedrooms', bedrooms);
    if (bathrooms && bathrooms !== 'Any') newParams.set('bathrooms', bathrooms);
    if (minRating && minRating !== 'Any') newParams.set('minRating', minRating);
    if (verificationStatus && verificationStatus !== 'All') newParams.set('verificationStatus', verificationStatus);
    if (sort && sort !== 'newest') newParams.set('sort', sort);

    setSearchParams(newParams);
  };

  // Handle Clear Filters
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

  // Apply Saved Filter Preset
  const handleApplySavedFilters = (filters) => {
    const newParams = new URLSearchParams();
    if (filters.city) newParams.set('city', filters.city);
    if (filters.propertyType && filters.propertyType !== 'All Types') newParams.set('propertyType', filters.propertyType);
    if (filters.minPrice) newParams.set('minPrice', filters.minPrice);
    if (filters.maxPrice) newParams.set('maxPrice', filters.maxPrice);
    if (filters.bedrooms && filters.bedrooms !== 'Any') newParams.set('bedrooms', filters.bedrooms);
    if (filters.bathrooms && filters.bathrooms !== 'Any') newParams.set('bathrooms', filters.bathrooms);
    if (filters.minRating && filters.minRating !== 'Any') newParams.set('minRating', filters.minRating);
    if (filters.verificationStatus && filters.verificationStatus !== 'All') newParams.set('verificationStatus', filters.verificationStatus);
    if (filters.sort && filters.sort !== 'newest') newParams.set('sort', filters.sort);

    setSearchParams(newParams);
  };

  // Check if any filter is active
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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Property Listings
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Search, filter, and discover rental homes, apartments, and luxury villas.
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
            <div className="inline-flex rounded-xl p-1 bg-slate-200/80 border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map View</span>
              </button>
            </div>

            <button
              onClick={() => handleApplyFilters()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              title="Refresh Listings"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Search, Filter & Sort Control Panel */}
        <form
          onSubmit={handleApplyFilters}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>Search & Filter Properties</span>
            </h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* 1. Search by City / Location */}
            <div className="xl:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="city-input">
                Search by City / Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="city-input"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city or locality..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* 2. Property Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="property-type">
                Property Type
              </label>
              <select
                id="property-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Minimum Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="min-price">
                Min Price (₹)
              </label>
              <input
                id="min-price"
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="e.g. 10000"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* 4. Maximum Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="max-price">
                Max Price (₹)
              </label>
              <input
                id="max-price"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* 5. Bedrooms */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="bedrooms-select">
                Bedrooms
              </label>
              <select
                id="bedrooms-select"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {bedroomOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Bathrooms */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="bathrooms-select">
                Bathrooms
              </label>
              <select
                id="bathrooms-select"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {bathroomOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 7. Minimum Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="rating-select">
                Min Rating
              </label>
              <select
                id="rating-select"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {ratingOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 8. Verification Badge Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="verification-select">
                Verification
              </label>
              <select
                id="verification-select"
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Properties</option>
                <option value="approved">✓ Verified Only</option>
              </select>
            </div>
          </div>

          {/* Sort By & Submit Buttons Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-slate-100">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                Sort By:
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all cursor-pointer"
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
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Applying filters...</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse"
                >
                  <div className="h-52 bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="pt-4 flex justify-between">
                      <div className="h-6 bg-slate-200 rounded w-1/3" />
                      <div className="h-6 bg-slate-200 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-3">
            <p className="text-rose-800 font-bold">{error}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleApplyFilters()}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Retry
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Home className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No properties found matching your filters.
            </h3>
            <p className="text-sm text-slate-500">
              Try adjusting your price range, location search, or bedroom count to find available rental listings.
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === 'map' ? (
          /* Map View Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'} on Map</span>
              {hasActiveFilters && (
                <span className="text-indigo-600 font-medium">Filtered results</span>
              )}
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <PropertyMap properties={properties} height="600px" />
            </div>
          </div>
        ) : (
          /* List / Card Grid View Mode */
          <div className="space-y-4">
            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}</span>
              {hasActiveFilters && (
                <span className="text-indigo-600 font-medium">Filtered results</span>
              )}
            </div>

            {/* Properties Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Property Image Cover */}
                    <div className="relative h-52 bg-slate-100 overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(property._id, e)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-md transition-transform hover:scale-110 cursor-pointer ${
                          favorites.has(property._id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/80 text-slate-600 hover:text-rose-500'
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
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between gap-1.5 text-xs font-semibold text-slate-500">
                        <div className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {property.location}, {property.city}
                          </span>
                        </div>
                        {property.totalReviews > 0 && (
                          <div className="flex items-center gap-1 text-amber-500 shrink-0 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{property.averageRating?.toFixed(1)}</span>
                            <span className="text-slate-400 font-normal">({property.totalReviews})</span>
                          </div>
                        )}
                      </div>

                      {/* Verified Badge */}
                      {(property.verificationStatus === 'approved' || !property.verificationStatus) && (
                        <div className="flex items-center">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/90 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ✓ Verified Property
                          </span>
                        </div>
                      )}

                      <h2 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {property.title}
                      </h2>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {property.description}
                      </p>

                      {/* Specs Row */}
                      <div className="pt-2 flex items-center gap-4 text-xs text-slate-600 border-t border-slate-100">
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
                  <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-50 mt-2 gap-2">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Rent</span>
                      <span className="text-lg font-extrabold text-slate-900">
                        ₹{property.price?.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500">/mo</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCompare(property)}
                        className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          isInCompare(property._id)
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title={isInCompare(property._id) ? 'Remove from Comparison' : 'Add to Comparison'}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{isInCompare(property._id) ? 'In Compare' : 'Compare'}</span>
                      </button>

                      <Link
                        to={`/properties/${property._id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-bold rounded-xl transition-all shadow-sm"
                      >
                        <span>Details</span>
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
