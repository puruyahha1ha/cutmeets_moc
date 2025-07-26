'use client'

import { useState } from 'react';

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
  onSearchChange: (query: string) => void;
}

export default function SearchFilters({ onFiltersChange, onSearchChange }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
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

  const stations = [
    '渋谷駅', '新宿駅', '原宿駅', '表参道駅', '銀座駅', '池袋駅',
    '心斎橋駅', '梅田駅', '横浜駅', '名古屋駅', '博多駅', '札幌駅'
  ];

  const services = [
    { id: 'cut', label: 'カット' },
    { id: 'color', label: 'カラー' },
    { id: 'perm', label: 'パーマ' },
    { id: 'treatment', label: 'トリートメント' },
    { id: 'straightening', label: 'ストレート' },
    { id: 'styling', label: 'セット' }
  ];

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = {
      ...searchFilters,
      [filterType]: value
    };
    setSearchFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
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
                onChange={handleSearchChange}
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

                  {/* ソート */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">並び替え</label>
                    <select 
                      value={searchFilters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                    >
                      <option value="rating">評価順</option>
                      <option value="price">料金安い順</option>
                      <option value="distance">距離順</option>
                      <option value="reviews">レビュー数順</option>
                      <option value="response">返信率順</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}