import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'pink' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  label,
  showPercentage = true,
  color = 'blue',
  size = 'md',
  className = '',
}) => {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          {label && <span className="text-ja-normal">{label}</span>}
          {showPercentage && <span className="text-ja-tight">{Math.round(percentage)}%</span>}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div 
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {current !== undefined && max !== undefined && (
        <div className="text-xs text-gray-500 mt-1 text-ja-tight">
          {current}/{max}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;