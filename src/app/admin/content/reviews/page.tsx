'use client';

import { useState } from 'react';
import ContentModeration from '../../_components/ContentModeration';
import { mockReviews } from '../../_data/mockData';
import type { Review } from '../../_types';
import { 
  StarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

export default function ReviewsManagementPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  const handleApprove = (reviewId: string) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId ? { ...review, status: 'published' } : review
      )
    );
    console.log('Review approved:', reviewId);
  };

  const handleReject = (reviewId: string) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId ? { ...review, status: 'removed' } : review
      )
    );
    console.log('Review rejected:', reviewId);
  };

  const handleView = (reviewId: string) => {
    console.log('View review:', reviewId);
    // TODO: Implement review detail view
  };

  const publishedReviews = reviews.filter(r => r.status === 'published').length;
  const flaggedReviews = reviews.filter(r => r.status === 'flagged').length;
  const removedReviews = reviews.filter(r => r.status === 'removed').length;
  const totalReports = reviews.reduce((sum, review) => sum + review.reports, 0);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-heading-ja">
            レビュー管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-body-ja">
            ユーザーレビューの承認・管理・モデレーション
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <StarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                総レビュー数
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reviews.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                公開中
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {publishedReviews}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {reviews.length > 0 ? ((publishedReviews / reviews.length) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <FlagIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                フラグ付き
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {flaggedReviews}
              </p>
              {flaggedReviews > 0 && (
                <p className="text-xs text-red-500">
                  要対応
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center">
                <StarIcon className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                平均評価
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {averageRating}
              </p>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(parseFloat(averageRating))
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Actions */}
      {flaggedReviews > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
          <div className="flex items-center">
            <FlagIcon className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
                緊急対応が必要なレビューがあります
              </h3>
              <p className="text-red-700 dark:text-red-300 mt-1">
                {flaggedReviews}件のフラグ付きレビューを確認してください。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          レビュー統計
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalReports}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              総報告数
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {reviews.reduce((sum, review) => sum + review.helpful, 0)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              総「参考になった」数
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {reviews.filter(r => r.response).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              アシスタントからの返信数
            </div>
          </div>
        </div>
      </div>

      {/* Content Moderation Component */}
      <ContentModeration
        type="reviews"
        items={reviews}
        onApprove={handleApprove}
        onReject={handleReject}
        onView={handleView}
      />
    </div>
  );
}