'use client'

import { useState, useEffect } from 'react';
import { SearchQuery } from '@/lib/search/search-engine';

interface SearchSuggestionsProps {
  query: string;
  onSelectSuggestion: (suggestion: string) => void;
  onApplySmartFilter: (filters: Partial<SearchQuery>) => void;
}

interface SmartSuggestion {
  type: 'keyword' | 'filter' | 'combination' | 'location' | 'trending';
  text: string;
  description?: string;
  filters?: Partial<SearchQuery>;
  icon: string;
  confidence: number;
}

export default function SearchSuggestions({ 
  query, 
  onSelectSuggestion, 
  onApplySmartFilter 
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // AIベースの検索提案を生成
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions(getPopularSuggestions());
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      generateSmartSuggestions(query);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 人気の検索提案を取得
  const getPopularSuggestions = (): SmartSuggestion[] => {
    return [
      {
        type: 'trending',
        text: 'インナーカラー',
        description: '今週のトレンドキーワード',
        icon: '🔥',
        confidence: 0.95
      },
      {
        type: 'combination',
        text: '渋谷 カット モデル',
        description: '人気の組み合わせ',
        filters: { location: '渋谷駅', services: ['カット'] },
        icon: '💡',
        confidence: 0.9
      },
      {
        type: 'filter',
        text: '3000円以上の案件',
        description: '高単価の募集のみ',
        filters: { priceMin: 3000 },
        icon: '💰',
        confidence: 0.85
      },
      {
        type: 'location',
        text: '新宿エリア',
        description: '新宿周辺の美容室',
        filters: { location: '新宿駅', maxDistance: 1 },
        icon: '📍',
        confidence: 0.8
      }
    ];
  };

  // スマート検索提案を生成
  const generateSmartSuggestions = (searchQuery: string): void => {
    const smartSuggestions: SmartSuggestion[] = [];
    const queryLower = searchQuery.toLowerCase();

    // キーワード補完
    const keywordSuggestions = generateKeywordSuggestions(queryLower);
    smartSuggestions.push(...keywordSuggestions);

    // 場所の提案
    const locationSuggestions = generateLocationSuggestions(queryLower);
    smartSuggestions.push(...locationSuggestions);

    // サービスの提案
    const serviceSuggestions = generateServiceSuggestions(queryLower);
    smartSuggestions.push(...serviceSuggestions);

    // 価格帯の提案
    const priceSuggestions = generatePriceSuggestions(queryLower);
    smartSuggestions.push(...priceSuggestions);

    // 組み合わせ提案
    const combinationSuggestions = generateCombinationSuggestions(queryLower);
    smartSuggestions.push(...combinationSuggestions);

    // 信頼度でソートして上位8件を表示
    setSuggestions(
      smartSuggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 8)
    );
  };

  // キーワード補完提案
  const generateKeywordSuggestions = (query: string): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];
    
    const keywords = [
      { base: 'カット', variations: ['ボブカット', 'ショートカット', 'レイヤーカット', 'ウルフカット'] },
      { base: 'カラー', variations: ['インナーカラー', 'ハイライトカラー', 'グラデーションカラー', 'ブリーチカラー'] },
      { base: 'パーマ', variations: ['デジタルパーマ', 'コールドパーマ', 'ピンパーマ'] },
      { base: 'メンズ', variations: ['メンズカット', 'フェードカット', 'ツーブロック'] }
    ];

    keywords.forEach(({ base, variations }) => {
      if (query.includes(base.toLowerCase())) {
        variations.forEach(variation => {
          if (!query.includes(variation.toLowerCase())) {
            suggestions.push({
              type: 'keyword',
              text: variation,
              description: `${base}の詳細カテゴリ`,
              icon: '✨',
              confidence: 0.8
            });
          }
        });
      }
    });

    return suggestions;
  };

  // 場所提案
  const generateLocationSuggestions = (query: string): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];
    
    const locations = [
      { name: '渋谷', station: '渋谷駅', area: '渋谷・表参道エリア' },
      { name: '新宿', station: '新宿駅', area: '新宿・歌舞伎町エリア' },
      { name: '原宿', station: '原宿駅', area: '原宿・表参道エリア' },
      { name: '銀座', station: '銀座駅', area: '銀座・有楽町エリア' },
      { name: '池袋', station: '池袋駅', area: '池袋・巣鴨エリア' }
    ];

    locations.forEach(({ name, station, area }) => {
      if (query.includes(name) && !query.includes('駅')) {
        suggestions.push({
          type: 'location',
          text: `${name}駅周辺`,
          description: area,
          filters: { location: station, maxDistance: 1 },
          icon: '🚉',
          confidence: 0.85
        });
      }
    });

    return suggestions;
  };

  // サービス提案
  const generateServiceSuggestions = (query: string): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];
    
    const servicePatterns = [
      { keywords: ['安い', '格安', '低価格'], suggestion: '予算重視', filters: { priceMax: 2000 } },
      { keywords: ['急募', '急ぎ', '今日'], suggestion: '急募案件のみ', filters: { urgency: 'urgent' } },
      { keywords: ['初心者', '初級'], suggestion: '初級アシスタント', filters: { experienceLevel: 'beginner' } },
      { keywords: ['上級', '経験豊富'], suggestion: '上級アシスタント', filters: { experienceLevel: 'advanced' } }
    ];

    servicePatterns.forEach(({ keywords, suggestion, filters }) => {
      if (keywords.some(keyword => query.includes(keyword))) {
        suggestions.push({
          type: 'filter',
          text: suggestion,
          description: '条件に合わせたフィルター',
          filters: filters as Partial<SearchQuery>,
          icon: '🎯',
          confidence: 0.9
        });
      }
    });

    return suggestions;
  };

  // 価格提案
  const generatePriceSuggestions = (query: string): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];
    
    const pricePatterns = [
      { keywords: ['1000', '千円'], range: { max: 1000 }, text: '1000円以下' },
      { keywords: ['2000', '二千'], range: { max: 2000 }, text: '2000円以下' },
      { keywords: ['3000', '三千'], range: { max: 3000 }, text: '3000円以下' },
      { keywords: ['5000', '五千'], range: { max: 5000 }, text: '5000円以下' }
    ];

    pricePatterns.forEach(({ keywords, range, text }) => {
      if (keywords.some(keyword => query.includes(keyword))) {
        suggestions.push({
          type: 'filter',
          text: `${text}の案件`,
          description: '価格でフィルター',
          filters: { priceMax: range.max },
          icon: '💴',
          confidence: 0.85
        });
      }
    });

    return suggestions;
  };

  // 組み合わせ提案
  const generateCombinationSuggestions = (query: string): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];
    
    // よくある組み合わせパターン
    const combinations = [
      {
        pattern: ['カット', '渋谷'],
        suggestion: '渋谷でカットモデル',
        filters: { location: '渋谷駅', services: ['カット'] }
      },
      {
        pattern: ['カラー', '新宿'],
        suggestion: '新宿でカラーモデル',
        filters: { location: '新宿駅', services: ['カラー'] }
      },
      {
        pattern: ['メンズ', 'カット'],
        suggestion: 'メンズカット専門',
        filters: { services: ['カット'], requirements: ['男性OK'] }
      }
    ];

    combinations.forEach(({ pattern, suggestion, filters }) => {
      if (pattern.every(keyword => query.includes(keyword.toLowerCase()))) {
        suggestions.push({
          type: 'combination',
          text: suggestion,
          description: '人気の組み合わせ',
          filters,
          icon: '🎯',
          confidence: 0.9
        });
      }
    });

    return suggestions;
  };

  // 提案を選択
  const selectSuggestion = (suggestion: SmartSuggestion) => {
    if (suggestion.filters) {
      onApplySmartFilter(suggestion.filters);
    } else {
      onSelectSuggestion(suggestion.text);
    }
  };

  if (suggestions.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg mt-2 overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
          <span className="mr-2">🤖</span>
          AIおすすめ検索
        </h3>
      </div>

      {/* 提案リスト */}
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">AI提案を生成中...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => selectSuggestion(suggestion)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg mt-0.5">{suggestion.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {suggestion.text}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        suggestion.type === 'trending' ? 'bg-red-100 text-red-700' :
                        suggestion.type === 'combination' ? 'bg-blue-100 text-blue-700' :
                        suggestion.type === 'filter' ? 'bg-green-100 text-green-700' :
                        suggestion.type === 'location' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {suggestion.type === 'trending' ? 'トレンド' :
                         suggestion.type === 'combination' ? '組み合わせ' :
                         suggestion.type === 'filter' ? 'フィルター' :
                         suggestion.type === 'location' ? '場所' :
                         'キーワード'}
                      </span>
                    </div>
                    {suggestion.description && (
                      <p className="text-xs text-gray-600">
                        {suggestion.description}
                      </p>
                    )}
                    
                    {/* 信頼度インジケーター */}
                    <div className="flex items-center mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-pink-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${suggestion.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {Math.round(suggestion.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* 適用ボタン */}
                  <button className="p-1.5 text-gray-400 group-hover:text-pink-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* フッター */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          AIが検索パターンを分析して最適な提案を生成しています
        </p>
      </div>
    </div>
  );
}