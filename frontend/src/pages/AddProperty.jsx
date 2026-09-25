import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Sparkles,
  ShieldAlert,
  MapPin,
  Check,
} from 'lucide-react';

export default function AddProperty() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isHostOrAdmin = user?.role === 'host' || user?.role === 'admin';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    price: '',
    location: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    amenities: '',
    latitude: '',
    longitude: '',
  });

  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Common quick amenities suggestions
  const commonAmenities = [
    'WiFi',
    'Air Conditioning',
    'Dedicated Parking',
    'Swimming Pool',
    'Fitness Gym',
    'Power Backup',
    'Furnished',
    'Balcony',
    'Security / CCTV',
    'Elevator',
    'Pet Friendly',
    'Washing Machine',
  ];

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;
    setImages([...images, imageUrl.trim()]);
    setImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Combine selected amenities + custom amenities
    const customList = formData.amenities
      ? formData.amenities.split(',').map((a) => a.trim()).filter(Boolean)
      : [];
    const combinedAmenities = Array.from(new Set([...selectedAmenities, ...customList]));

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.location.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.area
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.latitude !== '' && (Number(formData.latitude) < -90 || Number(formData.latitude) > 90)) {
      setError('Latitude must be between -90 and 90 degrees.');
      return;
    }

    if (formData.longitude !== '' && (Number(formData.longitude) < -180 || Number(formData.longitude) > 180)) {
      setError('Longitude must be between -180 and 180 degrees.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        price: Number(formData.price),
        location: formData.location,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        amenities: combinedAmenities,
        images: images,
      };

      if (formData.latitude !== '' && formData.longitude !== '') {
        payload.coordinates = {
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        };
      }

      await api.post('/api/properties', payload);
      navigate('/my-properties', {
        state: { message: 'Property listed successfully!' },
      });
    } catch (err) {
      console.error('Error creating property:', err);
      setError(
        err.response?.data?.error ||
          'Failed to create property. Please verify your details and backend connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isHostOrAdmin) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#fbfbf9] dark:bg-[#121214]">
        <div className="bg-white dark:bg-[#1c1c20] p-8 sm:p-10 rounded-[32px] border border-stone-200/80 dark:border-white/10 text-center max-w-md shadow-sm space-y-4">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-[#fbfbf9]">Host Account Required</h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            Only accounts with <strong className="text-stone-700 dark:text-stone-300">Host</strong> or{' '}
            <strong className="text-stone-700 dark:text-stone-300">Admin</strong> roles can publish new properties.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="py-3 px-5 bg-[#18181b] hover:bg-stone-800 dark:bg-[#d4b996] dark:hover:bg-[#c5a880] dark:text-[#18181b] text-white font-bold text-xs rounded-xl transition-all"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/properties"
              className="py-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 text-xs font-semibold"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbf9] dark:bg-[#121214] py-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <Link
            to="/my-properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Portfolio</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-[#fbfbf9] tracking-tight">
            Publish New Property Listing
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Provide property specifications, GPS coordinates, high-resolution photos, and amenities.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#1c1c20] p-7 sm:p-10 rounded-[36px] border border-stone-200/80 dark:border-white/10 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.03)]">
          {error && (
            <div className="mb-8 flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 text-xs font-bold animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p>Listing Submission Error</p>
                <p className="font-normal text-rose-700 dark:text-rose-300 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-stone-900 dark:text-[#fbfbf9] border-b border-stone-100 dark:border-white/5 pb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#b58d59] dark:text-[#d4b996]" />
                <span>Primary Specifications</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider" htmlFor="title">
                    Property Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Modern 2BHK Luxury Apartment in Indiranagar"
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl text-xs font-medium text-stone-900 dark:text-[#fbfbf9] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#b58d59] focus:bg-white dark:focus:bg-[#18181b] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider" htmlFor="propertyType">
                    Property Type *
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl text-xs font-bold text-stone-800 dark:text-[#fbfbf9] focus:outline-none focus:ring-2 focus:ring-[#b58d59] focus:bg-white dark:focus:bg-[#18181b] transition-all cursor-pointer"
                  >
                    <option value="Hotel" className="dark:bg-[#1c1c20]">Hotel</option>
                    <option value="Resort" className="dark:bg-[#1c1c20]">Resort</option>
                    <option value="Homestay" className="dark:bg-[#1c1c20]">Homestay</option>
                    <option value="Guest House" className="dark:bg-[#1c1c20]">Guest House</option>
                    <option value="Apartment" className="dark:bg-[#1c1c20]">Apartment</option>
                    <option value="House" className="dark:bg-[#1c1c20]">House</option>
                    <option value="Villa" className="dark:bg-[#1c1c20]">Villa</option>
                    <option value="Studio" className="dark:bg-[#1c1c20]">Studio</option>
                    <option value="Room" className="dark:bg-[#1c1c20]">Room</option>
                    <option value="Other" className="dark:bg-[#1c1c20]">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider" htmlFor="description">
                  Full Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detail your space, interior furnishings, natural lighting, transit access, and neighborhood vibes..."
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl text-xs font-medium text-stone-900 dark:text-[#fbfbf9] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#b58d59] focus:bg-white dark:focus:bg-[#18181b] transition-all leading-relaxed"
                />
              </div>
            </div>

            {/* Pricing & Dimensions */}
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-stone-900 dark:text-[#fbfbf9] border-b border-stone-100 dark:border-white/5 pb-3">
                Pricing & Space Dimensions
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider" htmlFor="price">
                    Monthly Rent (₹) *
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="25000"
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl text-xs font-bold text-stone-900 dark:text-[#fbfbf9] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#b58d59] focus:bg-white dark:focus:bg-[#18181b] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider" htmlFor="area">
                    Area (sq ft) *
                  </label>
                  <input
                    id="area"
                    name="area"
                    type="number"
                    min="1"
                    required
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="1200"
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl text-xs font-medium text-stone-900 dark:text-[#fbfbf9] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#b58d59] focus:bg-white dark:focus:bg-[#18181b] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider" htmlFor="bedrooms">
                    Bedrooms *
                  </label>
                  <input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    min="0"
                    required
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl text-xs font-medium text-stone-900 dark:text-[#fbfbf9] focus:outline-none focus:ring-2 focus:ring-[#b58d59] focus:bg-white dark:focus:bg-[#18181b] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider" htmlFor="bathrooms">
                    Bathrooms *
                  </label>
                  <input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    min="0"
                    required
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl text-xs font-medium text-stone-900 dark:text-[#fbfbf9] focus:outline-none focus:ring-2 focus:ring-[#b58d59] focus:bg-white dark:focus:bg-[#18181b] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Location Details & Map Coordinates */}
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-stone-900 dark:text-[#fbfbf9] border-b border-stone-100 dark:border-white/5 pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#b58d59] dark:text-[#d4b996]" />
                <span>Geographic Location & Coordinates</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider" htmlFor="location">
                    Locality / Suburb *
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Indiranagar, 100 Feet Road"
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl text-xs font-medium text-stone-900 dark:text-[#fbfbf9] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#b58d59] focus:bg-white dark:focus:bg-[#18181b] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider" htmlFor="address">
                    Street Address *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. #42, 5th Cross, 12th Main"
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl text-xs font-medium text-stone-900 dark:text-[#fbfbf9] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#b58d59] focus:bg-white dark:focus:bg-[#18181b] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider" htmlFor="city">
                    City *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Bangalore"
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl text-xs font-medium text-stone-900 dark:text-[#fbfbf9] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#b58d59] focus:bg-white dark:focus:bg-[#18181b] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider" htmlFor="state">
                    State *
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Karnataka"
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl text-xs font-medium text-stone-900 dark:text-[#fbfbf9] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#b58d59] focus:bg-white dark:focus:bg-[#18181b] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider" htmlFor="country">
                    Country *
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="India"
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl text-xs font-medium text-stone-900 dark:text-[#fbfbf9] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#b58d59] focus:bg-white dark:focus:bg-[#18181b] transition-all"
                  />
                </div>
              </div>

              {/* Coordinates Section */}
              <div className="p-5 bg-stone-50/80 dark:bg-[#27272a]/60 rounded-2xl border border-stone-200/80 dark:border-white/10 space-y-3">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                  Map GPS Coordinates (Optional, enables interactive OpenStreetMap pin)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider" htmlFor="latitude">
                      Latitude (-90 to 90)
                    </label>
                    <input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      min="-90"
                      max="90"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="e.g. 12.9716"
                      className="w-full px-4 py-2.5 bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-white/10 rounded-xl text-xs font-semibold text-stone-900 dark:text-[#fbfbf9] focus:outline-none focus:ring-2 focus:ring-[#b58d59]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider" htmlFor="longitude">
                      Longitude (-180 to 180)
                    </label>
                    <input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      min="-180"
                      max="180"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="e.g. 77.5946"
                      className="w-full px-4 py-2.5 bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-white/10 rounded-xl text-xs font-semibold text-stone-900 dark:text-[#fbfbf9] focus:outline-none focus:ring-2 focus:ring-[#b58d59]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-stone-900 dark:text-[#fbfbf9] border-b border-stone-100 dark:border-white/5 pb-3">
                Amenities & Features
              </h2>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2.5">
                  Select Featured Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonAmenities.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#18181b] dark:bg-[#d4b996] text-white dark:text-[#18181b] border-[#18181b] dark:border-[#d4b996] shadow-sm'
                            : 'bg-stone-50 dark:bg-[#27272a] text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-[#323238]'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : '+'}
                        <span>{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider" htmlFor="amenities">
                  Custom Amenities (comma separated)
                </label>
                <input
                  id="amenities"
                  name="amenities"
                  type="text"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="e.g. Rooftop Terrace, Private Study, EV Charger"
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl text-xs font-medium text-stone-900 dark:text-[#fbfbf9] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#b58d59]"
                />
              </div>
            </div>

            {/* Image URLs Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-stone-900 dark:text-[#fbfbf9] border-b border-stone-100 dark:border-white/5 pb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#b58d59] dark:text-[#d4b996]" />
                <span>Property Visual Gallery</span>
              </h2>

              <div className="flex gap-2.5">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste direct high-resolution image URL (e.g. Unsplash URL)"
                  className="flex-1 px-4 py-3 bg-stone-50 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 rounded-2xl text-xs font-medium text-stone-900 dark:text-[#fbfbf9] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#b58d59]"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-5 py-3 bg-[#18181b] hover:bg-stone-800 dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
                  {images.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative h-28 rounded-2xl overflow-hidden bg-stone-100 dark:bg-[#27272a] border border-stone-200 dark:border-white/10 group"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-xl bg-[#18181b]/80 hover:bg-rose-600 text-white backdrop-blur-sm shadow cursor-pointer transition-colors"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Actions */}
            <div className="pt-6 border-t border-stone-100 dark:border-white/5 flex items-center justify-end gap-3">
              <Link
                to="/my-properties"
                className="px-5 py-3 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-[#fbfbf9] text-xs font-bold rounded-xl"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#18181b] hover:bg-stone-800 dark:bg-[#d4b996] dark:hover:bg-[#c5a880] text-white dark:text-[#18181b] active:scale-95 font-bold text-xs rounded-2xl shadow-xl disabled:opacity-60 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing Listing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#d4b996] dark:text-[#18181b]" />
                    <span>Publish Property</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
