'use client';

import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  UserPlusIcon,
  CalendarDaysIcon,
  CurrencyYenIcon,
  FlagIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import type { ActivityLog } from '../_types';

interface RecentActivityProps {
  activities: ActivityLog[];
}

function getActivityIcon(type: ActivityLog['type']) {
  switch (type) {
    case 'user_registration':
      return <UserPlusIcon className="h-5 w-5 text-green-500" />;
    case 'booking_created':
      return <CalendarDaysIcon className="h-5 w-5 text-blue-500" />;
    case 'payment_completed':
      return <CurrencyYenIcon className="h-5 w-5 text-rose-500" />;
    case 'report_filed':
      return <FlagIcon className="h-5 w-5 text-red-500" />;
    case 'review_posted':
      return <StarIcon className="h-5 w-5 text-yellow-500" />;
    default:
      return <div className="h-5 w-5 bg-gray-400 rounded-full" />;
  }
}

function getActivityColor(type: ActivityLog['type']) {
  switch (type) {
    case 'user_registration':
      return 'bg-green-50 border-green-200';
    case 'booking_created':
      return 'bg-blue-50 border-blue-200';
    case 'payment_completed':
      return 'bg-rose-50 border-rose-200';
    case 'report_filed':
      return 'bg-red-50 border-red-200';
    case 'review_posted':
      return 'bg-yellow-50 border-yellow-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          最近のアクティビティ
        </h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                アクティビティがありません
              </p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {activity.user.name}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          activity.user.type === 'customer' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {activity.user.type === 'customer' ? 'お客様' : 'アシスタント'}
                        </span>
                      </div>
                    </div>
                    <time className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(activity.timestamp), { 
                        addSuffix: true, 
                        locale: ja 
                      })}
                    </time>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {activities.length > 0 && (
          <div className="mt-6 text-center">
            <button className="text-sm text-rose-600 hover:text-rose-500 font-medium">
              すべてのアクティビティを見る
            </button>
          </div>
        )}
      </div>
    </div>
  );
}