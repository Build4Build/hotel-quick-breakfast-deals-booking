import { BreakfastDeal, BookedHotel } from '../types';
import { getRandomBreakfastImage } from './imageService';
import { API_CONFIG, ApiError, handleApiError } from '../config/api';

interface HotelbedsResponse {
  deals: Array<{
    id: string;
    hotel_id: string;
    title: string;
    description: string;
    price: number;
    original_price: number;
    currency: string;
    image: string;
    available_until: string;
    ingredients: string[];
    dietary_options: string[];
    time_slots: string[];
  }>;
}

/**
 * Generate a signature for Hotelbeds API authentication
 */
const generateSignature = (timestamp: number): string => {
  const message = `${API_CONFIG.HOTELBEDS.API_KEY}${API_CONFIG.HOTELBEDS.SECRET}${timestamp}`;
  return require('crypto').createHash('sha256').update(message).digest('hex');
};

/**
 * Fetch breakfast deals from Hotelbeds API with fallback to scraping
 */
export const fetchBreakfastDeals = async (hotelIds: string[]): Promise<BreakfastDeal[]> => {
  try {
    // Try Hotelbeds API first
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature(timestamp);
    
    const response = await fetch(
      `${API_CONFIG.HOTELBEDS.BASE_URL}${API_CONFIG.HOTELBEDS.ENDPOINTS.BREAKFAST_DEALS}?hotel_ids=${hotelIds.join(',')}`,
      {
        headers: {
          'Api-key': API_CONFIG.HOTELBEDS.API_KEY,
          'Signature': signature,
          'X-Timestamp': timestamp.toString(),
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new ApiError('Hotelbeds API failed', response.status);
    }

    const data: HotelbedsResponse = await response.json();
    return data.deals.map(deal => ({
      id: deal.id,
      hotelId: deal.hotel_id,
      title: deal.title,
      description: deal.description,
      price: deal.price,
      originalPrice: deal.original_price,
      currency: deal.currency,
      image: deal.image || getRandomBreakfastImage(),
      availableUntil: deal.available_until,
      ingredients: deal.ingredients,
      dietaryOptions: deal.dietary_options,
      timeSlots: deal.time_slots,
    }));
  } catch (error) {
    console.warn('Hotelbeds API failed, falling back to scraping:', error);
    
    try {
      // Fallback to scraping hotel websites
      const deals = await Promise.all(
        hotelIds.map(async (hotelId) => {
          try {
            // In a real app, you would implement proper web scraping here
            // This is just a placeholder that returns mock data
            const mockDeal = require('../utils/mockData').breakfastDeals.find(
              (deal: BreakfastDeal) => deal.hotelId === hotelId
            );
            
            if (mockDeal) {
              return {
                ...mockDeal,
                image: getRandomBreakfastImage(), // Use a random image for scraped deals
              };
            }
            return null;
          } catch (scrapeError) {
            console.error(`Error scraping deals for hotel ${hotelId}:`, scrapeError);
            return null;
          }
        })
      );

      return deals.filter((deal): deal is BreakfastDeal => deal !== null);
    } catch (fallbackError) {
      console.error('Scraping failed, using mock data:', fallbackError);
      // Return mock data as last resort
      return require('../utils/mockData').breakfastDeals;
    }
  }
};

/**
 * Fetch a specific breakfast deal by ID
 */
export const fetchDealById = async (id: string): Promise<BreakfastDeal | undefined> => {
  try {
    // First try to get the hotel ID from the deal ID
    const mockDeal = require('../utils/mockData').breakfastDeals.find(
      (deal: BreakfastDeal) => deal.id === id
    );
    
    if (!mockDeal) {
      return undefined;
    }

    // Fetch deals for this hotel
    const deals = await fetchBreakfastDeals([mockDeal.hotelId]);
    return deals.find(deal => deal.id === id);
  } catch (error) {
    console.error('Error fetching deal by ID:', error);
    return undefined;
  }
};

/**
 * Get today's deals for booked hotels
 */
export const getTodaysDeals = async (): Promise<BreakfastDeal[]> => {
  try {
    // Get booked hotels
    const bookedHotels = await require('./hotelService').fetchBookedHotels();
    const hotelIds = bookedHotels.map((hotel: BookedHotel) => hotel.id);
    
    // Fetch deals for these hotels
    return await fetchBreakfastDeals(hotelIds);
  } catch (error) {
    console.error('Error getting today\'s deals:', error);
    return require('../utils/mockData').getTodaysDeals();
  }
}; 