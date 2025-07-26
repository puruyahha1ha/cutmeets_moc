import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Metadata for SEO
export const metadata = {
  title: 'ヘアスタイル｜カット・パーマ - Cutmeets',
  description: 'Cutmeetsのヘアスタイルカタログ。アシスタント美容師による格安カット・パーマスタイルをご紹介。練習台として協力しながらプロの技術を体験',
  keywords: 'ヘアスタイル,カット,パーマ,美容師,練習台,格安,スタイルカタログ',
};

// Mock data for hair styles
const hairStyles = [
  {
    id: 1,
    title: 'ナチュラルロングレイヤー',
    category: 'ロング',
    type: 'カット',
    price: '¥2,500',
    originalPrice: '¥5,000',
    assistant: {
      name: '田中 美咲',
      salon: '渋谷 Hair Studio A',
      experience: '2年目',
      rating: 4.8,
      avatar: null
    },
    image: null,
    tags: ['ナチュラル', 'レイヤー', 'ロング'],
    available: true,
    practiceLevel: '中級',
    description: 'ナチュラルな毛流れを活かしたロングレイヤースタイル。フェイスラインを美しく見せるカットラインが特徴です。'
  },
  {
    id: 2,
    title: 'ふんわりボブ',
    category: 'ボブ',
    type: 'カット',
    price: '¥2,200',
    originalPrice: '¥4,400',
    assistant: {
      name: '佐藤 雄太',
      salon: '新宿 Beauty Salon B',
      experience: '1年目',
      rating: 4.5,
      avatar: null
    },
    image: null,
    tags: ['ボブ', 'ふんわり', '可愛い'],
    available: true,
    practiceLevel: '初級',
    description: '丸みのある可愛らしいボブスタイル。毛先の内巻きで上品さも演出できます。'
  },
  {
    id: 3,
    title: 'デジタルパーマ×ミディアム',
    category: 'ミディアム',
    type: 'パーマ',
    price: '¥3,800',
    originalPrice: '¥7,600',
    assistant: {
      name: '山田 あやか',
      salon: '原宿 Curl Studio C',
      experience: '3年目',
      rating: 4.9,
      avatar: null
    },
    image: null,
    tags: ['デジタルパーマ', 'ミディアム', 'カール'],
    available: false,
    practiceLevel: '上級',
    description: '自然なカールが長持ちするデジタルパーマ。朝のスタイリングが楽になります。'
  },
  {
    id: 4,
    title: 'ショートレイヤー',
    category: 'ショート',
    type: 'カット',
    price: '¥2,000',
    originalPrice: '¥4,000',
    assistant: {
      name: '鈴木 健太',
      salon: '銀座 Style House D',
      experience: '2年目',
      rating: 4.6,
      avatar: null
    },
    image: null,
    tags: ['ショート', 'レイヤー', 'クール'],
    available: true,
    practiceLevel: '中級',
    description: 'クールで洗練されたショートレイヤー。動きのあるスタイルで小顔効果も期待できます。'
  },
  {
    id: 5,
    title: '韓国風ウルフカット',
    category: 'ミディアム',
    type: 'カット',
    price: '¥2,800',
    originalPrice: '¥5,600',
    assistant: {
      name: '渡辺 梨花',
      salon: '表参道 Trend Salon E',
      experience: '2年目',
      rating: 4.7,
      avatar: null
    },
    image: null,
    tags: ['ウルフ', '韓国風', 'トレンド'],
    available: true,
    practiceLevel: '中級',
    description: '今話題の韓国風ウルフカット。エッジの効いたスタイルで個性的な印象に。'
  },
  {
    id: 6,
    title: 'ゆるパーマ×ロング',
    category: 'ロング',
    type: 'パーマ',
    price: '¥3,500',
    originalPrice: '¥7,000',
    assistant: {
      name: '高橋 聡',
      salon: '池袋 Wave Studio F',
      experience: '1年目',
      rating: 4.4,
      avatar: null
    },
    image: null,
    tags: ['ゆるパーマ', 'ロング', 'フェミニン'],
    available: true,
    practiceLevel: '初級',
    description: 'ナチュラルなゆるふわパーマ。女性らしい柔らかい印象を演出します。'
  }
];

const categories = ['すべて', 'ショート', 'ボブ', 'ミディアム', 'ロング'];
const types = ['すべて', 'カット', 'パーマ'];
const practiceLevels = ['すべて', '初級', '中級', '上級'];

// Loading component for style cards
const StyleCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="flex space-x-2">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

// Filter component
const FilterSection = () => (
  <div className="bg-white rounded-xl shadow-md p-4 mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">絞り込み検索</h3>
    
    {/* Category filter */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">髪の長さ</label>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-pink-50 hover:border-pink-300 transition-colors"
          >
            {category}
          </button>
        ))}
      </div>
    </div>

    {/* Type filter */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">施術タイプ</label>
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-pink-50 hover:border-pink-300 transition-colors"
          >
            {type}
          </button>
        ))}
      </div>
    </div>

    {/* Practice level filter */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">練習レベル</label>
      <div className="flex flex-wrap gap-2">
        {practiceLevels.map((level) => (
          <button
            key={level}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-pink-50 hover:border-pink-300 transition-colors"
          >
            {level}
          </button>
        ))}
      </div>
    </div>

    {/* Sort options */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">並び順</label>
      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
        <option value="newest">新着順</option>
        <option value="price-low">価格の安い順</option>
        <option value="price-high">価格の高い順</option>
        <option value="rating">評価の高い順</option>
        <option value="popular">人気順</option>
      </select>
    </div>
  </div>
);

// Style card component
const StyleCard = ({ style }: { style: typeof hairStyles[0] }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    {/* Image placeholder */}
    <div className="relative w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
      <div className="text-4xl opacity-60">💇‍♀️</div>
      {!style.available && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            予約受付停止中
          </span>
        </div>
      )}
    </div>

    <div className="p-4">
      {/* Title and category */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {style.title}
        </h3>
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
          style.practiceLevel === '初級' ? 'bg-green-100 text-green-800' :
          style.practiceLevel === '中級' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {style.practiceLevel}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {style.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {style.description}
      </p>

      {/* Price */}
      <div className="flex items-center mb-3">
        <span className="text-2xl font-bold text-pink-500">{style.price}</span>
        <span className="text-sm text-gray-400 line-through ml-2">{style.originalPrice}</span>
        <span className="text-sm text-green-600 font-semibold ml-2">50% OFF</span>
      </div>

      {/* Assistant info */}
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
          <span className="text-sm font-semibold text-pink-600">
            {style.assistant.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {style.assistant.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {style.assistant.salon} | {style.assistant.experience}
          </p>
        </div>
        <div className="flex items-center">
          <span className="text-yellow-400">⭐</span>
          <span className="text-sm text-gray-600 ml-1">{style.assistant.rating}</span>
        </div>
      </div>

      {/* Action button */}
      <Link
        href={`/booking/${style.assistant.name.replace(/\s+/g, '')}`}
        className={`w-full text-center py-3 rounded-lg font-semibold transition-all ${
          style.available
            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {style.available ? '予約する' : '受付停止中'}
      </Link>
    </div>
  </div>
);

export default function HairStylesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-pink-500 to-red-500 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-ja font-size-adjust contain-layout">
            ヘアスタイルカタログ
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-6 text-ja">
            アシスタント美容師による格安カット・パーマスタイル
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <span className="mr-2">💰</span>
              <span>正規料金の50%OFF</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🎓</span>
              <span>スタイリスト監修</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">⭐</span>
              <span>品質保証</span>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav className="text-sm">
          <Link href="/" className="text-gray-500 hover:text-pink-500">ホーム</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800">ヘアスタイル</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar filters */}
          <div className="lg:col-span-1">
            <FilterSection />
            
            {/* Popular styles */}
            <div className="bg-white rounded-xl shadow-md p-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">人気のスタイル</h3>
              <div className="space-y-3">
                {['ナチュラルロング', 'ふんわりボブ', '韓国風ウルフ', 'ショートレイヤー'].map((style) => (
                  <button
                    key={style}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors"
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {hairStyles.length}件のスタイルが見つかりました
              </h2>
              <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-pink-500">
                <span>一覧表示</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Style grid */}
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <StyleCardSkeleton key={i} />
                ))}
              </div>
            }>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {hairStyles.map((style) => (
                  <StyleCard key={style.id} style={style} />
                ))}
              </div>
            </Suspense>

            {/* Load more button */}
            <div className="text-center mt-8">
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                さらに読み込む
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <section className="bg-pink-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            お気に入りのスタイルは見つかりましたか？
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            練習台として協力しながら、プロの技術を格安で体験してみませんか？
          </p>
          <Link
            href="/search"
            className="inline-block bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all"
          >
            アシスタント美容師を探す
          </Link>
        </div>
      </section>
    </div>
  );
}