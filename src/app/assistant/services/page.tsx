'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../(web)/_components/providers/AuthProvider';

export const dynamic = 'force-dynamic';

interface Service {
    id: string;
    name: string;
    description: string;
    duration: number; // minutes
    price: number;
    category: string;
    isActive: boolean;
    practiceDiscount?: number; // 練習台割引率
}

interface ServiceCategory {
    id: string;
    name: string;
    description: string;
}

export default function AssistantServices() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    // 未認証またはアシスタント以外の場合はリダイレクト
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        // TODO: ユーザータイプがassistantでない場合のチェック
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (user) {
            // モックデータを設定
            setCategories([
                { id: 'cut', name: 'カット', description: 'ヘアカット関連サービス' },
                { id: 'color', name: 'カラー', description: 'ヘアカラー関連サービス' },
                { id: 'perm', name: 'パーマ', description: 'パーマ関連サービス' },
                { id: 'treatment', name: 'トリートメント', description: 'ヘアケア関連サービス' },
                { id: 'styling', name: 'スタイリング', description: 'セット・スタイリング関連サービス' }
            ]);

            setServices([
                {
                    id: 'service_1',
                    name: 'カット',
                    description: '基本的なヘアカット。シャンプー込み。',
                    duration: 60,
                    price: 3000,
                    category: 'cut',
                    isActive: true,
                    practiceDiscount: 30
                },
                {
                    id: 'service_2',
                    name: 'カット + ブロー',
                    description: 'カット + ブロー仕上げ。シャンプー込み。',
                    duration: 90,
                    price: 4000,
                    category: 'cut',
                    isActive: true,
                    practiceDiscount: 25
                },
                {
                    id: 'service_3',
                    name: 'カラーリング',
                    description: '全体カラー。カット別途。',
                    duration: 120,
                    price: 5500,
                    category: 'color',
                    isActive: true,
                    practiceDiscount: 40
                },
                {
                    id: 'service_4',
                    name: 'ハイライト',
                    description: 'ハイライトカラー。カット別途。',
                    duration: 150,
                    price: 7000,
                    category: 'color',
                    isActive: false,
                    practiceDiscount: 35
                },
                {
                    id: 'service_5',
                    name: 'トリートメント',
                    description: '保湿・補修トリートメント。',
                    duration: 45,
                    price: 2500,
                    category: 'treatment',
                    isActive: true,
                    practiceDiscount: 20
                }
            ]);

            setIsLoading(false);
        }
    }, [user]);

    const getCategoryName = (categoryId: string) => {
        return categories.find(c => c.id === categoryId)?.name || categoryId;
    };

    const formatDuration = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes}分`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}時間${remainingMinutes}分` : `${hours}時間`;
    };

    const handleToggleService = (serviceId: string) => {
        setServices(services.map(service => 
            service.id === serviceId 
                ? { ...service, isActive: !service.isActive }
                : service
        ));
    };

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setShowAddModal(true);
    };

    const handleDeleteService = (serviceId: string) => {
        if (confirm('このサービスを削除しますか？')) {
            setServices(services.filter(service => service.id !== serviceId));
        }
    };

    const ServiceModal = () => {
        const [formData, setFormData] = useState({
            name: editingService?.name || '',
            description: editingService?.description || '',
            duration: editingService?.duration || 60,
            price: editingService?.price || 0,
            category: editingService?.category || 'cut',
            practiceDiscount: editingService?.practiceDiscount || 0
        });

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            
            if (editingService) {
                // 編集
                setServices(services.map(service => 
                    service.id === editingService.id 
                        ? { ...service, ...formData }
                        : service
                ));
            } else {
                // 新規追加
                const newService: Service = {
                    id: `service_${Date.now()}`,
                    ...formData,
                    isActive: true
                };
                setServices([...services, newService]);
            }

            setShowAddModal(false);
            setEditingService(null);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {editingService ? 'サービス編集' : '新しいサービス'}
                        </h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                サービス名
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                説明
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                カテゴリ
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    所要時間（分）
                                </label>
                                <input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                                    min="15"
                                    max="300"
                                    step="15"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    料金（円）
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                                    min="0"
                                    step="100"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                練習台割引率（％）
                            </label>
                            <input
                                type="number"
                                value={formData.practiceDiscount}
                                onChange={(e) => setFormData({...formData, practiceDiscount: parseInt(e.target.value)})}
                                min="0"
                                max="70"
                                step="5"
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                練習台として提供する場合の割引率
                            </p>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingService(null);
                                }}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
                            >
                                {editingService ? '更新' : '追加'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/assistant/dashboard" className="text-pink-500 hover:text-pink-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <Link href="/" className="text-xl font-bold text-pink-500">
                                Cutmeets
                            </Link>
                            <span className="text-gray-400">|</span>
                            <h1 className="text-lg font-semibold text-gray-900">サービス管理</h1>
                        </div>
                        <div className="text-sm text-gray-600">
                            {user?.name}さん
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">サービス情報を読み込み中...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 統計カード */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{services.length}</p>
                                    <p className="text-sm text-gray-600">総サービス数</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{services.filter(s => s.isActive).length}</p>
                                    <p className="text-sm text-gray-600">公開中</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-400">{services.filter(s => !s.isActive).length}</p>
                                    <p className="text-sm text-gray-600">非公開</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">
                                        ¥{Math.round(services.filter(s => s.isActive).reduce((sum, s) => sum + s.price, 0) / services.filter(s => s.isActive).length || 0).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-600">平均料金</p>
                                </div>
                            </div>
                        </div>

                        {/* アクションヘッダー */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">提供サービス</h2>
                                <p className="text-sm text-gray-600 mt-1">お客様に提供するサービスを管理しましょう</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-pink-500 text-white px-4 py-2 rounded-xl hover:bg-pink-600 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>新しいサービス</span>
                            </button>
                        </div>

                        {/* カテゴリ別サービス一覧 */}
                        <div className="space-y-6">
                            {categories.map(category => {
                                const categoryServices = services.filter(s => s.category === category.id);
                                if (categoryServices.length === 0) return null;

                                return (
                                    <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-200">
                                        <div className="p-6 border-b border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                                            <p className="text-sm text-gray-600">{category.description}</p>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid gap-4">
                                                {categoryServices.map((service) => (
                                                    <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3">
                                                                <h4 className="font-medium text-gray-900">{service.name}</h4>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    service.isActive 
                                                                        ? 'bg-green-100 text-green-800' 
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                    {service.isActive ? '公開中' : '非公開'}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                                <span>🕐 {formatDuration(service.duration)}</span>
                                                                <span>💰 ¥{service.price.toLocaleString()}</span>
                                                                {service.practiceDiscount && service.practiceDiscount > 0 && (
                                                                    <span className="text-pink-600">
                                                                        練習台 {service.practiceDiscount}%OFF
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => handleToggleService(service.id)}
                                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                                    service.isActive
                                                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                }`}
                                                            >
                                                                {service.isActive ? '非公開にする' : '公開する'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditService(service)}
                                                                className="p-2 text-gray-500 hover:text-pink-500 transition-colors"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteService(service.id)}
                                                                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 練習台について */}
                        <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">練習台システムについて</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                練習台システムは、技術向上のためにお客様に特別価格でサービスを提供する仕組みです。
                                通常料金から割引率を設定し、お客様にもアシスタント美容師にもメリットがある制度です。
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">お客様のメリット</h4>
                                    <ul className="text-gray-600 space-y-1">
                                        <li>• 通常より安い料金でサービスを受けられる</li>
                                        <li>• 新しい技術やスタイルに挑戦できる</li>
                                        <li>• 質の高いサービスを体験できる</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">アシスタントのメリット</h4>
                                    <ul className="text-gray-600 space-y-1">
                                        <li>• 実践的な経験を積むことができる</li>
                                        <li>• 様々なお客様のニーズに対応できる</li>
                                        <li>• 技術の向上と自信の獲得</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* モーダル */}
            {showAddModal && <ServiceModal />}
        </div>
    );
}