'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../providers/AuthProvider'
import { NotificationDropdown } from './NotificationDropdown'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, isAuthenticated, logout, isLoading } = useAuth()
    
    // ユーザータイプに応じたプロフィールURLを取得
    const getProfileUrl = () => {
        if (!user) return '/profile';
        if (user.userType === 'stylist') return '/profile/assistant';
        if (user.userType === 'customer') return '/profile/customer';
        return '/profile';
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold text-pink-500">
                        Cutmeets
                    </Link>

                    {/* PC用ナビゲーション */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        <Link href="/" className="text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal">ホーム</Link>
                        <Link href="/search" className="text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal">検索</Link>
                        <Link href="/recommendations" className="text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal">おすすめ</Link>
                        
                        {isAuthenticated ? (
                            <>
                                <Link href="/favorites" className="text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal">お気に入り</Link>
                                <Link href="/messages" className="text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal">メッセージ</Link>
                                <Link href="/bookings" className="text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal">予約管理</Link>
                                <NotificationDropdown />
                                <div className="relative group">
                                    <button className="text-gray-700 hover:text-pink-500 transition-colors font-medium flex items-center text-ja-normal">
                                        {user?.name || 'ユーザー'}
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {/* ドロップダウンメニュー */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="py-2">
                                            <Link href={getProfileUrl()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-500 text-ja-normal">
                                                プロフィール
                                            </Link>
                                            <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-500 text-ja-normal">
                                                設定
                                            </Link>
                                            <Link href="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-500 text-ja-normal">
                                                ヘルプ
                                            </Link>
                                            <Link href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-500 text-ja-normal">
                                                お問い合わせ
                                            </Link>
                                            <hr className="my-1" />
                                            <button 
                                                onClick={logout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-ja-normal"
                                            >
                                                ログアウト
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/help" className="text-gray-700 hover:text-pink-500 transition-colors font-medium">ヘルプ</Link>
                                <Link href="/login" className="text-gray-700 hover:text-pink-500 transition-colors font-medium">ログイン</Link>
                                <Link href="/register" className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-red-600 transition-all font-medium">
                                    新規登録
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* モバイル用ハンバーガーメニュー */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* モバイルメニュー */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin mobile-menu-scroll">
                        <nav className="px-4 py-4 pb-8 space-y-3">
                            <Link 
                                href="/" 
                                className="block py-2 text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                ホーム
                            </Link>
                            <Link 
                                href="/search" 
                                className="block py-2 text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                検索
                            </Link>
                            <Link 
                                href="/recommendations" 
                                className="block py-2 text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                おすすめ
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    <Link 
                                        href="/favorites" 
                                        className="block py-2 text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        お気に入り
                                    </Link>
                                    <Link 
                                        href="/messages" 
                                        className="block py-2 text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        メッセージ
                                    </Link>
                                    <Link 
                                        href="/bookings" 
                                        className="block py-2 text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        予約管理
                                    </Link>
                                    <Link 
                                        href="/notifications" 
                                        className="block py-2 text-gray-700 hover:text-pink-500 transition-colors font-medium flex items-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span>通知</span>
                                        <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                                    </Link>
                                    <Link 
                                        href={getProfileUrl()} 
                                        className="block py-2 text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        プロフィール
                                    </Link>
                                    <Link 
                                        href="/settings" 
                                        className="block py-2 text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        設定
                                    </Link>
                                    <Link 
                                        href="/help" 
                                        className="block py-2 text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        ヘルプ
                                    </Link>
                                    <Link 
                                        href="/contact" 
                                        className="block py-2 text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        お問い合わせ
                                    </Link>
                                    
                                    {/* ユーザー情報表示 */}
                                    <div className="border-t border-gray-200 pt-3 mt-3">
                                        <div className="text-sm text-gray-600 mb-2 text-ja-normal">
                                            ログイン中: {user?.name}
                                        </div>
                                        <button 
                                            onClick={() => {
                                                logout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="block py-2 text-red-600 hover:text-red-700 transition-colors font-medium text-ja-normal"
                                        >
                                            ログアウト
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        href="/help" 
                                        className="block py-2 text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        ヘルプ
                                    </Link>
                                    <Link 
                                        href="/contact" 
                                        className="block py-2 text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        お問い合わせ
                                    </Link>
                                    
                                    {/* 認証リンク */}
                                    <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                                        <Link 
                                            href="/login" 
                                            className="block py-2 text-gray-700 hover:text-pink-500 transition-colors font-medium text-ja-normal"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            ログイン
                                        </Link>
                                        <Link 
                                            href="/register" 
                                            className="block bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-red-600 transition-all font-medium text-center text-ja-normal"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            新規登録
                                        </Link>
                                    </div>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header