'use client'

import { useState, useEffect, useCallback } from 'react';
import { SearchQuery, SearchResult, SearchEngine } from '@/lib/search/search-engine';
import { searchCache, searchHistory } from '@/lib/search/search-cache';
import { searchAnalytics } from '@/lib/search/search-analytics';
import SmartSearchBox from './SmartSearchBox';
import AdvancedSearchFilters from './AdvancedSearchFilters';
import EnhancedSearchResults from './EnhancedSearchResults';
import SearchHistory from './SearchHistory';
import SavedSearches from './SavedSearches';
import SearchSuggestions from './SearchSuggestions';
import MapView from './MapView';

interface EnhancedSearchInterfaceProps {
  stations: string[];
  services: Array<{ id: string; label: string }>;
  isAuthenticated?: boolean;
}

export default function EnhancedSearchInterface({
  stations,
  services,
  isAuthenticated = false
}: EnhancedSearchInterfaceProps) {
  // 検索状態
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchQuery>({
    query: '',
    location: '',
    services: [],
    priceMin: undefined,
    priceMax: undefined,
    rating: undefined,
    status: 'recruiting',
    urgency: 'all',
    experienceLevel: 'all',
    availableDate: '',
    availableTime: '',
    maxDistance: undefined,
    requirements: [],
    sortBy: 'relevance',
    sortOrder: 'desc',
    limit: 20,
    offset: 0
  });

  // UI状態
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());

  // セッション管理
  const [sessionId] = useState(() => 
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  // 検索実行
  const executeSearch = useCallback(async (customFilters?: SearchQuery) => {
    const filters = customFilters || { ...searchFilters, query: searchQuery };
    
    setIsLoading(true);
    setError(null);

    try {
      // キャッシュをチェック
      const cached = searchCache.get(filters);
      if (cached) {
        setSearchResult(cached);
        setIsLoading(false);
        return;
      }

      // API呼び出し
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            queryParams.set(key, value.join(','));
          } else {
            queryParams.set(key, String(value));
          }
        }
      });

      const response = await fetch(`/api/search?${queryParams.toString()}`, {
        headers: {
          'x-session-id': sessionId
        }
      });

      const data = await response.json();

      if (data.success) {
        setSearchResult(data.data);
        
        // 検索履歴に追加
        searchHistory.add(filters, data.data.total);
      } else {
        setError(data.error || '検索に失敗しました');
      }
    } catch (err) {
      setError('検索中にエラーが発生しました');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, searchFilters, sessionId]);

  // 初回検索の実行
  useEffect(() => {
    executeSearch();
  }, []);

  // 検索クエリ変更時のデバウンス
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== searchFilters.query) {
        setSearchFilters(prev => ({ ...prev, query: searchQuery }));
        executeSearch({ ...searchFilters, query: searchQuery });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchFilters, executeSearch]);

  // フィルター変更時の検索実行
  const handleFiltersChange = (newFilters: SearchQuery) => {
    setSearchFilters(newFilters);
    executeSearch(newFilters);
  };

  // 検索提案の選択
  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  // スマートフィルターの適用
  const handleApplySmartFilter = (filters: Partial<SearchQuery>) => {
    const newFilters = { ...searchFilters, ...filters };
    setSearchFilters(newFilters);
    executeSearch(newFilters);
    setShowSuggestions(false);
  };

  // アイテムクリックの追跡
  const handleItemClick = (item: any, position: number) => {
    if (searchResult) {
      searchAnalytics.trackClick(
        `search_${Date.now()}`, // 実際にはsearchResultにeventIdが必要
        item.id,
        position
      );
    }
  };

  // お気に入りの切り替え
  const handleToggleFavorite = (itemId: string | number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
    
    // ローカルストレージに保存
    try {
      localStorage.setItem('cutmeets_favorites', JSON.stringify([...newFavorites]));
    } catch (error) {
      console.warn('Failed to save favorites:', error);
    }
  };

  // さらに読み込む
  const handleLoadMore = () => {
    if (searchResult && searchFilters.offset !== undefined) {
      const newFilters = {
        ...searchFilters,
        offset: searchFilters.offset + (searchFilters.limit || 20)
      };
      executeSearch(newFilters);
    }
  };

  // お気に入りの読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cutmeets_favorites');
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.warn('Failed to load favorites:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 検索バー */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            {/* メイン検索ボックス */}
            <div className="flex-1 relative">
              <SmartSearchBox
                query={searchQuery}
                onQueryChange={setSearchQuery}
                onSearch={() => executeSearch()}
                isLoading={isLoading}
                placeholder="例: カット モデル 渋谷"
              />
              
              {/* 検索提案 */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 z-50">
                  <SearchSuggestions
                    query={searchQuery}
                    onSelectSuggestion={handleSelectSuggestion}
                    onApplySmartFilter={handleApplySmartFilter}
                  />
                </div>
              )}
            </div>

            {/* アクションボタン */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`p-3 border rounded-xl transition-colors ${
                  showAdvancedFilters
                    ? 'border-pink-500 bg-pink-50 text-pink-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                title="詳細検索"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </button>

              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                title="検索履歴"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              <button
                onClick={() => setShowSavedSearches(!showSavedSearches)}
                className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                title="保存された検索"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>

              <button
                onClick={() => setShowMap(!showMap)}
                className={`p-3 border rounded-xl transition-colors ${
                  showMap
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                title="地図表示"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* アクティブフィルターの表示 */}
          {(searchFilters.location || searchFilters.services?.length || searchFilters.priceMax || searchFilters.experienceLevel !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-3">
              {searchFilters.location && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  {searchFilters.location}
                  <button
                    onClick={() => handleFiltersChange({ ...searchFilters, location: '' })}
                    className="ml-1 text-pink-600 hover:text-pink-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchFilters.services?.map(service => (
                <span key={service} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {service}
                  <button
                    onClick={() => {
                      const newServices = searchFilters.services?.filter(s => s !== service) || [];
                      handleFiltersChange({ ...searchFilters, services: newServices });
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              {searchFilters.priceMax && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  〜{searchFilters.priceMax.toLocaleString()}円
                  <button
                    onClick={() => handleFiltersChange({ ...searchFilters, priceMax: undefined })}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchFilters.experienceLevel !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {searchFilters.experienceLevel === 'beginner' ? '初級' :
                   searchFilters.experienceLevel === 'intermediate' ? '中級' : '上級'}
                  <button
                    onClick={() => handleFiltersChange({ ...searchFilters, experienceLevel: 'all' })}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* サイドパネル（履歴、保存された検索など） */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* 検索履歴パネル */}
        {showHistory && (
          <div className="absolute top-32 right-4 pointer-events-auto">
            <SearchHistory
              onSelectSearch={handleFiltersChange}
              onClose={() => setShowHistory(false)}
            />
          </div>
        )}

        {/* 保存された検索パネル */}
        {showSavedSearches && (
          <div className="absolute top-32 right-4 pointer-events-auto">
            <SavedSearches
              onSelectSearch={handleFiltersChange}
              currentQuery={searchFilters}
              onClose={() => setShowSavedSearches(false)}
            />
          </div>
        )}
      </div>

      {/* 詳細フィルター */}
      {showAdvancedFilters && (
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto">
            <AdvancedSearchFilters
              filters={searchFilters}
              onFiltersChange={handleFiltersChange}
              stations={stations}
              services={services}
            />
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* 地図表示 */}
        {showMap && searchResult && (
          <div className="mb-6">
            <MapView
              items={searchResult.items}
              onItemSelect={(item) => handleItemClick(item, 0)}
              height="500px"
            />
          </div>
        )}

        {/* 検索結果 */}
        {searchResult && (
          <EnhancedSearchResults
            searchResult={searchResult}
            onLoadMore={handleLoadMore}
            onItemClick={handleItemClick}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            isAuthenticated={isAuthenticated}
          />
        )}

        {/* ローディング状態 */}
        {isLoading && !searchResult && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">検索中...</h3>
            <p className="text-gray-600">最適な募集案件を検索しています</p>
          </div>
        )}
      </main>
    </div>
  );
}