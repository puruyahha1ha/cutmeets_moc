import dynamic from 'next/dynamic';

// Dynamic import for Enhanced SearchInterface to improve initial page load
const EnhancedSearchInterface = dynamic(() => import('../_components/search/EnhancedSearchInterface'), {
  loading: () => (
    <div className="min-h-screen bg-gray-50">
      {/* Search loading skeleton */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex-1 relative">
              <div className="w-full h-10 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"></div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
      <main className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-80"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
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
      </main>
    </div>
  )
});

// Server Component with metadata and static data
export const metadata = {
  title: 'カットモデル募集検索 - Cutmeets',
  description: 'アシスタント美容師が投稿したカットモデル募集案件を検索できます。お得にカットやカラーを体験しながら、技術向上に協力できます。',
  keywords: 'カットモデル募集,練習台,美容室モデル,格安カット,ヘアモデル',
};

// Mock data for recruitment posts - in a real app, this would come from a database or API
const getRecruitmentPosts = () => {
  return [
    {
      id: 1,
      title: 'ボブカット練習のモデルさん募集！',
      assistant: {
        name: '田中 美香',
        experience: '2年目',
        practiceLevel: '中級'
      },
      salon: {
        name: 'SALON TOKYO',
        station: '渋谷駅',
        distance: 0.5
      },
      services: ['カット'],
      description: 'ボブカットの技術向上のため、練習台をお願いします。丁寧にカットさせていただきます。',
      price: 1500,
      originalPrice: 3000,
      duration: 90,
      availableDates: ['2024-01-20', '2024-01-21', '2024-01-22'],
      availableTimes: ['10:00-12:00', '14:00-16:00', '18:00-20:00'],
      requirements: ['肩より長い髪', 'ダメージが少ない髪'],
      modelCount: 3,
      appliedCount: 1,
      postedAt: '2時間前',
      status: 'recruiting' as const,
      rating: 4.8,
      reviewCount: 156
    },
    {
      id: 2,
      title: 'インナーカラー技術練習モデル募集',
      assistant: {
        name: '佐藤 リナ',
        experience: '3年目',
        practiceLevel: '上級'
      },
      salon: {
        name: 'Hair Studio Grace',
        station: '新宿駅',
        distance: 1.2
      },
      services: ['カラー', 'ブリーチ'],
      description: 'インナーカラーのデザイン技術向上のため、モデルを募集しています。ブリーチからカラーまで一連の流れを練習します。',
      price: 2500,
      originalPrice: 8000,
      duration: 180,
      availableDates: ['2024-01-21', '2024-01-23', '2024-01-24'],
      availableTimes: ['13:00-17:00'],
      requirements: ['ブリーチ可能な方', '4時間程度お時間いただける方'],
      modelCount: 2,
      appliedCount: 0,
      postedAt: '30分前',
      status: 'recruiting' as const,
      rating: 4.9,
      reviewCount: 203
    },
    {
      id: 3,
      title: 'レイヤーカット＋縮毛矯正 練習モデル',
      assistant: {
        name: '鈴木 優子',
        experience: '1年目',
        practiceLevel: '初級'
      },
      salon: {
        name: 'Beauty Lounge',
        station: '表参道駅',
        distance: 0.8
      },
      services: ['カット', 'ストレート'],
      description: 'くせ毛を活かしたレイヤーカットと部分的な縮毛矯正の技術練習をします。初級レベルのため、スタイリストが常に付きます。',
      price: 1800,
      originalPrice: 4500,
      duration: 150,
      availableDates: ['2024-01-20', '2024-01-22', '2024-01-25'],
      availableTimes: ['10:00-13:00', '15:00-18:00'],
      requirements: ['くせ毛の方', 'カットOKの方'],
      modelCount: 2,
      appliedCount: 2,
      postedAt: '1時間前',
      status: 'full' as const,
      rating: 4.7,
      reviewCount: 89
    },
    {
      id: 4,
      title: 'メンズフェードカット 練習モデル募集',
      assistant: {
        name: '高橋 健太',
        experience: '1年目',
        practiceLevel: '初級'
      },
      salon: {
        name: 'Men\'s Studio K',
        station: '池袋駅',
        distance: 2.1
      },
      services: ['カット'],
      description: 'メンズのフェードカット技術向上のため、練習台をお願いします。バリカンワークを中心に練習します。',
      price: 1000,
      originalPrice: 2500,
      duration: 60,
      availableDates: ['2024-01-21', '2024-01-22', '2024-01-23'],
      availableTimes: ['11:00-12:00', '14:00-15:00', '16:00-17:00'],
      requirements: ['男性限定', '短髪OK'],
      modelCount: 4,
      appliedCount: 1,
      postedAt: '4時間前',
      status: 'recruiting' as const,
      rating: 4.6,
      reviewCount: 67
    },
    {
      id: 5,
      title: 'ハイライト＋グラデーションカラー練習',
      assistant: {
        name: '山田 彩',
        experience: '2年目',
        practiceLevel: '中級'
      },
      salon: {
        name: 'Color Salon AYA',
        station: '原宿駅',
        distance: 1.5
      },
      services: ['カラー', 'ブリーチ'],
      description: '高度なカラー技術（ハイライト＋グラデーション）の練習をします。デザインセンス向上のため、複数色を使用します。',
      price: 3000,
      originalPrice: 12000,
      duration: 240,
      availableDates: ['2024-01-24', '2024-01-25'],
      availableTimes: ['10:00-14:00', '14:00-18:00'],
      requirements: ['ブリーチ経験あり', '長時間OK', 'デザインカラー希望'],
      modelCount: 1,
      appliedCount: 0,
      postedAt: '6時間前',
      status: 'recruiting' as const,
      rating: 4.9,
      reviewCount: 124
    }
  ];
};

const getStations = () => {
  return [
    '渋谷駅', '新宿駅', '原宿駅', '表参道駅', '銀座駅', '池袋駅',
    '心斎橋駅', '梅田駅', '横浜駅', '名古屋駅', '博多駅', '札幌駅'
  ];
};

const getServices = () => {
  return [
    { id: 'cut', label: 'カット' },
    { id: 'color', label: 'カラー' },
    { id: 'perm', label: 'パーマ' },
    { id: 'treatment', label: 'トリートメント' },
    { id: 'straightening', label: 'ストレート' },
    { id: 'styling', label: 'セット' }
  ];
};

export default async function SearchPage() {
  // Get static data for UI
  const stations = getStations();
  const services = getServices();

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedSearchInterface 
        stations={stations}
        services={services}
        isAuthenticated={false} // This would come from server-side auth check
      />
    </div>
  );
}