/**
 * Image Service for fetching high-quality images from Unsplash
 * 
 * Note: In a production app, you would need to:
 * 1. Register for an Unsplash API key at https://unsplash.com/developers
 * 2. Use environment variables to store the API key securely
 * 3. Follow Unsplash attribution requirements
 */

// For demo purposes, using Unsplash Source API which doesn't require authentication
// but has limitations on customization

// Available categories for breakfast images
const BREAKFAST_CATEGORIES = [
  'breakfast',
  'brunch',
  'coffee',
  'croissant',
  'pastry',
  'hotel breakfast',
  'buffet',
  'continental breakfast'
];

// Available categories for hotel images
const HOTEL_CATEGORIES = [
  'hotel',
  'resort',
  'luxury hotel',
  'hotel room',
  'hotel lobby',
  'boutique hotel'
];

/**
 * Get a random breakfast image
 * @returns URL to a high-quality breakfast image
 */
export const getRandomBreakfastImage = (): string => {
  const randomCategory = BREAKFAST_CATEGORIES[Math.floor(Math.random() * BREAKFAST_CATEGORIES.length)];
  return `https://source.unsplash.com/random/1200x800/?${encodeURIComponent(randomCategory)}`;
};

/**
 * Get a random hotel image
 * @returns URL to a high-quality hotel image
 */
export const getRandomHotelImage = (): string => {
  const randomCategory = HOTEL_CATEGORIES[Math.floor(Math.random() * HOTEL_CATEGORIES.length)];
  return `https://source.unsplash.com/random/1200x800/?${encodeURIComponent(randomCategory)}`;
};

/**
 * Get a breakfast image for a specific cuisine type
 * @param cuisineType Type of cuisine (e.g., 'continental', 'american', 'buffet')
 * @returns URL to a relevant breakfast image
 */
export const getBreakfastImageByCuisine = (cuisineType: string): string => {
  return `https://source.unsplash.com/random/1200x800/?${encodeURIComponent(`${cuisineType} breakfast`)}`;
};

/**
 * Get a hotel image based on location or type
 * @param hotelType Type or location of hotel (e.g., 'beach', 'mountain', 'luxury')
 * @returns URL to a relevant hotel image
 */
export const getHotelImageByType = (hotelType: string): string => {
  return `https://source.unsplash.com/random/1200x800/?${encodeURIComponent(`${hotelType} hotel`)}`;
};

// In a real production app with proper authentication, you'd use the full API:
/*
export const searchBreakfastImages = async (query: string) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${YOUR_API_KEY}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};
*/ 