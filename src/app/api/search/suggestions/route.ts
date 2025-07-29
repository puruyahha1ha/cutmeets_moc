import { NextRequest, NextResponse } from 'next/server';

interface SuggestionRequest {
  query: string;
  context?: {
    location?: string;
    previousSearches?: string[];
    userPreferences?: Record<string, any>;
  };
}

interface Suggestion {
  text: string;
  type: 'keyword' | 'location' | 'service' | 'trending' | 'completion';
  confidence: number;
  metadata?: Record<string, any>;
}

// 検索提案を生成するAPI
export async function POST(request: NextRequest) {
  try {
    const { query, context }: SuggestionRequest = await request.json();

    if (!query || query.length < 1) {
      return NextResponse.json({
        success: true,
        data: {
          suggestions: getPopularSuggestions(),
          trending: getTrendingSuggestions()
        }
      });
    }

    const suggestions = await generateSuggestions(query, context);

    return NextResponse.json({
      success: true,
      data: {
        query,
        suggestions,
        trending: getTrendingSuggestions()
      }
    });

  } catch (error) {
    console.error('Suggestions API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// 人気の検索提案
function getPopularSuggestions(): Suggestion[] {
  return [
    {
      text: 'カット モデル',
      type: 'keyword',
      confidence: 0.95,
      metadata: { category: 'popular', searchCount: 1250 }
    },
    {
      text: 'カラー 練習',
      type: 'keyword',
      confidence: 0.92,
      metadata: { category: 'popular', searchCount: 980 }
    },
    {
      text: '渋谷駅',
      type: 'location',
      confidence: 0.88,
      metadata: { category: 'popular', searchCount: 756 }
    },
    {
      text: 'メンズカット',
      type: 'service',
      confidence: 0.85,
      metadata: { category: 'popular', searchCount: 623 }
    },
    {
      text: 'ブリーチ',
      type: 'service',
      confidence: 0.82,
      metadata: { category: 'popular', searchCount: 534 }
    }
  ];
}

// トレンド検索提案
function getTrendingSuggestions(): Suggestion[] {
  return [
    {
      text: 'インナーカラー',
      type: 'trending',
      confidence: 0.96,
      metadata: { growthRate: 145, trendScore: 0.92 }
    },
    {
      text: 'フェードカット',
      type: 'trending',
      confidence: 0.91,
      metadata: { growthRate: 123, trendScore: 0.88 }
    },
    {
      text: 'バレイヤージュ',
      type: 'trending',
      confidence: 0.87,
      metadata: { growthRate: 98, trendScore: 0.84 }
    },
    {
      text: 'ウルフカット',
      type: 'trending',
      confidence: 0.84,
      metadata: { growthRate: 89, trendScore: 0.81 }
    }
  ];
}

// 検索提案を生成
async function generateSuggestions(query: string, context?: any): Promise<Suggestion[]> {
  const suggestions: Suggestion[] = [];
  const queryLower = query.toLowerCase();

  // キーワード補完
  const keywordSuggestions = generateKeywordCompletions(queryLower);
  suggestions.push(...keywordSuggestions);

  // 場所の提案
  const locationSuggestions = generateLocationSuggestions(queryLower);
  suggestions.push(...locationSuggestions);

  // サービスの提案
  const serviceSuggestions = generateServiceSuggestions(queryLower);
  suggestions.push(...serviceSuggestions);

  // コンテキストベースの提案
  if (context) {
    const contextSuggestions = generateContextualSuggestions(queryLower, context);
    suggestions.push(...contextSuggestions);
  }

  // 信頼度でソートして上位10件を返す
  return suggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 10);
}

// キーワード補完の生成
function generateKeywordCompletions(query: string): Suggestion[] {
  const completions: Array<{ base: string; completions: string[] }> = [
    {
      base: 'カ',
      completions: ['カット', 'カラー', 'カット モデル', 'カラー 練習']
    },
    {
      base: 'カット',
      completions: ['カット モデル', 'カット 練習', 'カット 安い', 'カット 渋谷']
    },
    {
      base: 'カラー',
      completions: ['カラー モデル', 'カラー 練習', 'カラー ブリーチ', 'カラー インナー']
    },
    {
      base: 'メ',
      completions: ['メンズ', 'メンズカット', 'メンズ フェード']
    },
    {
      base: 'ブ',
      completions: ['ブリーチ', 'ブリーチ カラー', 'ブリーチ なし']
    },
    {
      base: 'イ',
      completions: ['インナーカラー', 'インナーカラー 練習']
    },
    {
      base: 'フ',
      completions: ['フェードカット', 'フェード メンズ']
    },
    {
      base: 'パ',
      completions: ['パーマ', 'パーマ 練習', 'パーマ デジタル']
    }
  ];

  const suggestions: Suggestion[] = [];

  completions.forEach(({ base, completions: comps }) => {
    if (query.startsWith(base.toLowerCase())) {
      comps.forEach(completion => {
        if (completion.toLowerCase().includes(query) && completion.toLowerCase() !== query) {
          const confidence = calculateCompletionConfidence(query, completion);
          suggestions.push({
            text: completion,
            type: 'completion',
            confidence,
            metadata: { matchType: 'prefix', base }
          });
        }
      });
    }
  });

  return suggestions;
}

// 場所の提案生成
function generateLocationSuggestions(query: string): Suggestion[] {
  const locations = [
    { name: '渋谷', variations: ['渋谷', '渋谷駅', '渋谷区'] },
    { name: '新宿', variations: ['新宿', '新宿駅', '新宿区'] },
    { name: '原宿', variations: ['原宿', '原宿駅'] },
    { name: '表参道', variations: ['表参道', '表参道駅'] },
    { name: '銀座', variations: ['銀座', '銀座駅'] },
    { name: '池袋', variations: ['池袋', '池袋駅', '池袋区'] },
    { name: '心斎橋', variations: ['心斎橋', '心斎橋駅'] },
    { name: '梅田', variations: ['梅田', '梅田駅'] },
    { name: '横浜', variations: ['横浜', '横浜駅'] },
    { name: '名古屋', variations: ['名古屋', '名古屋駅'] }
  ];

  const suggestions: Suggestion[] = [];

  locations.forEach(({ name, variations }) => {
    variations.forEach(variation => {
      if (variation.toLowerCase().includes(query) && query.length >= 1) {
        const confidence = calculateLocationConfidence(query, variation);
        suggestions.push({
          text: variation,
          type: 'location',
          confidence,
          metadata: { area: name, matchType: 'contains' }
        });
      }
    });
  });

  return suggestions;
}

// サービスの提案生成
function generateServiceSuggestions(query: string): Suggestion[] {
  const services = [
    { 
      category: 'カット',
      terms: ['カット', 'ボブカット', 'ショートカット', 'レイヤーカット', 'ウルフカット', 'メンズカット', 'フェードカット']
    },
    {
      category: 'カラー',
      terms: ['カラー', 'インナーカラー', 'ハイライト', 'グラデーション', 'バレイヤージュ', 'ブリーチ']
    },
    {
      category: 'パーマ',
      terms: ['パーマ', 'デジタルパーマ', 'コールドパーマ', 'ピンパーマ']
    },
    {
      category: 'ストレート',
      terms: ['ストレート', '縮毛矯正', 'ストレートパーマ']
    },
    {
      category: 'トリートメント',
      terms: ['トリートメント', 'ヘアケア', 'ダメージケア']
    }
  ];

  const suggestions: Suggestion[] = [];

  services.forEach(({ category, terms }) => {
    terms.forEach(term => {
      if (term.toLowerCase().includes(query) && query.length >= 1) {
        const confidence = calculateServiceConfidence(query, term, category);
        suggestions.push({
          text: term,
          type: 'service',
          confidence,
          metadata: { category, matchType: 'contains' }
        });
      }
    });
  });

  return suggestions;
}

// コンテキスト基づく提案生成
function generateContextualSuggestions(query: string, context: any): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // 位置情報がある場合の提案
  if (context.location) {
    suggestions.push({
      text: `${query} ${context.location}`,
      type: 'keyword',
      confidence: 0.8,
      metadata: { contextType: 'location', source: context.location }
    });
  }

  // 過去の検索履歴からの提案
  if (context.previousSearches && context.previousSearches.length > 0) {
    const recentSearch = context.previousSearches[0];
    if (recentSearch && recentSearch !== query) {
      suggestions.push({
        text: `${query} ${recentSearch}`,
        type: 'keyword',
        confidence: 0.75,
        metadata: { contextType: 'history', source: recentSearch }
      });
    }
  }

  return suggestions;
}

// 補完の信頼度計算
function calculateCompletionConfidence(query: string, completion: string): number {
  const queryLen = query.length;
  const completionLen = completion.length;
  
  if (queryLen === 0) return 0.5;
  
  // 前方一致の場合は高い信頼度
  if (completion.toLowerCase().startsWith(query)) {
    return Math.min(0.95, 0.7 + (queryLen / completionLen) * 0.25);
  }
  
  // 部分一致の場合は中程度の信頼度
  if (completion.toLowerCase().includes(query)) {
    return Math.min(0.8, 0.5 + (queryLen / completionLen) * 0.3);
  }
  
  return 0.3;
}

// 場所の信頼度計算
function calculateLocationConfidence(query: string, location: string): number {
  const queryLen = query.length;
  const locationLen = location.length;
  
  if (location.toLowerCase().startsWith(query)) {
    return Math.min(0.9, 0.6 + (queryLen / locationLen) * 0.3);
  }
  
  if (location.toLowerCase().includes(query)) {
    return Math.min(0.75, 0.4 + (queryLen / locationLen) * 0.35);
  }
  
  return 0.2;
}

// サービスの信頼度計算
function calculateServiceConfidence(query: string, service: string, category: string): number {
  const baseConfidence = calculateCompletionConfidence(query, service);
  
  // カテゴリマッチの場合はボーナス
  if (category.toLowerCase().includes(query)) {
    return Math.min(0.95, baseConfidence + 0.1);
  }
  
  return baseConfidence;
}

// GET リクエスト用のハンドラ（クエリパラメータから）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    
    const context = {
      location: searchParams.get('location') || undefined,
      previousSearches: searchParams.get('previousSearches')?.split(',') || undefined
    };

    if (!query) {
      return NextResponse.json({
        success: true,
        data: {
          suggestions: getPopularSuggestions(),
          trending: getTrendingSuggestions()
        }
      });
    }

    const suggestions = await generateSuggestions(query, context);

    return NextResponse.json({
      success: true,
      data: {
        query,
        suggestions,
        trending: getTrendingSuggestions()
      }
    });

  } catch (error) {
    console.error('Suggestions GET API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}