'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../(web)/_components/providers/AuthProvider';

export const dynamic = 'force-dynamic';

interface Customer {
    id: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    area: string;
    preferredServices: string[];
    budgetRange: string;
    hairType: string;
    preferredTime: string[];
    lastBooking?: string;
    totalBookings: number;
    averageRating: number;
    profileImage?: string;
    registrationDate: string;
    isActive: boolean;
    responseRate: number;
    bio?: string;
    preferences: {
        communication: 'text' | 'call' | 'both';
        bookingNotice: string;
        cancelPolicy: boolean;
    };
}

interface BookingHistory {
    id: string;
    date: string;
    service: string;
    duration: number;
    price: number;
    status: 'completed' | 'cancelled' | 'no-show';
    rating?: number;
    review?: string;
    notes?: string;
}

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'notes'>('overview');
    const [customerNotes, setCustomerNotes] = useState('');

    const customerId = params.customerId as string;

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (customerId) {
            // モック顧客データ
            const mockCustomer: Customer = {
                id: customerId,
                name: '山田 花子',
                age: 28,
                gender: 'female',
                area: '渋谷・原宿',
                preferredServices: ['カット', 'カラー'],
                budgetRange: '3,000-4,000円',
                hairType: 'ストレート',
                preferredTime: ['平日午後', '土日午前'],
                lastBooking: '2024-01-10',
                totalBookings: 8,
                averageRating: 4.9,
                registrationDate: '2023-08-15',
                isActive: true,
                responseRate: 95,
                bio: 'ナチュラルで上品なスタイルが好みです。練習にご協力できて嬉しいです。技術向上のお手伝いができれば幸いです。',
                preferences: {
                    communication: 'text',
                    bookingNotice: '2日前',
                    cancelPolicy: true
                }
            };

            const mockBookingHistory: BookingHistory[] = [
                {
                    id: 'booking_1',
                    date: '2024-01-10',
                    service: 'カット + カラー',
                    duration: 120,
                    price: 4500,
                    status: 'completed',
                    rating: 5,
                    review: '今回もとても素敵に仕上げていただきました！ありがとうございます。',
                    notes: '根元のリタッチ。ナチュラルブラウンで仕上げ。'
                },
                {
                    id: 'booking_2',
                    date: '2023-12-15',
                    service: 'カット',
                    duration: 60,
                    price: 3000,
                    status: 'completed',
                    rating: 5,
                    review: 'いつも通り満足です！',
                    notes: '毛先を整える程度。レイヤーは控えめに。'
                },
                {
                    id: 'booking_3',
                    date: '2023-11-20',
                    service: 'カット + トリートメント',
                    duration: 90,
                    price: 4000,
                    status: 'completed',
                    rating: 4,
                    review: 'トリートメントでしっとりしました。',
                    notes: '乾燥が気になるとのことでトリートメント追加。'
                },
                {
                    id: 'booking_4',
                    date: '2023-10-25',
                    service: 'カット',
                    duration: 60,
                    price: 3000,
                    status: 'completed',
                    rating: 5,
                    notes: '通常カット。前髪の調整もしっかりと。'
                },
                {
                    id: 'booking_5',
                    date: '2023-09-30',
                    service: 'カット + カラー',
                    duration: 120,
                    price: 4500,
                    status: 'completed',
                    rating: 5,
                    review: '新しいカラーが気に入りました！',
                    notes: '初カラー。アッシュブラウンで印象チェンジ。'
                },
                {
                    id: 'booking_6',
                    date: '2023-09-05',
                    service: 'カット',
                    duration: 60,
                    price: 3000,
                    status: 'cancelled',
                    notes: '前日キャンセル。体調不良のため。'
                }
            ];

            setCustomer(mockCustomer);
            setBookingHistory(mockBookingHistory);
            setCustomerNotes('定期的に練習台として協力いただいている貴重な方。ナチュラルなスタイルを好まれ、練習への理解も深い。髪質は扱いやすく、カラーも綺麗に入るため技術練習に最適。次回はハイライト技術の練習をさせていただく予定。毎回丁寧にフィードバックをくださり、技術向上に大変役立っている。');
            setIsLoading(false);
        }
    }, [customerId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', { 
            year: 'numeric',
            month: 'short', 
            day: 'numeric',
            weekday: 'short'
        });
    };

    const getStatusColor = (status: BookingHistory['status']) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'no-show': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: BookingHistory['status']) => {
        switch (status) {
            case 'completed': return '完了';
            case 'cancelled': return 'キャンセル';
            case 'no-show': return '無断欠席';
            default: return status;
        }
    };

    const totalRevenue = bookingHistory
        .filter(booking => booking.status === 'completed')
        .reduce((sum, booking) => sum + booking.price, 0);

    const averageBookingValue = totalRevenue / Math.max(customer?.totalBookings || 1, 1);

    if (!isAuthenticated || !user || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">顧客が見つかりません</h2>
                    <Link href="/assistant/customers" className="text-pink-500 hover:text-pink-600">
                        顧客一覧に戻る
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/assistant/customers" className="text-pink-500 hover:text-pink-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <h1 className="text-lg font-semibold text-gray-900">練習台協力者詳細</h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link
                                href={`/messages?customer=${customer.id}`}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                                メッセージ
                            </Link>
                            <Link
                                href={`/assistant/bookings/new?customer=${customer.id}`}
                                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm"
                            >
                                予約作成
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* 顧客基本情報 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-start space-x-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-2xl flex-shrink-0">
                            {customer.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                                    <p className="text-gray-600">{customer.age}歳 • {customer.area}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">登録日</div>
                                    <div className="font-medium">{formatDate(customer.registrationDate)}</div>
                                </div>
                            </div>

                            {/* 統計情報 */}
                            <div className="grid grid-cols-4 gap-6 mb-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{customer.totalBookings}</div>
                                    <div className="text-sm text-gray-600">利用回数</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">¥{totalRevenue.toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">総売上</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {customer.averageRating > 0 ? customer.averageRating : '-'}
                                    </div>
                                    <div className="text-sm text-gray-600">平均評価</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{customer.responseRate}%</div>
                                    <div className="text-sm text-gray-600">返信率</div>
                                </div>
                            </div>

                            {customer.bio && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">練習台協力者からのメッセージ</h4>
                                    <p className="text-gray-700 italic">"{customer.bio}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* タブナビゲーション */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', label: '概要', icon: '📊' },
                                { id: 'history', label: '利用履歴', icon: '📋' },
                                { id: 'notes', label: '顧客メモ', icon: '📝' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-pink-500 text-pink-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* 基本情報 */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <div className="mb-4">
                                                <div className="text-sm font-medium text-gray-700 mb-1">髪質</div>
                                                <div className="text-gray-900">{customer.hairType}</div>
                                            </div>
                                            <div className="mb-4">
                                                <div className="text-sm font-medium text-gray-700 mb-1">予算帯</div>
                                                <div className="text-gray-900">{customer.budgetRange}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-700 mb-1">最終利用</div>
                                                <div className="text-gray-900">{customer.lastBooking ? formatDate(customer.lastBooking) : '利用なし'}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-4">
                                                <div className="text-sm font-medium text-gray-700 mb-1">連絡方法</div>
                                                <div className="text-gray-900">
                                                    {customer.preferences.communication === 'text' ? 'テキスト' : 
                                                     customer.preferences.communication === 'call' ? '電話' : '両方'}
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <div className="text-sm font-medium text-gray-700 mb-1">予約通知</div>
                                                <div className="text-gray-900">{customer.preferences.bookingNotice}前</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-700 mb-1">キャンセルポリシー</div>
                                                <div className="text-gray-900">{customer.preferences.cancelPolicy ? '同意済み' : '未同意'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 希望サービス */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">希望サービス</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {customer.preferredServices.map((service, index) => (
                                            <span key={index} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* 希望時間帯 */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">希望時間帯</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {customer.preferredTime.map((time, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                {time}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* パフォーマンス指標 */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">パフォーマンス指標</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-gray-900">¥{Math.round(averageBookingValue).toLocaleString()}</div>
                                            <div className="text-sm text-gray-600">平均単価</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {bookingHistory.filter(b => b.status === 'cancelled').length}
                                            </div>
                                            <div className="text-sm text-gray-600">キャンセル回数</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {customer.isActive ? 'アクティブ' : '休眠'}
                                            </div>
                                            <div className="text-sm text-gray-600">ステータス</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">利用履歴</h3>
                                <div className="space-y-4">
                                    {bookingHistory.map((booking) => (
                                        <div key={booking.id} className="border rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h4 className="font-medium text-gray-900">{booking.service}</h4>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                            {getStatusText(booking.status)}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {formatDate(booking.date)} • {booking.duration}分 • ¥{booking.price.toLocaleString()}
                                                    </div>
                                                </div>
                                                {booking.rating && (
                                                    <div className="flex items-center">
                                                        <div className="flex text-yellow-400 mr-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <svg key={i} className={`w-4 h-4 fill-current ${i < booking.rating! ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-gray-600">{booking.rating}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {booking.review && (
                                                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                                                    <div className="text-sm font-medium text-blue-900 mb-1">お客様のレビュー</div>
                                                    <p className="text-blue-800 text-sm">"{booking.review}"</p>
                                                </div>
                                            )}
                                            {booking.notes && (
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <div className="text-sm font-medium text-gray-900 mb-1">施術メモ</div>
                                                    <p className="text-gray-700 text-sm">{booking.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'notes' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">顧客メモ</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            プライベートメモ（練習台協力者には表示されません）
                                        </label>
                                        <textarea
                                            value={customerNotes}
                                            onChange={(e) => setCustomerNotes(e.target.value)}
                                            rows={8}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                                            placeholder="練習台協力者の好み、注意事項、練習ポイント、次回の技術練習目標などを記録してください..."
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
                                            メモを保存
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}