export interface ReviewRatingCriteria {
  technicalDepth: number; // 1-5
  communication: number; // 1-5
  valueDelivered: number; // 1-5
  overallSatisfaction: number; // 1-5
}

export interface SessionReview {
  id: string;
  bookingId: string;
  mentorId: string;
  menteeId: string;
  menteeName: string;
  menteeTitle?: string;
  ratings: ReviewRatingCriteria;
  averageRating: number;
  comment: string;
  mentorReply?: string;
  isEscrowVerified: boolean;
  isAnonymous: boolean;
  createdAt: string;
}
