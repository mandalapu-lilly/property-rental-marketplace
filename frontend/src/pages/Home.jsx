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
  Bath,
  Maximize2,
  Compass,
  CheckCircle2,
  Users,
  Key,
  Layers,
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
    { name: 'Hotels', type: 'Hotel', icon: Building2, count: 'Luxury & Suites' },
    { name: 'Resorts', type: 'Resort', icon: Sparkles, count: 'Retreats & Getaways' },
    { name: 'Homestays', type: 'Homestay', icon: HomeIcon, count: 'Cozy Living' },
    { name: 'Apartments', type: 'Apartment', icon: Layers, count: 'Flats & High-Rises' },
    { name: 'Villas', type: 'Villa', icon: Sparkles, count: 'Luxury Estates' },
    { name: 'Studios', type: 'Studio', icon: Key, count: 'Modern Compact' },
  ];

  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 sm:pt-20 sm:pb-32 overflow-hidden bg-slate-950 text-white">
        {/* Background Visual Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Main Hero Title & Copy */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Discover Handpicked Stays & Luxury Hotels</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Find a sanctuary you'll <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-100 bg-clip-text text-transparent">love to call home</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              Explore thousands of verified hotels, villas, high-rise suites, and peaceful homestays with verified pricing and instant booking requests.
            </p>
          </div>

          {/* Floating Capsule Search Bar */}
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white/95 backdrop-blur-2xl p-2.5 sm:p-3.5 rounded-3xl sm:rounded-full shadow-2xl shadow-black/40 border border-white/40 grid grid-cols-1 sm:grid-cols-12 gap-2 text-slate-900"
            >
              {/* City Input */}
              <div className="sm:col-span-4 px-3 sm:px-4 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition-colors">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  Location / City
                </label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-indigo-600 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Goa, Delhi..."
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="sm:col-span-3 px-3 sm:px-4 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition-colors border-t sm:border-t-0 sm:border-l border-slate-100">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  Stay Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All Types">All Categories</option>
                  <option value="Hotel">Hotels & Suites</option>
                  <option value="Resort">Resorts & Villas</option>
                  <option value="Homestay">Homestays</option>
                  <option value="Apartment">Apartments</option>
                  <option value="Villa">Villas</option>
                  <option value="Studio">Studios</option>
                  <option value="House">Houses</option>
                </select>
              </div>

              {/* Max Budget */}
              <div className="sm:col-span-3 px-3 sm:px-4 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition-colors border-t sm:border-t-0 sm:border-l border-slate-100">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  Max Budget (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="e.g. 50,000"
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Search Button */}
              <div className="sm:col-span-2 flex items-center">
                <button
                  type="submit"
                  className="w-full h-11 sm:h-full bg-slate-900 hover:bg-indigo-600 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-2xl sm:rounded-full shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="py-12 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600">
              Curated Collections
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Explore by Accommodation Type
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/properties?propertyType=${cat.type}`}
                  className="p-5 rounded-3xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-900 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group flex flex-col items-center justify-center space-y-2.5"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/90 text-slate-700 group-hover:text-white group-hover:bg-slate-900 group-hover:border-slate-900 flex items-center justify-center transition-all duration-300 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{cat.count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES (REAL BACKEND DATA) */}
      <section className="py-16 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600">
                Verified & Handpicked
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Featured Properties & Stays
              </h2>
            </div>

            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition-all"
            >
              <span>View All Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl h-80 border border-slate-200 animate-pulse p-6" />
              ))}
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No listings currently published</h3>
              <p className="text-xs text-slate-500">Listings created by hosts will automatically appear in this section.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((prop) => (
                <div
                  key={prop._id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Image Container with Badges */}
                    <div className="relative h-56 bg-slate-100 overflow-hidden">
                      {prop.images && prop.images.length > 0 ? (
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-indigo-400 bg-indigo-50">
                          <Building2 className="w-12 h-12" />
                        </div>
                      )}

                      {/* Pill Category Tag */}
                      <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-slate-900 shadow-sm border border-slate-100">
                        {prop.propertyType}
                      </span>

                      {/* Rating Badge */}
                      {prop.averageRating > 0 && (
                        <span className="absolute top-3.5 right-3.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-400 shadow-sm flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{prop.averageRating}</span>
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between gap-1.5 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="truncate">{prop.location}, {prop.city}</span>
                        </div>
                        {(prop.verificationStatus === 'approved' || !prop.verificationStatus) && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
                            ✓ Verified
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {prop.title}
                      </h3>

                      <div className="pt-2 flex items-center gap-4 text-xs font-medium text-slate-600 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prop.bedrooms} {prop.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prop.area} sqft</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Section */}
                  <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100/80 mt-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Rate</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-extrabold text-slate-900">
                          ₹{prop.price?.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">/mo</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCompare(prop)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                          isInCompare(prop._id)
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title={isInCompare(prop._id) ? 'Remove from Comparison' : 'Add to Comparison'}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{isInCompare(prop._id) ? 'Added' : 'Compare'}</span>
                      </button>

                      <Link
                        to={`/properties/${prop._id}`}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
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

      {/* 4. PLATFORM PILLARS */}
      <section className="py-16 bg-white border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600">
              Why HavenStay
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              An Elevated Rental Experience
            </h2>
            <p className="text-slate-500 text-sm">
              Designed with transparency, authenticated superhosts, and modern real-estate technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Verified Hosts & Reviews</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Only guests with verified completed stays can publish reviews and ratings, keeping community feedback authentic.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Interactive City Maps</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discover properties on an interactive OpenStreetMap view, filtering locations and checking neighborhood details.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Comprehensive Host Hub</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated dashboard for hosts to track rental earnings, confirm check-in dates, and manage listings effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-indigo-300 text-xs font-semibold">
            <span>List or rent with zero hassle</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to list your space or find your next rental?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of renters and property owners on HavenStay today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              to="/properties"
              className="px-6 py-3.5 bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all w-full sm:w-auto"
            >
              Explore All Listings
            </Link>
            <Link
              to="/register"
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all w-full sm:w-auto"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Luxury Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5 text-indigo-300" />
              </div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">HavenStay</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600">
              <Link to="/properties" className="hover:text-indigo-600 transition-colors">Properties</Link>
              <Link to="/recommendations" className="hover:text-indigo-600 transition-colors">AI Match</Link>
              <Link to="/compare" className="hover:text-indigo-600 transition-colors">Compare</Link>
              <Link to="/login" className="hover:text-indigo-600 transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-indigo-600 transition-colors">Host Hub</Link>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} HavenStay Marketplace Inc. All rights reserved.</p>
            <p>Designed for modern property rental & boutique accommodation.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
