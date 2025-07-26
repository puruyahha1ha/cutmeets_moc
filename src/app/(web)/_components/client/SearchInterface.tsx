'use client'

import { useState } from 'react';
import Link from 'next/link';

interface Hairdresser {
  id: number;
  name: string;
  salon: string;
  station: string;
  rating: number;
  reviewCount: number;
  price: string;
  hourlyRate: number;
  specialties: string[];
  image: string;
  availableToday: boolean;
  distance: number;
  experience: string;
  gender: string;
  lastActive: string;
  responseRate: number;
  averagePrice: number;
  workingDays: string[];
  practiceLevel: string;
  practiceNeeds: string[];
  supervisionLevel: string;
}

interface SearchInterfaceProps {
  initialHairdressers: Hairdresser[];
  stations: string[];
  services: Array<{ id: string; label: string }>;
  isAuthenticated?: boolean;
}

export default function SearchInterface({ initialHairdressers, stations, services, isAuthenticated = false }: SearchInterfaceProps) {
  const [searchFilters, setSearchFilters] = useState({
    station: '',
    service: '',
    budget: '',
    availability: '',
    rating: '',
    distance: '',
    experience: '',
    gender: '',
    practiceLevel: '',
    sortBy: 'rating'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (filterType: string, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // フィルタリング・ソート処理
  const getFilteredAndSortedHairdressers = () => {
    let filtered = initialHairdressers.filter(hairdresser => {
      // テキスト検索
      if (searchQuery && !hairdresser.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !hairdresser.salon.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // 駅フィルター
      if (searchFilters.station && hairdresser.station !== searchFilters.station) {
        return false;
      }

      // サービスフィルター
      if (searchFilters.service && !hairdresser.specialties.includes(searchFilters.service.replace('_', ''))) {
        return false;
      }

      // 予算フィルター
      if (searchFilters.budget) {
        const budget = parseInt(searchFilters.budget);
        if (hairdresser.averagePrice > budget) {
          return false;
        }
      }

      // 今日の空き状況
      if (searchFilters.availability === 'today' && !hairdresser.availableToday) {
        return false;
      }

      // 評価フィルター
      if (searchFilters.rating) {
        const minRating = parseFloat(searchFilters.rating);
        if (hairdresser.rating < minRating) {
          return false;
        }
      }

      // 距離フィルター
      if (searchFilters.distance) {
        const maxDistance = parseFloat(searchFilters.distance);
        if (hairdresser.distance > maxDistance) {
          return false;
        }
      }

      // 経験フィルター
      if (searchFilters.experience && hairdresser.experience !== searchFilters.experience) {
        return false;
      }

      // 性別フィルター
      if (searchFilters.gender && hairdresser.gender !== searchFilters.gender) {
        return false;
      }

      // 練習レベルフィルター
      if (searchFilters.practiceLevel && hairdresser.practiceLevel !== searchFilters.practiceLevel) {
        return false;
      }

      return true;
    });

    // ソート処理
    filtered.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.averagePrice - b.averagePrice;
        case 'distance':
          return a.distance - b.distance;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'response':
          return b.responseRate - a.responseRate;
        default:
          return b.rating - a.rating;
      }
    });

    return filtered;
  };

  const filteredHairdressers = getFilteredAndSortedHairdressers();

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
                placeholder="美容師名、サロン名で検索"
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
                  {/* 駅選択 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">駅</label>
                    <select
                      value={searchFilters.station}
                      onChange={(e) => handleFilterChange('station', e.target.value)}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">得意サービス</label>
                    <select
                      value={searchFilters.service}
                      onChange={(e) => handleFilterChange('service', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                    >
                      <option value="">すべて</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.label}>{service.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* 距離 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">距離</label>
                    <select
                      value={searchFilters.distance}
                      onChange={(e) => handleFilterChange('distance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                    >
                      <option value="">指定なし</option>
                      <option value="0.5">500m以内</option>
                      <option value="1">1km以内</option>
                      <option value="2">2km以内</option>
                      <option value="5">5km以内</option>
                    </select>
                  </div>

                  {/* 空き状況 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">空き状況</label>
                    <select
                      value={searchFilters.availability}
                      onChange={(e) => handleFilterChange('availability', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                    >
                      <option value="">すべて</option>
                      <option value="today">今日空きあり</option>
                      <option value="tomorrow">明日空きあり</option>
                      <option value="week">今週空きあり</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 詳細フィルター */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">詳細条件</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 予算 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">予算上限</label>
                    <select
                      value={searchFilters.budget}
                      onChange={(e) => handleFilterChange('budget', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                    >
                      <option value="">指定なし</option>
                      <option value="2000">〜2,000円</option>
                      <option value="3000">〜3,000円</option>
                      <option value="4000">〜4,000円</option>
                      <option value="5000">〜5,000円</option>
                    </select>
                  </div>

                  {/* 評価 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">最低評価</label>
                    <select
                      value={searchFilters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                    >
                      <option value="">指定なし</option>
                      <option value="4.5">4.5以上</option>
                      <option value="4.0">4.0以上</option>
                      <option value="3.5">3.5以上</option>
                      <option value="3.0">3.0以上</option>
                    </select>
                  </div>

                  {/* 経験年数 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">経験年数</label>
                    <select
                      value={searchFilters.experience}
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                    >
                      <option value="">指定なし</option>
                      <option value="1-2">1〜2年</option>
                      <option value="2-3">2〜3年</option>
                      <option value="3+">3年以上</option>
                    </select>
                  </div>

                  {/* 性別 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
                    <select
                      value={searchFilters.gender}
                      onChange={(e) => handleFilterChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                    >
                      <option value="">指定なし</option>
                      <option value="female">女性</option>
                      <option value="male">男性</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 練習レベルフィルター */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">練習レベル・監修体制</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* 練習レベル */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">練習レベル</label>
                    <select
                      value={searchFilters.practiceLevel}
                      onChange={(e) => handleFilterChange('practiceLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                    >
                      <option value="">すべて</option>
                      <option value="初級">初級（基本技術を習得中）</option>
                      <option value="中級">中級（応用技術を習得中）</option>
                      <option value="上級">上級（高度技術を習得中）</option>
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
                  練習台サービスについて
                </h3>
                <div className="text-blue-800 text-xs space-y-1">
                  <p>• アシスタント美容師の技術向上のための練習にご協力いただくサービスです</p>
                  <p>• 全てのサービスはスタイリストの監修・指導のもと行われます</p>
                  <p>• 通常料金の約50%OFFでご利用いただけます</p>
                  <p>• 仕上がりに不安のある方は上級レベルのアシスタントをお選びください</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* フィルタークリア */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={() => setSearchFilters({
            station: '',
            service: '',
            budget: '',
            availability: '',
            rating: '',
            distance: '',
            experience: '',
            gender: '',
            practiceLevel: '',
            sortBy: 'rating'
          })}
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          フィルターをクリア
        </button>
        <div className="text-sm text-gray-600">
          {filteredHairdressers.length}件の結果
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        {/* 検索結果ヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              練習台を募集中のアシスタント美容師 <span className="text-sm font-normal text-gray-600">({filteredHairdressers.length}件)</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">技術向上を目指すアシスタント美容師の練習にご協力いただけます</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href="/recommendations"
              className="px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-xs sm:text-sm flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              おすすめ
            </Link>
            <span className="text-xs sm:text-sm text-gray-600">並び替え:</span>
            <select 
              value={searchFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            >
              <option value="rating">評価順</option>
              <option value="price">料金安い順</option>
              <option value="distance">距離順</option>
              <option value="reviews">レビュー数順</option>
              <option value="response">返信率順</option>
            </select>
          </div>
        </div>

        {/* 検索結果リスト */}
        <div className="space-y-3 sm:space-y-4">
          {filteredHairdressers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">検索結果が見つかりません</h3>
              <p className="text-gray-600 mb-4">検索条件を変更してお試しください</p>
              <button
                onClick={() => setSearchFilters({
                  station: '',
                  service: '',
                  budget: '',
                  availability: '',
                  rating: '',
                  distance: '',
                  experience: '',
                  gender: '',
                  practiceLevel: '',
                  sortBy: 'rating'
                })}
                className="text-pink-500 hover:text-pink-600 font-medium"
              >
                フィルターをリセット
              </button>
            </div>
          ) : (
            filteredHairdressers.map((hairdresser) => (
            <div key={hairdresser.id} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3 sm:space-x-4">
                {/* プロフィール画像 */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-semibold text-base sm:text-lg">
                    {hairdresser.name.charAt(0)}
                  </div>
                </div>

                {/* 基本情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{hairdresser.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{hairdresser.salon}</p>
                    </div>
                    {hairdresser.availableToday && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                        今日空きあり
                      </span>
                    )}
                  </div>

                  {/* 評価と立地・追加情報 */}
                  <div className="flex flex-col space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 sm:w-4 sm:h-4 fill-current ${i < Math.floor(hairdresser.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-xs sm:text-sm text-gray-600">
                          {hairdresser.rating} ({hairdresser.reviewCount}件)
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{hairdresser.lastActive}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                      <span>{hairdresser.station} • {hairdresser.distance}km</span>
                      <div className="flex items-center space-x-3">
                        <span>経験{hairdresser.experience}年</span>
                        <span>返信率{hairdresser.responseRate}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          hairdresser.practiceLevel === '初級' ? 'bg-blue-100 text-blue-700' :
                          hairdresser.practiceLevel === '中級' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          練習レベル: {hairdresser.practiceLevel}
                        </span>
                      </div>
                      <span className="text-gray-500">{hairdresser.supervisionLevel}</span>
                    </div>
                  </div>

                  {/* 得意分野と料金 */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm text-gray-600 shrink-0">得意:</span>
                        <div className="flex flex-wrap gap-1">
                          {hairdresser.specialties.map((specialty, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm text-gray-600 shrink-0">練習目標:</span>
                        <div className="flex flex-wrap gap-1">
                          {hairdresser.practiceNeeds.map((need, index) => (
                            <span key={index} className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                              {need}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex flex-col">
                          <span className="text-base sm:text-lg font-semibold text-pink-600">{hairdresser.price}</span>
                          <span className="text-xs text-green-600 font-medium">練習台価格（正規の約50%OFF）</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isAuthenticated && (
                          <button className="p-1.5 sm:p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        )}
                        <Link
                          href={`/assistant/${hairdresser.id}`}
                          className="bg-pink-500 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-pink-600 transition-colors text-xs sm:text-sm"
                        >
                          詳細を見る
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        {/* ページネーション */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm">
              前へ
            </button>
            <button className="px-2 sm:px-3 py-1.5 sm:py-2 bg-pink-500 text-white rounded-lg text-xs sm:text-sm">1</button>
            <button className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm">2</button>
            <button className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm">3</button>
            <button className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm">
              次へ
            </button>
          </div>
        </div>
      </main>
    </>
  );
}