// WebSocket通知配信サービス
import { Notification } from './notification-db';

type WebSocketConnection = {
  id: string;
  userId: string;
  socket: WebSocket;
  lastActivity: Date;
};

/**
 * WebSocket通知配信サービス
 * リアルタイム通知を管理・配信する
 */
export class WebSocketNotificationService {
  private static instance: WebSocketNotificationService;
  private connections = new Map<string, WebSocketConnection>();
  private userConnections = new Map<string, Set<string>>();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.startHeartbeat();
  }

  static getInstance(): WebSocketNotificationService {
    if (!WebSocketNotificationService.instance) {
      WebSocketNotificationService.instance = new WebSocketNotificationService();
    }
    return WebSocketNotificationService.instance;
  }

  /**
   * WebSocket接続を追加
   */
  addConnection(connectionId: string, userId: string, socket: WebSocket) {
    const connection: WebSocketConnection = {
      id: connectionId,
      userId,
      socket,
      lastActivity: new Date()
    };

    this.connections.set(connectionId, connection);

    // ユーザー別接続マップに追加
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId)!.add(connectionId);

    // 接続時のイベントリスナー設定
    socket.addEventListener('close', () => {
      this.removeConnection(connectionId);
    });

    socket.addEventListener('error', () => {
      this.removeConnection(connectionId);
    });

    socket.addEventListener('message', (event) => {
      this.handleMessage(connectionId, event.data);
    });

    console.log(`WebSocket connection added: ${connectionId} for user ${userId}`);
  }

  /**
   * WebSocket接続を削除
   */
  removeConnection(connectionId: string) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    const { userId } = connection;

    // 接続マップから削除
    this.connections.delete(connectionId);

    // ユーザー別接続マップから削除
    const userConnSet = this.userConnections.get(userId);
    if (userConnSet) {
      userConnSet.delete(connectionId);
      if (userConnSet.size === 0) {
        this.userConnections.delete(userId);
      }
    }

    console.log(`WebSocket connection removed: ${connectionId} for user ${userId}`);
  }

  /**
   * WebSocketメッセージの処理
   */
  private handleMessage(connectionId: string, message: string) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    connection.lastActivity = new Date();

    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'ping':
          this.sendToConnection(connectionId, { type: 'pong', timestamp: Date.now() });
          break;
        case 'subscribe':
          // 特定の通知タイプの購読
          break;
        case 'unsubscribe':
          // 購読解除
          break;
        default:
          console.log(`Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  /**
   * 特定の接続に メッセージを送信
   */
  private sendToConnection(connectionId: string, data: any) {
    const connection = this.connections.get(connectionId);
    if (!connection || connection.socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      connection.socket.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Failed to send message to connection ${connectionId}:`, error);
      this.removeConnection(connectionId);
      return false;
    }
  }

  /**
   * 特定のユーザーに通知を送信
   */
  sendNotificationToUser(userId: string, notification: Notification) {
    const userConnections = this.userConnections.get(userId);
    if (!userConnections || userConnections.size === 0) {
      console.log(`No active connections for user ${userId}`);
      return false;
    }

    const message = {
      type: 'notification',
      data: notification
    };

    let sentCount = 0;
    for (const connectionId of userConnections) {
      if (this.sendToConnection(connectionId, message)) {
        sentCount++;
      }
    }

    console.log(`Sent notification to ${sentCount} connections for user ${userId}`);
    return sentCount > 0;
  }

  /**
   * 複数のユーザーに通知を送信
   */
  sendNotificationToUsers(userIds: string[], notification: Notification) {
    const results = new Map<string, boolean>();
    
    for (const userId of userIds) {
      results.set(userId, this.sendNotificationToUser(userId, notification));
    }

    return results;
  }

  /**
   * 全接続に通知を送信（システム全体通知）
   */
  broadcastNotification(notification: Notification) {
    const message = {
      type: 'notification',
      data: notification
    };

    let sentCount = 0;
    for (const [connectionId, connection] of this.connections) {
      if (this.sendToConnection(connectionId, message)) {
        sentCount++;
      }
    }

    console.log(`Broadcast notification to ${sentCount} connections`);
    return sentCount;
  }

  /**
   * 未読通知数の更新を送信
   */
  sendUnreadCountUpdate(userId: string, unreadCount: number) {
    const userConnections = this.userConnections.get(userId);
    if (!userConnections || userConnections.size === 0) {
      return false;
    }

    const message = {
      type: 'unread_count_update',
      data: { unreadCount }
    };

    let sentCount = 0;
    for (const connectionId of userConnections) {
      if (this.sendToConnection(connectionId, message)) {
        sentCount++;
      }
    }

    return sentCount > 0;
  }

  /**
   * 接続状態の確認とクリーンアップ
   */
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      const now = new Date();
      const timeout = 30 * 60 * 1000; // 30分

      const connectionsToRemove: string[] = [];

      for (const [connectionId, connection] of this.connections) {
        // 非アクティブな接続をチェック
        if (now.getTime() - connection.lastActivity.getTime() > timeout) {
          connectionsToRemove.push(connectionId);
          continue;
        }

        // ping送信
        if (connection.socket.readyState === WebSocket.OPEN) {
          this.sendToConnection(connectionId, { type: 'ping', timestamp: Date.now() });
        } else {
          connectionsToRemove.push(connectionId);
        }
      }

      // 古い接続を削除
      for (const connectionId of connectionsToRemove) {
        this.removeConnection(connectionId);
      }

      console.log(`Active WebSocket connections: ${this.connections.size}`);
    }, 60000); // 1分間隔
  }

  /**
   * サービス停止
   */
  shutdown() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // すべての接続を閉じる
    for (const [connectionId, connection] of this.connections) {
      try {
        connection.socket.close();
      } catch (error) {
        console.error(`Error closing connection ${connectionId}:`, error);
      }
    }

    this.connections.clear();
    this.userConnections.clear();
  }

  /**
   * 統計情報を取得
   */
  getStats() {
    return {
      totalConnections: this.connections.size,
      activeUsers: this.userConnections.size,
      averageConnectionsPerUser: this.connections.size / Math.max(this.userConnections.size, 1)
    };
  }
}

// シングルトンインスタンス
export const webSocketService = WebSocketNotificationService.getInstance();