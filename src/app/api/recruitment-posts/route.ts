import { NextRequest } from 'next/server';
import { validateRequest } from '@/lib/api/validation';
import { createPostSchema, searchPostsSchema } from '@/lib/api/recruitment-validation';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api/response';
import { recruitmentDb } from '@/lib/api/recruitment-db';
import { authenticateRequest } from '@/lib/api/middleware';
import { mockDb } from '@/lib/api/mock-db';

// GET /api/recruitment-posts - 募集投稿一覧取得・検索
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // クエリパラメータのバリデーション
    const { value: filters, errors } = validateRequest(searchPostsSchema, queryParams);
    if (errors) {
      return errorResponse('検索条件に誤りがあります', 400, errors);
    }
    
    // 募集投稿を検索
    const { posts, total } = await recruitmentDb.findPosts({
      services: (filters as any)?.services,
      location: (filters as any)?.location,
      priceMax: (filters as any)?.priceMax,
      status: (filters as any)?.status || 'recruiting',
      page: (filters as any)?.page,
      limit: (filters as any)?.limit
    });
    
    // アシスタント情報を付与
    const postsWithAssistantInfo = await Promise.all(
      posts.map(async (post) => {
        const assistant = await mockDb.findUserById(post.assistantId);
        return {
          ...post,
          assistant: assistant ? {
            id: assistant.id,
            name: assistant.name,
            experienceLevel: getExperienceLevel(assistant.profile.experience || ''),
            avatar: (assistant.profile as any)?.avatar,
            salon: post.salon
          } : null
        };
      })
    );
    
    // ページネーション情報
    const pagination = {
      current: (filters as any)?.page || 1,
      total: Math.ceil(total / ((filters as any)?.limit || 20)),
      totalCount: total
    };
    
    return successResponse({
      posts: postsWithAssistantInfo,
      pagination
    });
  } catch (error) {
    console.error('Search posts error:', error);
    return serverErrorResponse('募集投稿の検索中にエラーが発生しました');
  }
}

// POST /api/recruitment-posts - 新規募集投稿作成
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return authResult.response!;
    }
    
    const user = authResult.user!;
    
    // アシスタント美容師のみ募集投稿可能
    if (user.userType !== 'stylist') {
      return errorResponse('募集投稿はアシスタント美容師のみ可能です', 403);
    }
    
    // リクエストボディを取得
    const body = await request.json();
    
    // バリデーション
    const { value, errors } = validateRequest(createPostSchema, body);
    if (errors) {
      return errorResponse('入力内容に誤りがあります', 400, errors);
    }
    
    // 割引率を計算
    const discount = Math.round((((value as any).originalPrice - (value as any).price) / (value as any).originalPrice) * 100);
    
    // 募集投稿を作成
    const newPost = await recruitmentDb.createPost({
      assistantId: user.userId,
      title: (value as any).title,
      description: (value as any).description,
      services: (value as any).services,
      duration: (value as any).duration,
      price: (value as any).price,
      originalPrice: (value as any).originalPrice,
      discount,
      requirements: (value as any).requirements || [],
      modelCount: (value as any).modelCount,
      availableDates: (value as any).availableDates,
      availableTimes: (value as any).availableTimes,
      salon: (value as any).salon,
      status: 'recruiting',
      urgency: (value as any).urgency || 'normal'
    });
    
    return successResponse({
      post: {
        id: newPost.id,
        title: newPost.title,
        status: newPost.status,
        createdAt: newPost.createdAt
      }
    }, 201);
  } catch (error) {
    console.error('Create post error:', error);
    return serverErrorResponse('募集投稿の作成中にエラーが発生しました');
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