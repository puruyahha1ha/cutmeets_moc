import React from 'react';
import BaseCard from './BaseCard';
import StatusBadge from './StatusBadge';
import { Booking } from './types';

interface ReviewCardProps {
  booking: Booking;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ booking }) => {
  return (
    <BaseCard padding="md" rounded="lg">
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate leading-relaxed text-ja-normal">{booking.customer}</h3>
          <p className="text-xs sm:text-sm text-gray-600 truncate leading-relaxed text-ja-tight">{booking.date}</p>
        </div>
        <StatusBadge 
          status={booking.status} 
          type="booking" 
          className="ml-2" 
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div>
          <span className="text-xs sm:text-sm text-gray-500 leading-relaxed text-ja-normal">サービス</span>
          <p className="font-medium text-sm sm:text-base leading-relaxed text-ja-normal">{booking.service}</p>
        </div>
        <div>
          <span className="text-xs sm:text-sm text-gray-500 leading-relaxed text-ja-normal">料金</span>
          <p className="font-medium text-purple-600 text-sm sm:text-base leading-relaxed text-ja-tight">{booking.price}</p>
        </div>
      </div>

      {booking.status === 'completed' && booking.rating && (
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs sm:text-sm text-gray-500 leading-relaxed text-ja-normal">評価:</span>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${i < booking.rating! ? 'fill-current' : 'text-gray-300'}`} 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          {booking.review && (
            <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg leading-relaxed text-ja-relaxed">
              "{booking.review}"
            </p>
          )}
        </div>
      )}
    </BaseCard>
  );
};

export default ReviewCard;