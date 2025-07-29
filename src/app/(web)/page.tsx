import Link from 'next/link';
import Image from 'next/image';
import { Suspense, lazy } from 'react';

// Dynamic import for StationModal to reduce initial bundle size
const StationModal = lazy(() => import('./_components/client/StationModal'));

// Server Component - static data and metadata can be defined here
export const metadata = {
  title: 'Cutmeets - アシスタント美容師とお客様をマッチング',
  description: '技術向上を目指すアシスタント美容師の練習にご協力いただき、正規料金の約50%OFFでプロの施術を受けられるサービスです。',
  keywords: '美容師,アシスタント,練習台,格安,美容室,カット,カラー',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ヒーローセクション */}
      <section className="relative min-h-screen bg-gray-900 overflow-hidden">
        {/* 背景画像 */}
        <div className="absolute inset-0">
          <Image
            src="/FV.png"
            alt="美容師が顧客の髪をカットしている様子 - Cutmeetsで技術向上を目指すアシスタント美容師とお客様をマッチング"
            fill
            className="object-cover object-[75%_center] sm:object-right"
            priority
            quality={85}
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
          {/* オーバーレイ - パフォーマンス最適化済み */}
          <div className="absolute inset-0 bg-black/50" aria-hidden="true"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 sm:from-black/70 sm:via-black/40 sm:to-transparent" aria-hidden="true"></div>
        </div>

        {/* コンテンツ */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-8 sm:py-12 min-h-screen flex flex-col justify-center">
          {/* メインキャッチ */}
          <div className="max-w-4xl mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight text-ja font-size-adjust contain-layout">
              練習台として協力し、
              <br />
              <span className="text-pink-400">お得に美しく</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 sm:mb-12 leading-relaxed text-ja font-size-adjust contain-layout max-w-3xl">
              アシスタント美容師の技術向上をサポートしながら、
              正規料金の約50%OFFでプロの施術を受けられます
            </p>
          </div>

          {/* アクションエリア */}
          <div className="max-w-lg">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl">
              <Suspense fallback={
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-4 text-center">最寄り駅を選択</label>
                  <div className="w-full px-6 py-4 border border-gray-300 bg-gray-50 rounded-xl text-lg text-left flex items-center justify-between">
                    <span className="text-gray-400 animate-pulse">読み込み中...</span>
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
                  </div>
                </div>
              }>
                <StationModal />
              </Suspense>

              <Link
                href="/search"
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 text-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all block text-center rounded-xl shadow-lg hover:shadow-xl mb-8"
              >
                練習台を募集中のアシスタント美容師を探す
              </Link>

              <div className="text-center">
                <Link
                  href="/register"
                  className="w-full bg-white border-2 border-pink-500 text-pink-500 py-4 text-lg font-semibold hover:bg-pink-500 hover:text-white transition-all block text-center rounded-xl shadow-md hover:shadow-lg"
                >
                  新規登録（無料）
                </Link>
                <p className="text-sm text-gray-600 mt-3">
                  練習台モデル・アシスタント美容師どちらも登録可能
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 装飾要素 */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl will-change-transform" aria-hidden="true"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl will-change-transform" aria-hidden="true"></div>
      </section>

      {/* プラットフォームの特徴 */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-ja">
            Win-Winの新しい美容体験
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto text-ja">
            練習台システムで、美容師の成長をサポートしながらお得に美しくなれる
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {/* 練習台モデル */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">👤</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">練習台モデル</h3>
              <ul className="space-y-3 text-left text-gray-700 mb-6">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  正規料金の約50%OFF
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  練習後のアフターケアも充実
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  美容師の成長に貢献
                </li>
              </ul>
              <Link
                href="/register"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all inline-block text-center"
              >
                練習台として参加
              </Link>
            </div>

            {/* アシスタント美容師 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">✂️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">アシスタント美容師</h3>
              <ul className="space-y-3 text-left text-gray-700 mb-6">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  技術練習しながら副収入
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  柔軟なスケジュール
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  リピーター獲得機会
                </li>
              </ul>
              <Link
                href="/register"
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-600 hover:to-red-600 transition-all inline-block text-center"
              >
                美容師として登録
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}