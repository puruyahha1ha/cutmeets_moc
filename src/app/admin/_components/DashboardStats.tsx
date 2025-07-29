'use client';

import { 
  UsersIcon, 
  UserPlusIcon,
  CalendarDaysIcon,
  CurrencyYenIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import type { DashboardStats } from '../_types';

interface DashboardStatsProps {
  stats: DashboardStats;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  color: string;
  prefix?: string;
  suffix?: string;
}

function StatCard({ title, value, change, trend, icon: Icon, color, prefix = '', suffix = '' }: StatCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
      default:
        return <MinusIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {prefix}{formatValue(value)}{suffix}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {Math.abs(change)}%
          </span>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          前月比 {change > 0 ? '+' : change < 0 ? '-' : ''}{Math.abs(change)}%
        </div>
      </div>
    </div>
  );
}

export default function DashboardStatsComponent({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="総ユーザー数"
        value={stats.totalUsers.count}
        change={stats.totalUsers.change}
        trend={stats.totalUsers.trend}
        icon={UsersIcon}
        color="bg-blue-500"
        suffix="人"
      />
      
      <StatCard
        title="アシスタント数"
        value={stats.totalAssistants.count}
        change={stats.totalAssistants.change}
        trend={stats.totalAssistants.trend}
        icon={UserPlusIcon}
        color="bg-green-500"
        suffix="人"
      />
      
      <StatCard
        title="総予約数"
        value={stats.totalBookings.count}
        change={stats.totalBookings.change}
        trend={stats.totalBookings.trend}
        icon={CalendarDaysIcon}
        color="bg-purple-500"
        suffix="件"
      />
      
      <StatCard
        title="総売上"
        value={stats.totalRevenue.amount}
        change={stats.totalRevenue.change}
        trend={stats.totalRevenue.trend}
        icon={CurrencyYenIcon}
        color="bg-rose-500"
        prefix="¥"
      />
    </div>
  );
}