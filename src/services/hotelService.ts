import axios from 'axios';
import { Hotel, BookedHotel } from '../types';
import { HOTELS_API_KEY, BOOKING_API_KEY } from '../config/keys';
import { API_CONFIG, ApiError, handleApiError } from '../config/api';

// Base URLs for the APIs
const HOTELS_API_BASE_URL = 'https://hotels-com-provider.p.rapidapi.com/v2';
const BOOKING_API_BASE_URL = 'https://booking-com.p.rapidapi.com/v1';

// Headers for RapidAPI
const rapidApiHeaders = {
  'X-RapidAPI-Key': HOTELS_API_KEY,
  'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
};

const bookingApiHeaders = {
  'X-RapidAPI-Key': BOOKING_API_KEY,
  'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
};

/**
 * Fetch hotel details from Hotels.com API
 */
const fetchHotelFromHotelsApi = async (hotelId: string): Promise<Hotel | null> => {
  try {
    const response = await axios.get(`${HOTELS_API_BASE_URL}/hotels/details`, {
      headers: rapidApiHeaders,
      params: {
        hotel_id: hotelId,
        locale: 'en_US'
      }
    });

    const hotelData = response.data;
    return {
      id: hotelId,
      name: hotelData.name,
      address: `${hotelData.address.streetAddress}, ${hotelData.address.locality}, ${hotelData.address.region}`,
      image: hotelData.propertyGallery.images[0].image.url,
      rating: hotelData.starRating,
    };
  } catch (error) {
    console.error('Error fetching from Hotels.com API:', error);
    return null;
  }
};

/**
 * Fetch hotel details from Booking.com API (fallback)
 */
const fetchHotelFromBookingApi = async (hotelId: string): Promise<Hotel | null> => {
  try {
    const response = await axios.get(`${BOOKING_API_BASE_URL}/hotels/details`, {
      headers: bookingApiHeaders,
      params: {
        hotel_id: hotelId,
        locale: 'en-us'
      }
    });

    const hotelData = response.data;
    return {
      id: hotelId,
      name: hotelData.name,
      address: hotelData.address,
      image: hotelData.main_photo_url,
      rating: hotelData.review_score / 2, // Convert to 5-star scale
    };
  } catch (error) {
    console.error('Error fetching from Booking.com API:', error);
    return null;
  }
};

/**
 * Get hotel details with fallback mechanism
 */
export const getHotelDetails = async (hotelId: string): Promise<Hotel | null> => {
  // Try Hotels.com API first
  const hotelsApiResult = await fetchHotelFromHotelsApi(hotelId);
  if (hotelsApiResult) return hotelsApiResult;

  // Fallback to Booking.com API
  const bookingApiResult = await fetchHotelFromBookingApi(hotelId);
  if (bookingApiResult) return bookingApiResult;

  // If both APIs fail, return null
  return null;
};

/**
 * Search for hotels in a specific location
 */
export const searchHotels = async (
  location: string,
  checkIn: string,
  checkOut: string
): Promise<Hotel[]> => {
  try {
    const response = await axios.get(`${HOTELS_API_BASE_URL}/hotels/search`, {
      headers: rapidApiHeaders,
      params: {
        query: location,
        checkin: checkIn,
        checkout: checkOut,
        sort_order: 'STAR_RATING_HIGHEST_FIRST',
        locale: 'en_US',
      }
    });

    return response.data.results.map((hotel: any) => ({
      id: hotel.id,
      name: hotel.name,
      address: `${hotel.address.streetAddress}, ${hotel.address.locality}`,
      image: hotel.propertyImage.image.url,
      rating: hotel.starRating,
    }));
  } catch (error) {
    console.error('Error searching hotels:', error);
    return [];
  }
};

/**
 * Get user's booked hotels
 * In a real app, this would fetch from your backend
 */
export const getBookedHotels = async (userId: string): Promise<BookedHotel[]> => {
  try {
    // This would typically be an API call to your backend
    // For demo, we'll use the Hotels.com API to get some real hotels
    const response = await axios.get(`${HOTELS_API_BASE_URL}/hotels/search`, {
      headers: rapidApiHeaders,
      params: {
        query: 'New York',
        sort_order: 'STAR_RATING_HIGHEST_FIRST',
        locale: 'en_US',
        page_number: '1',
        adults_number: '2',
      }
    });

    // Convert to BookedHotel format
    return response.data.results.slice(0, 3).map((hotel: any, index: number) => ({
      id: hotel.id,
      name: hotel.name,
      address: `${hotel.address.streetAddress}, ${hotel.address.locality}`,
      image: hotel.propertyImage.image.url,
      rating: hotel.starRating,
      bookingReference: `BK${Date.now()}${index}`,
      checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      checkOutDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      roomType: ['Deluxe Suite', 'Ocean View Room', 'Mountain View Suite'][index],
      guests: 2,
    }));
  } catch (error) {
    console.error('Error fetching booked hotels:', error);
    return [];
  }
};

interface BookingApiResponse {
  hotels: Array<{
    hotel_id: string;
    name: string;
    address: string;
    images: string[];
    rating: number;
    booking_reference: string;
    check_in: string;
    check_out: string;
    room_type: string;
    guests: number;
  }>;
}

interface HotelsApiResponse {
  hotels: Array<{
    id: string;
    name: string;
    address: string;
    images: string[];
    rating: number;
    booking_reference: string;
    check_in: string;
    check_out: string;
    room_type: string;
    guests: number;
  }>;
}

/**
 * Fetch booked hotels from Booking.com API with fallback to Hotels.com
 */
export const fetchBookedHotels = async (): Promise<BookedHotel[]> => {
  try {
    // Try Booking.com API first
    const bookingResponse = await fetch(
      `${API_CONFIG.BOOKING.BASE_URL}${API_CONFIG.BOOKING.ENDPOINTS.BOOKINGS}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.BOOKING.API_KEY}`,
        },
      }
    );

    if (!bookingResponse.ok) {
      throw new ApiError('Booking.com API failed', bookingResponse.status);
    }

    const bookingData: BookingApiResponse = await bookingResponse.json();
    return bookingData.hotels.map(hotel => ({
      id: hotel.hotel_id,
      name: hotel.name,
      address: hotel.address,
      image: hotel.images[0] || '',
      rating: hotel.rating,
      bookingReference: hotel.booking_reference,
      checkInDate: hotel.check_in,
      checkOutDate: hotel.check_out,
      roomType: hotel.room_type,
      guests: hotel.guests,
    }));
  } catch (error) {
    console.warn('Booking.com API failed, falling back to Hotels.com:', error);
    
    try {
      // Fallback to Hotels.com API
      const hotelsResponse = await fetch(
        `${API_CONFIG.HOTELS.BASE_URL}${API_CONFIG.HOTELS.ENDPOINTS.BOOKINGS}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${API_CONFIG.HOTELS.API_KEY}`,
          },
        }
      );

      if (!hotelsResponse.ok) {
        throw new ApiError('Hotels.com API failed', hotelsResponse.status);
      }

      const hotelsData: HotelsApiResponse = await hotelsResponse.json();
      return hotelsData.hotels.map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        address: hotel.address,
        image: hotel.images[0] || '',
        rating: hotel.rating,
        bookingReference: hotel.booking_reference,
        checkInDate: hotel.check_in,
        checkOutDate: hotel.check_out,
        roomType: hotel.room_type,
        guests: hotel.guests,
      }));
    } catch (fallbackError) {
      console.error('Both APIs failed, using mock data:', fallbackError);
      // Return mock data as last resort
      return require('../utils/mockData').bookedHotels;
    }
  }
};

/**
 * Fetch hotel details by ID
 */
export const fetchHotelById = async (id: string): Promise<BookedHotel | undefined> => {
  try {
    const hotels = await fetchBookedHotels();
    return hotels.find(hotel => hotel.id === id);
  } catch (error) {
    console.error('Error fetching hotel by ID:', error);
    return undefined;
  }
}; 