'use client';

import { useState } from 'react';
import { 
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  BellIcon,
  CurrencyYenIcon,
  ShieldCheckIcon,
  ServerIcon
} from '@heroicons/react/24/outline';
import { mockSystemSettings } from '../_data/mockData';
import type { SystemSettings } from '../_types';

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(mockSystemSettings);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'finance' | 'notifications' | 'security' | 'maintenance'>('general');

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    // TODO: API call to save settings
    console.log('Settings saved:', settings);
    setHasUnsavedChanges(false);
    
    // Show success message
    alert('設定が保存されました');
  };

  const handleResetSettings = () => {
    if (confirm('設定をデフォルトに戻しますか？')) {
      setSettings(mockSystemSettings);
      setHasUnsavedChanges(false);
    }
  };

  const handleMaintenanceMode = () => {
    const newMaintenanceMode = !settings.maintenanceMode;
    if (newMaintenanceMode) {
      if (confirm('メンテナンスモードを有効にしますか？全ユーザーがサイトにアクセスできなくなります。')) {
        handleSettingChange('maintenanceMode', true);
      }
    } else {
      handleSettingChange('maintenanceMode', false);
    }
  };

  const tabs = [
    { id: 'general', name: '一般設定', icon: CogIcon },
    { id: 'finance', name: '財務設定', icon: CurrencyYenIcon },
    { id: 'notifications', name: '通知設定', icon: BellIcon },
    { id: 'security', name: 'セキュリティ', icon: ShieldCheckIcon },
    { id: 'maintenance', name: 'メンテナンス', icon: WrenchScrewdriverIcon }
  ] as const;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-heading-ja">
            システム設定
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-body-ja">
            プラットフォーム設定とシステム管理
          </p>
        </div>
        
        {hasUnsavedChanges && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-orange-600">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <span className="text-sm font-medium">未保存の変更があります</span>
            </div>
            <button
              onClick={handleSaveSettings}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              設定を保存
            </button>
          </div>
        )}
      </div>

      {/* Maintenance Mode Alert */}
      {settings.maintenanceMode && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
                メンテナンスモードが有効です
              </h3>
              <p className="text-red-700 dark:text-red-300 mt-1">
                現在、一般ユーザーはサイトにアクセスできません。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              一般設定
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      新規登録を許可
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      新しいユーザーの登録を受け付けます
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.registrationEnabled}
                    onChange={(e) => handleSettingChange('registrationEnabled', e.target.checked)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                </label>
              </div>

              <div>
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      決済処理を有効化
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      決済システムを有効にします
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.paymentProcessingEnabled}
                    onChange={(e) => handleSettingChange('paymentProcessingEnabled', e.target.checked)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                </label>
              </div>

              <div>
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      自動承認を有効化
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      投稿を自動的に承認します
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoApprovalEnabled}
                    onChange={(e) => handleSettingChange('autoApprovalEnabled', e.target.checked)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    自動停止報告数
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    この数の報告で自動的にアカウントを停止
                  </p>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={settings.maxReportsBeforeAutoSuspension}
                    onChange={(e) => handleSettingChange('maxReportsBeforeAutoSuspension', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              財務設定
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    プラットフォーム手数料率 (%)
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    各取引から徴収する手数料の割合
                  </p>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.1"
                    value={settings.platformFeeRate}
                    onChange={(e) => handleSettingChange('platformFeeRate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
                  />
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    最小予約金額 (円)
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    予約可能な最小金額
                  </p>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={settings.minBookingAmount}
                    onChange={(e) => handleSettingChange('minBookingAmount', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
                  />
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    最大予約金額 (円)
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    予約可能な最大金額
                  </p>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={settings.maxBookingAmount}
                    onChange={(e) => handleSettingChange('maxBookingAmount', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              通知設定
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      メール通知を有効化
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      システムからのメール通知を送信します
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotificationsEnabled}
                    onChange={(e) => handleSettingChange('emailNotificationsEnabled', e.target.checked)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                </label>
              </div>

              <div>
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      SMS通知を有効化
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      緊急時にSMS通知を送信します
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.smsNotificationsEnabled}
                    onChange={(e) => handleSettingChange('smsNotificationsEnabled', e.target.checked)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              セキュリティ設定
            </h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                    セキュリティ機能は正常に動作しています
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                  <div className="font-medium text-gray-900 dark:text-white">
                    ログの確認
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    システムログを確認
                  </div>
                </button>

                <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                  <div className="font-medium text-gray-900 dark:text-white">
                    セキュリティスキャン
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    脆弱性スキャンを実行
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              メンテナンス設定
            </h3>
            
            <div className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-yellow-800 dark:text-yellow-400">
                      メンテナンスモード
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                      {settings.maintenanceMode 
                        ? 'メンテナンスモードが有効です。一般ユーザーはアクセスできません。'
                        : 'メンテナンスモードは無効です。すべてのユーザーがアクセス可能です。'
                      }
                    </p>
                  </div>
                  <button
                    onClick={handleMaintenanceMode}
                    className={`px-4 py-2 rounded-md font-medium ${
                      settings.maintenanceMode
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {settings.maintenanceMode ? '無効化' : '有効化'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                  <ServerIcon className="h-8 w-8 text-gray-500 mb-2" />
                  <div className="font-medium text-gray-900 dark:text-white">
                    システム再起動
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    システムを安全に再起動
                  </div>
                </button>

                <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                  <WrenchScrewdriverIcon className="h-8 w-8 text-gray-500 mb-2" />
                  <div className="font-medium text-gray-900 dark:text-white">
                    キャッシュクリア
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    システムキャッシュをクリア
                  </div>
                </button>

                <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                  <CheckCircleIcon className="h-8 w-8 text-gray-500 mb-2" />
                  <div className="font-medium text-gray-900 dark:text-white">
                    ヘルスチェック
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    システムの健全性を確認
                  </div>
                </button>

                <button 
                  onClick={handleResetSettings}
                  className="p-4 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                >
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mb-2" />
                  <div className="font-medium text-red-900 dark:text-red-400">
                    設定リセット
                  </div>
                  <div className="text-sm text-red-500">
                    すべての設定をデフォルトに戻す
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      {hasUnsavedChanges && (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            変更が保存されていません
          </span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setSettings(mockSystemSettings);
                setHasUnsavedChanges(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              変更を破棄
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              設定を保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
}