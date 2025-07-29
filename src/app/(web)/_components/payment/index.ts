// Payment components exports
export { default as PaymentForm } from './PaymentForm';
export { default as PaymentHistory } from './PaymentHistory';

// Payment-related types
export interface PaymentFormProps {
  applicationId: string;
  assistantId: string;
  amount: number;
  serviceName: string;
  onSuccess?: (payment: any) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export interface PaymentHistoryProps {
  userType: 'customer' | 'assistant';
  limit?: number;
  showActions?: boolean;
}