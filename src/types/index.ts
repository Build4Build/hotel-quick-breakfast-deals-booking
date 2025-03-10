export interface Hotel {
  id: string;
  name: string;
  address: string;
  image: string;
  rating: number;
  bookingReference?: string;
}

export interface BreakfastDeal {
  id: string;
  hotelId: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  currency: string;
  image: string;
  availableUntil: string; // ISO string
  ingredients?: string[];
  dietaryOptions?: string[];
  timeSlots?: string[];
}

export interface BookedHotel extends Hotel {
  bookingReference: string;
  checkInDate: string; // ISO string
  checkOutDate: string; // ISO string
  roomType: string;
  guests: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bookedHotels: BookedHotel[];
  favoriteDeals: string[]; // Deal IDs
}

export type RootStackParamList = {
  Home: undefined;
  DealDetail: { dealId: string };
  Profile: undefined;
  BookedHotels: undefined;
  Settings: undefined;
}; 