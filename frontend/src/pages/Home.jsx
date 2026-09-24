import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
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
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

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
    { name: 'Apartments', type: 'Apartment', icon: Building2, count: 'Flats & High-Rises' },
    { name: 'Villas', type: 'Villa', icon: Sparkles, count: 'Luxury Estates' },
    { name: 'Houses', type: 'House', icon: HomeIcon, count: 'Independent Homes' },
    { name: 'Studios', type: 'Studio', icon: Key, count: 'Modern Compact' },
    { name: 'Rooms', type: 'Room', icon: Users, count: 'Private Rooms' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-300 text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Verified Stays & Trusted Rental Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
              Find a place you'll <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">love to stay</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              Explore thousands of verified flats, luxury villas, and comfortable studios with transparent pricing, instant booking requests, and host reviews.
            </p>
          </div>

          {/* Hero Interactive Search Bar */}
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/20 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-slate-900"
            >
              {/* City Input */}
              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 ml-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Where are you going?"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 ml-1">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All Types">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="House">House</option>
                  <option value="Studio">Studio</option>
                  <option value="Room">Room</option>
                </select>
              </div>

              {/* Max Budget */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 ml-1">
                  Max Monthly Budget
                </label>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="e.g. 40000"
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Stays</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center mb-6">
            Explore Stays by Property Type
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/properties?propertyType=${cat.type}`}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-md transition-all text-center group flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-700 group-hover:text-indigo-600 group-hover:border-indigo-200 flex items-center justify-center transition-colors shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">{cat.count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES (REAL BACKEND DATA) */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Top Rated Listings
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Featured Properties
              </h2>
            </div>

            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>View All Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl h-64 border border-slate-200 animate-pulse p-6" />
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
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    <div className="relative h-52 bg-slate-100 overflow-hidden">
                      {prop.images && prop.images.length > 0 ? (
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-indigo-400 bg-indigo-50">
                          <Building2 className="w-12 h-12" />
                        </div>
                      )}

                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-700 shadow-sm">
                        {prop.propertyType}
                      </span>

                      {prop.averageRating > 0 && (
                        <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-400 shadow-sm flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{prop.averageRating}</span>
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{prop.location}, {prop.city}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {prop.title}
                      </h3>

                      <div className="pt-2 flex items-center gap-4 text-xs text-slate-600 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prop.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prop.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prop.area} sqft</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-50 mt-2">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Rent</span>
                      <span className="text-lg font-black text-slate-900">
                        ₹{prop.price?.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500">/mo</span>
                    </div>

                    <Link
                      to={`/properties/${prop._id}`}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-bold rounded-xl transition-all shadow-sm"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. PLATFORM PILLARS */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Why Tenants & Hosts Choose HavenStay
            </h2>
            <p className="text-slate-500 text-sm">
              An authentic peer-to-peer rental experience designed with trust, security, and verified coordinates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Verified Hosts & Reviews</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Only guests with verified completed stays can publish reviews and ratings, keeping community feedback authentic.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Interactive Leaflet Maps</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discover properties on an interactive OpenStreetMap view, filtering locations and checking neighborhood details.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
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
      <section className="py-16 bg-gradient-to-br from-indigo-900 to-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to list your space or find your next rental?
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of renters and property owners on HavenStay today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/properties"
              className="px-6 py-3 bg-white text-indigo-950 hover:bg-slate-100 font-bold text-sm rounded-xl shadow-lg transition-colors w-full sm:w-auto"
            >
              Explore All Listings
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-colors w-full sm:w-auto"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HavenStay Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/properties" className="hover:text-indigo-600">Properties</Link>
            <span>•</span>
            <Link to="/login" className="hover:text-indigo-600">Sign In</Link>
            <span>•</span>
            <Link to="/register" className="hover:text-indigo-600">Host with Us</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
