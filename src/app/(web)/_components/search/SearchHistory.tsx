'use client'

import { useState, useEffect } from 'react';
import { searchHistory } from '@/lib/search/search-cache';
import { SearchQuery } from '@/lib/search/search-engine';

interface SearchHistoryProps {
  onSelectSearch: (query: SearchQuery) => void;
  onClose?: () => void;
}

interface HistoryItem {
  query: SearchQuery;
  timestamp: number;
  resultCount: number;
}

export default function SearchHistory({ onSelectSearch, onClose }: SearchHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [frequentKeywords, setFrequentKeywords] = useState<Array<{ keyword: string; count: number }>>([]);

  useEffect(() => {
    // 検索履歴を取得
    const historyData = searchHistory.get(20);
    setHistory(historyData);
    
    // よく使われるキーワードを取得
    const keywords = searchHistory.getFrequentKeywords(10);
    setFrequentKeywords(keywords);
  }, []);

  // 検索を選択
  const selectSearch = (query: SearchQuery) => {
    onSelectSearch(query);
    onClose?.();
  };

  // 履歴項目を削除
  const removeHistoryItem = (timestamp: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // 実際の実装では個別削除機能が必要
    console.log('Remove history item:', timestamp);
  };

  // 履歴をクリア
  const clearHistory = () => {
    searchHistory.clear();
    setHistory([]);
    setFrequentKeywords([]);
  };

  // 時間のフォーマット
  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'たった今';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}時間前`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}日前`;
    
    return new Date(timestamp).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric'
    });
  };

  // フィルター条件のサマリー
  const getFilterSummary = (query: SearchQuery): string => {
    const filters = [];
    
    if (query.location) filters.push(query.location);
    if (query.services && query.services.length > 0) {
      filters.push(query.services.join(', '));
    }
    if (query.priceMax) filters.push(`〜${query.priceMax.toLocaleString()}円`);
    if (query.experienceLevel && query.experienceLevel !== 'all') {
      filters.push(query.experienceLevel === 'beginner' ? '初級' : 
                   query.experienceLevel === 'intermediate' ? '中級' : '上級');
    }
    
    return filters.length > 0 ? filters.join(' • ') : '条件なし';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-w-md w-full">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">検索履歴</h3>
          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-gray-600 hover:text-gray-800 font-medium"
              >
                すべてクリア
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {/* よく使われるキーワード */}
        {frequentKeywords.length > 0 && (
          <div className="p-4 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              🔥 よく検索するキーワード
            </h4>
            <div className="flex flex-wrap gap-2">
              {frequentKeywords.map(({ keyword, count }) => (
                <button
                  key={keyword}
                  onClick={() => selectSearch({ query: keyword })}
                  className="px-3 py-1.5 text-sm bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-colors flex items-center space-x-1"
                >
                  <span>{keyword}</span>
                  <span className="text-xs opacity-75">({count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 検索履歴リスト */}
        <div className="divide-y divide-gray-100">
          {history.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">検索履歴はありません</p>
              <p className="text-xs text-gray-500 mt-1">検索すると履歴が表示されます</p>
            </div>
          ) : (
            history.map((item, index) => (
              <div
                key={`${item.timestamp}-${index}`}
                onClick={() => selectSearch(item.query)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* 検索クエリ */}
                    <div className="flex items-center space-x-2 mb-1">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {item.query.query || '検索条件のみ'}
                      </span>
                    </div>

                    {/* フィルター条件 */}
                    <div className="text-xs text-gray-600 mb-2 truncate">
                      {getFilterSummary(item.query)}
                    </div>

                    {/* 結果数と時間 */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{item.resultCount.toLocaleString()}件の結果</span>
                      <span>{formatTime(item.timestamp)}</span>
                    </div>
                  </div>

                  {/* 削除ボタン */}
                  <button
                    onClick={(e) => removeHistoryItem(item.timestamp, e)}
                    className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                    title="履歴から削除"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* フッター */}
      {history.length > 0 && (
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            最近の検索から選択するか、新しい検索を開始してください
          </p>
        </div>
      )}
    </div>
  );
}