/**
 * Image Service for fetching high-quality images from Unsplash
 * 
 * Note: In a production app, you would need to:
 * 1. Register for an Unsplash API key at https://unsplash.com/developers
 * 2. Use environment variables to store the API key securely
 * 3. Follow Unsplash attribution requirements
 */

import { API_CONFIG, ApiError, handleApiError } from '../config/api';

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

interface UnsplashResponse {
  urls: {
    regular: string;
    raw: string;
  };
  alt_description: string;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

/**
 * Get a random breakfast image from Unsplash
 */
export const getRandomBreakfastImage = async (): Promise<string> => {
  try {
    const randomCategory = BREAKFAST_CATEGORIES[Math.floor(Math.random() * BREAKFAST_CATEGORIES.length)];
    const response = await fetch(
      `${API_CONFIG.UNSPLASH.BASE_URL}${API_CONFIG.UNSPLASH.ENDPOINTS.RANDOM}?query=${encodeURIComponent(randomCategory)}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${API_CONFIG.UNSPLASH.API_KEY}`,
          'Accept-Version': 'v1',
        },
      }
    );

    if (!response.ok) {
      throw new ApiError('Unsplash API failed', response.status);
    }

    const data: UnsplashResponse = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error('Error fetching random breakfast image:', error);
    // Fallback to a static image URL
    return 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80';
  }
};

/**
 * Get a random hotel image from Unsplash
 */
export const getRandomHotelImage = async (): Promise<string> => {
  try {
    const randomCategory = HOTEL_CATEGORIES[Math.floor(Math.random() * HOTEL_CATEGORIES.length)];
    const response = await fetch(
      `${API_CONFIG.UNSPLASH.BASE_URL}${API_CONFIG.UNSPLASH.ENDPOINTS.RANDOM}?query=${encodeURIComponent(randomCategory)}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${API_CONFIG.UNSPLASH.API_KEY}`,
          'Accept-Version': 'v1',
        },
      }
    );

    if (!response.ok) {
      throw new ApiError('Unsplash API failed', response.status);
    }

    const data: UnsplashResponse = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error('Error fetching random hotel image:', error);
    // Fallback to a static image URL
    return 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';
  }
};

/**
 * Get a breakfast image for a specific cuisine type
 */
export const getBreakfastImageByCuisine = async (cuisineType: string): Promise<string> => {
  try {
    const response = await fetch(
      `${API_CONFIG.UNSPLASH.BASE_URL}${API_CONFIG.UNSPLASH.ENDPOINTS.SEARCH}?query=${encodeURIComponent(`${cuisineType} breakfast`)}&per_page=1`,
      {
        headers: {
          'Authorization': `Client-ID ${API_CONFIG.UNSPLASH.API_KEY}`,
          'Accept-Version': 'v1',
        },
      }
    );

    if (!response.ok) {
      throw new ApiError('Unsplash API failed', response.status);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    return getRandomBreakfastImage();
  } catch (error) {
    console.error('Error fetching cuisine-specific breakfast image:', error);
    return getRandomBreakfastImage();
  }
};

/**
 * Get a hotel image based on location or type
 */
export const getHotelImageByType = async (hotelType: string): Promise<string> => {
  try {
    const response = await fetch(
      `${API_CONFIG.UNSPLASH.BASE_URL}${API_CONFIG.UNSPLASH.ENDPOINTS.SEARCH}?query=${encodeURIComponent(`${hotelType} hotel`)}&per_page=1`,
      {
        headers: {
          'Authorization': `Client-ID ${API_CONFIG.UNSPLASH.API_KEY}`,
          'Accept-Version': 'v1',
        },
      }
    );

    if (!response.ok) {
      throw new ApiError('Unsplash API failed', response.status);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    return getRandomHotelImage();
  } catch (error) {
    console.error('Error fetching type-specific hotel image:', error);
    return getRandomHotelImage();
  }
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