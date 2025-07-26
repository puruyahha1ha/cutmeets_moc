import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Metadata for SEO
export const metadata = {
  title: 'メンズスタイル｜メンズカット - Cutmeets',
  description: 'Cutmeetsのメンズスタイルカタログ。アシスタント美容師による格安メンズカット・スタイリングをご紹介。練習台として協力しながらプロの技術を体験',
  keywords: 'メンズカット,メンズヘア,男性,美容師,練習台,格安,ビジネススタイル',
};

// Mock data for men's styles
const mensStyles = [
  {
    id: 1,
    title: 'ビジネスショート',
    category: 'ビジネス',
    type: 'カット',
    hairLength: 'ショート',
    price: '¥1,800',
    originalPrice: '¥3,600',
    assistant: {
      name: '鈴木 健太',
      salon: '銀座 Style House D',
      experience: '2年目',
      rating: 4.6,
      avatar: null,
      speciality: 'メンズカット'
    },
    image: null,
    tags: ['ビジネス', 'ショート', '清潔感'],
    available: true,
    practiceLevel: '初級',
    description: '清潔感のあるビジネスシーンにぴったりなショートスタイル。どんな職場でも好印象を与えます。',
    duration: '1時間',
    maintenance: '3-4週間',
    ageRange: '20-40代',
    faceShape: ['丸顔', '卵型', '面長']
  },
  {
    id: 2,
    title: '韓国風マッシュ',
    category: 'トレンド',
    type: 'カット',
    hairLength: 'ミディアム',
    price: '¥2,200',
    originalPrice: '¥4,400',
    assistant: {
      name: '朴 ジヒョン',
      salon: '新宿 K-Style Salon',
      experience: '3年目',
      rating: 4.8,
      avatar: null,
      speciality: 'アジアンスタイル'
    },
    image: null,
    tags: ['韓国風', 'マッシュ', 'トレンド'],
    available: true,
    practiceLevel: '中級',
    description: '今話題の韓国風マッシュスタイル。柔らかい印象で女性受けも抜群のモテヘア。',
    duration: '1.5時間',
    maintenance: '4-5週間',
    ageRange: '10-30代',
    faceShape: ['丸顔', '卵型']
  },
  {
    id: 3,
    title: 'ツーブロック×ベリーショート',
    category: 'スポーティ',
    type: 'カット',
    hairLength: 'ベリーショート',
    price: '¥1,600',
    originalPrice: '¥3,200',
    assistant: {
      name: '田中 大輔',
      salon: '渋谷 Sports Cut Studio',
      experience: '2年目',
      rating: 4.5,
      avatar: null,
      speciality: 'ショートカット'
    },
    image: null,
    tags: ['ツーブロック', 'ベリーショート', 'スッキリ'],
    available: true,
    practiceLevel: '初級',
    description: 'サイドをスッキリ刈り上げたツーブロックスタイル。スポーツマンや暑がりの方におすすめ。',
    duration: '45分',
    maintenance: '2-3週間',
    ageRange: '10-30代',
    faceShape: ['すべて']
  },
  {
    id: 4,
    title: 'ナチュラルミディアム',
    category: 'カジュアル',
    type: 'カット',
    hairLength: 'ミディアム',
    price: '¥2,000',
    originalPrice: '¥4,000',
    assistant: {
      name: '佐藤 翔',
      salon: '原宿 Natural Hair',
      experience: '3年目',
      rating: 4.7,
      avatar: null,
      speciality: 'ナチュラルスタイル'
    },
    image: null,
    tags: ['ナチュラル', 'ミディアム', 'カジュアル'],
    available: false,
    practiceLevel: '中級',
    description: 'カジュアルシーンに最適なナチュラルミディアム。毛流れを活かした自然なスタイル。',
    duration: '1.5時間',
    maintenance: '5-6週間',
    ageRange: '20-40代',
    faceShape: ['卵型', '面長', '逆三角']
  },
  {
    id: 5,
    title: 'アップバング×フェード',
    category: 'モダン',
    type: 'カット',
    hairLength: 'ショート',
    price: '¥2,400',
    originalPrice: '¥4,800',
    assistant: {
      name: '山田 竜也',
      salon: '表参道 Modern Barber',
      experience: '4年目',
      rating: 4.9,
      avatar: null,
      speciality: 'フェードカット'
    },
    image: null,
    tags: ['アップバング', 'フェード', 'モダン'],
    available: true,
    practiceLevel: '上級',
    description: '洗練されたフェードカットとアップバングの組み合わせ。都会的でスタイリッシュな印象。',
    duration: '2時間',
    maintenance: '3-4週間',
    ageRange: '20-35代',
    faceShape: ['卵型', '面長']
  },
  {
    id: 6,
    title: 'パーマ×ショート',
    category: 'パーマスタイル',
    type: 'カット+パーマ',
    hairLength: 'ショート',
    price: '¥3,500',
    originalPrice: '¥7,000',
    assistant: {
      name: '高橋 慎一',
      salon: '池袋 Wave Studio M',
      experience: '5年目',
      rating: 4.8,
      avatar: null,
      speciality: 'メンズパーマ'
    },
    image: null,
    tags: ['パーマ', 'ショート', '動き'],
    available: true,
    practiceLevel: '上級',
    description: 'ナチュラルなパーマで動きを出したショートスタイル。スタイリングが楽になります。',
    duration: '2.5時間',
    maintenance: '8-10週間',
    ageRange: '20-40代',
    faceShape: ['丸顔', '卵型']
  }
];

const categories = ['すべて', 'ビジネス', 'トレンド', 'カジュアル', 'スポーティ', 'モダン', 'パーマスタイル'];
const hairLengths = ['すべて', 'ベリーショート', 'ショート', 'ミディアム'];
const ageRanges = ['すべて', '10-20代', '20-30代', '30-40代', '40代以上'];
const faceShapes = ['すべて', '丸顔', '卵型', '面長', '逆三角', 'ベース型'];

// Loading component for men's style cards
const MensStyleCardSkeleton = () => (
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

// Filter component for men's styles
const MensFilterSection = () => (
  <div className="bg-white rounded-xl shadow-md p-4 mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">絞り込み検索</h3>
    
    {/* Category filter */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">スタイルカテゴリー</label>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            {category}
          </button>
        ))}
      </div>
    </div>

    {/* Hair length filter */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">髪の長さ</label>
      <div className="flex flex-wrap gap-2">
        {hairLengths.map((length) => (
          <button
            key={length}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            {length}
          </button>
        ))}
      </div>
    </div>

    {/* Age range filter */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">年代</label>
      <div className="flex flex-wrap gap-2">
        {ageRanges.map((age) => (
          <button
            key={age}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            {age}
          </button>
        ))}
      </div>
    </div>

    {/* Face shape filter */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">顔型</label>
      <div className="flex flex-wrap gap-2">
        {faceShapes.map((shape) => (
          <button
            key={shape}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            {shape}
          </button>
        ))}
      </div>
    </div>

    {/* Sort options */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">並び順</label>
      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        <option value="newest">新着順</option>
        <option value="price-low">価格の安い順</option>
        <option value="price-high">価格の高い順</option>
        <option value="rating">評価の高い順</option>
        <option value="popular">人気順</option>
      </select>
    </div>
  </div>
);

// Men's style card component
const MensStyleCard = ({ style }: { style: typeof mensStyles[0] }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    {/* Image placeholder */}
    <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
      <div className="text-4xl opacity-60">💇‍♂️</div>
      {!style.available && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            予約受付停止中
          </span>
        </div>
      )}
      {/* Category badge */}
      <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
        {style.category}
      </div>
    </div>

    <div className="p-4">
      {/* Title and practice level */}
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

      {/* Style details */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-500">
        <div>
          <span className="block font-medium">施術時間</span>
          <span>{style.duration}</span>
        </div>
        <div>
          <span className="block font-medium">メンテナンス</span>
          <span>{style.maintenance}</span>
        </div>
        <div>
          <span className="block font-medium">おすすめ年代</span>
          <span>{style.ageRange}</span>
        </div>
        <div>
          <span className="block font-medium">顔型</span>
          <span>{style.faceShape.slice(0, 2).join(', ')}</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center mb-3">
        <span className="text-2xl font-bold text-blue-500">{style.price}</span>
        <span className="text-sm text-gray-400 line-through ml-2">{style.originalPrice}</span>
        <span className="text-sm text-green-600 font-semibold ml-2">50% OFF</span>
      </div>

      {/* Assistant info */}
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <span className="text-sm font-semibold text-blue-600">
            {style.assistant.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {style.assistant.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {style.assistant.salon} | {style.assistant.speciality}
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
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {style.available ? '予約する' : '受付停止中'}
      </Link>
    </div>
  </div>
);

export default function MensStylesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-ja font-size-adjust contain-layout">
            メンズスタイルカタログ
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-6 text-ja">
            アシスタント美容師による格安メンズカット・スタイリング
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <span className="mr-2">💼</span>
              <span>ビジネスにも対応</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">💰</span>
              <span>正規料金の50%OFF</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">⏰</span>
              <span>短時間で完了</span>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav className="text-sm">
          <Link href="/" className="text-gray-500 hover:text-blue-500">ホーム</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800">メンズスタイル</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar filters */}
          <div className="lg:col-span-1">
            <MensFilterSection />
            
            {/* Popular styles for men */}
            <div className="bg-white rounded-xl shadow-md p-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">人気のスタイル</h3>
              <div className="space-y-3">
                {['ビジネスショート', '韓国風マッシュ', 'ツーブロック', 'フェードカット'].map((style) => (
                  <button
                    key={style}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Face shape guide */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 顔型診断</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  <span>丸顔: 縦のラインを強調</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span>面長: 横幅を意識したスタイル</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  <span>ベース型: トップにボリューム</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  <span>逆三角: サイドにボリューム</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {mensStyles.length}件のメンズスタイルが見つかりました
              </h2>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-500">
                  <span>スタイル一覧</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Style grid */}
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <MensStyleCardSkeleton key={i} />
                ))}
              </div>
            }>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mensStyles.map((style) => (
                  <MensStyleCard key={style.id} style={style} />
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

      {/* Men's grooming tips */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              メンズヘアケアのコツ
            </h2>
            <p className="text-lg text-gray-600">
              美容師が教える、スタイルを長持ちさせる秘訣
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-3xl mb-4">🧴</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">適切なシャンプー</h3>
              <p className="text-sm text-gray-600">
                頭皮タイプに合ったシャンプーで清潔に保つ
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-3xl mb-4">💨</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">正しいドライヤー</h3>
              <p className="text-sm text-gray-600">
                根元から乾かして立体感をキープ
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-3xl mb-4">✂️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">定期的なカット</h3>
              <p className="text-sm text-gray-600">
                3-4週間に一度のメンテナンスが理想
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-3xl mb-4">💪</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">スタイリング剤</h3>
              <p className="text-sm text-gray-600">
                髪質に合ったワックスやジェルを選択
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business style showcase */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              ビジネスシーンにおすすめ
            </h2>
            <p className="text-lg text-gray-600">
              職場で好印象を与えるスタイル
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mensStyles.filter(style => style.category === 'ビジネス' || style.tags.includes('ビジネス')).slice(0, 3).map((style) => (
              <div key={style.id} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💼</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{style.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{style.description}</p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span>⏰ {style.duration}</span>
                    <span>💰 {style.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            理想のメンズスタイルを見つけよう
          </h2>
          <p className="text-lg opacity-90 mb-6">
            アシスタント美容師と一緒に、あなたにぴったりのスタイルを作りませんか？
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/search"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              アシスタント美容師を探す
            </Link>
            <Link
              href="/register"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              新規登録（無料）
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}