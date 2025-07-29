import { NextRequest, NextResponse } from 'next/server';
import { SearchEngine, SearchQuery, SearchableItem } from '@/lib/search/search-engine';
import { searchCache, searchHistory } from '@/lib/search/search-cache';
import { searchAnalytics } from '@/lib/search/search-analytics';

// 検索エンジンのインスタンス
let searchEngineInstance: SearchEngine;

// モックデータの生成
const generateMockData = (): SearchableItem[] => {
  const mockData: SearchableItem[] = [];
  
  const sampleData = [
    {
      id: 1,
      title: 'ボブカット練習のモデルさん募集！',
      description: 'ボブカットの技術向上のため、練習台をお願いします。丁寧にカットさせていただきます。',
      keywords: ['ボブカット', 'カット', '練習', 'モデル'],
      searchableText: 'ボブカット練習のモデルさん募集！ ボブカットの技術向上のため、練習台をお願いします。丁寧にカットさせていただきます。',
      location: {
        station: '渋谷駅',
        address: '東京都渋谷区',
        prefecture: '東京都',
        distance: 0.5,
        coordinates: { lat: 35.6580, lng: 139.7016 }
      },
      price: 1500,
      originalPrice: 3000,
      services: ['カット'],
      rating: 4.8,
      reviewCount: 156,
      assistant: {
        name: '田中 美香',
        experience: '2年目',
        level: 'intermediate' as const
      },
      salon: {
        name: 'SALON TOKYO',
        rating: 4.7
      },
      status: 'recruiting' as const,
      urgency: 'normal' as const,
      postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2時間前
      availableDates: ['2024-01-20', '2024-01-21', '2024-01-22'],
      requirements: ['肩より長い髪', 'ダメージが少ない髪'],
      modelCount: 3,
      appliedCount: 1,
      duration: 90
    },
    {
      id: 2,
      title: 'インナーカラー技術練習モデル募集',
      description: 'インナーカラーのデザイン技術向上のため、モデルを募集しています。ブリーチからカラーまで一連の流れを練習します。',
      keywords: ['インナーカラー', 'カラー', 'ブリーチ', '練習'],
      searchableText: 'インナーカラー技術練習モデル募集 インナーカラーのデザイン技術向上のため、モデルを募集しています。ブリーチからカラーまで一連の流れを練習します。',
      location: {
        station: '新宿駅',
        address: '東京都新宿区',
        prefecture: '東京都',
        distance: 1.2,
        coordinates: { lat: 35.6896, lng: 139.7006 }
      },
      price: 2500,
      originalPrice: 8000,
      services: ['カラー', 'ブリーチ'],
      rating: 4.9,
      reviewCount: 203,
      assistant: {
        name: '佐藤 リナ',
        experience: '3年目',
        level: 'advanced' as const
      },
      salon: {
        name: 'Hair Studio Grace',
        rating: 4.8
      },
      status: 'recruiting' as const,
      urgency: 'urgent' as const,
      postedAt: new Date(Date.now() - 30 * 60 * 1000), // 30分前
      availableDates: ['2024-01-21', '2024-01-23', '2024-01-24'],
      requirements: ['ブリーチ可能な方', '4時間程度お時間いただける方'],
      modelCount: 2,
      appliedCount: 0,
      duration: 180
    },
    {
      id: 3,
      title: 'メンズフェードカット 練習モデル募集',
      description: 'メンズのフェードカット技術向上のため、練習台をお願いします。バリカンワークを中心に練習します。',
      keywords: ['メンズ', 'フェードカット', 'カット', 'バリカン'],
      searchableText: 'メンズフェードカット 練習モデル募集 メンズのフェードカット技術向上のため、練習台をお願いします。バリカンワークを中心に練習します。',
      location: {
        station: '池袋駅',
        address: '東京都豊島区',
        prefecture: '東京都',
        distance: 2.1,
        coordinates: { lat: 35.7295, lng: 139.7109 }
      },
      price: 1000,
      originalPrice: 2500,
      services: ['カット'],
      rating: 4.6,
      reviewCount: 67,
      assistant: {
        name: '高橋 健太',
        experience: '1年目',
        level: 'beginner' as const
      },
      salon: {
        name: 'Men\'s Studio K',
        rating: 4.5
      },
      status: 'recruiting' as const,
      urgency: 'normal' as const,
      postedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4時間前
      availableDates: ['2024-01-21', '2024-01-22', '2024-01-23'],
      requirements: ['男性限定', '短髪OK'],
      modelCount: 4,
      appliedCount: 1,
      duration: 60
    },
    {
      id: 4,
      title: 'ハイライト＋グラデーションカラー練習',
      description: '高度なカラー技術（ハイライト＋グラデーション）の練習をします。デザインセンス向上のため、複数色を使用します。',
      keywords: ['ハイライト', 'グラデーション', 'カラー', '高度技術'],
      searchableText: 'ハイライト＋グラデーションカラー練習 高度なカラー技術（ハイライト＋グラデーション）の練習をします。デザインセンス向上のため、複数色を使用します。',
      location: {
        station: '原宿駅',
        address: '東京都渋谷区',
        prefecture: '東京都',
        distance: 1.5,
        coordinates: { lat: 35.6702, lng: 139.7027 }
      },
      price: 3000,
      originalPrice: 12000,
      services: ['カラー', 'ブリーチ'],
      rating: 4.9,
      reviewCount: 124,
      assistant: {
        name: '山田 彩',
        experience: '2年目',
        level: 'intermediate' as const
      },
      salon: {
        name: 'Color Salon AYA',
        rating: 4.9
      },
      status: 'recruiting' as const,
      urgency: 'normal' as const,
      postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6時間前
      availableDates: ['2024-01-24', '2024-01-25'],
      requirements: ['ブリーチ経験あり', '長時間OK', 'デザインカラー希望'],
      modelCount: 1,
      appliedCount: 0,
      duration: 240
    }
  ];

  // 追加のモックデータを生成（バリエーション作成）
  for (let i = 0; i < 20; i++) {
    const base = sampleData[i % sampleData.length];
    mockData.push({
      ...base,
      id: base.id + i * 100,
      title: `${base.title} #${i + 1}`,
      postedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      price: base.price + Math.floor(Math.random() * 1000),
      appliedCount: Math.floor(Math.random() * base.modelCount!),
      rating: 4.0 + Math.random() * 1.0,
      reviewCount: Math.floor(Math.random() * 300) + 50
    });
  }

  return mockData;
};

// 検索エンジンの初期化
const initializeSearchEngine = () => {
  if (!searchEngineInstance) {
    const mockData = generateMockData();
    searchEngineInstance = new SearchEngine(mockData);
  }
  return searchEngineInstance;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // クエリパラメータを解析
    const searchQuery: SearchQuery = {
      query: searchParams.get('query') || undefined,
      location: searchParams.get('location') || undefined,
      services: searchParams.get('services') ? searchParams.get('services')!.split(',') : undefined,
      priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined,
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
      status: (searchParams.get('status') as 'recruiting' | 'full' | 'closed' | 'all') || 'recruiting',
      urgency: (searchParams.get('urgency') as 'normal' | 'urgent' | 'all') || 'all',
      experienceLevel: (searchParams.get('experienceLevel') as 'beginner' | 'intermediate' | 'advanced' | 'all') || 'all',
      availableDate: searchParams.get('availableDate') || undefined,
      availableTime: searchParams.get('availableTime') || undefined,
      maxDistance: searchParams.get('maxDistance') ? parseFloat(searchParams.get('maxDistance')!) : undefined,
      requirements: searchParams.get('requirements') ? searchParams.get('requirements')!.split(',') : undefined,
      sortBy: (searchParams.get('sortBy') as 'relevance' | 'date' | 'price' | 'rating' | 'distance' | 'popularity') || 'relevance',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    };

    // セッションIDを取得または生成
    const sessionId = request.headers.get('x-session-id') || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // キャッシュをチェック
    const cached = searchCache.get(searchQuery);
    if (cached) {
      // 分析用にキャッシュヒットを記録
      searchAnalytics.trackSearch({
        sessionId,
        query: searchQuery.query || '',
        filters: searchQuery,
        resultCount: cached.total,
        clickedResults: [],
        searchTime: 0, // キャッシュヒット
        noResultsSearch: cached.total === 0,
        source: 'search_box',
        deviceType: 'desktop' // 実際には User-Agent から判定
      });

      return NextResponse.json({
        success: true,
        data: cached,
        cached: true
      });
    }

    // 検索エンジンを初期化
    const searchEngine = initializeSearchEngine();

    // 検索実行
    const result = await searchEngine.search(searchQuery);

    // 結果をキャッシュに保存
    searchCache.set(searchQuery, result);

    // 検索履歴に追加
    searchHistory.add(searchQuery, result.total);

    // 分析用に検索を記録
    searchAnalytics.trackSearch({
      sessionId,
      query: searchQuery.query || '',
      filters: searchQuery,
      resultCount: result.total,
      clickedResults: [],
      searchTime: result.searchTime,
      noResultsSearch: result.total === 0,
      source: 'search_box',
      deviceType: 'desktop' // 実際には User-Agent から判定
    });

    return NextResponse.json({
      success: true,
      data: result,
      cached: false
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === 'track_click') {
      // クリック追跡
      const { searchEventId, itemId, position } = body;
      searchAnalytics.trackClick(searchEventId, itemId, position);
      
      return NextResponse.json({ success: true });
    }

    if (body.action === 'invalidate_cache') {
      // キャッシュ無効化
      const { pattern } = body;
      searchCache.invalidate(pattern);
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Search API POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}