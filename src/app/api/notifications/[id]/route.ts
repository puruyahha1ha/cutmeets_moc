import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/api/utils';
import { notificationDB } from '@/lib/api/notification-db';
import { getUserFromToken } from '@/lib/api/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/notifications/[id] - 特定の通知を取得
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization'); const token = authHeader?.replace('Bearer ', '') || ''; const user = getUserFromToken(token);
    if (!user) {
      return createApiResponse({
        success: false,
        error: '認証が必要です',
        status: 401
      });
    }

    const { notifications } = await notificationDB.getNotificationsByUserId(user.id);
    const notification = notifications.find(n => n.id === id);

    if (!notification) {
      return createApiResponse({
        success: false,
        error: '通知が見つかりません',
        status: 404
      });
    }

    return createApiResponse({
      success: true,
      data: notification
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

// PATCH /api/notifications/[id] - 通知を更新（既読、アーカイブ等）
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization'); const token = authHeader?.replace('Bearer ', '') || ''; const user = getUserFromToken(token);
    if (!user) {
      return createApiResponse({
        success: false,
        error: '認証が必要です',
        status: 401
      });
    }

    const body = await request.json();
    const { action } = body;

    // 通知の所有者確認
    const { notifications } = await notificationDB.getNotificationsByUserId(user.id);
    const notification = notifications.find(n => n.id === id);

    if (!notification) {
      return createApiResponse({
        success: false,
        error: '通知が見つかりません',
        status: 404
      });
    }

    let updatedNotification;

    switch (action) {
      case 'read':
        updatedNotification = await notificationDB.markAsRead(id);
        break;
      case 'archive':
        updatedNotification = await notificationDB.archiveNotification(id);
        break;
      default:
        return createApiResponse({
          success: false,
          error: '無効なアクションです',
          status: 400
        });
    }

    return createApiResponse({
      success: true,
      data: updatedNotification
    });
  } catch (error) {
    console.error('通知更新エラー:', error);
    return createApiResponse({
      success: false,
      error: '通知の更新に失敗しました',
      status: 500
    });
  }
}

// DELETE /api/notifications/[id] - 通知を削除
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization'); const token = authHeader?.replace('Bearer ', '') || ''; const user = getUserFromToken(token);
    if (!user) {
      return createApiResponse({
        success: false,
        error: '認証が必要です',
        status: 401
      });
    }

    // 通知の所有者確認
    const { notifications } = await notificationDB.getNotificationsByUserId(user.id);
    const notification = notifications.find(n => n.id === id);

    if (!notification) {
      return createApiResponse({
        success: false,
        error: '通知が見つかりません',
        status: 404
      });
    }

    const success = await notificationDB.deleteNotification(id);

    if (!success) {
      return createApiResponse({
        success: false,
        error: '通知の削除に失敗しました',
        status: 500
      });
    }

    return createApiResponse({
      success: true,
      data: { message: '通知を削除しました' }
    });
  } catch (error) {
    console.error('通知削除エラー:', error);
    return createApiResponse({
      success: false,
      error: '通知の削除に失敗しました',
      status: 500
    });
  }
}