import React from 'react';

interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean | 'accent' | 'success' | 'warning' | 'error';
  interactive?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
}

const BaseCard: React.FC<BaseCardProps> = ({
  children,
  className = '',
  padding = 'md',
  rounded = 'lg',
  shadow = 'none',
  border = true,
  interactive = false,
  onClick,
  variant = 'default',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const getBorderClass = () => {
    if (border === false) return '';
    if (border === true) return 'border border-gray-200';
    if (border === 'accent') return 'border-2 border-pink-300';
    if (border === 'success') return 'border-2 border-green-300';
    if (border === 'warning') return 'border-2 border-yellow-300';
    if (border === 'error') return 'border-2 border-red-300';
    return 'border border-gray-200';
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-white shadow-md hover:shadow-lg';
      case 'outlined':
        return 'bg-white border-2 border-gray-200';
      case 'glass':
        return 'bg-white/80 backdrop-blur-sm border border-white/20';
      default:
        return 'bg-white';
    }
  };

  const interactiveClasses = interactive 
    ? 'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]'
    : '';

  return (
    <div 
      className={`
        ${getVariantClasses()}
        ${paddingClasses[padding]} 
        ${roundedClasses[rounded]} 
        ${shadowClasses[shadow]} 
        ${getBorderClass()} 
        ${interactiveClasses}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default BaseCard;