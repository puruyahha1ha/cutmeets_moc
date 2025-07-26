'use client';

import { useState, useMemo } from 'react';
import { CatalogCard, CatalogItem } from './CatalogCard';

interface CatalogGridProps {
  items: CatalogItem[];
  type?: 'hair' | 'color' | 'transformation' | 'mens';
  className?: string;
  itemsPerPage?: number;
  showLoadMore?: boolean;
  loading?: boolean;
  emptyState?: {
    title: string;
    description: string;
    action?: {
      text: string;
      href: string;
    };
  };
}

// Loading skeleton component
const GridSkeleton = ({ count = 6, type = 'hair' }: { count?: number; type?: string }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
        {type === 'transformation' ? (
          <div className="grid grid-cols-2 h-48">
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-200"></div>
        )}
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="flex space-x-2">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    ))}
  </div>
);

// Empty state component
const EmptyState = ({ 
  title, 
  description, 
  action, 
  type = 'hair' 
}: { 
  title: string; 
  description: string; 
  action?: { text: string; href: string }; 
  type?: string;
}) => {
  const getEmptyIcon = (type: string) => {
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

  const getButtonColor = (type: string) => {
    switch (type) {
      case 'color':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600';
      case 'transformation':
        return 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600';
      case 'mens':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600';
      default:
        return 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600';
    }
  };

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4 opacity-50">{getEmptyIcon(type)}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <a
          href={action.href}
          className={`inline-block ${getButtonColor(type)} text-white px-6 py-3 rounded-lg font-semibold transition-all`}
        >
          {action.text}
        </a>
      )}
    </div>
  );
};

export const CatalogGrid = ({
  items,
  type = 'hair',
  className = '',
  itemsPerPage = 9,
  showLoadMore = true,
  loading = false,
  emptyState
}: CatalogGridProps) => {
  const [displayCount, setDisplayCount] = useState(itemsPerPage);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Memoized displayed items
  const displayedItems = useMemo(() => {
    return items.slice(0, displayCount);
  }, [items, displayCount]);

  const hasMore = displayCount < items.length;

  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + itemsPerPage, items.length));
  };

  // Sort options
  const [sortBy, setSortBy] = useState('newest');
  
  const sortedItems = useMemo(() => {
    const sorted = [...displayedItems];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
          const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
          return priceA - priceB;
        });
      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
          const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
          return priceB - priceA;
        });
      case 'rating':
        return sorted.sort((a, b) => b.assistant.rating - a.assistant.rating);
      case 'popular':
        return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      default:
        return sorted; // newest - already sorted by default
    }
  }, [displayedItems, sortBy]);

  if (loading) {
    return <GridSkeleton count={itemsPerPage} type={type} />;
  }

  if (items.length === 0 && emptyState) {
    return (
      <EmptyState
        title={emptyState.title}
        description={emptyState.description}
        action={emptyState.action}
        type={type}
      />
    );
  }

  return (
    <div className={className}>
      {/* Results header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {items.length}件の
          {type === 'mens' ? 'メンズスタイル' :
           type === 'color' ? 'カラー' :
           type === 'transformation' ? '変身事例' : 'スタイル'}
          が見つかりました
        </h2>
        <div className="flex items-center space-x-4">
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 ${
              type === 'mens' ? 'focus:ring-blue-500 focus:border-blue-500' :
              type === 'color' ? 'focus:ring-purple-500 focus:border-purple-500' :
              type === 'transformation' ? 'focus:ring-indigo-500 focus:border-indigo-500' :
              'focus:ring-pink-500 focus:border-pink-500'
            }`}
          >
            <option value="newest">新着順</option>
            <option value="price-low">価格の安い順</option>
            <option value="price-high">価格の高い順</option>
            <option value="rating">評価の高い順</option>
            <option value="popular">人気順</option>
          </select>

          {/* View mode toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? `${
                      type === 'mens' ? 'bg-blue-500 text-white' :
                      type === 'color' ? 'bg-purple-500 text-white' :
                      type === 'transformation' ? 'bg-indigo-500 text-white' :
                      'bg-pink-500 text-white'
                    }`
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="グリッド表示"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? `${
                      type === 'mens' ? 'bg-blue-500 text-white' :
                      type === 'color' ? 'bg-purple-500 text-white' :
                      type === 'transformation' ? 'bg-indigo-500 text-white' :
                      'bg-pink-500 text-white'
                    }`
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="リスト表示"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid/List content */}
      <div className={
        viewMode === 'grid'
          ? `grid grid-cols-1 ${type === 'transformation' ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3'} gap-6`
          : 'space-y-4'
      }>
        {sortedItems.map((item) => (
          <CatalogCard
            key={item.id}
            item={item}
            type={type}
            className={viewMode === 'list' ? 'md:flex md:flex-row' : ''}
          />
        ))}
      </div>

      {/* Load more button */}
      {showLoadMore && hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            さらに読み込む ({items.length - displayCount}件)
          </button>
        </div>
      )}

      {/* Results summary */}
      <div className="text-center mt-6 text-sm text-gray-500">
        {displayedItems.length} / {items.length} 件を表示中
      </div>
    </div>
  );
};

export default CatalogGrid;