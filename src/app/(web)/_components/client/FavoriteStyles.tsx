'use client'

import Link from 'next/link';

interface Style {
  id: number;
  title: string;
  hairdresser: string;
  salon: string;
  price: string;
  image: string;
  savedDate: string;
}

interface FavoriteStylesProps {
  styles: Style[];
  onRemoveFavorite: (id: number) => void;
}

export default function FavoriteStyles({ styles, onRemoveFavorite }: FavoriteStylesProps) {
  if (styles.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {styles.map((style) => (
        <div key={style.id} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden">
          {/* スタイル画像 */}
          <div className="relative">
            <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm sm:text-base">スタイル画像</span>
            </div>
            <button
              onClick={() => onRemoveFavorite(style.id)}
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
      ))}
    </div>
  );
}