'use client';

import { useState } from 'react';
import { useNotificationPreferences } from '@/hooks/useNotifications';
import { NotificationType } from '@/lib/api/notification-db';

const NOTIFICATION_TYPE_SETTINGS = {
  application_new: {
    label: '新規応募',
    description: '新しい応募があった時',
    icon: '📝'
  },
  application_approved: {
    label: '応募承認',
    description: '応募が承認された時',
    icon: '✅'
  },
  application_rejected: {
    label: '応募拒否',
    description: '応募が拒否された時',
    icon: '❌'
  },
  booking_reminder: {
    label: '予約リマインダー',
    description: '予約の24時間前、1時間前',
    icon: '⏰'
  },
  booking_confirmed: {
    label: '予約確定',
    description: '予約が確定した時',
    icon: '📅'
  },
  booking_cancelled: {
    label: '予約キャンセル',
    description: '予約がキャンセルされた時',
    icon: '🚫'
  },
  payment_completed: {
    label: '決済完了',
    description: '決済処理が完了した時',
    icon: '💳'
  },
  payment_failed: {
    label: '決済失敗',
    description: '決済処理が失敗した時',
    icon: '⚠️'
  },
  review_request: {
    label: 'レビュー依頼',
    description: 'レビューの投稿を依頼された時',
    icon: '⭐'
  },
  review_received: {
    label: '新着レビュー',
    description: '新しいレビューが投稿された時',
    icon: '💬'
  },
  review_response: {
    label: 'レビュー返信',
    description: 'レビューに返信があった時',
    icon: '↩️'
  },
  system_announcement: {
    label: 'システムお知らせ',
    description: '重要なお知らせがある時',
    icon: '📢'
  },
  system_maintenance: {
    label: 'メンテナンス通知',
    description: 'システムメンテナンス時',
    icon: '🔧'
  },
  profile_update: {
    label: 'プロフィール更新',
    description: 'プロフィールが更新された時',
    icon: '👤'
  }
};

export const NotificationSettings: React.FC = () => {
  const { preferences, loading, error, updatePreferences } = useNotificationPreferences();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleGlobalToggle = async (type: 'emailEnabled' | 'pushEnabled' | 'inAppEnabled', enabled: boolean) => {
    setIsSaving(true);
    try {
      await updatePreferences({ [type]: enabled });
      setSaveMessage('設定を保存しました');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update global setting:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationTypeToggle = async (
    notificationType: NotificationType,
    method: 'email' | 'push' | 'inApp',
    enabled: boolean
  ) => {
    if (!preferences) return;

    setIsSaving(true);
    try {
      const updatedTypes = {
        ...preferences.notificationTypes,
        [notificationType]: {
          ...preferences.notificationTypes[notificationType],
          [method]: enabled
        }
      };

      await updatePreferences({ notificationTypes: updatedTypes });
      setSaveMessage('設定を保存しました');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update notification type setting:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuietHoursUpdate = async (quietHours: any) => {
    setIsSaving(true);
    try {
      await updatePreferences({ quietHours });
      setSaveMessage('静寂時間を設定しました');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update quiet hours:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">通知設定を読み込めませんでした</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 保存メッセージ */}
      {saveMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-700">{saveMessage}</span>
          </div>
        </div>
      )}

      {/* 全体設定 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">通知方法</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">アプリ内通知</label>
              <p className="text-sm text-gray-500">Cutmeetsアプリ内での通知表示</p>
            </div>
            <button
              onClick={() => handleGlobalToggle('inAppEnabled', !preferences.inAppEnabled)}
              disabled={isSaving}
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                preferences.inAppEnabled ? 'bg-pink-600' : 'bg-gray-200'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                  preferences.inAppEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">メール通知</label>
              <p className="text-sm text-gray-500">メールでの通知送信</p>
            </div>
            <button
              onClick={() => handleGlobalToggle('emailEnabled', !preferences.emailEnabled)}
              disabled={isSaving}
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                preferences.emailEnabled ? 'bg-pink-600' : 'bg-gray-200'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                  preferences.emailEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">プッシュ通知</label>
              <p className="text-sm text-gray-500">ブラウザプッシュ通知（準備中）</p>
            </div>
            <button
              onClick={() => handleGlobalToggle('pushEnabled', !preferences.pushEnabled)}
              disabled={true} // 現在は無効
              className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-not-allowed transition-colors ease-in-out duration-200 bg-gray-200 opacity-50"
            >
              <span className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-0" />
            </button>
          </div>
        </div>
      </div>

      {/* 通知タイプ別設定 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">通知タイプ別設定</h3>
        <div className="space-y-6">
          {Object.entries(NOTIFICATION_TYPE_SETTINGS).map(([type, config]) => {
            const typeSettings = preferences.notificationTypes[type as NotificationType];
            if (!typeSettings) return null;

            return (
              <div key={type} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{config.label}</h4>
                    <p className="text-sm text-gray-500">{config.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 ml-11">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${type}-inApp`}
                      checked={typeSettings.inApp}
                      onChange={(e) => handleNotificationTypeToggle(type as NotificationType, 'inApp', e.target.checked)}
                      disabled={isSaving || !preferences.inAppEnabled}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label htmlFor={`${type}-inApp`} className="text-sm text-gray-700">
                      アプリ内
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${type}-email`}
                      checked={typeSettings.email}
                      onChange={(e) => handleNotificationTypeToggle(type as NotificationType, 'email', e.target.checked)}
                      disabled={isSaving || !preferences.emailEnabled}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label htmlFor={`${type}-email`} className="text-sm text-gray-700">
                      メール
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${type}-push`}
                      checked={typeSettings.push}
                      onChange={(e) => handleNotificationTypeToggle(type as NotificationType, 'push', e.target.checked)}
                      disabled={true}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded opacity-50"
                    />
                    <label htmlFor={`${type}-push`} className="text-sm text-gray-500">
                      プッシュ
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 静寂時間設定 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">静寂時間</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">静寂時間を有効にする</label>
              <p className="text-sm text-gray-500">指定した時間帯は通知を送信しません</p>
            </div>
            <button
              onClick={() => handleQuietHoursUpdate({
                ...preferences.quietHours,
                enabled: !preferences.quietHours?.enabled
              })}
              disabled={isSaving}
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                preferences.quietHours?.enabled ? 'bg-pink-600' : 'bg-gray-200'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                  preferences.quietHours?.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {preferences.quietHours?.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">開始時刻</label>
                <input
                  type="time"
                  value={preferences.quietHours.startTime}
                  onChange={(e) => handleQuietHoursUpdate({
                    ...preferences.quietHours,
                    startTime: e.target.value
                  })}
                  disabled={isSaving}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">終了時刻</label>
                <input
                  type="time"
                  value={preferences.quietHours.endTime}
                  onChange={(e) => handleQuietHoursUpdate({
                    ...preferences.quietHours,
                    endTime: e.target.value
                  })}
                  disabled={isSaving}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};