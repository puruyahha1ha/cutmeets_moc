import React from 'react';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  variant = 'secondary',
  size = 'sm',
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    success: 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500',
    danger: 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500',
    warning: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-yellow-500',
    info: 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-500',
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs leading-relaxed text-ja-tight',
    sm: 'px-3 py-1 text-xs leading-relaxed text-ja-normal',
    md: 'px-4 py-2 text-sm leading-relaxed text-ja-normal',
    lg: 'px-6 py-3 text-base leading-relaxed text-ja-normal',
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed pointer-events-none' 
    : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        rounded-lg font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-1
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${className}
      `.trim()}
    >
      {children}
    </button>
  );
};

export default ActionButton;