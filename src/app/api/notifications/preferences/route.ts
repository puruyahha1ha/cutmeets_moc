import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/api/utils';
import { notificationDB } from '@/lib/api/notification-db';
import { getUserFromToken } from '@/lib/api/utils';

// GET /api/notifications/preferences - 通知設定を取得
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

    const preferences = await notificationDB.getPreferences(user.id);

    return createApiResponse({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('通知設定取得エラー:', error);
    return createApiResponse({
      success: false,
      error: '通知設定の取得に失敗しました',
      status: 500
    });
  }
}

// PUT /api/notifications/preferences - 通知設定を更新
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization'); const token = authHeader?.replace('Bearer ', '') || ''; const user = getUserFromToken(token);
    if (!user) {
      return createApiResponse({
        success: false,
        error: '認証が必要です',
        status: 401
      });
    }

    const body = await request.json();
    const updates = body;

    // バリデーション
    if (updates.emailEnabled !== undefined && typeof updates.emailEnabled !== 'boolean') {
      return createApiResponse({
        success: false,
        error: 'emailEnabledはboolean型である必要があります',
        status: 400
      });
    }

    if (updates.pushEnabled !== undefined && typeof updates.pushEnabled !== 'boolean') {
      return createApiResponse({
        success: false,
        error: 'pushEnabledはboolean型である必要があります',
        status: 400
      });
    }

    if (updates.inAppEnabled !== undefined && typeof updates.inAppEnabled !== 'boolean') {
      return createApiResponse({
        success: false,
        error: 'inAppEnabledはboolean型である必要があります',
        status: 400
      });
    }

    // 静寂時間のバリデーション
    if (updates.quietHours) {
      const { enabled, startTime, endTime } = updates.quietHours;
      if (typeof enabled !== 'boolean') {
        return createApiResponse({
          success: false,
          error: '静寂時間の設定が無効です',
          status: 400
        });
      }
      
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (enabled && (!timeRegex.test(startTime) || !timeRegex.test(endTime))) {
        return createApiResponse({
          success: false,
          error: '時間の形式が無効です（HH:mm形式で入力してください）',
          status: 400
        });
      }
    }

    const preferences = await notificationDB.updatePreferences(user.id, updates);

    return createApiResponse({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('通知設定更新エラー:', error);
    return createApiResponse({
      success: false,
      error: '通知設定の更新に失敗しました',
      status: 500
    });
  }
}