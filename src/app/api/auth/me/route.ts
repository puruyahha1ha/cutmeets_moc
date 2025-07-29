import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/lib/api/middleware';
import { successResponse, serverErrorResponse } from '@/lib/api/response';
import { mockDb } from '@/lib/api/mock-db';

export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const { authenticated, user, response } = await authenticateRequest(request);
    if (!authenticated || !user) {
      return response!;
    }

    // ユーザー情報を取得
    const dbUser = await mockDb.findUserById(user.userId);
    if (!dbUser) {
      return serverErrorResponse('ユーザーが見つかりません');
    }

    // パスワードを除外したユーザー情報を返す
    const { passwordHash, ...userWithoutPassword } = dbUser;

    return successResponse({
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return serverErrorResponse('ユーザー情報の取得中にエラーが発生しました');
  }
}