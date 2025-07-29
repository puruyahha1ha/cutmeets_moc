import React from 'react';
import { ApplicationStatus, PostStatus, BookingStatus, StatusMappings } from './types';

interface StatusBadgeProps {
  status: ApplicationStatus | PostStatus | BookingStatus;
  type: 'application' | 'post' | 'booking';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'soft' | 'outline';
  showDot?: boolean;
  pulse?: boolean;
}

// Enhanced status mappings with more styling options
const statusMappings: Record<string, StatusMappings> = {
  application: {
    pending: { 
      color: 'bg-amber-50 text-amber-700 border-amber-200', 
      text: '審査中',
      dotColor: 'bg-amber-400'
    },
    accepted: { 
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
      text: '認証',
      dotColor: 'bg-emerald-400'
    },
    rejected: { 
      color: 'bg-red-50 text-red-700 border-red-200', 
      text: '拒否',
      dotColor: 'bg-red-400'
    },
  },
  post: {
    active: { 
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
      text: '募集中',
      dotColor: 'bg-emerald-400'
    },
    closed: { 
      color: 'bg-amber-50 text-amber-700 border-amber-200', 
      text: '募集終了',
      dotColor: 'bg-amber-400'
    },
    completed: { 
      color: 'bg-gray-50 text-gray-700 border-gray-200', 
      text: '完了',
      dotColor: 'bg-gray-400'
    },
  },
  booking: {
    completed: { 
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
      text: '完了',
      dotColor: 'bg-emerald-400'
    },
    upcoming: { 
      color: 'bg-blue-50 text-blue-700 border-blue-200', 
      text: '予約中',
      dotColor: 'bg-blue-400'
    },
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type, 
  className = '',
  size = 'md',
  variant = 'soft',
  showDot = false,
  pulse = false
}) => {
  const statusConfig = statusMappings[type]?.[status];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs leading-relaxed text-ja-tight',
    md: 'px-3 py-1 text-xs leading-relaxed text-ja-normal',
    lg: 'px-4 py-1.5 text-sm leading-relaxed text-ja-normal',
  };

  const getVariantClasses = (baseColor: string) => {
    switch (variant) {
      case 'solid':
        return baseColor.replace('bg-', 'bg-').replace('text-', 'text-white bg-').replace('-50', '-500').replace('border-', '');
      case 'outline':
        return `bg-transparent border ${baseColor.replace('bg-', 'border-').replace('-50', '-200')} ${baseColor.replace('bg-', 'text-').replace('-50', '-700')}`;
      default: // soft
        return baseColor;
    }
  };

  if (!statusConfig) {
    return (
      <span className={`inline-flex items-center ${sizeClasses[size]} rounded-full font-medium bg-gray-50 text-gray-700 border border-gray-200 leading-relaxed text-ja-normal ${className}`}>
        {showDot && <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5" />}
        不明
      </span>
    );
  }

  const variantClasses = getVariantClasses(statusConfig.color);
  const pulseClass = pulse ? 'animate-pulse' : '';
  const dotPulseClass = pulse && showDot ? 'animate-pulse' : '';

  return (
    <span className={`
      inline-flex items-center 
      ${sizeClasses[size]} 
      rounded-full 
      font-medium 
      whitespace-nowrap 
      transition-all 
      duration-200
      ${variant === 'outline' ? 'border' : ''}
      ${variantClasses} 
      ${pulseClass}
      ${className}
    `.trim().replace(/\s+/g, ' ')}>
      {showDot && (
        <span className={`
          w-1.5 h-1.5 
          rounded-full 
          mr-1.5 
          ${statusConfig.dotColor} 
          ${dotPulseClass}
        `.trim().replace(/\s+/g, ' ')} />
      )}
      <span className="leading-relaxed text-ja-normal">{statusConfig.text}</span>
    </span>
  );
};

export default StatusBadge;