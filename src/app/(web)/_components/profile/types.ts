// TypeScript interfaces for profile components

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';
export type PostStatus = 'active' | 'closed' | 'completed';
export type BookingStatus = 'completed' | 'upcoming';
export type JobType = 'full-time' | 'part-time' | 'contract';
export type ServiceType = 'cut' | 'color' | 'perm' | 'treatment' | 'straightening' | 'styling';

export interface Application {
  id: number;
  jobTitle: string;
  salon: string;
  location: string;
  appliedDate: string;
  status: ApplicationStatus;
  jobType?: JobType;  // Made optional for backward compatibility
  salary?: string;    // Made optional for backward compatibility
  description: string;
  requirements: string[];
  workingHours: string;
  daysPerWeek: string;
}

export interface RecruitmentPost {
  id: number;
  title: string;
  description: string;
  serviceType: ServiceType;
  price: string;
  duration: string;
  location: string;
  requirements: string[];
  availableDates: string[];
  timeSlots: string[];
  maxParticipants: number;
  currentApplications: number;
  status: PostStatus;
  postedDate: string;
  tags: string[];
}

export interface Booking {
  id: number;
  date: string;
  customer: string;
  service: string;
  price: string;
  status: BookingStatus;
  rating?: number;
  review?: string;
}

export interface StatusConfig {
  color: string;
  text: string;
  dotColor?: string;
}

export interface StatusMappings {
  [key: string]: StatusConfig;
}

export interface TagVariant {
  background: string;
  text: string;
}

export interface EmptyStateConfig {
  icon: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}