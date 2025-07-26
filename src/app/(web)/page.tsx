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
const popularAreas = [
  '渋谷駅', '新宿駅', '原宿駅', '表参道駅', '銀座駅', '池袋駅',
  '心斎橋駅', '梅田駅', '横浜駅', '名古屋駅', '博多駅', '札幌駅'
];

const serviceCategories = [
  { href: '/search?menu=cut', label: 'カット', icon: '✂️', color: 'red-500' },
  { href: '/search?menu=color', label: 'カラー', icon: '🎨', color: 'purple-500' },
  { href: '/search?menu=perm', label: 'パーマ', icon: '🌊', color: 'blue-500' },
  { href: '/search?menu=treatment', label: 'トリートメント', icon: '✨', color: 'green-500' }
];

const catalogItems = [
  { title: 'ヘアスタイル', subtitle: 'カット・パーマ', image: '💇‍♀️' },
  { title: 'カラーカタログ', subtitle: 'ハイトーン・韓国風', image: '🎨' },
  { title: 'ビフォーアフター', subtitle: '施術実例', image: '✨' },
  { title: 'メンズスタイル', subtitle: 'メンズカット', image: '💇‍♂️' }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
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
          <div className="absolute inset-0 bg-black/40" aria-hidden="true"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 sm:from-black/60 sm:via-black/30 sm:to-transparent" aria-hidden="true"></div>
        </div>

        {/* コンテンツ */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12 min-h-screen flex flex-col justify-center lg:justify-center">
          {/* メインキャッチ */}
          <div className="max-w-3xl lg:max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight text-ja font-size-adjust contain-layout">
              <span className="text-pink-400">練習台として協力</span>
              <br />
              アシスタント美容師と
              <br />
              <span className="text-pink-400">一緒に成長しませんか？</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed text-ja font-size-adjust contain-layout">
              技術向上を目指すアシスタント美容師の練習にご協力いただき、
              <br className="hidden sm:block" />
              正規料金の約50%OFFでプロの施術を受けられます
            </p>
          </div>

          {/* カテゴリアイコン */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12 max-w-4xl">
            {serviceCategories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center hover:bg-white/20 hover:border-white/40 transition-all group"
              >
                <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-${category.color}/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-${category.color}/30 transition-colors`}>
                  <span className="text-lg sm:text-2xl" role="img" aria-label={category.label}>{category.icon}</span>
                </div>
                <span className="text-white font-medium text-sm sm:text-base">{category.label}</span>
              </Link>
            ))}
          </div>

          {/* 検索フォーム */}
          <div className="max-w-2xl">
            <div className="bg-white/95 backdrop-blur-md border border-white/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
              <Suspense fallback={
                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-3 sm:mb-4 text-center">最寄り駅を選択</label>
                  <div className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 bg-gray-50 rounded-lg sm:rounded-xl text-base sm:text-lg text-left flex items-center justify-between">
                    <span className="text-gray-400 animate-pulse">読み込み中...</span>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
                  </div>
                </div>
              }>
                <StationModal />
              </Suspense>

              <Link
                href="/search"
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all block text-center rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl mb-6 sm:mb-8"
              >
                練習台を募集中のアシスタント美容師を探す
              </Link>

              {/* 登録ボタン */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm sm:text-base text-gray-700 font-medium mb-3 sm:mb-4">
                    Cutmeetsに参加しませんか？
                  </p>
                  <Link
                    href="/register"
                    className="w-full bg-white border-2 border-pink-500 text-pink-500 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:bg-pink-500 hover:text-white transition-all block text-center rounded-lg sm:rounded-xl shadow-md hover:shadow-lg"
                  >
                    新規登録（無料）
                  </Link>
                </div>
                
                {/* 登録タイプの説明 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-center">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <div className="text-blue-600 text-lg sm:text-xl mb-2">👤</div>
                    <h4 className="font-medium text-blue-900 text-sm sm:text-base mb-1">一般ユーザー</h4>
                    <p className="text-xs sm:text-sm text-blue-700">
                      練習台として協力<br />
                      格安でサービス利用
                    </p>
                  </div>
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 sm:p-4">
                    <div className="text-pink-600 text-lg sm:text-xl mb-2">✂️</div>
                    <h4 className="font-medium text-pink-900 text-sm sm:text-base mb-1">アシスタント美容師</h4>
                    <p className="text-xs sm:text-sm text-pink-700">
                      技術練習の機会<br />
                      副業として活動
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600">
                    登録後にお好みのタイプを選択できます
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 装飾要素 - CSSアニメーション最適化済み */}
        <div className="absolute top-10 sm:top-20 right-5 sm:right-10 w-16 h-16 sm:w-32 sm:h-32 bg-pink-500/20 rounded-full blur-3xl will-change-transform" aria-hidden="true"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-5 sm:left-10 w-20 h-20 sm:w-40 sm:h-40 bg-purple-500/20 rounded-full blur-3xl will-change-transform" aria-hidden="true"></div>
      </section>

      {/* 両方のユーザータイプへのメッセージ */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-ja font-size-adjust contain-layout">
              あなたはどちらのタイプ？
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-ja">
              Cutmeetsは2つの利用方法があります。お得にサービスを受けたい方も、技術を活かしたい方も大歓迎です。
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* 一般ユーザー向け */}
            <div className="bg-blue-50 rounded-2xl p-6 sm:p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">👤</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4">
                  練習台として協力したい方
                </h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-blue-800">正規料金の約50%OFFでプロの施術を受けられる</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-blue-800">次世代美容師の成長をサポートできる</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-blue-800">スタイリスト監修で安心の品質保証</p>
                  </div>
                </div>
                <Link
                  href="/register"
                  className="mt-6 w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors inline-block text-center"
                >
                  練習台として登録する
                </Link>
              </div>
            </div>

            {/* アシスタント美容師向け */}
            <div className="bg-pink-50 rounded-2xl p-6 sm:p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">✂️</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-pink-900 mb-4">
                  技術を活かして副業したい方
                </h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-pink-800">技術練習をしながら副収入を得られる</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-pink-800">自分のペースで働ける柔軟なスケジュール</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-pink-800">お客様と直接つながり、リピーター獲得</p>
                  </div>
                </div>
                <Link
                  href="/register"
                  className="mt-6 w-full bg-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-pink-600 transition-colors inline-block text-center"
                >
                  アシスタント美容師として登録
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 料金メリット */}
      <section className="bg-gradient-to-r from-pink-500 to-red-500 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-ja font-size-adjust contain-layout">
              練習台システムでWin-Winの関係
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto text-ja">
              アシスタント美容師の技術向上をサポートしながら、お得に美容サービスを受けられます
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8">
                <div className="text-3xl sm:text-4xl mb-4">
                  <span role="img" aria-label="お金">💰</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">練習台価格でお得に</h3>
                <p className="text-sm sm:text-base text-white/90">
                  技術練習にご協力いただく代わりに、
                  正規料金の約50%OFFでご利用可能
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8">
                <div className="text-3xl sm:text-4xl mb-4">
                  <span role="img" aria-label="学位帽">🎓</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">スタイリスト監修で安心</h3>
                <p className="text-sm sm:text-base text-white/90">
                  全ての施術はベテランスタイリストの
                  指導・監修のもとで行われます
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8">
                <div className="text-3xl sm:text-4xl mb-4">
                  <span role="img" aria-label="握手">🤝</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">技術向上に貢献</h3>
                <p className="text-sm sm:text-base text-white/90">
                  次世代美容師の成長をサポートしながら、
                  お得にサービスを受けられます
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* スタイルカタログ */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800 text-ja font-size-adjust contain-layout">スタイルカタログ</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {catalogItems.map((item, index) => (
              <Link
                key={index}
                href={`/catalog/${item.title}`}
                className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-all group"
              >
                <div className="text-2xl sm:text-4xl mb-3 sm:mb-4">
                  <span role="img" aria-label={item.title}>{item.image}</span>
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2 group-hover:text-pink-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">{item.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 人気駅 */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800 text-ja font-size-adjust contain-layout">人気の駅から探す</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {popularAreas.map((station) => (
              <Link
                key={station}
                href={`/search?station=${station}`}
                className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all shadow-sm hover:shadow-md"
              >
                <span className="font-medium text-sm sm:text-base">{station}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}