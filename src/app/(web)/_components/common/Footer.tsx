'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
    const pathname = usePathname()

    const navigationItems = [
        {
            href: '/',
            label: 'ホーム',
            icon: (isActive: boolean) => (
                <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-pink-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            href: '/search',
            label: '検索',
            icon: (isActive: boolean) => (
                <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-pink-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            href: '/favorites',
            label: 'お気に入り',
            icon: (isActive: boolean) => (
                <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-pink-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )
        },
        {
            href: '/profile',
            label: 'プロフィール',
            icon: (isActive: boolean) => (
                <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-pink-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        }
    ]

    return (
        <>
            {/* モバイル用ボトムナビゲーション */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
                <div className="flex justify-around items-center py-1 sm:py-2 px-2 sm:px-4">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center justify-center min-w-0 flex-1 py-1.5 sm:py-2 px-1 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="mb-0.5 sm:mb-1">
                                    {item.icon(isActive)}
                                </div>
                                <span className={`text-xs font-medium ${isActive ? 'text-pink-500' : 'text-gray-500'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* PC用フッター */}
            <footer className="hidden lg:block bg-gray-50 border-t border-gray-200 mt-auto">
                <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        <div className="space-y-3 lg:space-y-4">
                            <h3 className="text-lg font-bold text-pink-500">Cutmeets</h3>
                            <p className="text-gray-600 text-sm">あなたにぴったりのアシスタント美容師を見つけるプラットフォーム</p>
                        </div>

                        <div className="space-y-3 lg:space-y-4">
                            <h4 className="font-semibold text-gray-800">サービス</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/search" className="text-gray-600 hover:text-pink-500 transition-colors">検索</Link></li>
                                <li><Link href="/favorites" className="text-gray-600 hover:text-pink-500 transition-colors">お気に入り</Link></li>
                                <li><Link href="/profile" className="text-gray-600 hover:text-pink-500 transition-colors">プロフィール</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-3 lg:space-y-4">
                            <h4 className="font-semibold text-gray-800">サポート</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/help" className="text-gray-600 hover:text-pink-500 transition-colors">ヘルプ</Link></li>
                                <li><Link href="/contact" className="text-gray-600 hover:text-pink-500 transition-colors">お問い合わせ</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-3 lg:space-y-4">
                            <h4 className="font-semibold text-gray-800">法的情報</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/privacy-policy" className="text-gray-600 hover:text-pink-500 transition-colors">プライバシーポリシー</Link></li>
                                <li><Link href="/terms-of-service" className="text-gray-600 hover:text-pink-500 transition-colors">利用規約</Link></li>
                                <li><Link href="/cancellation-policy" className="text-gray-600 hover:text-pink-500 transition-colors">キャンセルポリシー</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600">&copy; 2025 Cutmeets. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer