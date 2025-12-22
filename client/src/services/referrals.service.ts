import type { ReferralLink, MentorProfile } from '../types';
import { mockReferralLink, mockMentorProfile } from '../mocks/mentors.mock';
import { mockReferralLinks } from '../mocks/referrals.mock';

export interface ReferralsService {
  getReferralLink(mentorId: string): Promise<ReferralLink>;
  getReferralByCode(code: string): Promise<ReferralLink | null>;
  trackClick(code: string): Promise<void>;
  regenerateCode(mentorId: string): Promise<ReferralLink>;
  getMentorFromReferral(code: string): Promise<MentorProfile | null>;
}

let referralData = { ...mockReferralLink };
let referralsData = [...mockReferralLinks];

export const referralsService: ReferralsService = {
  async getReferralLink(_mentorId: string): Promise<ReferralLink> {
    await new Promise(r => setTimeout(r, 300));
    return referralData;
  },

  async getReferralByCode(code: string): Promise<ReferralLink | null> {
    await new Promise(r => setTimeout(r, 200));
    return referralsData.find(r => r.code === code) || null;
  },

  async trackClick(code: string): Promise<void> {
    await new Promise(r => setTimeout(r, 100));
    const link = referralsData.find(r => r.code === code);
    if (link) link.clickCount++;
  },

  async regenerateCode(_mentorId: string): Promise<ReferralLink> {
    await new Promise(r => setTimeout(r, 400));
    referralData = {
      ...referralData,
      code: 'coach-alex-' + Math.random().toString(36).substring(7),
      createdAt: new Date()
    };
    return referralData;
  },

  async getMentorFromReferral(code: string): Promise<MentorProfile | null> {
    await new Promise(r => setTimeout(r, 200));
    const ref = referralsData.find(r => r.code === code);
    if (!ref) return null;
    return mockMentorProfile;
  }
};
