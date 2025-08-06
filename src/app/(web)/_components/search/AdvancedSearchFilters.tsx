'use client'

import { useState, useEffect } from 'react';
// Mock types inline
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
}

interface AdvancedSearchFiltersProps {
  filters: SearchQuery;
  onFiltersChange: (filters: SearchQuery) => void;
  onClose?: () => void;
  stations: string[];
  services: Array<{ id: string; label: string }>;
}

interface PriceRange {
  min: number;
  max: number;
  label: string;
}

const priceRanges: PriceRange[] = [
  { min: 0, max: 1000, label: '〜1,000円' },
  { min: 1000, max: 2000, label: '1,000〜2,000円' },
  { min: 2000, max: 3000, label: '2,000〜3,000円' },
  { min: 3000, max: 5000, label: '3,000〜5,000円' },
  { min: 5000, max: 10000, label: '5,000〜10,000円' },
  { min: 10000, max: Infinity, label: '10,000円以上' }
];

const experienceLevels = [
  { value: 'beginner', label: '初級（〜1年）', description: 'スタイリストが常に指導' },
  { value: 'intermediate', label: '中級（2〜3年）', description: '基本技術は習得済み' },
  { value: 'advanced', label: '上級（4年以上）', description: '高度な技術も対応可能' }
];

const timeSlots = [
  '09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'
];

const distances = [
  { value: 0.5, label: '500m以内' },
  { value: 1, label: '1km以内' },
  { value: 2, label: '2km以内' },
  { value: 5, label: '5km以内' },
  { value: 10, label: '10km以内' }
];

export default function AdvancedSearchFilters({
  filters,
  onFiltersChange,
  onClose,
  stations,
  services
}: AdvancedSearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchQuery>(filters);
  const [activeTab, setActiveTab] = useState<'basic' | 'location' | 'schedule' | 'preferences'>('basic');

  // フィルター更新
  const updateFilter = (key: keyof SearchQuery, value: any) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  // 複数選択の処理
  const toggleArrayFilter = (key: keyof SearchQuery, value: string) => {
    const currentArray = (localFilters[key] as string[]) || [];
    const updated = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, updated);
  };

  // 日付範囲の処理
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">詳細検索</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* タブナビゲーション */}
        <div className="flex space-x-1 mt-4">
          {[
            { key: 'basic', label: '基本条件', icon: '🔍' },
            { key: 'location', label: '場所・距離', icon: '📍' },
            { key: 'schedule', label: '日時', icon: '📅' },
            { key: 'preferences', label: '詳細設定', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="p-6">
        {/* 基本条件タブ */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            {/* サービスタイプ */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                サービスタイプ
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {services.map(service => (
                  <label key={service.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(localFilters.services || []).includes(service.label)}
                      onChange={() => toggleArrayFilter('services', service.label)}
                      className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">{service.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 価格帯 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                予算
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {priceRanges.map((range, index) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={localFilters.priceMin === range.min && localFilters.priceMax === range.max}
                      onChange={() => {
                        updateFilter('priceMin', range.min);
                        updateFilter('priceMax', range.max === Infinity ? undefined : range.max);
                      }}
                      className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>
              
              {/* カスタム価格範囲 */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">カスタム価格範囲</h4>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="最低価格"
                      value={localFilters.priceMin || ''}
                      onChange={(e) => updateFilter('priceMin', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                    />
                  </div>
                  <span className="text-gray-500">〜</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="最高価格"
                      value={localFilters.priceMax || ''}
                      onChange={(e) => updateFilter('priceMax', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 経験レベル */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                アシスタントの経験レベル
              </label>
              <div className="space-y-3">
                {experienceLevels.map(level => (
                  <label key={level.value} className="flex items-start space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={level.value}
                      checked={localFilters.experienceLevel === level.value}
                      onChange={(e) => updateFilter('experienceLevel', e.target.value)}
                      className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{level.label}</div>
                      <div className="text-xs text-gray-600">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 評価 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                最低評価
              </label>
              <div className="flex space-x-2">
                {[4.5, 4.0, 3.5, 3.0].map(rating => (
                  <label key={rating} className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={localFilters.rating === rating}
                      onChange={(e) => updateFilter('rating', parseFloat(e.target.value))}
                      className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700 flex items-center">
                      {rating}
                      <svg className="w-4 h-4 text-amber-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      以上
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 場所・距離タブ */}
        {activeTab === 'location' && (
          <div className="space-y-6">
            {/* 駅選択 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                最寄り駅
              </label>
              <select
                value={localFilters.location || ''}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">すべての駅</option>
                {stations.map(station => (
                  <option key={station} value={station}>{station}</option>
                ))}
              </select>
            </div>

            {/* 距離 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                最大距離
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {distances.map(distance => (
                  <label key={distance.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="maxDistance"
                      value={distance.value}
                      checked={localFilters.maxDistance === distance.value}
                      onChange={(e) => updateFilter('maxDistance', parseFloat(e.target.value))}
                      className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">{distance.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 現在地からの検索 */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900">現在地からの検索</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    位置情報を許可すると、より正確な距離での検索が可能です
                  </p>
                  <button className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium">
                    位置情報を取得
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 日時タブ */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {/* 利用可能日 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                利用希望日
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableDates.map(date => {
                  const dateObj = new Date(date);
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                  return (
                    <label
                      key={date}
                      className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        localFilters.availableDate === date
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      } ${isWeekend ? 'bg-blue-50' : ''}`}
                    >
                      <input
                        type="radio"
                        name="availableDate"
                        value={date}
                        checked={localFilters.availableDate === date}
                        onChange={(e) => updateFilter('availableDate', e.target.value)}
                        className="sr-only"
                      />
                      <div className="text-xs text-gray-500">
                        {dateObj.getMonth() + 1}/{dateObj.getDate()}
                      </div>
                      <div className="text-xs font-medium">
                        {['日', '月', '火', '水', '木', '金', '土'][dateObj.getDay()]}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 時間帯 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                希望時間帯
              </label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map(slot => (
                  <label key={slot} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="availableTime"
                      value={slot}
                      checked={localFilters.availableTime === slot}
                      onChange={(e) => updateFilter('availableTime', e.target.value)}
                      className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">{slot}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 所要時間 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                希望所要時間
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[60, 90, 120, 180].map(duration => (
                  <label key={duration} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">{duration}分以内</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 詳細設定タブ */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            {/* 募集状況 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                募集状況
              </label>
              <div className="space-y-2">
                {[
                  { value: 'recruiting', label: '募集中のみ', description: '現在応募可能な案件' },
                  { value: 'all', label: 'すべて表示', description: '募集終了も含む' }
                ].map(option => (
                  <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={localFilters.status === option.value}
                      onChange={(e) => updateFilter('status', e.target.value)}
                      className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-500 mt-0.5"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 緊急度 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                緊急度
              </label>
              <div className="space-y-2">
                {[
                  { value: 'urgent', label: '急募のみ', description: '近日中の募集案件' },
                  { value: 'all', label: 'すべて', description: '通常募集も含む' }
                ].map(option => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="urgency"
                      value={option.value}
                      checked={localFilters.urgency === option.value}
                      onChange={(e) => updateFilter('urgency', e.target.value)}
                      className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{option.label}</span>
                      <span className="text-xs text-gray-600 ml-2">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 条件・制限 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                応募条件
              </label>
              <div className="space-y-2">
                {[
                  '初回利用OK',
                  '学生歓迎',
                  '男性OK',
                  'ダメージヘアOK',
                  'ショートヘアOK',
                  'ロングヘアOK'
                ].map(requirement => (
                  <label key={requirement} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(localFilters.requirements || []).includes(requirement)}
                      onChange={() => toggleArrayFilter('requirements', requirement)}
                      className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">{requirement}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ソート順 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                並び順
              </label>
              <select
                value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  updateFilter('sortBy', sortBy);
                  updateFilter('sortOrder', sortOrder);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="relevance-desc">関連度順</option>
                <option value="date-desc">新着順</option>
                <option value="price-asc">料金が安い順</option>
                <option value="price-desc">料金が高い順</option>
                <option value="rating-desc">評価が高い順</option>
                <option value="distance-asc">距離が近い順</option>
                <option value="popularity-desc">人気順</option>
              </select>
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={() => {
              const resetFilters: SearchQuery = {
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
                sortOrder: 'desc'
              };
              setLocalFilters(resetFilters);
              onFiltersChange(resetFilters);
            }}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            すべてクリア
          </button>
          
          <div className="text-sm text-gray-600">
            条件に一致する案件を検索中...
          </div>
        </div>
      </div>
    </div>
  );
}