'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../(web)/_components/providers/AuthProvider';

export const dynamic = 'force-dynamic';

interface EarningsData {
    today: number;
    thisWeek: number;
    thisMonth: number;
    lastMonth: number;
    totalEarnings: number;
}

interface Transaction {
    id: string;
    date: string;
    customerName: string;
    service: string;
    amount: number;
    commission: number;
    netAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
    paymentMethod: string;
    isPracticeSession: boolean;
}

interface DailyEarnings {
    date: string;
    totalAmount: number;
    transactionCount: number;
    practiceSessionCount: number;
}

const COMMISSION_RATE = 0.15; // 15% commission

export default function AssistantEarnings() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [earnings, setEarnings] = useState<EarningsData>({
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        lastMonth: 0,
        totalEarnings: 0
    });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [dailyEarnings, setDailyEarnings] = useState<DailyEarnings[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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
            const mockTransactions: Transaction[] = [
                {
                    id: 'txn_1',
                    date: '2024-01-15',
                    customerName: '山田 花子',
                    service: 'カット',
                    amount: 3000,
                    commission: 3000 * COMMISSION_RATE,
                    netAmount: 3000 * (1 - COMMISSION_RATE),
                    status: 'completed',
                    paymentMethod: 'クレジットカード',
                    isPracticeSession: false
                },
                {
                    id: 'txn_2',
                    date: '2024-01-15',
                    customerName: '佐藤 美咲',
                    service: 'カット + カラー',
                    amount: 5500,
                    commission: 5500 * COMMISSION_RATE,
                    netAmount: 5500 * (1 - COMMISSION_RATE),
                    status: 'completed',
                    paymentMethod: '現金',
                    isPracticeSession: false
                },
                {
                    id: 'txn_3',
                    date: '2024-01-14',
                    customerName: '田中 由美',
                    service: 'カット（練習台）',
                    amount: 2100, // 30% off
                    commission: 2100 * COMMISSION_RATE,
                    netAmount: 2100 * (1 - COMMISSION_RATE),
                    status: 'completed',
                    paymentMethod: 'クレジットカード',
                    isPracticeSession: true
                },
                {
                    id: 'txn_4',
                    date: '2024-01-14',
                    customerName: '鈴木 愛',
                    service: 'トリートメント',
                    amount: 2500,
                    commission: 2500 * COMMISSION_RATE,
                    netAmount: 2500 * (1 - COMMISSION_RATE),
                    status: 'completed',
                    paymentMethod: '現金',
                    isPracticeSession: false
                },
                {
                    id: 'txn_5',
                    date: '2024-01-13',
                    customerName: '高橋 真理',
                    service: 'カラーリング（練習台）',
                    amount: 3300, // 40% off
                    commission: 3300 * COMMISSION_RATE,
                    netAmount: 3300 * (1 - COMMISSION_RATE),
                    status: 'completed',
                    paymentMethod: 'クレジットカード',
                    isPracticeSession: true
                },
                {
                    id: 'txn_6',
                    date: '2024-01-16',
                    customerName: '伊藤 さくら',
                    service: 'カット',
                    amount: 3000,
                    commission: 3000 * COMMISSION_RATE,
                    netAmount: 3000 * (1 - COMMISSION_RATE),
                    status: 'pending',
                    paymentMethod: 'クレジットカード',
                    isPracticeSession: false
                }
            ];

            setTransactions(mockTransactions);

            // 売上データを計算
            const completedTransactions = mockTransactions.filter(t => t.status === 'completed');
            const today = new Date().toISOString().split('T')[0];
            const todayEarnings = completedTransactions
                .filter(t => t.date === today)
                .reduce((sum, t) => sum + t.netAmount, 0);

            const thisWeekEarnings = completedTransactions
                .filter(t => {
                    const transactionDate = new Date(t.date);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return transactionDate >= weekAgo;
                })
                .reduce((sum, t) => sum + t.netAmount, 0);

            const thisMonthEarnings = completedTransactions
                .filter(t => {
                    const transactionDate = new Date(t.date);
                    const now = new Date();
                    return transactionDate.getMonth() === now.getMonth() && 
                           transactionDate.getFullYear() === now.getFullYear();
                })
                .reduce((sum, t) => sum + t.netAmount, 0);

            const lastMonthEarnings = completedTransactions
                .filter(t => {
                    const transactionDate = new Date(t.date);
                    const lastMonth = new Date();
                    lastMonth.setMonth(lastMonth.getMonth() - 1);
                    return transactionDate.getMonth() === lastMonth.getMonth() && 
                           transactionDate.getFullYear() === lastMonth.getFullYear();
                })
                .reduce((sum, t) => sum + t.netAmount, 0);

            const totalEarnings = completedTransactions.reduce((sum, t) => sum + t.netAmount, 0);

            setEarnings({
                today: todayEarnings,
                thisWeek: thisWeekEarnings,
                thisMonth: thisMonthEarnings,
                lastMonth: lastMonthEarnings,
                totalEarnings: totalEarnings
            });

            // 日別売上データ
            const dailyData: DailyEarnings[] = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateString = date.toISOString().split('T')[0];
                
                const dayTransactions = completedTransactions.filter(t => t.date === dateString);
                dailyData.push({
                    date: dateString,
                    totalAmount: dayTransactions.reduce((sum, t) => sum + t.netAmount, 0),
                    transactionCount: dayTransactions.length,
                    practiceSessionCount: dayTransactions.filter(t => t.isPracticeSession).length
                });
            }
            setDailyEarnings(dailyData);

            setIsLoading(false);
        }
    }, [user]);

    const formatCurrency = (amount: number) => {
        return `¥${Math.round(amount).toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', { 
            month: 'short', 
            day: 'numeric',
            weekday: 'short'
        });
    };

    const getStatusColor = (status: Transaction['status']) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: Transaction['status']) => {
        switch (status) {
            case 'completed': return '完了';
            case 'pending': return '処理中';
            case 'cancelled': return 'キャンセル';
            default: return status;
        }
    };

    const calculateGrowthPercentage = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    };

    const TransactionModal = () => {
        if (!selectedTransaction) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">取引詳細</h2>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">取引ID</span>
                            <span className="font-mono text-sm">{selectedTransaction.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">日付</span>
                            <span>{formatDate(selectedTransaction.date)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">お客様</span>
                            <span>{selectedTransaction.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">サービス</span>
                            <span>{selectedTransaction.service}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">サービス料金</span>
                            <span>{formatCurrency(selectedTransaction.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">手数料 (15%)</span>
                            <span className="text-red-600">-{formatCurrency(selectedTransaction.commission)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                            <span className="font-semibold text-gray-900">受取金額</span>
                            <span className="font-semibold text-green-600">{formatCurrency(selectedTransaction.netAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">支払方法</span>
                            <span>{selectedTransaction.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">ステータス</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                                {getStatusText(selectedTransaction.status)}
                            </span>
                        </div>
                        {selectedTransaction.isPracticeSession && (
                            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-pink-700 font-medium">練習台セッション</span>
                                </div>
                                <p className="text-sm text-pink-600 mt-1">
                                    特別割引価格でのサービス提供
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-gray-200">
                        <button
                            onClick={() => setShowTransactionModal(false)}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            閉じる
                        </button>
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
                            <h1 className="text-lg font-semibold text-gray-900">売上管理</h1>
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
                            <p className="text-gray-600">売上情報を読み込み中...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 売上統計カード */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-blue-600">{formatCurrency(earnings.today)}</p>
                                    <p className="text-sm text-gray-600">今日</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-green-600">{formatCurrency(earnings.thisWeek)}</p>
                                    <p className="text-sm text-gray-600">今週</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-purple-600">{formatCurrency(earnings.thisMonth)}</p>
                                    <p className="text-sm text-gray-600">今月</p>
                                    {earnings.lastMonth > 0 && (
                                        <p className={`text-xs mt-1 ${
                                            calculateGrowthPercentage(earnings.thisMonth, earnings.lastMonth) >= 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}>
                                            {calculateGrowthPercentage(earnings.thisMonth, earnings.lastMonth) >= 0 ? '+' : ''}
                                            {calculateGrowthPercentage(earnings.thisMonth, earnings.lastMonth).toFixed(1)}%
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-600">{formatCurrency(earnings.lastMonth)}</p>
                                    <p className="text-sm text-gray-600">先月</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-pink-600">{formatCurrency(earnings.totalEarnings)}</p>
                                    <p className="text-sm text-gray-600">累計</p>
                                </div>
                            </div>
                        </div>

                        {/* 日別売上グラフ */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">過去7日間の売上推移</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {dailyEarnings.map((day, index) => {
                                        const maxAmount = Math.max(...dailyEarnings.map(d => d.totalAmount));
                                        const widthPercentage = maxAmount > 0 ? (day.totalAmount / maxAmount) * 100 : 0;
                                        
                                        return (
                                            <div key={day.date} className="flex items-center space-x-4">
                                                <div className="w-16 text-sm text-gray-600">
                                                    {formatDate(day.date)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="bg-gray-200 rounded-full h-6 relative">
                                                        <div 
                                                            className="bg-gradient-to-r from-pink-400 to-purple-400 h-6 rounded-full flex items-center justify-end pr-2"
                                                            style={{ width: `${Math.max(widthPercentage, 5)}%` }}
                                                        >
                                                            {day.totalAmount > 0 && (
                                                                <span className="text-white text-xs font-medium">
                                                                    {formatCurrency(day.totalAmount)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-20 text-sm text-gray-600 text-right">
                                                    {day.transactionCount}件
                                                    {day.practiceSessionCount > 0 && (
                                                        <span className="text-pink-600 ml-1">
                                                            (練習{day.practiceSessionCount})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* 最近の取引 */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold text-gray-900">最近の取引</h2>
                                            <Link
                                                href="/assistant/transactions"
                                                className="text-pink-500 hover:text-pink-600 text-sm font-medium"
                                            >
                                                すべて見る
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {transactions.length === 0 ? (
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-600">取引履歴がありません</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {transactions.slice(0, 5).map((transaction) => (
                                                    <div 
                                                        key={transaction.id} 
                                                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                                                        onClick={() => {
                                                            setSelectedTransaction(transaction);
                                                            setShowTransactionModal(true);
                                                        }}
                                                    >
                                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {transaction.customerName.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <h3 className="font-medium text-gray-900 truncate">
                                                                    {transaction.customerName}
                                                                </h3>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="font-semibold text-green-600">
                                                                        {formatCurrency(transaction.netAmount)}
                                                                    </span>
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                                        {getStatusText(transaction.status)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-600">{transaction.service}</p>
                                                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                                                <span>📅 {formatDate(transaction.date)}</span>
                                                                <span>💳 {transaction.paymentMethod}</span>
                                                                {transaction.isPracticeSession && (
                                                                    <span className="text-pink-600 font-medium">練習台</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 売上分析 */}
                            <div>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <h2 className="text-lg font-semibold text-gray-900">売上分析</h2>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-3">手数料情報</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">プラットフォーム手数料</span>
                                                    <span className="font-medium">15%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">今月の手数料</span>
                                                    <span className="text-red-600">
                                                        -{formatCurrency(earnings.thisMonth * COMMISSION_RATE / (1 - COMMISSION_RATE))}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-3">練習台セッション</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">今月の練習台件数</span>
                                                    <span className="font-medium text-pink-600">
                                                        {transactions.filter(t => t.isPracticeSession && t.status === 'completed').length}件
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">練習台売上</span>
                                                    <span className="font-medium">
                                                        {formatCurrency(
                                                            transactions
                                                                .filter(t => t.isPracticeSession && t.status === 'completed')
                                                                .reduce((sum, t) => sum + t.netAmount, 0)
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-3">支払い方法</h3>
                                            <div className="space-y-2 text-sm">
                                                {['クレジットカード', '現金'].map(method => {
                                                    const methodTransactions = transactions.filter(t => 
                                                        t.paymentMethod === method && t.status === 'completed'
                                                    );
                                                    const methodAmount = methodTransactions.reduce((sum, t) => sum + t.netAmount, 0);
                                                    const percentage = earnings.totalEarnings > 0 
                                                        ? (methodAmount / earnings.totalEarnings) * 100 
                                                        : 0;
                                                    
                                                    return (
                                                        <div key={method} className="flex justify-between">
                                                            <span className="text-gray-600">{method}</span>
                                                            <span className="font-medium">
                                                                {percentage.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 練習台システムについて */}
                        <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">売上向上のヒント</h3>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">練習台セッションの活用</h4>
                                    <ul className="text-gray-600 space-y-1">
                                        <li>• 新しい技術の練習に最適</li>
                                        <li>• お客様との関係構築</li>
                                        <li>• 安定的な収入源として活用</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">売上アップのコツ</h4>
                                    <ul className="text-gray-600 space-y-1">
                                        <li>• 定期的なサービス提供</li>
                                        <li>• お客様のニーズに合わせたメニュー</li>
                                        <li>• 継続的なスキルアップ</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* モーダル */}
            {showTransactionModal && <TransactionModal />}
        </div>
    );
}