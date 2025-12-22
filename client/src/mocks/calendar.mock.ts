import type { Availability, BookingSettings, BlockedTime, Booking } from '../types';

export const mockAvailability: Availability[] = [
  { id: 'avail-1', mentorId: 'mentor-1', dayOfWeek: 1, startTime: '09:00', endTime: '12:00', isActive: true },
  { id: 'avail-2', mentorId: 'mentor-1', dayOfWeek: 1, startTime: '17:00', endTime: '20:00', isActive: true },
  { id: 'avail-3', mentorId: 'mentor-1', dayOfWeek: 2, startTime: '09:00', endTime: '12:00', isActive: true },
  { id: 'avail-4', mentorId: 'mentor-1', dayOfWeek: 3, startTime: '09:00', endTime: '12:00', isActive: true },
  { id: 'avail-5', mentorId: 'mentor-1', dayOfWeek: 3, startTime: '14:00', endTime: '18:00', isActive: true },
  { id: 'avail-6', mentorId: 'mentor-1', dayOfWeek: 4, startTime: '09:00', endTime: '12:00', isActive: true },
  { id: 'avail-7', mentorId: 'mentor-1', dayOfWeek: 5, startTime: '09:00', endTime: '12:00', isActive: true },
];

export const mockBookingSettings: BookingSettings = {
  mentorId: 'mentor-1',
  defaultSessionLength: 60,
  bufferBetweenSessions: 15,
  minimumNotice: 24,
  maximumAdvanceBooking: 14,
  defaultMeetingType: 'zoom',
  zoomConnected: true,
  googleMeetConnected: false,
  autoGenerateMeetingLink: true,
  sendReminder24h: true,
  sendReminder1h: true,
};

export const mockBlockedTimes: BlockedTime[] = [
  {
    id: 'block-1',
    mentorId: 'mentor-1',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    allDay: true,
    reason: 'Holiday',
  },
  {
    id: 'block-2',
    mentorId: 'mentor-1',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    startTime: '09:00',
    endTime: '12:00',
    allDay: false,
    reason: 'Doctor appointment',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    mentorId: 'mentor-1',
    clientId: 'client-1',
    clientName: 'Sarah Johnson',
    scheduledAt: new Date(),
    durationMinutes: 60,
    status: 'scheduled',
    notes: '1:1 Training - Leg day focus',
  },
  {
    id: 'booking-2',
    mentorId: 'mentor-1',
    clientId: 'client-2',
    clientName: 'Michael Chen',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    durationMinutes: 60,
    status: 'scheduled',
    notes: 'Progress review',
    calendarEventId: 'zoom-123456789',
  },
  {
    id: 'booking-3',
    mentorId: 'mentor-1',
    clientId: 'client-5',
    clientName: 'Lisa Park',
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    durationMinutes: 45,
    status: 'scheduled',
    notes: 'Nutrition consultation',
  },
  {
    id: 'booking-4',
    mentorId: 'mentor-1',
    clientId: 'client-4',
    clientName: 'David Thompson',
    scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    durationMinutes: 60,
    status: 'completed',
    notes: 'Marathon training review',
  },
];
