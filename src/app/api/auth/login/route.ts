import { NextRequest } from 'next/server';
import { loginSchema, validateRequest } from '@/lib/api/validation';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api/response';
import { mockDb } from '@/lib/api/mock-db';
import { comparePassword } from '@/lib/api/password';
import { generateToken } from '@/lib/api/jwt';

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await request.json();

    // バリデーション
    const { value, errors } = validateRequest<LoginRequest>(loginSchema, body);
    if (errors) {
      return errorResponse('入力内容に誤りがあります', 400, errors);
    }

    // ユーザーを検索
    const user = await mockDb.findUserByEmail(value!.email);
    if (!user) {
      return errorResponse('メールアドレスまたはパスワードが間違っています', 401);
    }

    // パスワードを検証
    const isPasswordValid = await comparePassword(value!.password, user.passwordHash);
    if (!isPasswordValid) {
      return errorResponse('メールアドレスまたはパスワードが間違っています', 401);
    }

    // JWTトークンを生成
    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
    });

    // パスワードを除外したユーザー情報を返す
    const { passwordHash, ...userWithoutPassword } = user;

    return successResponse({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    return serverErrorResponse('ログイン処理中にエラーが発生しました');
  }
}