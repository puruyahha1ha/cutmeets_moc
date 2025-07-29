import React from 'react';
import { Application } from './types';

interface ApplicationActionsProps {
  application: Application;
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onChat?: (id: number) => void;
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const ApplicationActions: React.FC<ApplicationActionsProps> = ({
  application,
  onAccept,
  onReject,
  onViewDetails,
  onChat,
  variant = 'horizontal',
  size = 'md',
  loading = false,
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs leading-relaxed',
    md: 'px-4 py-2 text-sm leading-relaxed',
    lg: 'px-6 py-2.5 text-base leading-relaxed',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const containerClasses = variant === 'horizontal' 
    ? 'flex items-center justify-between'
    : 'flex flex-col space-y-2';

  const buttonGroupClasses = variant === 'horizontal'
    ? 'flex items-center space-x-2'
    : 'flex flex-col space-y-2 w-full';

  const getActionLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'モデル審査';
      case 'accepted': return 'プロフィール';
      case 'rejected': return '';
      default: return '';
    }
  };

  const renderButton = (
    onClick: (() => void) | undefined,
    children: React.ReactNode,
    buttonVariant: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' = 'primary',
    disabled = false
  ) => {
    const variantClasses = {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm',
      danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
      ghost: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[buttonVariant]}
          font-medium
          rounded-lg
          transition-all
          duration-200
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-blue-500
          disabled:opacity-50
          disabled:cursor-not-allowed
          flex
          items-center
          justify-center
          space-x-1.5
          ${variant === 'horizontal' ? '' : 'w-full'}
        `.trim().replace(/\s+/g, ' ')}
      >
        {loading ? (
          <svg className={`${iconSizes[size]} animate-spin`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {children}
      </button>
    );
  };

  return (
    <div className={containerClasses}>
      {/* Action Label */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500 leading-relaxed">
          {getActionLabel(application.status)}
        </span>
      </div>

      {/* Action Buttons */}
      <div className={buttonGroupClasses}>
        {application.status === 'pending' && (
          <>
            {renderButton(
              () => onAccept && onAccept(application.id),
              <>
                <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="leading-relaxed">認証</span>
              </>,
              'success'
            )}
            {renderButton(
              () => onReject && onReject(application.id),
              <>
                <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="leading-relaxed">拒否</span>
              </>,
              'danger'
            )}
          </>
        )}


        {(application.status === 'accepted' || application.status === 'rejected') && (
          renderButton(
            () => onViewDetails && onViewDetails(application.id),
            <>
              <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="leading-relaxed">詳細</span>
            </>,
            'ghost'
          )
        )}
      </div>
    </div>
  );
};

export default ApplicationActions;