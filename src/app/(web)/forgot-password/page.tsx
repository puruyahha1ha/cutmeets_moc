'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            setError('メールアドレスを入力してください');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('正しいメールアドレスを入力してください');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // TODO: 実際のAPI呼び出しに置き換える
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // モック処理：常に成功とする
            setIsSubmitted(true);
        } catch (error) {
            setError('パスワードリセットメールの送信に失敗しました。しばらく後にお試しください。');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* ヘッダー */}
                <header className="bg-white border-b border-gray-200">
                    <div className="max-w-lg mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/login" className="mr-4 lg:mr-6">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <h1 className="text-lg lg:text-xl font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">パスワードリセット</h1>
                        </div>
                    </div>
                </header>

                {/* 送信完了画面 */}
                <main className="max-w-lg mx-auto px-4 py-8">
                    <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-200 p-6 lg:p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        
                        <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4">
                            メールを送信しました
                        </h2>
                        
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            <span className="font-medium">{email}</span> にパスワードリセット用のリンクを送信しました。
                            <br />
                            メールをご確認いただき、リンクをクリックしてパスワードを再設定してください。
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>メールが届かない場合：</strong>
                                <br />
                                • 迷惑メールフォルダをご確認ください
                                <br />
                                • 数分経ってもメールが届かない場合は、再度お試しください
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setEmail('');
                                }}
                                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                            >
                                別のメールアドレスで再送信
                            </button>
                            
                            <Link
                                href="/login"
                                className="block w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-4 rounded-xl hover:from-pink-600 hover:to-red-600 transition-all font-medium text-center"
                            >
                                ログイン画面に戻る
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-lg mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/login" className="mr-4 lg:mr-6">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-lg lg:text-xl font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">パスワードリセット</h1>
                    </div>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-lg mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-200 p-6 lg:p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">パスワードをお忘れですか？</h2>
                        <p className="text-sm text-gray-600">
                            登録時に使用したメールアドレスを入力してください。
                            <br />
                            パスワード再設定用のリンクをお送りします。
                        </p>
                    </div>

                    {/* エラー表示 */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* メールアドレス */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                                placeholder="example@email.com"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* 送信ボタン */}
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
                                    送信中...
                                </>
                            ) : (
                                'パスワードリセットメールを送信'
                            )}
                        </button>
                    </form>

                    {/* ログインリンク */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            パスワードを思い出した方は
                            <Link href="/login" className="text-pink-500 hover:text-pink-600 hover:underline font-medium ml-1">
                                ログイン
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}