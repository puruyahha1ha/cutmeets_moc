'use client'

import { useState, useEffect, useCallback } from 'react';
// Mock search types and utilities
interface SearchQuery {
  query?: string;
  location?: string;
  services?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  status?: 'recruiting' | 'full' | 'closed' | 'all';
  urgency?: 'urgent' | 'normal' | 'all';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  availableDate?: string;
  availableTime?: string;
  maxDistance?: number;
  requirements?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

interface SearchResult {
  items: any[];
  total: number;
  searchTime: number;
  query: string;
  hasMore?: boolean;
  facets?: {
    services: Record<string, number>;
    locations: Record<string, number>;
    priceRanges: Record<string, number>;
  };
  suggestions?: string[];
  filters?: Record<string, any>;
}

// Mock search utilities
const SearchEngine = {
  search: async (query: SearchQuery): Promise<SearchResult> => {
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      items: [],
      total: 0,
      searchTime: 123,
      query: query.query || '',
      hasMore: false,
      facets: {
        services: {},
        locations: {},
        priceRanges: {}
      },
      suggestions: [],
      filters: query
    };
  }
};

const searchCache = {
  get: (key: string) => null,
  set: (key: string, value: any) => {},
  clear: () => {}
};

const searchHistory = {
  add: (query: SearchQuery) => {},
  get: () => [],
  clear: () => {}
};

const searchAnalytics = {
  trackSearch: (query: SearchQuery, results: SearchResult) => {},
  trackClick: (postId: string, position: number) => {},
  trackConversion: (postId: string) => {}
};
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

  // Mock recruitment posts data
  const mockPosts = [
    {
      id: 1,
      title: 'ボブカット練習のモデルさん募集！',
      description: 'ボブカットの技術向上のため、練習台をお願いします。丁寧にカットさせていただきます。',
      salon: { name: 'SALON TOKYO' },
      location: { station: '渋谷駅', distance: 0.5 },
      services: ['カット'],
      price: 1500,
      originalPrice: 3000,
      status: 'recruiting',
      urgency: 'normal',
      duration: 90,
      modelCount: 3,
      appliedCount: 1,
      postedAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      rating: 4.8,
      reviewCount: 156,
      assistant: { name: '田中 美香', level: 'intermediate' }
    },
    {
      id: 2,
      title: 'インナーカラー技術練習モデル募集',
      description: 'インナーカラーのデザイン技術向上のため、モデルを募集しています。ブリーチからカラーまで一連の流れを練習します。',
      salon: { name: 'Hair Studio Grace' },
      location: { station: '新宿駅', distance: 1.2 },
      services: ['カラー', 'ブリーチ'],
      price: 2500,
      originalPrice: 8000,
      status: 'recruiting',
      urgency: 'normal',
      duration: 180,
      modelCount: 2,
      appliedCount: 0,
      postedAt: Date.now() - 30 * 60 * 1000, // 30 minutes ago
      rating: 4.9,
      reviewCount: 203,
      assistant: { name: '佐藤 リナ', level: 'advanced' }
    },
    {
      id: 3,
      title: 'レイヤーカット＋縮毛矯正 練習モデル',
      description: 'くせ毛を活かしたレイヤーカットと部分的な縮毛矯正の技術練習をします。初級レベルのため、スタイリストが常に付きます。',
      salon: { name: 'Beauty Lounge' },
      location: { station: '表参道駅', distance: 0.8 },
      services: ['カット', 'ストレート'],
      price: 1800,
      originalPrice: 4500,
      status: 'full',
      urgency: 'normal',
      duration: 150,
      modelCount: 2,
      appliedCount: 2,
      postedAt: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
      rating: 4.7,
      reviewCount: 89,
      assistant: { name: '鈴木 優子', level: 'beginner' }
    },
    {
      id: 4,
      title: 'メンズフェードカット 練習モデル募集',
      description: 'メンズのフェードカット技術向上のため、練習台をお願いします。バリカンワークを中心に練習します。',
      salon: { name: 'Men\'s Studio K' },
      location: { station: '池袋駅', distance: 2.1 },
      services: ['カット'],
      price: 1000,
      originalPrice: 2500,
      status: 'recruiting',
      urgency: 'urgent',
      duration: 60,
      modelCount: 4,
      appliedCount: 1,
      postedAt: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
      rating: 4.6,
      reviewCount: 67,
      assistant: { name: '高橋 健太', level: 'beginner' }
    },
    {
      id: 5,
      title: 'ハイライト＋グラデーションカラー練習',
      description: '高度なカラー技術（ハイライト＋グラデーション）の練習をします。デザインセンス向上のため、複数色を使用します。',
      salon: { name: 'Color Salon AYA' },
      location: { station: '原宿駅', distance: 1.5 },
      services: ['カラー', 'ブリーチ'],
      price: 3000,
      originalPrice: 12000,
      status: 'recruiting',
      urgency: 'normal',
      duration: 240,
      modelCount: 1,
      appliedCount: 0,
      postedAt: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
      rating: 4.9,
      reviewCount: 124,
      assistant: { name: '山田 彩', level: 'intermediate' }
    }
  ];

  // 検索実行
  const executeSearch = useCallback(async (customFilters?: SearchQuery) => {
    const filters = customFilters || { ...searchFilters, query: searchQuery };
    
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter mock posts based on search criteria
      let filteredPosts = mockPosts.filter(post => {
        // Text search
        if (filters.query && filters.query.trim()) {
          const query = filters.query.toLowerCase();
          const searchText = `${post.title} ${post.description} ${post.assistant.name} ${post.salon.name}`.toLowerCase();
          if (!searchText.includes(query)) return false;
        }

        // Location filter
        if (filters.location && filters.location.trim()) {
          if (!post.location.station.includes(filters.location)) return false;
        }

        // Services filter
        if (filters.services && filters.services.length > 0) {
          const hasService = filters.services.some(service => 
            post.services.some(postService => postService.includes(service))
          );
          if (!hasService) return false;
        }

        // Price range filter
        if (filters.priceMin !== undefined && post.price < filters.priceMin) return false;
        if (filters.priceMax !== undefined && post.price > filters.priceMax) return false;

        // Status filter
        if (filters.status && filters.status !== 'all' && post.status !== filters.status) return false;

        // Urgency filter
        if (filters.urgency && filters.urgency !== 'all' && post.urgency !== filters.urgency) return false;

        // Experience level filter
        if (filters.experienceLevel && filters.experienceLevel !== 'all' && post.assistant.level !== filters.experienceLevel) return false;

        return true;
      });

      // Sort results
      if (filters.sortBy === 'price') {
        filteredPosts.sort((a, b) => filters.sortOrder === 'asc' ? a.price - b.price : b.price - a.price);
      } else if (filters.sortBy === 'rating') {
        filteredPosts.sort((a, b) => filters.sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating);
      } else if (filters.sortBy === 'distance') {
        filteredPosts.sort((a, b) => filters.sortOrder === 'asc' ? a.location.distance - b.location.distance : b.location.distance - a.location.distance);
      } else {
        // Default: sort by posted time (newest first)
        filteredPosts.sort((a, b) => b.postedAt - a.postedAt);
      }

      // Apply pagination
      const startIndex = filters.offset || 0;
      const endIndex = startIndex + (filters.limit || 20);
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

      const mockResult: SearchResult = {
        items: paginatedPosts,
        total: filteredPosts.length,
        searchTime: 123,
        query: filters.query || '',
        hasMore: endIndex < filteredPosts.length,
        facets: {
          services: { 'カット': 3, 'カラー': 3, 'ストレート': 1, 'ブリーチ': 2 },
          locations: { '渋谷駅': 1, '新宿駅': 1, '表参道駅': 1, '池袋駅': 1, '原宿駅': 1 },
          priceRanges: { '1000-2000': 3, '2000-3000': 1, '3000+': 1 }
        },
        suggestions: ['ボブカット', 'インナーカラー', 'メンズカット', 'ハイライト'],
        filters: filters
      };

      setSearchResult(mockResult);
      
      // 検索履歴に追加
      searchHistory.add(filters);
    } catch (err) {
      setError('検索中にエラーが発生しました');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, searchFilters]);

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
              onSelectSearch={(query) => handleFiltersChange({ ...searchFilters, ...query })}
              onClose={() => setShowHistory(false)}
            />
          </div>
        )}

        {/* 保存された検索パネル */}
        {showSavedSearches && (
          <div className="absolute top-32 right-4 pointer-events-auto">
            <SavedSearches
              onSelectSearch={(query) => handleFiltersChange({ ...searchFilters, ...query })}
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