'use client'

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_components/providers/AuthProvider';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // エラーをクリア
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
                general: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            email: '',
            password: '',
            general: ''
        };

        // メールアドレスのバリデーション
        if (!formData.email) {
            newErrors.email = 'メールアドレスは必須です';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = '正しいメールアドレスを入力してください';
        }

        // パスワードのバリデーション
        if (!formData.password) {
            newErrors.password = 'パスワードは必須です';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const result = await login(formData.email, formData.password);
        
        if (result.success) {
            router.push('/profile');
        } else {
            setErrors(prev => ({
                ...prev,
                general: result.error || 'ログインに失敗しました'
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-lg mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="mr-4 lg:mr-6">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-lg lg:text-xl font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">ログイン</h1>
                    </div>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-lg mx-auto px-4 py-8">
                {/* ログインフォーム */}
                <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-200 p-6 lg:p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">おかえりなさい</h2>
                        <p className="text-sm text-gray-600">アカウントにログインしてください</p>
                    </div>

                    {/* 全般エラー表示 */}
                    {errors.general && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-sm text-red-600">{errors.general}</p>
                        </div>
                    )}

                    {/* テスト用アカウント情報 */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-xs text-blue-800 font-medium mb-2">テスト用アカウント:</p>
                        <div className="text-xs text-blue-700 space-y-1">
                            <p>アシスタント美容師: assistant@test.com / password123</p>
                            <p>お客様: customer@test.com / password123</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* メールアドレス */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                                placeholder="example@email.com"
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* パスワード */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                パスワード
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                                    placeholder="パスワードを入力してください"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M21.536 15.536L8.464 8.464" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* パスワード忘れた */}
                        <div className="text-right">
                            <Link 
                                href="/forgot-password" 
                                className="text-sm text-pink-500 hover:text-pink-600 hover:underline"
                            >
                                パスワードを忘れた方はこちら
                            </Link>
                        </div>

                        {/* ログインボタン */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 text-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    ログイン中...
                                </>
                            ) : (
                                'ログイン'
                            )}
                        </button>
                    </form>
                </div>

                {/* 新規登録リンク */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        アカウントをお持ちでない方は
                        <Link href="/register" className="text-pink-500 hover:text-pink-600 hover:underline font-medium ml-1">
                            新規登録
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}