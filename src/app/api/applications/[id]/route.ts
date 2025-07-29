import { NextRequest } from 'next/server';
import { validateRequest } from '@/lib/api/validation';
import { updateApplicationSchema } from '@/lib/api/recruitment-validation';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api/response';
import { recruitmentDb } from '@/lib/api/recruitment-db';
import { authenticateRequest } from '@/lib/api/middleware';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/applications/[id] - 応募詳細取得
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 認証チェック
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return authResult.response!;
    }
    
    const user = authResult.user!;
    
    // 応募を取得
    const application = await recruitmentDb.findApplicationById(id);
    if (!application) {
      return errorResponse('応募が見つかりません', 404);
    }
    
    // アクセス権限チェック（本人またはアシスタント）
    if (application.customerId !== user.userId && application.assistantId !== user.userId) {
      return errorResponse('この応募にアクセスする権限がありません', 403);
    }
    
    // 募集投稿情報を取得
    const post = await recruitmentDb.findPostById(application.postId);
    
    return successResponse({
      application: {
        ...application,
        post: post ? {
          id: post.id,
          title: post.title,
          services: post.services,
          duration: post.duration,
          price: post.price,
          salon: post.salon
        } : null
      }
    });
  } catch (error) {
    console.error('Get application detail error:', error);
    return serverErrorResponse('応募詳細の取得中にエラーが発生しました');
  }
}

// PUT /api/applications/[id] - 応募ステータス更新（アシスタント専用）
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 認証チェック
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return authResult.response!;
    }
    
    const user = authResult.user!;
    
    // アシスタント美容師のみ更新可能
    if (user.userType !== 'stylist') {
      return errorResponse('応募ステータスの更新はアシスタント美容師のみ可能です', 403);
    }
    
    // 応募を取得
    const application = await recruitmentDb.findApplicationById(id);
    if (!application) {
      return errorResponse('応募が見つかりません', 404);
    }
    
    // 応募の対象となった募集投稿の作成者のみ更新可能
    if (application.assistantId !== user.userId) {
      return errorResponse('この応募を更新する権限がありません', 403);
    }
    
    // リクエストボディを取得
    const body = await request.json();
    
    // バリデーション
    const { value, errors } = validateRequest(updateApplicationSchema, body);
    if (errors || !value) {
      return errorResponse('入力内容に誤りがあります', 400, errors);
    }
    
    // 応募ステータスを更新
    const updates: any = {
      status: (value as any).status,
      reviewedAt: new Date().toISOString()
    };
    
    if ((value as any).feedback) {
      updates.feedback = (value as any).feedback;
    }
    
    const updatedApplication = await recruitmentDb.updateApplication(id, updates);
    
    // 承認された場合は予約を作成
    if ((value as any).status === 'accepted' && (value as any).scheduledDate) {
      const post = await recruitmentDb.findPostById(application.postId);
      if (post) {
        await recruitmentDb.createBooking({
          applicationId: application.id,
          customerId: application.customerId,
          assistantId: application.assistantId,
          postId: application.postId,
          scheduledDate: (value as any).scheduledDate,
          duration: post.duration,
          services: post.services,
          totalPrice: post.price,
          salon: post.salon,
          status: 'confirmed'
        });
      }
    }
    
    return successResponse({
      application: {
        id: updatedApplication!.id,
        status: updatedApplication!.status,
        feedback: updatedApplication!.feedback,
        reviewedAt: updatedApplication!.reviewedAt,
        updatedAt: updatedApplication!.updatedAt
      }
    });
  } catch (error) {
    console.error('Update application error:', error);
    return serverErrorResponse('応募ステータスの更新中にエラーが発生しました');
  }
}

// DELETE /api/applications/[id] - 応募取り下げ（カスタマー専用）
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 認証チェック
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return authResult.response!;
    }
    
    const user = authResult.user!;
    
    // 応募を取得
    const application = await recruitmentDb.findApplicationById(id);
    if (!application) {
      return errorResponse('応募が見つかりません', 404);
    }
    
    // 応募者本人のみ取り下げ可能
    if (application.customerId !== user.userId) {
      return errorResponse('この応募を取り下げる権限がありません', 403);
    }
    
    // 承認済みの応募は取り下げ不可
    if (application.status === 'accepted') {
      return errorResponse('承認済みの応募は取り下げできません', 400);
    }
    
    // 応募ステータスを更新（物理削除ではなく論理削除）
    await recruitmentDb.updateApplication(id, {
      status: 'rejected',
      feedback: 'ユーザーによる取り下げ'
    });
    
    // 募集投稿の応募数を減少
    const post = await recruitmentDb.findPostById(application.postId);
    if (post && post.appliedCount > 0) {
      await recruitmentDb.updatePost(post.id, { 
        appliedCount: post.appliedCount - 1,
        status: post.status === 'full' && post.appliedCount - 1 < post.modelCount ? 'recruiting' : post.status
      });
    }
    
    return successResponse({
      message: '応募を取り下げました'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    return serverErrorResponse('応募の取り下げ中にエラーが発生しました');
  }
}