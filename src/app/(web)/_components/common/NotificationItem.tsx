'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

// Import the notification interface to match useNotifications
interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'payment' | 'review' | 'application' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
    if (!notification.read && onMarkAsRead) {
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

  const getPriorityColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'border-l-green-500 bg-green-50';
      case 'payment':
        return 'border-l-blue-500 bg-blue-50';
      case 'review':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'application':
        return 'border-l-purple-500 bg-purple-50';
      case 'system':
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const content = (
    <div
      className={`
        p-4 border-l-4 transition-all hover:shadow-md
        ${!notification.read ? 'bg-white' : 'bg-gray-50'}
        ${getPriorityColor(notification.type)}
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
                ${!notification.read ? 'font-semibold' : ''}
              `}>
                {notification.title}
              </h4>
              {!notification.read && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  未読
                </span>
              )}
              {notification.type === 'system' && (
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
                {formatDistanceToNow(notification.createdAt, {
                  addSuffix: true,
                  locale: ja
                })}
              </span>
              {notification.read && (
                <span className="text-xs text-gray-500">
                  既読: {formatDistanceToNow(notification.updatedAt, {
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
                  {!notification.read && (
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
  if (notification.link) {
    return (
      <Link 
        href={notification.link} 
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