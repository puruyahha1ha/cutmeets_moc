'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  CurrencyYenIcon, 
  CogIcon,
  ChartBarIcon,
  FlagIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { name: 'ダッシュボード', href: '/admin', icon: HomeIcon },
  { name: 'ユーザー管理', href: '/admin/users', icon: UsersIcon },
  { name: '投稿管理', href: '/admin/content/posts', icon: DocumentTextIcon },
  { name: 'レビュー管理', href: '/admin/content/reviews', icon: ChartBarIcon },
  { name: '報告管理', href: '/admin/content/reports', icon: FlagIcon, badge: 3 },
  { name: '財務管理', href: '/admin/finance', icon: CurrencyYenIcon },
  { name: '通知管理', href: '/admin/notifications', icon: BellIcon },
  { name: 'システム設定', href: '/admin/settings', icon: CogIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40">
      {/* Logo & Header */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <ShieldCheckIcon className="h-8 w-8 text-rose-500" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6">
        <div className="px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                  }
                `}
              >
                <div className="flex items-center">
                  <item.icon 
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-rose-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} 
                  />
                  {item.name}
                </div>
                {item.badge && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* System Status */}
        <div className="mt-8 px-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-400">
                  システム正常
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">
                  全サービス稼働中
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="mt-4 px-4">
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30 rounded-md transition-colors">
              <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
              メンテナンスモード
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}