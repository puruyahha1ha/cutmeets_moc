'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data and types
interface SearchFilters {
  location?: string;
  services?: string[];
  priceMax?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
  query?: string;
}

interface RecruitmentPost {
  id: string;
  title: string;
  description: string;
  services: string[];
  duration: number;
  price: number;
  originalPrice: number;
  discount: number;
  requirements: string[];
  modelCount: number;
  appliedCount: number;
  status: 'recruiting' | 'full' | 'closed';
  urgency: 'urgent' | 'normal';
  createdAt: string;
  assistant: {
    id: string;
    name: string;
    experienceLevel: string;
    salon: {
      name: string;
      station: string;
    };
  };
}

const MOCK_RECRUITMENT_POSTS: RecruitmentPost[] = [
  {
    id: '1',
    title: 'ボブカット練習のモデルさん募集！',
    description: 'ボブカットの技術向上のため、練習台をお願いします。丁寧にカットさせていただきます。初心者の方でも大歓迎です！',
    services: ['カット'],
    duration: 90,
    price: 1500,
    originalPrice: 3000,
    discount: 50,
    requirements: ['肩より長い髪', 'ダメージが少ない髪'],
    modelCount: 3,
    appliedCount: 1,
    status: 'recruiting',
    urgency: 'normal',
    createdAt: '2024-01-20T10:00:00Z',
    assistant: {
      id: 'assistant1',
      name: '田中 美香',
      experienceLevel: '中級',
      salon: {
        name: 'SALON TOKYO',
        station: '渋谷駅'
      }
    }
  },
  {
    id: '2',
    title: 'カラーモデル急募！グラデーションカラー',
    description: 'グラデーションカラーの練習をさせていただけるモデルさんを探しています。カラー経験豊富です。',
    services: ['カラー'],
    duration: 120,
    price: 3000,
    originalPrice: 6000,
    discount: 50,
    requirements: ['ブリーチ可能', '3時間以上の時間確保'],
    modelCount: 2,
    appliedCount: 0,
    status: 'recruiting',
    urgency: 'urgent',
    createdAt: '2024-01-19T15:30:00Z',
    assistant: {
      id: 'assistant2',
      name: '山田 翔太',
      experienceLevel: '上級',
      salon: {
        name: 'hair studio CHANGE',
        station: '新宿駅'
      }
    }
  },
  {
    id: '3',
    title: 'パーマモデル募集中',
    description: 'デジタルパーマの技術向上のため、モデルさんを募集しています。しっかりカウンセリングして施術します。',
    services: ['パーマ'],
    duration: 150,
    price: 2000,
    originalPrice: 5000,
    discount: 60,
    requirements: ['パーマ経験あり', 'ダメージレベル中程度まで'],
    modelCount: 1,
    appliedCount: 1,
    status: 'full',
    urgency: 'normal',
    createdAt: '2024-01-18T09:00:00Z',
    assistant: {
      id: 'assistant3',
      name: '佐藤 あい',
      experienceLevel: '中級',
      salon: {
        name: 'Beauty Lounge',
        station: '池袋駅'
      }
    }
  }
];

interface SearchInterfaceProps {
  stations: string[];
  services: Array<{ id: string; label: string }>;
  isAuthenticated?: boolean;
}

export default function SearchInterface({ stations, services, isAuthenticated = false }: SearchInterfaceProps) {
  const [recruitmentPosts, setRecruitmentPosts] = useState<RecruitmentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ current: 1, total: 1, totalCount: 0 });
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: '',
    services: [],
    priceMax: undefined,
    status: 'recruiting',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // 検索実行
  const executeSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API response simulation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      let filteredPosts = [...MOCK_RECRUITMENT_POSTS];
      
      // Apply text search filter
      if (searchQuery) {
        filteredPosts = filteredPosts.filter(post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.assistant.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply location filter
      if (searchFilters.location) {
        filteredPosts = filteredPosts.filter(post =>
          post.assistant.salon.station.includes(searchFilters.location!)
        );
      }
      
      // Apply services filter
      if (searchFilters.services && searchFilters.services.length > 0) {
        filteredPosts = filteredPosts.filter(post =>
          post.services.some(service => searchFilters.services!.includes(service))
        );
      }
      
      // Apply price filter
      if (searchFilters.priceMax) {
        filteredPosts = filteredPosts.filter(post => post.price <= searchFilters.priceMax!);
      }
      
      // Apply status filter
      if (searchFilters.status) {
        filteredPosts = filteredPosts.filter(post => post.status === searchFilters.status);
      }
      
      // Apply sorting
      filteredPosts.sort((a, b) => {
        if (searchFilters.sortBy === 'price') {
          return searchFilters.sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
        } else {
          // Default to date sorting
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return searchFilters.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        }
      });
      
      setRecruitmentPosts(filteredPosts);
      setPagination({ current: 1, total: 1, totalCount: filteredPosts.length });
    } catch (err) {
      setError('検索中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // 初回ロードと検索条件変更時に検索実行
  useEffect(() => {
    executeSearch();
  }, [searchFilters]);

  // 検索クエリのデバウンス
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        executeSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFilterChange = (filterType: string, value: string | string[]) => {
    setSearchFilters(prev => ({
      ...prev,
      [filterType]: value,
      page: 1 // フィルター変更時はページを1に戻す
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchFilters(prev => ({
      ...prev,
      page
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      location: '',
      services: [],
      priceMax: undefined,
      status: 'recruiting',
      sortBy: 'date',
      sortOrder: 'desc',
      page: 1,
      limit: 20
    });
    setSearchQuery('');
  };

  return (
    <>
      {/* 検索バー */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="カットモデル募集案件を検索"
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm sm:text-base"
              />
              <svg className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 高度なフィルター */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-6">
              {/* 基本フィルター */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">基本条件</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 駅・場所選択 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">場所</label>
                    <select
                      value={searchFilters.location || ''}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                    >
                      <option value="">すべて</option>
                      {stations.map((station) => (
                        <option key={station} value={station}>{station}</option>
                      ))}
                    </select>
                  </div>

                  {/* サービス選択 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">サービスタイプ</label>
                    <select
                      value={searchFilters.services?.[0] || ''}
                      onChange={(e) => handleFilterChange('services', e.target.value ? [e.target.value] : [])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                    >
                      <option value="">すべて</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.label}>{service.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* 予算上限 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">予算上限</label>
                    <select
                      value={searchFilters.priceMax || ''}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                    >
                      <option value="">指定なし</option>
                      <option value="2000">〜2,000円</option>
                      <option value="3000">〜3,000円</option>
                      <option value="4000">〜4,000円</option>
                      <option value="5000">〜5,000円</option>
                    </select>
                  </div>

                  {/* 募集状況 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">募集状況</label>
                    <select
                      value={searchFilters.status || ''}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                    >
                      <option value="">すべて</option>
                      <option value="recruiting">募集中</option>
                      <option value="full">満員</option>
                      <option value="closed">終了</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 並び替え */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">並び替え</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">並び順</label>
                    <select
                      value={searchFilters.sortBy || 'date'}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                    >
                      <option value="date">投稿日順</option>
                      <option value="price">料金順</option>
                      <option value="distance">距離順</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 注意事項 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  カットモデルについて
                </h3>
                <div className="text-blue-800 text-xs space-y-1">
                  <p>• アシスタント美容師の技術向上のための練習に参加いただくサービスです</p>
                  <p>• 全ての施術は技術指導のもと安全に行われます</p>
                  <p>• 通常料金の約50-80%OFFで美容サービスを体験できます</p>
                  <p>• 初心者の方は上級レベルのアシスタントの案件をお選びください</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* フィルタークリア */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={clearFilters}
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          フィルターをクリア
        </button>
        <div className="text-sm text-gray-600">
          {loading ? '検索中...' : `${pagination.totalCount}件の募集案件`}
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* 検索結果ヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              カットモデル募集案件 <span className="text-sm font-normal text-gray-600">({loading ? '検索中...' : `${pagination.totalCount}件`})</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">アシスタント美容師の練習に参加して、お得に美容サービスを体験しませんか？</p>
          </div>
        </div>

        {/* 検索結果リスト */}
        <div className="space-y-3 sm:space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center animate-spin">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">検索中...</h3>
              <p className="text-gray-600">募集案件を検索しています</p>
            </div>
          ) : recruitmentPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">検索結果が見つかりません</h3>
              <p className="text-gray-600 mb-4">検索条件を変更してお試しください</p>
              <button
                onClick={clearFilters}
                className="text-pink-500 hover:text-pink-600 font-medium"
              >
                フィルターをリセット
              </button>
            </div>
          ) : (
            recruitmentPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* ヘッダー情報 */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{post.title}</h3>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <span>{post.assistant?.salon?.name || 'サロン名未設定'}</span>
                      <span>•</span>
                      <span>{post.assistant?.salon?.station || '場所未設定'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'recruiting' ? 'bg-green-100 text-green-800' :
                      post.status === 'full' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status === 'recruiting' ? '募集中' : 
                       post.status === 'full' ? '募集終了' : '終了'}
                    </span>
                    <span className="text-xs text-gray-500">{post.createdAt}</span>
                  </div>
                </div>

                {/* アシスタント情報と評価 */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {post.assistant.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.assistant.name}</p>
                      <p className="text-xs text-gray-600">{post.assistant.experienceLevel}レベル • {post.assistant.salon.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {post.urgency === 'urgent' ? '急募' : '通常募集'}
                    </span>
                  </div>
                </div>

                {/* サービス内容 */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm text-gray-600 shrink-0">サービス:</span>
                    <div className="flex flex-wrap gap-1">
                      {post.services.map((service, index) => (
                        <span key={index} className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full font-medium">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{post.description}</p>
                </div>

                {/* 募集条件 */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">所要時間:</span>
                      <span className="font-medium">{post.duration}分</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">募集人数:</span>
                      <span className="font-medium">{post.modelCount}名</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">申込数:</span>
                      <span className="font-medium">{post.appliedCount}名</span>
                    </div>
                  </div>
                </div>

                {/* 条件タグ */}
                {post.requirements.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs text-gray-600">条件:</span>
                    <div className="flex flex-wrap gap-1">
                      {post.requirements.map((req, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
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
                        <span className="text-lg font-bold text-pink-600">¥{post.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 line-through">¥{post.originalPrice.toLocaleString()}</span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">
                        {post.discount}%OFF
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isAuthenticated && (
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group">
                        <svg className="w-4 h-4 text-gray-600 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    )}
                    <Link
                      href={`/recruitment/${post.id}`}
                      className={`px-4 sm:px-6 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium ${
                        post.status === 'recruiting' 
                          ? 'bg-pink-500 text-white hover:bg-pink-600' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {post.status === 'recruiting' ? '詳細・申込' : '募集終了'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        {/* ページネーション */}
        {pagination.total > 1 && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button 
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current <= 1}
                className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                前へ
              </button>
              
              {/* ページ番号 */}
              {Array.from({ length: Math.min(5, pagination.total) }, (_, i) => {
                const pageNum = i + Math.max(1, pagination.current - 2);
                if (pageNum > pagination.total) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                      pageNum === pagination.current
                        ? 'bg-pink-500 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current >= pagination.total}
                className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                次へ
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}