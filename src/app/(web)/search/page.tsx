import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for SearchInterface to improve initial page load
const SearchInterface = dynamic(() => import('../_components/client/SearchInterface'), {
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
  title: '美容師検索 - Cutmeets',
  description: '練習台を募集中のアシスタント美容師を検索できます。技術向上を目指すアシスタント美容師の練習にご協力いただけます。',
  keywords: '美容師検索,アシスタント美容師,練習台,格安美容室',
};

// Mock data - in a real app, this would come from a database or API
const getHairdressers = () => {
  return [
    {
      id: 1,
      name: '田中 美香',
      salon: 'SALON TOKYO',
      station: '渋谷駅',
      rating: 4.8,
      reviewCount: 156,
      price: '1,500円〜',
      hourlyRate: 2000,
      specialties: ['カット', 'カラー'],
      image: '/api/placeholder/80/80',
      availableToday: true,
      distance: 0.5,
      experience: '2-3',
      gender: 'female',
      lastActive: '2時間前',
      responseRate: 98,
      averagePrice: 2500,
      workingDays: ['月', '火', '水', '木', '金'],
      practiceLevel: '中級',
      practiceNeeds: ['カット技術の向上', '接客スキル向上'],
      supervisionLevel: 'スタイリスト監修あり'
    },
    {
      id: 2,
      name: '佐藤 リナ',
      salon: 'Hair Studio Grace',
      station: '新宿駅',
      rating: 4.9,
      reviewCount: 203,
      price: '2,000円〜',
      hourlyRate: 2500,
      specialties: ['パーマ', 'トリートメント'],
      image: '/api/placeholder/80/80',
      availableToday: false,
      distance: 1.2,
      experience: '3+',
      gender: 'female',
      lastActive: '30分前',
      responseRate: 100,
      averagePrice: 3500,
      workingDays: ['火', '水', '木', '金', '土'],
      practiceLevel: '上級',
      practiceNeeds: ['複合技術の習得', 'デザイン力向上'],
      supervisionLevel: 'スタイリスト監修あり'
    },
    {
      id: 3,
      name: '鈴木 優子',
      salon: 'Beauty Lounge',
      station: '表参道駅',
      rating: 4.7,
      reviewCount: 89,
      price: '1,800円〜',
      hourlyRate: 2200,
      specialties: ['カット', 'ストレート'],
      image: '/api/placeholder/80/80',
      availableToday: true,
      distance: 0.8,
      experience: '1-2',
      gender: 'female',
      lastActive: '1時間前',
      responseRate: 95,
      averagePrice: 2800,
      workingDays: ['月', '水', '金', '土', '日'],
      practiceLevel: '初級',
      practiceNeeds: ['基本カット技術', 'お客様対応'],
      supervisionLevel: 'スタイリスト常時監修'
    },
    {
      id: 4,
      name: '高橋 健太',
      salon: 'Men\'s Studio K',
      station: '池袋駅',
      rating: 4.6,
      reviewCount: 67,
      price: '1,200円〜',
      hourlyRate: 1800,
      specialties: ['カット', 'パーマ'],
      image: '/api/placeholder/80/80',
      availableToday: true,
      distance: 2.1,
      experience: '1-2',
      gender: 'male',
      lastActive: '4時間前',
      responseRate: 88,
      averagePrice: 2200,
      workingDays: ['月', '火', '木', '金', '土'],
      practiceLevel: '初級',
      practiceNeeds: ['メンズカット技術', '接客マナー向上'],
      supervisionLevel: 'スタイリスト常時監修'
    },
    {
      id: 5,
      name: '山田 彩',
      salon: 'Color Salon AYA',
      station: '原宿駅',
      rating: 4.9,
      reviewCount: 124,
      price: '2,500円〜',
      hourlyRate: 3000,
      specialties: ['カラー', 'ブリーチ'],
      image: '/api/placeholder/80/80',
      availableToday: false,
      distance: 1.5,
      experience: '2-3',
      gender: 'female',
      lastActive: '6時間前',
      responseRate: 92,
      averagePrice: 4200,
      workingDays: ['水', '木', '金', '土', '日'],
      practiceLevel: '中級',
      practiceNeeds: ['高度なカラー技術', 'デザインセンス向上'],
      supervisionLevel: 'スタイリスト監修あり'
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
  // Fetch data on the server - this could be from a database, API, etc.
  const hairdressers = getHairdressers();
  const stations = getStations();
  const services = getServices();

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchInterface 
        initialHairdressers={hairdressers}
        stations={stations}
        services={services}
        isAuthenticated={false} // This would come from server-side auth check
      />
    </div>
  );
}