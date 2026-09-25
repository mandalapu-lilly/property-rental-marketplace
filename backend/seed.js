import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Property from './models/Property.js';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://mandalapulilly_db_user:31UTfHycs5edAckm@cluster0.oqala68.mongodb.net/property_marketplace?retryWrites=true&w=majority';

const moreProperties = [
  // -------------------------------------------------------------
  // GUNTUR (Hotels, Resorts, Homestays, Villas, Apartments, Studios)
  // -------------------------------------------------------------
  {
    title: 'Grand Minerva Luxury Hotel & Executive Suites',
    description: 'Premier 4-star luxury hotel in prime Lakshmipuram. Features plush executive suites, 24/7 room service, multi-cuisine dining, rooftop infinity pool, and airport concierge.',
    propertyType: 'Hotel',
    price: 24000,
    location: 'Lakshmipuram',
    address: '14-2-88, Lakshmipuram Main Road, Near Collector Office',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.3082, longitude: 80.4382 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1600,
    amenities: ['Swimming Pool', 'Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', '24/7 Security', 'Elevator', 'Balcony'],
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
    price: 19500,
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
    price: 36000,
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
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.92,
    totalReviews: 36,
  },
  {
    title: 'Palm Breeze Traditional Homestay',
    description: 'Serene South Indian traditional homestay featuring warm hospitality, home-cooked regional cuisine, shaded courtyard with mango trees, and quiet residential neighborhood.',
    propertyType: 'Homestay',
    price: 14500,
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
    title: 'Heritage Pepper City Guest House',
    description: 'Cozy and budget-friendly guest house catering to families and travelers with well-appointed air-conditioned rooms, clean amenities, and immediate access to transit hubs.',
    propertyType: 'Guest House',
    price: 11000,
    location: 'Old Guntur',
    address: '6-12-9, Station Road, Near Railway Terminal',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.311, longitude: 80.448 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    amenities: ['Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.6,
    totalReviews: 15,
  },
  {
    title: 'Emerald Palms Luxury Villa',
    description: 'Spectacular 4BHK private luxury villa with a private swimming pool, landscaped lawn, modern modular kitchen, and serene views. Ideal for family vacations and weekend getaways in Guntur.',
    propertyType: 'Villa',
    price: 32000,
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
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.9,
    totalReviews: 24,
  },
  {
    title: 'Krishna Valley Royal Villa',
    description: 'Opulent multi-level private villa with panoramic green views, Italian marble flooring, rooftop terrace garden, and private parking. Premium stay located close to the city center.',
    propertyType: 'Villa',
    price: 28500,
    location: 'Amaravathi Road',
    address: '8-14-32, Amaravathi Road, Near Nagarjuna University',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.3312, longitude: 80.4589 },
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    amenities: ['Free Parking', 'Air Conditioning', 'High-speed Wi-Fi', 'Balcony', 'Garden', 'Kitchen', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.8,
    totalReviews: 18,
  },
  {
    title: 'Brundavan Gardens Modern 2BHK Flat',
    description: 'Cozy and well-ventilated 2BHK residential flat in prime Brundavan Gardens. Fully equipped modular kitchen, 24/7 water supply, power backup, and lift access.',
    propertyType: 'Apartment',
    price: 15000,
    location: 'Brundavan Gardens',
    address: 'Flat 302, Sri Sai Towers, 4th Line, Brundavan Gardens',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.3021, longitude: 80.4412 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1250,
    amenities: ['Elevator', '24/7 Security', 'Free Parking', 'Kitchen', 'Balcony', 'Air Conditioning'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.65,
    totalReviews: 14,
  },
  {
    title: 'Guntur Central Premium 2BHK Studio Apartment',
    description: 'Modern luxury 2BHK studio apartment near Pattabhipuram commercial zone. Fully air-conditioned, dedicated high-speed workstation, smart TV, and modular kitchen.',
    propertyType: 'Studio',
    price: 16000,
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
  {
    title: 'Guntur Tech Park Budget 1BHK Studio',
    description: 'Affordable, fully furnished single studio room for working professionals and students with high-speed Wi-Fi, air conditioning, study desk, and attached washroom.',
    propertyType: 'Studio',
    price: 9500,
    location: 'Pattabhipuram',
    address: '12-3-45, Pattabhipuram Main Road',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.3155, longitude: 80.4289 },
    bedrooms: 1,
    bathrooms: 1,
    area: 450,
    amenities: ['High-speed Wi-Fi', 'Air Conditioning', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.5,
    totalReviews: 9,
  },

  // -------------------------------------------------------------
  // VIJAYAWADA
  // -------------------------------------------------------------
  {
    title: 'Novotel Gateway Grand Luxury Hotel',
    description: '5-star premium hospitality experience in central Vijayawada with skyline views of the Krishna river, executive lounge, infinity rooftop pool, and multi-cuisine restaurants.',
    propertyType: 'Hotel',
    price: 28000,
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
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.9,
    totalReviews: 53,
  },
  {
    title: 'Bhavani Island River Resort & Water Park',
    description: 'Magnificent island resort surrounded by Krishna river waters with adventure water sports, private treehouse villas, bonfire pits, and tranquil waterfront trails.',
    propertyType: 'Resort',
    price: 38000,
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
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.88,
    totalReviews: 31,
  },
  {
    title: 'Prakasam Barrage View Luxury Penthouse',
    description: 'Ultra-luxurious riverfront 3BHK penthouse overlooking the scenic Krishna River. Floor-to-ceiling glass windows, ambient recessed lighting, modular kitchen, and private terrace.',
    propertyType: 'Apartment',
    price: 34000,
    location: 'Governorpet',
    address: 'Tower 9, Riverside Heights, MG Road',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.5062, longitude: 80.648 },
    bedrooms: 3,
    bathrooms: 3,
    area: 2400,
    amenities: ['High-speed Wi-Fi', 'Swimming Pool', 'Air Conditioning', 'Free Parking', 'Kitchen', 'Elevator', 'Balcony', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.88,
    totalReviews: 22,
  },
  {
    title: 'Benz Circle Executive 2BHK Apartment',
    description: 'Centrally located luxury apartment in the bustling heart of Vijayawada near Benz Circle. Walk to top malls, gourmet restaurants, and hospitals.',
    propertyType: 'Apartment',
    price: 21000,
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
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.72,
    totalReviews: 16,
  },

  // -------------------------------------------------------------
  // HYDERABAD
  // -------------------------------------------------------------
  {
    title: 'The Kohinoor Palace Luxury Heritage Hotel',
    description: 'World-class 5-star heritage boutique hotel in posh Banjara Hills. Royal chandeliers, private marble suites, gourmet Hyderabadi dining, spa, and valet parking.',
    propertyType: 'Hotel',
    price: 45000,
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
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
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
    price: 52000,
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
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.93,
    totalReviews: 38,
  },
  {
    title: 'Jubilee Hills Garden Villa Homestay',
    description: 'Charming private bungalow homestay in upscale Jubilee Hills. Green gardens, curated art, peaceful neighborhood, and personalized home cooked meals.',
    propertyType: 'Homestay',
    price: 29000,
    location: 'Jubilee Hills',
    address: 'Road No. 36, Near Peddamma Temple, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    coordinates: { latitude: 17.4319, longitude: 78.4073 },
    bedrooms: 3,
    bathrooms: 3,
    area: 2600,
    amenities: ['Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Kitchen', 'Garden', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.87,
    totalReviews: 29,
  },
  {
    title: 'Hitec City Smart High-Rise Apartment',
    description: 'Modern 3BHK flat in Cyber Towers corridor with smart automated lighting, high-speed fiber internet, clubhouse gym, and supermarket within the society.',
    propertyType: 'Apartment',
    price: 28000,
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
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.8,
    totalReviews: 31,
  },
  {
    title: 'Gachibowli Cyber Towers Luxury Studio',
    description: 'Fully furnished designer studio apartment ideal for tech professionals. Equipped with modular pantry, workstation, 50-inch smart TV, and rooftop lounge.',
    propertyType: 'Studio',
    price: 18000,
    location: 'Gachibowli',
    address: 'Suite 602, Silicon Heights, Financial District',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    coordinates: { latitude: 17.44, longitude: 78.3489 },
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    amenities: ['High-speed Wi-Fi', 'Air Conditioning', 'Free Parking', 'Kitchen', 'Gym', 'Elevator'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.75,
    totalReviews: 20,
  },

  // -------------------------------------------------------------
  // BANGALORE
  // -------------------------------------------------------------
  {
    title: 'The Chancery Pavilion Grand Hotel',
    description: 'Sophisticated 5-star hotel in Bangalore city center. Luxurious suites, heated swimming pool, award-winning specialty restaurants, and business center.',
    propertyType: 'Hotel',
    price: 42000,
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
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
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
    price: 48000,
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
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.95,
    totalReviews: 47,
  },
  {
    title: 'Indiranagar Boutique Designer Homestay',
    description: 'Artfully curated townhouse homestay surrounded by cafes, craft breweries, and boutique shopping on 100ft Road Indiranagar. Serene rooftop patio included.',
    propertyType: 'Homestay',
    price: 31000,
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
  {
    title: 'Koramangala Tech Executive Studio',
    description: 'Chic urban studio apartment in the startup capital Koramangala. High-speed 300 Mbps Wi-Fi, ergonomic work setup, smart kitchenette, and power backup.',
    propertyType: 'Studio',
    price: 22000,
    location: 'Koramangala',
    address: '4th Block, 80 Feet Road, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    coordinates: { latitude: 12.9352, longitude: 77.6245 },
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    amenities: ['High-speed Wi-Fi', 'Air Conditioning', 'Kitchen', 'Free Parking', 'Elevator', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.79,
    totalReviews: 26,
  },
  {
    title: 'Whitefield Palm Meadows Luxury Villa',
    description: 'Exquisite 4BHK gated community villa with private plunge pool, manicured gardens, Italian marble flooring, and clubhouse sports facilities.',
    propertyType: 'Villa',
    price: 65000,
    location: 'Whitefield',
    address: 'Palm Meadows Estate, Varthur Road, Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    coordinates: { latitude: 12.9698, longitude: 77.7499 },
    bedrooms: 4,
    bathrooms: 4,
    area: 3800,
    amenities: ['Swimming Pool', 'Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Kitchen', 'Garden', 'Gym', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.94,
    totalReviews: 40,
  },

  // -------------------------------------------------------------
  // GOA
  // -------------------------------------------------------------
  {
    title: 'Taj Exotica Oceanfront Luxury Resort',
    description: 'Magnificent Mediterranean-style 5-star beachfront resort in South Goa. Direct access to golden sands, private beach villas, sea-facing pools, and water sports.',
    propertyType: 'Resort',
    price: 68000,
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
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.98,
    totalReviews: 72,
  },
  {
    title: 'Fontainhas Heritage Portuguese Boutique Hotel',
    description: 'Romantic heritage hotel in the Latin Quarter of Panaji with colorful colonial architecture, antique furniture, Portuguese azulejo tiles, and gourmet cafe.',
    propertyType: 'Hotel',
    price: 32000,
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
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.91,
    totalReviews: 44,
  },
  {
    title: 'Candolim Sunset Palm Homestay',
    description: 'Charming Portuguese villa homestay 5 minutes walk from Candolim beach. Private garden with coconut palms, breezy patio, and bicycles for guests.',
    propertyType: 'Homestay',
    price: 24000,
    location: 'Candolim',
    address: 'House 42, Pintos Vaddo, Candolim Beach Road',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    coordinates: { latitude: 15.5175, longitude: 73.766 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1600,
    amenities: ['Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Kitchen', 'Garden', 'Balcony', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.86,
    totalReviews: 35,
  },
  {
    title: 'Calangute Beachfront Portuguese Villa',
    description: 'Charming 3BHK restored Portuguese villa with a private swimming pool, coconut grove gardens, outdoor gazebo, and walking access to Calangute Beach.',
    propertyType: 'Villa',
    price: 45000,
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
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.93,
    totalReviews: 45,
  },

  // -------------------------------------------------------------
  // VISAKHAPATNAM
  // -------------------------------------------------------------
  {
    title: 'The Gateway Beachfront Grand Hotel',
    description: 'Scenic 5-star hotel perched along RK Beach with uninterrupted Bay of Bengal sea views, infinity swimming pool, seafood restaurants, and fitness spa.',
    propertyType: 'Hotel',
    price: 32000,
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
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
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
    price: 38000,
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
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.88,
    totalReviews: 28,
  },

  // -------------------------------------------------------------
  // MUMBAI
  // -------------------------------------------------------------
  {
    title: 'Marine Drive Sea-Facing Grand Apartment',
    description: 'Iconic Queen’s Necklace sea-facing luxury 3BHK apartment on Marine Drive. Unobstructed Arabian Sea sunsets, vintage teakwood interiors, and 24/7 concierge.',
    propertyType: 'Apartment',
    price: 85000,
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
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.96,
    totalReviews: 48,
  },

  // -------------------------------------------------------------
  // JAIPUR
  // -------------------------------------------------------------
  {
    title: 'Heritage Haveli Courtyard Royal Villa',
    description: 'Authentic Rajasthani heritage palace-style villa with sandstone jharokhas, central fountain courtyard, handcrafted wooden furniture, and tranquil garden.',
    propertyType: 'Villa',
    price: 35000,
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
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.91,
    totalReviews: 37,
  }
];

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      dbName: 'property_marketplace',
    });
    console.log('Connected to MongoDB Atlas.');

    // 1. Find user to attach as owner
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

    console.log(`Setting owner ID: ${hostUser._id} (${hostUser.name} - ${hostUser.email})`);

    // 2. Clear existing properties to avoid duplicates, then insert full dataset
    await Property.deleteMany({});
    console.log('Cleared existing properties.');

    const enriched = moreProperties.map((p) => ({
      ...p,
      owner: hostUser._id,
    }));

    const inserted = await Property.insertMany(enriched);
    console.log(`✅ Successfully seeded ${inserted.length} rich property listings across India into MongoDB Atlas!`);

    await mongoose.disconnect();
    console.log('Disconnected cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedData();
