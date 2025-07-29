// モック実装 - 実際の実装では本物のJWTライブラリを使用
export interface JwtPayload {
  userId: string;
  email: string;
  userType: 'stylist' | 'customer';
  iat?: number;
  exp?: number;
}

export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  // モック実装：Base64エンコードした文字列を返す
  const mockToken = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7日後
  };
  return `mock_token_${Buffer.from(JSON.stringify(mockToken)).toString('base64')}`;
}

export function verifyToken(token: string): JwtPayload {
  try {
    if (!token.startsWith('mock_token_')) {
      throw new Error('Invalid token format');
    }
    const base64Data = token.replace('mock_token_', '');
    const decoded = JSON.parse(Buffer.from(base64Data, 'base64').toString());
    
    // 有効期限チェック
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }
    
    return decoded as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function extractTokenFromHeader(authHeader: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}