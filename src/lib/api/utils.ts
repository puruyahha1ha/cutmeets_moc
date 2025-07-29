// API共通ユーティリティ関数
import { NextRequest, NextResponse } from 'next/server';

// 認証済みリクエストの結果型
export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    userType: 'customer' | 'stylist' | 'admin';
    name?: string;
  };
  error?: string;
}

// レスポンス形式
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

// JWT検証（簡易版）
export async function authenticateRequest(request: NextRequest): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: 'Authorization header missing or invalid'
      };
    }

    const token = authHeader.substring(7);
    
    // 実際の実装では、JWTを検証してユーザー情報を取得
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 仮の実装として、固定のユーザー情報を返す
    const mockUser = {
      id: 'user_' + Date.now(),
      email: 'user@example.com',
      userType: 'customer' as const,
      name: 'テストユーザー'
    };

    return {
      success: true,
      user: mockUser
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid token'
    };
  }
}

// 成功レスポンス生成
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data
    } as ApiResponse<T>,
    { status }
  );
}

// エラーレスポンス生成
export function errorResponse(error: string, status: number = 400, details?: any): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      details
    } as ApiResponse,
    { status }
  );
}

// バリデーション関数
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // 最低8文字、英数字を含む
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

// ページネーション計算
export function calculatePagination(
  page: number = 1,
  limit: number = 20,
  totalCount: number
) {
  const totalPages = Math.ceil(totalCount / limit);
  const offset = (page - 1) * limit;
  
  return {
    page,
    limit,
    offset,
    totalPages,
    totalCount,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
}

// 日付フォーマット
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

// レート制限（簡易版）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// エラーログ
export function logError(error: any, context?: string) {
  console.error(`[API Error] ${context || 'Unknown context'}:`, error);
  
  // 実際の実装では、外部ログサービスに送信
  // await logger.error(error, { context });
}

// セキュリティヘッダー設定
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

// 通知システム用の追加関数
export function getUserFromToken(token: string): { id: string; email: string; userType: string; name?: string } | null {
  try {
    // 実際の実装では、JWTを検証してユーザー情報を取得
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 仮の実装として、固定のユーザー情報を返す
    return {
      id: 'user_' + Date.now(),
      email: 'user@example.com',
      userType: 'customer',
      name: 'テストユーザー'
    };
  } catch (error) {
    return null;
  }
}

export function createApiResponse<T>(data: T | null, success: boolean = true, error?: string): NextResponse {
  if (success) {
    return NextResponse.json({
      success: true,
      data
    });
  } else {
    return NextResponse.json({
      success: false,
      error: error || 'Unknown error'
    });
  }
}