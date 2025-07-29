import React from 'react';
import BaseCard from './BaseCard';
import ActionButton from './ActionButton';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: 'document' | 'plus' | 'search' | 'star' | 'photo';
  variant?: 'application' | 'post' | 'review' | 'general';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon = 'document',
  variant = 'general',
}) => {
  const iconMap = {
    document: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    plus: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    ),
    search: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    ),
    star: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    ),
    photo: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
  };

  const variantColors = {
    application: 'text-blue-500',
    post: 'text-pink-500',
    review: 'text-yellow-500',
    general: 'text-gray-500',
  };

  const actionVariants = {
    application: 'primary' as const,
    post: 'primary' as const,
    review: 'primary' as const,
    general: 'primary' as const,
  };

  return (
    <BaseCard padding="lg" className="text-center">
      <div className="mb-4">
        <svg 
          className={`w-12 h-12 mx-auto ${variantColors[variant]}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {iconMap[icon]}
        </svg>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2 leading-relaxed">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">{description}</p>
      
      {actionText && onAction && (
        <ActionButton 
          variant={actionVariants[variant]}
          size="md"
          onClick={onAction}
        >
          {actionText}
        </ActionButton>
      )}
    </BaseCard>
  );
};

export default EmptyState;