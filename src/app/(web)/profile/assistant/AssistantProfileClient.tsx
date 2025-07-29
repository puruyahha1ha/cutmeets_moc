'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import {
    ApplicationCard,
    RecruitmentPostCard,
    ReviewCard,
    EmptyState,
    type Application,
    type RecruitmentPost,
    type Booking
} from '../../_components/profile';
import { ReviewStats } from '../../_components/review';

// Adapter functions to convert API data to component format
const convertApplicationToComponent = (apiApplication: any): Application => ({
    id: parseInt(apiApplication.id),
    jobTitle: apiApplication.post.title,
    salon: `${apiApplication.customer?.name || '匿名'} (${apiApplication.customer?.age || '不明'}歳)`,
    location: apiApplication.post.assistant.salon,
    appliedDate: new Date(apiApplication.appliedAt).toISOString().split('T')[0],
    status: apiApplication.status,
    description: apiApplication.message || '',
    requirements: [
        `料金: ¥${apiApplication.post.price.toLocaleString()}`,
        `所要時間: ${apiApplication.post.duration}分`
    ],
    workingHours: new Date(apiApplication.appliedAt).toLocaleDateString('ja-JP'),
    daysPerWeek: apiApplication.feedback || ''
});

const convertRecruitmentPostToComponent = (apiPost: any): RecruitmentPost => ({
    id: parseInt(apiPost.id),
    title: apiPost.title,
    description: apiPost.description,
    serviceType: apiPost.services[0]?.toLowerCase() || 'cut',
    price: `¥${apiPost.price.toLocaleString()}`,
    duration: `${apiPost.duration}分`,
    location: `${apiPost.salon.station} ${apiPost.salon.distance}km`,
    requirements: apiPost.requirements,
    availableDates: apiPost.availableDates,
    timeSlots: apiPost.availableTimes,
    maxParticipants: apiPost.modelCount,
    currentApplications: apiPost.appliedCount,
    status: apiPost.status === 'recruiting' ? 'active' : apiPost.status === 'full' ? 'closed' : 'completed',
    postedDate: apiPost.createdAt,
    tags: [...apiPost.services, apiPost.urgency === 'urgent' ? '急募' : '通常募集']
});

interface AssistantProfileData {
    user: {
        id: string;
        name: string;
        email: string;
        userType: 'stylist';
        profile: {
            phoneNumber?: string;
            avatar?: string;
            bio?: string;
            experience?: string;
            specialties?: string[];
            salon?: {
                name: string;
                location: string;
                station: string;
                distance: number;
                phone?: string;
            };
        };
    };
    stats: {
        completedServices: number;
        averageRating: number;
        totalPosts: number;
        activeApplications: number;
    };
}

export default function AssistantProfileClient() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false);
    
    // プロフィールデータ
    const [profileData, setProfileData] = useState<AssistantProfileData | null>(null);
    
    // 応募データ（自分の募集への応募）
    const [applications, setApplications] = useState<any[]>([]);
    const [applicationsLoading, setApplicationsLoading] = useState(false);
    
    // 募集投稿データ
    const [recruitmentPosts, setRecruitmentPosts] = useState<any[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);
    
    // 予約・レビューデータ
    const [bookings, setBookings] = useState<any[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    // プロフィールデータを取得
    useEffect(() => {
        fetchProfileData();
    }, []);

    // タブ切り替え時にデータを取得
    useEffect(() => {
        if (activeTab === 'applications') {
            fetchApplications();
        } else if (activeTab === 'posts') {
            fetchRecruitmentPosts();
        } else if (activeTab === 'reviews') {
            fetchBookings();
        }
    }, [activeTab]);

    const fetchProfileData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiClient.getCurrentUser();
            if (response.success && response.data) {
                // 統計情報を計算（実際のAPIでは専用エンドポイントから取得）
                const statsData = {
                    completedServices: 156,
                    averageRating: 4.8,
                    totalPosts: 4,
                    activeApplications: 2
                };
                
                setProfileData({
                    user: response.data.user,
                    stats: statsData
                });
            } else {
                setError('プロフィール情報の取得に失敗しました');
            }
        } catch (err) {
            setError('プロフィール情報の取得中にエラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        setApplicationsLoading(true);
        
        try {
            // 仮データ（実際のAPIでは自分の投稿への応募を取得）
            setApplications([
                {
                    id: '1',
                    post: {
                        id: '1',
                        title: 'ボブカット練習のモデル募集',
                        assistant: {
                            name: '田中 美香',
                            salon: 'SALON TOKYO'
                        },
                        price: 1500,
                        duration: 90
                    },
                    customer: {
                        id: '2',
                        name: '佐藤 花子',
                        age: 26,
                        gender: 'female'
                    },
                    status: 'pending',
                    appliedAt: '2024-01-15T10:00:00Z',
                    message: 'ボブスタイルに興味があります。よろしくお願いします。',
                    additionalInfo: {
                        hairLength: '肩まで',
                        previousTreatments: 'なし',
                        allergies: 'なし'
                    }
                },
                {
                    id: '2',
                    post: {
                        id: '2',
                        title: 'カラーモデル募集',
                        assistant: {
                            name: '田中 美香',
                            salon: 'SALON TOKYO'
                        },
                        price: 3000,
                        duration: 120
                    },
                    customer: {
                        id: '3',
                        name: '山田 美咲',
                        age: 25,
                        gender: 'female'
                    },
                    status: 'accepted',
                    appliedAt: '2024-01-20T14:00:00Z',
                    message: 'グラデーションカラーに挑戦したいです。',
                    feedback: 'ご応募ありがとうございます。詳細をお打ち合わせしましょう。',
                    scheduledDate: '2024-01-25T15:00:00Z'
                }
            ]);
        } catch (err) {
            console.error('応募データ取得エラー:', err);
        } finally {
            setApplicationsLoading(false);
        }
    };

    const fetchRecruitmentPosts = async () => {
        setPostsLoading(true);
        
        try {
            // 仮データ（実際のAPIでは自分の投稿のみ取得する専用エンドポイントを作成）
            setRecruitmentPosts([
                {
                    id: '1',
                    title: 'ボブカット練習のモデルさん募集！',
                    description: 'ボブカットの技術向上のため、練習台をお願いします。丁寧にカットさせていただきます。',
                    services: ['カット'],
                    duration: 90,
                    price: 1500,
                    originalPrice: 3000,
                    discount: 50,
                    requirements: ['肩より長い髪', 'ダメージが少ない髪'],
                    modelCount: 3,
                    appliedCount: 1,
                    availableDates: ['2024-01-20', '2024-01-21', '2024-01-22'],
                    availableTimes: ['10:00-12:00', '14:00-16:00', '18:00-20:00'],
                    salon: {
                        name: 'SALON TOKYO',
                        location: '渋谷区',
                        station: '渋谷駅',
                        distance: 0.5
                    },
                    status: 'recruiting',
                    urgency: 'normal',
                    createdAt: '2024-01-15T10:00:00Z',
                    postedAt: '2時間前'
                }
            ]);
        } catch (err) {
            console.error('募集投稿データ取得エラー:', err);
        } finally {
            setPostsLoading(false);
        }
    };

    const fetchBookings = async () => {
        setBookingsLoading(true);
        
        try {
            // 予約データを取得（APIエンドポイントは実装予定）
            // const response = await apiClient.getBookings();
            // if (response.success && response.data) {
            //     setBookings(response.data.bookings);
            // }
            
            // 仮データ
            setBookings([
                {
                    id: '1',
                    date: '2024-01-20',
                    customer: '山田 太郎',
                    service: 'カット + カラー',
                    price: '8,500円',
                    status: 'completed',
                    rating: 5,
                    review: '丁寧なカウンセリングで理想通りの仕上がりでした。ありがとうございました。'
                }
            ]);
        } catch (err) {
            console.error('予約データ取得エラー:', err);
        } finally {
            setBookingsLoading(false);
        }
    };

    const handleApplicationAction = async (id: string, action: 'accept' | 'reject') => {
        try {
            const status = action === 'accept' ? 'accepted' : 'rejected';
            const response = await apiClient.updateApplicationStatus(id, {
                status,
                feedback: action === 'reject' ? '応募条件に合わないため' : undefined,
                scheduledDate: action === 'accept' ? new Date().toISOString() : undefined
            });
            
            if (response.success) {
                // 応募リストを更新
                setApplications(prev => prev.map(app =>
                    app.id === id ? { ...app, status } : app
                ));
            }
        } catch (err) {
            console.error('応募ステータス更新エラー:', err);
        }
    };

    const handlePostAction = async (id: string, action: 'stop' | 'delete' | 'edit') => {
        if (action === 'stop') {
            try {
                const response = await apiClient.updateRecruitmentPost(id, { status: 'closed' });
                if (response.success) {
                    fetchRecruitmentPosts();
                }
            } catch (err) {
                console.error('募集停止エラー:', err);
            }
        } else if (action === 'delete') {
            if (confirm('この募集を削除しますか？')) {
                try {
                    const response = await apiClient.deleteRecruitmentPost(id);
                    if (response.success) {
                        fetchRecruitmentPosts();
                    }
                } catch (err) {
                    console.error('募集削除エラー:', err);
                }
            }
        } else if (action === 'edit') {
            // 編集画面へ遷移
            router.push(`/recruitment/${id}/edit`);
        }
    };

    const saveProfile = async () => {
        if (!profileData) return;
        
        try {
            const response = await apiClient.updateUserProfile(profileData.user.id, {
                name: profileData.user.name,
                profile: profileData.user.profile
            });
            
            if (response.success) {
                setIsEditing(false);
                fetchProfileData();
            }
        } catch (err) {
            console.error('プロフィール更新エラー:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'プロフィール情報が見つかりません'}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    >
                        ログインページへ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
                {/* プロフィールヘッダー */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-2xl">
                            {profileData.user.name.charAt(0)}
                        </div>
                        <h1 className="text-lg font-bold text-gray-900 mb-1">{profileData.user.name}</h1>
                        <p className="text-sm text-gray-600 mb-3">
                            {profileData.user.profile.salon?.name || 'フリーランス'}
                        </p>

                        {/* 統計情報 */}
                        <div className="flex justify-center space-x-8 mb-4">
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{profileData.stats.completedServices}</div>
                                <div className="text-xs text-gray-500">完了サービス</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{profileData.stats.averageRating}</div>
                                <div className="text-xs text-gray-500">評価</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{profileData.stats.totalPosts}</div>
                                <div className="text-xs text-gray-500">募集中</div>
                            </div>
                        </div>

                        {/* 新規募集ボタン */}
                        <button
                            onClick={() => router.push('/recruitment/new')}
                            className="w-full bg-pink-500 text-white py-2.5 px-4 rounded-lg font-medium text-sm mb-4 hover:bg-pink-600 transition-colors"
                        >
                            + 新規募集を作成
                        </button>

                        {/* 設定ボタン */}
                        <div>
                            <Link
                                href="/settings"
                                className="w-full block px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center text-sm"
                            >
                                設定
                            </Link>
                        </div>
                    </div>
                </div>

                {/* タブナビゲーション */}
                <div className="bg-white rounded-lg border border-gray-200 mb-4">
                    <div className="flex">
                        {['profile', 'applications', 'posts', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-3 py-3 text-center font-medium transition-colors text-sm relative ${
                                    activeTab === tab
                                        ? 'text-green-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {tab === 'profile' && 'プロフィール'}
                                {tab === 'applications' && '応募'}
                                {tab === 'posts' && '募集'}
                                {tab === 'reviews' && '口コミ'}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* プロフィールタブ */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
                        {isEditing ? (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">プロフィール編集</h2>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">名前</label>
                                        <input
                                            type="text"
                                            value={profileData?.user.name || ''}
                                            onChange={(e) => setProfileData(prev => prev ? {
                                                ...prev,
                                                user: { ...prev.user, name: e.target.value }
                                            } : null)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">経験年数</label>
                                        <input
                                            type="text"
                                            value={profileData?.user.profile.experience || ''}
                                            onChange={(e) => setProfileData(prev => prev ? {
                                                ...prev,
                                                user: {
                                                    ...prev.user,
                                                    profile: { ...prev.user.profile, experience: e.target.value }
                                                }
                                            } : null)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">自己紹介</label>
                                    <textarea
                                        value={profileData?.user.profile.bio || ''}
                                        onChange={(e) => setProfileData(prev => prev ? {
                                            ...prev,
                                            user: {
                                                ...prev.user,
                                                profile: { ...prev.user.profile, bio: e.target.value }
                                            }
                                        } : null)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                                        placeholder="自己紹介や得意分野について記入してください"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">得意分野</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {['カット', 'カラー', 'パーマ', 'トリートメント', 'ストレート', 'セット'].map((specialty) => (
                                            <button
                                                key={specialty}
                                                type="button"
                                                onClick={() => {
                                                    const currentSpecialties = profileData?.user.profile.specialties || [];
                                                    const newSpecialties = currentSpecialties.includes(specialty)
                                                        ? currentSpecialties.filter(s => s !== specialty)
                                                        : [...currentSpecialties, specialty];
                                                    
                                                    setProfileData(prev => prev ? {
                                                        ...prev,
                                                        user: {
                                                            ...prev.user,
                                                            profile: { ...prev.user.profile, specialties: newSpecialties }
                                                        }
                                                    } : null);
                                                }}
                                                className={`p-2 border rounded-lg text-sm font-medium transition-colors ${
                                                    profileData?.user.profile.specialties?.includes(specialty)
                                                        ? 'bg-pink-500 text-white border-pink-500'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-pink-500'
                                                }`}
                                            >
                                                {specialty}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={saveProfile}
                                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                                    >
                                        保存
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        キャンセル
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* 基本情報 */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">基本情報</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">メール</span>
                                            <span className="text-sm font-medium">{profileData.user.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">経験年数</span>
                                            <span className="text-sm font-medium">
                                                {profileData.user.profile.experience || '未設定'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">所属</span>
                                            <span className="text-sm font-medium">
                                                {profileData.user.profile.salon?.name || 'フリーランス'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 自己紹介 */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">自己紹介</h3>
                                    <p className="text-sm text-gray-900 leading-relaxed">
                                        {profileData.user.profile.bio || '自己紹介文が設定されていません'}
                                    </p>
                                </div>

                                {/* 編集ボタン */}
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    プロフィールを編集
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* 応募タブ */}
                {activeTab === 'applications' && (
                    <div className="space-y-4">
                        {applicationsLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                            </div>
                        ) : applications.length > 0 ? (
                            applications.map((application) => (
                                <ApplicationCard
                                    key={application.id}
                                    application={convertApplicationToComponent(application)}
                                    onAccept={(id) => handleApplicationAction(id.toString(), 'accept')}
                                    onReject={(id) => handleApplicationAction(id.toString(), 'reject')}
                                    onViewDetails={(id) => router.push(`/applications/${id}`)}
                                    onChat={(id) => console.log('チャット機能は実装予定')}
                                    variant="compact"
                                    interactive={true}
                                />
                            ))
                        ) : (
                            <EmptyState
                                title="応募がありません"
                                description="新しいカットモデル募集を作成して応募を集めましょう"
                                actionText="新規募集を作成"
                                onAction={() => router.push('/recruitment/new')}
                                icon="document"
                                variant="application"
                            />
                        )}
                    </div>
                )}

                {/* 募集タブ */}
                {activeTab === 'posts' && (
                    <div className="space-y-4">
                        {postsLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                            </div>
                        ) : recruitmentPosts.length > 0 ? (
                            recruitmentPosts.map((post) => (
                                <RecruitmentPostCard
                                    key={post.id}
                                    post={convertRecruitmentPostToComponent(post)}
                                    onViewApplicants={(id) => router.push(`/recruitment/${id}/applicants`)}
                                    onEdit={(id) => handlePostAction(id.toString(), 'edit')}
                                    onStop={(id) => handlePostAction(id.toString(), 'stop')}
                                    onDelete={(id) => handlePostAction(id.toString(), 'delete')}
                                />
                            ))
                        ) : (
                            <EmptyState
                                title="募集投稿がありません"
                                description="練習モデルやモニターを募集してみましょう"
                                actionText="新規募集を作成"
                                onAction={() => router.push('/recruitment/new')}
                                icon="plus"
                                variant="post"
                            />
                        )}
                    </div>
                )}

                {/* 口コミタブ */}
                {activeTab === 'reviews' && (
                    <div className="space-y-6">
                        {/* レビュー統計 */}
                        <ReviewStats assistantId={profileData?.user.id || ''} />
                        
                        {/* レビュー一覧 */}
                        <div className="space-y-4">
                            {bookingsLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                                </div>
                            ) : bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <ReviewCard
                                        key={booking.id}
                                        booking={booking as Booking}
                                    />
                                ))
                            ) : (
                                <EmptyState
                                    title="レビューがありません"
                                    description="お客様からのレビューがここに表示されます"
                                    icon="star"
                                    variant="review"
                                />
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}