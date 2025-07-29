// レビュー返信API エンドポイント
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, errorResponse, successResponse } from '@/lib/api/utils';
import { reviewDb } from '@/lib/api/review-db';

// POST /api/reviews/[id]/response - レビューに返信
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return errorResponse(authResult.error!, 401);
  }

  try {
    const { id } = await params;
    const data = await request.json();
    const { response, isPublic = true } = data;

    if (!response || response.trim().length === 0) {
      return errorResponse('返信内容が必要です', 400);
    }

    if (response.length > 1000) {
      return errorResponse('返信は1000文字以内で入力してください', 400);
    }

    // レビューの存在確認
    const review = await reviewDb.getReview(id);
    if (!review) {
      return errorResponse('レビューが見つかりません', 404);
    }

    // アシスタント本人のみ返信可能
    if (review.assistantId !== authResult.user!.id) {
      return errorResponse('このレビューに返信する権限がありません', 403);
    }

    // 既存の返信確認（1つのレビューに1つの返信のみ）
    const existingResponses = await reviewDb.getResponsesByReviewId(id);
    if (existingResponses.length > 0) {
      return errorResponse('このレビューには既に返信済みです', 400);
    }

    // 返信作成
    const reviewResponse = await reviewDb.createResponse({
      reviewId: id,
      assistantId: authResult.user!.id,
      response: response.trim(),
      isPublic
    });

    return successResponse({
      response: reviewResponse,
      message: '返信が投稿されました'
    });
  } catch (error) {
    console.error('レビュー返信エラー:', error);
    return errorResponse('返信の投稿に失敗しました', 500);
  }
}

// GET /api/reviews/[id]/response - レビューの返信取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const responses = await reviewDb.getResponsesByReviewId(id);

    // 公開されている返信のみ返す
    const publicResponses = responses.filter(r => r.isPublic);

    return successResponse({
      responses: publicResponses
    });
  } catch (error) {
    console.error('レビュー返信取得エラー:', error);
    return errorResponse('返信の取得に失敗しました', 500);
  }
}