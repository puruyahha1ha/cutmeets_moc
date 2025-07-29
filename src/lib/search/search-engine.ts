/**
 * 高度な検索エンジン - Cutmeets用
 * 美容師アシスタント検索に特化した検索機能を提供
 */

export interface SearchableItem {
  id: string | number;
  title: string;
  description: string;
  keywords: string[];
  searchableText: string;
  location?: {
    station: string;
    address?: string;
    prefecture?: string;
    distance?: number;
    coordinates?: { lat: number; lng: number };
  };
  price?: number;
  originalPrice?: number;
  services: string[];
  rating?: number;
  reviewCount?: number;
  assistant?: {
    name: string;
    experience: string;
    level: 'beginner' | 'intermediate' | 'advanced';
  };
  salon?: {
    name: string;
    rating?: number;
  };
  status: 'recruiting' | 'full' | 'closed';
  urgency: 'normal' | 'urgent';
  postedAt: Date;
  availableDates?: string[];
  requirements?: string[];
  modelCount?: number;
  appliedCount?: number;
  duration?: number;
}

export interface SearchQuery {
  query?: string;
  location?: string;
  services?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  status?: 'recruiting' | 'full' | 'closed' | 'all';
  urgency?: 'normal' | 'urgent' | 'all';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  availableDate?: string;
  availableTime?: string;
  maxDistance?: number;
  requirements?: string[];
  sortBy?: 'relevance' | 'date' | 'price' | 'rating' | 'distance' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface SearchResult<T = SearchableItem> {
  items: T[];
  total: number;
  facets: SearchFacets;
  suggestions?: string[];
  query: SearchQuery;
  searchTime: number;
}

export interface SearchFacets {
  locations: Array<{ value: string; count: number; distance?: number }>;
  services: Array<{ value: string; count: number }>;
  priceRanges: Array<{ min: number; max: number; count: number }>;
  experienceLevels: Array<{ value: string; count: number }>;
  ratings: Array<{ value: number; count: number }>;
  status: Array<{ value: string; count: number }>;
}

/**
 * 高度な検索エンジンクラス
 */
export class SearchEngine {
  private items: SearchableItem[] = [];
  private searchIndex: Map<string, Set<string | number>> = new Map();
  private locationIndex: Map<string, SearchableItem[]> = new Map();
  private servicesIndex: Map<string, SearchableItem[]> = new Map();

  constructor(items: SearchableItem[] = []) {
    this.items = items;
    this.buildIndexes();
  }

  /**
   * アイテムを追加
   */
  addItems(items: SearchableItem[]): void {
    this.items.push(...items);
    this.buildIndexes();
  }

  /**
   * アイテムを更新
   */
  updateItems(items: SearchableItem[]): void {
    this.items = items;
    this.buildIndexes();
  }

  /**
   * 検索インデックスを構築
   */
  private buildIndexes(): void {
    this.searchIndex.clear();
    this.locationIndex.clear();
    this.servicesIndex.clear();

    this.items.forEach(item => {
      // テキスト検索インデックス
      const words = this.extractWords(item.searchableText);
      words.forEach(word => {
        if (!this.searchIndex.has(word)) {
          this.searchIndex.set(word, new Set());
        }
        this.searchIndex.get(word)!.add(item.id);
      });

      // 場所インデックス
      if (item.location?.station) {
        if (!this.locationIndex.has(item.location.station)) {
          this.locationIndex.set(item.location.station, []);
        }
        this.locationIndex.get(item.location.station)!.push(item);
      }

      // サービスインデックス
      item.services.forEach(service => {
        if (!this.servicesIndex.has(service)) {
          this.servicesIndex.set(service, []);
        }
        this.servicesIndex.get(service)!.push(item);
      });
    });
  }

  /**
   * テキストから検索用の単語を抽出
   */
  private extractWords(text: string): string[] {
    // 日本語対応の単語分割
    return text
      .toLowerCase()
      .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * 検索実行
   */
  async search(query: SearchQuery): Promise<SearchResult> {
    const startTime = Date.now();
    
    let results = [...this.items];

    // テキスト検索
    if (query.query) {
      results = this.filterByText(results, query.query);
    }

    // フィルター適用
    results = this.applyFilters(results, query);

    // ソート
    results = this.applySorting(results, query);

    // ページネーション
    const offset = query.offset || 0;
    const limit = query.limit || 20;
    const paginatedResults = results.slice(offset, offset + limit);

    // ファセット情報を生成
    const facets = this.generateFacets(this.items, query);

    // 検索提案を生成
    const suggestions = await this.generateSuggestions(query.query || '');

    const searchTime = Date.now() - startTime;

    return {
      items: paginatedResults,
      total: results.length,
      facets,
      suggestions,
      query,
      searchTime
    };
  }

  /**
   * テキスト検索フィルター
   */
  private filterByText(items: SearchableItem[], query: string): SearchableItem[] {
    if (!query.trim()) return items;

    const words = this.extractWords(query);
    const matchingIds = new Set<string | number>();

    // 各単語に対してインデックスを検索
    words.forEach(word => {
      // 完全一致
      if (this.searchIndex.has(word)) {
        this.searchIndex.get(word)!.forEach(id => matchingIds.add(id));
      }

      // 部分一致（前方一致）
      for (const [indexWord, ids] of this.searchIndex) {
        if (indexWord.startsWith(word) || word.startsWith(indexWord)) {
          ids.forEach(id => matchingIds.add(id));
        }
      }
    });

    return items.filter(item => matchingIds.has(item.id));
  }

  /**
   * フィルター適用
   */
  private applyFilters(items: SearchableItem[], query: SearchQuery): SearchableItem[] {
    let filtered = items;

    // 場所フィルター
    if (query.location) {
      filtered = filtered.filter(item => 
        item.location?.station?.includes(query.location!) ||
        item.location?.address?.includes(query.location!) ||
        item.location?.prefecture?.includes(query.location!)
      );
    }

    // サービスフィルター
    if (query.services && query.services.length > 0) {
      filtered = filtered.filter(item =>
        query.services!.some(service => 
          item.services.some(itemService => 
            itemService.includes(service) || service.includes(itemService)
          )
        )
      );
    }

    // 価格フィルター
    if (query.priceMin !== undefined) {
      filtered = filtered.filter(item => !item.price || item.price >= query.priceMin!);
    }
    if (query.priceMax !== undefined) {
      filtered = filtered.filter(item => !item.price || item.price <= query.priceMax!);
    }

    // 評価フィルター
    if (query.rating !== undefined) {
      filtered = filtered.filter(item => !item.rating || item.rating >= query.rating!);
    }

    // ステータスフィルター
    if (query.status && query.status !== 'all') {
      filtered = filtered.filter(item => item.status === query.status);
    }

    // 緊急度フィルター
    if (query.urgency && query.urgency !== 'all') {
      filtered = filtered.filter(item => item.urgency === query.urgency);
    }

    // 経験レベルフィルター
    if (query.experienceLevel && query.experienceLevel !== 'all') {
      filtered = filtered.filter(item => 
        item.assistant?.level === query.experienceLevel
      );
    }

    // 利用可能日フィルター
    if (query.availableDate) {
      filtered = filtered.filter(item =>
        item.availableDates?.includes(query.availableDate!)
      );
    }

    // 距離フィルター
    if (query.maxDistance !== undefined) {
      filtered = filtered.filter(item =>
        !item.location?.distance || item.location.distance <= query.maxDistance!
      );
    }

    // 条件フィルター
    if (query.requirements && query.requirements.length > 0) {
      filtered = filtered.filter(item =>
        query.requirements!.every(req =>
          item.requirements?.some(itemReq => 
            itemReq.includes(req) || req.includes(itemReq)
          )
        )
      );
    }

    return filtered;
  }

  /**
   * ソート適用
   */
  private applySorting(items: SearchableItem[], query: SearchQuery): SearchableItem[] {
    const sortBy = query.sortBy || 'relevance';
    const sortOrder = query.sortOrder || 'desc';

    return items.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = a.postedAt.getTime() - b.postedAt.getTime();
          break;

        case 'price':
          const aPrice = a.price || 0;
          const bPrice = b.price || 0;
          comparison = aPrice - bPrice;
          break;

        case 'rating':
          const aRating = a.rating || 0;
          const bRating = b.rating || 0;
          comparison = aRating - bRating;
          break;

        case 'distance':
          const aDistance = a.location?.distance || Infinity;
          const bDistance = b.location?.distance || Infinity;
          comparison = aDistance - bDistance;
          break;

        case 'popularity':
          const aPopularity = (a.reviewCount || 0) + (a.appliedCount || 0);
          const bPopularity = (b.reviewCount || 0) + (b.appliedCount || 0);
          comparison = aPopularity - bPopularity;
          break;

        case 'relevance':
        default:
          // 関連度は複数の要素を組み合わせて計算
          const aScore = this.calculateRelevanceScore(a, query);
          const bScore = this.calculateRelevanceScore(b, query);
          comparison = aScore - bScore;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * 関連度スコアを計算
   */
  private calculateRelevanceScore(item: SearchableItem, query: SearchQuery): number {
    let score = 0;

    // 基本スコア
    score += item.rating || 0;
    score += (item.reviewCount || 0) / 100;

    // ステータスによるブースト
    if (item.status === 'recruiting') score += 10;

    // 緊急度によるブースト
    if (item.urgency === 'urgent') score += 5;

    // 新しい投稿にブースト
    const daysSincePosted = (Date.now() - item.postedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePosted < 1) score += 5;
    else if (daysSincePosted < 7) score += 2;

    // テキストマッチによるブースト
    if (query.query) {
      const queryWords = this.extractWords(query.query);
      const itemWords = this.extractWords(item.searchableText);
      
      queryWords.forEach(qWord => {
        itemWords.forEach(iWord => {
          if (iWord.includes(qWord) || qWord.includes(iWord)) {
            score += 3;
          }
        });
      });
    }

    return score;
  }

  /**
   * ファセット情報を生成
   */
  private generateFacets(items: SearchableItem[], query: SearchQuery): SearchFacets {
    const locations = new Map<string, number>();
    const services = new Map<string, number>();
    const priceRanges = new Map<string, number>();
    const experienceLevels = new Map<string, number>();
    const ratings = new Map<number, number>();
    const status = new Map<string, number>();

    items.forEach(item => {
      // 場所
      if (item.location?.station) {
        locations.set(item.location.station, (locations.get(item.location.station) || 0) + 1);
      }

      // サービス
      item.services.forEach(service => {
        services.set(service, (services.get(service) || 0) + 1);
      });

      // 価格帯
      if (item.price) {
        const range = Math.floor(item.price / 1000) * 1000;
        const rangeKey = `${range}-${range + 999}`;
        priceRanges.set(rangeKey, (priceRanges.get(rangeKey) || 0) + 1);
      }

      // 経験レベル
      if (item.assistant?.level) {
        experienceLevels.set(item.assistant.level, (experienceLevels.get(item.assistant.level) || 0) + 1);
      }

      // 評価
      if (item.rating) {
        const ratingFloor = Math.floor(item.rating);
        ratings.set(ratingFloor, (ratings.get(ratingFloor) || 0) + 1);
      }

      // ステータス
      status.set(item.status, (status.get(item.status) || 0) + 1);
    });

    return {
      locations: Array.from(locations.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count),
      
      services: Array.from(services.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count),
      
      priceRanges: Array.from(priceRanges.entries())
        .map(([range, count]) => {
          const [min, max] = range.split('-').map(Number);
          return { min, max, count };
        })
        .sort((a, b) => a.min - b.min),
      
      experienceLevels: Array.from(experienceLevels.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count),
      
      ratings: Array.from(ratings.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.value - a.value),
      
      status: Array.from(status.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count)
    };
  }

  /**
   * 検索提案を生成
   */
  private async generateSuggestions(query: string): Promise<string[]> {
    if (!query.trim()) return [];

    const suggestions = new Set<string>();
    const queryWords = this.extractWords(query);

    // インデックスから類似の単語を探す
    for (const [word, ids] of this.searchIndex) {
      queryWords.forEach(qWord => {
        if (word.includes(qWord) && word !== qWord) {
          suggestions.add(word);
        }
      });
    }

    // 人気のサービス名を提案
    const popularServices = ['カット', 'カラー', 'パーマ', 'ストレート', 'トリートメント'];
    popularServices.forEach(service => {
      if (service.includes(query) || query.includes(service)) {
        suggestions.add(service);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }

  /**
   * 人気の検索キーワードを取得
   */
  getPopularKeywords(): string[] {
    // 実際の実装では検索ログから分析
    return [
      'カット モデル',
      'カラー 練習',
      'ブリーチ',
      'ボブカット',
      'メンズカット',
      'ハイライト',
      '渋谷',
      '新宿',
      '原宿',
      '安い'
    ];
  }

  /**
   * トレンドキーワードを取得
   */
  getTrendingKeywords(): string[] {
    // 実際の実装では時系列分析
    return [
      'インナーカラー',
      'フェードカット',
      'バレイヤージュ',
      'ウルフカット',
      'レイヤーカット'
    ];
  }
}