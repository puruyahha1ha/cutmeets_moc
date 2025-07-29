'use client';

import { useState } from 'react';
import ContentModeration from '../../_components/ContentModeration';
import { mockReports } from '../../_data/mockData';
import type { Report } from '../../_types';
import { 
  FlagIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function ReportsManagementPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);

  const handleApprove = (reportId: string) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId ? { ...report, status: 'resolved' } : report
      )
    );
    console.log('Report resolved:', reportId);
  };

  const handleReject = (reportId: string) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId ? { ...report, status: 'dismissed' } : report
      )
    );
    console.log('Report dismissed:', reportId);
  };

  const handleView = (reportId: string) => {
    console.log('View report:', reportId);
    // TODO: Implement report detail view
  };

  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const investigatingReports = reports.filter(r => r.status === 'investigating').length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;
  const urgentReports = reports.filter(r => r.priority === 'urgent').length;

  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'spam': return 'スパム';
      case 'inappropriate': return '不適切コンテンツ';
      case 'harassment': return 'ハラスメント';
      case 'fake': return '虚偽情報';
      case 'other': return 'その他';
      default: return '不明';
    }
  };

  const reasonStats = reports.reduce((acc, report) => {
    acc[report.reason] = (acc[report.reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-heading-ja">
            報告管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-body-ja">
            ユーザーからの報告の調査・処理・管理
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <FlagIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                総報告数
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reports.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                承認待ち
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingReports}
              </p>
              {pendingReports > 0 && (
                <p className="text-xs text-yellow-600">
                  要対応
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <ExclamationTriangleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                緊急報告
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {urgentReports}
              </p>
              {urgentReports > 0 && (
                <p className="text-xs text-red-500">
                  即座対応
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                解決済み
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resolvedReports}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {reports.length > 0 ? ((resolvedReports / reports.length) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Alerts */}
      {urgentReports > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
                緊急対応が必要な報告があります
              </h3>
              <p className="text-red-700 dark:text-red-300 mt-1">
                {urgentReports}件の緊急報告を即座に確認してください。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Report Type Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          報告理由の分布
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(reasonStats).map(([reason, count]) => (
            <div key={reason} className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {count}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {getReasonText(reason)}
              </div>
              <div className="text-xs text-gray-400">
                {reports.length > 0 ? ((count / reports.length) * 100).toFixed(1) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Processing Time Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          処理状況
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {pendingReports}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              承認待ち
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ 
                  width: reports.length > 0 ? `${(pendingReports / reports.length) * 100}%` : '0%' 
                }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {investigatingReports}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              調査中
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ 
                  width: reports.length > 0 ? `${(investigatingReports / reports.length) * 100}%` : '0%' 
                }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {resolvedReports}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              解決済み
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ 
                  width: reports.length > 0 ? `${(resolvedReports / reports.length) * 100}%` : '0%' 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Moderation Component */}
      <ContentModeration
        type="reports"
        items={reports}
        onApprove={handleApprove}
        onReject={handleReject}
        onView={handleView}
      />
    </div>
  );
}