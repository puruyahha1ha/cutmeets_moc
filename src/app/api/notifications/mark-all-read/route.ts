import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/api/utils';
import { notificationDB } from '@/lib/api/notification-db';
import { getUserFromToken } from '@/lib/api/utils';

// POST /api/notifications/mark-all-read - すべての通知を既読にする
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization'); const token = authHeader?.replace('Bearer ', '') || ''; const user = getUserFromToken(token);
    if (!user) {
      return createApiResponse({
        success: false,
        error: '認証が必要です',
        status: 401
      });
    }

    const count = await notificationDB.markAllAsRead(user.id);

    return createApiResponse({
      success: true,
      data: {
        message: `${count}件の通知を既読にしました`,
        count
      }
    });
  } catch (error) {
    console.error('一括既読エラー:', error);
    return createApiResponse({
      success: false,
      error: '通知の更新に失敗しました',
      status: 500
    });
  }
}