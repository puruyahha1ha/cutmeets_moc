'use client'

import { useState } from 'react';
import { apiClient } from '@/lib/api/client';

interface ReviewCardProps {
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

export default function ReviewCard({
  review,
  responses = [],
  showActions = true,
  currentUserId,
  onHelpfulClick,
  onResponseClick
}: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [helpfulLoading, setHelpfulLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
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

  const handleHelpfulClick = async (isHelpful: boolean) => {
    if (!currentUserId || helpfulLoading) return;

    setHelpfulLoading(true);
    try {
      await onHelpfulClick?.(review.id, isHelpful);
    } finally {
      setHelpfulLoading(false);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      {/* レビューヘッダー */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {renderStars(review.rating, 'md')}
            <span className="text-sm font-medium text-gray-900">({review.rating}/5)</span>
            {review.isVerified && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                認証済み
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{review.title}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <span>{review.customerName || '匿名ユーザー'}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(review.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* レビュー本文 */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">
          {isExpanded ? review.comment : truncateText(review.comment, 200)}
        </p>
        {review.comment.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-pink-500 hover:text-pink-600 text-sm mt-2"
          >
            {isExpanded ? '縮小' : '続きを読む'}
          </button>
        )}
      </div>

      {/* 写真 */}
      {review.photos && review.photos.length > 0 && (
        <div className="mb-4">
          <div className="flex space-x-2 overflow-x-auto">
            {review.photos.map((photo, index) => (
              <div key={index} className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* タグ */}
      {review.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {review.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* カテゴリ別評価（詳細表示時） */}
      {isExpanded && (
        <div className="mb-4 bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">詳細評価</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'technical', label: '技術力' },
              { key: 'communication', label: 'コミュニケーション' },
              { key: 'cleanliness', label: '清潔感' },
              { key: 'timeliness', label: '時間厳守' },
              { key: 'atmosphere', label: '雰囲気' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <div className="flex items-center space-x-2">
                  {renderStars(review.categories[item.key as keyof typeof review.categories])}
                  <span className="text-xs text-gray-500">
                    ({review.categories[item.key as keyof typeof review.categories]}/5)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* おすすめ情報 */}
      <div className="mb-4 flex items-center space-x-4 text-sm">
        {review.isRecommended && (
          <div className="flex items-center text-green-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>おすすめします</span>
          </div>
        )}
        {review.wouldBookAgain && (
          <div className="flex items-center text-blue-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>また利用したい</span>
          </div>
        )}
      </div>

      {/* アシスタントからの返信 */}
      {responses.map((response) => (
        <div key={response.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {response.assistantName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-blue-900">
                  {response.assistantName || 'アシスタント'}からの返信
                </span>
                <span className="text-xs text-blue-600">{formatDate(response.createdAt)}</span>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">{response.response}</p>
            </div>
          </div>
        </div>
      ))}

      {/* アクションボタン */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {currentUserId && currentUserId !== review.customerId && (
              <button
                onClick={() => handleHelpfulClick(true)}
                disabled={helpfulLoading}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>役に立った</span>
              </button>
            )}
            
            <span className="text-sm text-gray-500">
              {review.helpfulCount > 0 && `${review.helpfulCount}人が役に立ったと回答`}
            </span>
          </div>

          {onResponseClick && (
            <button
              onClick={() => onResponseClick(review.id)}
              className="text-sm text-pink-500 hover:text-pink-600 transition-colors"
            >
              返信する
            </button>
          )}
        </div>
      )}
    </div>
  );
}