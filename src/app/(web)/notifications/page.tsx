'use client';

import { useState } from 'react';
import { NotificationList } from '../_components/common/NotificationList';
import { NotificationSettings } from '../_components/common/NotificationSettings';
import { useAuth } from '../_components/providers/AuthProvider';

export default function NotificationsPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">通知センター</h1>
          <p className="mt-2 text-gray-600">
            すべての通知を確認し、通知設定を管理できます
          </p>
        </div>

        {/* タブナビゲーション */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              通知一覧
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              通知設定
            </button>
          </nav>
        </div>

        {/* タブコンテンツ */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'notifications' ? (
            <div className="p-6">
              <NotificationList
                compact={false}
                showFilters={true}
                showLoadMore={true}
              />
            </div>
          ) : (
            <div className="p-6">
              <NotificationSettings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}