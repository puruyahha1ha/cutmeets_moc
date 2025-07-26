'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../_components/providers/AuthProvider';
import { Booking } from '../../../_components/providers/BookingProvider';

export default function BookingConfirmationPage() {
    const params = useParams();
    const { user } = useAuth();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const bookingId = params.bookingId as string;

    useEffect(() => {
        // モック予約データを取得
        const mockBooking: Booking = {
            id: bookingId,
            customerId: user?.id || '',
            assistantId: 'assistant_1',
            serviceId: 'cut',
            date: '2024-01-20',
            startTime: '14:00',
            endTime: '15:00',
            status: 'pending',
            totalPrice: 2000,
            notes: 'ナチュラルなスタイルでお願いします',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            customer: {
                id: user?.id || '',
                name: user?.name || '',
                email: user?.email || ''
            },
            assistant: {
                id: 'assistant_1',
                name: '田中 美香',
                email: 'tanaka@example.com',
                salonName: 'SALON TOKYO',
                hourlyRate: 2000
            },
            service: {
                id: 'cut',
                name: 'カット',
                duration: 60,
                price: 2000,
                description: 'シャンプー・カット・ブロー込み'
            }
        };

        setTimeout(() => {
            setBooking(mockBooking);
            setIsLoading(false);
        }, 500);
    }, [bookingId, user]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">予約情報が見つかりません</p>
                    <Link href="/profile" className="text-pink-500 hover:underline">
                        マイページに戻る
                    </Link>
                </div>
            </div>
        );
    }

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="text-center">
                        <h1 className="text-lg font-semibold text-gray-900">予約確認</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* 成功メッセージ */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">予約が完了しました！</h2>
                    <p className="text-gray-600">
                        アシスタント美容師からの確認連絡をお待ちください
                    </p>
                </div>

                {/* 予約詳細 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">予約詳細</h3>
                    
                    <div className="space-y-4">
                        {/* 予約ID */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 text-sm">予約ID:</span>
                            <span className="font-mono text-sm text-gray-900">{booking.id}</span>
                        </div>

                        {/* ステータス */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 text-sm">ステータス:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusText(booking.status)}
                            </span>
                        </div>

                        {/* アシスタント美容師 */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 text-sm">アシスタント美容師:</span>
                            <span className="font-medium">{booking.assistant?.name}</span>
                        </div>

                        {/* サロン */}
                        {booking.assistant?.salonName && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600 text-sm">サロン:</span>
                                <span className="font-medium">{booking.assistant.salonName}</span>
                            </div>
                        )}

                        {/* サービス */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 text-sm">サービス:</span>
                            <span className="font-medium">{booking.service?.name}</span>
                        </div>

                        {/* 日時 */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 text-sm">日時:</span>
                            <span className="font-medium">
                                {formatDate(booking.date)} {booking.startTime}〜{booking.endTime}
                            </span>
                        </div>

                        {/* 所要時間 */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 text-sm">所要時間:</span>
                            <span className="font-medium">{booking.service?.duration}分</span>
                        </div>

                        {/* 料金 */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 text-sm">料金:</span>
                            <span className="font-medium text-pink-600">¥{booking.totalPrice.toLocaleString()}</span>
                        </div>

                        {/* 備考 */}
                        {booking.notes && (
                            <div className="py-2">
                                <span className="text-gray-600 text-sm block mb-2">備考・要望:</span>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                    {booking.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 注意事項 */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        次のステップ
                    </h3>
                    <div className="text-blue-800 text-sm space-y-2">
                        <p>• アシスタント美容師から24時間以内に確認の連絡があります</p>
                        <p>• 予約確定後は、マイページから詳細を確認できます</p>
                        <p>• 変更・キャンセルをご希望の場合は、マイページから行ってください</p>
                        <p>• 当日は予約時間の5分前にお越しください</p>
                    </div>
                </div>

                {/* アクションボタン */}
                <div className="space-y-3">
                    <Link
                        href="/profile"
                        className="block w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 text-center text-lg font-semibold rounded-xl hover:from-pink-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
                    >
                        マイページで予約を確認
                    </Link>
                    
                    <Link
                        href="/search"
                        className="block w-full bg-gray-100 text-gray-700 py-3 text-center font-medium rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        他のアシスタント美容師を探す
                    </Link>
                    
                    <Link
                        href="/"
                        className="block w-full text-gray-500 py-3 text-center text-sm hover:text-gray-700 transition-colors"
                    >
                        ホームに戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}