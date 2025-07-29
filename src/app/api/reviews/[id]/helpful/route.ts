// レビュー「役に立った」API エンドポイント
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, errorResponse, successResponse } from '@/lib/api/utils';
import { reviewDb } from '@/lib/api/review-db';

// POST /api/reviews/[id]/helpful - 「役に立った」投票
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
    const { isHelpful } = data;

    if (typeof isHelpful !== 'boolean') {
      return errorResponse('isHelpfulフィールドが必要です', 400);
    }

    // レビューの存在確認
    const review = await reviewDb.getReview(id);
    if (!review) {
      return errorResponse('レビューが見つかりません', 404);
    }

    // 自分のレビューには投票できない
    if (review.customerId === authResult.user!.id) {
      return errorResponse('自分のレビューには投票できません', 400);
    }

    // 投票処理
    await reviewDb.toggleHelpful(id, authResult.user!.id, isHelpful);

    // 更新されたレビューを取得
    const updatedReview = await reviewDb.getReview(id);

    return successResponse({
      review: updatedReview,
      message: isHelpful ? '「役に立った」を追加しました' : '「役に立たない」を追加しました'
    });
  } catch (error) {
    console.error('役に立った投票エラー:', error);
    return errorResponse('投票に失敗しました', 500);
  }
}