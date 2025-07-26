'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../(web)/_components/providers/AuthProvider';

export const dynamic = 'force-dynamic';

interface DashboardStats {
    totalBookings: number;
    todayBookings: number;
    weeklyRevenue: number;
    averageRating: number;
    totalReviews: number;
    profileViews: number;
}

interface UpcomingBooking {
    id: string;
    customerName: string;
    service: string;
    date: string;
    time: string;
    duration: number;
    price: number;
    status: 'confirmed' | 'pending' | 'completed';
    customerImage?: string;
}

interface RecentMessage {
    id: string;
    customerName: string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
}

export default function AssistantDashboard() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalBookings: 0,
        todayBookings: 0,
        weeklyRevenue: 0,
        averageRating: 0,
        totalReviews: 0,
        profileViews: 0
    });
    const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);
    const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 未認証またはアシスタント以外の場合はリダイレクト
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        // TODO: ユーザータイプがassistantでない場合のチェック
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (user) {
            // モックデータを設定
            setStats({
                totalBookings: 47,
                todayBookings: 3,
                weeklyRevenue: 28500,
                averageRating: 4.8,
                totalReviews: 23,
                profileViews: 156
            });

            setUpcomingBookings([
                {
                    id: 'booking_1',
                    customerName: '山田 花子',
                    service: 'カット',
                    date: '2024-01-16',
                    time: '14:00',
                    duration: 60,
                    price: 3000,
                    status: 'confirmed'
                },
                {
                    id: 'booking_2',
                    customerName: '佐藤 美咲',
                    service: 'カット + カラー',
                    date: '2024-01-16',
                    time: '16:30',
                    duration: 120,
                    price: 5500,
                    status: 'confirmed'
                },
                {
                    id: 'booking_3',
                    customerName: '田中 由美',
                    service: 'カット',
                    date: '2024-01-17',
                    time: '10:00',
                    duration: 60,
                    price: 3000,
                    status: 'pending'
                }
            ]);

            setRecentMessages([
                {
                    id: 'msg_1',
                    customerName: '山田 花子',
                    lastMessage: '明日の予約の件で確認があります',
                    timestamp: '2024-01-15T16:30:00Z',
                    unread: true
                },
                {
                    id: 'msg_2',
                    customerName: '佐藤 美咲',
                    lastMessage: 'カラーの色について相談したいです',
                    timestamp: '2024-01-15T14:20:00Z',
                    unread: true
                },
                {
                    id: 'msg_3',
                    customerName: '鈴木 愛',
                    lastMessage: 'ありがとうございました！',
                    timestamp: '2024-01-15T12:10:00Z',
                    unread: false
                }
            ]);

            setIsLoading(false);
        }
    }, [user]);

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        if (diffMinutes < 60) {
            return `${diffMinutes}分前`;
        } else if (diffHours < 24) {
            return `${diffHours}時間前`;
        } else {
            return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', { 
            month: 'short', 
            day: 'numeric',
            weekday: 'short'
        });
    };

    const getStatusColor = (status: UpcomingBooking['status']) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: UpcomingBooking['status']) => {
        switch (status) {
            case 'confirmed': return '確定';
            case 'pending': return '確認中';
            case 'completed': return '完了';
            default: return status;
        }
    };

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
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="text-xl font-bold text-pink-500">
                                Cutmeets
                            </Link>
                            <span className="text-gray-400">|</span>
                            <h1 className="text-lg font-semibold text-gray-900">アシスタントダッシュボード</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/assistant/profile"
                                className="text-gray-600 hover:text-pink-500 transition-colors"
                            >
                                プロフィール編集
                            </Link>
                            <Link
                                href="/messages"
                                className="relative text-gray-600 hover:text-pink-500 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {recentMessages.filter(m => m.unread).length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                                )}
                            </Link>
                            <div className="text-sm text-gray-600">
                                こんにちは、{user?.name}さん
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">ダッシュボードを読み込み中...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 統計カード */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">今日の予約</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.todayBookings}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">総予約数</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">週間売上</p>
                                        <p className="text-2xl font-bold text-gray-900">¥{stats.weeklyRevenue.toLocaleString()}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">平均評価</p>
                                        <div className="flex items-center space-x-1">
                                            <span className="text-2xl font-bold text-gray-900">{stats.averageRating}</span>
                                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">レビュー数</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">プロフィール閲覧</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* 今後の予約 */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold text-gray-900">今後の予約</h2>
                                            <Link
                                                href="/assistant/bookings"
                                                className="text-pink-500 hover:text-pink-600 text-sm font-medium"
                                            >
                                                すべて見る
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {upcomingBookings.length === 0 ? (
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-600">予約がありません</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {upcomingBookings.map((booking) => (
                                                    <div key={booking.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {booking.customerName.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <h3 className="font-medium text-gray-900 truncate">
                                                                    {booking.customerName}
                                                                </h3>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                                    {getStatusText(booking.status)}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600">{booking.service}</p>
                                                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                                                <span>📅 {formatDate(booking.date)}</span>
                                                                <span>🕐 {booking.time}</span>
                                                                <span>💰 ¥{booking.price.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                        <Link
                                                            href={`/assistant/bookings/${booking.id}`}
                                                            className="text-pink-500 hover:text-pink-600 text-sm font-medium"
                                                        >
                                                            詳細
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 最近のメッセージ */}
                            <div>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold text-gray-900">最近のメッセージ</h2>
                                            <Link
                                                href="/messages"
                                                className="text-pink-500 hover:text-pink-600 text-sm font-medium"
                                            >
                                                すべて見る
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {recentMessages.length === 0 ? (
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-600">メッセージがありません</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {recentMessages.map((message) => (
                                                    <div key={message.id} className="flex items-start space-x-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                            {message.customerName.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <h3 className="font-medium text-gray-900 text-sm truncate">
                                                                    {message.customerName}
                                                                </h3>
                                                                <span className="text-xs text-gray-500">
                                                                    {formatTime(message.timestamp)}
                                                                </span>
                                                            </div>
                                                            <p className={`text-sm truncate ${message.unread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                                                {message.lastMessage}
                                                            </p>
                                                            {message.unread && (
                                                                <div className="w-2 h-2 bg-pink-500 rounded-full mt-1"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* クイックアクション */}
                        <div className="mt-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link
                                    href="/assistant/profile"
                                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-medium text-gray-900">プロフィール編集</h3>
                                        <p className="text-sm text-gray-600 mt-1">情報を更新</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/assistant/services"
                                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-medium text-gray-900">サービス管理</h3>
                                        <p className="text-sm text-gray-600 mt-1">料金・メニュー</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/assistant/schedule"
                                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-medium text-gray-900">スケジュール</h3>
                                        <p className="text-sm text-gray-600 mt-1">勤務時間設定</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/assistant/earnings"
                                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-medium text-gray-900">売上管理</h3>
                                        <p className="text-sm text-gray-600 mt-1">収益確認</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}