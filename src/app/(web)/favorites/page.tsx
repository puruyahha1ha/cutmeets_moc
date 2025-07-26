'use client'

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for tab components to improve initial page load
const FavoriteHairdressers = dynamic(() => import('../_components/client/FavoriteHairdressers'), {
  loading: () => (
    <div className="space-y-3 sm:space-y-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
});

const FavoriteStyles = dynamic(() => import('../_components/client/FavoriteStyles'), {
  loading: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden">
          <div className="w-full h-40 sm:h-48 bg-gray-200 animate-pulse"></div>
          <div className="p-3 sm:p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
});

export default function FavoritesPage() {
    const [activeTab, setActiveTab] = useState('hairdressers');

    // モックデータ - お気に入り美容師
    const favoriteHairdressers = [
        {
            id: 1,
            name: '田中 美香',
            salon: 'SALON TOKYO',
            station: '渋谷駅',
            rating: 4.8,
            reviewCount: 156,
            price: '3,500円〜',
            specialties: ['カット', 'カラー'],
            lastVisit: '2024-01-15',
            nextAvailable: '明日 14:00〜'
        },
        {
            id: 2,
            name: '佐藤 リナ',
            salon: 'Hair Studio Grace',
            station: '新宿駅',
            rating: 4.9,
            reviewCount: 203,
            price: '4,200円〜',
            specialties: ['パーマ', 'トリートメント'],
            lastVisit: '2024-01-10',
            nextAvailable: '今日 16:00〜'
        }
    ];

    // モックデータ - お気に入りスタイル
    const favoriteStyles = [
        {
            id: 1,
            title: 'ボブスタイル×インナーカラー',
            hairdresser: '田中 美香',
            salon: 'SALON TOKYO',
            price: '8,500円',
            image: '/api/placeholder/200/150',
            savedDate: '2024-01-20'
        },
        {
            id: 2,
            title: 'ゆるふわパーマロング',
            hairdresser: '佐藤 リナ',
            salon: 'Hair Studio Grace',
            price: '12,000円',
            image: '/api/placeholder/200/150',
            savedDate: '2024-01-18'
        },
        {
            id: 3,
            title: 'ショートボブ×ハイライト',
            hairdresser: '山田 愛子',
            salon: 'Beauty Lounge',
            price: '10,500円',
            image: '/api/placeholder/200/150',
            savedDate: '2024-01-16'
        }
    ];

    const removeFavorite = (type: string, id: number) => {
        console.log(`Remove ${type} favorite:`, id);
        // お気に入り削除処理
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
                {/* ページヘッダー */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">お気に入り</h1>
                    <p className="text-sm sm:text-base text-gray-600">気になる美容師やスタイルをまとめて管理</p>
                </div>

                {/* タブナビゲーション */}
                <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 mb-4 sm:mb-6">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('hairdressers')}
                            className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-center font-medium rounded-l-lg sm:rounded-l-xl transition-colors text-sm sm:text-base ${
                                activeTab === 'hairdressers'
                                    ? 'bg-pink-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            美容師 ({favoriteHairdressers.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('styles')}
                            className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-center font-medium rounded-r-lg sm:rounded-r-xl transition-colors text-sm sm:text-base ${
                                activeTab === 'styles'
                                    ? 'bg-pink-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            スタイル ({favoriteStyles.length})
                        </button>
                    </div>
                </div>

                {/* 美容師タブ */}
                {activeTab === 'hairdressers' && (
                    <FavoriteHairdressers 
                        hairdressers={favoriteHairdressers}
                        onRemoveFavorite={(id) => removeFavorite('hairdresser', id)}
                    />
                )}

                {/* スタイルタブ */}
                {activeTab === 'styles' && (
                    <FavoriteStyles 
                        styles={favoriteStyles}
                        onRemoveFavorite={(id) => removeFavorite('style', id)}
                    />
                )}
            </main>
        </div>
    );
}