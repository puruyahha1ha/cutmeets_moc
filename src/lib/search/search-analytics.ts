/**
 * 検索分析システム
 * 検索パターンの分析、トレンド把握、検索改善のためのデータ収集
 */

export interface SearchEvent {
  id: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  query: string;
  filters: Record<string, any>;
  resultCount: number;
  clickedResults: Array<{
    itemId: string;
    position: number;
    timestamp: number;
  }>;
  searchTime: number;
  noResultsSearch: boolean;
  refinedFromPrevious?: string; // 前の検索からの絞り込み
  source: 'search_box' | 'filter' | 'suggestion' | 'voice' | 'barcode';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  location?: {
    prefecture: string;
    city?: string;
  };
}

export interface SearchTrend {
  keyword: string;
  count: number;
  growthRate: number;
  timeframe: 'hour' | 'day' | 'week' | 'month';
  category?: string;
  relatedTerms: string[];
}

export interface SearchInsight {
  popularKeywords: Array<{ keyword: string; count: number; ctr: number }>;
  lowPerformingQueries: Array<{ query: string; count: number; avgResults: number }>;
  seasonalTrends: Array<{ keyword: string; months: number[]; peakMonth: number }>;
  userBehavior: {
    avgQueriesPerSession: number;
    avgTimeToClick: number;
    refinementRate: number;
    abandonmentRate: number;
  };
  geographicTrends: Array<{
    location: string;
    topKeywords: string[];
    uniquePreferences: string[];
  }>;
}

/**
 * 検索分析エンジン
 */
export class SearchAnalytics {
  private events: SearchEvent[] = [];
  private maxEvents: number;

  constructor(maxEvents = 10000) {
    this.maxEvents = maxEvents;
  }

  /**
   * 検索イベントを記録
   */
  trackSearch(event: Omit<SearchEvent, 'id' | 'timestamp'>): void {
    const searchEvent: SearchEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: Date.now()
    };

    this.events.push(searchEvent);

    // イベント数制限
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // リアルタイム分析のための処理
    this.processEventRealtime(searchEvent);
  }

  /**
   * 検索結果クリックを記録
   */
  trackClick(searchEventId: string, itemId: string, position: number): void {
    const event = this.events.find(e => e.id === searchEventId);
    if (event) {
      event.clickedResults.push({
        itemId,
        position,
        timestamp: Date.now()
      });
    }
  }

  /**
   * 人気検索キーワードを取得
   */
  getPopularKeywords(timeframe: 'hour' | 'day' | 'week' | 'month' = 'day', limit = 20): Array<{ keyword: string; count: number; ctr: number }> {
    const cutoff = this.getTimeframeCutoff(timeframe);
    const recentEvents = this.events.filter(e => e.timestamp >= cutoff);

    const keywordStats = new Map<string, { count: number; clicks: number }>();

    recentEvents.forEach(event => {
      if (event.query.trim()) {
        const words = this.extractKeywords(event.query);
        words.forEach(keyword => {
          const stats = keywordStats.get(keyword) || { count: 0, clicks: 0 };
          stats.count++;
          stats.clicks += event.clickedResults.length;
          keywordStats.set(keyword, stats);
        });
      }
    });

    return Array.from(keywordStats.entries())
      .map(([keyword, stats]) => ({
        keyword,
        count: stats.count,
        ctr: stats.count > 0 ? stats.clicks / stats.count : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * 検索トレンドを分析
   */
  getTrends(timeframe: 'hour' | 'day' | 'week' | 'month' = 'day'): SearchTrend[] {
    const currentCutoff = this.getTimeframeCutoff(timeframe);
    const previousCutoff = this.getTimeframeCutoff(timeframe, 2); // 前期間も含む

    const currentEvents = this.events.filter(e => e.timestamp >= currentCutoff);
    const previousEvents = this.events.filter(e => 
      e.timestamp >= previousCutoff && e.timestamp < currentCutoff
    );

    const currentCounts = this.countKeywords(currentEvents);
    const previousCounts = this.countKeywords(previousEvents);

    const trends: SearchTrend[] = [];

    currentCounts.forEach((count, keyword) => {
      const previousCount = previousCounts.get(keyword) || 0;
      const growthRate = previousCount > 0 ? 
        ((count - previousCount) / previousCount) * 100 : 
        count > 0 ? 100 : 0;

      trends.push({
        keyword,
        count,
        growthRate,
        timeframe,
        category: this.categorizeKeyword(keyword),
        relatedTerms: this.getRelatedTerms(keyword, currentEvents)
      });
    });

    return trends.sort((a, b) => b.growthRate - a.growthRate);
  }

  /**
   * 低パフォーマンスクエリを識別
   */
  getLowPerformingQueries(limit = 10): Array<{ query: string; count: number; avgResults: number; ctr: number }> {
    const queryStats = new Map<string, { count: number; totalResults: number; clicks: number }>();

    this.events.forEach(event => {
      const query = event.query.trim().toLowerCase();
      if (query) {
        const stats = queryStats.get(query) || { count: 0, totalResults: 0, clicks: 0 };
        stats.count++;
        stats.totalResults += event.resultCount;
        stats.clicks += event.clickedResults.length;
        queryStats.set(query, stats);
      }
    });

    return Array.from(queryStats.entries())
      .map(([query, stats]) => ({
        query,
        count: stats.count,
        avgResults: stats.totalResults / stats.count,
        ctr: stats.count > 0 ? stats.clicks / stats.count : 0
      }))
      .filter(item => item.count >= 5) // 最低5回は検索されたもの
      .sort((a, b) => a.avgResults - b.avgResults || a.ctr - b.ctr)
      .slice(0, limit);
  }

  /**
   * ユーザー行動分析
   */
  getUserBehaviorInsights(): SearchInsight['userBehavior'] {
    const sessions = this.groupBySession();
    
    let totalQueries = 0;
    let totalSessions = sessions.size;
    let totalTimeToClick = 0;
    let clickCount = 0;
    let refinements = 0;
    let abandonments = 0;

    sessions.forEach(sessionEvents => {
      totalQueries += sessionEvents.length;

      // 絞り込み検索の検出
      for (let i = 1; i < sessionEvents.length; i++) {
        if (this.isRefinedSearch(sessionEvents[i], sessionEvents[i-1])) {
          refinements++;
        }
      }

      // クリック分析
      sessionEvents.forEach(event => {
        event.clickedResults.forEach(click => {
          totalTimeToClick += click.timestamp - event.timestamp;
          clickCount++;
        });

        // 結果が0件で次の検索がない場合は離脱とみなす
        if (event.resultCount === 0 && !event.clickedResults.length) {
          abandonments++;
        }
      });
    });

    return {
      avgQueriesPerSession: totalSessions > 0 ? totalQueries / totalSessions : 0,
      avgTimeToClick: clickCount > 0 ? totalTimeToClick / clickCount : 0,
      refinementRate: totalQueries > 0 ? refinements / totalQueries : 0,
      abandonmentRate: totalQueries > 0 ? abandonments / totalQueries : 0
    };
  }

  /**
   * 地域別トレンド分析
   */
  getGeographicTrends(): SearchInsight['geographicTrends'] {
    const locationGroups = new Map<string, SearchEvent[]>();

    this.events.forEach(event => {
      if (event.location?.prefecture) {
        const key = event.location.prefecture;
        if (!locationGroups.has(key)) {
          locationGroups.set(key, []);
        }
        locationGroups.get(key)!.push(event);
      }
    });

    return Array.from(locationGroups.entries()).map(([location, events]) => {
      const keywords = this.countKeywords(events);
      const topKeywords = Array.from(keywords.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([keyword]) => keyword);

      // 他地域と比較してユニークな検索傾向を分析
      const uniquePreferences = this.findUniquePreferences(location, events);

      return {
        location,
        topKeywords,
        uniquePreferences
      };
    });
  }

  /**
   * 季節トレンド分析
   */
  getSeasonalTrends(): SearchInsight['seasonalTrends'] {
    const monthlyData = new Map<string, number[]>();

    this.events.forEach(event => {
      const month = new Date(event.timestamp).getMonth();
      const keywords = this.extractKeywords(event.query);

      keywords.forEach(keyword => {
        if (!monthlyData.has(keyword)) {
          monthlyData.set(keyword, new Array(12).fill(0));
        }
        monthlyData.get(keyword)![month]++;
      });
    });

    return Array.from(monthlyData.entries())
      .filter(([, months]) => months.some(count => count > 0))
      .map(([keyword, months]) => {
        const peakMonth = months.indexOf(Math.max(...months));
        return {
          keyword,
          months,
          peakMonth
        };
      })
      .sort((a, b) => Math.max(...b.months) - Math.max(...a.months));
  }

  /**
   * 検索改善提案を生成
   */
  getSearchImprovementSuggestions(): Array<{
    type: 'synonym' | 'spelling' | 'category' | 'filter';
    issue: string;
    suggestion: string;
    impact: 'high' | 'medium' | 'low';
    queries: string[];
  }> {
    const suggestions: Array<any> = [];

    // 低パフォーマンスクエリから改善提案を生成
    const lowPerforming = this.getLowPerformingQueries(20);

    lowPerforming.forEach(item => {
      if (item.avgResults === 0) {
        suggestions.push({
          type: 'synonym',
          issue: `"${item.query}" で検索結果が0件`,
          suggestion: `同義語やスペル修正候補を追加`,
          impact: 'high',
          queries: [item.query]
        });
      } else if (item.ctr < 0.1) {
        suggestions.push({
          type: 'category',
          issue: `"${item.query}" の検索結果の関連性が低い`,
          suggestion: `検索アルゴリズムの調整またはカテゴリ分類の改善`,
          impact: 'medium',
          queries: [item.query]
        });
      }
    });

    return suggestions;
  }

  /**
   * イベントIDを生成
   */
  private generateEventId(): string {
    return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * リアルタイムイベント処理
   */
  private processEventRealtime(event: SearchEvent): void {
    // リアルタイム分析ロジック（必要に応じて実装）
    if (event.noResultsSearch) {
      console.warn('No results search detected:', event.query);
    }
  }

  /**
   * 時間枠のカットオフ時刻を取得
   */
  private getTimeframeCutoff(timeframe: 'hour' | 'day' | 'week' | 'month', multiplier = 1): number {
    const now = Date.now();
    const cutoffs = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000
    };

    return now - (cutoffs[timeframe] * multiplier);
  }

  /**
   * キーワードを抽出
   */
  private extractKeywords(query: string): string[] {
    return query
      .toLowerCase()
      .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1);
  }

  /**
   * キーワードをカウント
   */
  private countKeywords(events: SearchEvent[]): Map<string, number> {
    const counts = new Map<string, number>();

    events.forEach(event => {
      const keywords = this.extractKeywords(event.query);
      keywords.forEach(keyword => {
        counts.set(keyword, (counts.get(keyword) || 0) + 1);
      });
    });

    return counts;
  }

  /**
   * キーワードをカテゴライズ
   */
  private categorizeKeyword(keyword: string): string {
    const categories = {
      services: ['カット', 'カラー', 'パーマ', 'ストレート', 'トリートメント'],
      locations: ['渋谷', '新宿', '原宿', '表参道', '池袋', '銀座'],
      styles: ['ボブ', 'ショート', 'ロング', 'ウルフ', 'レイヤー'],
      techniques: ['ハイライト', 'グラデーション', 'バレイヤージュ', 'インナーカラー'],
      demographics: ['メンズ', 'レディース', '学生', '社会人']
    };

    for (const [category, terms] of Object.entries(categories)) {
      if (terms.some(term => keyword.includes(term) || term.includes(keyword))) {
        return category;
      }
    }

    return 'other';
  }

  /**
   * 関連用語を取得
   */
  private getRelatedTerms(keyword: string, events: SearchEvent[]): string[] {
    const relatedTerms = new Set<string>();

    events.forEach(event => {
      if (event.query.includes(keyword)) {
        const words = this.extractKeywords(event.query);
        words.forEach(word => {
          if (word !== keyword && word.length > 1) {
            relatedTerms.add(word);
          }
        });
      }
    });

    return Array.from(relatedTerms).slice(0, 5);
  }

  /**
   * セッション別にグループ化
   */
  private groupBySession(): Map<string, SearchEvent[]> {
    const sessions = new Map<string, SearchEvent[]>();

    this.events.forEach(event => {
      if (!sessions.has(event.sessionId)) {
        sessions.set(event.sessionId, []);
      }
      sessions.get(event.sessionId)!.push(event);
    });

    // 各セッション内で時系列順にソート
    sessions.forEach(events => {
      events.sort((a, b) => a.timestamp - b.timestamp);
    });

    return sessions;
  }

  /**
   * 絞り込み検索かどうか判定
   */
  private isRefinedSearch(current: SearchEvent, previous: SearchEvent): boolean {
    // クエリが似ている、またはフィルターが追加されている場合
    const queryOverlap = this.calculateQuerySimilarity(current.query, previous.query);
    const hasMoreFilters = Object.keys(current.filters).length > Object.keys(previous.filters).length;
    
    return queryOverlap > 0.5 || hasMoreFilters;
  }

  /**
   * クエリ類似度を計算
   */
  private calculateQuerySimilarity(query1: string, query2: string): number {
    const words1 = new Set(this.extractKeywords(query1));
    const words2 = new Set(this.extractKeywords(query2));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * 地域特有の検索傾向を見つける
   */
  private findUniquePreferences(location: string, events: SearchEvent[]): string[] {
    // 実装は複雑になるため、簡略化したバージョン
    const keywords = this.countKeywords(events);
    
    // この地域でよく検索されるが、他地域ではあまり検索されないキーワードを探す
    // 実際の実装では全地域のデータと比較する必要がある
    
    return Array.from(keywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([keyword]) => keyword);
  }
}

// シングルトンインスタンス
export const searchAnalytics = new SearchAnalytics();