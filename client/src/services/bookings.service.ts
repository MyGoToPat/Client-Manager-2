import type { Booking } from '../types';
import { mockBookings } from '../mocks/mentors.mock';

export interface BookingsService {
  getBookings(mentorId: string): Promise<Booking[]>;
  getBookingsByDate(mentorId: string, date: Date): Promise<Booking[]>;
  createBooking(booking: Omit<Booking, 'id'>): Promise<Booking>;
  updateBooking(id: string, updates: Partial<Booking>): Promise<Booking>;
  cancelBooking(id: string): Promise<void>;
}

let bookingsData = [...mockBookings];

export const bookingsService: BookingsService = {
  async getBookings(_mentorId: string): Promise<Booking[]> {
    await new Promise(r => setTimeout(r, 400));
    return bookingsData;
  },

  async getBookingsByDate(_mentorId: string, date: Date): Promise<Booking[]> {
    await new Promise(r => setTimeout(r, 300));
    const targetDate = date.toDateString();
    return bookingsData.filter(b => 
      new Date(b.scheduledAt).toDateString() === targetDate
    );
  },

  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    await new Promise(r => setTimeout(r, 500));
    const newBooking: Booking = {
      ...booking,
      id: 'booking-' + Date.now()
    };
    bookingsData.push(newBooking);
    return newBooking;
  },

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    await new Promise(r => setTimeout(r, 400));
    const index = bookingsData.findIndex(b => b.id === id);
    if (index !== -1) {
      bookingsData[index] = { ...bookingsData[index], ...updates };
      return bookingsData[index];
    }
    throw new Error('Booking not found');
  },

  async cancelBooking(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    const index = bookingsData.findIndex(b => b.id === id);
    if (index !== -1) {
      bookingsData[index] = { ...bookingsData[index], status: 'cancelled' };
    }
  }
};
