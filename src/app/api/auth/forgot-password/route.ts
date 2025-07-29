import { NextRequest } from 'next/server';
import { forgotPasswordSchema, validateRequest } from '@/lib/api/validation';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api/response';
import { mockDb } from '@/lib/api/mock-db';

interface ForgotPasswordRequest {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await request.json();

    // バリデーション
    const { value, errors } = validateRequest<ForgotPasswordRequest>(forgotPasswordSchema, body);
    if (errors) {
      return errorResponse('入力内容に誤りがあります', 400, errors);
    }

    // ユーザーを検索
    const user = await mockDb.findUserByEmail(value!.email);
    
    // セキュリティのため、ユーザーが存在しない場合も成功レスポンスを返す
    if (!user) {
      return successResponse({
        message: '入力されたメールアドレスに、パスワードリセットの手順をお送りしました',
      });
    }

    // パスワードリセットトークンを生成（モック実装）
    const resetToken = `reset_${user.id}_${Date.now()}`;

    // 実際の実装では、ここでメールを送信する
    console.log('Password reset token:', resetToken);
    console.log('Reset link:', `${process.env.NEXT_PUBLIC_API_URL}/reset-password?token=${resetToken}`);

    return successResponse({
      message: '入力されたメールアドレスに、パスワードリセットの手順をお送りしました',
      // 開発環境のみトークンを返す（本番環境では削除）
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return serverErrorResponse('パスワードリセット処理中にエラーが発生しました');
  }
}