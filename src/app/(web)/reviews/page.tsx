'use client'

import { useState, useEffect } from 'react';
import ReviewCard from '../_components/review/ReviewCard';

// Mock data and types
interface Review {
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
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    rating: 5,
    title: '技術力が高く、とても丁寧でした！',
    comment: 'カウンセリングから仕上がりまで、とても満足できました。アシスタントの方でしたが、ベテランのような安定した技術で安心してお任せできました。次回もぜひお願いしたいです。',
    photos: [],
    tags: ['技術力', '丁寧', 'また利用したい'],
    categories: {
      technical: 5,
      communication: 5,
      cleanliness: 5,
      timeliness: 5,
      atmosphere: 5
    },
    isRecommended: true,
    serviceExperience: 'excellent',
    wouldBookAgain: true,
    helpfulCount: 12,
    createdAt: '2024-01-20T10:00:00Z',
    customerId: 'customer1',
    customerName: '佐藤 美咲',
    isVerified: true
  },
  {
    id: '2',
    rating: 4,
    title: 'コスパが良くて満足です',
    comment: 'アシスタント美容師ということで最初は不安でしたが、とても上手で驚きました。通常料金の半額程度で同じレベルのサービスを受けられるのは嬉しいです。',
    photos: [],
    tags: ['コスパ', '技術力', '親切'],
    categories: {
      technical: 4,
      communication: 4,
      cleanliness: 4,
      timeliness: 5,
      atmosphere: 4
    },
    isRecommended: true,
    serviceExperience: 'good',
    wouldBookAgain: true,
    helpfulCount: 8,
    createdAt: '2024-01-18T14:30:00Z',
    customerId: 'customer2',
    customerName: '田中 花子',
    isVerified: true
  },
  {
    id: '3',
    rating: 3,
    title: '練習モデルとしては良い経験でした',
    comment: 'アシスタントの練習ということで時間はかかりましたが、その分丁寧にやっていただけました。仕上がりは普通でしたが、価格を考えると妥当だと思います。',
    photos: [],
    tags: ['時間厳守', '丁寧'],
    categories: {
      technical: 3,
      communication: 4,
      cleanliness: 4,
      timeliness: 3,
      atmosphere: 4
    },
    isRecommended: false,
    serviceExperience: 'average',
    wouldBookAgain: false,
    helpfulCount: 3,
    createdAt: '2024-01-15T16:00:00Z',
    customerId: 'customer3',
    customerName: '山田 太郎',
    isVerified: false
  }
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    rating: '',
    sortBy: 'date',
    sortOrder: 'desc',
    isVerified: '',
    page: 1
  });
  const [pagination, setPagination] = useState({ current: 1, total: 1, totalCount: 0 });

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock API response simulation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      let filteredReviews = [...MOCK_REVIEWS];
      
      // Apply rating filter
      if (filters.rating) {
        const ratingFilter = parseInt(filters.rating);
        filteredReviews = filteredReviews.filter(review => review.rating === ratingFilter);
      }
      
      // Apply verified filter
      if (filters.isVerified !== '') {
        const verifiedFilter = filters.isVerified === 'true';
        filteredReviews = filteredReviews.filter(review => review.isVerified === verifiedFilter);
      }
      
      // Apply sorting
      filteredReviews.sort((a, b) => {
        if (filters.sortBy === 'rating') {
          return filters.sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
        } else if (filters.sortBy === 'helpful') {
          return filters.sortOrder === 'desc' ? b.helpfulCount - a.helpfulCount : a.helpfulCount - b.helpfulCount;
        } else {
          // Default to date sorting
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return filters.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        }
      });
      
      setReviews(filteredReviews);
      setPagination({ current: 1, total: 1, totalCount: filteredReviews.length });
    } catch (err) {
      setError('レビューの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // フィルター変更時はページを1に戻す
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleHelpfulClick = async (reviewId: string, isHelpful: boolean) => {
    try {
      // Mock helpful vote functionality
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
      
      // Update the review's helpful count
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpfulCount: review.helpfulCount + (isHelpful ? 1 : -1) }
          : review
      ));
    } catch (error) {
      console.error('役に立った投票エラー:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">みんなのレビュー</h1>
          <p className="text-gray-600">アシスタント美容師のサービスに対するお客様からのレビューをご覧いただけます。</p>
        </div>

        {/* フィルターバー */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">評価</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              >
                <option value="">すべて</option>
                <option value="5">★★★★★ (5)</option>
                <option value="4">★★★★☆ (4)</option>
                <option value="3">★★★☆☆ (3)</option>
                <option value="2">★★☆☆☆ (2)</option>
                <option value="1">★☆☆☆☆ (1)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">認証</label>
              <select
                value={filters.isVerified}
                onChange={(e) => handleFilterChange('isVerified', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              >
                <option value="">すべて</option>
                <option value="true">認証済みのみ</option>
                <option value="false">未認証も含む</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">並び順</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              >
                <option value="date">投稿日順</option>
                <option value="rating">評価順</option>
                <option value="helpful">役に立った順</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">順序</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              >
                <option value="desc">新しい順</option>
                <option value="asc">古い順</option>
              </select>
            </div>
          </div>
        </div>

        {/* 結果表示 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {loading ? '検索中...' : `${pagination.totalCount}件のレビューが見つかりました`}
          </p>
        </div>

        {/* レビュー一覧 */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="flex space-x-1 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">{error}</p>
            <button
              onClick={fetchReviews}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              再試行
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">レビューが見つかりません</h3>
            <p className="text-gray-600">
              検索条件を変更してお試しください。
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpfulClick={handleHelpfulClick}
                showActions={true}
              />
            ))}
          </div>
        )}

        {/* ページネーション */}
        {pagination.total > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current <= 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                前へ
              </button>
              
              {Array.from({ length: Math.min(5, pagination.total) }, (_, i) => {
                const pageNum = i + Math.max(1, pagination.current - 2);
                if (pageNum > pagination.total) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      pageNum === pagination.current
                        ? 'bg-pink-500 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current >= pagination.total}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                次へ
              </button>
            </div>
          </div>
        )}

        {/* 注意事項 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">レビューについて</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                表示されているレビューは、実際にサービスをご利用いただいたお客様からの投稿です。
                認証済みマークが付いているレビューは、予約・決済履歴に基づいて確認済みのものです。
                不適切な内容を発見された場合は、お気軽にお問い合わせください。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}