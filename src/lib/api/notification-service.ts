// 通知送信サービス
import { notificationDB, NotificationType, NotificationData } from './notification-db';

export interface NotificationPayload {
  title: string;
  message: string;
  data?: NotificationData;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * 通知送信サービスクラス
 * 各システムイベントから通知を簡単に作成・送信するためのヘルパー
 */
export class NotificationService {
  /**
   * 新規応募通知を送信
   */
  static async sendApplicationNotification(
    assistantId: string,
    applicantId: string,
    applicantName: string,
    applicationId: string,
    recruitmentPostId: string
  ) {
    return await notificationDB.sendNotification(assistantId, 'application_new', {
      title: '新しい応募があります',
      message: `${applicantName}さんがあなたの求人に応募しました`,
      notificationData: {
        applicationId,
        recruitmentPostId,
        applicantId,
        applicantName,
        actionUrl: `/recruitment/applications/${applicationId}`
      },
      priority: 'high'
    });
  }

  /**
   * 応募承認通知を送信
   */
  static async sendApplicationApprovedNotification(
    applicantId: string,
    assistantName: string,
    applicationId: string,
    recruitmentPostId: string
  ) {
    return await notificationDB.sendNotification(applicantId, 'application_approved', {
      title: '応募が承認されました',
      message: `${assistantName}さんがあなたの応募を承認しました`,
      notificationData: {
        applicationId,
        recruitmentPostId,
        actionUrl: `/applications/${applicationId}`
      },
      priority: 'high'
    });
  }

  /**
   * 応募拒否通知を送信
   */
  static async sendApplicationRejectedNotification(
    applicantId: string,
    assistantName: string,
    applicationId: string,
    recruitmentPostId: string
  ) {
    return await notificationDB.sendNotification(applicantId, 'application_rejected', {
      title: '応募の結果について',
      message: `${assistantName}さんからの選考結果をお知らせします`,
      notificationData: {
        applicationId,
        recruitmentPostId,
        actionUrl: `/applications/${applicationId}`
      },
      priority: 'medium'
    });
  }

  /**
   * 予約リマインダー通知を送信
   */
  static async sendBookingReminderNotification(
    customerId: string,
    bookingId: string,
    bookingDate: string,
    bookingTime: string,
    serviceName: string,
    hoursBeforeBooking: number = 24
  ) {
    const timeText = hoursBeforeBooking === 24 ? '明日' : 
                    hoursBeforeBooking === 1 ? '1時間後' : 
                    `${hoursBeforeBooking}時間後`;

    return await notificationDB.sendNotification(customerId, 'booking_reminder', {
      title: '予約リマインダー',
      message: `${timeText}${bookingTime}から${serviceName}の予約があります`,
      notificationData: {
        bookingId,
        bookingDate,
        bookingTime,
        serviceName,
        actionUrl: `/bookings/${bookingId}`
      },
      priority: 'medium'
    });
  }

  /**
   * 予約確定通知を送信
   */
  static async sendBookingConfirmedNotification(
    customerId: string,
    bookingId: string,
    bookingDate: string,
    bookingTime: string,
    serviceName: string,
    assistantName: string
  ) {
    return await notificationDB.sendNotification(customerId, 'booking_confirmed', {
      title: '予約が確定しました',
      message: `${assistantName}さんとの${bookingDate} ${bookingTime}からの予約が確定しました`,
      notificationData: {
        bookingId,
        bookingDate,
        bookingTime,
        serviceName,
        actionUrl: `/bookings/${bookingId}`
      },
      priority: 'high'
    });
  }

  /**
   * 予約キャンセル通知を送信
   */
  static async sendBookingCancelledNotification(
    userId: string,
    bookingId: string,
    bookingDate: string,
    bookingTime: string,
    serviceName: string,
    cancelledBy: 'customer' | 'assistant'
  ) {
    const message = cancelledBy === 'customer' 
      ? '予約がキャンセルされました'
      : 'アシスタントにより予約がキャンセルされました';

    return await notificationDB.sendNotification(userId, 'booking_cancelled', {
      title: '予約のキャンセルについて',
      message: `${bookingDate} ${bookingTime}からの${serviceName}の予約が${message}`,
      notificationData: {
        bookingId,
        bookingDate,
        bookingTime,
        serviceName,
        actionUrl: `/bookings/${bookingId}`
      },
      priority: 'high'
    });
  }

  /**
   * 決済完了通知を送信
   */
  static async sendPaymentCompletedNotification(
    customerId: string,
    paymentId: string,
    amount: number,
    serviceName: string,
    bookingId?: string
  ) {
    return await notificationDB.sendNotification(customerId, 'payment_completed', {
      title: '決済が完了しました',
      message: `${serviceName}の料金 ¥${amount.toLocaleString()}の決済が完了しました`,
      notificationData: {
        paymentId,
        amount,
        bookingId,
        actionUrl: bookingId ? `/bookings/${bookingId}` : `/payments/${paymentId}`
      },
      priority: 'medium'
    });
  }

  /**
   * 決済失敗通知を送信
   */
  static async sendPaymentFailedNotification(
    customerId: string,
    paymentId: string,
    amount: number,
    serviceName: string,
    bookingId?: string
  ) {
    return await notificationDB.sendNotification(customerId, 'payment_failed', {
      title: '決済が失敗しました',
      message: `${serviceName}の料金 ¥${amount.toLocaleString()}の決済に失敗しました。再度お試しください。`,
      notificationData: {
        paymentId,
        amount,
        bookingId,
        actionUrl: bookingId ? `/bookings/${bookingId}` : `/payments/${paymentId}`
      },
      priority: 'high'
    });
  }

  /**
   * レビュー依頼通知を送信
   */
  static async sendReviewRequestNotification(
    customerId: string,
    bookingId: string,
    assistantName: string,
    serviceName: string
  ) {
    return await notificationDB.sendNotification(customerId, 'review_request', {
      title: 'レビューをお聞かせください',
      message: `${assistantName}さんの${serviceName}はいかがでしたか？ぜひレビューをお聞かせください。`,
      notificationData: {
        bookingId,
        actionUrl: `/bookings/${bookingId}/review`
      },
      priority: 'low'
    });
  }

  /**
   * 新着レビュー通知を送信
   */
  static async sendNewReviewNotification(
    assistantId: string,
    reviewId: string,
    reviewerId: string,
    reviewerName: string,
    rating: number,
    bookingId: string
  ) {
    return await notificationDB.sendNotification(assistantId, 'review_received', {
      title: '新しいレビューが投稿されました',
      message: `${reviewerName}さんから${rating}つ星のレビューが投稿されました`,
      notificationData: {
        reviewId,
        reviewerId,
        reviewerName,
        rating,
        bookingId,
        actionUrl: `/reviews/${reviewId}`
      },
      priority: 'medium'
    });
  }

  /**
   * レビュー返信通知を送信
   */
  static async sendReviewResponseNotification(
    customerId: string,
    reviewId: string,
    assistantName: string,
    bookingId: string
  ) {
    return await notificationDB.sendNotification(customerId, 'review_response', {
      title: 'レビューに返信がありました',
      message: `${assistantName}さんがあなたのレビューに返信しました`,
      notificationData: {
        reviewId,
        bookingId,
        actionUrl: `/reviews/${reviewId}`
      },
      priority: 'low'
    });
  }

  /**
   * システムお知らせ通知を送信（全ユーザー向け）
   */
  static async sendSystemAnnouncementNotification(
    userIds: string[],
    title: string,
    message: string,
    actionUrl?: string
  ) {
    const notifications = [];
    for (const userId of userIds) {
      const notification = await notificationDB.sendNotification(userId, 'system_announcement', {
        title,
        message,
        notificationData: {
          actionUrl
        },
        priority: 'medium'
      });
      notifications.push(notification);
    }
    return notifications;
  }

  /**
   * メンテナンス通知を送信
   */
  static async sendMaintenanceNotification(
    userIds: string[],
    startTime: string,
    endTime: string,
    description?: string
  ) {
    const title = 'メンテナンスのお知らせ';
    const message = `${startTime}から${endTime}まで、システムメンテナンスを実施します。${description || 'サービスが一時的に利用できなくなります。'}`;

    const notifications = [];
    for (const userId of userIds) {
      const notification = await notificationDB.sendNotification(userId, 'system_maintenance', {
        title,
        message,
        priority: 'high'
      });
      notifications.push(notification);
    }
    return notifications;
  }

  /**
   * プロフィール更新通知を送信
   */
  static async sendProfileUpdateNotification(
    userId: string,
    updateType: string
  ) {
    const messages = {
      'profile_picture': 'プロフィール写真が更新されました',
      'basic_info': '基本情報が更新されました',
      'portfolio': 'ポートフォリオが更新されました',
      'availability': '空き時間が更新されました',
      'services': 'サービス内容が更新されました'
    };

    const message = messages[updateType as keyof typeof messages] || 'プロフィールが更新されました';

    return await notificationDB.sendNotification(userId, 'profile_update', {
      title: 'プロフィール更新完了',
      message,
      notificationData: {
        actionUrl: '/profile'
      },
      priority: 'low'
    });
  }

  /**
   * カスタム通知を送信
   */
  static async sendCustomNotification(
    userId: string,
    type: NotificationType,
    payload: NotificationPayload
  ) {
    return await notificationDB.sendNotification(userId, type, payload);
  }
}