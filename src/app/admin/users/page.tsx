'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserManagement from '../_components/UserManagement';
import { mockUsers } from '../_data/mockData';
import type { User } from '../_types';
import { 
  UserPlusIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const router = useRouter();

  const handleUserUpdate = (userId: string, updates: Partial<User>) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };

  const handleUserDelete = (userId: string) => {
    if (confirm('このユーザーを削除してもよろしいですか？')) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    }
  };

  const handleUserView = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleExportUsers = () => {
    // Create CSV data
    const csvData = [
      ['ID', '名前', 'メール', 'タイプ', 'ステータス', '登録日', '最終活動', '予約数', '評価', '売上'],
      ...users.map(user => [
        user.id,
        user.name,
        user.email,
        user.type === 'customer' ? 'お客様' : user.type === 'assistant' ? 'アシスタント' : '管理者',
        user.status === 'active' ? 'アクティブ' : user.status === 'inactive' ? '非アクティブ' : '停止中',
        new Date(user.joinedAt).toLocaleDateString('ja-JP'),
        new Date(user.lastActive).toLocaleDateString('ja-JP'),
        user.bookingsCount || 0,
        user.rating || '',
        user.revenue || ''
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const assistantUsers = users.filter(u => u.type === 'assistant').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-heading-ja">
            ユーザー管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-body-ja">
            プラットフォーム上の全ユーザーの管理と監督
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleExportUsers}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            エクスポート
          </button>
          
          <button
            onClick={() => {/* TODO: Implement import functionality */}}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
            インポート
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <UserPlusIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                総ユーザー数
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                アクティブ
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeUsers}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {((activeUsers / totalUsers) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <UserPlusIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                アシスタント
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {assistantUsers}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {((assistantUsers / totalUsers) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                停止中
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {suspendedUsers}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {totalUsers > 0 ? ((suspendedUsers / totalUsers) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Component */}
      <UserManagement
        users={users}
        onUserUpdate={handleUserUpdate}
        onUserDelete={handleUserDelete}
        onUserView={handleUserView}
      />
    </div>
  );
}