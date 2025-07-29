// 決済システム用データベースモデル

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'credit_card' | 'bank_transfer' | 'digital_wallet';
  provider: 'stripe' | 'paypal' | 'bank';
  cardLast4?: string;
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  applicationId: string;
  customerId: string;
  assistantId: string;
  amount: number;
  currency: 'JPY';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethodId: string;
  paymentIntentId?: string; // Stripe payment intent ID
  transactionId?: string;
  description: string;
  metadata: {
    recruitmentPostId: string;
    serviceName: string;
    serviceType: string;
    duration: number;
    scheduledDate: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failedAt?: string;
  failureReason?: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: 'customer_request' | 'service_cancelled' | 'quality_issue' | 'other';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  refundId?: string; // Stripe refund ID
  description?: string;
  requestedBy: string; // userId
  processedBy?: string; // admin userId
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Payout {
  id: string;
  assistantId: string;
  amount: number;
  currency: 'JPY';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payoutMethodId: string;
  payoutBatchId?: string;
  description: string;
  metadata: {
    period: string;
    paymentIds: string[];
    serviceFee: number;
    commission: number;
  };
  createdAt: string;
  updatedAt: string;
  scheduledAt: string;
  completedAt?: string;
}

export interface PaymentSettings {
  id: string;
  userId: string;
  userType: 'customer' | 'assistant';
  // Customer settings
  autoPayment: boolean;
  defaultPaymentMethodId?: string;
  // Assistant settings
  payoutSchedule: 'weekly' | 'biweekly' | 'monthly';
  minimumPayoutAmount: number;
  bankAccountId?: string;
  taxSettings: {
    taxIdNumber?: string;
    businessRegistration?: string;
    taxRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

// インメモリデータストア（本番では実際のデータベースを使用）
class PaymentDatabase {
  private payments: Map<string, Payment> = new Map();
  private paymentMethods: Map<string, PaymentMethod> = new Map();
  private refunds: Map<string, Refund> = new Map();
  private payouts: Map<string, Payout> = new Map();
  private settings: Map<string, PaymentSettings> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // 初期データをセットアップ
    const samplePaymentMethod: PaymentMethod = {
      id: '1',
      userId: 'user1',
      type: 'credit_card',
      provider: 'stripe',
      cardLast4: '4242',
      cardBrand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const samplePayment: Payment = {
      id: '1',
      applicationId: 'app1',
      customerId: 'user1',
      assistantId: 'user2',
      amount: 1500,
      currency: 'JPY',
      status: 'completed',
      paymentMethodId: '1',
      transactionId: 'txn_123',
      description: 'ボブカット練習モデル料金',
      metadata: {
        recruitmentPostId: 'post1',
        serviceName: 'ボブカット練習',
        serviceType: 'cut',
        duration: 90,
        scheduledDate: '2024-01-25T15:00:00Z'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    this.paymentMethods.set(samplePaymentMethod.id, samplePaymentMethod);
    this.payments.set(samplePayment.id, samplePayment);
  }

  // Payment methods
  async createPaymentMethod(data: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentMethod> {
    const id = Date.now().toString();
    const paymentMethod: PaymentMethod = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.paymentMethods.set(id, paymentMethod);
    return paymentMethod;
  }

  async getPaymentMethodsByUserId(userId: string): Promise<PaymentMethod[]> {
    return Array.from(this.paymentMethods.values())
      .filter(pm => pm.userId === userId && pm.isActive);
  }

  async updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod | null> {
    const existing = this.paymentMethods.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.paymentMethods.set(id, updated);
    return updated;
  }

  // Payments
  async createPayment(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const id = Date.now().toString();
    const payment: Payment = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.payments.set(id, payment);
    return payment;
  }

  async getPayment(id: string): Promise<Payment | null> {
    return this.payments.get(id) || null;
  }

  async getPaymentsByUserId(userId: string, userType: 'customer' | 'assistant'): Promise<Payment[]> {
    const filterKey = userType === 'customer' ? 'customerId' : 'assistantId';
    return Array.from(this.payments.values())
      .filter(payment => payment[filterKey] === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updatePaymentStatus(id: string, status: Payment['status'], metadata?: any): Promise<Payment | null> {
    const existing = this.payments.get(id);
    if (!existing) return null;

    const updates: Partial<Payment> = {
      status,
      updatedAt: new Date().toISOString(),
      ...metadata
    };

    if (status === 'completed') {
      updates.completedAt = new Date().toISOString();
    } else if (status === 'failed') {
      updates.failedAt = new Date().toISOString();
    }

    const updated = { ...existing, ...updates };
    this.payments.set(id, updated);
    return updated;
  }

  // Refunds
  async createRefund(data: Omit<Refund, 'id' | 'createdAt' | 'updatedAt'>): Promise<Refund> {
    const id = Date.now().toString();
    const refund: Refund = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.refunds.set(id, refund);
    return refund;
  }

  async getRefundsByPaymentId(paymentId: string): Promise<Refund[]> {
    return Array.from(this.refunds.values())
      .filter(refund => refund.paymentId === paymentId);
  }

  // Payouts
  async createPayout(data: Omit<Payout, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payout> {
    const id = Date.now().toString();
    const payout: Payout = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.payouts.set(id, payout);
    return payout;
  }

  async getPayoutsByAssistantId(assistantId: string): Promise<Payout[]> {
    return Array.from(this.payouts.values())
      .filter(payout => payout.assistantId === assistantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Payment settings
  async getPaymentSettings(userId: string): Promise<PaymentSettings | null> {
    return this.settings.get(userId) || null;
  }

  async updatePaymentSettings(userId: string, updates: Partial<PaymentSettings>): Promise<PaymentSettings> {
    const existing = this.settings.get(userId);
    const settings: PaymentSettings = existing ? {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    } : {
      id: userId,
      userId,
      userType: 'customer',
      autoPayment: false,
      payoutSchedule: 'monthly',
      minimumPayoutAmount: 1000,
      taxSettings: {
        taxRate: 0.1
      },
      ...updates,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.settings.set(userId, settings);
    return settings;
  }
}

export const paymentDb = new PaymentDatabase();