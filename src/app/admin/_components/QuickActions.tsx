'use client';

import Link from 'next/link';
import { 
  UserPlusIcon,
  DocumentTextIcon,
  FlagIcon,
  CogIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface QuickAction {
  name: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
  badge?: number;
}

const quickActions: QuickAction[] = [
  {
    name: 'ユーザー管理',
    description: 'アカウント状態や詳細を確認',
    href: '/admin/users',
    icon: UserPlusIcon,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    name: '投稿管理', 
    description: '募集投稿の承認・管理',
    href: '/admin/content/posts',
    icon: DocumentTextIcon,
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    name: '報告処理',
    description: '報告された内容を確認',
    href: '/admin/content/reports',
    icon: FlagIcon,
    color: 'bg-red-500 hover:bg-red-600',
    badge: 3
  },
  {
    name: 'システム設定',
    description: 'プラットフォーム設定を変更',
    href: '/admin/settings',
    icon: CogIcon,
    color: 'bg-gray-500 hover:bg-gray-600'
  },
  {
    name: 'レポート生成',
    description: '分析レポートを作成',
    href: '/admin/reports',
    icon: ChartBarIcon,
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    name: 'メンテナンス',
    description: 'システムメンテナンス',
    href: '/admin/maintenance',
    icon: ExclamationTriangleIcon,
    color: 'bg-orange-500 hover:bg-orange-600'
  }
];

export default function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          クイックアクション
        </h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative group block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${action.color} transition-colors`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                      {action.name}
                    </p>
                    {action.badge && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}