'use client';

import Link from 'next/link';
import { useState } from 'react';

export interface CatalogItem {
  id: number;
  title: string;
  category: string;
  type: string;
  price: string;
  originalPrice: string;
  assistant: {
    name: string;
    salon: string;
    experience: string;
    rating: number;
    avatar?: string | null;
    speciality?: string;
  };
  image?: string | null;
  tags: string[];
  available: boolean;
  practiceLevel: '初級' | '中級' | '上級';
  description: string;
  duration: string;
  [key: string]: any; // For additional properties specific to different catalog types
}

interface CatalogCardProps {
  item: CatalogItem;
  type?: 'hair' | 'color' | 'transformation' | 'mens';
  className?: string;
}

// Generic catalog card component that can be used across different catalog pages
export const CatalogCard = ({ item, type = 'hair', className = '' }: CatalogCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  const getLevelColor = (level: string) => {
    switch (level) {
      case '初級':
        return 'bg-green-100 text-green-800';
      case '中級':
        return 'bg-yellow-100 text-yellow-800';
      case '上級':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradientColor = (type: string) => {
    switch (type) {
      case 'color':
        return 'from-purple-500 to-pink-500';
      case 'transformation':
        return 'from-indigo-500 to-purple-500';
      case 'mens':
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-pink-500 to-red-500';
    }
  };

  const getImagePlaceholder = (type: string) => {
    switch (type) {
      case 'color':
        return '🎨';
      case 'transformation':
        return '✨';
      case 'mens':
        return '💇‍♂️';
      default:
        return '💇‍♀️';
    }
  };

  const getImageBackground = (type: string) => {
    switch (type) {
      case 'color':
        return 'from-purple-100 to-pink-100';
      case 'transformation':
        return 'from-indigo-100 to-purple-100';
      case 'mens':
        return 'from-blue-100 to-indigo-100';
      default:
        return 'from-pink-100 to-purple-100';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      {/* Image section */}
      <div className={`relative w-full h-48 bg-gradient-to-br ${getImageBackground(type)} flex items-center justify-center`}>
        {/* Special handling for transformation type with before/after layout */}
        {type === 'transformation' ? (
          <div className="grid grid-cols-2 w-full h-full">
            <div className="relative flex items-center justify-center">
              <div className="absolute top-2 left-2 bg-gray-700 text-white px-2 py-1 rounded text-xs font-semibold">
                BEFORE
              </div>
              <div className="text-3xl opacity-60">👤</div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded text-xs font-semibold">
                AFTER
              </div>
              <div className="text-3xl opacity-60">✨</div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-4xl opacity-60">{getImagePlaceholder(type)}</div>
            {/* Color preview for color catalog */}
            {type === 'color' && item.colorCode && (
              <div 
                className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-white shadow-md" 
                style={{ backgroundColor: item.colorCode }}
              ></div>
            )}
          </>
        )}
        
        {/* Availability overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              予約受付停止中
            </span>
          </div>
        )}

        {/* Featured badge for transformations */}
        {type === 'transformation' && item.featured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            注目
          </div>
        )}

        {/* Category badge for other types */}
        {type !== 'transformation' && (
          <div className={`absolute top-3 left-3 ${
            type === 'mens' ? 'bg-blue-500' : 
            type === 'color' ? 'bg-purple-500' : 'bg-pink-500'
          } text-white px-2 py-1 rounded text-xs font-semibold`}>
            {item.category}
          </div>
        )}

        {/* Like button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <span className={`text-lg ${isLiked ? 'text-red-500' : 'text-gray-400'}`}>
            {isLiked ? '❤️' : '🤍'}
          </span>
        </button>
      </div>

      {/* Content section */}
      <div className="p-4">
        {/* Title and practice level */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 flex-1">
            {item.title}
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full font-medium ml-2 flex-shrink-0 ${getLevelColor(item.practiceLevel)}`}>
            {item.practiceLevel}
          </span>
        </div>

        {/* Color code for color catalog */}
        {type === 'color' && item.colorCode && (
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.colorCode }}></div>
            <span className="text-sm text-gray-500">{item.colorCode}</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Additional details for specific types */}
        {(type === 'color' || type === 'mens') && (
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-500">
            <div>
              <span className="block font-medium">施術時間</span>
              <span>{item.duration}</span>
            </div>
            <div>
              <span className="block font-medium">
                {type === 'color' ? '持続期間' : 'メンテナンス'}
              </span>
              <span>{item.maintenance || 'N/A'}</span>
            </div>
          </div>
        )}

        {/* Customer comment for transformation type */}
        {type === 'transformation' && item.customer && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-700 line-clamp-2">
              &ldquo;{item.customer.comment}&rdquo;
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {item.customer.age}歳 {item.customer.occupation}
            </p>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center mb-3">
          <span className={`text-2xl font-bold ${
            type === 'mens' ? 'text-blue-500' :
            type === 'color' ? 'text-purple-500' :
            type === 'transformation' ? 'text-indigo-500' : 'text-pink-500'
          }`}>
            {item.price}
          </span>
          <span className="text-sm text-gray-400 line-through ml-2">{item.originalPrice}</span>
          <span className="text-sm text-green-600 font-semibold ml-2">50% OFF</span>
        </div>

        {/* Assistant info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center flex-1">
            <div className={`w-8 h-8 ${
              type === 'mens' ? 'bg-blue-100' :
              type === 'color' ? 'bg-purple-100' :
              type === 'transformation' ? 'bg-indigo-100' : 'bg-pink-100'
            } rounded-full flex items-center justify-center mr-3`}>
              <span className={`text-sm font-semibold ${
                type === 'mens' ? 'text-blue-600' :
                type === 'color' ? 'text-purple-600' :
                type === 'transformation' ? 'text-indigo-600' : 'text-pink-600'
              }`}>
                {item.assistant.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {item.assistant.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {item.assistant.salon}
                {item.assistant.speciality && ` | ${item.assistant.speciality}`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm text-gray-600 ml-1">{item.assistant.rating}</span>
            </div>
            {type === 'transformation' && item.likes && (
              <div className="flex items-center">
                <span className="text-red-400">❤️</span>
                <span className="text-sm text-gray-600 ml-1">{item.likes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action button */}
        <Link
          href={`/booking/${item.assistant.name.replace(/\s+/g, '')}`}
          className={`w-full text-center py-3 rounded-lg font-semibold transition-all block ${
            item.available
              ? `bg-gradient-to-r ${getGradientColor(type)} text-white hover:opacity-90`
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {item.available ? 
            (type === 'transformation' ? 'この美容師に予約する' : '予約する') : 
            '受付停止中'
          }
        </Link>
      </div>
    </div>
  );
};

export default CatalogCard;