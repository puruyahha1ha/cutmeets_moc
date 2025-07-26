'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function AssistantProfilePage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '田中 美香',
        email: 'tanaka.mika@example.com',
        phone: '090-9876-5432',
        birthdate: '1988-07-22',
        gender: 'female',
        bio: '美容師歴8年。お客様一人ひとりに合ったスタイルを提案し、髪質やライフスタイルに合わせたカットとカラーを得意としています。丁寧なカウンセリングと技術で理想のヘアスタイルを実現します。',
        license: '美容師免許',
        experience: '8年',
        salon: 'Hair Salon TOKYO',
        location: '東京都渋谷区',
        specialties: ['cut', 'color', 'treatment'],
        certifications: ['カラーリスト検定1級', 'ヘアケアマイスター'],
        priceRange: '4000-12000',
        workingHours: {
            start: '10:00',
            end: '20:00'
        },
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        stats: {
            totalReviews: 156,
            averageRating: 4.8,
            totalCustomers: 3
        }
    });

    const [portfolio, setPortfolio] = useState([
        {
            id: 1,
            image: '/api/placeholder/300/400',
            title: 'ナチュラルボブ',
            description: 'お手入れしやすいナチュラルなボブスタイル',
            tags: ['カット', 'ナチュラル']
        },
        {
            id: 2,
            image: '/api/placeholder/300/400',
            title: 'グラデーションカラー',
            description: 'トレンドのグラデーションカラー',
            tags: ['カラー', 'グラデーション']
        },
        {
            id: 3,
            image: '/api/placeholder/300/400',
            title: 'レイヤードカット',
            description: '動きのあるレイヤードスタイル',
            tags: ['カット', 'レイヤー']
        }
    ]);

    const bookingHistory = [
        {
            id: 1,
            date: '2024-01-20',
            customer: '山田 太郎',
            service: 'カット + カラー',
            price: '8,500円',
            status: 'completed',
            rating: 5,
            review: '丁寧なカウンセリングで理想通りの仕上がりでした。ありがとうございました。'
        },
        {
            id: 2,
            date: '2024-01-18',
            customer: '佐藤 花子',
            service: 'パーマ + トリートメント',
            price: '12,000円',
            status: 'completed',
            rating: 5,
            review: '初めてのパーマでしたが、とても自然な仕上がりで大満足です。'
        },
        {
            id: 3,
            date: '2024-02-05',
            customer: '鈴木 美咲',
            service: 'カット + ストレート',
            price: '7,500円',
            status: 'upcoming',
            rating: null,
            review: null
        }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name.startsWith('workingHours.')) {
            const timeKey = name.split('.')[1];
            setProfileData(prev => ({
                ...prev,
                workingHours: {
                    ...prev.workingHours,
                    [timeKey]: value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSpecialtyToggle = (specialtyId: string) => {
        setProfileData(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialtyId)
                ? prev.specialties.filter(id => id !== specialtyId)
                : [...prev.specialties, specialtyId]
        }));
    };

    const handleDayToggle = (day: string) => {
        setProfileData(prev => ({
            ...prev,
            availableDays: prev.availableDays.includes(day)
                ? prev.availableDays.filter(d => d !== day)
                : [...prev.availableDays, day]
        }));
    };

    const saveProfile = () => {
        console.log('Saving assistant profile:', profileData);
        setIsEditing(false);
    };

    const [newPost, setNewPost] = useState({
        images: [] as string[],
        title: '',
        description: '',
        tags: [] as string[],
        serviceType: '',
        duration: '',
        price: ''
    });

    const serviceTypes = [
        { id: 'cut', label: 'カット' },
        { id: 'color', label: 'カラー' },
        { id: 'perm', label: 'パーマ' },
        { id: 'treatment', label: 'トリートメント' },
        { id: 'straightening', label: 'ストレート' },
        { id: 'styling', label: 'セット' }
    ];

    const styleTags = [
        'ショート', 'ボブ', 'ミディアム', 'ロング', 'ナチュラル', 'モード', 
        'フェミニン', 'カジュアル', 'エレガント', 'クール', 'キュート', '大人可愛い'
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages: string[] = [];
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        newImages.push(event.target.result as string);
                        if (newImages.length === files.length) {
                            setNewPost(prev => ({
                                ...prev,
                                images: [...prev.images, ...newImages].slice(0, 10)
                            }));
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setNewPost(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleTagToggle = (tag: string) => {
        setNewPost(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const handlePostSubmit = () => {
        if (newPost.images.length === 0 || !newPost.title.trim()) {
            alert('画像とタイトルは必須です。');
            return;
        }

        const newPortfolioItem = {
            id: portfolio.length + 1,
            image: newPost.images[0],
            title: newPost.title,
            description: newPost.description,
            tags: newPost.tags,
            serviceType: newPost.serviceType,
            duration: newPost.duration,
            price: newPost.price,
            images: newPost.images,
            createdAt: new Date().toISOString()
        };

        setPortfolio(prev => [newPortfolioItem, ...prev]);
        
        setNewPost({
            images: [],
            title: '',
            description: '',
            tags: [],
            serviceType: '',
            duration: '',
            price: ''
        });
        
        setShowPostModal(false);
        setActiveTab('portfolio');
        
        alert('投稿が完了しました！');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
                {/* プロフィールヘッダー */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-2xl">
                            {profileData.name.charAt(0)}
                        </div>
                        <h1 className="text-lg font-bold text-gray-900 mb-1">{profileData.name}</h1>
                        <p className="text-sm text-gray-600 mb-3">{profileData.salon}認定技術者</p>
                        
                        {/* 統計情報 */}
                        <div className="flex justify-center space-x-8 mb-4">
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{profileData.stats.totalReviews}</div>
                                <div className="text-xs text-gray-500">完了予約</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{profileData.stats.averageRating}</div>
                                <div className="text-xs text-gray-500">平均評価</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{profileData.stats.totalCustomers}</div>
                                <div className="text-xs text-gray-500">累計顧客</div>
                            </div>
                        </div>
                        
                        {/* 新規投稿ボタン */}
                        <button 
                            onClick={() => setShowPostModal(true)}
                            className="w-full bg-blue-500 text-white py-2.5 px-4 rounded-lg font-medium text-sm mb-4 hover:bg-blue-600 transition-colors"
                        >
                            + 新規投稿
                        </button>
                        
                        {/* 編集・設定ボタン */}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                                プロフィール編集
                            </button>
                            <Link
                                href="/settings"
                                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center text-sm"
                            >
                                設定
                            </Link>
                        </div>
                    </div>
                </div>

                {/* タブナビゲーション */}
                <div className="bg-white rounded-lg border border-gray-200 mb-4">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 px-3 py-3 text-center font-medium transition-colors text-sm relative ${
                                activeTab === 'profile'
                                    ? 'text-green-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            プロフィール
                            {activeTab === 'profile' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('portfolio')}
                            className={`flex-1 px-3 py-3 text-center font-medium transition-colors text-sm relative ${
                                activeTab === 'portfolio'
                                    ? 'text-green-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            投稿
                            {activeTab === 'portfolio' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
                            )}
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                3
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`flex-1 px-3 py-3 text-center font-medium transition-colors text-sm relative ${
                                activeTab === 'bookings'
                                    ? 'text-green-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            口コミ
                            {activeTab === 'bookings' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
                            )}
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
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm sm:text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm sm:text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">所属サロン</label>
                                        <input
                                            type="text"
                                            name="salon"
                                            value={profileData.salon}
                                            onChange={handleInputChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm sm:text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">勤務地</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={profileData.location}
                                            onChange={handleInputChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm sm:text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">経験年数</label>
                                        <input
                                            type="text"
                                            name="experience"
                                            value={profileData.experience}
                                            onChange={handleInputChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm sm:text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">料金帯</label>
                                        <select
                                            name="priceRange"
                                            value={profileData.priceRange}
                                            onChange={handleInputChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm sm:text-base"
                                        >
                                            <option value="3000-6000">3,000円〜6,000円</option>
                                            <option value="4000-8000">4,000円〜8,000円</option>
                                            <option value="6000-12000">6,000円〜12,000円</option>
                                            <option value="8000-15000">8,000円〜15,000円</option>
                                        </select>
                                    </div>
                                </div>

                                {/* 自己紹介 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">自己紹介・アピールポイント</label>
                                    <textarea
                                        name="bio"
                                        value={profileData.bio}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none text-sm sm:text-base"
                                        placeholder="経験や得意分野、お客様へのメッセージをご記入ください"
                                    />
                                </div>

                                {/* 得意分野 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">得意分野</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                        {[
                                            { id: 'cut', label: 'カット' },
                                            { id: 'color', label: 'カラー' },
                                            { id: 'perm', label: 'パーマ' },
                                            { id: 'treatment', label: 'トリートメント' },
                                            { id: 'straightening', label: 'ストレート' },
                                            { id: 'styling', label: 'セット' }
                                        ].map((specialty) => (
                                            <button
                                                key={specialty.id}
                                                type="button"
                                                onClick={() => handleSpecialtyToggle(specialty.id)}
                                                className={`p-2 sm:p-3 border rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                                                    profileData.specialties.includes(specialty.id)
                                                        ? 'bg-purple-500 text-white border-purple-500'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
                                                }`}
                                            >
                                                {specialty.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 勤務時間 */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">勤務開始時間</label>
                                        <input
                                            type="time"
                                            name="workingHours.start"
                                            value={profileData.workingHours.start}
                                            onChange={handleInputChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm sm:text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">勤務終了時間</label>
                                        <input
                                            type="time"
                                            name="workingHours.end"
                                            value={profileData.workingHours.end}
                                            onChange={handleInputChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm sm:text-base"
                                        />
                                    </div>
                                </div>

                                {/* 勤務可能日 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">勤務可能日</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                                        {[
                                            { id: 'monday', label: '月' },
                                            { id: 'tuesday', label: '火' },
                                            { id: 'wednesday', label: '水' },
                                            { id: 'thursday', label: '木' },
                                            { id: 'friday', label: '金' },
                                            { id: 'saturday', label: '土' },
                                            { id: 'sunday', label: '日' }
                                        ].map((day) => (
                                            <button
                                                key={day.id}
                                                type="button"
                                                onClick={() => handleDayToggle(day.id)}
                                                className={`p-2 sm:p-3 border rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                                    profileData.availableDays.includes(day.id)
                                                        ? 'bg-purple-500 text-white border-purple-500'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
                                                }`}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* ボタン */}
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                                    <button
                                        onClick={saveProfile}
                                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-500 text-white rounded-lg sm:rounded-xl hover:bg-purple-600 transition-colors text-sm sm:text-base"
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
                                
                                {/* 基本情報 */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">基本情報</label>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">所属サロン</span>
                                                <span className="text-sm font-medium text-gray-900">{profileData.salon}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">対応可能時間</span>
                                                <span className="text-sm font-medium text-gray-900">平日 {profileData.workingHours.start}～{profileData.workingHours.end}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">料金目安</span>
                                                <span className="text-sm font-medium text-gray-900">¥{profileData.priceRange.replace('-', '～¥')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 得意スタイル */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">得意スタイル</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {profileData.specialties.map((specialtyId) => {
                                                const specialtyLabels: { [key: string]: string } = {
                                                    cut: 'ショートカット',
                                                    color: 'カラーリング',
                                                    treatment: 'トリートメント',
                                                    straightening: 'ストレート',
                                                    styling: 'セット'
                                                };
                                                const colors = ['bg-blue-100 text-blue-800', 'bg-pink-100 text-pink-800', 'bg-green-100 text-green-800', 'bg-purple-100 text-purple-800'];
                                                return (
                                                    <span key={specialtyId} className={`${colors[Math.floor(Math.random() * colors.length)]} px-3 py-2 rounded-lg text-sm text-center font-medium`}>
                                                        {specialtyLabels[specialtyId]}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 自己紹介 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">自己紹介</label>
                                        <p className="text-sm text-gray-900 leading-relaxed">{profileData.bio}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ポートフォリオタブ */}
                {activeTab === 'portfolio' && (
                    <div className="space-y-4">
                        <div className="text-center py-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">ポートフォリオ</h2>
                            <p className="text-sm text-gray-600 mb-6">あなたの作品を投稿してアピールしましょう</p>
                            <button 
                                onClick={() => setShowPostModal(true)}
                                className="bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors"
                            >
                                写真を投稿する
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-1">
                            {portfolio.map((work) => (
                                <div key={work.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                                        <p className="text-xs truncate">{work.title}</p>
                                    </div>
                                </div>
                            ))}
                            {/* 空のグリッドアイテムを追加して3x3グリッドを埋める */}
                            {Array.from({ length: Math.max(0, 6 - portfolio.length) }, (_, index) => (
                                <div key={`empty-${index}`} className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-center py-4">
                            <button className="text-blue-500 text-sm font-medium">
                                すべての作品を見る →
                            </button>
                        </div>
                    </div>
                )}

                {/* 予約管理タブ */}
                {activeTab === 'bookings' && (
                    <div className="space-y-3 sm:space-y-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">予約管理</h2>
                        
                        {bookingHistory.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{booking.customer}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">{booking.date}</p>
                                    </div>
                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                                        booking.status === 'completed' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {booking.status === 'completed' ? '完了' : '予約中'}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                    <div>
                                        <span className="text-xs sm:text-sm text-gray-500">サービス</span>
                                        <p className="font-medium text-sm sm:text-base">{booking.service}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs sm:text-sm text-gray-500">料金</span>
                                        <p className="font-medium text-purple-600 text-sm sm:text-base">{booking.price}</p>
                                    </div>
                                </div>

                                {booking.status === 'completed' && booking.rating && (
                                    <div className="border-t pt-4">
                                        <div className="flex items-center space-x-2 mb-2">
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
                                        {booking.review && (
                                            <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                "{booking.review}"
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* 新規投稿モーダル */}
                {showPostModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">新規投稿</h2>
                                <button
                                    onClick={() => setShowPostModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* 画像アップロード */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        写真を追加 (最大10枚)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        {newPost.images.length > 0 ? (
                                            <div className="grid grid-cols-3 gap-2 mb-4">
                                                {newPost.images.map((image, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={image}
                                                            alt={`Upload ${index + 1}`}
                                                            className="w-full h-20 object-cover rounded"
                                                        />
                                                        <button
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-gray-500 text-sm">写真をアップロードしてください</p>
                                            </div>
                                        )}
                                        
                                        {newPost.images.length < 10 && (
                                            <label className="block">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                                <div className="bg-blue-500 text-white text-center py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                                                    写真を選択
                                                </div>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* タイトル */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        タイトル *
                                    </label>
                                    <input
                                        type="text"
                                        value={newPost.title}
                                        onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="例: ナチュラルボブスタイル"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                {/* 説明文 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        説明文
                                    </label>
                                    <textarea
                                        value={newPost.description}
                                        onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="スタイルのポイントや使用した技術について..."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                    />
                                </div>

                                {/* サービス種類 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        サービス種類
                                    </label>
                                    <select
                                        value={newPost.serviceType}
                                        onChange={(e) => setNewPost(prev => ({ ...prev, serviceType: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="">選択してください</option>
                                        {serviceTypes.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 所要時間と料金 */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            所要時間
                                        </label>
                                        <input
                                            type="text"
                                            value={newPost.duration}
                                            onChange={(e) => setNewPost(prev => ({ ...prev, duration: e.target.value }))}
                                            placeholder="例: 90分"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            料金
                                        </label>
                                        <input
                                            type="text"
                                            value={newPost.price}
                                            onChange={(e) => setNewPost(prev => ({ ...prev, price: e.target.value }))}
                                            placeholder="例: 8,500円"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* スタイルタグ */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        スタイルタグ
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {styleTags.map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => handleTagToggle(tag)}
                                                className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                                                    newPost.tags.includes(tag)
                                                        ? 'bg-blue-500 text-white border-blue-500'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                                                }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 投稿ボタン */}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={() => setShowPostModal(false)}
                                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        onClick={handlePostSubmit}
                                        disabled={newPost.images.length === 0 || !newPost.title.trim()}
                                        className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        投稿する
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}