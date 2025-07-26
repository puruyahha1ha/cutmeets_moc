'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function CustomerProfilePage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '山田 太郎',
        email: 'yamada@example.com',
        phone: '090-1234-5678',
        birthdate: '1995-03-15',
        gender: 'male',
        bio: 'ヘアスタイルを通じて新しい自分を発見するのが好きです。カラーリングや新しいスタイルに挑戦するのが楽しみです。',
        preferences: {
            budget: '5000-8000',
            availableTime: 'weekend',
            preferredServices: ['cut', 'color']
        }
    });

    const bookingHistory = [
        {
            id: 1,
            date: '2024-01-20',
            hairdresser: '田中 美香',
            salon: 'SALON TOKYO',
            service: 'カット + カラー',
            price: '8,500円',
            status: 'completed',
            rating: 5
        },
        {
            id: 2,
            date: '2024-01-05',
            hairdresser: '佐藤 リナ',
            salon: 'Hair Studio Grace',
            service: 'パーマ + トリートメント',
            price: '12,000円',
            status: 'completed',
            rating: 4
        },
        {
            id: 3,
            date: '2024-02-05',
            hairdresser: '鈴木 優子',
            salon: 'Beauty Lounge',
            service: 'カット + ストレート',
            price: '7,500円',
            status: 'upcoming',
            rating: null
        }
    ];

    const favoriteHairdressers = [
        {
            id: 1,
            name: '田中 美香',
            salon: 'SALON TOKYO',
            rating: 4.8,
            specialties: ['カット', 'カラー'],
            image: '/api/placeholder/80/80'
        },
        {
            id: 2,
            name: '佐藤 リナ',
            salon: 'Hair Studio Grace',
            rating: 4.6,
            specialties: ['パーマ', 'トリートメント'],
            image: '/api/placeholder/80/80'
        }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name.startsWith('preferences.')) {
            const prefKey = name.split('.')[1];
            setProfileData(prev => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    [prefKey]: value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleServiceToggle = (serviceId: string) => {
        setProfileData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                preferredServices: prev.preferences.preferredServices.includes(serviceId)
                    ? prev.preferences.preferredServices.filter(id => id !== serviceId)
                    : [...prev.preferences.preferredServices, serviceId]
            }
        }));
    };

    const saveProfile = () => {
        console.log('Saving profile:', profileData);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
                {/* プロフィールヘッダー */}
                <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shrink-0">
                            {profileData.name.charAt(0)}
                        </div>
                        
                        <div className="flex-1 text-center sm:text-left min-w-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">{profileData.name}</h1>
                            <p className="text-sm text-pink-600 font-medium mb-2">お客様</p>
                            <p className="text-sm sm:text-base text-gray-600 mb-4 truncate">{profileData.email}</p>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm sm:text-base"
                                >
                                    プロフィール編集
                                </button>
                                <Link
                                    href="/settings"
                                    className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center text-sm sm:text-base"
                                >
                                    設定
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* タブナビゲーション */}
                <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 mb-4 sm:mb-6">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-center font-medium transition-colors text-sm sm:text-base ${
                                activeTab === 'profile'
                                    ? 'bg-pink-500 text-white rounded-l-lg sm:rounded-l-xl'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            プロフィール
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-center font-medium transition-colors text-sm sm:text-base ${
                                activeTab === 'favorites'
                                    ? 'bg-pink-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            お気に入り
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-center font-medium transition-colors text-sm sm:text-base ${
                                activeTab === 'history'
                                    ? 'bg-pink-500 text-white rounded-r-lg sm:rounded-r-xl'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            予約履歴
                        </button>
                    </div>
                </div>

                {/* プロフィールタブ */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
                        {isEditing ? (
                            <div className="space-y-4 sm:space-y-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">プロフィール編集</h2>
                                
                                {/* 基本情報 */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">名前</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm sm:text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm sm:text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm sm:text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">生年月日</label>
                                        <input
                                            type="date"
                                            name="birthdate"
                                            value={profileData.birthdate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm sm:text-base"
                                        />
                                    </div>
                                </div>

                                {/* 自己紹介 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">自己紹介</label>
                                    <textarea
                                        name="bio"
                                        value={profileData.bio}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none text-sm sm:text-base"
                                        placeholder="簡単な自己紹介をご記入ください"
                                    />
                                </div>

                                {/* 希望サービス */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">興味のあるサービス</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                        {[
                                            { id: 'cut', label: 'カット' },
                                            { id: 'color', label: 'カラー' },
                                            { id: 'perm', label: 'パーマ' },
                                            { id: 'treatment', label: 'トリートメント' },
                                            { id: 'straightening', label: 'ストレート' },
                                            { id: 'styling', label: 'セット' }
                                        ].map((service) => (
                                            <button
                                                key={service.id}
                                                type="button"
                                                onClick={() => handleServiceToggle(service.id)}
                                                className={`p-2 sm:p-3 border rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                                                    profileData.preferences.preferredServices.includes(service.id)
                                                        ? 'bg-pink-500 text-white border-pink-500'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-pink-500'
                                                }`}
                                            >
                                                {service.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 予算・時間帯 */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">希望予算</label>
                                        <select
                                            name="preferences.budget"
                                            value={profileData.preferences.budget}
                                            onChange={handleInputChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm sm:text-base"
                                        >
                                            <option value="~3000">〜3,000円</option>
                                            <option value="3000-5000">3,000円〜5,000円</option>
                                            <option value="5000-8000">5,000円〜8,000円</option>
                                            <option value="8000-12000">8,000円〜12,000円</option>
                                            <option value="12000-">12,000円〜</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">利用可能時間帯</label>
                                        <select
                                            name="preferences.availableTime"
                                            value={profileData.preferences.availableTime}
                                            onChange={handleInputChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm sm:text-base"
                                        >
                                            <option value="morning">午前中（9:00〜12:00）</option>
                                            <option value="afternoon">午後（12:00〜17:00）</option>
                                            <option value="evening">夕方以降（17:00〜21:00）</option>
                                            <option value="weekend">土日祝日</option>
                                            <option value="weekday">平日</option>
                                            <option value="flexible">いつでも可能</option>
                                        </select>
                                    </div>
                                </div>

                                {/* ボタン */}
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                                    <button
                                        onClick={saveProfile}
                                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-pink-500 text-white rounded-lg sm:rounded-xl hover:bg-pink-600 transition-colors text-sm sm:text-base"
                                    >
                                        保存する
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
                                    >
                                        キャンセル
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 sm:space-y-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">プロフィール情報</h2>
                                
                                {/* 基本情報表示 */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">名前</label>
                                        <p className="text-sm sm:text-base text-gray-900 truncate">{profileData.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">メールアドレス</label>
                                        <p className="text-sm sm:text-base text-gray-900 truncate">{profileData.email}</p>
                                    </div>
                                </div>

                                {/* 自己紹介 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">自己紹介</label>
                                    <p className="text-sm sm:text-base text-gray-900 leading-relaxed">{profileData.bio}</p>
                                </div>

                                {/* 希望サービス */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">興味のあるサービス</label>
                                    <div className="flex flex-wrap gap-2">
                                        {profileData.preferences.preferredServices.map((serviceId) => {
                                            const serviceLabels: { [key: string]: string } = {
                                                cut: 'カット',
                                                color: 'カラー',
                                                perm: 'パーマ',
                                                treatment: 'トリートメント',
                                                straightening: 'ストレート',
                                                styling: 'セット'
                                            };
                                            return (
                                                <span key={serviceId} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                                                    {serviceLabels[serviceId]}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* お気に入りタブ */}
                {activeTab === 'favorites' && (
                    <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">お気に入りのアシスタント</h2>
                        
                        <div className="space-y-3 sm:space-y-4">
                            {favoriteHairdressers.map((hairdresser) => (
                                <div key={hairdresser.id} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                            {hairdresser.name.charAt(0)}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{hairdresser.name}</h3>
                                                    <p className="text-xs sm:text-sm text-gray-600 truncate">{hairdresser.salon}</p>
                                                </div>
                                                <div className="flex items-center space-x-1 ml-2">
                                                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-gray-900">{hairdresser.rating}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {hairdresser.specialties.map((specialty, index) => (
                                                    <span key={index} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                                                        {specialty}
                                                    </span>
                                                ))}
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                                <button className="px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-xs sm:text-sm">
                                                    予約する
                                                </button>
                                                <button className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm">
                                                    詳細を見る
                                                </button>
                                                <button className="px-3 sm:px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-xs sm:text-sm">
                                                    お気に入り解除
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 予約履歴タブ */}
                {activeTab === 'history' && (
                    <div className="space-y-3 sm:space-y-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">予約履歴</h2>
                        
                        {bookingHistory.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{booking.hairdresser}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">{booking.salon}</p>
                                    </div>
                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                                        booking.status === 'completed' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {booking.status === 'completed' ? '完了' : '予約中'}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                                    <div>
                                        <span className="text-xs sm:text-sm text-gray-500">日時</span>
                                        <p className="font-medium text-sm sm:text-base">{booking.date}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs sm:text-sm text-gray-500">サービス</span>
                                        <p className="font-medium text-sm sm:text-base">{booking.service}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs sm:text-sm text-gray-500">料金</span>
                                        <p className="font-medium text-pink-600 text-sm sm:text-base">{booking.price}</p>
                                    </div>
                                </div>

                                {booking.status === 'completed' && booking.rating && (
                                    <div className="flex items-center space-x-2 mb-4">
                                        <span className="text-xs sm:text-sm text-gray-500">評価:</span>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <svg 
                                                    key={i} 
                                                    className={`w-3 h-3 sm:w-4 sm:h-4 ${i < booking.rating! ? 'fill-current' : 'text-gray-300'}`} 
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                    {booking.status === 'upcoming' ? (
                                        <>
                                            <button className="px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-xs sm:text-sm">
                                                変更・キャンセル
                                            </button>
                                            <button className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm">
                                                詳細を見る
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-xs sm:text-sm">
                                                再予約する
                                            </button>
                                            <button className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm">
                                                レビューを見る
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}