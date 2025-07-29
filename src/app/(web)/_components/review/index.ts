// Review components exports
export { default as ReviewForm } from './ReviewForm';
export { default as ReviewCard } from './ReviewCard';
export { default as ReviewStats } from './ReviewStats';

// Review-related types
export interface ReviewFormProps {
  bookingId: string;
  assistantId: string;
  assistantName: string;
  serviceName: string;
  onSuccess?: (review: any) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    title: string;
    comment: string;
    photos?: string[];
    tags: string[];
    categories: {
      technical: number;
      communication: number;
      cleanliness: number;
      timeliness: number;
      atmosphere: number;
    };
    isRecommended: boolean;
    serviceExperience: string;
    wouldBookAgain: boolean;
    helpfulCount: number;
    createdAt: string;
    customerId: string;
    customerName?: string;
    isVerified: boolean;
  };
  responses?: Array<{
    id: string;
    assistantId: string;
    assistantName?: string;
    response: string;
    createdAt: string;
  }>;
  showActions?: boolean;
  currentUserId?: string;
  onHelpfulClick?: (reviewId: string, isHelpful: boolean) => void;
  onResponseClick?: (reviewId: string) => void;
}

export interface ReviewStatsProps {
  assistantId: string;
  compact?: boolean;
}