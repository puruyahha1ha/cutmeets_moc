import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/lib/api/middleware';
import { successResponse, notFoundResponse, forbiddenResponse, serverErrorResponse } from '@/lib/api/response';
import { mockDb } from '@/lib/api/mock-db';
import { User } from '@/app/(web)/_components/providers/AuthProvider';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/users/[id] - ユーザー詳細取得
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 認証チェック
    const { authenticated, user, response } = await authenticateRequest(request);
    if (!authenticated || !user) {
      return response!;
    }

    // ユーザー情報を取得
    const dbUser = await mockDb.findUserById(id);
    if (!dbUser) {
      return notFoundResponse('ユーザーが見つかりません');
    }

    // パスワードを除外したユーザー情報を返す
    const { passwordHash, ...userWithoutPassword } = dbUser;

    return successResponse({
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return serverErrorResponse('ユーザー情報の取得中にエラーが発生しました');
  }
}

// PUT /api/users/[id] - ユーザー情報更新
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 認証チェック
    const { authenticated, user, response } = await authenticateRequest(request);
    if (!authenticated || !user) {
      return response!;
    }

    // 自分のプロフィールのみ更新可能
    if (user.userId !== id) {
      return forbiddenResponse('他のユーザーの情報は更新できません');
    }

    // リクエストボディを取得
    const body = await request.json();

    // 更新可能なフィールドのみを抽出
    const allowedUpdates: Partial<User> = {
      name: body.name,
      profile: body.profile,
    };

    // ユーザー情報を更新
    const updatedUser = await mockDb.updateUser(id, allowedUpdates);
    if (!updatedUser) {
      return notFoundResponse('ユーザーが見つかりません');
    }

    // パスワードを除外したユーザー情報を返す
    const { passwordHash, ...userWithoutPassword } = updatedUser;

    return successResponse({
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return serverErrorResponse('ユーザー情報の更新中にエラーが発生しました');
  }
}