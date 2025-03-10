import { BreakfastDeal, BookedHotel, User } from '../types';

// Mock booked hotels data
export const bookedHotels: BookedHotel[] = [
  {
    id: 'hotel1',
    name: 'Grand Hyatt',
    address: '123 Luxury Ave, New York, NY 10001',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000',
    rating: 4.8,
    bookingReference: 'GH12345',
    checkInDate: '2023-12-15T14:00:00Z',
    checkOutDate: '2023-12-20T11:00:00Z',
    roomType: 'Deluxe King',
    guests: 2,
  },
  {
    id: 'hotel2',
    name: 'Marriott Resort',
    address: '456 Beach Blvd, Miami, FL 33139',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1470',
    rating: 4.6,
    bookingReference: 'MR67890',
    checkInDate: '2024-01-10T15:00:00Z',
    checkOutDate: '2024-01-17T10:00:00Z',
    roomType: 'Ocean View Suite',
    guests: 3,
  },
  {
    id: 'hotel3',
    name: 'Four Seasons',
    address: '789 Mountain Dr, Aspen, CO 81611',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1470',
    rating: 4.9,
    bookingReference: 'FS24680',
    checkInDate: '2024-02-05T16:00:00Z',
    checkOutDate: '2024-02-12T11:00:00Z',
    roomType: 'Mountain View Premium',
    guests: 2,
  },
];

// Mock breakfast deals data
export const breakfastDeals: BreakfastDeal[] = [
  {
    id: 'deal1',
    hotelId: 'hotel1',
    title: 'Luxury Continental Breakfast',
    description: 'Start your day with our luxury continental breakfast featuring freshly baked pastries, seasonal fruits, artisanal cheeses, and premium coffee.',
    price: 24.99,
    originalPrice: 34.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1533920379810-6bedac9e31e6?q=80&w=1374',
    availableUntil: '2023-12-31T23:59:59Z',
    ingredients: ['Artisanal pastries', 'Seasonal fruits', 'Gourmet cheeses', 'Premium coffee'],
    dietaryOptions: ['Vegetarian', 'Gluten-free options'],
    timeSlots: ['7:00 AM - 8:30 AM', '8:30 AM - 10:00 AM'],
  },
  {
    id: 'deal2',
    hotelId: 'hotel1',
    title: 'Chef\'s Special Brunch',
    description: 'Indulge in our chef\'s special brunch featuring made-to-order omelets, Belgian waffles, prime bacon, and signature mimosas.',
    price: 39.99,
    originalPrice: 59.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1622207841084-53cbe7f4d70a?q=80&w=1374',
    availableUntil: '2023-12-31T23:59:59Z',
    ingredients: ['Organic eggs', 'Artisanal bread', 'Premium meats', 'Fresh vegetables'],
    dietaryOptions: ['Vegetarian', 'Dairy-free options'],
    timeSlots: ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM'],
  },
  {
    id: 'deal3',
    hotelId: 'hotel2',
    title: 'Beachside Breakfast Buffet',
    description: 'Enjoy our expansive breakfast buffet with ocean views, featuring fresh seafood, tropical fruits, and island-inspired dishes.',
    price: 32.99,
    originalPrice: 45.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1470',
    availableUntil: '2024-01-31T23:59:59Z',
    ingredients: ['Fresh seafood', 'Tropical fruits', 'Island specialties', 'Freshly baked breads'],
    dietaryOptions: ['Vegetarian', 'Pescatarian', 'Gluten-free options'],
    timeSlots: ['7:30 AM - 9:30 AM', '9:30 AM - 11:30 AM'],
  },
  {
    id: 'deal4',
    hotelId: 'hotel3',
    title: 'Alpine Morning Feast',
    description: 'Fuel your mountain adventures with our hearty alpine breakfast featuring local specialties, organic ingredients, and artisanal coffee.',
    price: 29.99,
    originalPrice: 42.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1608649617516-6761cf0f8588?q=80&w=1470',
    availableUntil: '2024-02-28T23:59:59Z',
    ingredients: ['Local cheeses', 'Mountain honey', 'Organic meats', 'Artisanal breads'],
    dietaryOptions: ['Vegetarian', 'Gluten-free options', 'High-protein options'],
    timeSlots: ['6:30 AM - 8:30 AM', '8:30 AM - 10:30 AM'],
  },
  {
    id: 'deal5',
    hotelId: 'hotel2',
    title: 'Tropical Sunrise Breakfast',
    description: 'Experience our tropical sunrise breakfast with freshly squeezed juices, exotic fruits, and beachside views.',
    price: 27.99,
    originalPrice: 39.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?q=80&w=1474',
    availableUntil: '2024-01-31T23:59:59Z',
    ingredients: ['Exotic fruits', 'Fresh juices', 'Coconut specialties', 'Island pastries'],
    dietaryOptions: ['Vegan options', 'Gluten-free options'],
    timeSlots: ['6:00 AM - 8:00 AM', '8:00 AM - 10:00 AM'],
  },
];

// Mock user data
export const mockUser: User = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  bookedHotels: bookedHotels,
  favoriteDeals: ['deal2', 'deal4'],
};

// Helper function to get today's deals
export const getTodaysDeals = (): BreakfastDeal[] => {
  // In a real app, you'd filter based on date and availability
  // For mock data, we'll return all deals for hotels the user has booked
  const userHotelIds = mockUser.bookedHotels.map(hotel => hotel.id);
  return breakfastDeals.filter(deal => userHotelIds.includes(deal.hotelId));
};

// Helper function to get a deal by ID
export const getDealById = (id: string): BreakfastDeal | undefined => {
  return breakfastDeals.find(deal => deal.id === id);
};

// Helper function to get a hotel by ID
export const getHotelById = (id: string): BookedHotel | undefined => {
  return bookedHotels.find(hotel => hotel.id === id);
}; 