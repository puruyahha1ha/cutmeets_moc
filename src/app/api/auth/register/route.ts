import { NextRequest } from 'next/server';
import { registerSchema, validateRequest } from '@/lib/api/validation';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api/response';
import { mockDb } from '@/lib/api/mock-db';
import { hashPassword } from '@/lib/api/password';
import { generateToken } from '@/lib/api/jwt';
import { User } from '@/app/(web)/_components/providers/AuthProvider';

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  userType: 'stylist' | 'customer';
  profile?: User['profile'];
}

export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await request.json();

    // バリデーション
    const { value, errors } = validateRequest<RegisterRequest>(registerSchema, body);
    if (errors) {
      return errorResponse('入力内容に誤りがあります', 400, errors);
    }

    // 既存のユーザーをチェック
    const existingUser = await mockDb.findUserByEmail(value!.email);
    if (existingUser) {
      return errorResponse('このメールアドレスは既に登録されています', 409);
    }

    // パスワードをハッシュ化
    const hashedPassword = await hashPassword(value!.password);

    // 新しいユーザーを作成
    const newUser = await mockDb.createUser({
      email: value!.email,
      passwordHash: hashedPassword,
      name: value!.name,
      userType: value!.userType,
      profile: value!.profile || {},
    });

    // JWTトークンを生成
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      userType: newUser.userType,
    });

    // パスワードを除外したユーザー情報を返す
    const { passwordHash, ...userWithoutPassword } = newUser;

    return successResponse({
      token,
      user: userWithoutPassword,
    }, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return serverErrorResponse('登録処理中にエラーが発生しました');
  }
}