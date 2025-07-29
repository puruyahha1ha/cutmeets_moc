import { NextRequest } from 'next/server';
import { validateRequest } from '@/lib/api/validation';
import { updatePostSchema } from '@/lib/api/recruitment-validation';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api/response';
import { recruitmentDb } from '@/lib/api/recruitment-db';
import { authenticateRequest } from '@/lib/api/middleware';
import { mockDb } from '@/lib/api/mock-db';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/recruitment-posts/[id] - 募集投稿詳細取得
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 募集投稿を取得
    const post = await recruitmentDb.findPostById(id);
    if (!post) {
      return errorResponse('募集投稿が見つかりません', 404);
    }
    
    // アシスタント情報を取得
    const assistant = await mockDb.findUserById(post.assistantId);
    if (!assistant) {
      return errorResponse('アシスタント情報が見つかりません', 404);
    }
    
    // 応募情報を取得
    const applications = await recruitmentDb.findApplicationsByPost(id);
    
    // レスポンス用データを構築
    const response = {
      ...post,
      assistant: {
        id: assistant.id,
        name: assistant.name,
        experienceLevel: getExperienceLevel(assistant.profile.experience || ''),
        avatar: (assistant.profile as any)?.avatar,
        salon: post.salon
      },
      applications: applications.map(app => ({
        id: app.id,
        customer: {
          name: '匿名ユーザー', // プライバシー保護のため
          avatar: null
        },
        appliedAt: app.createdAt,
        status: app.status
      }))
    };
    
    return successResponse({
      post: response
    });
  } catch (error) {
    console.error('Get post detail error:', error);
    return serverErrorResponse('募集投稿の取得中にエラーが発生しました');
  }
}

// PUT /api/recruitment-posts/[id] - 募集投稿更新
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 認証チェック
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return authResult.response!;
    }
    
    const user = authResult.user!;
    
    // 募集投稿を取得
    const existingPost = await recruitmentDb.findPostById(id);
    if (!existingPost) {
      return errorResponse('募集投稿が見つかりません', 404);
    }
    
    // 投稿者本人のみ更新可能
    if (existingPost.assistantId !== user.userId) {
      return errorResponse('この募集投稿を更新する権限がありません', 403);
    }
    
    // リクエストボディを取得
    const body = await request.json();
    
    // バリデーション
    const { value, errors } = validateRequest(updatePostSchema, body);
    if (errors) {
      return errorResponse('入力内容に誤りがあります', 400, errors);
    }
    
    // 割引率を再計算（料金が変更された場合）
    let updates = { ...(value as any) };
    if ((value as any).price && (value as any).originalPrice) {
      updates.discount = Math.round((((value as any).originalPrice - (value as any).price) / (value as any).originalPrice) * 100);
    } else if ((value as any).price && existingPost.originalPrice) {
      updates.discount = Math.round(((existingPost.originalPrice - (value as any).price) / existingPost.originalPrice) * 100);
    } else if ((value as any).originalPrice && existingPost.price) {
      updates.discount = Math.round((((value as any).originalPrice - existingPost.price) / (value as any).originalPrice) * 100);
    }
    
    // 募集投稿を更新
    const updatedPost = await recruitmentDb.updatePost(id, updates);
    
    return successResponse({
      post: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    return serverErrorResponse('募集投稿の更新中にエラーが発生しました');
  }
}

// DELETE /api/recruitment-posts/[id] - 募集投稿削除
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 認証チェック
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return authResult.response!;
    }
    
    const user = authResult.user!;
    
    // 募集投稿を取得
    const existingPost = await recruitmentDb.findPostById(id);
    if (!existingPost) {
      return errorResponse('募集投稿が見つかりません', 404);
    }
    
    // 投稿者本人のみ削除可能
    if (existingPost.assistantId !== user.userId) {
      return errorResponse('この募集投稿を削除する権限がありません', 403);
    }
    
    // 進行中の応募がある場合は削除不可
    const applications = await recruitmentDb.findApplicationsByPost(id);
    const activeApplications = applications.filter(app => app.status === 'pending' || app.status === 'accepted');
    
    if (activeApplications.length > 0) {
      return errorResponse('進行中の応募があるため削除できません', 400);
    }
    
    // 募集投稿を削除
    const deleted = await recruitmentDb.deletePost(id);
    if (!deleted) {
      return errorResponse('募集投稿の削除に失敗しました', 500);
    }
    
    return successResponse({
      message: '募集投稿を削除しました'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    return serverErrorResponse('募集投稿の削除中にエラーが発生しました');
  }
}

// 経験年数からレベルを判定する関数
function getExperienceLevel(experience: string): 'beginner' | 'intermediate' | 'advanced' {
  const years = parseInt(experience);
  if (isNaN(years)) return 'beginner';
  
  if (years < 1) return 'beginner';
  if (years < 3) return 'intermediate';
  return 'advanced';
}