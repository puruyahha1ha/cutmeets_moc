'use client'

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserTypeSelection() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<'assistant' | 'customer' | null>(null);

    const handleTypeSelect = (type: 'assistant' | 'customer') => {
        setSelectedType(type);
    };

    const handleContinue = () => {
        if (selectedType) {
            router.push(`/register/${selectedType}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* ヘッダー */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-pink-500">Cutmeets</h1>
                    </Link>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                        アカウントタイプを選択
                    </h2>
                    <p className="text-gray-600">
                        あなたに最適な体験を提供するため、利用目的を教えてください
                    </p>
                </div>

                {/* ユーザータイプ選択カード */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* アシスタント美容師 */}
                    <div
                        onClick={() => handleTypeSelect('assistant')}
                        className={`relative bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                            selectedType === 'assistant'
                                ? 'border-pink-500 ring-4 ring-pink-100 shadow-lg'
                                : 'border-gray-200 hover:border-pink-300'
                        }`}
                    >
                        <div className="p-8">
                            {/* アイコン */}
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
                                アシスタント美容師
                            </h3>
                            
                            <p className="text-gray-600 text-center mb-4 leading-relaxed">
                                技術を活かして収入を得たい<br />
                                アシスタント美容師の方
                            </p>

                            <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    副業として技術を活用
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    自分のペースで働ける
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    お客様と直接つながる
                                </div>
                            </div>

                            {selectedType === 'assistant' && (
                                <div className="absolute top-4 right-4">
                                    <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 一般ユーザー */}
                    <div
                        onClick={() => handleTypeSelect('customer')}
                        className={`relative bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                            selectedType === 'customer'
                                ? 'border-pink-500 ring-4 ring-pink-100 shadow-lg'
                                : 'border-gray-200 hover:border-pink-300'
                        }`}
                    >
                        <div className="p-8">
                            {/* アイコン */}
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
                                一般ユーザー
                            </h3>
                            
                            <p className="text-gray-600 text-center mb-4 leading-relaxed">
                                お得にヘアカットを利用したい<br />
                                お客様
                            </p>

                            <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    正規料金の約50%OFF
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    技術の高い若手美容師
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    簡単予約・安心システム
                                </div>
                            </div>

                            {selectedType === 'customer' && (
                                <div className="absolute top-4 right-4">
                                    <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 続行ボタン */}
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={handleContinue}
                        disabled={!selectedType}
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                            selectedType
                                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 hover:shadow-lg'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {selectedType ? '続行する' : '上記から選択してください'}
                    </button>

                    <div className="text-center">
                        <Link href="/login" className="text-gray-600 hover:text-pink-500 transition-colors">
                            すでにアカウントをお持ちの方はこちら
                        </Link>
                    </div>
                </div>

                {/* 注意事項 */}
                <div className="mt-8 text-center text-xs text-gray-500">
                    <p>
                        アカウント作成により、
                        <Link href="/terms" className="text-pink-500 hover:underline">利用規約</Link>
                        および
                        <Link href="/privacy" className="text-pink-500 hover:underline">プライバシーポリシー</Link>
                        に同意したものとみなされます
                    </p>
                </div>
            </div>
        </div>
    );
}