// 募集投稿データベース - BUSINESS_LOGIC.mdとAPI.mdの仕様に基づく実装

export interface SalonInfo {
  name: string;
  location: string;
  station: string;
  distance: number;
  phone?: string;
}

export interface AssistantInfo {
  id: string;
  name: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  avatar?: string;
  salon: SalonInfo;
}

export interface RecruitmentPost {
  id: string;
  assistantId: string;
  title: string;
  description: string;
  services: string[];
  duration: number; // 分
  price: number; // カットモデルが支払う料金
  originalPrice: number; // 通常料金
  discount: number; // 割引率（%）
  
  // 募集条件
  requirements: string[];
  modelCount: number; // 必要人数
  appliedCount: number; // 現在の応募数
  
  // 日程・場所
  availableDates: string[];
  availableTimes: string[];
  salon: SalonInfo;
  
  // ステータス
  status: 'recruiting' | 'full' | 'closed';
  urgency: 'normal' | 'urgent';
  
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  postId: string;
  customerId: string;
  assistantId: string;
  
  // 応募内容
  message: string;
  photos: string[];
  availableTimes: string[];
  
  // 追加情報
  additionalInfo: {
    hairLength?: string;
    previousTreatments?: string;
    allergies?: string;
  };
  
  // ステータス
  status: 'pending' | 'accepted' | 'rejected';
  reviewedAt?: string;
  feedback?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  applicationId: string;
  customerId: string;
  assistantId: string;
  postId: string;
  
  // 予約詳細
  scheduledDate: string;
  duration: number;
  services: string[];
  totalPrice: number;
  
  // 場所情報
  salon: SalonInfo;
  
  // ステータス管理
  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  
  // レビュー
  customerReview?: {
    rating: number;
    comment: string;
    serviceQuality: number;
    communication: number;
    cleanliness: number;
    photos?: string[];
  };
  assistantReview?: {
    rating: number;
    comment: string;
    cooperation: number;
    punctuality: number;
  };
  
  createdAt: string;
  updatedAt: string;
}

class RecruitmentDatabase {
  private posts: Map<string, RecruitmentPost> = new Map();
  private applications: Map<string, Application> = new Map();
  private bookings: Map<string, Booking> = new Map();
  
  constructor() {
    this.initializeMockData();
  }
  
  private initializeMockData() {
    const sampleSalon: SalonInfo = {
      name: 'Hair Salon TOKYO',
      location: '東京都渋谷区神南1-1-1',
      station: '渋谷駅',
      distance: 0.3,
      phone: '03-1234-5678'
    };
    
    const mockPosts: RecruitmentPost[] = [
      {
        id: 'post_1',
        assistantId: 'user_1',
        title: 'ボブカット練習モデル募集',
        description: 'ボブスタイルの技術向上のため、練習台をお願いします。丁寧にカットさせていただきます。初回の方も歓迎です。',
        services: ['カット'],
        duration: 90,
        price: 1500,
        originalPrice: 3000,
        discount: 50,
        requirements: ['肩より長い髪', 'ダメージが少ない髪', '2時間程度お時間いただける方'],
        modelCount: 3,
        appliedCount: 1,
        availableDates: ['2024-02-10', '2024-02-11', '2024-02-12'],
        availableTimes: ['10:00-11:30', '14:00-15:30', '16:00-17:30'],
        salon: sampleSalon,
        status: 'recruiting',
        urgency: 'normal',
        createdAt: '2024-02-05T09:00:00Z',
        updatedAt: '2024-02-05T09:00:00Z'
      },
      {
        id: 'post_2',
        assistantId: 'user_1',
        title: 'グラデーションカラー練習募集',
        description: 'カラー技術の向上のため、グラデーションカラーのモデルを募集します。ブリーチが必要になりますが、丁寧に施術いたします。',
        services: ['カラー'],
        duration: 180,
        price: 3000,
        originalPrice: 8000,
        discount: 62,
        requirements: ['ブリーチ可能な方', '4時間程度お時間いただける方', '明るいカラーに興味のある方'],
        modelCount: 2,
        appliedCount: 0,
        availableDates: ['2024-02-15', '2024-02-16'],
        availableTimes: ['13:00-17:00'],
        salon: sampleSalon,
        status: 'recruiting',
        urgency: 'urgent',
        createdAt: '2024-02-08T10:30:00Z',
        updatedAt: '2024-02-08T10:30:00Z'
      }
    ];
    
    const mockApplications: Application[] = [
      {
        id: 'app_1',
        postId: 'post_1',
        customerId: 'user_2',
        assistantId: 'user_1',
        message: 'ボブスタイルに挑戦してみたいです。よろしくお願いします。',
        photos: [],
        availableTimes: ['10:00-11:30', '16:00-17:30'],
        additionalInfo: {
          hairLength: '肩下10cm',
          previousTreatments: '3ヶ月前にカラー',
          allergies: 'なし'
        },
        status: 'pending',
        createdAt: '2024-02-06T14:30:00Z',
        updatedAt: '2024-02-06T14:30:00Z'
      }
    ];
    
    mockPosts.forEach(post => this.posts.set(post.id, post));
    mockApplications.forEach(app => this.applications.set(app.id, app));
  }
  
  // 募集投稿CRUD
  async findPostById(id: string): Promise<RecruitmentPost | null> {
    return this.posts.get(id) || null;
  }
  
  async findPosts(filters?: {
    assistantId?: string;
    services?: string[];
    location?: string;
    priceMax?: number;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ posts: RecruitmentPost[], total: number }> {
    let filteredPosts = Array.from(this.posts.values());
    
    if (filters?.assistantId) {
      filteredPosts = filteredPosts.filter(post => post.assistantId === filters.assistantId);
    }
    
    if (filters?.services?.length) {
      filteredPosts = filteredPosts.filter(post =>
        post.services.some(service => filters.services!.includes(service))
      );
    }
    
    if (filters?.location) {
      filteredPosts = filteredPosts.filter(post =>
        post.salon.location.includes(filters.location!) ||
        post.salon.station.includes(filters.location!)
      );
    }
    
    if (filters?.priceMax) {
      filteredPosts = filteredPosts.filter(post => post.price <= filters.priceMax!);
    }
    
    if (filters?.status) {
      filteredPosts = filteredPosts.filter(post => post.status === filters.status);
    }
    
    // ページネーション
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    return {
      posts: paginatedPosts,
      total: filteredPosts.length
    };
  }
  
  async createPost(postData: Omit<RecruitmentPost, 'id' | 'appliedCount' | 'createdAt' | 'updatedAt'>): Promise<RecruitmentPost> {
    const id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newPost: RecruitmentPost = {
      id,
      appliedCount: 0,
      createdAt: now,
      updatedAt: now,
      ...postData
    };
    
    this.posts.set(id, newPost);
    return newPost;
  }
  
  async updatePost(id: string, updates: Partial<Omit<RecruitmentPost, 'id' | 'createdAt'>>): Promise<RecruitmentPost | null> {
    const post = this.posts.get(id);
    if (!post) return null;
    
    const updatedPost: RecruitmentPost = {
      ...post,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.posts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deletePost(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }
  
  // 応募CRUD
  async findApplicationById(id: string): Promise<Application | null> {
    return this.applications.get(id) || null;
  }
  
  async findApplicationsByPost(postId: string): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(app => app.postId === postId);
  }
  
  async findApplicationsByCustomer(customerId: string): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(app => app.customerId === customerId);
  }
  
  async createApplication(appData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application> {
    const id = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newApplication: Application = {
      id,
      createdAt: now,
      updatedAt: now,
      ...appData
    };
    
    this.applications.set(id, newApplication);
    
    // 募集投稿の応募数を更新
    const post = this.posts.get(appData.postId);
    if (post) {
      post.appliedCount++;
      this.posts.set(post.id, post);
    }
    
    return newApplication;
  }
  
  async updateApplication(id: string, updates: Partial<Omit<Application, 'id' | 'createdAt'>>): Promise<Application | null> {
    const application = this.applications.get(id);
    if (!application) return null;
    
    const updatedApplication: Application = {
      ...application,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }
  
  // 予約CRUD
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newBooking: Booking = {
      id,
      createdAt: now,
      updatedAt: now,
      ...bookingData
    };
    
    this.bookings.set(id, newBooking);
    return newBooking;
  }
  
  async findBookingsByUser(userId: string, userType: 'customer' | 'assistant'): Promise<Booking[]> {
    const field = userType === 'customer' ? 'customerId' : 'assistantId';
    return Array.from(this.bookings.values()).filter(booking => booking[field] === userId);
  }
  
  async updateBooking(id: string, updates: Partial<Omit<Booking, 'id' | 'createdAt'>>): Promise<Booking | null> {
    const booking = this.bookings.get(id);
    if (!booking) return null;
    
    const updatedBooking: Booking = {
      ...booking,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
}

// シングルトンインスタンス
export const recruitmentDb = new RecruitmentDatabase();