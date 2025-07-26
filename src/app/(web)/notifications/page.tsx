'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_components/providers/AuthProvider';

interface Notification {
    id: string;
    type: 'booking' | 'message' | 'review' | 'system' | 'promotion';
    title: string;
    content: string;
    timestamp: string;
    read: boolean;
    actionUrl?: string;
    actionText?: string;
    icon: string;
    priority: 'high' | 'medium' | 'low';
    relatedData?: {
        assistantName?: string;
        bookingId?: string;
        messageId?: string;
    };
}

export default function NotificationsPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread' | 'booking' | 'message' | 'review' | 'system' | 'promotion'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

    // 未認証の場合はリダイレクト
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (user) {
            // モック通知データ
            const mockNotifications: Notification[] = [
                {
                    id: 'notif_1',
                    type: 'booking',
                    title: '予約が確定されました',
                    content: '田中 美香さんからの予約確認が完了しました。1月16日 14:00〜のカットの予約です。',
                    timestamp: '2024-01-15T15:30:00Z',
                    read: false,
                    actionUrl: '/booking/confirmation/booking_123',
                    actionText: '予約詳細を見る',
                    icon: '📅',
                    priority: 'high',
                    relatedData: {
                        assistantName: '田中 美香',
                        bookingId: 'booking_123'
                    }
                },
                {
                    id: 'notif_2',
                    type: 'message',
                    title: '新しいメッセージ',
                    content: '佐藤 リナさんからメッセージが届きました。「カラーの相談についてお返事します」',
                    timestamp: '2024-01-15T14:20:00Z',
                    read: false,
                    actionUrl: '/messages',
                    actionText: 'メッセージを見る',
                    icon: '💬',
                    priority: 'medium',
                    relatedData: {
                        assistantName: '佐藤 リナ',
                        messageId: 'msg_456'
                    }
                },
                {
                    id: 'notif_3',
                    type: 'review',
                    title: 'レビューへの返信',
                    content: '鈴木 優子さんがあなたのレビューに返信しました。',
                    timestamp: '2024-01-15T10:15:00Z',
                    read: true,
                    actionUrl: '/reviews/assistant_3',
                    actionText: 'レビューを見る',
                    icon: '⭐',
                    priority: 'low',
                    relatedData: {
                        assistantName: '鈴木 優子'
                    }
                },
                {
                    id: 'notif_4',
                    type: 'system',
                    title: 'アプリの更新',
                    content: '新機能「おすすめアシスタント」が追加されました。あなたにぴったりの美容師を見つけましょう。',
                    timestamp: '2024-01-14T16:00:00Z',
                    read: true,
                    actionUrl: '/recommendations',
                    actionText: 'おすすめを見る',
                    icon: '🆕',
                    priority: 'medium'
                },
                {
                    id: 'notif_5',
                    type: 'promotion',
                    title: '特別キャンペーン開始！',
                    content: '新規ユーザー限定：初回予約20%OFF！お気に入りのアシスタント美容師を見つけて、お得に利用しましょう。',
                    timestamp: '2024-01-14T09:00:00Z',
                    read: true,
                    actionUrl: '/search',
                    actionText: '美容師を探す',
                    icon: '🎉',
                    priority: 'low'
                },
                {
                    id: 'notif_6',
                    type: 'booking',
                    title: '予約リマインダー',
                    content: '明日14:00からの予約があります。田中 美香さんとのカットの予約です。',
                    timestamp: '2024-01-14T18:00:00Z',
                    read: true,
                    actionUrl: '/booking/confirmation/booking_123',
                    actionText: '予約を確認',
                    icon: '🔔',
                    priority: 'high',
                    relatedData: {
                        assistantName: '田中 美香',
                        bookingId: 'booking_123'
                    }
                }
            ];

            setNotifications(mockNotifications);
            setIsLoading(false);
        }
    }, [user]);

    const getFilteredNotifications = () => {
        return notifications.filter(notification => {
            if (filter === 'all') return true;
            if (filter === 'unread') return !notification.read;
            return notification.type === filter;
        });
    };

    const markAsRead = (notificationId: string) => {
        setNotifications(prev => prev.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
        ));
    };

    const markAllAsRead = async () => {
        setIsMarkingAllRead(true);
        
        // モック処理
        setTimeout(() => {
            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
            setIsMarkingAllRead(false);
        }, 500);
    };

    const deleteNotification = (notificationId: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        if (diffMinutes < 60) {
            return `${diffMinutes}分前`;
        } else if (diffHours < 24) {
            return `${diffHours}時間前`;
        } else if (diffDays === 1) {
            return '昨日';
        } else if (diffDays < 7) {
            return `${diffDays}日前`;
        } else {
            return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
        }
    };

    const getTypeText = (type: Notification['type']) => {
        switch (type) {
            case 'booking': return '予約';
            case 'message': return 'メッセージ';
            case 'review': return 'レビュー';
            case 'system': return 'システム';
            case 'promotion': return 'キャンペーン';
            default: return type;
        }
    };

    const getTypeColor = (type: Notification['type']) => {
        switch (type) {
            case 'booking': return 'bg-blue-100 text-blue-800';
            case 'message': return 'bg-green-100 text-green-800';
            case 'review': return 'bg-yellow-100 text-yellow-800';
            case 'system': return 'bg-gray-100 text-gray-800';
            case 'promotion': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityBorder = (priority: Notification['priority']) => {
        switch (priority) {
            case 'high': return 'border-l-4 border-red-500';
            case 'medium': return 'border-l-4 border-yellow-500';
            case 'low': return 'border-l-4 border-gray-300';
            default: return '';
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const filteredNotifications = getFilteredNotifications();

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/profile" className="flex items-center text-gray-600 hover:text-pink-500">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            プロフィールに戻る
                        </Link>
                        <div className="text-center">
                            <h1 className="text-lg font-semibold text-gray-900">通知</h1>
                            {unreadCount > 0 && (
                                <span className="text-xs text-pink-600">{unreadCount}件の未読</span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                disabled={isMarkingAllRead}
                                className="text-sm text-pink-500 hover:text-pink-600 font-medium disabled:opacity-50"
                            >
                                {isMarkingAllRead ? '処理中...' : 'すべて既読'}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* フィルター */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: 'all', label: 'すべて', count: notifications.length },
                            { key: 'unread', label: '未読', count: unreadCount },
                            { key: 'booking', label: '予約', count: notifications.filter(n => n.type === 'booking').length },
                            { key: 'message', label: 'メッセージ', count: notifications.filter(n => n.type === 'message').length },
                            { key: 'review', label: 'レビュー', count: notifications.filter(n => n.type === 'review').length },
                            { key: 'system', label: 'システム', count: notifications.filter(n => n.type === 'system').length },
                            { key: 'promotion', label: 'キャンペーン', count: notifications.filter(n => n.type === 'promotion').length }
                        ].map(({ key, label, count }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key as typeof filter)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center ${
                                    filter === key
                                        ? 'bg-pink-100 text-pink-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {label}
                                <span className="ml-2 bg-white px-2 py-0.5 rounded-full text-xs">
                                    {count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 通知リスト */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">通知を読み込み中...</p>
                        </div>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {filter === 'unread' ? '未読の通知がありません' : '通知がありません'}
                        </h3>
                        <p className="text-gray-600">
                            {filter === 'unread' ? 'すべての通知を既読済みです' : '新しい通知があるとここに表示されます'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-2xl shadow-sm border border-gray-200 transition-all hover:shadow-md ${
                                    !notification.read ? 'ring-2 ring-pink-100' : ''
                                } ${getPriorityBorder(notification.priority)}`}
                            >
                                <div className="p-6">
                                    <div className="flex items-start space-x-4">
                                        {/* アイコン */}
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                                                {notification.icon}
                                            </div>
                                        </div>

                                        {/* コンテンツ */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                                        {notification.title}
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                                                        {getTypeText(notification.type)}
                                                    </span>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-gray-500">
                                                        {formatTime(notification.timestamp)}
                                                    </span>
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <p className="text-gray-600 mb-3 leading-relaxed">
                                                {notification.content}
                                            </p>

                                            {/* 関連データ */}
                                            {notification.relatedData?.assistantName && (
                                                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                                            {notification.relatedData.assistantName.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {notification.relatedData.assistantName}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* アクション */}
                                            <div className="flex items-center space-x-3">
                                                {notification.actionUrl && (
                                                    <Link
                                                        href={notification.actionUrl}
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium"
                                                    >
                                                        {notification.actionText || 'アクション'}
                                                    </Link>
                                                )}
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                                                    >
                                                        既読にする
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 通知設定リンク */}
                <div className="mt-8 text-center">
                    <Link
                        href="/settings/notifications"
                        className="text-gray-600 hover:text-pink-500 text-sm font-medium transition-colors flex items-center justify-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        通知設定を変更
                    </Link>
                </div>
            </div>
        </div>
    );
}