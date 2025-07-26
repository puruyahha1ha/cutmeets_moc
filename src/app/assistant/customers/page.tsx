'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../(web)/_components/providers/AuthProvider';

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

export default function AssistantCustomersPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchFilters, setSearchFilters] = useState({
        area: '',
        service: '',
        budget: '',
        hairType: '',
        preferredTime: '',
        gender: '',
        bookingHistory: '',
        sortBy: 'recent'
    });

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
            // モック顧客データ
            const mockCustomers: Customer[] = [
                {
                    id: 'customer_1',
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
                },
                {
                    id: 'customer_2',
                    name: '佐藤 美咲',
                    age: 24,
                    gender: 'female',
                    area: '新宿・代々木',
                    preferredServices: ['カット', 'パーマ', 'トリートメント'],
                    budgetRange: '4,000-5,000円',
                    hairType: 'ウェーブ',
                    preferredTime: ['平日夕方', '土日午後'],
                    lastBooking: '2024-01-12',
                    totalBookings: 3,
                    averageRating: 4.7,
                    registrationDate: '2023-12-20',
                    isActive: true,
                    responseRate: 88,
                    bio: 'トレンドを取り入れたスタイルに挑戦したいです！アシスタントさんの練習台として色々試してもらえると嬉しいです。',
                    preferences: {
                        communication: 'both',
                        bookingNotice: '1日前',
                        cancelPolicy: true
                    }
                },
                {
                    id: 'customer_3',
                    name: '田中 由美',
                    age: 35,
                    gender: 'female',
                    area: '表参道・青山',
                    preferredServices: ['カット', 'ストレート'],
                    budgetRange: '2,000-3,000円',
                    hairType: 'くせ毛',
                    preferredTime: ['平日午前'],
                    lastBooking: '2024-01-05',
                    totalBookings: 12,
                    averageRating: 4.8,
                    registrationDate: '2023-06-10',
                    isActive: true,
                    responseRate: 92,
                    bio: 'お手入れが楽なスタイルを希望します。練習台として協力させていただき、勉強になります。',
                    preferences: {
                        communication: 'text',
                        bookingNotice: '3日前',
                        cancelPolicy: false
                    }
                },
                {
                    id: 'customer_4',
                    name: '鈴木 愛',
                    age: 31,
                    gender: 'female',
                    area: '池袋・新宿',
                    preferredServices: ['カット', 'カラー', 'トリートメント'],
                    budgetRange: '5,000-6,000円',
                    hairType: '細毛',
                    preferredTime: ['土日午前', '土日午後'],
                    lastBooking: '2023-12-28',
                    totalBookings: 6,
                    averageRating: 4.6,
                    registrationDate: '2023-09-05',
                    isActive: false,
                    responseRate: 76,
                    bio: 'ボリュームアップできるスタイルが希望です。',
                    preferences: {
                        communication: 'call',
                        bookingNotice: '1週間前',
                        cancelPolicy: true
                    }
                },
                {
                    id: 'customer_5',
                    name: '高橋 麻衣',
                    age: 26,
                    gender: 'female',
                    area: '渋谷・恵比寿',
                    preferredServices: ['カット', 'カラー'],
                    budgetRange: '3,000-4,000円',
                    hairType: '硬毛',
                    preferredTime: ['平日夕方', '土日夕方'],
                    totalBookings: 0,
                    averageRating: 0,
                    registrationDate: '2024-01-15',
                    isActive: true,
                    responseRate: 100,
                    bio: '新規登録したばかりです。アシスタント美容師さんの練習台として貢献できれば嬉しいです！',
                    preferences: {
                        communication: 'text',
                        bookingNotice: '2日前',
                        cancelPolicy: true
                    }
                }
            ];

            setCustomers(mockCustomers);
            setIsLoading(false);
        }
    }, [user]);

    const handleFilterChange = (filterType: string, value: string) => {
        setSearchFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const getFilteredAndSortedCustomers = () => {
        let filtered = customers.filter(customer => {
            // テキスト検索
            if (searchQuery && !customer.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
                !customer.area.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // エリアフィルター
            if (searchFilters.area && !customer.area.includes(searchFilters.area)) {
                return false;
            }

            // サービスフィルター
            if (searchFilters.service && !customer.preferredServices.includes(searchFilters.service)) {
                return false;
            }

            // 予算フィルター
            if (searchFilters.budget && customer.budgetRange !== searchFilters.budget) {
                return false;
            }

            // 髪質フィルター
            if (searchFilters.hairType && customer.hairType !== searchFilters.hairType) {
                return false;
            }

            // 時間帯フィルター
            if (searchFilters.preferredTime && !customer.preferredTime.includes(searchFilters.preferredTime)) {
                return false;
            }

            // 性別フィルター
            if (searchFilters.gender && customer.gender !== searchFilters.gender) {
                return false;
            }

            // 利用履歴フィルター
            if (searchFilters.bookingHistory) {
                if (searchFilters.bookingHistory === 'new' && customer.totalBookings > 0) {
                    return false;
                }
                if (searchFilters.bookingHistory === 'regular' && customer.totalBookings < 5) {
                    return false;
                }
                if (searchFilters.bookingHistory === 'active' && !customer.isActive) {
                    return false;
                }
            }

            return true;
        });

        // ソート処理
        filtered.sort((a, b) => {
            switch (searchFilters.sortBy) {
                case 'recent':
                    if (!a.lastBooking && !b.lastBooking) return 0;
                    if (!a.lastBooking) return 1;
                    if (!b.lastBooking) return -1;
                    return new Date(b.lastBooking).getTime() - new Date(a.lastBooking).getTime();
                case 'bookings':
                    return b.totalBookings - a.totalBookings;
                case 'rating':
                    return b.averageRating - a.averageRating;
                case 'response':
                    return b.responseRate - a.responseRate;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        return filtered;
    };

    const filteredCustomers = getFilteredAndSortedCustomers();

    const formatDate = (dateString?: string) => {
        if (!dateString) return '利用なし';
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', { 
            month: 'short', 
            day: 'numeric'
        });
    };

    const getCustomerStatus = (customer: Customer) => {
        if (customer.totalBookings === 0) return { text: '新規', color: 'bg-blue-100 text-blue-800' };
        if (!customer.isActive) return { text: '休眠', color: 'bg-gray-100 text-gray-800' };
        if (customer.totalBookings >= 5) return { text: '常連', color: 'bg-green-100 text-green-800' };
        return { text: '一般', color: 'bg-yellow-100 text-yellow-800' };
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
                            <Link href="/assistant/dashboard" className="text-pink-500 hover:text-pink-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <h1 className="text-lg font-semibold text-gray-900">練習台顧客管理</h1>
                        </div>
                        <div className="text-sm text-gray-600">
                            {user?.name}さんの練習台協力者リスト
                        </div>
                    </div>
                </div>
            </header>

            {/* 検索バー */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="練習台協力者名、エリアで検索"
                                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm sm:text-base"
                            />
                            <svg className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* フィルター */}
            {showFilters && (
                <div className="bg-white border-b border-gray-200 p-4 sm:p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">練習台協力者フィルター</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">エリア</label>
                                        <select
                                            value={searchFilters.area}
                                            onChange={(e) => handleFilterChange('area', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                                        >
                                            <option value="">すべて</option>
                                            <option value="渋谷">渋谷・原宿</option>
                                            <option value="新宿">新宿・代々木</option>
                                            <option value="表参道">表参道・青山</option>
                                            <option value="池袋">池袋・新宿</option>
                                            <option value="恵比寿">渋谷・恵比寿</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">希望サービス</label>
                                        <select
                                            value={searchFilters.service}
                                            onChange={(e) => handleFilterChange('service', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                                        >
                                            <option value="">すべて</option>
                                            <option value="カット">カット</option>
                                            <option value="カラー">カラー</option>
                                            <option value="パーマ">パーマ</option>
                                            <option value="ストレート">ストレート</option>
                                            <option value="トリートメント">トリートメント</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">予算帯</label>
                                        <select
                                            value={searchFilters.budget}
                                            onChange={(e) => handleFilterChange('budget', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                                        >
                                            <option value="">すべて</option>
                                            <option value="2,000-3,000円">2,000-3,000円</option>
                                            <option value="3,000-4,000円">3,000-4,000円</option>
                                            <option value="4,000-5,000円">4,000-5,000円</option>
                                            <option value="5,000-6,000円">5,000-6,000円</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">利用状況</label>
                                        <select
                                            value={searchFilters.bookingHistory}
                                            onChange={(e) => handleFilterChange('bookingHistory', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                                        >
                                            <option value="">すべて</option>
                                            <option value="new">新規協力者</option>
                                            <option value="regular">常連協力者（5回以上）</option>
                                            <option value="active">アクティブ</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => setSearchFilters({
                                        area: '',
                                        service: '',
                                        budget: '',
                                        hairType: '',
                                        preferredTime: '',
                                        gender: '',
                                        bookingHistory: '',
                                        sortBy: 'recent'
                                    })}
                                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    フィルターをクリア
                                </button>
                                <div className="text-sm text-gray-600">
                                    {filteredCustomers.length}件の練習台協力者
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* メインコンテンツ */}
            <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
                {/* ヘッダー */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        練習台協力者一覧 <span className="text-sm font-normal text-gray-600">({filteredCustomers.length}人)</span>
                    </h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm text-gray-600">並び替え:</span>
                        <select 
                            value={searchFilters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            className="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                        >
                            <option value="recent">最新利用順</option>
                            <option value="bookings">利用回数順</option>
                            <option value="rating">評価順</option>
                            <option value="response">返信率順</option>
                            <option value="name">名前順</option>
                        </select>
                    </div>
                </div>

                {/* 顧客リスト */}
                <div className="space-y-3 sm:space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">顧客情報を読み込み中...</p>
                            </div>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">該当する練習台協力者が見つかりません</h3>
                            <p className="text-gray-600 mb-4">検索条件を変更してお試しください</p>
                            <button
                                onClick={() => setSearchFilters({
                                    area: '',
                                    service: '',
                                    budget: '',
                                    hairType: '',
                                    preferredTime: '',
                                    gender: '',
                                    bookingHistory: '',
                                    sortBy: 'recent'
                                })}
                                className="text-pink-500 hover:text-pink-600 font-medium"
                            >
                                フィルターをリセット
                            </button>
                        </div>
                    ) : (
                        filteredCustomers.map((customer) => {
                            const status = getCustomerStatus(customer);
                            return (
                                <div key={customer.id} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        {/* プロフィール画像 */}
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0">
                                            {customer.name.charAt(0)}
                                        </div>

                                        {/* 基本情報 */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{customer.name}</h3>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                                            {status.text}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-gray-600">{customer.age}歳 • {customer.area}</p>
                                                </div>
                                                <div className="text-right text-xs text-gray-500">
                                                    最終利用: {formatDate(customer.lastBooking)}
                                                </div>
                                            </div>

                                            {/* 統計情報 */}
                                            <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                                                <div>
                                                    <div className="text-lg font-semibold text-gray-900">{customer.totalBookings}</div>
                                                    <div className="text-xs text-gray-600">利用回数</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {customer.averageRating > 0 ? customer.averageRating : '-'}
                                                    </div>
                                                    <div className="text-xs text-gray-600">平均評価</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-semibold text-gray-900">{customer.responseRate}%</div>
                                                    <div className="text-xs text-gray-600">返信率</div>
                                                </div>
                                            </div>

                                            {/* 詳細情報 */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex flex-wrap items-center space-x-4 text-xs sm:text-sm text-gray-600">
                                                    <span>髪質: {customer.hairType}</span>
                                                    <span>予算: {customer.budgetRange}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs sm:text-sm text-gray-600 shrink-0">希望サービス:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {customer.preferredServices.map((service, index) => (
                                                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                                                {service}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs sm:text-sm text-gray-600 shrink-0">希望時間:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {customer.preferredTime.map((time, index) => (
                                                            <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                                                {time}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                {customer.bio && (
                                                    <div className="bg-gray-50 rounded-lg p-3 mt-2">
                                                        <p className="text-xs sm:text-sm text-gray-700 italic">"{customer.bio}"</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* アクションボタン */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="text-xs text-gray-500">
                                                        連絡方法: {customer.preferences.communication === 'text' ? 'テキスト' : 
                                                                  customer.preferences.communication === 'call' ? '電話' : '両方'}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={`/messages?customer=${customer.id}`}
                                                        className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                                                    >
                                                        メッセージ
                                                    </Link>
                                                    <Link
                                                        href={`/assistant/customers/${customer.id}`}
                                                        className="bg-pink-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-pink-600 transition-colors text-xs sm:text-sm"
                                                    >
                                                        詳細
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* 統計サマリー */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
                        <div className="text-sm text-gray-600">総協力者数</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{customers.filter(c => c.totalBookings > 0).length}</div>
                        <div className="text-sm text-gray-600">利用経験あり</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{customers.filter(c => c.totalBookings >= 5).length}</div>
                        <div className="text-sm text-gray-600">常連協力者</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{customers.filter(c => c.isActive).length}</div>
                        <div className="text-sm text-gray-600">アクティブ</div>
                    </div>
                </div>
            </main>
        </div>
    );
}