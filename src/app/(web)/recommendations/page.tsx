'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../_components/providers/AuthProvider';

interface RecommendationCategory {
    id: string;
    title: string;
    description: string;
    icon: string;
    assistants: Assistant[];
}

interface Assistant {
    id: number;
    name: string;
    salon: string;
    station: string;
    rating: number;
    reviewCount: number;
    price: string;
    specialties: string[];
    availableToday: boolean;
    distance: number;
    matchScore: number;
    matchReasons: string[];
    hourlyRate: number;
    averagePrice: number;
    responseRate: number;
    completedBookings: number;
}

export default function RecommendationsPage() {
    const { user, isAuthenticated } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);

    // モックデータ - AI推薦結果
    const recommendations: RecommendationCategory[] = [
        {
            id: 'ai_match',
            title: 'あなたにおすすめ',
            description: '予約履歴や好みに基づくAI推薦',
            icon: '🤖',
            assistants: [
                {
                    id: 1,
                    name: '田中 美香',
                    salon: 'SALON TOKYO',
                    station: '渋谷駅',
                    rating: 4.8,
                    reviewCount: 156,
                    price: '1,500円〜',
                    specialties: ['カット', 'カラー'],
                    availableToday: true,
                    distance: 0.5,
                    matchScore: 95,
                    matchReasons: ['過去の予約パターンと一致', 'カラーが得意', '高評価多数'],
                    hourlyRate: 2000,
                    averagePrice: 2500,
                    responseRate: 98,
                    completedBookings: 142
                },
                {
                    id: 5,
                    name: '山田 彩',
                    salon: 'Color Salon AYA',
                    station: '原宿駅',
                    rating: 4.9,
                    reviewCount: 124,
                    price: '2,500円〜',
                    specialties: ['カラー', 'ブリーチ'],
                    availableToday: false,
                    distance: 1.5,
                    matchScore: 88,
                    matchReasons: ['カラー専門店', 'トレンドに敏感', 'リピーター多数'],
                    hourlyRate: 3000,
                    averagePrice: 4200,
                    responseRate: 92,
                    completedBookings: 98
                }
            ]
        },
        {
            id: 'nearby',
            title: '近場で人気',
            description: 'あなたの周辺で評価の高いアシスタント',
            icon: '📍',
            assistants: [
                {
                    id: 3,
                    name: '鈴木 優子',
                    salon: 'Beauty Lounge',
                    station: '表参道駅',
                    rating: 4.7,
                    reviewCount: 89,
                    price: '1,800円〜',
                    specialties: ['カット', 'ストレート'],
                    availableToday: true,
                    distance: 0.8,
                    matchScore: 82,
                    matchReasons: ['近距離', 'ストレート技術に定評', '予約が取りやすい'],
                    hourlyRate: 2200,
                    averagePrice: 2800,
                    responseRate: 95,
                    completedBookings: 76
                },
                {
                    id: 4,
                    name: '高橋 健太',
                    salon: 'Men\'s Studio K',
                    station: '池袋駅',
                    rating: 4.6,
                    reviewCount: 67,
                    price: '1,200円〜',
                    specialties: ['カット', 'パーマ'],
                    availableToday: true,
                    distance: 2.1,
                    matchScore: 75,
                    matchReasons: ['コスパが良い', 'メンズカットが得意', '即日予約可能'],
                    hourlyRate: 1800,
                    averagePrice: 2200,
                    responseRate: 88,
                    completedBookings: 54
                }
            ]
        },
        {
            id: 'trending',
            title: 'トレンド注目',
            description: '今話題のスタイリストたち',
            icon: '🔥',
            assistants: [
                {
                    id: 6,
                    name: '佐々木 麗',
                    salon: 'Trend Salon REI',
                    station: '恵比寿駅',
                    rating: 4.8,
                    reviewCount: 203,
                    price: '2,200円〜',
                    specialties: ['トレンドカット', 'バレイヤージュ'],
                    availableToday: false,
                    distance: 1.8,
                    matchScore: 90,
                    matchReasons: ['SNSで話題', '最新トレンド対応', '予約困難な人気店'],
                    hourlyRate: 2800,
                    averagePrice: 3800,
                    responseRate: 94,
                    completedBookings: 187
                }
            ]
        },
        {
            id: 'value',
            title: 'コスパ重視',
            description: '品質と価格のバランスが良いアシスタント',
            icon: '💰',
            assistants: [
                {
                    id: 7,
                    name: '松本 翔',
                    salon: 'Value Cut Studio',
                    station: '新宿駅',
                    rating: 4.5,
                    reviewCount: 312,
                    price: '1,000円〜',
                    specialties: ['カット', 'シャンプー'],
                    availableToday: true,
                    distance: 1.2,
                    matchScore: 78,
                    matchReasons: ['最安値クラス', '技術は確実', '予約が取りやすい'],
                    hourlyRate: 1500,
                    averagePrice: 1800,
                    responseRate: 91,
                    completedBookings: 285
                }
            ]
        }
    ];

    useEffect(() => {
        // 推薦データの読み込みシミュレーション
        setTimeout(() => {
            setIsLoading(false);
        }, 800);
    }, []);

    const getAllAssistants = () => {
        return recommendations.flatMap(category => category.assistants);
    };

    const getFilteredAssistants = () => {
        if (selectedCategory === 'all') {
            return getAllAssistants().sort((a, b) => b.matchScore - a.matchScore);
        }
        const category = recommendations.find(cat => cat.id === selectedCategory);
        return category ? category.assistants : [];
    };

    const renderAssistantCard = (assistant: Assistant) => (
        <Link
            key={assistant.id}
            href={`/assistant/${assistant.id}`}
            className="block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-pink-200"
        >
            <div className="flex items-start space-x-4">
                {/* プロフィール画像 */}
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {assistant.name.charAt(0)}
                </div>

                {/* メイン情報 */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{assistant.name}</h3>
                            <p className="text-sm text-gray-600">{assistant.salon}</p>
                        </div>
                        <div className="text-right">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-1">
                                {assistant.matchScore}% マッチ
                            </div>
                            {assistant.availableToday && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    今日空きあり
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 評価と基本情報 */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-4 h-4 fill-current ${i < Math.floor(assistant.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="ml-1 text-sm text-gray-600">
                                    {assistant.rating} ({assistant.reviewCount}件)
                                </span>
                            </div>
                            <span className="text-sm text-gray-600">{assistant.station} • {assistant.distance}km</span>
                        </div>
                        <span className="text-lg font-semibold text-pink-600">{assistant.price}</span>
                    </div>

                    {/* マッチング理由 */}
                    <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                            {assistant.matchReasons.map((reason, index) => (
                                <span key={index} className="bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded-full border border-pink-200">
                                    {reason}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 得意分野 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">得意:</span>
                            <div className="flex gap-1">
                                {assistant.specialties.map((specialty, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>完了{assistant.completedBookings}件</span>
                            <span>返信率{assistant.responseRate}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">ログインが必要です</h2>
                    <p className="text-gray-600 mb-6">おすすめ機能を利用するにはログインしてください</p>
                    <div className="space-y-3">
                        <Link
                            href="/login"
                            className="block w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-6 rounded-xl hover:from-pink-600 hover:to-red-600 transition-all font-medium"
                        >
                            ログイン
                        </Link>
                        <Link
                            href="/register"
                            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                        >
                            新規登録
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/search" className="flex items-center text-gray-600 hover:text-pink-500">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            検索に戻る
                        </Link>
                        <h1 className="text-lg font-semibold text-gray-900">おすすめ</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* ウェルカムメッセージ */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-6 mb-6">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold mb-2">
                                {user?.name}さんにおすすめ 🎯
                            </h2>
                            <p className="text-pink-100">
                                あなたの予約履歴や好みを分析して、最適なアシスタント美容師をご提案します
                            </p>
                        </div>
                        <div className="ml-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🤖</span>
                            </div>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">AI分析中...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* カテゴリフィルター */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                    selectedCategory === 'all'
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }`}
                            >
                                すべて ({getAllAssistants().length})
                            </button>
                            {recommendations.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center ${
                                        selectedCategory === category.id
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    <span className="mr-1">{category.icon}</span>
                                    {category.title} ({category.assistants.length})
                                </button>
                            ))}
                        </div>

                        {/* 説明 */}
                        {selectedCategory !== 'all' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">
                                        {recommendations.find(cat => cat.id === selectedCategory)?.icon}
                                    </span>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {recommendations.find(cat => cat.id === selectedCategory)?.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {recommendations.find(cat => cat.id === selectedCategory)?.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* アシスタント一覧 */}
                        <div className="space-y-4">
                            {getFilteredAssistants().map(renderAssistantCard)}
                        </div>

                        {getFilteredAssistants().length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">該当するアシスタントがいません</h3>
                                <p className="text-gray-600 mb-4">別のカテゴリをお試しください</p>
                            </div>
                        )}

                        {/* フィードバック */}
                        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                おすすめの精度を向上させるために
                            </h3>
                            <div className="text-blue-800 text-sm space-y-2">
                                <p>• 予約後にレビューを書いていただくと、より正確なおすすめができます</p>
                                <p>• お気に入りにアシスタントを追加すると、好みを学習します</p>
                                <p>• 検索履歴から興味のあるスタイルを分析しています</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}