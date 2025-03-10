import AsyncStorage from '@react-native-async-storage/async-storage';
import { BreakfastDeal } from '../types';

export interface Reservation {
  id: string;
  dealId: string;
  hotelId: string;
  timeSlot: string;
  date: string; // ISO string
  numberOfGuests: number;
  specialRequests?: string;
  dietaryRequirements?: string[];
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string; // ISO string
}

// Storage key for reservations
const RESERVATIONS_STORAGE_KEY = '@breakfast_deals_reservations';

/**
 * Create a new breakfast reservation
 */
export const createReservation = async (
  deal: BreakfastDeal,
  timeSlot: string,
  numberOfGuests: number,
  specialRequests?: string,
  dietaryRequirements?: string[]
): Promise<Reservation> => {
  try {
    // Get existing reservations
    const existingReservations = await getReservations();

    // Create new reservation
    const newReservation: Reservation = {
      id: `res_${Date.now()}`,
      dealId: deal.id,
      hotelId: deal.hotelId,
      timeSlot,
      date: new Date().toISOString(),
      numberOfGuests,
      specialRequests,
      dietaryRequirements,
      totalPrice: deal.price * numberOfGuests,
      currency: deal.currency,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Add new reservation to the list
    const updatedReservations = [...existingReservations, newReservation];
    await AsyncStorage.setItem(
      RESERVATIONS_STORAGE_KEY,
      JSON.stringify(updatedReservations)
    );

    return newReservation;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw new Error('Failed to create reservation');
  }
};

/**
 * Get all reservations
 */
export const getReservations = async (): Promise<Reservation[]> => {
  try {
    const reservationsJson = await AsyncStorage.getItem(RESERVATIONS_STORAGE_KEY);
    return reservationsJson ? JSON.parse(reservationsJson) : [];
  } catch (error) {
    console.error('Error getting reservations:', error);
    return [];
  }
};

/**
 * Get reservations for a specific deal
 */
export const getReservationsForDeal = async (dealId: string): Promise<Reservation[]> => {
  const reservations = await getReservations();
  return reservations.filter(res => res.dealId === dealId);
};

/**
 * Cancel a reservation
 */
export const cancelReservation = async (reservationId: string): Promise<boolean> => {
  try {
    const reservations = await getReservations();
    const updatedReservations = reservations.map(res =>
      res.id === reservationId ? { ...res, status: 'cancelled' } : res
    );
    
    await AsyncStorage.setItem(
      RESERVATIONS_STORAGE_KEY,
      JSON.stringify(updatedReservations)
    );
    
    return true;
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    return false;
  }
};

/**
 * Check if a time slot is available
 */
export const isTimeSlotAvailable = async (
  dealId: string,
  timeSlot: string,
  date: string
): Promise<boolean> => {
  const reservations = await getReservationsForDeal(dealId);
  const activeReservations = reservations.filter(
    res => 
      res.status === 'confirmed' && 
      res.timeSlot === timeSlot &&
      new Date(res.date).toDateString() === new Date(date).toDateString()
  );
  
  // For demo purposes, let's say each time slot has a maximum of 10 reservations
  return activeReservations.length < 10;
}; 