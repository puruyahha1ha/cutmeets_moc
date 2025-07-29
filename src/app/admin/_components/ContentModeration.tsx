'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  FlagIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import type { RecruitmentPost, Review, Report } from '../_types';

interface ContentModerationProps {
  type: 'posts' | 'reviews' | 'reports';
  items: (RecruitmentPost | Review | Report)[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onView?: (id: string) => void;
}

export default function ContentModeration({ 
  type, 
  items, 
  onApprove, 
  onReject, 
  onView 
}: ContentModerationProps) {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusText = (item: any) => {
    if ('status' in item) {
      switch (item.status) {
        case 'active': return 'アクティブ';
        case 'paused': return '一時停止';
        case 'expired': return '期限切れ';
        case 'reported': return '報告済み';
        case 'removed': return '削除済み';
        case 'published': return '公開中';
        case 'pending': return '承認待ち';
        case 'flagged': return 'フラグ付き';
        case 'investigating': return '調査中';
        case 'resolved': return '解決済み';
        case 'dismissed': return '却下';
        default: return '不明';
      }
    }
    return '不明';
  };

  const getStatusColor = (item: any) => {
    if ('status' in item) {
      switch (item.status) {
        case 'active':
        case 'published':
        case 'resolved':
          return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'pending':
        case 'investigating':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'reported':
        case 'flagged':
          return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'paused':
        case 'dismissed':
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        case 'expired':
        case 'removed':
          return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      }
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 'title' in item 
      ? item.title.toLowerCase().includes(searchTerm.toLowerCase())
      : 'comment' in item
      ? item.comment.toLowerCase().includes(searchTerm.toLowerCase())
      : 'description' in item
      ? item.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesFilter = filter === 'all' || 
      ('status' in item && item.status === filter);
    
    return matchesSearch && matchesFilter;
  });

  const renderPostItem = (post: RecruitmentPost) => (
    <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {post.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post)}`}>
              {getStatusText(post)}
            </span>
            {post.reports > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                報告 {post.reports}件
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {post.description}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>投稿者: {post.authorName}</span>
            <span>応募: {post.applications}件</span>
            <span>場所: {post.location}</span>
            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ja })}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView?.(post.id)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          {post.status === 'reported' && (
            <>
              <button
                onClick={() => onApprove?.(post.id)}
                className="p-2 text-green-500 hover:text-green-700"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onReject?.(post.id)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderReviewItem = (review: Review) => (
    <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review)}`}>
              {getStatusText(review)}
            </span>
            {review.reports > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                報告 {review.reports}件
              </span>
            )}
          </div>
          <p className="text-gray-900 dark:text-white mb-2">"{review.comment}"</p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span>{review.customerName}</span> → <span>{review.assistantName}</span>
            <span className="ml-2">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: ja })}
            </span>
          </div>
          {review.helpful > 0 && (
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {review.helpful}人が参考になったと評価
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView?.(review.id)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          {review.status === 'flagged' && (
            <>
              <button
                onClick={() => onApprove?.(review.id)}
                className="p-2 text-green-500 hover:text-green-700"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onReject?.(review.id)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderReportItem = (report: Report) => (
    <div key={report.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <FlagIcon className="h-4 w-4 text-red-500" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
              {report.priority === 'urgent' ? '緊急' : 
               report.priority === 'high' ? '高' :
               report.priority === 'medium' ? '中' : '低'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report)}`}>
              {getStatusText(report)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {report.reason === 'spam' ? 'スパム報告' :
             report.reason === 'inappropriate' ? '不適切コンテンツ' :
             report.reason === 'harassment' ? 'ハラスメント' :
             report.reason === 'fake' ? '虚偽情報' : 'その他'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {report.description}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>報告者: {report.reporterName}</span>
            <span>対象: {report.targetType}</span>
            <span>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true, locale: ja })}</span>
            {report.assignedTo && (
              <span>担当: {report.assignedTo}</span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView?.(report.id)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          {report.status === 'pending' && (
            <>
              <button
                onClick={() => onApprove?.(report.id)}
                className="p-2 text-green-500 hover:text-green-700"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onReject?.(report.id)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">全ステータス</option>
            {type === 'posts' && (
              <>
                <option value="active">アクティブ</option>
                <option value="reported">報告済み</option>
                <option value="removed">削除済み</option>
              </>
            )}
            {type === 'reviews' && (
              <>
                <option value="published">公開中</option>
                <option value="flagged">フラグ付き</option>
                <option value="removed">削除済み</option>
              </>
            )}
            {type === 'reports' && (
              <>
                <option value="pending">承認待ち</option>
                <option value="investigating">調査中</option>
                <option value="resolved">解決済み</option>
                <option value="dismissed">却下</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              項目が見つかりません
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              検索条件を変更してください。
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            if (type === 'posts') {
              return renderPostItem(item as RecruitmentPost);
            } else if (type === 'reviews') {
              return renderReviewItem(item as Review);
            } else {
              return renderReportItem(item as Report);
            }
          })
        )}
      </div>
    </div>
  );
}