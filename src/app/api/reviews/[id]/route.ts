// レビュー詳細API エンドポイント
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, errorResponse, successResponse } from '@/lib/api/utils';
import { reviewDb } from '@/lib/api/review-db';

// GET /api/reviews/[id] - レビュー詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = await reviewDb.getReview(id);
    
    if (!review) {
      return errorResponse('レビューが見つかりません', 404);
    }

    // 非公開レビューは作成者のみ閲覧可能
    const authResult = await authenticateRequest(request);
    if (!review.isPublic && (!authResult.success || authResult.user!.id !== review.customerId)) {
      return errorResponse('このレビューを閲覧する権限がありません', 403);
    }

    // レスポンスも取得
    const responses = await reviewDb.getResponsesByReviewId(id);

    return successResponse({
      review,
      responses
    });
  } catch (error) {
    console.error('レビュー詳細取得エラー:', error);
    return errorResponse('レビューの取得に失敗しました', 500);
  }
}

// PUT /api/reviews/[id] - レビュー更新
export async function PUT(
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

    const review = await reviewDb.getReview(id);
    if (!review) {
      return errorResponse('レビューが見つかりません', 404);
    }

    // 権限チェック（作成者または管理者のみ）
    if (review.customerId !== authResult.user!.id && authResult.user!.userType !== 'admin') {
      return errorResponse('このレビューを編集する権限がありません', 403);
    }

    // 管理者による承認・却下処理
    if (authResult.user!.userType === 'admin' && data.status) {
      const updatedReview = await reviewDb.updateReview(id, {
        status: data.status,
        isVerified: data.status === 'published',
        moderatedBy: authResult.user!.id,
        moderatedAt: new Date().toISOString()
      });

      return successResponse({
        review: updatedReview,
        message: 'レビューのステータスが更新されました'
      });
    }

    // 一般ユーザーによる編集（投稿から24時間以内のみ）
    const createdAt = new Date(review.createdAt).getTime();
    const now = Date.now();
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return errorResponse('レビューは投稿から24時間以内のみ編集可能です', 400);
    }

    const allowedFields = ['title', 'comment', 'rating', 'categories', 'tags', 'isRecommended', 'serviceExperience', 'wouldBookAgain', 'isPublic'];
    const updates: any = {};

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updates[field] = data[field];
      }
    });

    // 編集後は再度承認待ちに
    if (Object.keys(updates).length > 0) {
      updates.status = 'pending';
      updates.isVerified = false;
    }

    const updatedReview = await reviewDb.updateReview(id, updates);

    return successResponse({
      review: updatedReview,
      message: 'レビューが更新されました'
    });
  } catch (error) {
    console.error('レビュー更新エラー:', error);
    return errorResponse('レビューの更新に失敗しました', 500);
  }
}

// DELETE /api/reviews/[id] - レビュー削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return errorResponse(authResult.error!, 401);
  }

  try {
    const { id } = await params;
    const review = await reviewDb.getReview(id);
    
    if (!review) {
      return errorResponse('レビューが見つかりません', 404);
    }

    // 権限チェック（作成者または管理者のみ）
    if (review.customerId !== authResult.user!.id && authResult.user!.userType !== 'admin') {
      return errorResponse('このレビューを削除する権限がありません', 403);
    }

    const success = await reviewDb.deleteReview(id);
    
    if (!success) {
      return errorResponse('レビューの削除に失敗しました', 500);
    }

    return successResponse({
      message: 'レビューが削除されました'
    });
  } catch (error) {
    console.error('レビュー削除エラー:', error);
    return errorResponse('レビューの削除に失敗しました', 500);
  }
}