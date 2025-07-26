'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../(web)/_components/providers/AuthProvider';

export const dynamic = 'force-dynamic';

interface Booking {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    service: string;
    date: string;
    time: string;
    duration: number;
    price: number;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    notes?: string;
    isPracticeSession: boolean;
    practiceDiscount?: number;
    paymentStatus: 'pending' | 'paid' | 'refunded';
    createdAt: string;
    updatedAt: string;
    customerImage?: string;
}

interface BookingFilters {
    status: 'all' | Booking['status'];
    period: 'today' | 'week' | 'month' | 'all';
    type: 'all' | 'practice' | 'regular';
}

export default function AssistantBookings() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<BookingFilters>({
        status: 'all',
        period: 'all',
        type: 'all'
    });
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

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
            const mockBookings: Booking[] = [
                {
                    id: 'booking_1',
                    customerName: '山田 花子',
                    customerEmail: 'yamada@example.com',
                    customerPhone: '090-1234-5678',
                    service: 'カット',
                    date: '2024-01-16',
                    time: '14:00',
                    duration: 60,
                    price: 3000,
                    status: 'confirmed',
                    notes: '前髪を短めに',
                    isPracticeSession: false,
                    paymentStatus: 'pending',
                    createdAt: '2024-01-10T10:00:00Z',
                    updatedAt: '2024-01-10T10:00:00Z'
                },
                {
                    id: 'booking_2',
                    customerName: '佐藤 美咲',
                    customerEmail: 'sato@example.com',
                    customerPhone: '090-2345-6789',
                    service: 'カット + カラー',
                    date: '2024-01-16',
                    time: '16:30',
                    duration: 120,
                    price: 3850, // 練習台30%OFF
                    status: 'confirmed',
                    notes: 'ブラウン系カラー希望',
                    isPracticeSession: true,
                    practiceDiscount: 30,
                    paymentStatus: 'pending',
                    createdAt: '2024-01-11T15:30:00Z',
                    updatedAt: '2024-01-11T15:30:00Z'
                },
                {
                    id: 'booking_3',
                    customerName: '田中 由美',
                    customerEmail: 'tanaka@example.com',
                    customerPhone: '090-3456-7890',
                    service: 'カット',
                    date: '2024-01-17',
                    time: '10:00',
                    duration: 60,
                    price: 3000,
                    status: 'pending',
                    notes: '',
                    isPracticeSession: false,
                    paymentStatus: 'pending',
                    createdAt: '2024-01-12T09:00:00Z',
                    updatedAt: '2024-01-12T09:00:00Z'
                },
                {
                    id: 'booking_4',
                    customerName: '鈴木 愛',
                    customerEmail: 'suzuki@example.com',
                    customerPhone: '090-4567-8901',
                    service: 'トリートメント',
                    date: '2024-01-15',
                    time: '11:00',
                    duration: 45,
                    price: 2500,
                    status: 'completed',
                    notes: 'ダメージケア重点',
                    isPracticeSession: false,
                    paymentStatus: 'paid',
                    createdAt: '2024-01-10T14:00:00Z',
                    updatedAt: '2024-01-15T12:00:00Z'
                },
                {
                    id: 'booking_5',
                    customerName: '高橋 真理',
                    customerEmail: 'takahashi@example.com',
                    customerPhone: '090-5678-9012',
                    service: 'カラーリング',
                    date: '2024-01-14',
                    time: '13:00',
                    duration: 120,
                    price: 3300, // 練習台40%OFF
                    status: 'completed',
                    notes: 'アッシュブラウン',
                    isPracticeSession: true,
                    practiceDiscount: 40,
                    paymentStatus: 'paid',
                    createdAt: '2024-01-08T16:00:00Z',
                    updatedAt: '2024-01-14T15:30:00Z'
                },
                {
                    id: 'booking_6',
                    customerName: '伊藤 さくら',
                    customerEmail: 'ito@example.com',
                    customerPhone: '090-6789-0123',
                    service: 'カット',
                    date: '2024-01-13',
                    time: '15:30',
                    duration: 60,
                    price: 3000,
                    status: 'cancelled',
                    notes: '',
                    isPracticeSession: false,
                    paymentStatus: 'refunded',
                    createdAt: '2024-01-09T11:00:00Z',
                    updatedAt: '2024-01-12T10:00:00Z'
                },
                {
                    id: 'booking_7',
                    customerName: '加藤 みき',
                    customerEmail: 'kato@example.com',
                    customerPhone: '090-7890-1234',
                    service: 'カット',
                    date: '2024-01-12',
                    time: '14:00',
                    duration: 60,
                    price: 2100, // 練習台30%OFF
                    status: 'no_show',
                    notes: '',
                    isPracticeSession: true,
                    practiceDiscount: 30,
                    paymentStatus: 'pending',
                    createdAt: '2024-01-08T13:00:00Z',
                    updatedAt: '2024-01-12T14:30:00Z'
                }
            ];

            setBookings(mockBookings);
            setFilteredBookings(mockBookings);
            setIsLoading(false);
        }
    }, [user]);

    // フィルター処理
    useEffect(() => {
        let filtered = [...bookings];

        // ステータスフィルター
        if (filters.status !== 'all') {
            filtered = filtered.filter(booking => booking.status === filters.status);
        }

        // 期間フィルター
        if (filters.period !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            filtered = filtered.filter(booking => {
                const bookingDate = new Date(booking.date);
                
                switch (filters.period) {
                    case 'today':
                        return bookingDate.getTime() === today.getTime();
                    case 'week':
                        const weekAgo = new Date(today);
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        const weekFromNow = new Date(today);
                        weekFromNow.setDate(weekFromNow.getDate() + 7);
                        return bookingDate >= weekAgo && bookingDate <= weekFromNow;
                    case 'month':
                        return bookingDate.getMonth() === now.getMonth() && 
                               bookingDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
        }

        // タイプフィルター
        if (filters.type !== 'all') {
            filtered = filtered.filter(booking => {
                if (filters.type === 'practice') return booking.isPracticeSession;
                if (filters.type === 'regular') return !booking.isPracticeSession;
                return true;
            });
        }

        // 日付順でソート（新しい順）
        filtered.sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateB.getTime() - dateA.getTime();
        });

        setFilteredBookings(filtered);
    }, [bookings, filters]);

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'in_progress': return 'bg-purple-100 text-purple-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'no_show': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: Booking['status']) => {
        switch (status) {
            case 'pending': return '確認待ち';
            case 'confirmed': return '確定';
            case 'in_progress': return '施術中';
            case 'completed': return '完了';
            case 'cancelled': return 'キャンセル';
            case 'no_show': return '未来店';
            default: return status;
        }
    };

    const getPaymentStatusColor = (status: Booking['paymentStatus']) => {
        switch (status) {
            case 'pending': return 'text-yellow-600';
            case 'paid': return 'text-green-600';
            case 'refunded': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getPaymentStatusText = (status: Booking['paymentStatus']) => {
        switch (status) {
            case 'pending': return '未払い';
            case 'paid': return '支払済み';
            case 'refunded': return '返金済み';
            default: return status;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', { 
            year: 'numeric',
            month: 'short', 
            day: 'numeric',
            weekday: 'short'
        });
    };

    const formatTime = (timeString: string) => {
        return timeString;
    };

    const formatDuration = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes}分`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}時間${remainingMinutes}分` : `${hours}時間`;
    };

    const updateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
        setBookings(bookings.map(booking => 
            booking.id === bookingId 
                ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
                : booking
        ));
    };

    const getBookingStats = () => {
        const stats = {
            total: bookings.length,
            pending: bookings.filter(b => b.status === 'pending').length,
            confirmed: bookings.filter(b => b.status === 'confirmed').length,
            completed: bookings.filter(b => b.status === 'completed').length,
            practiceCount: bookings.filter(b => b.isPracticeSession).length
        };
        return stats;
    };

    const BookingDetailsModal = () => {
        if (!selectedBooking) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">予約詳細</h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* 基本情報 */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">基本情報</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">予約ID</span>
                                    <span className="font-mono text-sm">{selectedBooking.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">日時</span>
                                    <span>{formatDate(selectedBooking.date)} {formatTime(selectedBooking.time)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">所要時間</span>
                                    <span>{formatDuration(selectedBooking.duration)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">サービス</span>
                                    <span>{selectedBooking.service}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">料金</span>
                                    <span>¥{selectedBooking.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">ステータス</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                                        {getStatusText(selectedBooking.status)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">支払い状況</span>
                                    <span className={`font-medium ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                                        {getPaymentStatusText(selectedBooking.paymentStatus)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* お客様情報 */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">お客様情報</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">お名前</span>
                                    <span>{selectedBooking.customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">メールアドレス</span>
                                    <span className="text-sm">{selectedBooking.customerEmail}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">電話番号</span>
                                    <span>{selectedBooking.customerPhone}</span>
                                </div>
                            </div>
                        </div>

                        {/* 練習台情報 */}
                        {selectedBooking.isPracticeSession && (
                            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium text-pink-700">練習台セッション</span>
                                </div>
                                <div className="space-y-1 text-sm text-pink-600">
                                    <p>割引率: {selectedBooking.practiceDiscount}%</p>
                                    <p>通常価格: ¥{Math.round(selectedBooking.price / (1 - (selectedBooking.practiceDiscount! / 100))).toLocaleString()}</p>
                                    <p>練習台価格: ¥{selectedBooking.price.toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        {/* メモ */}
                        {selectedBooking.notes && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">メモ</h3>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedBooking.notes}</p>
                            </div>
                        )}

                        {/* アクション */}
                        {selectedBooking.status !== 'completed' && selectedBooking.status !== 'cancelled' && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">アクション</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {selectedBooking.status === 'pending' && (
                                        <button
                                            onClick={() => {
                                                updateBookingStatus(selectedBooking.id, 'confirmed');
                                                setShowDetailsModal(false);
                                            }}
                                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                        >
                                            確定する
                                        </button>
                                    )}
                                    {selectedBooking.status === 'confirmed' && (
                                        <button
                                            onClick={() => {
                                                updateBookingStatus(selectedBooking.id, 'in_progress');
                                                setShowDetailsModal(false);
                                            }}
                                            className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                                        >
                                            開始する
                                        </button>
                                    )}
                                    {selectedBooking.status === 'in_progress' && (
                                        <button
                                            onClick={() => {
                                                updateBookingStatus(selectedBooking.id, 'completed');
                                                setShowDetailsModal(false);
                                            }}
                                            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                        >
                                            完了する
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (confirm('この予約をキャンセルしますか？')) {
                                                updateBookingStatus(selectedBooking.id, 'cancelled');
                                                setShowDetailsModal(false);
                                            }
                                        }}
                                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                                    >
                                        キャンセル
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
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

    const stats = getBookingStats();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/assistant/dashboard" className="text-pink-500 hover:text-pink-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <Link href="/" className="text-xl font-bold text-pink-500">
                                Cutmeets
                            </Link>
                            <span className="text-gray-400">|</span>
                            <h1 className="text-lg font-semibold text-gray-900">予約管理</h1>
                        </div>
                        <div className="text-sm text-gray-600">
                            {user?.name}さん
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">予約情報を読み込み中...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 統計カード */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    <p className="text-sm text-gray-600">総予約数</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                    <p className="text-sm text-gray-600">確認待ち</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                                    <p className="text-sm text-gray-600">確定済み</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                                    <p className="text-sm text-gray-600">完了</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-pink-600">{stats.practiceCount}</p>
                                    <p className="text-sm text-gray-600">練習台</p>
                                </div>
                            </div>
                        </div>

                        {/* フィルター */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">フィルター</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters({...filters, status: e.target.value as BookingFilters['status']})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    >
                                        <option value="all">すべて</option>
                                        <option value="pending">確認待ち</option>
                                        <option value="confirmed">確定済み</option>
                                        <option value="in_progress">施術中</option>
                                        <option value="completed">完了</option>
                                        <option value="cancelled">キャンセル</option>
                                        <option value="no_show">未来店</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">期間</label>
                                    <select
                                        value={filters.period}
                                        onChange={(e) => setFilters({...filters, period: e.target.value as BookingFilters['period']})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    >
                                        <option value="all">すべて</option>
                                        <option value="today">今日</option>
                                        <option value="week">今週</option>
                                        <option value="month">今月</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">タイプ</label>
                                    <select
                                        value={filters.type}
                                        onChange={(e) => setFilters({...filters, type: e.target.value as BookingFilters['type']})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    >
                                        <option value="all">すべて</option>
                                        <option value="regular">通常予約</option>
                                        <option value="practice">練習台</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 予約一覧 */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    予約一覧 ({filteredBookings.length}件)
                                </h2>
                            </div>
                            <div className="p-6">
                                {filteredBookings.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600">該当する予約がありません</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredBookings.map((booking) => (
                                            <div 
                                                key={booking.id} 
                                                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowDetailsModal(true);
                                                }}
                                            >
                                                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {booking.customerName.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-medium text-gray-900 truncate">
                                                            {booking.customerName}
                                                        </h3>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-semibold text-gray-900">
                                                                ¥{booking.price.toLocaleString()}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                                {getStatusText(booking.status)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{booking.service}</p>
                                                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                                        <span>📅 {formatDate(booking.date)}</span>
                                                        <span>🕐 {formatTime(booking.time)}</span>
                                                        <span>⏱️ {formatDuration(booking.duration)}</span>
                                                        <span className={getPaymentStatusColor(booking.paymentStatus)}>
                                                            💳 {getPaymentStatusText(booking.paymentStatus)}
                                                        </span>
                                                        {booking.isPracticeSession && (
                                                            <span className="text-pink-600 font-medium">練習台 {booking.practiceDiscount}%OFF</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* モーダル */}
            {showDetailsModal && <BookingDetailsModal />}
        </div>
    );
}