'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    deleteNotification,
    fetchNotifications
  } = useNotifications();

  // Mock realtime connection status
  const isConnected = true;
  const lastNotification = null;

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 新しい通知が来たら更新
  useEffect(() => {
    if (lastNotification) {
      fetchNotifications({ reset: true });
    }
  }, [lastNotification, fetchNotifications]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // ドロップダウンを開く際に最新の通知を取得
      fetchNotifications({ limit: 10, reset: true });
    }
  };

  const recentNotifications = (notifications || []).slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 通知ベルアイコン */}
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-5 5-5-5h5v-12h10v7h-5M15 17v-4a6 6 0 00-12 0v4" 
          />
        </svg>
        
        {/* 未読バッジ */}
        {(unreadCount || 0) > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full min-w-[20px] h-5">
            {(unreadCount || 0) > 99 ? '99+' : (unreadCount || 0)}
          </span>
        )}

        {/* リアルタイム接続インジケーター */}
        <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* ヘッダー */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                通知
                {(unreadCount || 0) > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                    {unreadCount || 0}
                  </span>
                )}
              </h3>
              <div className="flex items-center space-x-2">
                {/* リアルタイム接続状態 */}
                <div className="flex items-center space-x-1">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-xs text-gray-500">
                    {isConnected ? 'オンライン' : 'オフライン'}
                  </span>
                </div>
                
                <Link
                  href="/notifications"
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  すべて見る
                </Link>
              </div>
            </div>
          </div>

          {/* 通知リスト */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4">
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex space-x-3">
                      <div className="rounded-full bg-gray-200 h-8 w-8"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12h10v7h-5" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">通知がありません</h3>
                <p className="mt-1 text-sm text-gray-500">新しい通知が届くとここに表示されます</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentNotifications.map(notification => (
                  <div key={notification.id} onClick={() => setIsOpen(false)}>
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                      showActions={false}
                      compact={true}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* フッター */}
          {recentNotifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  最新 {Math.min(recentNotifications.length, 5)} 件を表示
                </span>
                <div className="space-x-2">
                  {(unreadCount || 0) > 0 && (
                    <button
                      onClick={() => {
                        // TODO: 一括既読機能を実装
                        setIsOpen(false);
                      }}
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      すべて既読
                    </button>
                  )}
                  <Link
                    href="/notifications"
                    className="text-sm bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    通知センターへ
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};