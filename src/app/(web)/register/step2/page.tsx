'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function MemberRegistrationStep2() {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        lastNameKana: '',
        firstNameKana: '',
        phoneNumber: '',
        birthdate: '',
        gender: ''
    });
    const [errors, setErrors] = useState({
        lastName: '',
        firstName: '',
        lastNameKana: '',
        firstNameKana: '',
        phoneNumber: '',
        birthdate: '',
        gender: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // エラーをクリア
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            lastName: '',
            firstName: '',
            lastNameKana: '',
            firstNameKana: '',
            phoneNumber: '',
            birthdate: '',
            gender: ''
        };

        // 姓のバリデーション
        if (!formData.lastName) {
            newErrors.lastName = '姓は必須です';
        }

        // 名のバリデーション
        if (!formData.firstName) {
            newErrors.firstName = '名は必須です';
        }

        // 姓（カナ）のバリデーション
        if (!formData.lastNameKana) {
            newErrors.lastNameKana = '姓（カナ）は必須です';
        } else if (!/^[ァ-ヶー]+$/.test(formData.lastNameKana)) {
            newErrors.lastNameKana = 'カタカナで入力してください';
        }

        // 名（カナ）のバリデーション
        if (!formData.firstNameKana) {
            newErrors.firstNameKana = '名（カナ）は必須です';
        } else if (!/^[ァ-ヶー]+$/.test(formData.firstNameKana)) {
            newErrors.firstNameKana = 'カタカナで入力してください';
        }

        // 電話番号のバリデーション
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = '電話番号は必須です';
        } else if (!/^0\d{1,4}-\d{1,4}-\d{4}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = '正しい電話番号を入力してください（例：090-1234-5678）';
        }

        // 生年月日のバリデーション
        if (!formData.birthdate) {
            newErrors.birthdate = '生年月日は必須です';
        }

        // 性別のバリデーション
        if (!formData.gender) {
            newErrors.gender = '性別は必須です';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);
            // 次のステップに進む処理
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-lg mx-auto px-4 py-4">
                    <div className="flex items-center justify-between relative">
                        <Link href="/register" className="p-2 -ml-2">
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
                            <div className="w-8 sm:w-12 lg:w-20 h-1 bg-blue-500 mx-1 sm:mx-2"></div>
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">
                                2
                            </div>
                            <div className="w-8 sm:w-12 lg:w-20 h-1 bg-gray-300 mx-1 sm:mx-2"></div>
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs sm:text-sm">
                                3
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-xs sm:text-sm text-gray-600">ステップ 2/3 - 基本情報入力</p>
                </div>

                {/* 登録フォーム */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* 姓名 */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    姓
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                                    placeholder="山田"
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.lastName}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    名
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                                    placeholder="太郎"
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.firstName}</p>
                                )}
                            </div>
                        </div>

                        {/* 姓名（カナ） */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    姓（カナ）
                                </label>
                                <input
                                    type="text"
                                    name="lastNameKana"
                                    value={formData.lastNameKana}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                                    placeholder="ヤマダ"
                                />
                                {errors.lastNameKana && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.lastNameKana}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    名（カナ）
                                </label>
                                <input
                                    type="text"
                                    name="firstNameKana"
                                    value={formData.firstNameKana}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                                    placeholder="タロウ"
                                />
                                {errors.firstNameKana && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.firstNameKana}</p>
                                )}
                            </div>
                        </div>

                        {/* 電話番号 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                電話番号
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                                placeholder="090-1234-5678"
                            />
                            {errors.phoneNumber && (
                                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.phoneNumber}</p>
                            )}
                        </div>

                        {/* 生年月日 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                生年月日
                            </label>
                            <input
                                type="date"
                                name="birthdate"
                                value={formData.birthdate}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                            />
                            {errors.birthdate && (
                                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.birthdate}</p>
                            )}
                        </div>

                        {/* 性別 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                性別
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                            >
                                <option value="">選択してください</option>
                                <option value="male">男性</option>
                                <option value="female">女性</option>
                                <option value="other">その他</option>
                                <option value="not_specified">回答しない</option>
                            </select>
                            {errors.gender && (
                                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.gender}</p>
                            )}
                        </div>

                        {/* 次へ進むボタン */}
                        <Link
                            href="/register/step3"
                            className="w-full bg-blue-500 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors block text-center"
                        >
                            次へ進む
                        </Link>
                    </form>
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