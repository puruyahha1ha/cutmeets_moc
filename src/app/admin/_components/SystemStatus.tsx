'use client';

import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface SystemMetric {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'maintenance';
  value?: string;
  description?: string;
}

const systemMetrics: SystemMetric[] = [
  {
    name: 'APIサーバー',
    status: 'healthy',
    value: '99.9% uptime',
    description: '正常稼働中'
  },
  {
    name: 'データベース',
    status: 'healthy',
    value: '2.3ms avg',
    description: 'レスポンス時間良好'
  },
  {
    name: '決済システム',
    status: 'healthy',
    value: '100% success',
    description: '決済処理正常'
  },
  {
    name: 'メール配信',
    status: 'warning',
    value: '95.2% delivered',
    description: '一部遅延あり'
  },
  {
    name: 'ファイルストレージ',
    status: 'healthy',
    value: '78% used',
    description: '容量十分'
  },
  {
    name: 'CDN',
    status: 'healthy',
    value: '156ms avg',
    description: 'グローバル配信正常'
  }
];

function getStatusIcon(status: SystemMetric['status']) {
  switch (status) {
    case 'healthy':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case 'warning':
      return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
    case 'error':
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    case 'maintenance':
      return <ClockIcon className="h-5 w-5 text-blue-500" />;
    default:
      return <div className="h-5 w-5 bg-gray-400 rounded-full" />;
  }
}

function getStatusColor(status: SystemMetric['status']) {
  switch (status) {
    case 'healthy':
      return 'text-green-600';
    case 'warning':
      return 'text-yellow-600';
    case 'error':
      return 'text-red-600';
    case 'maintenance':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
}

function getStatusBadge(status: SystemMetric['status']) {
  switch (status) {
    case 'healthy':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'maintenance':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
}

function getStatusText(status: SystemMetric['status']) {
  switch (status) {
    case 'healthy':
      return '正常';
    case 'warning':
      return '警告';
    case 'error':
      return 'エラー';
    case 'maintenance':
      return 'メンテナンス';
    default:
      return '不明';
  }
}

export default function SystemStatus() {
  const healthyCount = systemMetrics.filter(metric => metric.status === 'healthy').length;
  const totalCount = systemMetrics.length;
  const overallHealth = (healthyCount / totalCount) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            システム状態
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${
              overallHealth >= 90 ? 'bg-green-500' : 
              overallHealth >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            } animate-pulse`}></div>
            <span className={`text-sm font-medium ${
              overallHealth >= 90 ? 'text-green-600' : 
              overallHealth >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {overallHealth.toFixed(1)}% 正常
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {systemMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center space-x-3">
                {getStatusIcon(metric.status)}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {metric.name}
                  </p>
                  {metric.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {metric.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {metric.value && (
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {metric.value}
                  </span>
                )}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(metric.status)}`}>
                  {getStatusText(metric.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Performance Summary */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">
                全体パフォーマンス
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                過去24時間の平均値
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-900 dark:text-blue-300">
                {overallHealth.toFixed(1)}%
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                稼働率
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}