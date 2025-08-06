'use client';

import { useState, useCallback } from 'react';

export interface Notification {
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

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  // Actions
  fetchNotifications: (options?: FetchNotificationsOptions) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  archiveNotification: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface FetchNotificationsOptions {
  status?: 'unread' | 'read' | 'archived';
  type?: string;
  limit?: number;
  offset?: number;
  reset?: boolean;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user_1',
    type: 'booking',
    title: '予約が確定しました',
    message: '12月25日 14:00からの予約が確定しました',
    link: '/bookings/1',
    read: false,
    archived: false,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: '2',
    userId: 'user_1',
    type: 'review',
    title: '新しいレビューが投稿されました',
    message: '田中様から5つ星のレビューをいただきました',
    link: '/reviews',
    read: true,
    archived: false,
    createdAt: new Date('2025-01-04'),
    updatedAt: new Date('2025-01-04'),
  },
];

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;

  const fetchNotifications = useCallback(async (options?: FetchNotificationsOptions) => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const archiveNotification = useCallback(async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, archived: true } : n)
    );
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const loadMore = useCallback(async () => {
    // No more to load in mock
  }, []);

  const refresh = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications: notifications.filter(n => !n.archived),
    unreadCount,
    loading,
    error,
    hasMore: false,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    loadMore,
    refresh,
  };
};