import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/api/utils';
import { notificationDB } from '@/lib/api/notification-db';
import { getUserFromToken } from '@/lib/api/utils';

// GET /api/notifications/unread-count - 未読通知数を取得
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization'); const token = authHeader?.replace('Bearer ', '') || ''; const user = getUserFromToken(token);
    if (!user) {
      return createApiResponse({
        success: false,
        error: '認証が必要です',
        status: 401
      });
    }

    const unreadCount = await notificationDB.getUnreadCount(user.id);

    return createApiResponse({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error('未読通知数取得エラー:', error);
    return createApiResponse({
      success: false,
      error: '未読通知数の取得に失敗しました',
      status: 500
    });
  }
}