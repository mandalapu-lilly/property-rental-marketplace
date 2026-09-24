import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Property from './models/Property.js';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://mandalapulilly_db_user:31UTfHycs5edAckm@cluster0.oqala68.mongodb.net/property_marketplace?retryWrites=true&w=majority';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      dbName: 'property_marketplace',
    });
    console.log('Connected to MongoDB Atlas.');

    // 1. Ensure a host user exists
    let hostUser = await User.findOne({ role: { $in: ['host', 'admin', 'user'] } });
    if (!hostUser) {
      console.log('Creating demo host user...');
      hostUser = await User.create({
        name: 'HavenStay Host',
        email: 'host@havenstay.com',
        password: 'password123',
        role: 'host',
      });
    }

    console.log(`Using owner ID: ${hostUser._id} (${hostUser.name} - ${hostUser.email})`);

    // 2. Clear old property seed data (optional or keep)
    const existingCount = await Property.countDocuments();
    console.log(`Current properties in database: ${existingCount}`);

    const properties = [
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
        owner: hostUser._id,
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
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
        ],
        owner: hostUser._id,
        status: 'available',
        averageRating: 4.8,
        totalReviews: 18,
      },
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
        owner: hostUser._id,
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
        owner: hostUser._id,
        status: 'available',
        averageRating: 4.75,
        totalReviews: 31,
      },
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
        owner: hostUser._id,
        status: 'available',
        averageRating: 4.92,
        totalReviews: 56,
      },
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
        owner: hostUser._id,
        status: 'available',
        averageRating: 4.88,
        totalReviews: 29,
      },
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
        owner: hostUser._id,
        status: 'available',
        averageRating: 4.96,
        totalReviews: 38,
      },
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
        owner: hostUser._id,
        status: 'available',
        averageRating: 4.79,
        totalReviews: 16,
      }
    ];

    console.log(`Inserting ${properties.length} sample properties...`);
    const inserted = await Property.insertMany(properties);
    console.log(`Successfully inserted ${inserted.length} properties into MongoDB Atlas!`);

    await mongoose.disconnect();
    console.log('Database disconnected cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
