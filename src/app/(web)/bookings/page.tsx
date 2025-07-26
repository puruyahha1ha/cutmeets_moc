'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_components/providers/AuthProvider';
import { useBooking, Booking } from '../_components/providers/BookingProvider';

export default function BookingsPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { getBookings, updateBookingStatus, cancelBooking, isLoading } = useBooking();
    
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [isLoadingBookings, setIsLoadingBookings] = useState(true);
    const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    // 未認証の場合はリダイレクト
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
    }, [isAuthenticated, router]);

    // 予約一覧を取得
    useEffect(() => {
        if (user) {
            setIsLoadingBookings(true);
            getBookings(user.id, user.userType === 'stylist' ? 'assistant' : 'customer')
                .then(setBookings)
                .finally(() => setIsLoadingBookings(false));
        }
    }, [user, getBookings]);

    // 日付でフィルタリング
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= today && booking.status !== 'cancelled';
    });

    const pastBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate < today || booking.status === 'cancelled' || booking.status === 'completed';
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}月${date.getDate()}日 (${['日', '月', '火', '水', '木', '金', '土'][date.getDay()]})`;
    };

    const getStatusText = (status: Booking['status']) => {
        switch (status) {
            case 'pending': return '確認待ち';
            case 'confirmed': return '確定';
            case 'completed': return '完了';
            case 'cancelled': return 'キャンセル';
            default: return status;
        }
    };

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'confirmed': return 'text-green-600 bg-green-100';
            case 'completed': return 'text-blue-600 bg-blue-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const handleCancelBooking = async () => {
        if (!cancellingBookingId) return;

        const result = await cancelBooking(cancellingBookingId, cancelReason.trim() || undefined);
        
        if (result.success) {
            // 予約一覧を更新
            if (user) {
                const updatedBookings = await getBookings(user.id, user.userType === 'stylist' ? 'assistant' : 'customer');
                setBookings(updatedBookings);
            }
            setShowCancelModal(false);
            setCancellingBookingId(null);
            setCancelReason('');
        }
    };

    const openCancelModal = (bookingId: string) => {
        setCancellingBookingId(bookingId);
        setShowCancelModal(true);
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
        setCancellingBookingId(null);
        setCancelReason('');
    };

    const renderBookingCard = (booking: Booking) => (
        <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-gray-900">
                        {user?.userType === 'customer' ? booking.assistant?.name : booking.customer?.name}
                    </h3>
                    {user?.userType === 'customer' && booking.assistant?.salonName && (
                        <p className="text-sm text-gray-600">{booking.assistant.salonName}</p>
                    )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                    <span>サービス:</span>
                    <span className="font-medium text-gray-900">{booking.service?.name}</span>
                </div>
                <div className="flex justify-between">
                    <span>日時:</span>
                    <span className="font-medium text-gray-900">
                        {formatDate(booking.date)} {booking.startTime}〜{booking.endTime}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>料金:</span>
                    <span className="font-medium text-pink-600">¥{booking.totalPrice.toLocaleString()}</span>
                </div>
                {booking.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-700">
                            <span className="font-medium">備考:</span> {booking.notes}
                        </p>
                    </div>
                )}
            </div>

            {/* アクションボタン */}
            <div className="flex gap-2">
                <Link
                    href={`/booking/confirmation/${booking.id}`}
                    className="flex-1 py-2 px-4 text-center text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    詳細
                </Link>
                
                {booking.status === 'pending' || booking.status === 'confirmed' ? (
                    <button
                        onClick={() => openCancelModal(booking.id)}
                        className="flex-1 py-2 px-4 text-center text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        キャンセル
                    </button>
                ) : null}

                {user?.userType === 'stylist' && booking.status === 'pending' && (
                    <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="flex-1 py-2 px-4 text-center text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        承認
                    </button>
                )}
            </div>
        </div>
    );

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
            <header className="bg-white border-b border-gray-200 sticky top-16 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/profile" className="flex items-center text-gray-600 hover:text-pink-500">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            プロフィールに戻る
                        </Link>
                        <h1 className="text-lg font-semibold text-gray-900">予約管理</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* タブ */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1 mb-6">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`flex-1 py-3 px-4 text-sm font-medium rounded-xl transition-colors ${
                                activeTab === 'upcoming'
                                    ? 'bg-pink-100 text-pink-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            今後の予約 ({upcomingBookings.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`flex-1 py-3 px-4 text-sm font-medium rounded-xl transition-colors ${
                                activeTab === 'past'
                                    ? 'bg-pink-100 text-pink-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            過去の予約 ({pastBookings.length})
                        </button>
                    </div>
                </div>

                {/* 予約一覧 */}
                {isLoadingBookings ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">予約情報を読み込み中...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeTab === 'upcoming' && (
                            <>
                                {upcomingBookings.length > 0 ? (
                                    upcomingBookings.map(renderBookingCard)
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">予約がありません</h3>
                                        <p className="text-gray-600 mb-6">まだ今後の予約がありません</p>
                                        {user.userType === 'customer' && (
                                            <Link
                                                href="/search"
                                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 transition-all"
                                            >
                                                アシスタント美容師を探す
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'past' && (
                            <>
                                {pastBookings.length > 0 ? (
                                    pastBookings.map(renderBookingCard)
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">過去の予約がありません</h3>
                                        <p className="text-gray-600">まだ過去の予約履歴がありません</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* キャンセルモーダル */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">予約をキャンセルしますか？</h3>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                キャンセル理由 (任意)
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="キャンセルの理由をお書きください"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={closeCancelModal}
                                className="flex-1 py-3 px-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                戻る
                            </button>
                            <button
                                onClick={handleCancelBooking}
                                disabled={isLoading}
                                className={`flex-1 py-3 px-4 text-white rounded-lg transition-colors flex items-center justify-center ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-red-500 hover:bg-red-600'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        処理中...
                                    </>
                                ) : (
                                    'キャンセル'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}