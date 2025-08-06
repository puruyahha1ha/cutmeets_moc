'use client'

import { useState, useEffect } from 'react';

// Mock data and types
interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
  categoryAverages: {
    technical: number;
    communication: number;
    cleanliness: number;
    timeliness: number;
    atmosphere: number;
  };
  recommendationRate: number;
  repeatCustomerRate: number;
  lastUpdated: string;
}

const MOCK_REVIEW_STATS: ReviewStats = {
  averageRating: 4.6,
  totalReviews: 47,
  ratingDistribution: {
    '5': 28,
    '4': 12,
    '3': 5,
    '2': 2,
    '1': 0
  },
  categoryAverages: {
    technical: 4.5,
    communication: 4.8,
    cleanliness: 4.7,
    timeliness: 4.4,
    atmosphere: 4.6
  },
  recommendationRate: 0.89,
  repeatCustomerRate: 0.72,
  lastUpdated: '2024-01-20T10:00:00Z'
};

// Mock API client
const mockApiClient = {
  getReviewStats: async (assistantId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return {
      success: true,
      data: {
        stats: MOCK_REVIEW_STATS
      }
    };
  }
};

interface ReviewStatsProps {
  assistantId: string;
  compact?: boolean;
}

export default function ReviewStats({ assistantId, compact = false }: ReviewStatsProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, [assistantId]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockApiClient.getReviewStats(assistantId);
      if (response.success && response.data) {
        setStats(response.data.stats);
      } else {
        setError('統計の取得に失敗しました');
      }
    } catch (err) {
      setError('統計の取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5'
    };

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.floor(rating) ? 'text-yellow-400' : 
              star === Math.ceil(rating) && rating % 1 !== 0 ? 'text-yellow-200' :
              'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const renderRatingBar = (count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center space-x-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-gray-600 w-8 text-right">{count}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} bg-white rounded-lg border border-gray-200`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-2 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} bg-white rounded-lg border border-gray-200`}>
        <p className="text-sm text-gray-600">レビュー統計がありません</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {renderStars(stats.averageRating, 'sm')}
            <span className="text-sm font-medium text-gray-900">
              {stats.averageRating.toFixed(1)}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            ({stats.totalReviews}件のレビュー)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">レビュー統計</h3>
      
      {/* 総合評価 */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-2">
          <div className="text-3xl font-bold text-gray-900">
            {stats.averageRating.toFixed(1)}
          </div>
          <div>
            {renderStars(stats.averageRating, 'md')}
            <p className="text-sm text-gray-600 mt-1">
              {stats.totalReviews}件のレビュー
            </p>
          </div>
        </div>
      </div>

      {/* 評価分布 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">評価分布</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <span className="text-xs text-gray-600 w-6">{rating}★</span>
              {renderRatingBar(
                stats.ratingDistribution[rating.toString()],
                stats.totalReviews
              )}
            </div>
          ))}
        </div>
      </div>

      {/* カテゴリ別評価 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">項目別評価</h4>
        <div className="space-y-3">
          {[
            { key: 'technical', label: '技術力' },
            { key: 'communication', label: 'コミュニケーション' },
            { key: 'cleanliness', label: '清潔感' },
            { key: 'timeliness', label: '時間厳守' },
            { key: 'atmosphere', label: '雰囲気' }
          ].map((category) => (
            <div key={category.key} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{category.label}</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-pink-400 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(stats.categoryAverages[category.key] / 5) * 100}%` 
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8 text-right">
                  {stats.categoryAverages[category.key].toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 追加統計 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(stats.recommendationRate * 100)}%
          </div>
          <div className="text-xs text-green-700">おすすめ率</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(stats.repeatCustomerRate * 100)}%
          </div>
          <div className="text-xs text-blue-700">リピート率</div>
        </div>
      </div>

      {/* 最終更新日 */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        最終更新: {new Date(stats.lastUpdated).toLocaleDateString('ja-JP')}
      </div>
    </div>
  );
}