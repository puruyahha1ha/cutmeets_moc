'use client'

import { useState } from 'react'
import Link from 'next/link'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-xl md:text-2xl font-bold text-red-500">
                        Cutmeets
                    </Link>

                    {/* PC用ナビゲーション */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-red-500 transition-colors">ホーム</Link>
                        <Link href="/search" className="text-gray-700 hover:text-red-500 transition-colors">検索</Link>
                        <Link href="/favorites" className="text-gray-700 hover:text-red-500 transition-colors">お気に入り</Link>
                        <Link href="/profile" className="text-gray-700 hover:text-red-500 transition-colors">プロフィール</Link>
                    </nav>

                    {/* モバイル用ハンバーガーメニュー */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header