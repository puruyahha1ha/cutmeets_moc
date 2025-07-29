'use client';

import { useState, useEffect, useCallback } from 'react';
import { Notification, NotificationPreference } from '@/lib/api/notification-db';

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

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [currentOptions, setCurrentOptions] = useState<FetchNotificationsOptions>({});

  const fetchNotifications = useCallback(async (options: FetchNotificationsOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const { status, type, limit = 20, offset = 0, reset = false } = options;
      
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (type) params.append('type', type);
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());

      const response = await fetch(`/api/notifications?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('通知の取得に失敗しました');
      }

      const data = await response.json();
      
      if (reset || offset === 0) {
        setNotifications(data.data?.notifications || []);
      } else {
        setNotifications(prev => [...(prev || []), ...(data.data?.notifications || [])]);
      }

      setUnreadCount(data.data?.unreadCount || 0);
      setHasMore(data.data?.pagination?.hasMore || false);
      setCurrentOffset(offset + limit);
      setCurrentOptions(options);
    } catch (err) {
      setError(err instanceof Error ? err.message : '通知の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'read' }),
      });

      if (!response.ok) {
        throw new Error('通知の更新に失敗しました');
      }

      const data = await response.json();
      
      // ローカル状態を更新
      setNotifications(prev => 
        (prev || []).map(n => n.id === notificationId ? (data.data || n) : n)
      );
      
      // 未読数を更新
      setUnreadCount(prev => Math.max(0, (prev || 0) - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : '通知の更新に失敗しました');
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('一括既読の処理に失敗しました');
      }

      // ローカル状態を更新
      setNotifications(prev => 
        (prev || []).map(n => ({ ...n, status: 'read' as const, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : '一括既読の処理に失敗しました');
    }
  }, []);

  const archiveNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'archive' }),
      });

      if (!response.ok) {
        throw new Error('通知のアーカイブに失敗しました');
      }

      const data = await response.json();
      
      // ローカル状態を更新
      setNotifications(prev => 
        (prev || []).map(n => n.id === notificationId ? (data.data || n) : n)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : '通知のアーカイブに失敗しました');
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('通知の削除に失敗しました');
      }

      // ローカル状態を更新
      setNotifications(prev => (prev || []).filter(n => n.id !== notificationId));
      
      // 未読通知の場合、未読数を更新
      const notification = (notifications || []).find(n => n.id === notificationId);
      if (notification?.status === 'unread') {
        setUnreadCount(prev => Math.max(0, (prev || 0) - 1));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '通知の削除に失敗しました');
    }
  }, [notifications]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    await fetchNotifications({
      ...currentOptions,
      offset: currentOffset,
      reset: false,
    });
  }, [hasMore, loading, currentOffset, currentOptions, fetchNotifications]);

  const refresh = useCallback(async () => {
    await fetchNotifications({ ...currentOptions, offset: 0, reset: true });
  }, [currentOptions, fetchNotifications]);

  // 初回ロード
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
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
    refresh,
  };
};

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/notifications/preferences', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('通知設定の取得に失敗しました');
      }

      const data = await response.json();
      setPreferences(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '通知設定の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (updates: Partial<NotificationPreference>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('通知設定の更新に失敗しました');
      }

      const data = await response.json();
      setPreferences(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '通知設定の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    refresh: fetchPreferences,
  };
};

export const useRealtimeNotifications = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastNotification, setLastNotification] = useState<Notification | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      eventSource = new EventSource('/api/notifications/stream', {
        withCredentials: true,
      });

      eventSource.onopen = () => {
        setIsConnected(true);
        console.log('Realtime notification connection established');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'notifications':
              if (data.data.length > 0) {
                setLastNotification(data.data[0]);
              }
              break;
            case 'unread_count':
              setUnreadCount(data.count);
              break;
            case 'heartbeat':
              // ハートビート処理
              break;
            default:
              console.log('Unknown SSE message type:', data.type);
          }
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        console.log('Realtime notification connection error');
        
        // 自動再接続（5秒後）
        setTimeout(() => {
          if (eventSource?.readyState === EventSource.CLOSED) {
            connect();
          }
        }, 5000);
      };
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
        setIsConnected(false);
      }
    };
  }, []);

  return {
    isConnected,
    lastNotification,
    unreadCount,
  };
};