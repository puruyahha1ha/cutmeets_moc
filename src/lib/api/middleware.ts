import { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from './jwt';
import { unauthorizedResponse } from './response';
import { JwtPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JwtPayload;
}

export async function authenticateRequest(request: NextRequest): Promise<{ 
  authenticated: boolean; 
  user?: JwtPayload; 
  response?: Response 
}> {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader || '');

  if (!token) {
    return {
      authenticated: false,
      response: unauthorizedResponse('認証トークンが必要です'),
    };
  }

  try {
    const user = verifyToken(token);
    return {
      authenticated: true,
      user,
    };
  } catch (error) {
    return {
      authenticated: false,
      response: unauthorizedResponse('無効または期限切れのトークンです'),
    };
  }
}