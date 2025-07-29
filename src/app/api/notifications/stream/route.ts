import { NextRequest } from 'next/server';
import { getUserFromToken } from '@/lib/api/utils';
import { notificationDB } from '@/lib/api/notification-db';

// GET /api/notifications/stream - Server-Sent Events for real-time notifications
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization'); const token = authHeader?.replace('Bearer ', '') || ''; const user = getUserFromToken(token);
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Server-Sent Eventsのレスポンスヘッダーを設定
    const headers = new Headers({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    // ReadableStreamを作成してSSE接続を管理
    const stream = new ReadableStream({
      start(controller) {
        // 接続確立時の処理
        const connectionId = `sse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // 初期メッセージを送信
        const initialMessage = `data: ${JSON.stringify({
          type: 'connected',
          connectionId,
          timestamp: new Date().toISOString()
        })}\n\n`;
        controller.enqueue(new TextEncoder().encode(initialMessage));

        // 定期的にハートビートを送信
        const heartbeatInterval = setInterval(() => {
          try {
            const heartbeat = `data: ${JSON.stringify({
              type: 'heartbeat',
              timestamp: new Date().toISOString()
            })}\n\n`;
            controller.enqueue(new TextEncoder().encode(heartbeat));
          } catch (error) {
            console.error('Heartbeat error:', error);
            clearInterval(heartbeatInterval);
          }
        }, 30000); // 30秒間隔

        // 通知監視の開始（実際の実装では外部イベントシステムと連携）
        const notificationChecker = setInterval(async () => {
          try {
            // 最新の未読通知をチェック
            const { notifications } = await notificationDB.getNotificationsByUserId(user.id, {
              status: 'unread',
              limit: 5
            });

            // 新しい通知がある場合、送信
            if (notifications.length > 0) {
              const message = `data: ${JSON.stringify({
                type: 'notifications',
                data: notifications,
                timestamp: new Date().toISOString()
              })}\n\n`;
              controller.enqueue(new TextEncoder().encode(message));
            }

            // 未読数も送信
            const unreadCount = await notificationDB.getUnreadCount(user.id);
            const countMessage = `data: ${JSON.stringify({
              type: 'unread_count',
              count: unreadCount,
              timestamp: new Date().toISOString()
            })}\n\n`;
            controller.enqueue(new TextEncoder().encode(countMessage));
          } catch (error) {
            console.error('Notification check error:', error);
          }
        }, 10000); // 10秒間隔

        // 接続終了時のクリーンアップ
        const cleanup = () => {
          clearInterval(heartbeatInterval);
          clearInterval(notificationChecker);
          try {
            controller.close();
          } catch (error) {
            console.error('Controller close error:', error);
          }
        };

        // AbortSignalの処理
        if (request.signal) {
          request.signal.addEventListener('abort', cleanup);
        }

        // 接続情報をログ出力
        console.log(`SSE connection established for user ${user.id}: ${connectionId}`);

        // クリーンアップ用のタイマー（1時間後に自動切断）
        setTimeout(cleanup, 60 * 60 * 1000);
      },

      cancel() {
        console.log(`SSE connection cancelled for user ${user.id}`);
      }
    });

    return new Response(stream, { headers });
  } catch (error) {
    console.error('SSE connection error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}