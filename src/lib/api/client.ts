// フロントエンド用APIクライアント
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

interface RecruitmentPost {
  id: string;
  title: string;
  description: string;
  assistant: {
    id: string;
    name: string;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    avatar?: string;
    salon: {
      name: string;
      location: string;
      station: string;
      distance: number;
    };
  };
  services: string[];
  duration: number;
  price: number;
  originalPrice: number;
  discount: number;
  requirements: string[];
  modelCount: number;
  appliedCount: number;
  availableDates: string[];
  availableTimes: string[];
  status: 'recruiting' | 'full' | 'closed';
  urgency: 'normal' | 'urgent';
  createdAt: string;
}

interface Application {
  id: string;
  post: {
    id: string;
    title: string;
    assistant: {
      name: string;
      salon: string;
    };
    price: number;
    duration: number;
  };
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  message?: string;
  feedback?: string;
}

interface SearchFilters {
  query?: string;
  services?: string[];
  location?: string;
  priceMax?: number;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

class ApiClient {
  private baseUrl = '/api';
  private token: string | null = null;

  constructor() {
    // ローカルストレージからトークンを取得
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as any).Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'APIエラーが発生しました',
          details: data.details,
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: 'ネットワークエラーが発生しました',
      };
    }
  }

  // 認証API
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    userType: 'stylist' | 'customer';
  }) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    const result = await this.request('/auth/logout', {
      method: 'POST',
    });
    this.clearToken();
    return result;
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  // 募集投稿API
  async searchRecruitmentPosts(filters: SearchFilters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v.toString()));
        } else {
          queryParams.set(key, value.toString());
        }
      }
    });

    return this.request<{
      posts: RecruitmentPost[];
      pagination: {
        current: number;
        total: number;
        totalCount: number;
      };
    }>(`/recruitment-posts?${queryParams.toString()}`);
  }

  async getRecruitmentPost(id: string) {
    return this.request<{ post: RecruitmentPost }>(`/recruitment-posts/${id}`);
  }

  async createRecruitmentPost(postData: {
    title: string;
    description: string;
    services: string[];
    duration: number;
    price: number;
    originalPrice: number;
    requirements: string[];
    modelCount: number;
    availableDates: string[];
    availableTimes: string[];
    salon: {
      name: string;
      location: string;
      station: string;
      distance: number;
      phone?: string;
    };
    urgency?: 'normal' | 'urgent';
  }) {
    return this.request<{ post: { id: string; title: string; status: string; createdAt: string } }>('/recruitment-posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updateRecruitmentPost(id: string, updates: Partial<any>) {
    return this.request<{ post: RecruitmentPost }>(`/recruitment-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteRecruitmentPost(id: string) {
    return this.request(`/recruitment-posts/${id}`, {
      method: 'DELETE',
    });
  }

  // 応募API
  async getApplications(filters: { status?: string; page?: number; limit?: number } = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.set(key, value.toString());
      }
    });

    return this.request<{
      applications: Application[];
      pagination: {
        current: number;
        total: number;
        totalCount: number;
      };
    }>(`/applications?${queryParams.toString()}`);
  }

  async createApplication(applicationData: {
    postId: string;
    message: string;
    photos?: string[];
    availableTimes: string[];
    additionalInfo?: {
      hairLength?: string;
      previousTreatments?: string;
      allergies?: string;
    };
  }) {
    return this.request<{
      application: {
        id: string;
        postId: string;
        status: string;
        appliedAt: string;
      };
    }>('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async updateApplicationStatus(id: string, updates: {
    status: 'pending' | 'accepted' | 'rejected';
    feedback?: string;
    scheduledDate?: string;
  }) {
    return this.request<{
      application: {
        id: string;
        status: string;
        feedback?: string;
        reviewedAt?: string;
        updatedAt: string;
      };
    }>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async withdrawApplication(id: string) {
    return this.request(`/applications/${id}`, {
      method: 'DELETE',
    });
  }

  // ユーザーAPI
  async getUserProfile(id: string) {
    return this.request<{ user: any }>(`/users/${id}`);
  }

  async updateUserProfile(id: string, updates: any) {
    return this.request<{ user: any }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // 決済API
  async getPayments(filters: { userType?: 'customer' | 'assistant'; status?: string; page?: number; limit?: number } = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.set(key, value.toString());
      }
    });

    return this.request<{
      payments: any[];
      pagination: {
        current: number;
        total: number;
        totalCount: number;
      };
    }>(`/payments?${queryParams.toString()}`);
  }

  async createPayment(paymentData: {
    applicationId: string;
    assistantId: string;
    amount: number;
    paymentMethodId: string;
    description?: string;
    metadata?: any;
  }) {
    return this.request<{
      payment: any;
      message: string;
    }>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getPayment(id: string) {
    return this.request<{
      payment: any;
      refunds: any[];
    }>(`/payments/${id}`);
  }

  async updatePaymentStatus(id: string, updates: {
    status: string;
    failureReason?: string;
  }) {
    return this.request<{
      payment: any;
      message: string;
    }>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // 決済方法API
  async getPaymentMethods() {
    return this.request<{
      paymentMethods: any[];
    }>('/payment-methods');
  }

  async createPaymentMethod(methodData: {
    type: 'credit_card' | 'bank_transfer' | 'digital_wallet';
    provider: 'stripe' | 'paypal' | 'bank';
    cardToken?: string;
    isDefault?: boolean;
  }) {
    return this.request<{
      paymentMethod: any;
      message: string;
    }>('/payment-methods', {
      method: 'POST',
      body: JSON.stringify(methodData),
    });
  }

  // 返金API
  async createRefund(refundData: {
    paymentId: string;
    amount: number;
    reason: 'customer_request' | 'service_cancelled' | 'quality_issue' | 'other';
    description?: string;
  }) {
    return this.request<{
      refund: any;
      message: string;
    }>('/refunds', {
      method: 'POST',
      body: JSON.stringify(refundData),
    });
  }

  async getRefunds(paymentId: string) {
    return this.request<{
      refunds: any[];
    }>(`/refunds?paymentId=${paymentId}`);
  }

  // レビューAPI
  async getReviews(filters: {
    assistantId?: string;
    customerId?: string;
    rating?: number;
    minRating?: number;
    maxRating?: number;
    isPublic?: boolean;
    isVerified?: boolean;
    status?: string;
    tags?: string[];
    sortBy?: 'date' | 'rating' | 'helpful';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  } = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          queryParams.set(key, value.join(','));
        } else {
          queryParams.set(key, value.toString());
        }
      }
    });

    return this.request<{
      reviews: any[];
      pagination: {
        current: number;
        total: number;
        totalCount: number;
      };
    }>(`/reviews?${queryParams.toString()}`);
  }

  async createReview(reviewData: {
    bookingId: string;
    assistantId: string;
    rating: number;
    title: string;
    comment: string;
    photos?: string[];
    tags?: string[];
    categories: {
      technical: number;
      communication: number;
      cleanliness: number;
      timeliness: number;
      atmosphere: number;
    };
    isRecommended?: boolean;
    serviceExperience?: 'excellent' | 'good' | 'average' | 'poor';
    wouldBookAgain?: boolean;
    isPublic?: boolean;
  }) {
    return this.request<{
      review: any;
      message: string;
    }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getReview(id: string) {
    return this.request<{
      review: any;
      responses: any[];
    }>(`/reviews/${id}`);
  }

  async updateReview(id: string, updates: any) {
    return this.request<{
      review: any;
      message: string;
    }>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteReview(id: string) {
    return this.request<{
      message: string;
    }>(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleReviewHelpful(reviewId: string, isHelpful: boolean) {
    return this.request<{
      review: any;
      message: string;
    }>(`/reviews/${reviewId}/helpful`, {
      method: 'POST',
      body: JSON.stringify({ isHelpful }),
    });
  }

  async createReviewResponse(reviewId: string, responseData: {
    response: string;
    isPublic?: boolean;
  }) {
    return this.request<{
      response: any;
      message: string;
    }>(`/reviews/${reviewId}/response`, {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
  }

  async getReviewResponses(reviewId: string) {
    return this.request<{
      responses: any[];
    }>(`/reviews/${reviewId}/response`);
  }

  async getReviewStats(assistantId: string) {
    return this.request<{
      stats: any;
    }>(`/reviews/stats/${assistantId}`);
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient();
export type { RecruitmentPost, Application, SearchFilters };