// レビュー・評価システム用データベースモデル

export interface Review {
  id: string;
  bookingId: string; // 予約・施術のID
  assistantId: string;
  customerId: string;
  rating: number; // 1-5の評価
  title: string;
  comment: string;
  photos?: string[]; // 施術後の写真
  tags: string[]; // 評価タグ（技術力、接客、清潔感など）
  categories: {
    technical: number; // 技術力 (1-5)
    communication: number; // コミュニケーション (1-5)
    cleanliness: number; // 清潔感 (1-5)
    timeliness: number; // 時間厳守 (1-5)
    atmosphere: number; // 雰囲気 (1-5)
  };
  isRecommended: boolean; // おすすめするかどうか
  serviceExperience: 'excellent' | 'good' | 'average' | 'poor'; // 総合体験
  wouldBookAgain: boolean; // また利用したいか
  isPublic: boolean; // 公開するかどうか
  isVerified: boolean; // 認証済みレビューか
  helpfulCount: number; // 役に立ったカウント
  reportCount: number; // 報告回数
  status: 'pending' | 'published' | 'hidden' | 'reported';
  moderatedBy?: string; // モデレーター
  moderatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  assistantId: string;
  response: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewHelpful {
  id: string;
  reviewId: string;
  userId: string;
  isHelpful: boolean; // true: helpful, false: not helpful
  createdAt: string;
}

export interface ReviewReport {
  id: string;
  reviewId: string;
  reportedBy: string;
  reason: 'inappropriate' | 'fake' | 'spam' | 'offensive' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface ReviewStats {
  assistantId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  categoryAverages: {
    technical: number;
    communication: number;
    cleanliness: number;
    timeliness: number;
    atmosphere: number;
  };
  recommendationRate: number; // おすすめ率
  repeatCustomerRate: number; // リピート率
  lastUpdated: string;
}

export interface ReviewFilter {
  assistantId?: string;
  customerId?: string;
  rating?: number;
  minRating?: number;
  maxRating?: number;
  tags?: string[];
  isPublic?: boolean;
  isVerified?: boolean;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'rating' | 'helpful';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// インメモリデータストア（本番では実際のデータベースを使用）
class ReviewDatabase {
  private reviews: Map<string, Review> = new Map();
  private responses: Map<string, ReviewResponse> = new Map();
  private helpful: Map<string, ReviewHelpful> = new Map();
  private reports: Map<string, ReviewReport> = new Map();
  private stats: Map<string, ReviewStats> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // 初期データをセットアップ
    const sampleReview: Review = {
      id: '1',
      bookingId: 'booking1',
      assistantId: 'assistant1',
      customerId: 'customer1',
      rating: 5,
      title: '丁寧で技術力の高いアシスタントさんでした！',
      comment: '初めてのカットモデルでしたが、とても丁寧にカウンセリングしていただき、理想通りの仕上がりになりました。技術力も高く、また機会があればお願いしたいです。',
      photos: ['/images/review1.jpg'],
      tags: ['技術力', '丁寧', 'カウンセリング'],
      categories: {
        technical: 5,
        communication: 5,
        cleanliness: 4,
        timeliness: 5,
        atmosphere: 4
      },
      isRecommended: true,
      serviceExperience: 'excellent',
      wouldBookAgain: true,
      isPublic: true,
      isVerified: true,
      helpfulCount: 3,
      reportCount: 0,
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const sampleStats: ReviewStats = {
      assistantId: 'assistant1',
      totalReviews: 25,
      averageRating: 4.6,
      ratingDistribution: {
        5: 15,
        4: 7,
        3: 2,
        2: 1,
        1: 0
      },
      categoryAverages: {
        technical: 4.5,
        communication: 4.7,
        cleanliness: 4.4,
        timeliness: 4.6,
        atmosphere: 4.3
      },
      recommendationRate: 0.88,
      repeatCustomerRate: 0.34,
      lastUpdated: new Date().toISOString()
    };

    this.reviews.set(sampleReview.id, sampleReview);
    this.stats.set(sampleStats.assistantId, sampleStats);
  }

  // Reviews
  async createReview(data: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount' | 'reportCount'>): Promise<Review> {
    const id = Date.now().toString();
    const review: Review = {
      ...data,
      id,
      helpfulCount: 0,
      reportCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.reviews.set(id, review);
    await this.updateStats(data.assistantId);
    return review;
  }

  async getReview(id: string): Promise<Review | null> {
    return this.reviews.get(id) || null;
  }

  async getReviews(filters: ReviewFilter = {}): Promise<{ reviews: Review[]; total: number }> {
    let reviews = Array.from(this.reviews.values());

    // フィルタリング
    if (filters.assistantId) {
      reviews = reviews.filter(r => r.assistantId === filters.assistantId);
    }
    if (filters.customerId) {
      reviews = reviews.filter(r => r.customerId === filters.customerId);
    }
    if (filters.rating) {
      reviews = reviews.filter(r => r.rating === filters.rating);
    }
    if (filters.minRating) {
      reviews = reviews.filter(r => r.rating >= filters.minRating!);
    }
    if (filters.maxRating) {
      reviews = reviews.filter(r => r.rating <= filters.maxRating!);
    }
    if (filters.isPublic !== undefined) {
      reviews = reviews.filter(r => r.isPublic === filters.isPublic);
    }
    if (filters.isVerified !== undefined) {
      reviews = reviews.filter(r => r.isVerified === filters.isVerified);
    }
    if (filters.status) {
      reviews = reviews.filter(r => r.status === filters.status);
    }
    if (filters.tags && filters.tags.length > 0) {
      reviews = reviews.filter(r => 
        filters.tags!.some(tag => r.tags.includes(tag))
      );
    }

    // ソート
    const sortBy = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';
    
    reviews.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'helpful':
          aValue = a.helpfulCount;
          bValue = b.helpfulCount;
          break;
        case 'date':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    const total = reviews.length;

    // ページネーション
    if (filters.page && filters.limit) {
      const startIndex = (filters.page - 1) * filters.limit;
      reviews = reviews.slice(startIndex, startIndex + filters.limit);
    }

    return { reviews, total };
  }

  async updateReview(id: string, updates: Partial<Review>): Promise<Review | null> {
    const existing = this.reviews.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.reviews.set(id, updated);
    
    if (updates.rating !== undefined) {
      await this.updateStats(existing.assistantId);
    }
    
    return updated;
  }

  async deleteReview(id: string): Promise<boolean> {
    const review = this.reviews.get(id);
    if (!review) return false;

    this.reviews.delete(id);
    await this.updateStats(review.assistantId);
    return true;
  }

  // Review responses
  async createResponse(data: Omit<ReviewResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReviewResponse> {
    const id = Date.now().toString();
    const response: ReviewResponse = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.responses.set(id, response);
    return response;
  }

  async getResponsesByReviewId(reviewId: string): Promise<ReviewResponse[]> {
    return Array.from(this.responses.values())
      .filter(r => r.reviewId === reviewId);
  }

  // Helpful votes
  async toggleHelpful(reviewId: string, userId: string, isHelpful: boolean): Promise<void> {
    const existingKey = `${reviewId}_${userId}`;
    const existing = this.helpful.get(existingKey);

    if (existing) {
      if (existing.isHelpful === isHelpful) {
        // 同じ評価なら削除
        this.helpful.delete(existingKey);
      } else {
        // 評価を変更
        existing.isHelpful = isHelpful;
      }
    } else {
      // 新規追加
      this.helpful.set(existingKey, {
        id: existingKey,
        reviewId,
        userId,
        isHelpful,
        createdAt: new Date().toISOString()
      });
    }

    // レビューのhelpfulCountを更新
    const review = this.reviews.get(reviewId);
    if (review) {
      const helpfulVotes = Array.from(this.helpful.values())
        .filter(h => h.reviewId === reviewId && h.isHelpful);
      
      review.helpfulCount = helpfulVotes.length;
      this.reviews.set(reviewId, review);
    }
  }

  // Reports
  async createReport(data: Omit<ReviewReport, 'id' | 'createdAt'>): Promise<ReviewReport> {
    const id = Date.now().toString();
    const report: ReviewReport = {
      ...data,
      id,
      createdAt: new Date().toISOString()
    };
    this.reports.set(id, report);

    // レビューのreportCountを更新
    const review = this.reviews.get(data.reviewId);
    if (review) {
      review.reportCount++;
      this.reviews.set(data.reviewId, review);
    }

    return report;
  }

  // Stats
  async getStats(assistantId: string): Promise<ReviewStats | null> {
    return this.stats.get(assistantId) || null;
  }

  private async updateStats(assistantId: string): Promise<void> {
    const reviews = Array.from(this.reviews.values())
      .filter(r => r.assistantId === assistantId && r.status === 'published');

    if (reviews.length === 0) {
      this.stats.delete(assistantId);
      return;
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      ratingDistribution[r.rating as keyof typeof ratingDistribution]++;
    });

    const categoryAverages = {
      technical: reviews.reduce((sum, r) => sum + r.categories.technical, 0) / totalReviews,
      communication: reviews.reduce((sum, r) => sum + r.categories.communication, 0) / totalReviews,
      cleanliness: reviews.reduce((sum, r) => sum + r.categories.cleanliness, 0) / totalReviews,
      timeliness: reviews.reduce((sum, r) => sum + r.categories.timeliness, 0) / totalReviews,
      atmosphere: reviews.reduce((sum, r) => sum + r.categories.atmosphere, 0) / totalReviews
    };

    const recommendationRate = reviews.filter(r => r.isRecommended).length / totalReviews;
    const repeatCustomerRate = reviews.filter(r => r.wouldBookAgain).length / totalReviews;

    const stats: ReviewStats = {
      assistantId,
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      categoryAverages: {
        technical: Math.round(categoryAverages.technical * 10) / 10,
        communication: Math.round(categoryAverages.communication * 10) / 10,
        cleanliness: Math.round(categoryAverages.cleanliness * 10) / 10,
        timeliness: Math.round(categoryAverages.timeliness * 10) / 10,
        atmosphere: Math.round(categoryAverages.atmosphere * 10) / 10
      },
      recommendationRate: Math.round(recommendationRate * 100) / 100,
      repeatCustomerRate: Math.round(repeatCustomerRate * 100) / 100,
      lastUpdated: new Date().toISOString()
    };

    this.stats.set(assistantId, stats);
  }
}

export const reviewDb = new ReviewDatabase();