// API Configuration
export const API_CONFIG = {
  // Booking.com API
  BOOKING: {
    API_KEY: process.env.BOOKING_API_KEY || 'YOUR_BOOKING_API_KEY',
    BASE_URL: 'https://distribution-xml.booking.com/2.0',
    ENDPOINTS: {
      BOOKINGS: '/hotels/bookings',
    },
  },

  // Hotels.com API
  HOTELS: {
    API_KEY: process.env.HOTELS_API_KEY || 'YOUR_HOTELS_API_KEY',
    BASE_URL: 'https://api.hotels.com/v1',
    ENDPOINTS: {
      BOOKINGS: '/bookings',
    },
  },

  // Hotelbeds API
  HOTELBEDS: {
    API_KEY: process.env.HOTELBEDS_API_KEY || 'YOUR_HOTELBEDS_API_KEY',
    SECRET: process.env.HOTELBEDS_SECRET || 'YOUR_HOTELBEDS_SECRET',
    BASE_URL: 'https://api.hotelbeds.com/hotel-api/1.0',
    ENDPOINTS: {
      BREAKFAST_DEALS: '/breakfast-deals',
    },
  },

  // Unsplash API (for images)
  UNSPLASH: {
    API_KEY: process.env.UNSPLASH_API_KEY || 'YOUR_UNSPLASH_API_KEY',
    BASE_URL: 'https://api.unsplash.com',
    ENDPOINTS: {
      SEARCH: '/search/photos',
      RANDOM: '/photos/random',
    },
  },

  // Web Scraping Configuration
  SCRAPING: {
    MAX_RETRIES: 3,
    TIMEOUT: 5000, // 5 seconds
    USER_AGENT: 'Mozilla/5.0 (compatible; HotelBreakfastDeals/1.0; +http://yourdomain.com)',
  },
};

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

// API Error Types
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API Helper Functions
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }
  
  return new ApiError('An unknown error occurred', 500);
};

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
}; 