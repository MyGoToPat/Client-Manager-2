import type { ReferralLink } from '../types';
import { mockReferralLink } from '../mocks/mentors.mock';

export interface ReferralsService {
  getReferralLink(mentorId: string): Promise<ReferralLink>;
  regenerateCode(mentorId: string): Promise<ReferralLink>;
}

let referralData = { ...mockReferralLink };

export const referralsService: ReferralsService = {
  async getReferralLink(_mentorId: string): Promise<ReferralLink> {
    await new Promise(r => setTimeout(r, 300));
    return referralData;
  },

  async regenerateCode(_mentorId: string): Promise<ReferralLink> {
    await new Promise(r => setTimeout(r, 400));
    referralData = {
      ...referralData,
      code: 'coach-alex-' + Math.random().toString(36).substring(7),
      createdAt: new Date()
    };
    return referralData;
  }
};
