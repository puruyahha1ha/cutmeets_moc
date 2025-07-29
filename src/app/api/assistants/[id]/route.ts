import { NextRequest } from 'next/server';
import { successResponse, notFoundResponse, serverErrorResponse } from '@/lib/api/response';
import { mockDb } from '@/lib/api/mock-db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/assistants/[id] - アシスタント美容師詳細取得
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // アシスタント美容師情報を取得
    const assistant = await mockDb.findUserById(id);
    
    if (!assistant || assistant.userType !== 'stylist') {
      return notFoundResponse('アシスタント美容師が見つかりません');
    }

    // パスワードを除外したアシスタント美容師情報を返す
    const { passwordHash, ...assistantWithoutPassword } = assistant;

    return successResponse({
      assistant: assistantWithoutPassword,
    });
  } catch (error) {
    console.error('Get assistant error:', error);
    return serverErrorResponse('アシスタント美容師情報の取得中にエラーが発生しました');
  }
}