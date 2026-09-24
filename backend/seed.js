import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Property from './models/Property.js';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://mandalapulilly_db_user:31UTfHycs5edAckm@cluster0.oqala68.mongodb.net/property_marketplace?retryWrites=true&w=majority';

const moreProperties = [
  // Guntur
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
    title: 'Guntur Tech Park Budget Studio',
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

  // Vijayawada
  {
    title: 'Prakasam Barrage View Luxury Penthouse',
    description: 'Ultra-luxurious riverfront 3BHK penthouse overlooking the scenic Krishna River. Floor-to-ceiling glass windows, ambient recessed lighting, modular kitchen, and private terrace.',
    propertyType: 'Apartment',
    price: 34000,
    location: 'MG Road / Governorpet',
    address: 'Tower 9, Riverside Heights, MG Road',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 16.5062, longitude: 80.6480 },
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

  // Hyderabad
  {
    title: 'Banjara Hills Skyline Penthouse',
    description: 'Luxury high-rise penthouse overlooking Hyderabad skyline. Featuring smart home automation, floor-to-ceiling windows, private elevator access, and rooftop infinity jacuzzi.',
    propertyType: 'Apartment',
    price: 45000,
    location: 'Banjara Hills Road No. 12',
    address: 'Tower 4, The Royal Crest, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    coordinates: { latitude: 17.4156, longitude: 78.4354 },
    bedrooms: 3,
    bathrooms: 3,
    area: 2650,
    amenities: ['High-speed Wi-Fi', 'Swimming Pool', 'Air Conditioning', 'Gym', 'Free Parking', 'Kitchen', 'Balcony', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.95,
    totalReviews: 42,
  },
  {
    title: 'Cyber City Modern Studio Loft',
    description: 'Compact, ultra-modern designer studio walking distance from HITEC city metro. High-speed 300 Mbps fiber internet, ergonomic workstation, and Netflix-enabled 4K TV.',
    propertyType: 'Studio',
    price: 18500,
    location: 'Madhapur / Hitec City',
    address: '501, Silicon Heights, Phase 2, Madhapur',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    coordinates: { latitude: 17.4483, longitude: 78.3915 },
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    amenities: ['High-speed Wi-Fi', 'Air Conditioning', 'Kitchen', 'Elevator', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.75,
    totalReviews: 31,
  },
  {
    title: 'Jubilee Hills Grand Presidential Villa',
    description: 'Ultra-exclusive 5BHK private mansion nestled in Jubilee Hills. Features private home theater, temperature-controlled swimming pool, lush lawns, and private butler quarters.',
    propertyType: 'Villa',
    price: 95000,
    location: 'Jubilee Hills Road No. 36',
    address: 'Villa 108, Palm Meadows, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    coordinates: { latitude: 17.4319, longitude: 78.4073 },
    bedrooms: 5,
    bathrooms: 6,
    area: 5200,
    amenities: ['Swimming Pool', 'Air Conditioning', 'Free Parking', 'Gym', 'High-speed Wi-Fi', 'Kitchen', '24/7 Security', 'Balcony', 'Garden', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.98,
    totalReviews: 53,
  },
  {
    title: 'Gachibowli Financial District 2BHK Suite',
    description: 'High-rise apartment inside a gated community with club house, tennis courts, infinity pool, and dedicated parking space. 5 mins drive to Google and Microsoft campuses.',
    propertyType: 'Apartment',
    price: 29000,
    location: 'Gachibowli',
    address: 'Tower B, My Home Bhooja, Financial District',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    coordinates: { latitude: 17.4401, longitude: 78.3489 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1550,
    amenities: ['Swimming Pool', 'Gym', 'Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Kitchen', 'Elevator', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.81,
    totalReviews: 27,
  },

  // Bengaluru
  {
    title: 'Indiranagar Boutique Garden House',
    description: 'Charming 3-bedroom private house situated in leafy Indiranagar. Features private terrace, library nook, modular gas kitchen, and walking distance to 100ft road cafes.',
    propertyType: 'House',
    price: 36000,
    location: 'Indiranagar 100ft Road',
    address: '14, 12th Main, HAL 2nd Stage, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    coordinates: { latitude: 12.9784, longitude: 77.6408 },
    bedrooms: 3,
    bathrooms: 3,
    area: 2400,
    amenities: ['High-speed Wi-Fi', 'Free Parking', 'Air Conditioning', 'Kitchen', 'Balcony', 'Garden', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.88,
    totalReviews: 29,
  },
  {
    title: 'Koramangala Minimalist 1BHK Flat',
    description: 'Sleek, scandi-style designer apartment in Koramangala 4th Block. Quiet residential avenue surrounded by trees, craft breweries, and startup hubs.',
    propertyType: 'Apartment',
    price: 24000,
    location: 'Koramangala 4th Block',
    address: 'Plot 77, 80 Feet Road, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    coordinates: { latitude: 12.9352, longitude: 77.6245 },
    bedrooms: 1,
    bathrooms: 1,
    area: 850,
    amenities: ['High-speed Wi-Fi', 'Air Conditioning', 'Kitchen', 'Balcony', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.79,
    totalReviews: 35,
  },
  {
    title: 'Whitefield Prestige Golf Villa',
    description: 'Luxurious 4BHK duplex golf-course villa in Whitefield. Private swimming pool, manicured lawns, high ceilings, and EV car charging station.',
    propertyType: 'Villa',
    price: 65000,
    location: 'Whitefield Main Road',
    address: 'Villa 24, Prestige Golfshire Enclave, Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    coordinates: { latitude: 12.9698, longitude: 77.7499 },
    bedrooms: 4,
    bathrooms: 4,
    area: 3800,
    amenities: ['Swimming Pool', 'Gym', 'Free Parking', 'Air Conditioning', 'High-speed Wi-Fi', 'Kitchen', 'Garden', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.94,
    totalReviews: 48,
  },

  // Goa
  {
    title: 'Calangute Sunset Beach Villa',
    description: 'Direct beachfront Portuguese heritage villa in North Goa with private beach access, sundeck, tropical cocktail bar, and open-air shower.',
    propertyType: 'Villa',
    price: 38000,
    location: 'Calangute Beachfront',
    address: 'Villa 17, Beach Road, Calangute',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    coordinates: { latitude: 15.5439, longitude: 73.7553 },
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    amenities: ['Swimming Pool', 'Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Kitchen', 'Pet Friendly', 'Balcony', 'Garden'],
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.92,
    totalReviews: 56,
  },
  {
    title: 'Anjuna Palm Grove Studio Cottage',
    description: 'Idyllic rustic-chic studio cottage surrounded by coconut groves and tropical birds, 5 mins ride from Anjuna flea market and beach.',
    propertyType: 'Studio',
    price: 16000,
    location: 'Anjuna',
    address: 'Cottage 5, St. Michael Vaddo, Anjuna',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    coordinates: { latitude: 15.5833, longitude: 73.7431 },
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    amenities: ['Air Conditioning', 'High-speed Wi-Fi', 'Free Parking', 'Garden', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.82,
    totalReviews: 33,
  },

  // Mumbai
  {
    title: 'Marine Drive Sea-Breeze Apartment',
    description: 'Prime ocean-facing luxury 2BHK flat along Queen’s Necklace. Stunning sunset views over the Arabian Sea, 24-hr concierge, and designer interiors.',
    propertyType: 'Apartment',
    price: 52000,
    location: 'Marine Drive',
    address: 'Sea View Apartments, Marine Lines',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    coordinates: { latitude: 18.9438, longitude: 72.8234 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1600,
    amenities: ['Air Conditioning', 'High-speed Wi-Fi', 'Elevator', '24/7 Security', 'Balcony', 'Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee1b2da9c5dd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.96,
    totalReviews: 38,
  },
  {
    title: 'Bandra West Bohemian Artist Loft',
    description: 'Trendy penthouse studio in Bandra West with exposed brick walls, vintage record player, plant-filled balcony, and steps away from seaside cafes.',
    propertyType: 'Studio',
    price: 32000,
    location: 'Pali Hill / Bandra West',
    address: '4th Floor, Sunset Terrace, Pali Hill, Bandra',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    coordinates: { latitude: 19.0596, longitude: 72.8295 },
    bedrooms: 1,
    bathrooms: 1,
    area: 720,
    amenities: ['High-speed Wi-Fi', 'Air Conditioning', 'Balcony', 'Kitchen', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.87,
    totalReviews: 44,
  },

  // Chennai
  {
    title: 'Besant Nagar Coastal 3BHK Home',
    description: 'Spacious independent coastal house 200 meters from Elliot Beach. Features wooden verandas, sea breeze cross ventilation, modular kitchen, and covered car port.',
    propertyType: 'House',
    price: 33000,
    location: 'Besant Nagar Beach Road',
    address: 'Plot 28, 4th Main Road, Besant Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    coordinates: { latitude: 13.0001, longitude: 80.2667 },
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    amenities: ['Free Parking', 'Air Conditioning', 'High-speed Wi-Fi', 'Kitchen', 'Balcony', 'Garden'],
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.83,
    totalReviews: 21,
  },

  // Visakhapatnam
  {
    title: 'RK Beach Panorama Residency',
    description: 'Sunlit sea-view apartment right on Beach Road in Visakhapatnam. Enjoy continuous sea breezes, morning walks along the promenade, and high-speed fiber internet.',
    propertyType: 'Apartment',
    price: 22000,
    location: 'Beach Road, Maharanipeta',
    address: 'Flat 402, Bay View Towers, RK Beach Road',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 17.7107, longitude: 83.3159 },
    bedrooms: 2,
    bathrooms: 2,
    area: 1450,
    amenities: ['Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Balcony', 'Kitchen', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.79,
    totalReviews: 16,
  },
  {
    title: 'Rushikonda Hills Luxury Hillside Villa',
    description: 'Breathtaking 4BHK architectural villa perched on Rushikonda hills overlooking the blue bay. Private infinity plunge pool and rooftop sundeck.',
    propertyType: 'Villa',
    price: 42000,
    location: 'Rushikonda IT SEZ',
    address: 'Villa 7, Hilltop Enclave, Rushikonda',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'India',
    coordinates: { latitude: 17.7816, longitude: 83.3857 },
    bedrooms: 4,
    bathrooms: 4,
    area: 3100,
    amenities: ['Swimming Pool', 'Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Kitchen', 'Balcony', 'Garden', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.93,
    totalReviews: 28,
  },

  // Delhi / NCR
  {
    title: 'Golf Course Road Luxury Sky Villa',
    description: 'High-end designer condominium in DLF Phase 5 Gurgaon. Featuring automated climate control, modular Poggenpohl kitchen, clubhouse, and concierge service.',
    propertyType: 'Apartment',
    price: 75000,
    location: 'Golf Course Road, DLF Phase 5',
    address: 'Apt 1402, The Magnolias, Golf Course Road',
    city: 'Delhi NCR',
    state: 'Haryana',
    country: 'India',
    coordinates: { latitude: 28.4595, longitude: 77.0266 },
    bedrooms: 4,
    bathrooms: 4,
    area: 3600,
    amenities: ['Swimming Pool', 'Gym', 'Air Conditioning', 'Free Parking', 'High-speed Wi-Fi', 'Kitchen', 'Elevator', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    averageRating: 4.96,
    totalReviews: 39,
  },

  // Jaipur
  {
    title: 'Heritage Haveli Courtyard Villa',
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
