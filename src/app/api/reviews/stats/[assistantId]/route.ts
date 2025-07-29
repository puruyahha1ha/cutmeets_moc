// レビュー統計API エンドポイント
import { NextRequest, NextResponse } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api/utils';
import { reviewDb } from '@/lib/api/review-db';

// GET /api/reviews/stats/[assistantId] - アシスタントのレビュー統計取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assistantId: string }> }
) {
  try {
    const { assistantId } = await params;
    
    if (!assistantId) {
      return errorResponse('assistantIdが必要です', 400);
    }

    const stats = await reviewDb.getStats(assistantId);
    
    if (!stats) {
      // 統計がない場合は初期値を返す
      const emptyStats = {
        assistantId,
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        categoryAverages: {
          technical: 0,
          communication: 0,
          cleanliness: 0,
          timeliness: 0,
          atmosphere: 0
        },
        recommendationRate: 0,
        repeatCustomerRate: 0,
        lastUpdated: new Date().toISOString()
      };

      return successResponse({
        stats: emptyStats
      });
    }

    return successResponse({
      stats
    });
  } catch (error) {
    console.error('レビュー統計取得エラー:', error);
    return errorResponse('統計の取得に失敗しました', 500);
  }
}