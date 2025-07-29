// レビューAPI エンドポイント
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, errorResponse, successResponse } from '@/lib/api/utils';
import { reviewDb } from '@/lib/api/review-db';
import { NotificationService } from '@/lib/api/notification-service';

// GET /api/reviews - レビュー一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assistantId = searchParams.get('assistantId');
    const customerId = searchParams.get('customerId');
    const rating = searchParams.get('rating');
    const minRating = searchParams.get('minRating');
    const maxRating = searchParams.get('maxRating');
    const isPublic = searchParams.get('isPublic');
    const isVerified = searchParams.get('isVerified');
    const status = searchParams.get('status');
    const tags = searchParams.get('tags')?.split(',');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const filters = {
      assistantId: assistantId || undefined,
      customerId: customerId || undefined,
      rating: rating ? parseInt(rating) : undefined,
      minRating: minRating ? parseInt(minRating) : undefined,
      maxRating: maxRating ? parseInt(maxRating) : undefined,
      isPublic: isPublic ? isPublic === 'true' : undefined,
      isVerified: isVerified ? isVerified === 'true' : undefined,
      status: status || undefined,
      tags: tags || undefined,
      sortBy: sortBy as 'date' | 'rating' | 'helpful' || 'date',
      sortOrder: sortOrder as 'asc' | 'desc' || 'desc',
      page,
      limit
    };

    const { reviews, total } = await reviewDb.getReviews(filters);

    return successResponse({
      reviews,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalCount: total
      }
    });
  } catch (error) {
    console.error('レビュー一覧取得エラー:', error);
    return errorResponse('レビューの取得に失敗しました', 500);
  }
}

// POST /api/reviews - 新規レビュー作成
export async function POST(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return errorResponse(authResult.error!, 401);
  }

  try {
    const data = await request.json();
    const {
      bookingId,
      assistantId,
      rating,
      title,
      comment,
      photos,
      tags,
      categories,
      isRecommended,
      serviceExperience,
      wouldBookAgain,
      isPublic = true
    } = data;

    // バリデーション
    if (!bookingId || !assistantId || !rating || !title || !comment) {
      return errorResponse('必須フィールドが不足しています', 400);
    }

    if (rating < 1 || rating > 5) {
      return errorResponse('評価は1-5の範囲で入力してください', 400);
    }

    if (!categories || typeof categories !== 'object') {
      return errorResponse('カテゴリ別評価が必要です', 400);
    }

    // 既存レビューの重複チェック
    const existingReviews = await reviewDb.getReviews({
      customerId: authResult.user!.id
    } as any);

    if (existingReviews.reviews.length > 0) {
      return errorResponse('この予約に対するレビューは既に投稿されています', 400);
    }

    // レビュー作成
    const review = await reviewDb.createReview({
      bookingId,
      assistantId,
      customerId: authResult.user!.id,
      rating,
      title,
      comment,
      photos: photos || [],
      tags: tags || [],
      categories: {
        technical: categories.technical || rating,
        communication: categories.communication || rating,
        cleanliness: categories.cleanliness || rating,
        timeliness: categories.timeliness || rating,
        atmosphere: categories.atmosphere || rating
      },
      isRecommended: isRecommended !== undefined ? isRecommended : rating >= 4,
      serviceExperience: serviceExperience || 'good',
      wouldBookAgain: wouldBookAgain !== undefined ? wouldBookAgain : rating >= 4,
      isPublic,
      isVerified: false, // 初期は未認証
      status: 'pending' // モデレーション待ち
    });

    // 新着レビュー通知をアシスタントに送信
    try {
      await NotificationService.sendNewReviewNotification(
        assistantId,
        review.id,
        authResult.user!.id,
        authResult.user!.name || 'ユーザー',
        rating,
        bookingId
      );
    } catch (notificationError) {
      console.error('レビュー通知の送信に失敗:', notificationError);
      // 通知送信の失敗はレビュー投稿処理には影響させない
    }

    return successResponse({
      review,
      message: 'レビューが投稿されました。承認後に公開されます。'
    });
  } catch (error) {
    console.error('レビュー作成エラー:', error);
    return errorResponse('レビューの投稿に失敗しました', 500);
  }
}