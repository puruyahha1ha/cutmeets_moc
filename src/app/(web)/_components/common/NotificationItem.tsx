'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Notification } from '@/lib/api/notification-db';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onArchive,
  onDelete,
  showActions = true,
  compact = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMarkAsRead = () => {
    if (notification.status === 'unread' && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    setIsMenuOpen(false);
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive(notification.id);
    }
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notification.id);
    }
    setIsMenuOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    const iconMap = {
      application_new: '📝',
      application_approved: '✅',
      application_rejected: '❌',
      booking_reminder: '⏰',
      booking_confirmed: '📅',
      booking_cancelled: '🚫',
      payment_completed: '💳',
      payment_failed: '⚠️',
      review_request: '⭐',
      review_received: '💬',
      review_response: '↩️',
      system_announcement: '📢',
      system_maintenance: '🔧',
      profile_update: '👤',
    };
    return iconMap[type as keyof typeof iconMap] || '🔔';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const content = (
    <div
      className={`
        p-4 border-l-4 transition-all hover:shadow-md
        ${notification.status === 'unread' ? 'bg-white' : 'bg-gray-50'}
        ${getPriorityColor(notification.priority)}
        ${compact ? 'p-3' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* アイコン */}
          <div className="flex-shrink-0">
            <span className="text-lg">
              {getNotificationIcon(notification.type)}
            </span>
          </div>

          {/* コンテンツ */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className={`
                font-medium text-gray-900 
                ${compact ? 'text-sm' : 'text-base'}
                ${notification.status === 'unread' ? 'font-semibold' : ''}
              `}>
                {notification.title}
              </h4>
              {notification.status === 'unread' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  未読
                </span>
              )}
              {notification.priority === 'high' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  重要
                </span>
              )}
            </div>
            
            <p className={`
              text-gray-600 mt-1 
              ${compact ? 'text-sm' : 'text-base'}
            `}>
              {notification.message}
            </p>
            
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                  locale: ja
                })}
              </span>
              {notification.readAt && (
                <span className="text-xs text-gray-500">
                  既読: {formatDistanceToNow(new Date(notification.readAt), {
                    addSuffix: true,
                    locale: ja
                  })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* アクションメニュー */}
        {showActions && (
          <div className="relative ml-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  {notification.status === 'unread' && (
                    <button
                      onClick={handleMarkAsRead}
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      既読にする
                    </button>
                  )}
                  <button
                    onClick={handleArchive}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                  >
                    アーカイブ
                  </button>
                  <button
                    onClick={handleDelete}
                    className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                  >
                    削除
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // アクションURLがある場合はリンクでラップ
  if (notification.data?.actionUrl) {
    return (
      <Link 
        href={notification.data.actionUrl} 
        onClick={() => handleMarkAsRead()}
        className="block hover:bg-gray-50 transition-colors"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="hover:bg-gray-50 transition-colors">
      {content}
    </div>
  );
};