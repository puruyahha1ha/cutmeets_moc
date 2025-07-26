import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Metadata for SEO
export const metadata = {
  title: 'ビフォーアフター｜施術実例 - Cutmeets',
  description: 'Cutmeetsのビフォーアフターギャラリー。アシスタント美容師による実際の施術例をご紹介。練習台として協力したお客様の変身事例',
  keywords: 'ビフォーアフター,施術実例,変身,美容師,練習台,カット,カラー,パーマ',
};

// Mock data for before/after transformations
const transformations = [
  {
    id: 1,
    title: 'ロングからボブへの大変身',
    category: 'カット',
    difficulty: '中級',
    beforeDescription: '胸下まである重いロングヘア',
    afterDescription: 'あご下のふんわりボブスタイル',
    price: '¥2,200',
    originalPrice: '¥4,400',
    assistant: {
      name: '田中 美咲',
      salon: '渋谷 Hair Studio A',
      experience: '2年目',
      rating: 4.8,
      avatar: null
    },
    customer: {
      age: 25,
      occupation: 'OL',
      comment: '想像以上に可愛くなれて大満足！朝のセットが楽になりました。'
    },
    beforeImage: null,
    afterImage: null,
    tags: ['ロング→ボブ', '大変身', 'イメチェン'],
    duration: '2時間',
    date: '2024-01-15',
    likes: 127,
    featured: true
  },
  {
    id: 2,
    title: '韓国風カラーでトレンドスタイル',
    category: 'カラー',
    difficulty: '中級',
    beforeDescription: '黒髪のストレートヘア',
    afterDescription: 'アッシュベージュの韓国風カラー',
    price: '¥3,500',
    originalPrice: '¥7,000',
    assistant: {
      name: '金 美優',
      salon: '新宿 K-Beauty Studio',
      experience: '2年目',
      rating: 4.8,
      avatar: null
    },
    customer: {
      age: 22,
      occupation: '大学生',
      comment: '韓国アイドルみたいになれて嬉しいです！みんなに褒められました。'
    },
    beforeImage: null,
    afterImage: null,
    tags: ['韓国風', 'カラー', 'トレンド'],
    duration: '3時間',
    date: '2024-01-12',
    likes: 89,
    featured: true
  },
  {
    id: 3,
    title: 'ハイライトで立体感をプラス',
    category: 'ハイライト',
    difficulty: '上級',
    beforeDescription: '平坦な印象のボブヘア',
    afterDescription: 'ハイライトで立体感のあるボブ',
    price: '¥4,200',
    originalPrice: '¥8,400',
    assistant: {
      name: '田村 翼',
      salon: '原宿 Highlight Studio B',
      experience: '4年目',
      rating: 4.7,
      avatar: null
    },
    customer: {
      age: 28,
      occupation: 'デザイナー',
      comment: '細かいハイライトで髪に動きが出て、おしゃれ度がアップしました！'
    },
    beforeImage: null,
    afterImage: null,
    tags: ['ハイライト', '立体感', 'ボブ'],
    duration: '4時間',
    date: '2024-01-10',
    likes: 156,
    featured: false
  },
  {
    id: 4,
    title: 'デジタルパーマでゆるふわスタイル',
    category: 'パーマ',
    difficulty: '中級',
    beforeDescription: 'ストレートのミディアムヘア',
    afterDescription: 'ゆるふわカールのミディアム',
    price: '¥3,800',
    originalPrice: '¥7,600',
    assistant: {
      name: '山田 あやか',
      salon: '原宿 Curl Studio C',
      experience: '3年目',
      rating: 4.9,
      avatar: null
    },
    customer: {
      age: 26,
      occupation: '会社員',
      comment: 'パーマ初挑戦でしたが、自然な仕上がりで気に入っています！'
    },
    beforeImage: null,
    afterImage: null,
    tags: ['デジタルパーマ', 'ゆるふわ', 'ミディアム'],
    duration: '3.5時間',
    date: '2024-01-08',
    likes: 92,
    featured: false
  },
  {
    id: 5,
    title: 'インナーカラーでさりげないアクセント',
    category: 'インナーカラー',
    difficulty: '初級',
    beforeDescription: '暗めのロングヘア',
    afterDescription: 'ピンクのインナーカラー入り',
    price: '¥2,800',
    originalPrice: '¥5,600',
    assistant: {
      name: '中村 りお',
      salon: '池袋 Point Color Studio',
      experience: '2年目',
      rating: 4.5,
      avatar: null
    },
    customer: {
      age: 20,
      occupation: '専門学生',
      comment: '初めてのカラーでしたが、さりげなくておしゃれ！大学でも好評です。'
    },
    beforeImage: null,
    afterImage: null,
    tags: ['インナーカラー', 'ピンク', 'さりげない'],
    duration: '2.5時間',
    date: '2024-01-05',
    likes: 73,
    featured: false
  },
  {
    id: 6,
    title: 'メンズカットでスッキリ爽やか',
    category: 'メンズカット',
    difficulty: '初級',
    beforeDescription: '伸びきったもっさりヘア',
    afterDescription: 'スッキリ爽やかなショート',
    price: '¥1,800',
    originalPrice: '¥3,600',
    assistant: {
      name: '鈴木 健太',
      salon: '銀座 Style House D',
      experience: '2年目',
      rating: 4.6,
      avatar: null
    },
    customer: {
      age: 24,
      occupation: '営業',
      comment: 'ビジネスシーンにもぴったり！印象がガラッと変わりました。'
    },
    beforeImage: null,
    afterImage: null,
    tags: ['メンズ', 'ショート', 'ビジネス'],
    duration: '1.5時間',
    date: '2024-01-03',
    likes: 45,
    featured: false
  }
];

const categories = ['すべて', 'カット', 'カラー', 'パーマ', 'ハイライト', 'インナーカラー', 'メンズカット'];
const difficulties = ['すべて', '初級', '中級', '上級'];

// Loading component for transformation cards
const TransformationCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="grid grid-cols-2">
      <div className="h-48 bg-gray-200"></div>
      <div className="h-48 bg-gray-200"></div>
    </div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

// Filter component
const TransformationFilterSection = () => (
  <div className="bg-white rounded-xl shadow-md p-4 mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">絞り込み検索</h3>
    
    {/* Category filter */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">施術カテゴリー</label>
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

    {/* Difficulty filter */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">練習レベル</label>
      <div className="flex flex-wrap gap-2">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-pink-50 hover:border-pink-300 transition-colors"
          >
            {difficulty}
          </button>
        ))}
      </div>
    </div>

    {/* Featured only */}
    <div className="mb-4">
      <label className="flex items-center">
        <input type="checkbox" className="mr-2 rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
        <span className="text-sm text-gray-700">注目の変身事例のみ</span>
      </label>
    </div>

    {/* Sort options */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">並び順</label>
      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
        <option value="newest">新着順</option>
        <option value="likes">いいね数順</option>
        <option value="rating">評価の高い順</option>
        <option value="featured">注目順</option>
      </select>
    </div>
  </div>
);

// Transformation card component
const TransformationCard = ({ transformation }: { transformation: typeof transformations[0] }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    {/* Before/After images */}
    <div className="grid grid-cols-2 relative">
      {/* Before */}
      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <div className="absolute top-2 left-2 bg-gray-700 text-white px-2 py-1 rounded text-xs font-semibold">
          BEFORE
        </div>
        <div className="text-3xl opacity-60">👤</div>
      </div>
      
      {/* After */}
      <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded text-xs font-semibold">
          AFTER
        </div>
        <div className="text-3xl opacity-60">✨</div>
      </div>

      {/* Featured badge */}
      {transformation.featured && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          注目
        </div>
      )}
    </div>

    <div className="p-4">
      {/* Title and category */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {transformation.title}
        </h3>
        <span className={`px-2 py-1 text-xs rounded-full font-medium ml-2 flex-shrink-0 ${
          transformation.difficulty === '初級' ? 'bg-green-100 text-green-800' :
          transformation.difficulty === '中級' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {transformation.difficulty}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {transformation.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Before/After descriptions */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div>
          <p className="text-gray-500 mb-1">BEFORE</p>
          <p className="text-gray-700 line-clamp-2">{transformation.beforeDescription}</p>
        </div>
        <div>
          <p className="text-pink-500 mb-1">AFTER</p>
          <p className="text-gray-700 line-clamp-2">{transformation.afterDescription}</p>
        </div>
      </div>

      {/* Duration and price */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-500">
          施術時間: {transformation.duration}
        </div>
        <div className="flex items-center">
          <span className="text-lg font-bold text-pink-500">{transformation.price}</span>
          <span className="text-sm text-gray-400 line-through ml-2">{transformation.originalPrice}</span>
        </div>
      </div>

      {/* Customer comment */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <p className="text-sm text-gray-700 line-clamp-2">
          &ldquo;{transformation.customer.comment}&rdquo;
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {transformation.customer.age}歳 {transformation.customer.occupation}
        </p>
      </div>

      {/* Assistant info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-semibold text-pink-600">
              {transformation.assistant.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {transformation.assistant.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {transformation.assistant.salon}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm text-gray-600 ml-1">{transformation.assistant.rating}</span>
          </div>
          <div className="flex items-center">
            <span className="text-red-400">❤️</span>
            <span className="text-sm text-gray-600 ml-1">{transformation.likes}</span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <Link
        href={`/booking/${transformation.assistant.name.replace(/\s+/g, '')}`}
        className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all text-center block"
      >
        この美容師に予約する
      </Link>
    </div>
  </div>
);

export default function BeforeAfterPage() {
  const featuredTransformations = transformations.filter(t => t.featured);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-500 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-ja font-size-adjust contain-layout">
            ビフォーアフターギャラリー
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-6 text-ja">
            アシスタント美容師による実際の施術例をご紹介
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <span className="mr-2">✨</span>
              <span>リアルな変身事例</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">💬</span>
              <span>お客様の生の声</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📸</span>
              <span>Before→After写真</span>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav className="text-sm">
          <Link href="/" className="text-gray-500 hover:text-pink-500">ホーム</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800">ビフォーアフター</span>
        </nav>
      </div>

      {/* Featured section */}
      {featuredTransformations.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">⭐</span>
            注目の変身事例
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredTransformations.slice(0, 2).map((transformation) => (
              <TransformationCard key={transformation.id} transformation={transformation} />
            ))}
          </div>
        </section>
      )}

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar filters */}
          <div className="lg:col-span-1">
            <TransformationFilterSection />
            
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-md p-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">実績統計</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">総変身事例</span>
                  <span className="font-semibold">1,234件</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">満足度</span>
                  <span className="font-semibold text-green-600">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">リピート率</span>
                  <span className="font-semibold text-blue-600">87.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">平均評価</span>
                  <span className="font-semibold text-yellow-600">4.7⭐</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 変身のコツ</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• なりたいイメージを明確に伝える</p>
                <p>• ライフスタイルに合った提案を</p>
                <p>• アフターケアもしっかりと</p>
                <p>• 定期的なメンテナンスを</p>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {transformations.length}件の変身事例が見つかりました
              </h2>
              <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-pink-500">
                <span>ギャラリー表示</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </button>
            </div>

            {/* Transformation grid */}
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <TransformationCardSkeleton key={i} />
                ))}
              </div>
            }>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {transformations.map((transformation) => (
                  <TransformationCard key={transformation.id} transformation={transformation} />
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

      {/* Customer testimonials */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
            お客様の声
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {transformations.slice(0, 3).map((transformation) => (
              <div key={transformation.id} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {transformation.customer.age}歳
                    </p>
                    <p className="text-sm text-gray-600">
                      {transformation.customer.occupation}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">&ldquo;{transformation.customer.comment}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{transformation.title}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-500 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            あなたも変身体験をしてみませんか？
          </h2>
          <p className="text-lg opacity-90 mb-6">
            アシスタント美容師と一緒に理想の自分を見つけましょう
          </p>
          <Link
            href="/search"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            アシスタント美容師を探す
          </Link>
        </div>
      </section>
    </div>
  );
}