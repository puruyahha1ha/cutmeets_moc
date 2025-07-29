/**
 * 検索キャッシュ管理システム
 * 高速な検索レスポンスとサーバー負荷軽減のためのキャッシュ機能
 */

import { SearchQuery, SearchResult } from './search-engine';

export interface CacheEntry<T = any> {
  key: string;
  data: T;
  timestamp: number;
  expiry: number;
  hitCount: number;
  lastAccessed: number;
}

export interface CacheStats {
  size: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  oldestEntry: number;
  newestEntry: number;
}

/**
 * LRU (Least Recently Used) キャッシュ実装
 */
export class SearchCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;
  private defaultTTL: number; // Time To Live (ms)
  private hitCount = 0;
  private missCount = 0;

  constructor(maxSize = 1000, defaultTTL = 5 * 60 * 1000) { // デフォルト5分
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;

    // 定期的にクリーンアップ
    setInterval(() => this.cleanup(), 60000); // 1分ごと
  }

  /**
   * 検索クエリからキャッシュキーを生成
   */
  private generateCacheKey(query: SearchQuery): string {
    // クエリを正規化してキーにする
    const normalized = {
      query: query.query?.toLowerCase().trim() || '',
      location: query.location?.toLowerCase().trim() || '',
      services: query.services?.sort().join(',') || '',
      priceMin: query.priceMin || 0,
      priceMax: query.priceMax || Infinity,
      rating: query.rating || 0,
      status: query.status || 'all',
      urgency: query.urgency || 'all',
      experienceLevel: query.experienceLevel || 'all',
      availableDate: query.availableDate || '',
      maxDistance: query.maxDistance || Infinity,
      requirements: query.requirements?.sort().join(',') || '',
      sortBy: query.sortBy || 'relevance',
      sortOrder: query.sortOrder || 'desc',
      limit: query.limit || 20,
      offset: query.offset || 0
    };

    return btoa(JSON.stringify(normalized));
  }

  /**
   * キャッシュから検索結果を取得
   */
  get(query: SearchQuery): SearchResult | null {
    const key = this.generateCacheKey(query);
    const entry = this.cache.get(key);

    if (!entry) {
      this.missCount++;
      return null;
    }

    // 期限切れチェック
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    // ヒット情報を更新
    entry.hitCount++;
    entry.lastAccessed = Date.now();
    this.hitCount++;

    return entry.data;
  }

  /**
   * 検索結果をキャッシュに保存
   */
  set(query: SearchQuery, result: SearchResult, ttl?: number): void {
    const key = this.generateCacheKey(query);
    const now = Date.now();
    const expiry = now + (ttl || this.defaultTTL);

    // キャッシュサイズ制限
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const entry: CacheEntry<SearchResult> = {
      key,
      data: result,
      timestamp: now,
      expiry,
      hitCount: 0,
      lastAccessed: now
    };

    this.cache.set(key, entry);
  }

  /**
   * LRU方式で古いエントリを削除
   */
  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * 期限切れエントリをクリーンアップ
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache) {
      if (now > entry.expiry) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));

    console.log(`Cache cleanup: removed ${keysToDelete.length} expired entries`);
  }

  /**
   * 特定のパターンにマッチするキャッシュエントリを無効化
   */
  invalidate(pattern?: RegExp | string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache) {
      if (regex.test(key) || regex.test(entry.data.query.query || '')) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * キャッシュ統計を取得
   */
  getStats(): CacheStats {
    const total = this.hitCount + this.missCount;
    const hitRate = total > 0 ? this.hitCount / total : 0;

    let oldestEntry = Date.now();
    let newestEntry = 0;

    for (const entry of this.cache.values()) {
      if (entry.timestamp < oldestEntry) {
        oldestEntry = entry.timestamp;
      }
      if (entry.timestamp > newestEntry) {
        newestEntry = entry.timestamp;
      }
    }

    return {
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      totalHits: this.hitCount,
      totalMisses: this.missCount,
      oldestEntry,
      newestEntry
    };
  }

  /**
   * よくアクセスされる検索を取得
   */
  getPopularSearches(limit = 10): Array<{ query: SearchQuery; hitCount: number; lastAccessed: number }> {
    return Array.from(this.cache.values())
      .sort((a, b) => b.hitCount - a.hitCount)
      .slice(0, limit)
      .map(entry => ({
        query: entry.data.query,
        hitCount: entry.hitCount,
        lastAccessed: entry.lastAccessed
      }));
  }

  /**
   * キャッシュをクリア
   */
  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * メモリ使用量を推定（概算）
   */
  getMemoryUsage(): { estimated: number; entries: number } {
    let totalSize = 0;

    for (const entry of this.cache.values()) {
      // JSON文字列のサイズを概算
      totalSize += JSON.stringify(entry).length * 2; // Unicode文字は2バイト
    }

    return {
      estimated: totalSize,
      entries: this.cache.size
    };
  }

  /**
   * パフォーマンス最適化のためのプリウォーミング
   */
  async preload(queries: SearchQuery[], searchFunction: (query: SearchQuery) => Promise<SearchResult>): Promise<void> {
    console.log(`Cache preloading started for ${queries.length} queries`);

    const promises = queries.map(async (query) => {
      try {
        const result = await searchFunction(query);
        this.set(query, result, this.defaultTTL * 2); // プリロードしたデータは長く保持
      } catch (error) {
        console.warn('Failed to preload search query:', query, error);
      }
    });

    await Promise.allSettled(promises);
    console.log('Cache preloading completed');
  }
}

/**
 * 検索履歴管理
 */
export class SearchHistory {
  private history: Array<{ query: SearchQuery; timestamp: number; resultCount: number }> = [];
  private maxHistory: number;

  constructor(maxHistory = 50) {
    this.maxHistory = maxHistory;
    this.loadFromStorage();
  }

  /**
   * 検索履歴を追加
   */
  add(query: SearchQuery, resultCount = 0): void {
    const entry = {
      query,
      timestamp: Date.now(),
      resultCount
    };

    // 重複チェック（同じクエリは最新のタイムスタンプで更新）
    const existingIndex = this.history.findIndex(h => 
      JSON.stringify(h.query) === JSON.stringify(query)
    );

    if (existingIndex >= 0) {
      this.history[existingIndex] = entry;
    } else {
      this.history.unshift(entry);
    }

    // 履歴サイズ制限
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(0, this.maxHistory);
    }

    this.saveToStorage();
  }

  /**
   * 検索履歴を取得
   */
  get(limit?: number): Array<{ query: SearchQuery; timestamp: number; resultCount: number }> {
    return limit ? this.history.slice(0, limit) : [...this.history];
  }

  /**
   * 履歴をクリア
   */
  clear(): void {
    this.history = [];
    this.saveToStorage();
  }

  /**
   * よく検索されるキーワードを取得
   */
  getFrequentKeywords(limit = 10): Array<{ keyword: string; count: number }> {
    const keywordCount = new Map<string, number>();

    this.history.forEach(entry => {
      if (entry.query.query) {
        const words = entry.query.query.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.length > 1) {
            keywordCount.set(word, (keywordCount.get(word) || 0) + 1);
          }
        });
      }
    });

    return Array.from(keywordCount.entries())
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * ローカルストレージから読み込み
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('cutmeets_search_history');
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load search history from storage:', error);
    }
  }

  /**
   * ローカルストレージに保存
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('cutmeets_search_history', JSON.stringify(this.history));
    } catch (error) {
      console.warn('Failed to save search history to storage:', error);
    }
  }
}

// シングルトンインスタンス
export const searchCache = new SearchCache();
export const searchHistory = new SearchHistory();