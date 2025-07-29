// Admin Dashboard Types

export interface DashboardStats {
  totalUsers: {
    count: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  };
  totalAssistants: {
    count: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  };
  totalBookings: {
    count: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  };
  totalRevenue: {
    amount: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  };
  activeReports: {
    count: number;
    urgent: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'assistant' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: string;
  lastActive: string;
  profileImage?: string;
  bookingsCount?: number;
  rating?: number;
  revenue?: number;
}

export interface ActivityLog {
  id: string;
  type: 'user_registration' | 'booking_created' | 'payment_completed' | 'report_filed' | 'review_posted';
  description: string;
  user: {
    id: string;
    name: string;
    type: 'customer' | 'assistant';
  };
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface RecruitmentPost {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  status: 'active' | 'paused' | 'expired' | 'reported' | 'removed';
  createdAt: string;
  expiresAt: string;
  applications: number;
  reports: number;
  category: string;
  location: string;
  salary: {
    min: number;
    max: number;
    type: 'hourly' | 'daily' | 'monthly';
  };
}

export interface Review {
  id: string;
  assistantId: string;
  assistantName: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'published' | 'pending' | 'flagged' | 'removed';
  reports: number;
  helpful: number;
  response?: {
    text: string;
    createdAt: string;
  };
}

export interface Report {
  id: string;
  type: 'user' | 'post' | 'review' | 'message';
  targetId: string;
  targetType: string;
  reporterId: string;
  reporterName: string;
  reason: 'spam' | 'inappropriate' | 'harassment' | 'fake' | 'other';
  description: string;
  createdAt: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  assistantId: string;
  assistantName: string;
  amount: number;
  platformFee: number;
  assistantEarnings: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed';
  method: 'credit_card' | 'bank_transfer' | 'digital_wallet';
  createdAt: string;
  processedAt?: string;
  refundRequested?: boolean;
  refundedAt?: string;
}

export interface SystemSettings {
  platformFeeRate: number;
  minBookingAmount: number;
  maxBookingAmount: number;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  paymentProcessingEnabled: boolean;
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  autoApprovalEnabled: boolean;
  maxReportsBeforeAutoSuspension: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}