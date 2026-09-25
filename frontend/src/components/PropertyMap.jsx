import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Building2, MapPin, ArrowRight } from 'lucide-react';

// Fix default Leaflet marker icon issue in modern bundlers
const customMarkerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to dynamically fit map bounds to all markers
function MapBoundsUpdater({ coordinatesList }) {
  const map = useMap();

  useEffect(() => {
    if (coordinatesList.length > 0) {
      const bounds = L.latLngBounds(coordinatesList.map((c) => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [coordinatesList, map]);

  return null;
}

export default function PropertyMap({ property, properties = [], height = '450px' }) {
  // If single property passed, convert to array
  const items = property ? [property] : properties;

  // Filter items that have valid coordinates
  const validItems = items.filter(
    (p) =>
      p.coordinates &&
      typeof p.coordinates.latitude === 'number' &&
      typeof p.coordinates.longitude === 'number' &&
      !isNaN(p.coordinates.latitude) &&
      !isNaN(p.coordinates.longitude)
  );

  if (validItems.length === 0) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-2xl bg-[#fbfbf9] dark:bg-[#1c1c20] border border-[#e5e0d8] dark:border-[#27272a] flex flex-col items-center justify-center p-6 text-center space-y-2"
      >
        <div className="w-12 h-12 rounded-xl bg-[#f4f0e8] dark:bg-[#27272a] text-[#8c827a] flex items-center justify-center">
          <MapPin className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-[#18181b] dark:text-[#fbfbf9]">
          Map location is not available for {property ? 'this property' : 'these properties'}.
        </p>
        <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] max-w-xs">
          Host has not set geographic GPS coordinates for this listing.
        </p>
      </div>
    );
  }

  // Default center (e.g. first item's coordinates or Bangalore default)
  const defaultCenter = [
    validItems[0].coordinates.latitude,
    validItems[0].coordinates.longitude,
  ];

  const coordinatesList = validItems.map((p) => ({
    lat: p.coordinates.latitude,
    lng: p.coordinates.longitude,
  }));

  return (
    <div
      style={{ height }}
      className="w-full rounded-2xl overflow-hidden border border-[#e5e0d8] dark:border-[#27272a] shadow-editorial relative z-10"
    >
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validItems.length > 1 && <MapBoundsUpdater coordinatesList={coordinatesList} />}

        {validItems.map((item) => (
          <Marker
            key={item._id}
            position={[item.coordinates.latitude, item.coordinates.longitude]}
            icon={customMarkerIcon}
          >
            <Popup>
              <div className="w-56 space-y-2 text-[#18181b] dark:text-[#fbfbf9]">
                {item.images && item.images.length > 0 ? (
                  <div className="h-28 w-full rounded-lg overflow-hidden bg-[#f4f0e8] dark:bg-[#27272a]">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-20 w-full rounded-lg bg-[#f4f0e8] dark:bg-[#27272a] flex items-center justify-center text-[#8c827a]">
                    <Building2 className="w-8 h-8" />
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#b58d59] dark:text-[#d4b996] bg-[#f4f0e8] dark:bg-[#27272a] px-2 py-0.5 rounded border border-[#ded7cb] dark:border-[#3f3f46]">
                    {item.propertyType}
                  </span>
                  <h4 className="font-bold text-xs text-[#18181b] dark:text-[#fbfbf9] mt-1 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] line-clamp-1">
                    {item.location}, {item.city}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#e8e3da] dark:border-[#27272a]">
                  <span className="font-black text-xs text-[#18181b] dark:text-[#fbfbf9]">
                    ₹{item.price?.toLocaleString()}/night
                  </span>
                  <Link
                    to={`/properties/${item._id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#b58d59] dark:text-[#d4b996] hover:text-[#8c6b3e] dark:hover:text-white"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
