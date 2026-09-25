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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md shadow-sm space-y-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Host Account Required</h2>
          <p className="text-slate-500 text-sm">
            Only users with a <strong className="text-slate-700">Host</strong> or{' '}
            <strong className="text-slate-700">Admin</strong> role can list new properties.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/properties"
              className="px-5 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              to="/my-properties"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to My Properties
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              List a New Rental Property
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Provide complete specifications, location coordinates, pricing, and photos.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Listing error</p>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="title">
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="propertyType">
                    Property Type *
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Resort">Resort</option>
                    <option value="Homestay">Homestay</option>
                    <option value="Guest House">Guest House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                    <option value="Room">Room</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="description">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property, furnishings, view, proximity to transit, etc."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Pricing & Dimensions */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                Pricing & Space Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="price">
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="area">
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="bedrooms">
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="bathrooms">
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Location Details & Map Coordinates */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Location & Map Coordinates
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="location">
                    Locality / Area *
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Indiranagar, 100 Feet Road"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="address">
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="city">
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="state">
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="country">
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Coordinates Section */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Map GPS Coordinates (Optional, enables interactive OpenStreetMap marker)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1" htmlFor="latitude">
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
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1" htmlFor="longitude">
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
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                Amenities & Features
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Popular Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonAmenities.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="amenities">
                  Additional Amenities (comma separated)
                </label>
                <input
                  id="amenities"
                  name="amenities"
                  type="text"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="e.g. Rooftop Terrace, Study Room, EV Charger"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Image URLs Section */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                Property Photos (Image URLs)
              </h2>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste direct image URL (e.g. https://images.unsplash.com/...)"
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Add Image
                </button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-rose-600 text-white opacity-90 hover:opacity-100 shadow cursor-pointer transition-opacity"
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
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                to="/my-properties"
                className="px-5 py-2.5 text-slate-600 hover:text-slate-800 text-sm font-semibold rounded-xl"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-60 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing Listing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
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
