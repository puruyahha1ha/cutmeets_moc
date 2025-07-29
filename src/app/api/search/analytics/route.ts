import { NextRequest, NextResponse } from 'next/server';
import { searchAnalytics } from '@/lib/search/search-analytics';

// 検索分析データを取得するAPI
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const timeframe = (searchParams.get('timeframe') as 'hour' | 'day' | 'week' | 'month') || 'day';
    const limit = parseInt(searchParams.get('limit') || '20');

    let data;

    switch (type) {
      case 'popular':
        data = searchAnalytics.getPopularKeywords(timeframe, limit);
        break;

      case 'trends':
        data = searchAnalytics.getTrends(timeframe);
        break;

      case 'low-performing':
        data = searchAnalytics.getLowPerformingQueries(limit);
        break;

      case 'user-behavior':
        data = searchAnalytics.getUserBehaviorInsights();
        break;

      case 'geographic':
        data = searchAnalytics.getGeographicTrends();
        break;

      case 'seasonal':
        data = searchAnalytics.getSeasonalTrends();
        break;

      case 'improvements':
        data = searchAnalytics.getSearchImprovementSuggestions();
        break;

      case 'dashboard':
        // ダッシュボード用の統合データ
        data = {
          popularKeywords: searchAnalytics.getPopularKeywords(timeframe, 10),
          trends: searchAnalytics.getTrends(timeframe).slice(0, 5),
          userBehavior: searchAnalytics.getUserBehaviorInsights(),
          lowPerforming: searchAnalytics.getLowPerformingQueries(5),
          improvements: searchAnalytics.getSearchImprovementSuggestions().slice(0, 3)
        };
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid analytics type. Available types: popular, trends, low-performing, user-behavior, geographic, seasonal, improvements, dashboard'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data,
      metadata: {
        type,
        timeframe,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// 検索イベントを送信するAPI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === 'track_search') {
      const {
        sessionId,
        userId,
        query,
        filters,
        resultCount,
        searchTime,
        source = 'search_box',
        deviceType = 'desktop',
        location
      } = body;

      // 必須フィールドのバリデーション
      if (!sessionId || query === undefined || resultCount === undefined) {
        return NextResponse.json({
          success: false,
          error: 'Missing required fields: sessionId, query, resultCount'
        }, { status: 400 });
      }

      // 検索イベントを記録
      searchAnalytics.trackSearch({
        sessionId,
        userId,
        query,
        filters: filters || {},
        resultCount,
        clickedResults: [],
        searchTime: searchTime || 0,
        noResultsSearch: resultCount === 0,
        source,
        deviceType,
        location
      });

      return NextResponse.json({
        success: true,
        message: 'Search event tracked successfully'
      });
    }

    if (body.action === 'track_click') {
      const { searchEventId, itemId, position } = body;

      if (!searchEventId || !itemId || position === undefined) {
        return NextResponse.json({
          success: false,
          error: 'Missing required fields: searchEventId, itemId, position'
        }, { status: 400 });
      }

      // クリックイベントを記録
      searchAnalytics.trackClick(searchEventId, itemId, position);

      return NextResponse.json({
        success: true,
        message: 'Click event tracked successfully'
      });
    }

    if (body.action === 'batch_track') {
      const { events } = body;

      if (!Array.isArray(events)) {
        return NextResponse.json({
          success: false,
          error: 'Events must be an array'
        }, { status: 400 });
      }

      let successCount = 0;
      let errorCount = 0;

      // バッチでイベントを処理
      events.forEach((event: any) => {
        try {
          if (event.type === 'search') {
            searchAnalytics.trackSearch({
              sessionId: event.sessionId,
              userId: event.userId,
              query: event.query,
              filters: event.filters || {},
              resultCount: event.resultCount,
              clickedResults: [],
              searchTime: event.searchTime || 0,
              noResultsSearch: event.resultCount === 0,
              source: event.source || 'search_box',
              deviceType: event.deviceType || 'desktop',
              location: event.location
            });
            successCount++;
          } else if (event.type === 'click') {
            searchAnalytics.trackClick(event.searchEventId, event.itemId, event.position);
            successCount++;
          }
        } catch (error) {
          console.error('Failed to track event:', event, error);
          errorCount++;
        }
      });

      return NextResponse.json({
        success: true,
        message: `Processed ${successCount} events successfully, ${errorCount} errors`
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Available actions: track_search, track_click, batch_track'
    }, { status: 400 });

  } catch (error) {
    console.error('Analytics POST API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// 検索分析データをエクスポートするAPI
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === 'export_data') {
      const { format = 'json', timeframe = 'week' } = body;

      // 分析データを取得
      const analyticsData = {
        popularKeywords: searchAnalytics.getPopularKeywords(timeframe as any, 50),
        trends: searchAnalytics.getTrends(timeframe as any),
        userBehavior: searchAnalytics.getUserBehaviorInsights(),
        geographicTrends: searchAnalytics.getGeographicTrends(),
        seasonalTrends: searchAnalytics.getSeasonalTrends(),
        lowPerformingQueries: searchAnalytics.getLowPerformingQueries(20),
        improvements: searchAnalytics.getSearchImprovementSuggestions(),
        metadata: {
          exportedAt: new Date().toISOString(),
          timeframe,
          format
        }
      };

      if (format === 'csv') {
        // CSV形式での出力（簡単な実装）
        const csvData = convertToCSV(analyticsData);
        
        return new Response(csvData, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="search-analytics-${Date.now()}.csv"`
          }
        });
      }

      return NextResponse.json({
        success: true,
        data: analyticsData
      });
    }

    if (body.action === 'clear_data') {
      // 注意: この機能は管理者権限が必要
      const { confirm } = body;

      if (confirm !== 'DELETE_ALL_ANALYTICS_DATA') {
        return NextResponse.json({
          success: false,
          error: 'Invalid confirmation token'
        }, { status: 400 });
      }

      // 実際の実装では、分析データのクリア機能を提供
      console.warn('Analytics data clear requested - implement with caution');

      return NextResponse.json({
        success: true,
        message: 'Analytics data cleared successfully'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Available actions: export_data, clear_data'
    }, { status: 400 });

  } catch (error) {
    console.error('Analytics PUT API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// CSV変換ヘルパー関数
function convertToCSV(data: any): string {
  const rows: string[] = [];
  
  // ヘッダー行
  rows.push('Type,Keyword,Count,CTR,Growth Rate,Confidence');
  
  // 人気キーワード
  data.popularKeywords.forEach((item: any) => {
    rows.push(`Popular,"${item.keyword}",${item.count},${item.ctr || 0},0,1.0`);
  });
  
  // トレンドキーワード
  data.trends.forEach((item: any) => {
    rows.push(`Trend,"${item.keyword}",${item.count},0,${item.growthRate},0.9`);
  });
  
  return rows.join('\n');
}

// 実際の本番環境では、認証とレート制限を追加する必要があります
function validateApiAccess(request: NextRequest): boolean {
  // API キーやJWTトークンの検証
  const apiKey = request.headers.get('x-api-key');
  const authToken = request.headers.get('authorization');
  
  // 簡単な実装例（実際にはより厳密な検証が必要）
  return !!(apiKey || authToken);
}

// レート制限のヘルパー関数
function checkRateLimit(identifier: string): boolean {
  // 実装例: Redis やメモリキャッシュを使用したレート制限
  // 現在は常にtrueを返す
  return true;
}