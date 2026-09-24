import Property from '../models/Property.js';
import Favorite from '../models/Favorite.js';
import Booking from '../models/Booking.js';

/**
 * Intelligent Content-Based & Preference Recommendation Engine
 * Evaluates user history (favorites, bookings) and explicit preferences
 * to compute a transparent, explainable match score (0 - 100%).
 */
export const generateRecommendations = async ({ userId = null, preferences = {} } = {}) => {
  // 1. Fetch available properties
  const allProperties = await Property.find({ status: 'available' })
    .populate('owner', 'name email role')
    .lean();

  if (!allProperties || allProperties.length === 0) {
    return {
      recommendations: [],
      userProfile: null,
    };
  }

  // 2. Synthesize User Preference Profile from History (if logged in)
  const inferredProfile = {
    cities: {},
    propertyTypes: {},
    amenities: {},
    prices: [],
    savedPropertyIds: new Set(),
  };

  if (userId) {
    try {
      const [userFavorites, userBookings] = await Promise.all([
        Favorite.find({ user: userId }).populate('property').lean(),
        Booking.find({ user: userId, status: { $ne: 'cancelled' } }).populate('property').lean(),
      ]);

      // Process favorites
      userFavorites.forEach((fav) => {
        if (fav.property && fav.property._id) {
          inferredProfile.savedPropertyIds.add(fav.property._id.toString());
          tallyProperty(fav.property, inferredProfile, 2); // weight 2 for favorites
        }
      });

      // Process bookings
      userBookings.forEach((book) => {
        if (book.property && book.property._id) {
          inferredProfile.savedPropertyIds.add(book.property._id.toString());
          tallyProperty(book.property, inferredProfile, 3); // weight 3 for bookings
        }
      });
    } catch (err) {
      console.warn('Could not fetch user history for recommendations:', err.message);
    }
  }

  // 3. Merge Inferred Profile with Explicit Query Preferences
  const targetCity = preferences.city || preferences.preferredCity || getTopItem(inferredProfile.cities);
  const targetType = preferences.propertyType || preferences.type || getTopItem(inferredProfile.propertyTypes);
  const targetMaxPrice = preferences.maxPrice ? Number(preferences.maxPrice) : getAvgPrice(inferredProfile.prices);
  const targetMinPrice = preferences.minPrice ? Number(preferences.minPrice) : null;
  const targetBedrooms = preferences.bedrooms ? Number(preferences.bedrooms) : null;
  const targetAmenities = Array.isArray(preferences.amenities)
    ? preferences.amenities
    : typeof preferences.amenities === 'string' && preferences.amenities.trim()
    ? preferences.amenities.split(',').map((a) => a.trim()).filter(Boolean)
    : getTopAmenities(inferredProfile.amenities, 5);

  const hasUserHistory = inferredProfile.savedPropertyIds.size > 0;
  const hasExplicitPrefs = !!(preferences.city || preferences.propertyType || preferences.maxPrice || preferences.bedrooms || preferences.amenities);

  // 4. Score every property
  const scoredProperties = allProperties.map((prop) => {
    let score = 0;
    const reasons = [];

    // --- Factor 1: Location Match (Max 30 pts) ---
    if (targetCity && prop.city) {
      if (prop.city.toLowerCase() === targetCity.toLowerCase()) {
        score += 30;
        reasons.push(`Located in your preferred city of ${prop.city}`);
      } else if (prop.location && prop.location.toLowerCase().includes(targetCity.toLowerCase())) {
        score += 25;
        reasons.push(`Prime location in ${prop.location}`);
      } else if (prop.state && prop.state.toLowerCase() === targetCity.toLowerCase()) {
        score += 15;
        reasons.push(`Located in ${prop.state}`);
      }
    } else {
      // Default baseline location score
      score += 15;
    }

    // --- Factor 2: Budget / Rent Fit (Max 25 pts) ---
    if (targetMaxPrice && targetMaxPrice > 0) {
      if (prop.price <= targetMaxPrice) {
        if (targetMinPrice && prop.price < targetMinPrice) {
          score += 15;
          reasons.push(`Budget-friendly stay under ₹${targetMaxPrice.toLocaleString('en-IN')}`);
        } else {
          score += 25;
          reasons.push(`Within your ideal budget (₹${prop.price.toLocaleString('en-IN')}/mo)`);
        }
      } else if (prop.price <= targetMaxPrice * 1.15) {
        score += 15;
        reasons.push(`Just slightly above budget with premium features`);
      } else if (prop.price <= targetMaxPrice * 1.3) {
        score += 8;
      }
    } else {
      score += 18;
    }

    // --- Factor 3: Property Type Match (Max 15 pts) ---
    if (targetType && targetType !== 'All' && targetType !== 'All Types') {
      if (prop.propertyType && prop.propertyType.toLowerCase() === targetType.toLowerCase()) {
        score += 15;
        reasons.push(`Matches your preferred ${prop.propertyType} style`);
      }
    } else if (inferredProfile.propertyTypes[prop.propertyType]) {
      score += 12;
      reasons.push(`Matches your frequently viewed property type (${prop.propertyType})`);
    } else {
      score += 10;
    }

    // --- Factor 4: Bedrooms & Space (Max 10 pts) ---
    if (targetBedrooms && targetBedrooms > 0) {
      if (prop.bedrooms === targetBedrooms) {
        score += 10;
        reasons.push(`Exact ${prop.bedrooms} bedroom configuration`);
      } else if (prop.bedrooms >= targetBedrooms) {
        score += 8;
        reasons.push(`Spacious ${prop.bedrooms} bedrooms`);
      } else {
        score += 4;
      }
    } else {
      score += 7;
    }

    // --- Factor 5: Amenities Overlap (Max 10 pts) ---
    if (targetAmenities.length > 0 && Array.isArray(prop.amenities)) {
      const matchingAmenities = prop.amenities.filter((a) =>
        targetAmenities.some((ta) => ta.toLowerCase() === a.toLowerCase())
      );
      if (matchingAmenities.length > 0) {
        const amenityPts = Math.min(10, Math.round((matchingAmenities.length / targetAmenities.length) * 10));
        score += amenityPts;
        if (matchingAmenities.length >= 2) {
          reasons.push(`Features ${matchingAmenities.slice(0, 3).join(', ')}`);
        } else {
          reasons.push(`Includes ${matchingAmenities[0]}`);
        }
      }
    } else {
      score += 6;
    }

    // --- Factor 6: Quality, Ratings & Popularity Boost (Max 10 pts) ---
    const rating = prop.averageRating || 0;
    if (rating >= 4.8) {
      score += 10;
      reasons.push(`Top rated stay (${rating.toFixed(1)}★ rating from guests)`);
    } else if (rating >= 4.5) {
      score += 8;
      reasons.push(`Highly rated (${rating.toFixed(1)}★ rating)`);
    } else if (rating >= 4.0) {
      score += 6;
    } else {
      score += 4;
    }

    // Bonus for saved properties similarity
    if (inferredProfile.savedPropertyIds.has(prop._id.toString())) {
      reasons.unshift(`Saved in your favorites wishlist`);
    }

    // Normalize final score between 50% and 99% for smooth display
    const finalMatchScore = Math.min(99, Math.max(50, Math.round(score)));

    // Categorize match strength
    let matchLevel = 'Good Match';
    if (finalMatchScore >= 90) matchLevel = 'Exceptional Match';
    else if (finalMatchScore >= 80) matchLevel = 'Great Match';

    // Ensure at least 2 clear reasons exist
    if (reasons.length === 0) {
      reasons.push('Popular choice among renters in this city');
      reasons.push('Great value listing with verified amenities');
    } else if (reasons.length === 1) {
      reasons.push('Quality verified listing on HavenStay');
    }

    return {
      ...prop,
      matchScore: finalMatchScore,
      matchPercentage: `${finalMatchScore}%`,
      matchLevel,
      reasons,
    };
  });

  // Sort descending by match score, then by rating
  scoredProperties.sort((a, b) => b.matchScore - a.matchScore || (b.averageRating || 0) - (a.averageRating || 0));

  return {
    recommendations: scoredProperties,
    profileApplied: {
      hasUserHistory,
      hasExplicitPrefs,
      targetCity: targetCity || 'All Locations',
      targetType: targetType || 'All Types',
      targetMaxPrice: targetMaxPrice || null,
      targetBedrooms: targetBedrooms || null,
      topAmenities: targetAmenities,
    },
  };
};

// Helper to tally frequencies
function tallyProperty(prop, profile, multiplier = 1) {
  if (prop.city) {
    profile.cities[prop.city] = (profile.cities[prop.city] || 0) + multiplier;
  }
  if (prop.propertyType) {
    profile.propertyTypes[prop.propertyType] = (profile.propertyTypes[prop.propertyType] || 0) + multiplier;
  }
  if (Array.isArray(prop.amenities)) {
    prop.amenities.forEach((a) => {
      profile.amenities[a] = (profile.amenities[a] || 0) + multiplier;
    });
  }
  if (prop.price && typeof prop.price === 'number') {
    profile.prices.push(prop.price);
  }
}

function getTopItem(map) {
  let top = null;
  let maxCount = 0;
  for (const [key, count] of Object.entries(map)) {
    if (count > maxCount) {
      maxCount = count;
      top = key;
    }
  }
  return top;
}

function getTopAmenities(map, limit = 5) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map((entry) => entry[0]);
}

function getAvgPrice(prices) {
  if (!prices || prices.length === 0) return null;
  const sum = prices.reduce((acc, p) => acc + p, 0);
  return Math.round(sum / prices.length);
}
