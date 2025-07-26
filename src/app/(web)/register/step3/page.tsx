'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function MemberRegistrationStep3() {
    const [formData, setFormData] = useState({
        profileImage: null as File | null,
        bio: '',
        preferences: {
            hairLength: '',
            hairColor: '',
            preferredServices: [] as string[],
            budget: '',
            availableTime: ''
        }
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const services = [
        { id: 'cut', label: 'カット' },
        { id: 'color', label: 'カラー' },
        { id: 'perm', label: 'パーマ' },
        { id: 'treatment', label: 'トリートメント' },
        { id: 'straightening', label: 'ストレートパーマ' },
        { id: 'styling', label: 'セット・スタイリング' }
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profileImage: file
            }));
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name.startsWith('preferences.')) {
            const prefKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    [prefKey]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleServiceToggle = (serviceId: string) => {
        setFormData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                preferredServices: prev.preferences.preferredServices.includes(serviceId)
                    ? prev.preferences.preferredServices.filter(id => id !== serviceId)
                    : [...prev.preferences.preferredServices, serviceId]
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Registration completed:', formData);
        // 登録完了処理
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-lg mx-auto px-4 py-4">
                    <div className="flex items-center justify-between relative">
                        <Link href="/register/step2" className="p-2 -ml-2">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-lg font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">会員登録</h1>
                        <div className="w-10"></div>
                    </div>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-lg mx-auto lg:max-w-2xl px-4 py-8">
                {/* ステップ表示 */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">
                                ✓
                            </div>
                            <div className="w-8 sm:w-12 lg:w-20 h-1 bg-green-500 mx-1 sm:mx-2"></div>
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">
                                ✓
                            </div>
                            <div className="w-8 sm:w-12 lg:w-20 h-1 bg-blue-500 mx-1 sm:mx-2"></div>
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">
                                3
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-xs sm:text-sm text-gray-600">ステップ 3/3 - プロフィール設定</p>
                </div>

                {/* 登録フォーム */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* プロフィール画像 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                プロフィール画像（任意）
                            </label>
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="プロフィール画像" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    )}
                                </div>
                                <label className="cursor-pointer bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base">
                                    画像を選択
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* 自己紹介 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                自己紹介（任意）
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-sm sm:text-base"
                                placeholder="簡単な自己紹介をご記入ください（200文字以内）"
                                maxLength={200}
                            />
                            <div className="mt-1 text-xs text-gray-500 text-right">
                                {formData.bio.length}/200文字
                            </div>
                        </div>

                        {/* 希望サービス */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                興味のあるサービス（複数選択可）
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                {services.map((service) => (
                                    <button
                                        key={service.id}
                                        type="button"
                                        onClick={() => handleServiceToggle(service.id)}
                                        className={`p-2 sm:p-3 border rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                                            formData.preferences.preferredServices.includes(service.id)
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                                        }`}
                                    >
                                        {service.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 希望予算 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                希望予算（任意）
                            </label>
                            <select
                                name="preferences.budget"
                                value={formData.preferences.budget}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                            >
                                <option value="">選択してください</option>
                                <option value="~3000">〜3,000円</option>
                                <option value="3000-5000">3,000円〜5,000円</option>
                                <option value="5000-8000">5,000円〜8,000円</option>
                                <option value="8000-12000">8,000円〜12,000円</option>
                                <option value="12000-">12,000円〜</option>
                            </select>
                        </div>

                        {/* 利用可能時間帯 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                利用可能時間帯（任意）
                            </label>
                            <select
                                name="preferences.availableTime"
                                value={formData.preferences.availableTime}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                            >
                                <option value="">選択してください</option>
                                <option value="morning">午前中（9:00〜12:00）</option>
                                <option value="afternoon">午後（12:00〜17:00）</option>
                                <option value="evening">夕方以降（17:00〜21:00）</option>
                                <option value="weekend">土日祝日</option>
                                <option value="weekday">平日</option>
                                <option value="flexible">いつでも可能</option>
                            </select>
                        </div>

                        {/* 登録完了ボタン */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl hover:from-pink-600 hover:to-red-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all shadow-lg"
                        >
                            登録完了
                        </button>
                    </form>
                </div>

                {/* 完了メッセージ */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        登録が完了すると、あなたにぴったりの美容師を見つけることができます
                    </p>
                </div>
            </main>

            {/* ボトムナビゲーション（SP用） */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                <div className="grid grid-cols-4 h-16">
                    <Link href="/" className="flex flex-col items-center justify-center space-y-1 text-gray-400">
                        <div className="w-6 h-6 bg-gray-300 rounded"></div>
                        <span className="text-xs">ホーム</span>
                    </Link>
                    <Link href="/search" className="flex flex-col items-center justify-center space-y-1 text-gray-400">
                        <div className="w-6 h-6 bg-gray-300 rounded"></div>
                        <span className="text-xs">検索</span>
                    </Link>
                    <Link href="/favorites" className="flex flex-col items-center justify-center space-y-1 text-gray-400">
                        <div className="w-6 h-6 bg-gray-300 rounded"></div>
                        <span className="text-xs">お気に入り</span>
                    </Link>
                    <Link href="/profile" className="flex flex-col items-center justify-center space-y-1 text-gray-400">
                        <div className="w-6 h-6 bg-gray-300 rounded"></div>
                        <span className="text-xs">マイページ</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}