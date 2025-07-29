'use client';

import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { NotificationType } from '@/lib/api/notification-db';

interface NotificationListProps {
  compact?: boolean;
  maxItems?: number;
  showFilters?: boolean;
  showLoadMore?: boolean;
}

const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  all: 'すべて',
  application_new: '新規応募',
  application_approved: '応募承認',
  application_rejected: '応募拒否',
  booking_reminder: '予約リマインダー',
  booking_confirmed: '予約確定',
  booking_cancelled: '予約キャンセル',
  payment_completed: '決済完了',
  payment_failed: '決済失敗',
  review_request: 'レビュー依頼',
  review_received: '新着レビュー',
  review_response: 'レビュー返信',
  system_announcement: 'システムお知らせ',
  system_maintenance: 'メンテナンス',
  profile_update: 'プロフィール更新',
};

export const NotificationList: React.FC<NotificationListProps> = ({
  compact = false,
  maxItems,
  showFilters = true,
  showLoadMore = true
}) => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    loadMore,
    refresh
  } = useNotifications();

  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const handleFilterChange = (status: typeof statusFilter, type: string) => {
    setStatusFilter(status);
    setTypeFilter(type);
    
    fetchNotifications({
      status: status === 'all' ? undefined : status,
      type: type === 'all' ? undefined : type,
      reset: true
    });
  };

  const displayedNotifications = maxItems ? notifications.slice(0, maxItems) : notifications;

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-red-700">{error}</span>
        </div>
        <button
          onClick={refresh}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            通知
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                {unreadCount}
              </span>
            )}
          </h2>
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
          >
            すべて既読
          </button>
        )}
      </div>

      {/* フィルター */}
      {showFilters && (
        <div className="space-y-3">
          {/* ステータスフィルター */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'unread', 'read', 'archived'] as const).map(status => (
              <button
                key={status}
                onClick={() => handleFilterChange(status, typeFilter)}
                className={`
                  px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${statusFilter === status
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                {status === 'all' ? 'すべて' : 
                 status === 'unread' ? '未読' :
                 status === 'read' ? '既読' : 'アーカイブ'}
              </button>
            ))}
          </div>

          {/* タイプフィルター */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(NOTIFICATION_TYPE_LABELS).map(([type, label]) => (
              <button
                key={type}
                onClick={() => handleFilterChange(statusFilter, type)}
                className={`
                  px-3 py-1 rounded-full text-sm transition-colors
                  ${typeFilter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 通知リスト */}
      {loading && notifications.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayedNotifications.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12h10v7h-5" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">通知がありません</h3>
          <p className="mt-1 text-sm text-gray-500">
            {statusFilter === 'unread' ? '未読の通知はありません' : 
             statusFilter === 'read' ? '既読の通知はありません' :
             statusFilter === 'archived' ? 'アーカイブされた通知はありません' :
             '通知はありません'}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {displayedNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onArchive={archiveNotification}
              onDelete={deleteNotification}
              compact={compact}
            />
          ))}
        </div>
      )}

      {/* もっと読み込む */}
      {showLoadMore && hasMore && !maxItems && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '読み込み中...' : 'もっと見る'}
          </button>
        </div>
      )}

      {/* 最大アイテム数表示時の「もっと見る」リンク */}
      {maxItems && notifications.length > maxItems && (
        <div className="text-center">
          <button
            onClick={() => window.location.href = '/notifications'}
            className="text-pink-600 hover:text-pink-700 text-sm font-medium"
          >
            すべての通知を見る ({notifications.length - maxItems}件)
          </button>
        </div>
      )}
    </div>
  );
};