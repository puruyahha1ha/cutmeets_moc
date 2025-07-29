import React from 'react';
import { Application } from './types';

interface ApplicationContentProps {
  application: Application;
  showDescription?: boolean;
  showRequirements?: boolean;
  maxDescriptionLength?: number;
  variant?: 'compact' | 'detailed';
}

const ApplicationContent: React.FC<ApplicationContentProps> = ({
  application,
  showDescription = true,
  showRequirements = false,
  maxDescriptionLength = 120,
  variant = 'compact',
}) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (variant === 'compact') {
    return (
      <div className="mb-4">
        {/* Working Hours / Time Info */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 font-medium leading-relaxed text-ja-normal">
              {application.workingHours}
            </p>
            {application.salary && (
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md">
                {application.salary}
              </span>
            )}
          </div>
          {application.location && (
            <p className="text-xs text-gray-500 mt-1 flex items-center leading-relaxed text-ja-tight">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {application.location}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 space-y-3">
      {/* Working Hours / Time Info */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-900 leading-relaxed text-ja-normal">施術時間</h4>
          {application.salary && (
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md font-medium">
              {application.salary}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed text-ja-normal">
          {application.workingHours}
        </p>
        {application.location && (
          <p className="text-xs text-gray-500 mt-2 flex items-center leading-relaxed text-ja-tight">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {application.location}
          </p>
        )}
      </div>

      {/* Description */}
      {showDescription && application.description && (
        <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100">
          <h4 className="text-sm font-medium text-gray-900 mb-2 leading-relaxed text-ja-normal">詳細</h4>
          <p className="text-sm text-gray-700 leading-loose text-ja-relaxed">
            {truncateText(application.description, maxDescriptionLength)}
          </p>
        </div>
      )}

      {/* Requirements */}
      {showRequirements && application.requirements && application.requirements.length > 0 && (
        <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100">
          <h4 className="text-sm font-medium text-gray-900 mb-2 leading-relaxed text-ja-normal">条件</h4>
          <ul className="space-y-1">
            {application.requirements.map((requirement, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start leading-relaxed">
                <span className="text-amber-500 mr-2 mt-0.5">•</span>
                <span className="leading-relaxed text-ja-normal">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApplicationContent;