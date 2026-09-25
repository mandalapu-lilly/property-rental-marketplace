import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Property from './models/Property.js';
import Review from './models/Review.js';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://mandalapulilly_db_user:31UTfHycs5edAckm@cluster0.oqala68.mongodb.net/property_marketplace?retryWrites=true&w=majority';

const allCityProperties = [
  // =========================================================================
  // 1. GUNTUR (Budget/Mid-Range Hotels, Homestays, Villas, Studios)
  // =========================================================================
  {
    title: 'Grand Minerva Luxury Hotel & Executive Suites',
    description: 'Premier 4-star luxury hotel in prime Lakshmipuram. Features plush executive suites, 24/7 room service, multi-cuisine dining, rooftop infinity pool, and airport concierge.',
    propertyType: 'Hotel',
    price: 2899,
    location: 'Lakshmipuram',
    address: '14-2-88, Lakshmipuram Main Road, Near Collector Office',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.3082, longitude: 80.4382 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1600,
    amenities: ['Swimming Pool', 'Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', '24/7 Security', 'Elevator', 'Balcony', 'Gym'],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.85,
    totalReviews: 42,
  },
  {
    title: 'The Capital Grand Business Hotel',
    description: 'Contemporary business hotel located at the heart of Brodipet. High-speed conference facilities, executive work desks, fitness center, complimentary breakfast, and valet parking.',
    propertyType: 'Hotel',
    price: 2499,
    location: 'Brodipet',
    address: '4th Line, Main Commercial Hub, Brodipet',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.3025, longitude: 80.4435 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    amenities: ['Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', '24/7 Security', 'Elevator'],
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.7,
    totalReviews: 28,
  },
  {
    title: 'Amaravathi Riverfront Eco Resort & Wellness Spa',
    description: 'Breathtaking countryside resort set amidst lush greenery along the Krishna riverbank. Private cottages, ayurvedic wellness spa, organic restaurant, and boating experiences.',
    propertyType: 'Resort',
    price: 4850,
    location: 'Amaravathi Road',
    address: 'River View Enclave, Amaravathi Heritage Highway',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.345, longitude: 80.472 },
    bedrooms: 3,
    bathrooms: 3,
    area: 3200,
    amenities: ['Swimming Pool', 'Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Garden', 'Balcony', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.92,
    totalReviews: 36,
  },
  {
    title: 'Palm Breeze Traditional Homestay',
    description: 'Serene South Indian traditional homestay featuring warm hospitality, home-cooked regional cuisine, shaded courtyard with mango trees, and quiet residential neighborhood.',
    propertyType: 'Homestay',
    price: 1850,
    location: 'Koretipadu',
    address: 'Plot 18, Green Meadows, Koretipadu 2nd Lane',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.2985, longitude: 80.4295 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    amenities: ['Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Kitchen', 'Garden', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.88,
    totalReviews: 21,
  },
  {
    title: 'Emerald Palms Luxury Villa',
    description: 'Spectacular 4BHK private luxury villa with a private swimming pool, landscaped lawn, modern modular kitchen, and serene views. Ideal for family vacations and weekend getaways in Guntur.',
    propertyType: 'Villa',
    price: 4500,
    location: 'Lakshmipuram',
    address: 'Plot 42, Green Avenue, Lakshmipuram Main Road',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.3067, longitude: 80.4365 },
    bedrooms: 4,
    bathrooms: 4,
    area: 3400,
    amenities: ['Swimming Pool', 'Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Kitchen', '24/7 Security', 'Balcony', 'Garden'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.9,
    totalReviews: 24,
  },
  {
    title: 'Guntur Central Premium 2BHK Studio Apartment',
    description: 'Modern luxury 2BHK studio apartment near Pattabhipuram commercial zone. Fully air-conditioned, dedicated high-speed workstation, smart TV, and modular kitchen.',
    propertyType: 'Studio',
    price: 1699,
    location: 'Pattabhipuram',
    address: 'Suite 404, Tech Park Residency, Pattabhipuram',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.314, longitude: 80.431 },
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    amenities: ['High-speed Wi-Fi', 'Air Conditioning', 'Free Parking', 'Kitchen', 'Elevator', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.75,
    totalReviews: 19,
  },

  // =========================================================================
  // 2. VIJAYAWADA
  // =========================================================================
  {
    title: 'Novotel Gateway Grand Luxury Hotel',
    description: '5-star premium hospitality experience in central Vijayawada with skyline views of the Krishna river, executive lounge, infinity rooftop pool, and multi-cuisine restaurants.',
    propertyType: 'Hotel',
    price: 3750,
    location: 'Benz Circle',
    address: 'MG Road, Landmark Tower, Benz Circle',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.498, longitude: 80.658 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1750,
    amenities: ['Swimming Pool', 'Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', '24/7 Security', 'Elevator', 'Gym'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.9,
    totalReviews: 53,
  },
  {
    title: 'Bhavani Island River Resort & Water Park',
    description: 'Magnificent island resort surrounded by Krishna river waters with adventure water sports, private treehouse villas, bonfire pits, and tranquil waterfront trails.',
    propertyType: 'Resort',
    price: 6500,
    location: 'Bhavani Island',
    address: 'River Krishna, Near Prakasam Barrage',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.518, longitude: 80.605 },
    bedrooms: 3,
    bathrooms: 3,
    area: 3100,
    amenities: ['Swimming Pool', 'Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Garden', 'Balcony', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.88,
    totalReviews: 31,
  },
  {
    title: 'Benz Circle Executive 2BHK Apartment',
    description: 'Centrally located luxury apartment in the bustling heart of Vijayawada near Benz Circle. Walk to top malls, gourmet restaurants, and hospitals.',
    propertyType: 'Apartment',
    price: 3199,
    location: 'Benz Circle',
    address: '40-1-12, Near Trendset Mall, Benz Circle',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.4971, longitude: 80.6558 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    amenities: ['Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Kitchen', 'Elevator'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.72,
    totalReviews: 16,
  },

  // =========================================================================
  // 3. HYDERABAD
  // =========================================================================
  {
    title: 'The Kohinoor Palace Luxury Heritage Hotel',
    description: 'World-class 5-star heritage boutique hotel in posh Banjara Hills. Royal chandeliers, private marble suites, gourmet Hyderabadi dining, spa, and valet parking.',
    propertyType: 'Hotel',
    price: 12000,
    location: 'Banjara Hills',
    address: 'Road No. 2, Landmark Heritage Boulevard, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    coordinates: { latitude: 17.4156, longitude: 78.435 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    amenities: ['Swimming Pool', 'Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Gym', '24/7 Security', 'Elevator'],
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.96,
    totalReviews: 64,
  },
  {
    title: 'Gandipet Lake Oasis Boutique Resort',
    description: 'Exclusive lakefront sanctuary with serene water views, infinity pool, open-air cabanas, manicured lawns, and private barbecues.',
    propertyType: 'Resort',
    price: 14000,
    location: 'Gandipet',
    address: 'Lakefront Drive, Osman Sagar Shore, Gandipet',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    coordinates: { latitude: 17.385, longitude: 78.295 },
    bedrooms: 4,
    bathrooms: 4,
    area: 4200,
    amenities: ['Swimming Pool', 'Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Garden', 'Balcony', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.93,
    totalReviews: 38,
  },
  {
    title: 'Hitec City Smart High-Rise Apartment',
    description: 'Modern 3BHK flat in Cyber Towers corridor with smart automated lighting, high-speed fiber internet, clubhouse gym, and supermarket within the society.',
    propertyType: 'Apartment',
    price: 3999,
    location: 'Madhapur / Hitec City',
    address: 'Flat 1204, Cyber Heights Tower B, Madhapur',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    coordinates: { latitude: 17.4483, longitude: 78.3742 },
    bedrooms: 3,
    bathrooms: 3,
    area: 1950,
    amenities: ['High-speed Wi-Fi', 'Air Conditioning', 'Free Parking', 'Swimming Pool', 'Gym', 'Elevator', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.8,
    totalReviews: 31,
  },

  // =========================================================================
  // 4. BANGALORE
  // =========================================================================
  {
    title: 'The Chancery Pavilion Grand Hotel',
    description: 'Sophisticated 5-star hotel in Bangalore city center. Luxurious suites, heated swimming pool, award-winning specialty restaurants, and business center.',
    propertyType: 'Hotel',
    price: 7200,
    location: 'Residency Road',
    address: '136, Residency Road, Shanthala Nagar',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    coordinates: { latitude: 12.9698, longitude: 77.5995 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1700,
    amenities: ['Swimming Pool', 'Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Gym', 'Elevator', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.92,
    totalReviews: 58,
  },
  {
    title: 'Nandi Hills Cloud Mist Eco Resort',
    description: 'Hillside retreat nestled at the base of Nandi Hills. Cool mountain breeze, sunrise viewpoints, hiking trails, outdoor amphitheater, and private barbecue gardens.',
    propertyType: 'Resort',
    price: 13500,
    location: 'Nandi Hills',
    address: 'Foothills Estate, Nandi Hills Main Highway',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    coordinates: { latitude: 13.3702, longitude: 77.6835 },
    bedrooms: 3,
    bathrooms: 3,
    area: 3500,
    amenities: ['Swimming Pool', 'Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Garden', 'Balcony', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.95,
    totalReviews: 47,
  },
  {
    title: 'Indiranagar Boutique Designer Homestay',
    description: 'Artfully curated townhouse homestay surrounded by cafes, craft breweries, and boutique shopping on 100ft Road Indiranagar. Serene rooftop patio included.',
    propertyType: 'Homestay',
    price: 3899,
    location: 'Indiranagar',
    address: '12th Main Road, HAL 2nd Stage, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    coordinates: { latitude: 12.9784, longitude: 77.6408 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1600,
    amenities: ['Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Kitchen', 'Balcony', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.89,
    totalReviews: 33,
  },

  // =========================================================================
  // 5. CHENNAI
  // =========================================================================
  {
    title: 'Taj Coromandel Luxury Grand Hotel',
    description: 'Timeless luxury hotel located in central Nungambakkam. Grand ballroom, award-winning South Indian fine dining, Ayurvedic spa, and serene pool patio.',
    propertyType: 'Hotel',
    price: 12500,
    location: 'Nungambakkam',
    address: '37, Mahatma Gandhi Road, Nungambakkam',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    coordinates: { latitude: 13.0569, longitude: 80.2425 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1750,
    amenities: ['Swimming Pool', 'Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Gym', '24/7 Security', 'Elevator'],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.93,
    totalReviews: 51,
  },
  {
    title: 'ECR Ocean Waves Beach Resort & Spa',
    description: 'Idyllic oceanfront beach resort along the East Coast Road. Private sun loungers on the beach, multi-cuisine seafood shack, beachfront lawns, and swimming pool.',
    propertyType: 'Resort',
    price: 9800,
    location: 'East Coast Road (ECR)',
    address: 'Mahabalipuram Highway, ECR Beach Corridor',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    coordinates: { latitude: 12.834, longitude: 80.244 },
    bedrooms: 3,
    bathrooms: 3,
    area: 3000,
    amenities: ['Swimming Pool', 'Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Garden', 'Balcony', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.88,
    totalReviews: 35,
  },
  {
    title: 'Mylapore Heritage Traditional Homestay',
    description: 'Charming traditional Tamil home with brass accents, courtyard swing, authentic vegetarian home-cooked breakfast, and steps away from Kapaleeshwarar temple.',
    propertyType: 'Homestay',
    price: 2199,
    location: 'Mylapore',
    address: 'North Mada Street, Near Kapaleeshwarar Temple, Mylapore',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    coordinates: { latitude: 13.0337, longitude: 80.2676 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    amenities: ['Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Kitchen', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.86,
    totalReviews: 24,
  },

  // =========================================================================
  // 6. VISAKHAPATNAM (VIZAG)
  // =========================================================================
  {
    title: 'The Gateway Beachfront Grand Hotel',
    description: 'Scenic 5-star hotel perched along RK Beach with uninterrupted Bay of Bengal sea views, infinity swimming pool, seafood restaurants, and fitness spa.',
    propertyType: 'Hotel',
    price: 4699,
    location: 'RK Beach',
    address: 'Beach Road, Maharanipeta, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 17.712, longitude: 83.318 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1650,
    amenities: ['Swimming Pool', 'Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Gym', 'Elevator', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.9,
    totalReviews: 39,
  },
  {
    title: 'Rushikonda Beach View Coastal Villa',
    description: 'Modern luxury 3BHK hill-view villa overlooking Rushikonda Beach. Private sun deck, infinity jacuzzi, floor-to-ceiling glass balconies, and barbecue garden.',
    propertyType: 'Villa',
    price: 7800,
    location: 'Rushikonda',
    address: 'Plot 7, Hill Top Enclave, Rushikonda',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 17.7816, longitude: 83.3855 },
    bedrooms: 3,
    bathrooms: 3,
    area: 2900,
    amenities: ['Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Kitchen', 'Balcony', 'Garden', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.88,
    totalReviews: 28,
  },

  // =========================================================================
  // 7. TIRUPATI
  // =========================================================================
  {
    title: 'Marasa Sarovar Premiere Pilgrim Luxury Hotel',
    description: 'Premier 5-star hotel near the holy Tirumala foothills designed around the 10 avatars of Vishnu. Features luxury suites, spiritual architecture, temple concierge, and vegetarian dining.',
    propertyType: 'Hotel',
    price: 2999,
    location: 'Karakambadi Road',
    address: 'Karakambadi Road, Near Alipiri Gate, Tirupati',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 13.635, longitude: 79.44 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1550,
    amenities: ['Swimming Pool', 'Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', '24/7 Security', 'Elevator', 'Gym'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.91,
    totalReviews: 49,
  },
  {
    title: 'Saptagiri Foothills Serene Homestay',
    description: 'Peaceful pilgrim homestay at Alipiri foothills. Quiet atmosphere, pristine clean rooms, mountain views, and direct shuttle assistance for Tirumala darshan.',
    propertyType: 'Homestay',
    price: 1599,
    location: 'Alipiri',
    address: 'Plot 22, Srinivasa Nagar, Alipiri Bypass Road',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 13.65, longitude: 79.41 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1300,
    amenities: ['Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Kitchen', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.87,
    totalReviews: 32,
  },

  // =========================================================================
  // 8. GOA
  // =========================================================================
  {
    title: 'Taj Exotica Oceanfront Luxury Resort',
    description: 'Magnificent Mediterranean-style 5-star beachfront resort in South Goa. Direct access to golden sands, private beach villas, sea-facing pools, and water sports.',
    propertyType: 'Resort',
    price: 17500,
    location: 'Benaulim',
    address: 'Calvaddo, Benaulim Beach Road, South Goa',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    coordinates: { latitude: 15.2585, longitude: 73.924 },
    bedrooms: 3,
    bathrooms: 3,
    area: 3400,
    amenities: ['Swimming Pool', 'Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Garden', 'Balcony', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.98,
    totalReviews: 72,
  },
  {
    title: 'Fontainhas Heritage Portuguese Boutique Hotel',
    description: 'Romantic heritage hotel in the Latin Quarter of Panaji with colorful colonial architecture, antique furniture, Portuguese azulejo tiles, and gourmet cafe.',
    propertyType: 'Hotel',
    price: 4450,
    location: 'Panaji',
    address: '31st January Road, Fontainhas, Panaji',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    coordinates: { latitude: 15.4989, longitude: 73.8278 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    amenities: ['Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Balcony', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.91,
    totalReviews: 44,
  },
  {
    title: 'Calangute Beachfront Portuguese Villa',
    description: 'Charming 3BHK restored Portuguese villa with a private swimming pool, coconut grove gardens, outdoor gazebo, and walking access to Calangute Beach.',
    propertyType: 'Villa',
    price: 10500,
    location: 'Calangute',
    address: 'Villa 14, Holiday Street, Calangute',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    coordinates: { latitude: 15.5439, longitude: 73.7553 },
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    amenities: ['Swimming Pool', 'Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Kitchen', 'Garden', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.93,
    totalReviews: 45,
  },

  // =========================================================================
  // 9. MUMBAI
  // =========================================================================
  {
    title: 'The Taj Mahal Palace Sea View Grand Hotel',
    description: 'Iconic heritage 5-star hotel facing the Gateway of India and the Arabian Sea. Royal butler service, legendary sea-view suites, luxury spa, and high tea salon.',
    propertyType: 'Hotel',
    price: 18500,
    location: 'Colaba',
    address: 'Apollo Bunder, Colaba, South Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    coordinates: { latitude: 18.9217, longitude: 72.8332 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1900,
    amenities: ['Swimming Pool', 'Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Gym', '24/7 Security', 'Elevator'],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.99,
    totalReviews: 95,
  },
  {
    title: 'Marine Drive Sea-Facing Grand Apartment',
    description: 'Iconic Queen’s Necklace sea-facing luxury 3BHK apartment on Marine Drive. Unobstructed Arabian Sea sunsets, vintage teakwood interiors, and 24/7 concierge.',
    propertyType: 'Apartment',
    price: 17000,
    location: 'Marine Drive',
    address: 'Art Deco Mansion, Marine Drive, Nariman Point',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    coordinates: { latitude: 18.9438, longitude: 72.8232 },
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    amenities: ['Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Kitchen', 'Elevator', '24/7 Security', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.96,
    totalReviews: 48,
  },
  {
    title: 'Bandra West Bohemian Studio',
    description: 'Trendy loft studio nestled in Pali Hill Bandra West. Walk to celebrity cafes, boutique bars, and Bandstand promenade.',
    propertyType: 'Studio',
    price: 3499,
    location: 'Bandra West',
    address: 'Pali Mala Road, Near Candies, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    coordinates: { latitude: 19.0596, longitude: 72.8295 },
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    amenities: ['Air Conditioning', 'High-speed Wi-Fi', 'Kitchen', 'Elevator'],
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.82,
    totalReviews: 32,
  },

  // =========================================================================
  // 10. DELHI
  // =========================================================================
  {
    title: 'The Imperial Heritage Grand Hotel',
    description: 'Legendary 5-star colonial heritage hotel on Janpath. Victorian architecture, royal suites, award-winning pan-Asian restaurants, spa, and verdant lawns.',
    propertyType: 'Hotel',
    price: 14800,
    location: 'Connaught Place / Janpath',
    address: 'Janpath Lane, Connaught Place',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { latitude: 28.6235, longitude: 77.2185 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1850,
    amenities: ['Swimming Pool', 'Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Gym', 'Elevator', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.95,
    totalReviews: 61,
  },
  {
    title: 'Hauz Khas Village Lakeview Penthouse',
    description: 'Designer 3BHK penthouse overlooking the medieval Hauz Khas monument and deer park lake. Bohemian rooftop terrace, wood finishes, and art gallery ambiance.',
    propertyType: 'Apartment',
    price: 9500,
    location: 'Hauz Khas',
    address: 'Building 24, Hauz Khas Village',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { latitude: 28.5535, longitude: 77.1944 },
    bedrooms: 3,
    bathrooms: 3,
    area: 2300,
    amenities: ['Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Kitchen', 'Balcony', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.96,
    totalReviews: 39,
  },

  // =========================================================================
  // 11. JAIPUR
  // =========================================================================
  {
    title: 'Rambagh Palace Heritage Grand Hotel',
    description: 'The Jewel of Jaipur — former residence of the Maharaja. Opulent royal marble suites, peacocks roaming manicured Mughal gardens, royal dining, and polo lounge.',
    propertyType: 'Hotel',
    price: 16500,
    location: 'Bhawani Singh Road',
    address: 'Bhawani Singh Road, Near Rambagh Circle, Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    coordinates: { latitude: 26.897, longitude: 75.808 },
    bedrooms: 2,
    bathrooms: 2,
    area: 2100,
    amenities: ['Swimming Pool', 'Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Gym', 'Garden', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.97,
    totalReviews: 76,
  },
  {
    title: 'Heritage Haveli Courtyard Royal Villa',
    description: 'Authentic Rajasthani heritage palace-style villa with sandstone jharokhas, central fountain courtyard, handcrafted wooden furniture, and tranquil garden.',
    propertyType: 'Villa',
    price: 8200,
    location: 'Civil Lines',
    address: 'Haveli 12, Jacob Road, Civil Lines',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    coordinates: { latitude: 26.9056, longitude: 75.7873 },
    bedrooms: 3,
    bathrooms: 3,
    area: 2900,
    amenities: ['Free Parking', 'Air Conditioning', 'High-speed Wi-Fi', 'Kitchen', 'Garden', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.91,
    totalReviews: 37,
  },

  // =========================================================================
  // 12. KOCHI (COCHIN)
  // =========================================================================
  {
    title: 'Brunton Boatyard Colonial Harbor Hotel',
    description: 'Historical Dutch & Portuguese styled luxury harbor hotel overlooking the Cochin shipping channel. Private sea-facing balconies, seafood dining, and sunset boat cruises.',
    propertyType: 'Hotel',
    price: 8500,
    location: 'Fort Kochi',
    address: '1/498, Calvathy Road, Fort Kochi',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    coordinates: { latitude: 9.967, longitude: 76.242 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1600,
    amenities: ['Swimming Pool', 'Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Balcony', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.92,
    totalReviews: 43,
  },
  {
    title: 'Kumarakom Backwaters Eco Lagoon Resort',
    description: 'Paradise backwater resort with traditional Kerala thatched-roof villas, private plunge pools, houseboats, Ayurvedic rejuvenation therapies, and lotus ponds.',
    propertyType: 'Resort',
    price: 15200,
    location: 'Kumarakom Backwaters',
    address: 'Vembanad Lake Shore, Kumarakom',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    coordinates: { latitude: 9.617, longitude: 76.43 },
    bedrooms: 3,
    bathrooms: 3,
    area: 3600,
    amenities: ['Swimming Pool', 'Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Garden', 'Balcony', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.96,
    totalReviews: 57,
  },

  // =========================================================================
  // 13. OOTY
  // =========================================================================
  {
    title: 'Savoy Heritage Mountain Luxury Resort',
    description: 'British colonial-era heritage resort surrounded by mist-covered Nilgiri tea estates. Fireplace suites, private English gardens, afternoon high tea, and horse riding.',
    propertyType: 'Resort',
    price: 8900,
    location: 'Elk Hill',
    address: '77, Sylks Road, Elk Hill, Ooty',
    city: 'Ooty',
    state: 'Tamil Nadu',
    country: 'India',
    coordinates: { latitude: 11.4064, longitude: 76.6932 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1900,
    amenities: ['Free Parking', 'High-speed Wi-Fi', 'Garden', 'Balcony', '24/7 Security', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.93,
    totalReviews: 48,
  },
  {
    title: 'Nilgiri Mountain Mist Cottage Homestay',
    description: 'Picturesque pine wood cottage perched over tea garden slopes with misty mountain panoramas, wood-burning hearth, hot water, and delicious local Badaga cuisine.',
    propertyType: 'Homestay',
    price: 2399,
    location: 'Lovedale',
    address: 'Tea Estate Lane, Lovedale Hill, Ooty',
    city: 'Ooty',
    state: 'Tamil Nadu',
    country: 'India',
    coordinates: { latitude: 11.385, longitude: 76.71 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1450,
    amenities: ['Free Parking', 'High-speed Wi-Fi', 'Kitchen', 'Garden', 'Balcony', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.89,
    totalReviews: 36,
  },

  // =========================================================================
  // 14. MANALI
  // =========================================================================
  {
    title: 'Solang Valley Snow Peak Luxury Resort',
    description: 'Alpine wonderland resort offering breathtaking panoramic views of snow-capped Himalayan peaks. Heated wooden chalets, cedar forests, adventure ski access, and bonfire nights.',
    propertyType: 'Resort',
    price: 11500,
    location: 'Solang Valley',
    address: 'Solang Valley Highway, Manali',
    city: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    coordinates: { latitude: 32.316, longitude: 77.157 },
    bedrooms: 3,
    bathrooms: 3,
    area: 3100,
    amenities: ['Free Parking', 'High-speed Wi-Fi', 'Garden', 'Balcony', '24/7 Security', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.96,
    totalReviews: 54,
  },
  {
    title: 'Apple Orchard Himalayan Wooden Chalet',
    description: 'Charming traditional deodar wood homestay surrounded by blooming apple orchards with Beas river rushing nearby. Warm cozy duvets and authentic Himachali meals.',
    propertyType: 'Homestay',
    price: 2699,
    location: 'Old Manali',
    address: 'Club House Road, Old Manali Village',
    city: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    coordinates: { latitude: 32.253, longitude: 77.18 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    amenities: ['Free Parking', 'High-speed Wi-Fi', 'Kitchen', 'Garden', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.9,
    totalReviews: 41,
  },

  // =========================================================================
  // 15. PONDICHERRY (PUDUCHERRY)
  // =========================================================================
  {
    title: 'Promenade Beachfront French Heritage Hotel',
    description: 'Chic French colonial boutique hotel facing the Bay of Bengal on Goubert Avenue. Sea-facing balconies, rooftop Mediterranean restaurant, and heritage courtyards.',
    propertyType: 'Hotel',
    price: 4200,
    location: 'White Town',
    address: '23, Goubert Avenue, Promenade Beach, White Town',
    city: 'Pondicherry',
    state: 'Puducherry',
    country: 'India',
    coordinates: { latitude: 11.9325, longitude: 79.8358 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1600,
    amenities: ['Swimming Pool', 'Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Balcony', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.91,
    totalReviews: 46,
  },
  {
    title: 'Auroville Eco Garden Retreat Villa',
    description: 'Tranquil eco-luxury villa nestled in the lush forests near Auroville. Solar powered, open-air stone rain showers, organic herb gardens, and meditation pavilions.',
    propertyType: 'Villa',
    price: 4950,
    location: 'Auroville',
    address: 'Aspiration Forest Road, Near Matrimandir, Auroville',
    city: 'Pondicherry',
    state: 'Tamil Nadu',
    country: 'India',
    coordinates: { latitude: 12.007, longitude: 79.81 },
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    amenities: ['Swimming Pool', 'Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Garden', 'Balcony', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.88,
    totalReviews: 29,
  }
];

const demoReviewerUsers = [
  { name: 'Ananya R.', email: 'ananya.r@havenstay-demo.com' },
  { name: 'Rahul K.', email: 'rahul.k@havenstay-demo.com' },
  { name: 'Priya S.', email: 'priya.s@havenstay-demo.com' },
  { name: 'Arjun M.', email: 'arjun.m@havenstay-demo.com' },
  { name: 'Sneha P.', email: 'sneha.p@havenstay-demo.com' },
  { name: 'Kiran V.', email: 'kiran.v@havenstay-demo.com' },
  { name: 'Meera R.', email: 'meera.r@havenstay-demo.com' },
  { name: 'Aditya N.', email: 'aditya.n@havenstay-demo.com' },
  { name: 'Rohan S.', email: 'rohan.s@havenstay-demo.com' },
  { name: 'Divya M.', email: 'divya.m@havenstay-demo.com' },
  { name: 'Vikram T.', email: 'vikram.t@havenstay-demo.com' },
  { name: 'Pooja B.', email: 'pooja.b@havenstay-demo.com' },
  { name: 'Siddharth G.', email: 'siddharth.g@havenstay-demo.com' },
  { name: 'Neha D.', email: 'neha.d@havenstay-demo.com' },
  { name: 'Varun C.', email: 'varun.c@havenstay-demo.com' },
  { name: 'Tanvi K.', email: 'tanvi.k@havenstay-demo.com' },
  { name: 'Nikhil J.', email: 'nikhil.j@havenstay-demo.com' },
  { name: 'Aarav P.', email: 'aarav.p@havenstay-demo.com' },
  { name: 'Ishita V.', email: 'ishita.v@havenstay-demo.com' },
  { name: 'Manish S.', email: 'manish.s@havenstay-demo.com' },
  { name: 'Kavya N.', email: 'kavya.n@havenstay-demo.com' },
  { name: 'Gaurav L.', email: 'gaurav.l@havenstay-demo.com' },
  { name: 'Shreya M.', email: 'shreya.m@havenstay-demo.com' },
  { name: 'Harish B.', email: 'harish.b@havenstay-demo.com' },
  { name: 'Deepa K.', email: 'deepa.k@havenstay-demo.com' },
  { name: 'Ritu G.', email: 'ritu.g@havenstay-demo.com' },
  { name: 'Tarun V.', email: 'tarun.v@havenstay-demo.com' },
  { name: 'Swati R.', email: 'swati.r@havenstay-demo.com' },
  { name: 'Amit S.', email: 'amit.s@havenstay-demo.com' },
  { name: 'Zoya K.', email: 'zoya.k@havenstay-demo.com' },
];

// Curated review banks with realistic positive (~80%), mixed (~12%), and constructive negative (~8%) reviews
const reviewBanks = {
  Luxury: [
    { rating: 5, comment: 'An extraordinary luxury experience! The heritage grandeur, immaculate suites, and royal dining were unforgettable.' },
    { rating: 5, comment: 'World-class hospitality at its finest. The personalized butler service and palace gardens made our trip extraordinary.' },
    { rating: 5, comment: 'Breathtaking architecture and pristine views. Every single detail exceeded 5-star luxury standards.' },
    { rating: 5, comment: 'Truly exceptional stay. The opulent suite, spa wellness treatments, and exquisite culinary offerings were 10 out of 10.' },
    { rating: 5, comment: 'Iconic property with unmatched elegance. Check-in was effortless and the staff treated us like royalty.' },
    { rating: 4, comment: 'Remarkable luxury stay and gorgeous ambiance. Evening dining in the courtyard was lively and memorable.' },
    { rating: 5, comment: 'Flawless sanctuary in every sense. The bed comfort, historic interior decor, and serene pool made this an elite getaway.' },
    { rating: 4, comment: 'Grand architecture and attentive staff. A truly memorable premium experience for our family vacation.' },
  ],
  Hotel: [
    { rating: 5, comment: 'Very clean room and excellent location. The staff were friendly and check-in was smooth.' },
    { rating: 5, comment: 'Really comfortable stay. The room was spacious and the property looked exactly like the photos.' },
    { rating: 5, comment: 'Superb location right in the city center. Quiet at night with attentive host support throughout our stay.' },
    { rating: 5, comment: 'The room was spotless and well air-conditioned. Loved the morning breakfast spread and quick room service.' },
    { rating: 5, comment: 'Exceeded our expectations for a short stay. Smooth key handover and high-speed Wi-Fi worked flawlessly.' },
    { rating: 4, comment: 'Great experience for a short weekend stay. Everything was clean and well maintained.' },
    { rating: 4, comment: 'Good value for the price. The staff were helpful and the location was convenient for meetings.' },
    { rating: 4, comment: 'Comfortable beds and clean room. Front desk staff were accommodating with our late checkout request.' },
    { rating: 4, comment: 'Pleasant experience overall. Clean bathroom, fresh towels, and quiet surroundings.' },
    { rating: 3, comment: 'Overall a good stay. The room was clean and comfortable, although the check-in process took a little longer than expected.' },
    { rating: 3, comment: 'Nice property and good location. The room was slightly smaller than expected, but everything else was good.' },
    { rating: 4, comment: 'Good experience overall, but the Wi-Fi was slow during the evening peak hours.' },
    { rating: 3, comment: 'The room was clean, but the street noise from outside was noticeable at night.' },
    { rating: 2, comment: 'Good location, but the room could have been better maintained during our two-day stay.' },
  ],
  Resort: [
    { rating: 5, comment: 'Beautiful property with a peaceful atmosphere. Would definitely stay here again with family.' },
    { rating: 5, comment: 'A truly luxurious retreat. The ambiance, interior decor, and serene landscaping were 10 out of 10.' },
    { rating: 5, comment: 'Unmatched serenity and stunning views. The staff was exceptionally responsive and caring.' },
    { rating: 5, comment: 'Exquisite hospitality and world-class architecture. The infinity pool and spa were spectacular.' },
    { rating: 5, comment: 'Stunning grounds with lush nature. The private balcony gave panoramic sunrise views every morning.' },
    { rating: 4, comment: 'Very relaxing vacation stay. The surroundings are gorgeous and rooms were spotless.' },
    { rating: 4, comment: 'High-quality amenities and beautiful gardens. Great value for a refreshing weekend getaway.' },
    { rating: 4, comment: 'Peaceful and picturesque setting. Room service was prompt and the food was delicious.' },
    { rating: 3, comment: 'Beautiful resort and lovely grounds. A bit far from main city dining spots, but very tranquil.' },
    { rating: 3, comment: 'Lovely surroundings, though the approach road had minor potholes and check-in was slightly delayed.' },
  ],
  Villa: [
    { rating: 5, comment: 'Magnificent villa with top-class amenities. The private pool and garden were impeccably maintained.' },
    { rating: 5, comment: 'Wonderful getaway with family. Ample space, great kitchen amenities, and serene outdoor seating.' },
    { rating: 5, comment: 'Top-tier luxury villa experience. Clean linens, modern bathrooms, and complete privacy.' },
    { rating: 5, comment: 'Everything was seamless from booking to checkout. The caretaker was courteous and helpful.' },
    { rating: 4, comment: 'Spacious and beautifully decorated villa. Perfect for a relaxing weekend trip with friends.' },
    { rating: 4, comment: 'Great property with plenty of natural light and modern comforts. We thoroughly enjoyed our stay.' },
    { rating: 3, comment: 'Spacious and well-kept villa, though the cellular network was slightly weak in certain back rooms.' },
    { rating: 3, comment: 'Great location and nice interiors. Water pressure in the upper floor shower could be slightly stronger.' },
  ],
  Homestays: [
    { rating: 5, comment: 'Felt right at home! The host\'s hospitality was heartwarming and the room was sparkling clean.' },
    { rating: 5, comment: 'Convenient location close to local transit and cafes. High-speed Wi-Fi made remote work effortless.' },
    { rating: 5, comment: 'Cozy, charming, and peaceful. The kitchen was well equipped for making quick breakfasts.' },
    { rating: 5, comment: 'Smooth self check-in, spotless bathroom, and comfortable mattress. Great value for money.' },
    { rating: 4, comment: 'Warm hosts and comfortable room. Nice quiet residential neighborhood with shops nearby.' },
    { rating: 4, comment: 'Quiet residential area with easy access to city attractions. Exactly as described in the listing.' },
    { rating: 3, comment: 'Pleasant stay overall. Clean apartment, though street noise was slight during early morning rush hour.' },
    { rating: 3, comment: 'Nice homestay with welcoming hosts. The stairs are slightly steep if carrying heavy luggage.' },
    { rating: 2, comment: 'Decent stay for a budget trip, but bathroom ventilation could use an upgrade.' },
  ],
};

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      dbName: 'property_marketplace',
    });
    console.log('Connected to MongoDB Atlas.');

    // 1. Find or create host user to attach as property owner
    let hostUser = await User.findOne({ email: 'mandalapulilly@gmail.com' });
    if (!hostUser) {
      hostUser = await User.findOne({ role: { $in: ['host', 'admin', 'user'] } });
    }
    if (!hostUser) {
      hostUser = await User.create({
        name: 'Mandalapu Lilly',
        email: 'mandalapulilly@gmail.com',
        password: 'password123',
        role: 'host',
      });
    }

    console.log(`Attaching owner: ${hostUser._id} (${hostUser.name} - ${hostUser.email})`);

    // 2. Find or create pool of demo reviewers
    console.log('Preparing demo reviewer accounts...');
    const reviewerDocs = [];
    for (const revUser of demoReviewerUsers) {
      let existing = await User.findOne({ email: revUser.email });
      if (!existing) {
        existing = await User.create({
          name: revUser.name,
          email: revUser.email,
          password: 'password123',
          role: 'user',
        });
      }
      reviewerDocs.push(existing);
    }
    console.log(`Ready with ${reviewerDocs.length} verified reviewer profiles.`);

    // 3. Clear existing properties and reviews
    await Review.deleteMany({});
    console.log('Cleared previous reviews.');

    await Property.deleteMany({});
    console.log('Cleared previous properties.');

    // 4. Insert all fresh properties
    const enriched = allCityProperties.map((p) => ({
      ...p,
      owner: hostUser._id,
      averageRating: 0,
      totalReviews: 0,
    }));

    const insertedProperties = await Property.insertMany(enriched);
    console.log(`✅ Seeded ${insertedProperties.length} property listings.`);

    // 5. Generate and seed authentic reviews for each property
    console.log('Seeding realistic guest reviews...');
    const allReviewsToInsert = [];

    insertedProperties.forEach((prop, propIndex) => {
      // Determine if luxury or specific category
      const isLuxury =
        Number(prop.price) >= 6500 ||
        prop.title.includes('Palace') ||
        prop.title.includes('Taj') ||
        prop.title.includes('Imperial') ||
        prop.title.includes('Kohinoor');

      const poolKey = isLuxury
        ? 'Luxury'
        : prop.propertyType === 'Hotel'
        ? 'Hotel'
        : prop.propertyType === 'Resort'
        ? 'Resort'
        : prop.propertyType === 'Villa'
        ? 'Villa'
        : 'Homestays';
      const pool = reviewBanks[poolKey];

      // Number of reviews to generate (varied between 4 and 9 reviews per property)
      const numReviews = isLuxury ? 6 + (propIndex % 4) : 4 + ((propIndex * 3 + 1) % 5);

      // Pick distinct reviewers for this property
      const startIndex = (propIndex * 3) % reviewerDocs.length;
      const selectedReviewers = [];
      for (let i = 0; i < numReviews; i++) {
        const idx = (startIndex + i) % reviewerDocs.length;
        selectedReviewers.push(reviewerDocs[idx]);
      }

      // Generate review objects
      selectedReviewers.forEach((reviewer, rIndex) => {
        // Pick template from pool
        const templateIdx = (propIndex * 2 + rIndex) % pool.length;
        const item = pool[templateIdx];

        // Varied date within last 120 days
        const daysAgo = 2 + ((propIndex * 7 + rIndex * 13) % 118);
        const reviewDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        allReviewsToInsert.push({
          property: prop._id,
          user: reviewer._id,
          rating: item.rating,
          comment: item.comment,
          createdAt: reviewDate,
          updatedAt: reviewDate,
        });
      });
    });

    const insertedReviews = await Review.insertMany(allReviewsToInsert);
    console.log(`✅ Successfully seeded ${insertedReviews.length} authentic guest reviews across all listings!`);

    // 6. Recalculate and update exact averageRating & totalReviews for every property
    for (const prop of insertedProperties) {
      const stats = await Review.aggregate([
        { $match: { property: prop._id } },
        {
          $group: {
            _id: '$property',
            avgRating: { $avg: '$rating' },
            numReviews: { $sum: 1 },
          },
        },
      ]);

      if (stats.length > 0) {
        await Property.findByIdAndUpdate(prop._id, {
          averageRating: Math.round(stats[0].avgRating * 10) / 10,
          totalReviews: stats[0].numReviews,
        });
      }
    }

    console.log('✅ Synchronized all property rating averages and review counts in MongoDB Atlas!');

    await mongoose.disconnect();
    console.log('Disconnected cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedData();
