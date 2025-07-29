import React from 'react';
import StatusBadge from './StatusBadge';
import { Application } from './types';

interface ApplicationHeaderProps {
  application: Application;
  showAvatar?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
  showNewBadge?: boolean;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  application,
  showAvatar = true,
  avatarSize = 'md',
  showNewBadge = true,
}) => {
  const avatarSizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const isNew = application.status === 'pending' && showNewBadge;

  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        {showAvatar && (
          <div className={`
            ${avatarSizes[avatarSize]} 
            bg-gradient-to-br from-pink-100 to-pink-200 
            rounded-xl 
            flex-shrink-0 
            flex 
            items-center 
            justify-center
            border-2 
            border-white 
            shadow-sm
          `}>
            <span className="text-pink-600 font-semibold text-sm leading-none">
              {application.jobTitle.charAt(0)}
            </span>
          </div>
        )}
        
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-900 truncate mb-1 leading-relaxed text-ja-normal">
            {application.jobTitle}
          </h3>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-600 truncate leading-relaxed text-ja-normal">
              {application.salon}
            </p>
            <span className="text-gray-300">•</span>
            <p className="text-xs text-gray-500 whitespace-nowrap leading-relaxed text-ja-tight">
              {application.workingHours}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
        {isNew && (
          <span className="
            bg-gradient-to-r from-pink-500 to-rose-500 
            text-white 
            text-xs 
            px-2.5 
            py-1 
            rounded-full 
            font-medium 
            shadow-sm
            animate-pulse
          ">
            NEW
          </span>
        )}
        <StatusBadge 
          status={application.status} 
          type="application" 
          showDot={application.status === 'pending'}
          pulse={application.status === 'pending'}
        />
      </div>
    </div>
  );
};

export default ApplicationHeader;