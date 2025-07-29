'use client'

import { useState, useEffect } from 'react';
import { SearchQuery } from '@/lib/search/search-engine';

interface SavedSearch {
  id: string;
  name: string;
  query: SearchQuery;
  createdAt: number;
  lastUsed: number;
  useCount: number;
  isDefault?: boolean;
}

interface SavedSearchesProps {
  onSelectSearch: (query: SearchQuery) => void;
  currentQuery?: SearchQuery;
  onClose?: () => void;
}

export default function SavedSearches({ onSelectSearch, currentQuery, onClose }: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');

  useEffect(() => {
    loadSavedSearches();
  }, []);

  // 保存された検索を読み込み
  const loadSavedSearches = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem('cutmeets_saved_searches');
      if (saved) {
        const searches = JSON.parse(saved);
        setSavedSearches(searches);
      }
    } catch (error) {
      console.warn('Failed to load saved searches:', error);
    }
  };

  // 保存された検索を保存
  const saveToBrowser = (searches: SavedSearch[]) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('cutmeets_saved_searches', JSON.stringify(searches));
    } catch (error) {
      console.warn('Failed to save searches:', error);
    }
  };

  // 現在の検索を保存
  const saveCurrentSearch = () => {
    if (!currentQuery || !saveSearchName.trim()) return;

    const newSearch: SavedSearch = {
      id: `search_${Date.now()}`,
      name: saveSearchName.trim(),
      query: currentQuery,
      createdAt: Date.now(),
      lastUsed: Date.now(),
      useCount: 0
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    saveToBrowser(updated);
    
    setShowSaveDialog(false);
    setSaveSearchName('');
  };

  // 検索を選択
  const selectSearch = (search: SavedSearch) => {
    // 使用回数と最終使用日時を更新
    const updated = savedSearches.map(s => 
      s.id === search.id 
        ? { ...s, lastUsed: Date.now(), useCount: s.useCount + 1 }
        : s
    );
    setSavedSearches(updated);
    saveToBrowser(updated);

    onSelectSearch(search.query);
    onClose?.();
  };

  // 検索を削除
  const deleteSearch = (searchId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedSearches.filter(s => s.id !== searchId);
    setSavedSearches(updated);
    saveToBrowser(updated);
  };

  // 検索を複製
  const duplicateSearch = (search: SavedSearch, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaveSearchName(`${search.name} のコピー`);
    setShowSaveDialog(true);
  };

  // 検索条件のサマリー
  const getSearchSummary = (query: SearchQuery): string => {
    const parts = [];
    
    if (query.query) parts.push(`"${query.query}"`);
    if (query.location) parts.push(query.location);
    if (query.services && query.services.length > 0) {
      parts.push(query.services.join(', '));
    }
    if (query.priceMax) parts.push(`〜${query.priceMax.toLocaleString()}円`);
    
    return parts.length > 0 ? parts.join(' • ') : '条件なし';
  };

  // 時間フォーマット
  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 86400000) {
      if (diff < 3600000) return `${Math.floor(diff / 60000)}分前`;
      return `${Math.floor(diff / 3600000)}時間前`;
    }
    
    return new Date(timestamp).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric'
    });
  };

  // デフォルト検索の設定
  const setAsDefault = (searchId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedSearches.map(s => ({
      ...s,
      isDefault: s.id === searchId
    }));
    setSavedSearches(updated);
    saveToBrowser(updated);
  };

  // 検索名の編集
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const startEditing = (search: SavedSearch, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(search.id);
    setEditingName(search.name);
  };

  const saveEdit = () => {
    if (!editingId || !editingName.trim()) return;
    
    const updated = savedSearches.map(s => 
      s.id === editingId ? { ...s, name: editingName.trim() } : s
    );
    setSavedSearches(updated);
    saveToBrowser(updated);
    
    setEditingId(null);
    setEditingName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-w-lg w-full">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">保存された検索</h3>
          <div className="flex items-center space-x-2">
            {currentQuery && (
              <button
                onClick={() => setShowSaveDialog(true)}
                className="px-3 py-1.5 text-xs bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
              >
                現在の検索を保存
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
        {/* 保存された検索リスト */}
        <div className="divide-y divide-gray-100">
          {savedSearches.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">保存された検索はありません</p>
              <p className="text-xs text-gray-500 mt-1">よく使う検索条件を保存して素早くアクセスできます</p>
            </div>
          ) : (
            savedSearches
              .sort((a, b) => {
                if (a.isDefault) return -1;
                if (b.isDefault) return 1;
                return b.lastUsed - a.lastUsed;
              })
              .map((search) => (
                <div
                  key={search.id}
                  onClick={() => selectSearch(search)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* 検索名 */}
                      <div className="flex items-center space-x-2 mb-1">
                        {search.isDefault && (
                          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        )}
                        {editingId === search.id ? (
                          <div className="flex items-center space-x-2 flex-1">
                            <input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit();
                                if (e.key === 'Escape') cancelEdit();
                              }}
                            />
                            <button
                              onClick={saveEdit}
                              className="p-1 text-green-600 hover:text-green-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1 text-gray-600 hover:text-gray-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-gray-900 flex-1 truncate">
                            {search.name}
                          </span>
                        )}
                      </div>

                      {/* 検索条件 */}
                      <div className="text-xs text-gray-600 mb-2 truncate">
                        {getSearchSummary(search.query)}
                      </div>

                      {/* 統計情報 */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>使用回数: {search.useCount}回</span>
                        <span>最終使用: {formatTime(search.lastUsed)}</span>
                      </div>
                    </div>

                    {/* アクションメニュー */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      {!search.isDefault && (
                        <button
                          onClick={(e) => setAsDefault(search.id, e)}
                          className="p-1 text-gray-400 hover:text-amber-500 transition-colors"
                          title="デフォルトに設定"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={(e) => startEditing(search, e)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                        title="名前を編集"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => duplicateSearch(search, e)}
                        className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                        title="複製"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => deleteSearch(search.id, e)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="削除"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* 保存ダイアログ */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">検索を保存</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  検索名
                </label>
                <input
                  type="text"
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="例: 渋谷 カット モデル"
                  autoFocus
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">保存される検索条件:</p>
                <p className="text-xs text-gray-700">
                  {currentQuery ? getSearchSummary(currentQuery) : '条件なし'}
                </p>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setSaveSearchName('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  キャンセル
                </button>
                <button
                  onClick={saveCurrentSearch}
                  disabled={!saveSearchName.trim()}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}