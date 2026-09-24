import Property from '../models/Property.js';

// Comprehensive city synonyms & common Indian/global locations
const KNOWN_CITIES = [
  'Guntur',
  'Vijayawada',
  'Hyderabad',
  'Bengaluru',
  'Bangalore',
  'Goa',
  'Mumbai',
  'Chennai',
  'Visakhapatnam',
  'Vizag',
  'Delhi',
  'Delhi NCR',
  'Gurgaon',
  'Gurugram',
  'Noida',
  'Jaipur',
  'Pune',
  'Kochi',
  'Kolkata',
];

const KNOWN_TYPES = ['Apartment', 'Villa', 'House', 'Studio', 'Room'];

const KNOWN_AMENITIES = [
  { match: /(swimming pool|pool)/i, name: 'Swimming Pool' },
  { match: /(wi-?fi|wifi|internet|broadband)/i, name: 'High-speed Wi-Fi' },
  { match: /(air condition|ac|a\/c)/i, name: 'Air Conditioning' },
  { match: /(parking|car park|garage)/i, name: 'Free Parking' },
  { match: /(kitchen|cook)/i, name: 'Kitchen' },
  { match: /(gym|fitness)/i, name: 'Gym' },
  { match: /(balcony|terrace)/i, name: 'Balcony' },
  { match: /(garden|lawn)/i, name: 'Garden' },
  { match: /(pet|pets|dog|cat)/i, name: 'Pet Friendly' },
  { match: /(security|guard)/i, name: '24/7 Security' },
  { match: /(elevator|lift)/i, name: 'Elevator' },
];

/**
 * Natural Language Processing Entity Extractor & Search Engine
 */
export const processRentalQuery = async (queryText) => {
  if (!queryText || typeof queryText !== 'string') {
    return {
      reply: "Hello! I am your AI Rental Assistant. How can I help you find your ideal property today?",
      properties: [],
      filtersExtracted: {},
      suggestions: [
        'Villas with pool in Goa',
        '2BHK in Guntur under 25000',
        'Studios in Hyderabad',
        'Highest rated properties',
      ],
    };
  }

  const raw = queryText.toLowerCase().trim();
  const filters = { status: 'available' };
  const extracted = {};

  // 1. Extract City
  for (const city of KNOWN_CITIES) {
    const cityRegex = new RegExp(`\\b${city.toLowerCase()}\\b`, 'i');
    if (cityRegex.test(raw)) {
      // Normalize Bangalore to Bengaluru, Vizag to Visakhapatnam, Gurgaon to Delhi NCR
      let normalizedCity = city;
      if (city.toLowerCase() === 'bangalore') normalizedCity = 'Bengaluru';
      if (city.toLowerCase() === 'vizag') normalizedCity = 'Visakhapatnam';
      if (city.toLowerCase() === 'gurgaon' || city.toLowerCase() === 'gurugram' || city.toLowerCase() === 'noida') {
        normalizedCity = 'Delhi NCR';
      }

      extracted.city = normalizedCity;
      filters.city = { $regex: new RegExp(normalizedCity, 'i') };
      break;
    }
  }

  // 2. Extract BHK / Bedrooms
  const bhkMatch = raw.match(/(\d+)\s*(?:bhk|bed|bedroom|beds|bedrooms)/i);
  if (bhkMatch) {
    const beds = parseInt(bhkMatch[1], 10);
    if (!isNaN(beds)) {
      extracted.bedrooms = beds;
      filters.bedrooms = { $gte: beds };
    }
  }

  // 3. Extract Property Type
  if (raw.includes('villa') || raw.includes('villas')) {
    extracted.propertyType = 'Villa';
    filters.propertyType = 'Villa';
  } else if (raw.includes('apartment') || raw.includes('apartments') || raw.includes('flat') || raw.includes('flats')) {
    extracted.propertyType = 'Apartment';
    filters.propertyType = 'Apartment';
  } else if (raw.includes('house') || raw.includes('home') || raw.includes('independent house') || raw.includes('bungalow')) {
    extracted.propertyType = 'House';
    filters.propertyType = 'House';
  } else if (raw.includes('studio') || raw.includes('loft')) {
    extracted.propertyType = 'Studio';
    filters.propertyType = 'Studio';
  } else if (raw.includes('room') || raw.includes('single room') || raw.includes('private room')) {
    extracted.propertyType = 'Room';
    filters.propertyType = 'Room';
  }

  // 4. Extract Price / Budget
  // Format: "under 25k", "under 25000", "< 30000", "below 20,000", "budget 35000", "around 30000"
  let maxPriceMatch = raw.match(/(?:under|below|less than|max|up to|budget|within|<=?)\s*(?:₹|rs\.?|inr)?\s*(\d+)(?:\s*(k|thousand))?/i);
  if (!maxPriceMatch) {
    maxPriceMatch = raw.match(/(\d+)\s*(?:k|thousand)\s*(?:budget|max|limit)?/i);
  }

  if (maxPriceMatch) {
    let num = parseInt(maxPriceMatch[1], 10);
    if (maxPriceMatch[2] && (maxPriceMatch[2].toLowerCase() === 'k' || maxPriceMatch[2].toLowerCase() === 'thousand')) {
      num = num * 1000;
    } else if (num < 100) {
      // e.g. "under 25" -> 25,000
      num = num * 1000;
    }
    extracted.maxPrice = num;
    filters.price = { ...(filters.price || {}), $lte: num };
  }

  // Format min price: "above 15000", "min 10k", "> 20000"
  const minPriceMatch = raw.match(/(?:above|more than|min|minimum|>=?)\s*(?:₹|rs\.?|inr)?\s*(\d+)(?:\s*(k|thousand))?/i);
  if (minPriceMatch) {
    let minNum = parseInt(minPriceMatch[1], 10);
    if (minPriceMatch[2] && (minPriceMatch[2].toLowerCase() === 'k' || minPriceMatch[2].toLowerCase() === 'thousand')) {
      minNum = minNum * 1000;
    }
    extracted.minPrice = minNum;
    filters.price = { ...(filters.price || {}), $gte: minNum };
  }

  // 5. Extract Amenities
  const foundAmenities = [];
  for (const item of KNOWN_AMENITIES) {
    if (item.match.test(raw)) {
      foundAmenities.push(item.name);
    }
  }
  if (foundAmenities.length > 0) {
    extracted.amenities = foundAmenities;
    filters.amenities = { $all: foundAmenities };
  }

  // 6. Determine Sort Order
  let sortOption = { averageRating: -1, createdAt: -1 };
  if (raw.includes('cheap') || raw.includes('lowest') || raw.includes('affordable') || raw.includes('budget friendly')) {
    sortOption = { price: 1 };
    extracted.sort = 'Price: Low to High';
  } else if (raw.includes('luxury') || raw.includes('expensive') || raw.includes('premium')) {
    sortOption = { price: -1 };
    extracted.sort = 'Price: High to Low';
  } else if (raw.includes('highest rated') || raw.includes('top rated') || raw.includes('best rating') || raw.includes('popular')) {
    sortOption = { averageRating: -1, totalReviews: -1 };
    extracted.sort = 'Highest Rated';
  } else if (raw.includes('new') || raw.includes('latest')) {
    sortOption = { createdAt: -1 };
    extracted.sort = 'Newest';
  }

  // 7. Execute Query against MongoDB
  let properties = await Property.find(filters)
    .populate('owner', 'name email role')
    .sort(sortOption)
    .limit(6)
    .lean();

  // If strict filter yielded 0 results, relax secondary filters (e.g. amenities) to still provide helpful suggestions
  if (properties.length === 0 && (filters.amenities || filters.price)) {
    const relaxedFilters = { status: 'available' };
    if (filters.city) relaxedFilters.city = filters.city;
    if (filters.propertyType) relaxedFilters.propertyType = filters.propertyType;
    if (filters.bedrooms) relaxedFilters.bedrooms = filters.bedrooms;

    const fallbackProps = await Property.find(relaxedFilters)
      .populate('owner', 'name email role')
      .sort(sortOption)
      .limit(4)
      .lean();

    if (fallbackProps.length > 0) {
      properties = fallbackProps;
    }
  }

  // If still empty, return top available properties across marketplace
  if (properties.length === 0) {
    properties = await Property.find({ status: 'available' })
      .populate('owner', 'name email role')
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(4)
      .lean();
  }

  // 8. Generate Conversational AI Response
  const reply = generateAssistantReply(queryText, extracted, properties.length);

  const suggestions = generateDynamicSuggestions(extracted);

  return {
    reply,
    properties,
    filtersExtracted: extracted,
    suggestions,
  };
};

// Natural response template builder
function generateAssistantReply(query, extracted, resultCount) {
  const parts = [];

  if (extracted.bedrooms) parts.push(`${extracted.bedrooms} BHK`);
  if (extracted.propertyType) parts.push(extracted.propertyType.toLowerCase() + 's');
  else if (!extracted.bedrooms) parts.push('properties');
  if (extracted.city) parts.push(`in ${extracted.city}`);
  if (extracted.maxPrice) parts.push(`under ₹${extracted.maxPrice.toLocaleString('en-IN')}`);
  if (extracted.amenities && extracted.amenities.length > 0) {
    parts.push(`with ${extracted.amenities.join(' & ')}`);
  }

  const querySummary = parts.length > 0 ? parts.join(' ') : 'top rated listings';

  if (resultCount > 0) {
    return `I found **${resultCount}** matching ${querySummary}. Here are the best verified options ready for viewing and booking:`;
  } else {
    return `I couldn't find exact listings for ${querySummary}, but here are our highest-rated alternative recommendations:`;
  }
}

function generateDynamicSuggestions(extracted) {
  const list = [];
  if (extracted.city) {
    list.push(`Villas in ${extracted.city}`);
    list.push(`Budget apartments in ${extracted.city}`);
  } else {
    list.push('2BHK in Guntur under 25000');
    list.push('Villas with pool in Goa');
    list.push('Luxury penthouses in Hyderabad');
  }
  list.push('Top rated properties across India');
  return list.slice(0, 4);
}
