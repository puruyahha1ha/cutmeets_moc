'use client'

import { useState, useEffect, useRef, useMemo } from 'react';
// Mock search history utility
const searchHistory = {
  get: (limit: number = 10) => {
    try {
      if (typeof window === 'undefined') return [];
      const history = localStorage.getItem('cutmeets_search_history');
      if (!history) return [];
      const parsed = JSON.parse(history);
      return parsed.slice(0, limit).map((item: any) => ({
        query: { query: item.query || '' },
        timestamp: item.timestamp || Date.now(),
        resultCount: item.resultCount || 0
      }));
    } catch {
      return [];
    }
  }
};

interface SmartSearchBoxProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  suggestions?: string[];
  isLoading?: boolean;
  placeholder?: string;
}

interface SearchSuggestion {
  text: string;
  type: 'history' | 'suggestion' | 'popular' | 'trending';
  count?: number;
  icon?: string;
}

export default function SmartSearchBox({
  query,
  onQueryChange,
  onSearch,
  suggestions = [],
  isLoading = false,
  placeholder = "例: カット モデル 渋谷"
}: SmartSearchBoxProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 基本的な固定データ（静的、変更されない）
  const staticSuggestions = useMemo(() => {
    const popular = [
      'カット モデル',
      'カラー 練習',
      'ブリーチ',
      'メンズカット',
      'ボブカット'
    ];
    const trending = [
      'インナーカラー',
      'フェードカット',
      'ウルフカット',
      'バレイヤージュ'
    ];

    return [
      ...popular.map(text => ({ text, type: 'popular' as const, icon: '🔥' })),
      ...trending.map(text => ({ text, type: 'trending' as const, icon: '📈' }))
    ];
  }, []);

  // 全提案リストを計算（メモ化）
  const allSuggestions = useMemo(() => {
    try {
      // 履歴を取得（エラーがあっても空配列で処理続行）
      let history: SearchSuggestion[] = [];
      try {
        const historyQueries = searchHistory.get(5).map((h: any) => h.query.query || '').filter(Boolean);
        history = historyQueries.map((text: string) => ({ text, type: 'history' as const, icon: '🕐' }));
      } catch (historyError) {
        console.warn('Failed to load search history:', historyError);
      }
      
      // 外部提案を処理
      const externalSuggestions = (suggestions || []).map(text => ({ 
        text, 
        type: 'suggestion' as const, 
        icon: '💡' 
      }));

      const combined: SearchSuggestion[] = [
        ...history,
        ...externalSuggestions,
        ...staticSuggestions
      ];

      // 重複を除去
      return combined.filter((item, index, arr) => 
        item.text && arr.findIndex(i => i.text === item.text) === index
      );
    } catch (error) {
      console.warn('Failed to create suggestions:', error);
      // エラー時は静的データのみ
      return staticSuggestions;
    }
  }, [suggestions, staticSuggestions]);

  // 入力フィルタリング
  const filteredSuggestions = allSuggestions.filter(suggestion =>
    !query || suggestion.text.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  // キーボードナビゲーション
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
          onQueryChange(filteredSuggestions[highlightedIndex].text);
          setShowSuggestions(false);
          onSearch();
        } else {
          onSearch();
        }
        break;
      
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // 提案選択
  const selectSuggestion = (suggestion: SearchSuggestion) => {
    onQueryChange(suggestion.text);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    onSearch();
  };

  // 外部クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // デバウンス処理
  useEffect(() => {
    if (query.length > 0) {
      const timer = setTimeout(() => {
        setShowSuggestions(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  return (
    <div className="relative">
      {/* メイン検索ボックス */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(query.length > 0 || allSuggestions.length > 0)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-base sm:text-lg bg-white shadow-sm"
        />
        
        {/* 検索アイコン */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>

        {/* クリアボタン */}
        {query && (
          <button
            onClick={() => {
              onQueryChange('');
              setShowSuggestions(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 検索提案ドロップダウン */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.text}`}
              onClick={() => selectSuggestion(suggestion)}
              className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                index === highlightedIndex
                  ? 'bg-pink-50 text-pink-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{suggestion.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.text}
                  </div>
                  <div className="text-xs text-gray-500">
                    {suggestion.type === 'history' && '検索履歴'}
                    {suggestion.type === 'suggestion' && '検索候補'}
                    {suggestion.type === 'popular' && '人気キーワード'}
                    {suggestion.type === 'trending' && 'トレンド'}
                  </div>
                </div>
                
                {/* 検索実行ボタン */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectSuggestion(suggestion);
                  }}
                  className="p-1.5 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* フッター */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>↑↓で選択、Enterで検索</span>
              <span>Escで閉じる</span>
            </div>
          </div>
        </div>
      )}

      {/* ホットキーワード（空の状態で表示） */}
      {!query && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">🔥 人気の検索</h3>
            <div className="flex flex-wrap gap-2">
              {allSuggestions
                .filter(s => s.type === 'popular' || s.type === 'trending')
                .slice(0, 6)
                .map(suggestion => (
                  <button
                    key={suggestion.text}
                    onClick={() => selectSuggestion(suggestion)}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-pink-100 hover:text-pink-700 rounded-full transition-colors"
                  >
                    {suggestion.icon} {suggestion.text}
                  </button>
                ))}
            </div>
            
            {(() => {
              try {
                const recentHistory = searchHistory.get(3);
                return recentHistory.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">🕐 最近の検索</h3>
                    <div className="space-y-2">
                      {recentHistory.map((item: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => selectSuggestion({ text: item.query.query || '', type: 'history', icon: '🕐' })}
                          className="flex items-center space-x-2 w-full text-left px-2 py-1 hover:bg-gray-50 rounded text-sm text-gray-600"
                        >
                          <span>🕐</span>
                          <span className="truncate">{item.query.query || ''}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              } catch (error) {
                console.warn('Failed to load recent history:', error);
                return null;
              }
            })()}
          </div>
        </div>
      )}

      {/* 音声検索ボタン（将来的な機能） */}
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
        <button
          className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
          title="音声検索（準備中）"
          disabled
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>
    </div>
  );
}