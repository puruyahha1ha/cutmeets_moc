import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

export function errorResponse(error: string, status = 400, errors?: Record<string, string[]>): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error, errors },
    { status }
  );
}

export function unauthorizedResponse(message = '認証が必要です'): NextResponse<ApiResponse> {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = 'アクセス権限がありません'): NextResponse<ApiResponse> {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = 'リソースが見つかりません'): NextResponse<ApiResponse> {
  return errorResponse(message, 404);
}

export function serverErrorResponse(message = 'サーバーエラーが発生しました'): NextResponse<ApiResponse> {
  return errorResponse(message, 500);
}