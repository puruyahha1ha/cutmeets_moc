import { NextRequest } from 'next/server';
import { validateRequest } from '@/lib/api/validation';
import { createApplicationSchema } from '@/lib/api/recruitment-validation';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api/response';
import { recruitmentDb } from '@/lib/api/recruitment-db';
import { authenticateRequest } from '@/lib/api/middleware';
import { mockDb } from '@/lib/api/mock-db';

// GET /api/applications - 応募一覧取得（ユーザー別）
export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return authResult.response!;
    }
    
    const user = authResult.user!;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let applications;
    
    if (user.userType === 'customer') {
      // カスタマーの場合：自分の応募一覧を取得
      applications = await recruitmentDb.findApplicationsByCustomer(user.userId);
    } else if (user.userType === 'stylist') {
      // アシスタントの場合：自分の募集への応募一覧を取得
      const posts = await recruitmentDb.findPosts({ assistantId: user.userId });
      const postIds = posts.posts.map(post => post.id);
      
      applications = [];
      for (const postId of postIds) {
        const postApplications = await recruitmentDb.findApplicationsByPost(postId);
        applications.push(...postApplications);
      }
    } else {
      return errorResponse('無効なユーザータイプです', 400);
    }
    
    // ステータスフィルター
    if (status) {
      applications = applications.filter(app => app.status === status);
    }
    
    // ページネーション
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApplications = applications.slice(startIndex, endIndex);
    
    // 詳細情報を付与
    const applicationsWithDetails = await Promise.all(
      paginatedApplications.map(async (application) => {
        const post = await recruitmentDb.findPostById(application.postId);
        const assistant = await mockDb.findUserById(application.assistantId);
        const customer = await mockDb.findUserById(application.customerId);
        
        return {
          id: application.id,
          post: post ? {
            id: post.id,
            title: post.title,
            assistant: {
              name: assistant?.name || '不明',
              salon: post.salon.name
            },
            price: post.price,
            duration: post.duration
          } : null,
          customer: user.userType === 'stylist' ? {
            name: customer?.name || '不明',
            avatar: (customer?.profile as any)?.avatar
          } : undefined,
          status: application.status,
          appliedAt: application.createdAt,
          message: user.userType === 'stylist' ? application.message : undefined,
          feedback: application.feedback
        };
      })
    );
    
    const pagination = {
      current: page,
      total: Math.ceil(applications.length / limit),
      totalCount: applications.length
    };
    
    return successResponse({
      applications: applicationsWithDetails,
      pagination
    });
  } catch (error) {
    console.error('Get applications error:', error);
    return serverErrorResponse('応募一覧の取得中にエラーが発生しました');
  }
}

// POST /api/applications - 新規応募作成
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return authResult.response!;
    }
    
    const user = authResult.user!;
    
    // カスタマーのみ応募可能
    if (user.userType !== 'customer') {
      return errorResponse('応募はカスタマーのみ可能です', 403);
    }
    
    // リクエストボディを取得
    const body = await request.json();
    
    // バリデーション
    const { value, errors } = validateRequest(createApplicationSchema, body);
    if (errors) {
      return errorResponse('入力内容に誤りがあります', 400, errors);
    }
    
    // 募集投稿の存在確認
    const post = await recruitmentDb.findPostById((value as any).postId);
    if (!post) {
      return errorResponse('募集投稿が見つかりません', 404);
    }
    
    // 募集ステータス確認
    if (post.status !== 'recruiting') {
      return errorResponse('この募集は現在応募を受け付けていません', 400);
    }
    
    // 重複応募チェック
    const existingApplications = await recruitmentDb.findApplicationsByPost((value as any).postId);
    const userExistingApplication = existingApplications.find(app => app.customerId === user.userId);
    
    if (userExistingApplication) {
      return errorResponse('既にこの募集に応募済みです', 400);
    }
    
    // 自分の投稿への応募禁止チェック
    if (post.assistantId === user.userId) {
      return errorResponse('自分の募集投稿には応募できません', 400);
    }
    
    // 応募を作成
    const newApplication = await recruitmentDb.createApplication({
      postId: (value as any).postId,
      customerId: user.userId,
      assistantId: post.assistantId,
      message: (value as any).message,
      photos: (value as any).photos || [],
      availableTimes: (value as any).availableTimes,
      additionalInfo: (value as any).additionalInfo || {},
      status: 'pending'
    });
    
    // 募集投稿のステータス更新（満員になった場合）
    if (post.appliedCount >= post.modelCount) {
      await recruitmentDb.updatePost(post.id, { status: 'full' });
    }
    
    return successResponse({
      application: {
        id: newApplication.id,
        postId: newApplication.postId,
        status: newApplication.status,
        appliedAt: newApplication.createdAt
      }
    }, 201);
  } catch (error) {
    console.error('Create application error:', error);
    return serverErrorResponse('応募の作成中にエラーが発生しました');
  }
}