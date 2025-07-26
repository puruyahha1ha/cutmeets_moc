import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Metadata for SEO
export const metadata = {
  title: 'カラーカタログ｜ハイトーン・韓国風カラー - Cutmeets',
  description: 'Cutmeetsのカラーカタログ。アシスタント美容師による格安ヘアカラー・ハイライト・グラデーションをご紹介。練習台として協力しながらプロの技術を体験',
  keywords: 'ヘアカラー,ハイトーン,韓国風,ハイライト,グラデーション,美容師,練習台,格安',
};

// Mock data for color styles
const colorStyles = [
  {
    id: 1,
    title: 'アッシュベージュ',
    category: 'ナチュラル',
    type: 'フルカラー',
    colorCode: '#C4A484',
    price: '¥3,200',
    originalPrice: '¥6,400',
    assistant: {
      name: '松本 さくら',
      salon: '渋谷 Color Lab A',
      experience: '3年目',
      rating: 4.9,
      avatar: null
    },
    image: null,
    tags: ['アッシュ', 'ベージュ', 'ナチュラル'],
    available: true,
    practiceLevel: '中級',
    description: '透明感のあるアッシュベージュ。日本人の肌色に馴染みやすく、上品な印象を与えます。',
    duration: '2-3時間',
    maintenance: '6-8週間'
  },
  {
    id: 2,
    title: '韓国風オリーブベージュ',
    category: '韓国風',
    type: 'フルカラー',
    colorCode: '#8B8B5C',
    price: '¥3,500',
    originalPrice: '¥7,000',
    assistant: {
      name: '金 美優',
      salon: '新宿 K-Beauty Studio',
      experience: '2年目',
      rating: 4.8,
      avatar: null
    },
    image: null,
    tags: ['韓国風', 'オリーブ', 'トレンド'],
    available: true,
    practiceLevel: '中級',
    description: '今話題の韓国風オリーブベージュ。マットな質感で洗練された印象に。',
    duration: '3-4時間',
    maintenance: '8-10週間'
  },
  {
    id: 3,
    title: 'ハイライト×グラデーション',
    category: 'ハイトーン',
    type: 'ハイライト',
    colorCode: '#F5E6D3',
    price: '¥4,200',
    originalPrice: '¥8,400',
    assistant: {
      name: '田村 翼',
      salon: '原宿 Highlight Studio B',
      experience: '4年目',
      rating: 4.7,
      avatar: null
    },
    image: null,
    tags: ['ハイライト', 'グラデーション', '立体感'],
    available: false,
    practiceLevel: '上級',
    description: '細かいハイライトで作る立体感あるグラデーション。動くたびに表情を変える美しいカラー。',
    duration: '4-5時間',
    maintenance: '10-12週間'
  },
  {
    id: 4,
    title: 'ミルクティーベージュ',
    category: 'ハイトーン',
    type: 'ブリーチ必須',
    colorCode: '#E8D5C4',
    price: '¥4,800',
    originalPrice: '¥9,600',
    assistant: {
      name: '小林 あい',
      salon: '表参道 Milk Tea Color',
      experience: '3年目',
      rating: 4.6,
      avatar: null
    },
    image: null,
    tags: ['ミルクティー', 'ハイトーン', '可愛い'],
    available: true,
    practiceLevel: '上級',
    description: 'トレンドのミルクティーベージュ。透明感と可愛らしさを兼ね備えた人気カラー。',
    duration: '5-6時間',
    maintenance: '6-8週間'
  },
  {
    id: 5,
    title: 'インナーカラー ピンク',
    category: 'ポイントカラー',
    type: 'インナーカラー',
    colorCode: '#FFB6C1',
    price: '¥2,800',
    originalPrice: '¥5,600',
    assistant: {
      name: '中村 りお',
      salon: '池袋 Point Color Studio',
      experience: '2年目',
      rating: 4.5,
      avatar: null
    },
    image: null,
    tags: ['インナーカラー', 'ピンク', 'ポイント'],
    available: true,
    practiceLevel: '初級',
    description: 'さりげないのに印象的なインナーカラー。オフィスでも浮かない絶妙なピンク。',
    duration: '2-3時間',
    maintenance: '8-10週間'
  },
  {
    id: 6,
    title: 'バレイヤージュ×ブロンド',
    category: 'ハイトーン',
    type: 'バレイヤージュ',
    colorCode: '#F0E68C',
    price: '¥5,200',
    originalPrice: '¥10,400',
    assistant: {
      name: '高田 レン',
      salon: '銀座 Balayage Expert',
      experience: '5年目',
      rating: 4.9,
      avatar: null
    },
    image: null,
    tags: ['バレイヤージュ', 'ブロンド', '外国人風'],
    available: true,
    practiceLevel: '上級',
    description: '外国人風のナチュラルなバレイヤージュ。根元から毛先にかけての自然なグラデーション。',
    duration: '5-7時間',
    maintenance: '12-16週間'
  }
];

const categories = ['すべて', 'ナチュラル', '韓国風', 'ハイトーン', 'ポイントカラー'];
const types = ['すべて', 'フルカラー', 'ハイライト', 'インナーカラー', 'バレイヤージュ', 'ブリーチ必須'];
const practiceLevels = ['すべて', '初級', '中級', '上級'];

// Loading component for color cards
const ColorCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
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
const ColorFilterSection = () => (
  <div className="bg-white rounded-xl shadow-md p-4 mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">絞り込み検索</h3>
    
    {/* Category filter */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリー</label>
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

    {/* Color tone range */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">明度</label>
      <div className="flex space-x-2">
        <button className="flex-1 py-2 px-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          暗め
        </button>
        <button className="flex-1 py-2 px-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          普通
        </button>
        <button className="flex-1 py-2 px-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          明るめ
        </button>
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

// Color card component
const ColorCard = ({ color }: { color: typeof colorStyles[0] }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    {/* Image placeholder with color preview */}
    <div className="relative w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-white shadow-md" 
           style={{ backgroundColor: color.colorCode }}></div>
      <div className="text-4xl opacity-60">🎨</div>
      {!color.available && (
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
        <div>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {color.title}
          </h3>
          <div className="flex items-center mt-1">
            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.colorCode }}></div>
            <span className="text-sm text-gray-500">{color.colorCode}</span>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
          color.practiceLevel === '初級' ? 'bg-green-100 text-green-800' :
          color.practiceLevel === '中級' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {color.practiceLevel}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {color.tags.slice(0, 3).map((tag) => (
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
        {color.description}
      </p>

      {/* Duration and maintenance */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-500">
        <div>
          <span className="block font-medium">施術時間</span>
          <span>{color.duration}</span>
        </div>
        <div>
          <span className="block font-medium">持続期間</span>
          <span>{color.maintenance}</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center mb-3">
        <span className="text-2xl font-bold text-pink-500">{color.price}</span>
        <span className="text-sm text-gray-400 line-through ml-2">{color.originalPrice}</span>
        <span className="text-sm text-green-600 font-semibold ml-2">50% OFF</span>
      </div>

      {/* Assistant info */}
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
          <span className="text-sm font-semibold text-pink-600">
            {color.assistant.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {color.assistant.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {color.assistant.salon} | {color.assistant.experience}
          </p>
        </div>
        <div className="flex items-center">
          <span className="text-yellow-400">⭐</span>
          <span className="text-sm text-gray-600 ml-1">{color.assistant.rating}</span>
        </div>
      </div>

      {/* Action button */}
      <Link
        href={`/booking/${color.assistant.name.replace(/\s+/g, '')}`}
        className={`w-full text-center py-3 rounded-lg font-semibold transition-all ${
          color.available
            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {color.available ? '予約する' : '受付停止中'}
      </Link>
    </div>
  </div>
);

export default function ColorCatalogPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-500 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-ja font-size-adjust contain-layout">
            カラーカタログ
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-6 text-ja">
            アシスタント美容師による格安ヘアカラー・ハイライト・グラデーション
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <span className="mr-2">🎨</span>
              <span>豊富なカラーバリエーション</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">💰</span>
              <span>正規料金の50%OFF</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🏆</span>
              <span>トレンドカラー対応</span>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav className="text-sm">
          <Link href="/" className="text-gray-500 hover:text-pink-500">ホーム</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800">カラーカタログ</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar filters */}
          <div className="lg:col-span-1">
            <ColorFilterSection />
            
            {/* Color palette preview */}
            <div className="bg-white rounded-xl shadow-md p-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">人気のカラー</h3>
              <div className="grid grid-cols-4 gap-2">
                {['#C4A484', '#8B8B5C', '#F5E6D3', '#E8D5C4', '#FFB6C1', '#F0E68C', '#DDA0DD', '#98FB98'].map((color, index) => (
                  <button
                    key={index}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-pink-300 transition-colors"
                    style={{ backgroundColor: color }}
                    title={`カラー ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Color tips */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 カラーのコツ</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• 初回は明るさを1-2トーン抑えめに</p>
                <p>• ブリーチ必須カラーは事前相談を</p>
                <p>• ケア用品で色持ちアップ</p>
                <p>• 肌色に合わせたトーン選択</p>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {colorStyles.length}件のカラーが見つかりました
              </h2>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-pink-500">
                  <span>カラーパレット表示</span>
                  <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded"></div>
                </button>
              </div>
            </div>

            {/* Color grid */}
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ColorCardSkeleton key={i} />
                ))}
              </div>
            }>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {colorStyles.map((color) => (
                  <ColorCard key={color.id} color={color} />
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

      {/* Warning section */}
      <section className="bg-yellow-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
              <span className="mr-2">⚠️</span>
              カラー施術について重要なお知らせ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">事前にご確認ください</h4>
                <ul className="space-y-1">
                  <li>• アレルギーテストの実施</li>
                  <li>• 前回のカラー歴</li>
                  <li>• 髪の傷み具合</li>
                  <li>• 希望の明るさレベル</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">施術後のケア</h4>
                <ul className="space-y-1">
                  <li>• 24時間シャンプー禁止</li>
                  <li>• カラー専用シャンプー使用</li>
                  <li>• 紫外線対策</li>
                  <li>• 定期的なトリートメント</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-500 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            理想のカラーを見つけて新しい自分に
          </h2>
          <p className="text-lg opacity-90 mb-6">
            アシスタント美容師と一緒に、あなたにぴったりのカラーを見つけませんか？
          </p>
          <Link
            href="/search"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            アシスタント美容師を探す
          </Link>
        </div>
      </section>
    </div>
  );
}