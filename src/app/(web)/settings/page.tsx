'use client'

import { useState } from 'react'
import { useAuth } from '../_components/providers/AuthProvider'
import Link from 'next/link'

const SettingsPage = () => {
    const { user, isAuthenticated } = useAuth()
    const [activeSection, setActiveSection] = useState('account')
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        push: true,
        marketing: false
    })
    const [privacy, setPrivacy] = useState({
        profileVisible: true,
        reviewsVisible: true,
        dataSharing: false
    })
    const [accessibility, setAccessibility] = useState({
        fontSize: 'medium',
        highContrast: false,
        reduceMotion: false
    })

    const sections = [
        { id: 'account', name: 'アカウント', icon: '👤' },
        { id: 'privacy', name: 'プライバシー', icon: '🔒' },
        { id: 'notifications', name: '通知設定', icon: '🔔' },
        { id: 'accessibility', name: 'アクセシビリティ', icon: '♿' },
        { id: 'security', name: 'セキュリティ', icon: '🛡️' },
        { id: 'data', name: 'データ管理', icon: '💾' }
    ]

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">ログインが必要です</h1>
                        <p className="text-gray-600">設定にアクセスするにはログインしてください。</p>
                    </div>
                    <div className="space-y-3">
                        <Link
                            href="/login"
                            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-red-600 transition-all block text-center"
                        >
                            ログイン
                        </Link>
                        <Link
                            href="/register"
                            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors block text-center"
                        >
                            新規登録
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const renderAccountSection = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">プロフィール情報</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">{user?.name || 'ユーザー'}</p>
                            <p className="text-gray-600">{user?.email}</p>
                        </div>
                        <Link
                            href="/profile"
                            className="px-4 py-2 text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50 transition-colors"
                        >
                            編集
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">パスワード変更</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">現在のパスワード</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="現在のパスワードを入力"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">新しいパスワード</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="新しいパスワードを入力"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">パスワード確認</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="新しいパスワードを再入力"
                        />
                    </div>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
                        パスワードを更新
                    </button>
                </div>
            </div>
        </div>
    )

    const renderPrivacySection = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">プライバシー設定</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">プロフィールの公開</h4>
                            <p className="text-sm text-gray-600">他のユーザーにプロフィールを表示する</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacy.profileVisible}
                                onChange={(e) => setPrivacy({...privacy, profileVisible: e.target.checked})}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">レビューの表示</h4>
                            <p className="text-sm text-gray-600">あなたが書いたレビューを公開する</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacy.reviewsVisible}
                                onChange={(e) => setPrivacy({...privacy, reviewsVisible: e.target.checked})}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">データ共有</h4>
                            <p className="text-sm text-gray-600">サービス改善のためのデータ共有を許可する</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacy.dataSharing}
                                onChange={(e) => setPrivacy({...privacy, dataSharing: e.target.checked})}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">データのダウンロード</h3>
                <p className="text-gray-600 mb-4">
                    あなたのアカウントに関連するすべてのデータをダウンロードできます。
                </p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    データをダウンロード
                </button>
            </div>
        </div>
    )

    const renderNotificationsSection = () => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">通知設定</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900">メール通知</h4>
                        <p className="text-sm text-gray-600">予約やメッセージのメール通知</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notifications.email}
                            onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900">SMS通知</h4>
                        <p className="text-sm text-gray-600">予約リマインダーのSMS通知</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notifications.sms}
                            onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900">プッシュ通知</h4>
                        <p className="text-sm text-gray-600">アプリからのプッシュ通知</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notifications.push}
                            onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900">マーケティング通知</h4>
                        <p className="text-sm text-gray-600">キャンペーンやお得情報の通知</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notifications.marketing}
                            onChange={(e) => setNotifications({...notifications, marketing: e.target.checked})}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>
            </div>
        </div>
    )

    const renderAccessibilitySection = () => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">アクセシビリティ設定</h3>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">フォントサイズ</label>
                    <select
                        value={accessibility.fontSize}
                        onChange={(e) => setAccessibility({...accessibility, fontSize: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                        <option value="small">小</option>
                        <option value="medium">中</option>
                        <option value="large">大</option>
                        <option value="extra-large">特大</option>
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900">ハイコントラスト</h4>
                        <p className="text-sm text-gray-600">より見やすいコントラストで表示</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={accessibility.highContrast}
                            onChange={(e) => setAccessibility({...accessibility, highContrast: e.target.checked})}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900">アニメーション削減</h4>
                        <p className="text-sm text-gray-600">画面上のアニメーション効果を減らす</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={accessibility.reduceMotion}
                            onChange={(e) => setAccessibility({...accessibility, reduceMotion: e.target.checked})}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>
            </div>
        </div>
    )

    const renderSecuritySection = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">2段階認証</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">SMS認証</h4>
                            <p className="text-sm text-gray-600">携帯電話番号による2段階認証</p>
                        </div>
                        <button className="px-4 py-2 text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50 transition-colors">
                            設定
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">認証アプリ</h4>
                            <p className="text-sm text-gray-600">Google Authenticatorなどの認証アプリ</p>
                        </div>
                        <button className="px-4 py-2 text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50 transition-colors">
                            設定
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ログインセッション</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">現在のセッション</p>
                                <p className="text-sm text-gray-600">Windows PC • 東京</p>
                            </div>
                        </div>
                        <span className="text-sm text-green-600 font-medium">アクティブ</span>
                    </div>
                </div>
                <button className="mt-4 text-red-600 text-sm hover:text-red-700 transition-colors">
                    すべてのセッションからログアウト
                </button>
            </div>
        </div>
    )

    const renderDataSection = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">アカウント削除</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                            <h4 className="text-red-800 font-medium">注意</h4>
                            <p className="text-red-700 text-sm mt-1">
                                アカウントを削除すると、すべてのデータが永久に失われます。この操作は取り消すことができません。
                            </p>
                        </div>
                    </div>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    アカウントを削除
                </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">アカウント一時停止</h3>
                <p className="text-gray-600 mb-4">
                    アカウントを一時的に無効にします。後で再アクティベートできます。
                </p>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                    アカウントを一時停止
                </button>
            </div>
        </div>
    )

    const renderSection = () => {
        switch (activeSection) {
            case 'account':
                return renderAccountSection()
            case 'privacy':
                return renderPrivacySection()
            case 'notifications':
                return renderNotificationsSection()
            case 'accessibility':
                return renderAccessibilitySection()
            case 'security':
                return renderSecuritySection()
            case 'data':
                return renderDataSection()
            default:
                return renderAccountSection()
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">設定</h1>
                    <p className="text-gray-600">アカウントとプライバシーの設定を管理</p>
                </div>

                <div className="lg:flex lg:space-x-8">
                    {/* サイドバー */}
                    <div className="lg:w-1/4 mb-8 lg:mb-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors border-b border-gray-100 last:border-b-0 ${
                                        activeSection === section.id
                                            ? 'bg-pink-50 text-pink-600 border-r-2 border-r-pink-500'
                                            : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    <span className="text-lg">{section.icon}</span>
                                    <span className="font-medium">{section.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* メインコンテンツ */}
                    <div className="lg:w-3/4">
                        {renderSection()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage