import type { MentorProfile, Booking, ReferralLink } from '../types';

export const mockMentorProfile: MentorProfile = {
  id: 'mentor-profile-1',
  userId: 'mentor-1',
  displayName: 'Coach Alex',
  specializations: ['Strength Training', 'Nutrition', 'Weight Loss'],
  certifications: ['NASM-CPT', 'Precision Nutrition L1'],
  bio: 'Helping clients transform their lives through sustainable fitness and nutrition.',
  hourlyRate: 75,
  availability: { 
    monday: ['9:00', '17:00'], 
    tuesday: ['9:00', '17:00'],
    wednesday: ['9:00', '17:00'],
    thursday: ['9:00', '17:00'],
    friday: ['9:00', '15:00']
  },
  referralCode: 'coach-alex-123',
  avatarUrl: '',
  createdAt: new Date('2023-06-01')
};

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    mentorId: 'mentor-1',
    clientId: 'client-1',
    clientName: 'Sarah Johnson',
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    durationMinutes: 60,
    status: 'scheduled',
    notes: 'Focus on squat form and nutrition review'
  },
  {
    id: 'booking-2',
    mentorId: 'mentor-1',
    clientId: 'client-2',
    clientName: 'Michael Chen',
    scheduledAt: new Date(Date.now() + 26 * 60 * 60 * 1000),
    durationMinutes: 45,
    status: 'scheduled',
    notes: 'Monthly progress check-in'
  },
  {
    id: 'booking-3',
    mentorId: 'mentor-1',
    clientId: 'client-4',
    clientName: 'David Thompson',
    scheduledAt: new Date(Date.now() + 50 * 60 * 60 * 1000),
    durationMinutes: 30,
    status: 'scheduled',
    notes: 'Marathon training review'
  },
  {
    id: 'booking-4',
    mentorId: 'mentor-1',
    clientId: 'client-5',
    clientName: 'Lisa Park',
    scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    durationMinutes: 60,
    status: 'completed',
    notes: 'Completed - Adjusted workout schedule'
  },
  {
    id: 'booking-5',
    mentorId: 'mentor-1',
    clientId: 'client-3',
    clientName: 'Emily Rodriguez',
    scheduledAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    durationMinutes: 45,
    status: 'no_show',
    notes: 'Client did not attend - follow up needed'
  }
];

export const mockReferralLink: ReferralLink = {
  id: 'referral-1',
  mentorId: 'mentor-1',
  code: 'coach-alex-123',
  clickCount: 142,
  conversions: 23,
  createdAt: new Date('2024-01-01')
};
