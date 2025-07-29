import React from 'react';
import BaseCard from './BaseCard';
import ApplicationHeader from './ApplicationHeader';
import ApplicationContent from './ApplicationContent';
import ApplicationActions from './ApplicationActions';
import { Application } from './types';

interface ApplicationCardProps {
  application: Application;
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onChat?: (id: number) => void;
  variant?: 'compact' | 'detailed';
  interactive?: boolean;
  loading?: boolean;
  className?: string;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onAccept,
  onReject,
  onViewDetails,
  onChat,
  variant = 'compact',
  interactive = false,
  loading = false,
  className = '',
}) => {
  // Determine border style based on status
  const getBorderStyle = () => {
    switch (application.status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return true;
    }
  };

  // Handle card click for interactive mode
  const handleCardClick = () => {
    if (interactive && onViewDetails) {
      onViewDetails(application.id);
    }
  };

  return (
    <BaseCard
      variant="elevated"
      border={getBorderStyle()}
      interactive={interactive}
      onClick={handleCardClick}
      className={`
        transition-all 
        duration-300 
        hover:shadow-lg
        ${application.status === 'pending' ? 'ring-1 ring-amber-200 ring-opacity-50' : ''}
        ${loading ? 'opacity-75' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {/* Header with avatar, name, and status */}
      <ApplicationHeader 
        application={application}
        showAvatar={true}
        avatarSize={variant === 'compact' ? 'md' : 'lg'}
        showNewBadge={true}
      />

      {/* Content with details */}
      <ApplicationContent 
        application={application}
        variant={variant}
        showDescription={variant === 'detailed'}
        showRequirements={variant === 'detailed'}
      />

      {/* Action buttons */}
      <ApplicationActions
        application={application}
        onAccept={onAccept}
        onReject={onReject}
        onViewDetails={onViewDetails}
        onChat={onChat}
        loading={loading}
        size={variant === 'compact' ? 'sm' : 'md'}
      />
    </BaseCard>
  );
};

export default ApplicationCard;