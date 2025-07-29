// 通知システム用データベースモデル

export interface Notification {
  id: string;
  userId: string; // 通知を受け取るユーザーID
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData; // 通知タイプに応じた追加データ
  priority: 'high' | 'medium' | 'low';
  status: 'unread' | 'read' | 'archived';
  isDeleted: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'application_new'        // 新規応募
  | 'application_approved'   // 応募承認
  | 'application_rejected'   // 応募拒否
  | 'booking_reminder'       // 予約リマインダー
  | 'booking_confirmed'      // 予約確定
  | 'booking_cancelled'      // 予約キャンセル
  | 'payment_completed'      // 決済完了
  | 'payment_failed'         // 決済失敗
  | 'review_request'         // レビュー依頼
  | 'review_received'        // 新着レビュー
  | 'review_response'        // レビュー返信
  | 'system_announcement'    // システムお知らせ
  | 'system_maintenance'     // メンテナンス通知
  | 'profile_update'         // プロフィール更新通知

export interface NotificationData {
  // 応募関連
  applicationId?: string;
  recruitmentPostId?: string;
  applicantId?: string;
  applicantName?: string;
  
  // 予約関連
  bookingId?: string;
  bookingDate?: string;
  bookingTime?: string;
  serviceName?: string;
  
  // 決済関連
  paymentId?: string;
  amount?: number;
  
  // レビュー関連
  reviewId?: string;
  reviewerId?: string;
  reviewerName?: string;
  rating?: number;
  
  // その他
  actionUrl?: string; // 通知クリック時の遷移先
  imageUrl?: string;  // 通知に表示する画像
  metadata?: Record<string, any>; // その他のメタデータ
}

export interface NotificationPreference {
  id: string;
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  notificationTypes: {
    [key in NotificationType]: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
  };
  quietHours?: {
    enabled: boolean;
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
  };
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  type: NotificationType;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  variables: string[]; // 使用可能な変数リスト
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class NotificationDatabase {
  private notifications: Map<string, Notification> = new Map();
  private userNotifications: Map<string, Set<string>> = new Map();
  private preferences: Map<string, NotificationPreference> = new Map();
  private emailTemplates: Map<NotificationType, EmailTemplate> = new Map();

  constructor() {
    this.initializeMockData();
    this.initializeEmailTemplates();
  }

  private initializeMockData() {
    // モックデータの初期化
    const mockNotifications: Notification[] = [
      {
        id: 'notif_1',
        userId: 'user_1',
        type: 'application_new',
        title: '新しい応募があります',
        message: '田中太郎さんがあなたの求人に応募しました',
        data: {
          applicationId: 'app_1',
          recruitmentPostId: 'recruit_1',
          applicantId: 'user_2',
          applicantName: '田中太郎',
          actionUrl: '/recruitment/applications/app_1'
        },
        priority: 'high',
        status: 'unread',
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'notif_2',
        userId: 'user_2',
        type: 'booking_reminder',
        title: '明日の予約リマインダー',
        message: '明日14:00からカット＆カラーの予約があります',
        data: {
          bookingId: 'booking_1',
          bookingDate: '2025-02-01',
          bookingTime: '14:00',
          serviceName: 'カット＆カラー',
          actionUrl: '/bookings/booking_1'
        },
        priority: 'medium',
        status: 'unread',
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    mockNotifications.forEach(notification => {
      this.notifications.set(notification.id, notification);
      this.addToUserIndex(notification);
    });

    // デフォルト通知設定
    const defaultPreference: NotificationPreference = {
      id: 'pref_1',
      userId: 'user_1',
      emailEnabled: true,
      pushEnabled: false,
      inAppEnabled: true,
      notificationTypes: this.getDefaultNotificationTypeSettings(),
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.preferences.set(defaultPreference.userId, defaultPreference);
  }

  private getDefaultNotificationTypeSettings() {
    const types: NotificationType[] = [
      'application_new', 'application_approved', 'application_rejected',
      'booking_reminder', 'booking_confirmed', 'booking_cancelled',
      'payment_completed', 'payment_failed',
      'review_request', 'review_received', 'review_response',
      'system_announcement', 'system_maintenance', 'profile_update'
    ];

    const settings: any = {};
    types.forEach(type => {
      settings[type] = {
        email: true,
        push: false,
        inApp: true
      };
    });
    return settings;
  }

  private initializeEmailTemplates() {
    const templates: Array<[NotificationType, Partial<EmailTemplate>]> = [
      ['application_new', {
        subject: '新しい応募があります - {{applicantName}}',
        bodyHtml: `
          <h2>新しい応募があります</h2>
          <p>{{applicantName}}さんがあなたの求人に応募しました。</p>
          <p>詳細を確認するには<a href="{{actionUrl}}">こちら</a>をクリックしてください。</p>
        `,
        bodyText: '新しい応募があります\n\n{{applicantName}}さんがあなたの求人に応募しました。',
        variables: ['applicantName', 'actionUrl']
      }],
      ['booking_reminder', {
        subject: '予約リマインダー - {{bookingDate}} {{bookingTime}}',
        bodyHtml: `
          <h2>予約リマインダー</h2>
          <p>{{bookingDate}} {{bookingTime}}から{{serviceName}}の予約があります。</p>
          <p>詳細は<a href="{{actionUrl}}">こちら</a>から確認できます。</p>
        `,
        bodyText: '予約リマインダー\n\n{{bookingDate}} {{bookingTime}}から{{serviceName}}の予約があります。',
        variables: ['bookingDate', 'bookingTime', 'serviceName', 'actionUrl']
      }]
    ];

    templates.forEach(([type, template], index) => {
      this.emailTemplates.set(type, {
        id: `template_${index + 1}`,
        type,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...template
      } as EmailTemplate);
    });
  }

  private addToUserIndex(notification: Notification) {
    if (!this.userNotifications.has(notification.userId)) {
      this.userNotifications.set(notification.userId, new Set());
    }
    this.userNotifications.get(notification.userId)!.add(notification.id);
  }

  // 通知作成
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.notifications.set(newNotification.id, newNotification);
    this.addToUserIndex(newNotification);

    return newNotification;
  }

  // ユーザーの通知取得
  async getNotificationsByUserId(
    userId: string, 
    options?: {
      status?: 'unread' | 'read' | 'archived';
      type?: NotificationType;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ notifications: Notification[]; total: number }> {
    const userNotifIds = this.userNotifications.get(userId) || new Set();
    let notifications = Array.from(userNotifIds)
      .map(id => this.notifications.get(id)!)
      .filter(n => !n.isDeleted)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // フィルタリング
    if (options?.status) {
      notifications = notifications.filter(n => n.status === options.status);
    }
    if (options?.type) {
      notifications = notifications.filter(n => n.type === options.type);
    }

    const total = notifications.length;

    // ページネーション
    if (options?.offset !== undefined) {
      notifications = notifications.slice(options.offset);
    }
    if (options?.limit !== undefined) {
      notifications = notifications.slice(0, options.limit);
    }

    return { notifications, total };
  }

  // 通知を既読にする
  async markAsRead(notificationId: string): Promise<Notification | null> {
    const notification = this.notifications.get(notificationId);
    if (!notification) return null;

    notification.status = 'read';
    notification.readAt = new Date().toISOString();
    notification.updatedAt = new Date().toISOString();

    return notification;
  }

  // 複数の通知を既読にする
  async markAllAsRead(userId: string): Promise<number> {
    const { notifications } = await this.getNotificationsByUserId(userId, { status: 'unread' });
    let count = 0;

    for (const notification of notifications) {
      await this.markAsRead(notification.id);
      count++;
    }

    return count;
  }

  // 通知をアーカイブ
  async archiveNotification(notificationId: string): Promise<Notification | null> {
    const notification = this.notifications.get(notificationId);
    if (!notification) return null;

    notification.status = 'archived';
    notification.updatedAt = new Date().toISOString();

    return notification;
  }

  // 通知を削除（論理削除）
  async deleteNotification(notificationId: string): Promise<boolean> {
    const notification = this.notifications.get(notificationId);
    if (!notification) return false;

    notification.isDeleted = true;
    notification.updatedAt = new Date().toISOString();

    return true;
  }

  // 未読通知数を取得
  async getUnreadCount(userId: string): Promise<number> {
    const { total } = await this.getNotificationsByUserId(userId, { status: 'unread' });
    return total;
  }

  // 通知設定を取得
  async getPreferences(userId: string): Promise<NotificationPreference | null> {
    return this.preferences.get(userId) || null;
  }

  // 通知設定を更新
  async updatePreferences(
    userId: string, 
    updates: Partial<NotificationPreference>
  ): Promise<NotificationPreference> {
    let preference = this.preferences.get(userId);
    
    if (!preference) {
      // 新規作成
      preference = {
        id: `pref_${Date.now()}`,
        userId,
        emailEnabled: true,
        pushEnabled: false,
        inAppEnabled: true,
        notificationTypes: this.getDefaultNotificationTypeSettings(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...updates
      };
    } else {
      // 更新
      Object.assign(preference, updates, {
        updatedAt: new Date().toISOString()
      });
    }

    this.preferences.set(userId, preference);
    return preference;
  }

  // メールテンプレートを取得
  async getEmailTemplate(type: NotificationType): Promise<EmailTemplate | null> {
    return this.emailTemplates.get(type) || null;
  }

  // 通知を送信（実際の送信処理のシミュレーション）
  async sendNotification(
    userId: string,
    type: NotificationType,
    data: {
      title: string;
      message: string;
      notificationData?: NotificationData;
      priority?: 'high' | 'medium' | 'low';
    }
  ): Promise<Notification> {
    const preference = await this.getPreferences(userId);
    
    // アプリ内通知を作成
    const notification = await this.createNotification({
      userId,
      type,
      title: data.title,
      message: data.message,
      data: data.notificationData,
      priority: data.priority || 'medium',
      status: 'unread',
      isDeleted: false
    });

    // メール送信のシミュレーション
    if (preference?.emailEnabled && preference.notificationTypes[type]?.email) {
      const template = await this.getEmailTemplate(type);
      if (template) {
        console.log(`Email would be sent to user ${userId} with template ${template.id}`);
      }
    }

    // プッシュ通知のシミュレーション
    if (preference?.pushEnabled && preference.notificationTypes[type]?.push) {
      console.log(`Push notification would be sent to user ${userId}`);
    }

    return notification;
  }
}

// シングルトンインスタンス
export const notificationDB = new NotificationDatabase();