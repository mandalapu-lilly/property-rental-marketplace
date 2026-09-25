import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCompare } from '../context/CompareContext';
import RecommendationsSection from '../components/RecommendationsSection';
import {
  Search,
  MapPin,
  Building2,
  Home as HomeIcon,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight,
  Bed,
  Maximize2,
  Compass,
  Layers,
  CheckCircle2,
  Key,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { toggleCompare, isInCompare } = useCompare();

  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('All Types');
  const [maxPrice, setMaxPrice] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/api/properties/featured');
        setFeaturedProperties(res.data.properties || []);
      } catch (err) {
        console.warn('Could not fetch featured properties:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set('city', city.trim());
    if (propertyType && propertyType !== 'All Types') params.set('propertyType', propertyType);
    if (maxPrice) params.set('maxPrice', maxPrice);

    navigate(`/properties?${params.toString()}`);
  };

  const categories = [
    { name: 'Hotels', type: 'Hotel', icon: Building2, count: 'Grand Suites' },
    { name: 'Resorts', type: 'Resort', icon: Sparkles, count: 'Eco Retreats' },
    { name: 'Homestays', type: 'Homestay', icon: HomeIcon, count: 'Heritage Living' },
    { name: 'Apartments', type: 'Apartment', icon: Layers, count: 'Modern Penthouses' },
    { name: 'Villas', type: 'Villa', icon: Sparkles, count: 'Private Havens' },
    { name: 'Studios', type: 'Studio', icon: Key, count: 'Urban Lofts' },
  ];

  // Lead property for hero floating card
  const leadProperty = featuredProperties.length > 0 ? featuredProperties[0] : null;

  return (
    <main className="min-h-screen bg-[#fbfbf9] dark:bg-[#121214] text-[#18181b] dark:text-[#fbfbf9] flex flex-col justify-between selection:bg-[#18181b] dark:selection:bg-[#d4b996] selection:text-white dark:selection:text-[#18181b] transition-colors duration-300">
      {/* 1. CINEMATIC EDITORIAL HERO SECTION */}
      <section className="pt-8 pb-16 lg:pt-14 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Split Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Column: Oversized Editorial Typography */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8">
            <div className="inline-block">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#71717a] dark:text-[#a1a1aa] block mb-2">
                EXCLUSIVE PROPERTY RENTALS
              </span>
            </div>

            <h1 className="font-editorial text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight leading-[0.92] text-[#18181b] dark:text-[#fbfbf9] uppercase">
              Find Your <br />
              <span className="italic font-normal text-[#b58d59] dark:text-[#d4b996]">Perfect</span> <br />
              Home
            </h1>

            <p className="text-[#52525b] dark:text-[#a1a1aa] text-sm sm:text-base max-w-lg font-normal leading-relaxed">
              Discover curated homes, villas, apartments and luxury stays in prime destinations. HavenStay makes it easy to explore properties, compare options, save your favourites, and find the right stay for your lifestyle.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/properties"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] font-medium text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-editorial hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <span>Explore Homes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/recommendations"
                className="inline-flex items-center gap-2 px-6 py-4 bg-[#f4f0e8] hover:bg-[#ede7dc] dark:bg-[#1c1c20] dark:hover:bg-[#27272a] text-[#18181b] dark:text-[#fbfbf9] font-medium text-xs sm:text-sm tracking-wider uppercase rounded-full border border-[#ded7cb] dark:border-[#3f3f46] transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 text-[#b58d59] dark:text-[#d4b996]" />
                <span>AI Match</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Column: Large Architectural Image & Floating Card */}
          <div className="lg:col-span-6 relative">
            {/* Cinematic Main Property Image */}
            <div className="relative h-[380px] sm:h-[480px] lg:h-[540px] rounded-[2.5rem] overflow-hidden shadow-editorial bg-[#e8e3da] dark:bg-[#27272a]">
              <img
                src={
                  leadProperty?.images?.[0] ||
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
                }
                alt="Luxury Architectural Home"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Floating Top Badge */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md text-[#18181b] dark:text-[#fbfbf9] text-xs font-semibold tracking-wider uppercase shadow-sm border border-white/20">
                  {leadProperty?.propertyType || 'Curated'}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-[#18181b]/80 dark:bg-[#121214]/90 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1 border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-[#d4b996] text-[#d4b996]" />
                  <span>{leadProperty?.averageRating || 4.9}</span>
                </span>
              </div>
            </div>

            {/* Floating Editorial Property Card (Overlay) */}
            <div className="mt-4 lg:mt-0 lg:absolute lg:-bottom-8 lg:-left-10 bg-white/95 dark:bg-[#1c1c20]/95 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] shadow-editorial-lg border border-[#e5e0d8] dark:border-[#27272a] max-w-sm w-full transition-all hover:-translate-y-1 duration-300">
              {/* Category Pills Header */}
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[#71717a] dark:text-[#a1a1aa] mb-2.5">
                <span>Interior</span>
                <span>•</span>
                <span>Architecture</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400">Verified</span>
              </div>

              <div className="space-y-1 mb-3">
                <h3 className="font-editorial text-xl font-bold text-[#18181b] dark:text-[#fbfbf9] tracking-tight line-clamp-1">
                  {leadProperty?.title || 'Modern Architectural Haven'}
                </h3>
                <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] font-normal">
                  {leadProperty?.location ? `${leadProperty.location}, ${leadProperty.city}` : 'Elegant living & pure comfort'}
                </p>
              </div>

              {/* Mini Property Photo Preview */}
              {leadProperty?.images?.[1] && (
                <div className="h-28 rounded-2xl overflow-hidden mb-3.5 bg-[#f4f0e8] dark:bg-[#27272a]">
                  <img
                    src={leadProperty.images[1]}
                    alt="Interior Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Price & View Action */}
              <div className="flex items-center justify-between pt-2 border-t border-[#f4f0e8] dark:border-[#27272a]">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#a1a1aa] block font-semibold">Rate</span>
                  <span className="text-base font-bold text-[#18181b] dark:text-[#fbfbf9]">
                    ₹{leadProperty?.price?.toLocaleString() || '45,000'}
                    <span className="text-xs text-[#71717a] dark:text-[#a1a1aa] font-normal">/mo</span>
                  </span>
                </div>

                <Link
                  to={leadProperty ? `/properties/${leadProperty._id}` : '/properties'}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] text-xs font-semibold rounded-full shadow-sm transition-all"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Clean Search Capsule */}
        <div className="mt-14 max-w-4xl mx-auto">
          <form
            onSubmit={handleHeroSearch}
            className="bg-white dark:bg-[#1c1c20] p-3 rounded-3xl sm:rounded-full shadow-editorial border border-[#e5e0d8] dark:border-[#27272a] grid grid-cols-1 sm:grid-cols-12 gap-2 text-[#18181b] dark:text-[#fbfbf9]"
          >
            {/* City Input */}
            <div className="sm:col-span-4 px-4 py-2 hover:bg-[#fbfbf9] dark:hover:bg-[#27272a] rounded-2xl sm:rounded-full transition-colors">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] mb-0.5">
                Destination / City
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-[#8c827a] dark:text-[#a1a1aa] mr-2 shrink-0" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Goa, Mumbai, Jaipur..."
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#18181b] dark:text-[#fbfbf9] placeholder-[#a1a1aa] focus:outline-none"
                />
              </div>
            </div>

            {/* Property Type Dropdown */}
            <div className="sm:col-span-3 px-4 py-2 hover:bg-[#fbfbf9] dark:hover:bg-[#27272a] rounded-2xl sm:rounded-full transition-colors border-t sm:border-t-0 sm:border-l border-[#f4f0e8] dark:border-[#27272a]">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] mb-0.5">
                Category
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#18181b] dark:text-[#fbfbf9] focus:outline-none cursor-pointer"
              >
                <option value="All Types" className="dark:bg-[#1c1c20]">All Categories</option>
                <option value="Hotel" className="dark:bg-[#1c1c20]">Luxury Hotels</option>
                <option value="Resort" className="dark:bg-[#1c1c20]">Beach & Eco Resorts</option>
                <option value="Homestay" className="dark:bg-[#1c1c20]">Heritage Homestays</option>
                <option value="Apartment" className="dark:bg-[#1c1c20]">Designer Apartments</option>
                <option value="Villa" className="dark:bg-[#1c1c20]">Private Villas</option>
                <option value="Studio" className="dark:bg-[#1c1c20]">Modern Studios</option>
              </select>
            </div>

            {/* Max Budget */}
            <div className="sm:col-span-3 px-4 py-2 hover:bg-[#fbfbf9] dark:hover:bg-[#27272a] rounded-2xl sm:rounded-full transition-colors border-t sm:border-t-0 sm:border-l border-[#f4f0e8] dark:border-[#27272a]">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa] mb-0.5">
                Max Budget (₹)
              </label>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 65,000"
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#18181b] dark:text-[#fbfbf9] placeholder-[#a1a1aa] focus:outline-none"
              />
            </div>

            {/* Search Submit */}
            <div className="sm:col-span-2 flex items-center">
              <button
                type="submit"
                className="w-full h-12 sm:h-full bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] font-semibold text-xs sm:text-sm rounded-2xl sm:rounded-full shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Hero Secondary Panels (Bottom Row) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="p-6 sm:p-8 rounded-[2rem] bg-[#f4f0e8] dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a] flex flex-col justify-between space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#71717a] dark:text-[#a1a1aa]">
              Craftsmanship & Heritage
            </span>
            <div>
              <h4 className="font-editorial text-2xl font-bold uppercase tracking-tight text-[#18181b] dark:text-[#fbfbf9] leading-tight">
                Quality Homes. <br />
                Better Living.
              </h4>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] mt-2">
                Every stay is vetted for architectural excellence, comfort, and prime neighborhood convenience.
              </p>
            </div>
          </div>

          {/* Center Panel (Real Stats) */}
          <div className="p-6 sm:p-8 rounded-[2rem] bg-white dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a] shadow-editorial flex flex-col justify-between space-y-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#71717a] dark:text-[#a1a1aa]">
              Nationwide Marketplace
            </span>
            <div className="space-y-1">
              <span className="font-editorial text-5xl font-light text-[#18181b] dark:text-[#d4b996]">
                40+
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#18181b] dark:text-[#fbfbf9]">
                Curated Luxury Stays
              </p>
              <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa]">
                Across 15 top Indian cities with 100% verified hosts
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="p-6 sm:p-8 rounded-[2rem] bg-[#18181b] dark:bg-[#18181b] border border-[#27272a] text-white flex flex-col justify-between space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a1a1aa]">
              Concierge Guidance
            </span>
            <div>
              <h4 className="font-editorial text-2xl font-light uppercase tracking-tight leading-tight">
                We Help You <br />
                Find Your Next Home
              </h4>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#d4b996] hover:text-white mt-4 transition-colors"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED ACCOMMODATION TYPES */}
      <section className="py-14 bg-white dark:bg-[#18181b] border-y border-[#e5e0d8] dark:border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#71717a] dark:text-[#a1a1aa] block mb-1">
                Collections
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#18181b] dark:text-[#fbfbf9] tracking-tight">
                Browse By Architecture & Type
              </h2>
            </div>
            <Link
              to="/properties"
              className="text-xs font-semibold uppercase tracking-wider text-[#18181b] dark:text-[#d4b996] hover:text-[#71717a] dark:hover:text-white transition-colors"
            >
              All Categories →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/properties?propertyType=${cat.type}`}
                  className="p-5 rounded-3xl bg-[#fbfbf9] dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a] hover:border-[#18181b] dark:hover:border-[#d4b996] hover:bg-white dark:hover:bg-[#27272a] hover:shadow-editorial hover:-translate-y-1 transition-all duration-300 text-center group flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-[#18181b] border border-[#e5e0d8] dark:border-[#3f3f46] text-[#18181b] dark:text-[#d4b996] group-hover:text-white group-hover:bg-[#18181b] dark:group-hover:bg-[#d4b996] dark:group-hover:text-[#18181b] group-hover:border-[#18181b] flex items-center justify-center transition-all duration-300 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs tracking-wide uppercase text-[#18181b] dark:text-[#fbfbf9]">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] text-[#71717a] dark:text-[#a1a1aa] block mt-0.5">{cat.count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES (REAL BACKEND DATA) */}
      <section className="py-16 sm:py-20 bg-[#fbfbf9] dark:bg-[#121214]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#71717a] dark:text-[#a1a1aa] block mb-1">
                Handpicked Sanctuary
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-light text-[#18181b] dark:text-[#fbfbf9] tracking-tight">
                Featured Residences & Stays
              </h2>
            </div>

            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f4f0e8] dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a] text-xs font-semibold uppercase tracking-wider text-[#18181b] dark:text-[#fbfbf9] hover:bg-[#18181b] hover:text-white dark:hover:bg-[#d4b996] dark:hover:text-[#18181b] transition-all shadow-sm"
            >
              <span>View All Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white dark:bg-[#1c1c20] rounded-[2rem] h-96 border border-[#e5e0d8] dark:border-[#27272a] animate-pulse p-6" />
              ))}
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="bg-white dark:bg-[#1c1c20] rounded-[2rem] border border-[#e5e0d8] dark:border-[#27272a] p-12 text-center max-w-md mx-auto space-y-3 shadow-editorial">
              <Building2 className="w-12 h-12 text-[#a1a1aa] mx-auto" />
              <h3 className="font-bold text-[#18181b] dark:text-[#fbfbf9] text-sm">No listings currently published</h3>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">Listings created by hosts will automatically appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((prop) => (
                <div
                  key={prop._id}
                  className="bg-white dark:bg-[#1c1c20] rounded-[2rem] border border-[#e5e0d8] dark:border-[#27272a] shadow-editorial hover:shadow-editorial-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Image Container with Badges */}
                    <div className="relative h-64 bg-[#f4f0e8] dark:bg-[#27272a] overflow-hidden">
                      {prop.images && prop.images.length > 0 ? (
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#71717a] bg-[#f4f0e8] dark:bg-[#27272a]">
                          <Building2 className="w-12 h-12" />
                        </div>
                      )}

                      {/* Pill Category Tag */}
                      <span className="absolute top-4 left-4 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#18181b] dark:text-[#fbfbf9] shadow-sm border border-[#e5e0d8] dark:border-[#27272a]">
                        {prop.propertyType}
                      </span>

                      {/* Rating Badge */}
                      {prop.averageRating > 0 && (
                        <span className="absolute top-4 right-4 bg-[#18181b]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1 border border-white/10">
                          <Star className="w-3.5 h-3.5 fill-[#d4b996] text-[#d4b996]" />
                          <span>{prop.averageRating}</span>
                        </span>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-1.5 text-xs text-[#71717a] dark:text-[#a1a1aa]">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#a1a1aa] shrink-0" />
                          <span className="truncate">{prop.location}, {prop.city}</span>
                        </div>
                        {(prop.verificationStatus === 'approved' || !prop.verificationStatus) && (
                          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 px-2 py-0.5 rounded-full shrink-0">
                            ✓ Verified
                          </span>
                        )}
                      </div>

                      <h3 className="font-editorial text-xl font-bold text-[#18181b] dark:text-[#fbfbf9] line-clamp-1 group-hover:text-[#b58d59] dark:group-hover:text-[#d4b996] transition-colors">
                        {prop.title}
                      </h3>

                      <div className="pt-2 flex items-center gap-4 text-xs font-medium text-[#71717a] dark:text-[#a1a1aa] border-t border-[#f4f0e8] dark:border-[#27272a]">
                        <div className="flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5 text-[#a1a1aa]" />
                          <span>{prop.bedrooms} {prop.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5 text-[#a1a1aa]" />
                          <span>{prop.area} sqft</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Section */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-[#f4f0e8] dark:border-[#27272a] mt-2 gap-2">
                    <div>
                      <span className="text-[9px] text-[#a1a1aa] block font-semibold uppercase tracking-wider">Rate</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-[#18181b] dark:text-[#fbfbf9]">
                          ₹{prop.price?.toLocaleString()}
                        </span>
                        <span className="text-xs text-[#71717a] dark:text-[#a1a1aa] font-normal">/mo</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCompare(prop)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                          isInCompare(prop._id)
                            ? 'bg-[#18181b] text-white dark:bg-[#d4b996] dark:text-[#18181b] shadow-sm'
                            : 'bg-[#f4f0e8] hover:bg-[#ede7dc] dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-[#18181b] dark:text-[#fbfbf9]'
                        }`}
                        title={isInCompare(prop._id) ? 'Remove from Comparison' : 'Add to Comparison'}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{isInCompare(prop._id) ? 'Added' : 'Compare'}</span>
                      </button>

                      <Link
                        to={`/properties/${prop._id}`}
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
          )}
        </div>
      </section>

      {/* AI RECOMMENDATIONS SECTION */}
      <RecommendationsSection limit={3} />

      {/* 4. PLATFORM PILLARS (EDITORIAL MINIMAL) */}
      <section className="py-20 bg-white dark:bg-[#18181b] border-t border-[#e5e0d8] dark:border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#71717a] dark:text-[#a1a1aa]">
              Why HavenStay
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-light text-[#18181b] dark:text-[#fbfbf9] tracking-tight">
              An Elevated Living Standard
            </h2>
            <p className="text-[#71717a] dark:text-[#a1a1aa] text-sm">
              Designed with transparency, authenticated hosts, and seamless rental technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2rem] bg-[#fbfbf9] dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a] space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center border border-[#e5e0d8] dark:border-[#3f3f46]">
                <ShieldCheck className="w-5 h-5 text-[#b58d59] dark:text-[#d4b996]" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#18181b] dark:text-[#fbfbf9]">Verified Hosts & Reviews</h3>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
                Only guests with verified completed stays can publish reviews and ratings, keeping community feedback authentic.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-[#fbfbf9] dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a] space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center border border-[#e5e0d8] dark:border-[#3f3f46]">
                <MapPin className="w-5 h-5 text-[#b58d59] dark:text-[#d4b996]" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#18181b] dark:text-[#fbfbf9]">Interactive Maps</h3>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
                Discover properties on an interactive OpenStreetMap view, filtering locations and checking neighborhood details.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-[#fbfbf9] dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a] space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#f4f0e8] dark:bg-[#27272a] text-[#18181b] dark:text-[#d4b996] flex items-center justify-center border border-[#e5e0d8] dark:border-[#3f3f46]">
                <Building2 className="w-5 h-5 text-[#b58d59] dark:text-[#d4b996]" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#18181b] dark:text-[#fbfbf9]">Comprehensive Host Hub</h3>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
                Dedicated dashboard for hosts to track rental earnings, confirm check-in dates, and manage listings effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL CALL TO ACTION */}
      <section className="py-24 bg-[#18181b] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#a1a1aa] block">
            List or Rent with Seamless Ease
          </span>
          <h2 className="font-editorial text-4xl sm:text-6xl font-light tracking-tight leading-tight">
            Ready to Discover Your Next Sanctuary?
          </h2>
          <p className="text-[#a1a1aa] text-sm sm:text-base max-w-xl mx-auto font-normal">
            Join thousands of discerning renters and property owners on HavenStay today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/properties"
              className="px-8 py-4 bg-white text-[#18181b] hover:bg-[#f4f0e8] font-semibold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-editorial transition-all w-full sm:w-auto"
            >
              Explore All Listings
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-[#27272a] hover:bg-[#3f3f46] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase rounded-full border border-[#3f3f46] transition-all w-full sm:w-auto"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Editorial Footer */}
      <footer className="border-t border-[#e5e0d8] dark:border-[#27272a] bg-[#fbfbf9] dark:bg-[#121214] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-lg bg-[#fbfbf9] dark:bg-[#1c1c20] border border-[#e8e3da] dark:border-[#27272a]">
                <img
                  src="/havenstay-logo.png"
                  alt="HavenStay"
                  className="h-8 w-auto object-contain rounded"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa]">
              <Link to="/properties" className="hover:text-[#18181b] dark:hover:text-white transition-colors">Stays</Link>
              <Link to="/recommendations" className="hover:text-[#18181b] dark:hover:text-white transition-colors">AI Match</Link>
              <Link to="/compare" className="hover:text-[#18181b] dark:hover:text-white transition-colors">Compare</Link>
              <Link to="/login" className="hover:text-[#18181b] dark:hover:text-white transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-[#18181b] dark:hover:text-white transition-colors">Host Hub</Link>
            </div>
          </div>

          <div className="pt-8 border-t border-[#e5e0d8] dark:border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717a] dark:text-[#a1a1aa]">
            <p>© {new Date().getFullYear()} HavenStay Marketplace Inc. All rights reserved.</p>
            <p className="tracking-wide">Architectural Stays & Boutique Residences.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
