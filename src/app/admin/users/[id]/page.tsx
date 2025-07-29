'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  StarIcon,
  CurrencyYenIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { mockUsers, mockActivityLogs } from '../../_data/mockData';
import type { User, ActivityLog } from '../../_types';

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userActivities, setUserActivities] = useState<ActivityLog[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    const loadUser = async () => {
      const resolvedParams = await params;
      // Find user from mock data
      const foundUser = mockUsers.find(u => u.id === resolvedParams.id);
      if (foundUser) {
        setUser(foundUser);
        setEditForm(foundUser);
        
        // Filter activities for this user
        const activities = mockActivityLogs.filter(
          activity => activity.user.id === resolvedParams.id
        );
        setUserActivities(activities);
      }
    };
    
    loadUser();
  }, [params]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            ユーザー情報を読み込み中...
          </p>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: User['status']) => {
    const updatedUser = { ...user, status: newStatus };
    setUser(updatedUser);
    // TODO: API call to update user status
    console.log('Status updated:', { userId: user.id, newStatus });
  };

  const handleSaveEdit = () => {
    if (editForm) {
      const updatedUser = { ...user, ...editForm };
      setUser(updatedUser);
      setIsEditing(false);
      // TODO: API call to update user data
      console.log('User updated:', updatedUser);
    }
  };

  const getUserTypeText = (type: User['type']) => {
    switch (type) {
      case 'admin': return '管理者';
      case 'assistant': return 'アシスタント美容師';
      case 'customer': return 'お客様';
      default: return '不明';
    }
  };

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'active': return 'アクティブ';
      case 'inactive': return '非アクティブ';
      case 'suspended': return '停止中';
      default: return '不明';
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
      case 'suspended': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Button & Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-heading-ja">
            ユーザー詳細
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-body-ja">
            {user.name}のアカウント情報と活動履歴
          </p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-8 w-8 text-rose-500" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-rose-100">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                {getStatusText(user.status)}
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
              >
                <PencilIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
            /* Edit Mode */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    名前
                  </label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ユーザータイプ
                  </label>
                  <select
                    value={editForm.type || 'customer'}
                    onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value as User['type'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="customer">お客様</option>
                    <option value="assistant">アシスタント美容師</option>
                    <option value="admin">管理者</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ステータス
                  </label>
                  <select
                    value={editForm.status || 'active'}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as User['status'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="active">アクティブ</option>
                    <option value="inactive">非アクティブ</option>
                    <option value="suspended">停止中</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm(user);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ユーザータイプ</p>
                    <p className="font-medium text-gray-900 dark:text-white">{getUserTypeText(user.type)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">メールアドレス</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">登録日</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDistanceToNow(new Date(user.joinedAt), { addSuffix: true, locale: ja })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">最終活動</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true, locale: ja })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {user.type === 'assistant' ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <StarIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">評価</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.rating ? `${user.rating}/5.0` : 'なし'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CurrencyYenIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">総売上</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.revenue ? `¥${user.revenue.toLocaleString()}` : '¥0'}
                        </p>
                      </div>
                    </div>
                  </>
                ) : null}
                <div className="flex items-center space-x-3">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">予約数</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.bookingsCount || 0}件</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {!isEditing && (
        <div className="flex items-center space-x-4">
          {user.status === 'suspended' ? (
            <button
              onClick={() => handleStatusChange('active')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              アカウント復帰
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange('suspended')}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
              アカウント停止
            </button>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            編集
          </button>
        </div>
      )}

      {/* Activity History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            アクティビティ履歴
          </h3>
        </div>
        <div className="p-6">
          {userActivities.length > 0 ? (
            <div className="space-y-4">
              {userActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <div className="flex-shrink-0 w-2 h-2 bg-rose-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: ja })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                アクティビティ履歴がありません
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}