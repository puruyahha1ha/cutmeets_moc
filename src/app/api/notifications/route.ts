import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/api/utils';
import { notificationDB } from '@/lib/api/notification-db';
import { getUserFromToken } from '@/lib/api/utils';

// GET /api/notifications - 通知一覧取得
export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const authHeader = request.headers.get('authorization'); const token = authHeader?.replace('Bearer ', '') || ''; const user = getUserFromToken(token);
    if (!user) {
      return createApiResponse({
        success: false,
        error: '認証が必要です',
        status: 401
      });
    }

    // クエリパラメータ取得
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as 'unread' | 'read' | 'archived' | null;
    const type = searchParams.get('type') as any;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 通知取得
    const result = await notificationDB.getNotificationsByUserId(user.id, {
      status: status || undefined,
      type: type || undefined,
      limit,
      offset
    });

    // 未読数も取得
    const unreadCount = await notificationDB.getUnreadCount(user.id);

    return createApiResponse({
      success: true,
      data: {
        notifications: result.notifications,
        total: result.total,
        unreadCount,
        pagination: {
          limit,
          offset,
          hasMore: offset + limit < result.total
        }
      }
    });
  } catch (error) {
    console.error('通知取得エラー:', error);
    return createApiResponse({
      success: false,
      error: '通知の取得に失敗しました',
      status: 500
    });
  }
}

// POST /api/notifications - 通知作成（システム内部用）
export async function POST(request: NextRequest) {
  try {
    // 認証チェック（システム管理者のみ）
    const authHeader = request.headers.get('authorization'); const token = authHeader?.replace('Bearer ', '') || ''; const user = getUserFromToken(token);
    if (!user || user.userType !== 'admin') {
      return createApiResponse({
        success: false,
        error: '権限がありません',
        status: 403
      });
    }

    const body = await request.json();
    const { userId, type, title, message, data, priority } = body;

    // 必須パラメータチェック
    if (!userId || !type || !title || !message) {
      return createApiResponse({
        success: false,
        error: '必須パラメータが不足しています',
        status: 400
      });
    }

    // 通知送信
    const notification = await notificationDB.sendNotification(userId, type, {
      title,
      message,
      notificationData: data,
      priority
    });

    return createApiResponse({
      success: true,
      data: notification,
      status: 201
    });
  } catch (error) {
    console.error('通知作成エラー:', error);
    return createApiResponse({
      success: false,
      error: '通知の作成に失敗しました',
      status: 500
    });
  }
}