import { NextRequest } from 'next/server';
import { successResponse, serverErrorResponse } from '@/lib/api/response';
import { mockDb } from '@/lib/api/mock-db';

// GET /api/assistants - アシスタント美容師一覧取得
export async function GET(request: NextRequest) {
  try {
    // クエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const area = searchParams.get('area');
    const specialties = searchParams.get('specialties')?.split(',');
    const minRate = searchParams.get('minRate');
    const maxRate = searchParams.get('maxRate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // アシスタント美容師一覧を取得
    let assistants = await mockDb.findUsersByType('stylist');

    // フィルタリング
    if (area) {
      assistants = assistants.filter(a => 
        a.profile.salonName?.toLowerCase().includes(area.toLowerCase())
      );
    }

    if (specialties && specialties.length > 0) {
      assistants = assistants.filter(a => 
        specialties.some(s => a.profile.specialties?.includes(s))
      );
    }

    if (minRate) {
      assistants = assistants.filter(a => 
        parseInt(a.profile.hourlyRate || '0') >= parseInt(minRate)
      );
    }

    if (maxRate) {
      assistants = assistants.filter(a => 
        parseInt(a.profile.hourlyRate || '0') <= parseInt(maxRate)
      );
    }

    // ページネーション
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAssistants = assistants.slice(startIndex, endIndex);

    // パスワードを除外
    const assistantsWithoutPassword = paginatedAssistants.map(({ passwordHash, ...rest }) => rest);

    return successResponse({
      assistants: assistantsWithoutPassword,
      pagination: {
        page,
        limit,
        total: assistants.length,
        totalPages: Math.ceil(assistants.length / limit),
      },
    });
  } catch (error) {
    console.error('Get assistants error:', error);
    return serverErrorResponse('アシスタント美容師一覧の取得中にエラーが発生しました');
  }
}