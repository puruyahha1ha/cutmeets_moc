'use client'

import { useState } from 'react';
import Link from 'next/link';

// Mock data types
interface Hairdresser {
  id: number;
  name: string;
  salon: string;
  station: string;
  rating: number;
  reviewCount: number;
  price: string;
  specialties: string[];
  lastVisit: string;
  nextAvailable: string;
}

interface Style {
  id: number;
  title: string;
  hairdresser: string;
  salon: string;
  price: string;
  image: string;
  savedDate: string;
}

interface FavoritesTabsProps {
  favoriteHairdressers: Hairdresser[];
  favoriteStyles: Style[];
}

export default function FavoritesTabs({ favoriteHairdressers, favoriteStyles }: FavoritesTabsProps) {
  const [activeTab, setActiveTab] = useState('hairdressers');

  const removeFavorite = (type: string, id: number) => {
    console.log(`Remove ${type} favorite:`, id);
    // お気に入り削除処理
  };

  return (
    <>
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
        <div className="space-y-3 sm:space-y-4">
          {favoriteHairdressers.length > 0 ? (
            favoriteHairdressers.map((hairdresser) => (
              <div key={hairdresser.id} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  {/* プロフィール画像 */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0">
                    {hairdresser.name.charAt(0)}
                  </div>

                  {/* 基本情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{hairdresser.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{hairdresser.salon} • {hairdresser.station}</p>
                      </div>
                      <button
                        onClick={() => removeFavorite('hairdresser', hairdresser.id)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors ml-2 shrink-0"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* 評価と詳細 */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-xs sm:text-sm text-gray-600">
                          {hairdresser.rating} ({hairdresser.reviewCount}件)
                        </span>
                      </div>
                      <span className="text-base sm:text-lg font-semibold text-pink-600">{hairdresser.price}</span>
                    </div>

                    {/* 得意分野と最終来店日 */}
                    <div className="space-y-3 mb-4">
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
                      <span className="text-xs sm:text-sm text-gray-500 block">
                        最終来店: {hairdresser.lastVisit}
                      </span>
                    </div>

                    {/* アクションボタン */}
                    <div className="space-y-3">
                      <div className="text-xs sm:text-sm">
                        <span className="text-gray-600">次回予約可能: </span>
                        <span className="text-green-600 font-medium">{hairdresser.nextAvailable}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <Link
                          href={`/hairdresser/${hairdresser.id}`}
                          className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center text-xs sm:text-sm"
                        >
                          詳細を見る
                        </Link>
                        <Link
                          href={`/booking/${hairdresser.id}`}
                          className="px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-center text-xs sm:text-sm"
                        >
                          予約する
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">お気に入りの美容師がありません</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">気になる美容師をお気に入りに追加してみましょう</p>
              <Link
                href="/search"
                className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm sm:text-base"
              >
                美容師を探す
              </Link>
            </div>
          )}
        </div>
      )}

      {/* スタイルタブ */}
      {activeTab === 'styles' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {favoriteStyles.length > 0 ? (
            favoriteStyles.map((style) => (
              <div key={style.id} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden">
                {/* スタイル画像 */}
                <div className="relative">
                  <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm sm:text-base">スタイル画像</span>
                  </div>
                  <button
                    onClick={() => removeFavorite('style', style.id)}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-white transition-colors"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* スタイル情報 */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{style.title}</h3>
                  <div className="text-xs sm:text-sm text-gray-600 mb-3">
                    <p className="truncate">{style.hairdresser}</p>
                    <p className="truncate">{style.salon}</p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base sm:text-lg font-semibold text-pink-600">{style.price}</span>
                    <span className="text-xs text-gray-500">保存日: {style.savedDate}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm">
                      詳細を見る
                    </button>
                    <button className="flex-1 px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-xs sm:text-sm">
                      予約する
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">お気に入りのスタイルがありません</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">気になるヘアスタイルをお気に入りに追加してみましょう</p>
              <Link
                href="/catalog"
                className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm sm:text-base"
              >
                スタイルを探す
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}