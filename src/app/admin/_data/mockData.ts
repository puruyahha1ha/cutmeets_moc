import type { 
  DashboardStats, 
  User, 
  ActivityLog, 
  RecruitmentPost, 
  Review, 
  Report, 
  Payment,
  SystemSettings,
  Notification
} from '../_types';

export const mockDashboardStats: DashboardStats = {
  totalUsers: {
    count: 2847,
    change: 12.5,
    trend: 'up'
  },
  totalAssistants: {
    count: 324,
    change: 8.2,
    trend: 'up'
  },
  totalBookings: {
    count: 1592,
    change: -3.1,
    trend: 'down'
  },
  totalRevenue: {
    amount: 4250000,
    change: 15.8,
    trend: 'up'
  },
  activeReports: {
    count: 23,
    urgent: 3
  }
};

export const mockUsers: User[] = [
  {
    id: '1',
    name: '田中花子',
    email: 'hanako@example.com',
    type: 'customer',
    status: 'active',
    joinedAt: '2024-01-15T10:30:00Z',
    lastActive: '2024-01-28T15:22:00Z',
    bookingsCount: 12
  },
  {
    id: '2',
    name: '佐藤美咲',
    email: 'misaki@example.com',
    type: 'assistant',
    status: 'active',
    joinedAt: '2023-12-10T09:15:00Z',
    lastActive: '2024-01-29T11:45:00Z',
    bookingsCount: 89,
    rating: 4.8,
    revenue: 450000
  },
  {
    id: '3',
    name: '山田太郎',
    email: 'taro@example.com',
    type: 'customer',
    status: 'suspended',
    joinedAt: '2024-01-20T14:20:00Z',
    lastActive: '2024-01-25T16:30:00Z',
    bookingsCount: 3
  },
  {
    id: '4',
    name: '鈴木あかり',
    email: 'akari@example.com',
    type: 'assistant',
    status: 'active',
    joinedAt: '2023-11-05T08:45:00Z',
    lastActive: '2024-01-29T10:20:00Z',
    bookingsCount: 156,
    rating: 4.9,
    revenue: 720000
  }
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    type: 'user_registration',
    description: '新しいアシスタント美容師が登録されました',
    user: {
      id: '5',
      name: '高橋さやか',
      type: 'assistant'
    },
    timestamp: '2024-01-29T16:45:00Z'
  },
  {
    id: '2',
    type: 'booking_created',
    description: '新しい予約が作成されました',
    user: {
      id: '1',
      name: '田中花子',
      type: 'customer'
    },
    timestamp: '2024-01-29T15:30:00Z'
  },
  {
    id: '3',
    type: 'payment_completed',
    description: '決済が完了しました（¥8,500）',
    user: {
      id: '1',
      name: '田中花子',
      type: 'customer'
    },
    timestamp: '2024-01-29T14:20:00Z'
  },
  {
    id: '4',
    type: 'report_filed',
    description: '不適切なコンテンツが報告されました',
    user: {
      id: '3',
      name: '山田太郎',
      type: 'customer'
    },
    timestamp: '2024-01-29T13:15:00Z'
  }
];

export const mockRecruitmentPosts: RecruitmentPost[] = [
  {
    id: '1',
    title: '渋谷エリアでカラー専門アシスタント募集',
    description: 'カラーリング技術に特化したアシスタント美容師を募集しています。',
    authorId: '101',
    authorName: 'HAIR SALON TOKYO',
    status: 'active',
    createdAt: '2024-01-25T10:00:00Z',
    expiresAt: '2024-02-25T10:00:00Z',
    applications: 12,
    reports: 0,
    category: 'カラー',
    location: '渋谷区',
    salary: {
      min: 1200,
      max: 1800,
      type: 'hourly'
    }
  },
  {
    id: '2',
    title: '銀座サロンでスタイリスト見習い募集',
    description: '高級サロンでの経験を積みたい方を募集しています。',
    authorId: '102',
    authorName: 'Ginza Premium Salon',
    status: 'reported',
    createdAt: '2024-01-20T14:30:00Z',
    expiresAt: '2024-02-20T14:30:00Z',
    applications: 25,
    reports: 2,
    category: 'カット',
    location: '中央区',
    salary: {
      min: 1500,
      max: 2200,
      type: 'hourly'
    }
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    assistantId: '2',
    assistantName: '佐藤美咲',
    customerId: '1',
    customerName: '田中花子',
    rating: 5,
    comment: 'とても丁寧で技術も素晴らしかったです。また利用したいと思います。',
    createdAt: '2024-01-28T16:00:00Z',
    status: 'published',
    reports: 0,
    helpful: 8
  },
  {
    id: '2',
    assistantId: '4',
    assistantName: '鈴木あかり',
    customerId: '3',
    customerName: '山田太郎',
    rating: 1,
    comment: 'サービスに不満があります。',
    createdAt: '2024-01-25T12:30:00Z',
    status: 'flagged',
    reports: 3,
    helpful: 0
  }
];

export const mockReports: Report[] = [
  {
    id: '1',
    type: 'post',
    targetId: '2',
    targetType: 'recruitment_post',
    reporterId: '3',
    reporterName: '山田太郎',
    reason: 'inappropriate',
    description: '募集内容に虚偽の情報が含まれています。',
    createdAt: '2024-01-29T13:15:00Z',
    status: 'pending',
    priority: 'high'
  },
  {
    id: '2',
    type: 'user',
    targetId: '2',
    targetType: 'assistant',
    reporterId: '1',
    reporterName: '田中花子',
    reason: 'harassment',
    description: '不適切なメッセージを送信されました。',
    createdAt: '2024-01-28T18:45:00Z',
    status: 'investigating',
    priority: 'urgent',
    assignedTo: 'admin1'
  },
  {
    id: '3',
    type: 'review',
    targetId: '2',
    targetType: 'review',
    reporterId: '4',
    reporterName: '鈴木あかり',
    reason: 'fake',
    description: '虚偽のレビューです。',
    createdAt: '2024-01-27T14:20:00Z',
    status: 'resolved',
    priority: 'medium'
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    bookingId: 'booking_001',
    customerId: '1',
    customerName: '田中花子',
    assistantId: '2',
    assistantName: '佐藤美咲',
    amount: 8500,
    platformFee: 850,
    assistantEarnings: 7650,
    status: 'completed',
    method: 'credit_card',
    createdAt: '2024-01-29T14:20:00Z',
    processedAt: '2024-01-29T14:21:00Z'
  },
  {
    id: '2',
    bookingId: 'booking_002',
    customerId: '3',
    customerName: '山田太郎',
    assistantId: '4',
    assistantName: '鈴木あかり',
    amount: 12000,
    platformFee: 1200,
    assistantEarnings: 10800,
    status: 'disputed',
    method: 'credit_card',
    createdAt: '2024-01-28T11:30:00Z',
    processedAt: '2024-01-28T11:31:00Z',
    refundRequested: true
  }
];

export const mockSystemSettings: SystemSettings = {
  platformFeeRate: 10,
  minBookingAmount: 1000,
  maxBookingAmount: 50000,
  maintenanceMode: false,
  registrationEnabled: true,
  paymentProcessingEnabled: true,
  emailNotificationsEnabled: true,
  smsNotificationsEnabled: false,
  autoApprovalEnabled: false,
  maxReportsBeforeAutoSuspension: 5
};

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: '新しい報告',
    message: '新しい報告が3件あります',
    createdAt: '2024-01-29T16:45:00Z',
    read: false,
    actionUrl: '/admin/content/reports',
    actionText: '確認する'
  },
  {
    id: '2',
    type: 'success',
    title: 'システムメンテナンス完了',
    message: 'システムメンテナンスが正常に完了しました',
    createdAt: '2024-01-29T15:30:00Z',
    read: false
  },
  {
    id: '3',
    type: 'info',
    title: '月次レポート準備完了',
    message: '1月の月次レポートが生成されました',
    createdAt: '2024-01-29T10:00:00Z',
    read: true,
    actionUrl: '/admin/reports/monthly',
    actionText: 'ダウンロード'
  }
];