'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchableItem, SearchResult } from '@/lib/search/search-engine';

interface EnhancedSearchResultsProps {
  searchResult: SearchResult;
  onLoadMore?: () => void;
  onItemClick?: (item: SearchableItem, position: number) => void;
  onToggleFavorite?: (itemId: string | number) => void;
  favorites?: Set<string | number>;
  isAuthenticated?: boolean;
}

type ViewMode = 'list' | 'grid' | 'map';
type DisplayDensity = 'comfortable' | 'compact';

export default function EnhancedSearchResults({
  searchResult,
  onLoadMore,
  onItemClick,
  onToggleFavorite,
  favorites = new Set(),
  isAuthenticated = false
}: EnhancedSearchResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [displayDensity, setDisplayDensity] = useState<DisplayDensity>('comfortable');
  const [expandedItems, setExpandedItems] = useState<Set<string | number>>(new Set());

  // アイテム展開/折りたたみ
  const toggleExpanded = (itemId: string | number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // 価格のフォーマット
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(price);
  };

  // 距離のフォーマット
  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  // 評価の星表示
  const renderStars = (rating?: number, reviewCount?: number) => {
    if (!rating) return null;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${
                i < fullStars 
                  ? 'text-amber-400' 
                  : i === fullStars && hasHalfStar 
                    ? 'text-amber-400' 
                    : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        {reviewCount && (
          <span className="text-xs text-gray-500">
            ({reviewCount.toLocaleString()})
          </span>
        )}
      </div>
    );
  };

  // ビューモード切替ボタン
  const ViewModeToggle = () => (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {[
        { mode: 'list' as ViewMode, icon: '☰', title: 'リスト表示' },
        { mode: 'grid' as ViewMode, icon: '⊞', title: 'グリッド表示' },
        { mode: 'map' as ViewMode, icon: '🗺', title: '地図表示' }
      ].map(({ mode, icon, title }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`p-2 rounded text-sm transition-colors ${
            viewMode === mode
              ? 'bg-white text-pink-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          title={title}
        >
          {icon}
        </button>
      ))}
    </div>
  );

  // 密度切替ボタン
  const DensityToggle = () => (
    <button
      onClick={() => setDisplayDensity(prev => prev === 'comfortable' ? 'compact' : 'comfortable')}
      className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
      title={displayDensity === 'comfortable' ? 'コンパクト表示' : '快適表示'}
    >
      {displayDensity === 'comfortable' ? '⊟' : '⊞'}
    </button>
  );

  // リスト表示のアイテム
  const ListItem = ({ item, index }: { item: SearchableItem; index: number }) => {
    const isExpanded = expandedItems.has(item.id);
    const isFavorite = favorites.has(item.id);
    const isCompact = displayDensity === 'compact';

    return (
      <div className={`bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 ${
        isCompact ? 'p-4' : 'p-6'
      }`}>
        <div className="space-y-4">
          {/* ヘッダー */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-gray-900 mb-2 ${
                isCompact ? 'text-base' : 'text-lg'
              }`}>
                {item.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{item.salon?.name}</span>
                <span>•</span>
                <span>{item.location?.station}</span>
                {item.location?.distance && (
                  <>
                    <span>•</span>
                    <span>{formatDistance(item.location.distance)}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.status === 'recruiting' ? 'bg-green-100 text-green-800' :
                item.status === 'full' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status === 'recruiting' ? '募集中' : 
                 item.status === 'full' ? '満員' : '終了'}
              </span>
              
              {item.urgency === 'urgent' && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  急募
                </span>
              )}
            </div>
          </div>

          {/* アシスタント情報 */}
          {!isCompact && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {item.assistant?.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.assistant?.name}</p>
                  <p className="text-xs text-gray-600">
                    {item.assistant?.level === 'beginner' ? '初級' :
                     item.assistant?.level === 'intermediate' ? '中級' : '上級'}
                    レベル • {item.assistant?.experience}
                  </p>
                </div>
              </div>
              {renderStars(item.rating, item.reviewCount)}
            </div>
          )}

          {/* サービス内容 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 shrink-0">サービス:</span>
              <div className="flex flex-wrap gap-1">
                {item.services.map((service, idx) => (
                  <span key={idx} className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full font-medium">
                    {service}
                  </span>
                ))}
              </div>
            </div>
            
            {!isCompact && (
              <p className="text-sm text-gray-700 leading-relaxed">
                {isExpanded ? item.description : `${item.description.slice(0, 100)}...`}
                {item.description.length > 100 && (
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="text-pink-600 hover:text-pink-700 font-medium ml-1"
                  >
                    {isExpanded ? '閉じる' : 'もっと見る'}
                  </button>
                )}
              </p>
            )}
          </div>

          {/* 詳細情報 */}
          {(isExpanded || isCompact) && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">所要時間:</span>
                  <span className="font-medium">{item.duration}分</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">募集人数:</span>
                  <span className="font-medium">{item.modelCount}名</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">申込数:</span>
                  <span className="font-medium">{item.appliedCount}名</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">投稿:</span>
                  <span className="font-medium">
                    {new Date(item.postedAt).toLocaleDateString('ja-JP', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 条件タグ */}
          {!isCompact && item.requirements && item.requirements.length > 0 && (
            <div className="space-y-1">
              <span className="text-xs text-gray-600">応募条件:</span>
              <div className="flex flex-wrap gap-1">
                {item.requirements.map((req, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 料金とアクション */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-pink-600">
                    {item.price ? formatPrice(item.price) : '要相談'}
                  </span>
                  {item.originalPrice && item.price && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>
                {item.originalPrice && item.price && (
                  <span className="text-xs text-green-600 font-medium">
                    {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isAuthenticated && onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(item.id)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <svg 
                    className={`w-4 h-4 transition-colors ${
                      isFavorite 
                        ? 'text-pink-500 fill-current' 
                        : 'text-gray-600 group-hover:text-pink-500'
                    }`} 
                    fill={isFavorite ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                </button>
              )}
              
              <Link
                href={`/recruitment/${item.id}`}
                onClick={() => onItemClick?.(item, index)}
                className={`px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm font-medium ${
                  item.status === 'recruiting' 
                    ? 'bg-pink-500 text-white hover:bg-pink-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {item.status === 'recruiting' ? '詳細・申込' : '募集終了'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // グリッド表示のアイテム
  const GridItem = ({ item, index }: { item: SearchableItem; index: number }) => {
    const isFavorite = favorites.has(item.id);

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
        <div className="space-y-3">
          {/* ヘッダー */}
          <div className="flex items-start justify-between">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
              {item.title}
            </h3>
            {isAuthenticated && onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(item.id)}
                className="p-1 hover:bg-gray-50 rounded transition-colors"
              >
                <svg 
                  className={`w-4 h-4 ${
                    isFavorite ? 'text-pink-500 fill-current' : 'text-gray-400'
                  }`} 
                  fill={isFavorite ? 'currentColor' : 'none'} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* 場所 */}
          <div className="text-sm text-gray-600">
            {item.location?.station}
            {item.location?.distance && (
              <span className="ml-1">({formatDistance(item.location.distance)})</span>
            )}
          </div>

          {/* サービス */}
          <div className="flex flex-wrap gap-1">
            {item.services.slice(0, 2).map((service, idx) => (
              <span key={idx} className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">
                {service}
              </span>
            ))}
            {item.services.length > 2 && (
              <span className="text-xs text-gray-500">+{item.services.length - 2}</span>
            )}
          </div>

          {/* 評価 */}
          <div className="flex items-center justify-between">
            {renderStars(item.rating, item.reviewCount)}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.status === 'recruiting' ? 'bg-green-100 text-green-800' :
              item.status === 'full' ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {item.status === 'recruiting' ? '募集中' : 
               item.status === 'full' ? '満員' : '終了'}
            </span>
          </div>

          {/* 料金 */}
          <div className="text-center">
            <div className="text-lg font-bold text-pink-600">
              {item.price ? formatPrice(item.price) : '要相談'}
            </div>
            {item.originalPrice && item.price && (
              <div className="text-xs text-gray-500 line-through">
                {formatPrice(item.originalPrice)}
              </div>
            )}
          </div>

          {/* アクションボタン */}
          <Link
            href={`/recruitment/${item.id}`}
            onClick={() => onItemClick?.(item, index)}
            className={`block w-full text-center px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              item.status === 'recruiting' 
                ? 'bg-pink-500 text-white hover:bg-pink-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {item.status === 'recruiting' ? '詳細・申込' : '募集終了'}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 検索結果ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            検索結果 <span className="text-base font-normal text-gray-600">
              ({searchResult.total.toLocaleString()}件)
            </span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            検索時間: {searchResult.searchTime}ms
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <DensityToggle />
          <ViewModeToggle />
        </div>
      </div>

      {/* 検索結果 */}
      {searchResult.items.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">検索結果が見つかりません</h3>
          <p className="text-gray-600 mb-4">検索条件を変更してお試しください</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'space-y-4'
        }>
          {searchResult.items.map((item, index) => 
            viewMode === 'grid' ? (
              <GridItem key={item.id} item={item} index={index} />
            ) : (
              <ListItem key={item.id} item={item} index={index} />
            )
          )}
        </div>
      )}

      {/* もっと読み込むボタン */}
      {onLoadMore && searchResult.items.length < searchResult.total && (
        <div className="text-center pt-6">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            さらに読み込む ({searchResult.total - searchResult.items.length}件)
          </button>
        </div>
      )}
    </div>
  );
}