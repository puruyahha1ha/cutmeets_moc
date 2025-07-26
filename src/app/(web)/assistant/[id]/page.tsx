'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../_components/providers/AuthProvider';
import { useBooking } from '../../_components/providers/BookingProvider';

interface Assistant {
    id: string;
    name: string;
    salonName?: string;
    station: string;
    rating: number;
    reviewCount: number;
    hourlyRate: number;
    specialties: string[];
    experience: string;
    image: string;
    availableToday: boolean;
    description?: string;
    portfolio?: string[];
}

export default function AssistantDetailPage() {
    const params = useParams();
    const { user, isAuthenticated } = useAuth();
    const { getServices, calculatePrice } = useBooking();
    const [assistant, setAssistant] = useState<Assistant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedService, setSelectedService] = useState('');

    const services = getServices();

    useEffect(() => {
        // モックデータ - 実際はAPIから取得
        const mockAssistant: Assistant = {
            id: params.id as string,
            name: '田中 美香',
            salonName: 'SALON TOKYO',
            station: '渋谷駅',
            rating: 4.8,
            reviewCount: 156,
            hourlyRate: 2000,
            specialties: ['カット', 'カラー'],
            experience: '2-3',
            image: '/api/placeholder/400/400',
            availableToday: true,
            description: 'お客様一人ひとりに合わせたスタイル提案を心がけています。特にナチュラルなカラーリングが得意です。',
            portfolio: [
                '/api/placeholder/300/300',
                '/api/placeholder/300/300',
                '/api/placeholder/300/300'
            ]
        };

        setTimeout(() => {
            setAssistant(mockAssistant);
            setIsLoading(false);
        }, 500);
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!assistant) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">アシスタント美容師が見つかりません</p>
                    <Link href="/search" className="text-pink-500 hover:underline">
                        検索に戻る
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-16 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/search" className="flex items-center text-gray-600 hover:text-pink-500">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            検索に戻る
                        </Link>
                        
                        {/* お気に入りボタン */}
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <svg className="w-6 h-6 text-gray-400 hover:text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* プロフィール基本情報 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* プロフィール画像 */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-2xl overflow-hidden mx-auto md:mx-0">
                                <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                                    <span className="text-2xl">👩‍💼</span>
                                </div>
                            </div>
                        </div>

                        {/* 基本情報 */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">{assistant.name}</h1>
                                {assistant.salonName && (
                                    <p className="text-gray-600 mt-1">{assistant.salonName}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-center md:justify-start mb-4">
                                <div className="flex items-center">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(assistant.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600">
                                        {assistant.rating} ({assistant.reviewCount}件)
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">最寄り駅:</span>
                                    <br />
                                    <span className="font-medium">{assistant.station}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">経験:</span>
                                    <br />
                                    <span className="font-medium">{assistant.experience}年</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">時給:</span>
                                    <br />
                                    <span className="font-medium text-pink-600">¥{assistant.hourlyRate.toLocaleString()}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">本日予約:</span>
                                    <br />
                                    <span className={`font-medium ${assistant.availableToday ? 'text-green-600' : 'text-red-600'}`}>
                                        {assistant.availableToday ? '可能' : '不可'}
                                    </span>
                                </div>
                            </div>

                            {/* 得意メニュー */}
                            <div className="mt-4">
                                <span className="text-gray-500 text-sm">得意メニュー:</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {assistant.specialties.map((specialty, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 自己紹介 */}
                    {assistant.description && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-2">自己紹介</h3>
                            <p className="text-gray-700 leading-relaxed">{assistant.description}</p>
                        </div>
                    )}
                </div>

                {/* サービス・料金 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">サービス・料金</h2>
                    <div className="space-y-4">
                        {services.map((service) => {
                            const price = calculatePrice(service.id, service.duration, assistant.hourlyRate);
                            return (
                                <div key={service.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-xl hover:border-pink-300 transition-colors">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                                        <p className="text-sm text-gray-600">{service.description}</p>
                                        <p className="text-sm text-gray-500">所要時間: {service.duration}分</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-pink-600">¥{price.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">正規料金の約50%OFF</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 予約ボタン */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    {isAuthenticated ? (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">予約する</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    サービスを選択
                                </label>
                                <select
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                >
                                    <option value="">サービスを選択してください</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.name} ({service.duration}分) - ¥{calculatePrice(service.id, service.duration, assistant.hourlyRate).toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <Link
                                href={selectedService ? `/booking/${assistant.id}?service=${selectedService}` : '#'}
                                className={`block w-full py-4 text-center text-lg font-semibold rounded-xl transition-all ${
                                    selectedService
                                        ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 shadow-lg hover:shadow-xl'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                日時を選択して予約する
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">予約するにはログインが必要です</h2>
                            <div className="space-y-3">
                                <Link
                                    href="/login"
                                    className="block w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 text-lg font-semibold rounded-xl hover:from-pink-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
                                >
                                    ログイン
                                </Link>
                                <Link
                                    href="/register"
                                    className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                >
                                    新規登録
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}