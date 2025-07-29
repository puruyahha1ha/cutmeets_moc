import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  // クライアント側でトークンを削除するため、サーバー側では特に処理は不要
  // 将来的にはトークンのブラックリスト機能を実装する可能性あり
  
  return successResponse({
    message: 'ログアウトしました',
  });
}