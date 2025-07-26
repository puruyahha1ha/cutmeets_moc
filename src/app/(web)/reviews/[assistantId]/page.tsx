'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../_components/providers/AuthProvider';

interface Review {
    id: string;
    userId: string;
    userName: string;
    userInitial: string;
    rating: number;
    title: string;
    content: string;
    service: string;
    date: string;
    verified: boolean;
    helpful: number;
    images?: string[];
    response?: {
        content: string;
        date: string;
        assistantName: string;
    };
}

interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

export default function ReviewsPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
    const [filterBy, setFilterBy] = useState<'all' | '5' | '4' | '3' | '2' | '1' | 'verified'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [assistantName, setAssistantName] = useState('');

    const assistantId = params.assistantId as string;

    useEffect(() => {
        // モックデータ
        const mockReviews: Review[] = [
            {
                id: 'rev_1',
                userId: 'user_1',
                userName: '田中**',
                userInitial: '田',
                rating: 5,
                title: '丁寧で素晴らしい技術！',
                content: 'カットがとても上手で、思った通りのスタイルにしてもらえました。価格も手頃で、また利用したいと思います。お話も楽しくて、リラックスできました。',
                service: 'カット',
                date: '2024-01-10',
                verified: true,
                helpful: 12,
                images: ['/api/placeholder/200/200'],
                response: {
                    content: 'ありがとうございました！お気に入りいただけて嬉しいです。またのご来店をお待ちしております。',
                    date: '2024-01-11',
                    assistantName: '田中 美香'
                }
            },
            {
                id: 'rev_2',
                userId: 'user_2',
                userName: '佐藤**',
                userInitial: '佐',
                rating: 4,
                title: 'コスパが良い',
                content: 'アシスタント美容師さんということで少し不安でしたが、技術はしっかりしていました。時間も予定通りで満足です。',
                service: 'カット',
                date: '2024-01-08',
                verified: true,
                helpful: 8,
            },
            {
                id: 'rev_3',
                userId: 'user_3',
                userName: '山田**',
                userInitial: '山',
                rating: 5,
                title: 'カラーが綺麗に仕上がりました',
                content: 'カラーの技術が高く、思っていた以上に綺麗に仕上がりました。アフターケアの説明も丁寧でした。',
                service: 'カラー',
                date: '2024-01-05',
                verified: true,
                helpful: 15,
            },
            {
                id: 'rev_4',
                userId: 'user_4',
                userName: '鈴木**',
                userInitial: '鈴',
                rating: 3,
                title: '普通でした',
                content: '可もなく不可もなく。価格相応かなという印象です。接客は丁寧でした。',
                service: 'カット',
                date: '2024-01-03',
                verified: false,
                helpful: 2,
            },
            {
                id: 'rev_5',
                userId: 'user_5',
                userName: '高橋**',
                userInitial: '高',
                rating: 5,
                title: '予約が取りやすくて助かります',
                content: '技術も良いし、何より予約が取りやすいのが助かります。アシスタント美容師さんでもこのレベルなら満足です。',
                service: 'カット',
                date: '2024-01-01',
                verified: true,
                helpful: 6,
            }
        ];

        const mockStats: ReviewStats = {
            totalReviews: 156,
            averageRating: 4.8,
            ratingDistribution: {
                5: 98,
                4: 38,
                3: 12,
                2: 5,
                1: 3
            }
        };

        setReviews(mockReviews);
        setStats(mockStats);
        setAssistantName('田中 美香');
        setIsLoading(false);
    }, [assistantId]);

    const getFilteredAndSortedReviews = () => {
        let filtered = reviews;

        // フィルタリング
        if (filterBy !== 'all') {
            if (filterBy === 'verified') {
                filtered = reviews.filter(review => review.verified);
            } else {
                const rating = parseInt(filterBy);
                filtered = reviews.filter(review => review.rating === rating);
            }
        }

        // ソート
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'oldest':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'highest':
                    return b.rating - a.rating;
                case 'lowest':
                    return a.rating - b.rating;
                case 'helpful':
                    return b.helpful - a.helpful;
                default:
                    return 0;
            }
        });

        return filtered;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    };

    const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
        const sizeClasses = {
            sm: 'w-3 h-3',
            md: 'w-4 h-4',
            lg: 'w-5 h-5'
        };

        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`${sizeClasses[size]} fill-current ${
                            i < rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    const renderRatingBar = (rating: number, count: number, total: number) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        
        return (
            <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-3">{rating}</span>
                <div className="flex">
                    {renderStars(1, 'sm')}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
        );
    };

    const filteredReviews = getFilteredAndSortedReviews();

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href={`/assistant/${assistantId}`} className="flex items-center text-gray-600 hover:text-pink-500">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            プロフィールに戻る
                        </Link>
                        <h1 className="text-lg font-semibold text-gray-900">レビュー・評価</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* 評価サマリー */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{assistantName}さんの評価</h2>
                        <div className="flex items-center justify-center space-x-4">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-pink-600 mb-1">
                                    {stats?.averageRating.toFixed(1)}
                                </div>
                                <div className="flex justify-center mb-1">
                                    {renderStars(Math.round(stats?.averageRating || 0), 'lg')}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {stats?.totalReviews}件のレビュー
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 評価分布 */}
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => 
                            renderRatingBar(
                                rating, 
                                stats?.ratingDistribution[rating as keyof typeof stats.ratingDistribution] || 0,
                                stats?.totalReviews || 0
                            )
                        )}
                    </div>
                </div>

                {/* フィルターとソート */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">フィルター</label>
                                <select
                                    value={filterBy}
                                    onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                                >
                                    <option value="all">すべて</option>
                                    <option value="5">⭐⭐⭐⭐⭐ (5つ星)</option>
                                    <option value="4">⭐⭐⭐⭐ (4つ星)</option>
                                    <option value="3">⭐⭐⭐ (3つ星)</option>
                                    <option value="2">⭐⭐ (2つ星)</option>
                                    <option value="1">⭐ (1つ星)</option>
                                    <option value="verified">認証済みのみ</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">並び替え</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                                >
                                    <option value="newest">新しい順</option>
                                    <option value="oldest">古い順</option>
                                    <option value="highest">評価高い順</option>
                                    <option value="lowest">評価低い順</option>
                                    <option value="helpful">参考になった順</option>
                                </select>
                            </div>
                        </div>
                        
                        {isAuthenticated && (
                            <Link
                                href={`/reviews/${assistantId}/write`}
                                className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-red-600 transition-all font-medium text-center"
                            >
                                レビューを書く
                            </Link>
                        )}
                    </div>
                </div>

                {/* レビューリスト */}
                <div className="space-y-6">
                    {filteredReviews.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">該当するレビューがありません</h3>
                            <p className="text-gray-600">フィルター条件を変更してお試しください</p>
                        </div>
                    ) : (
                        filteredReviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                {/* レビューヘッダー */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                                            {review.userInitial}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium text-gray-900">{review.userName}</span>
                                                {review.verified && (
                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        認証済み
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <span>{formatDate(review.date)}</span>
                                                <span>•</span>
                                                <span>{review.service}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>

                                {/* レビュー内容 */}
                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
                                    <p className="text-gray-700 leading-relaxed">{review.content}</p>
                                </div>

                                {/* 画像 */}
                                {review.images && review.images.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex space-x-2 overflow-x-auto">
                                            {review.images.map((image, index) => (
                                                <div key={index} className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* アシスタントからの返信 */}
                                {review.response && (
                                    <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                                {review.response.assistantName.charAt(0)}
                                            </div>
                                            <span className="font-medium text-pink-900">{review.response.assistantName}</span>
                                            <span className="text-sm text-pink-600">からの返信</span>
                                            <span className="text-xs text-pink-600">• {formatDate(review.response.date)}</span>
                                        </div>
                                        <p className="text-pink-800">{review.response.content}</p>
                                    </div>
                                )}

                                {/* アクション */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center space-x-4">
                                        <button className="flex items-center space-x-1 text-gray-600 hover:text-pink-500 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                            </svg>
                                            <span className="text-sm">参考になった ({review.helpful})</span>
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        レビューID: {review.id}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* ページネーション */}
                {filteredReviews.length > 0 && (
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                                前へ
                            </button>
                            <button className="px-3 py-2 bg-pink-500 text-white rounded-lg text-sm">1</button>
                            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">2</button>
                            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">3</button>
                            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                次へ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}