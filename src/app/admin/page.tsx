'use client';

import { useEffect, useState } from 'react';
import DashboardStats from './_components/DashboardStats';
import RecentActivity from './_components/RecentActivity';
import QuickActions from './_components/QuickActions';
import SystemStatus from './_components/SystemStatus';
import { 
  mockDashboardStats, 
  mockActivityLogs,
  mockNotifications 
} from './_data/mockData';
import { BellIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [stats, setStats] = useState(mockDashboardStats);
  const [activities, setActivities] = useState(mockActivityLogs);
  const [notifications, setNotifications] = useState(mockNotifications.filter(n => !n.read));

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update stats periodically (simulate real-time data)
      setStats(prevStats => ({
        ...prevStats,
        totalUsers: {
          ...prevStats.totalUsers,
          count: prevStats.totalUsers.count + Math.floor(Math.random() * 3)
        }
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-heading-ja">
            ダッシュボード
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-body-ja">
            Cutmeetsプラットフォームの管理ダッシュボードです
          </p>
        </div>
        
        {/* Urgent Notifications */}
        {notifications.length > 0 && (
          <div className="flex items-center space-x-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-red-800 dark:text-red-400">
                  {notifications.length}件の未読通知
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Stats */}
      <DashboardStats stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
        
        {/* Right Column - System Status */}
        <div className="lg:col-span-1">
          <SystemStatus />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Reports Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                未処理報告
              </h3>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats.activeReports.count}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                緊急: {stats.activeReports.urgent}件
              </p>
            </div>
            <BellIcon className="h-12 w-12 text-red-200" />
          </div>
        </div>

        {/* Monthly Growth */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                月間成長率
              </h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                +{((stats.totalUsers.change + stats.totalRevenue.change) / 2).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ユーザー & 売上平均
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <div className="h-6 w-6 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                プラットフォーム健全性
              </h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                99.9%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                稼働時間
              </p>
            </div>
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
