'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Assistant {
    id: number;
    name: string;
    salon: string;
    station: string;
    rating: number;
    reviewCount: number;
    price: string;
    specialties: string[];
    availableToday: boolean;
    distance: number;
    lat: number;
    lng: number;
    hourlyRate: number;
    averagePrice: number;
}

export default function MapPage() {
    const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [searchArea, setSearchArea] = useState('渋谷駅周辺');

    // モックデータ - 地図上の位置情報付きアシスタント美容師
    const assistants: Assistant[] = [
        {
            id: 1,
            name: '田中 美香',
            salon: 'SALON TOKYO',
            station: '渋谷駅',
            rating: 4.8,
            reviewCount: 156,
            price: '1,500円〜',
            specialties: ['カット', 'カラー'],
            availableToday: true,
            distance: 0.5,
            lat: 35.6598, // 渋谷駅周辺
            lng: 139.7006,
            hourlyRate: 2000,
            averagePrice: 2500
        },
        {
            id: 2,
            name: '佐藤 リナ',
            salon: 'Hair Studio Grace',
            station: '渋谷駅',
            rating: 4.9,
            reviewCount: 203,
            price: '2,000円〜',
            specialties: ['パーマ', 'トリートメント'],
            availableToday: false,
            distance: 0.8,
            lat: 35.6612,
            lng: 139.7021,
            hourlyRate: 2500,
            averagePrice: 3500
        },
        {
            id: 3,
            name: '鈴木 優子',
            salon: 'Beauty Lounge',
            station: '渋谷駅',
            rating: 4.7,
            reviewCount: 89,
            price: '1,800円〜',
            specialties: ['カット', 'ストレート'],
            availableToday: true,
            distance: 1.2,
            lat: 35.6580,
            lng: 139.6989,
            hourlyRate: 2200,
            averagePrice: 2800
        },
        {
            id: 4,
            name: '高橋 健太',
            salon: 'Men\'s Studio K',
            station: '渋谷駅',
            rating: 4.6,
            reviewCount: 67,
            price: '1,200円〜',
            specialties: ['カット', 'パーマ'],
            availableToday: true,
            distance: 0.3,
            lat: 35.6605,
            lng: 139.7018,
            hourlyRate: 1800,
            averagePrice: 2200
        }
    ];

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 flex-shrink-0">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/search" className="flex items-center text-gray-600 hover:text-pink-500">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            検索に戻る
                        </Link>
                        
                        <h1 className="text-lg font-semibold text-gray-900">地図で探す</h1>
                        
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('map')}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                    viewMode === 'map' 
                                        ? 'bg-pink-500 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                地図
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                    viewMode === 'list' 
                                        ? 'bg-pink-500 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                リスト
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 検索バー */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center space-x-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchArea}
                                onChange={(e) => setSearchArea(e.target.value)}
                                placeholder="エリアを検索（駅名、住所）"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                            />
                            <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button className="px-4 py-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
                            この場所で検索
                        </button>
                    </div>
                </div>
            </div>

            {/* メインコンテンツ */}
            <div className="flex-1 flex relative">
                {viewMode === 'map' ? (
                    <>
                        {/* 地図エリア */}
                        <div className="flex-1 relative bg-gray-100">
                            {/* モック地図 */}
                            <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden">
                                {/* 地図の背景パターン */}
                                <div className="absolute inset-0 opacity-20">
                                    <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
                                        {Array.from({ length: 400 }).map((_, i) => (
                                            <div key={i} className="border border-gray-300"></div>
                                        ))}
                                    </div>
                                </div>

                                {/* 道路のような線 */}
                                <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-400 opacity-30"></div>
                                <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-400 opacity-30"></div>
                                <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-gray-400 opacity-30"></div>
                                <div className="absolute top-0 bottom-0 right-1/4 w-1 bg-gray-400 opacity-30"></div>

                                {/* アシスタント美容師のピン */}
                                {assistants.map((assistant) => (
                                    <button
                                        key={assistant.id}
                                        onClick={() => setSelectedAssistant(assistant)}
                                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                                            selectedAssistant?.id === assistant.id ? 'z-20' : 'z-10'
                                        }`}
                                        style={{
                                            left: `${30 + (assistant.id * 15)}%`,
                                            top: `${25 + (assistant.id * 10)}%`
                                        }}
                                    >
                                        <div className={`relative ${
                                            selectedAssistant?.id === assistant.id ? 'scale-110' : 'hover:scale-105'
                                        } transition-transform`}>
                                            {/* ピンの背景 */}
                                            <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                                                assistant.availableToday ? 'bg-pink-500' : 'bg-gray-400'
                                            }`}>
                                                <span className="text-white font-bold text-xs">
                                                    {assistant.name.charAt(0)}
                                                </span>
                                            </div>
                                            {/* 料金表示 */}
                                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap">
                                                {assistant.price}
                                            </div>
                                        </div>
                                    </button>
                                ))}

                                {/* 現在地ピン */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg pulse"></div>
                                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                                        現在地
                                    </div>
                                </div>
                            </div>

                            {/* 地図コントロール */}
                            <div className="absolute top-4 right-4 flex flex-col space-y-2">
                                <button className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center">
                                    <span className="text-lg font-bold text-gray-600">+</span>
                                </button>
                                <button className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center">
                                    <span className="text-lg font-bold text-gray-600">−</span>
                                </button>
                                <button className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* サイドパネル */}
                        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                            {/* 検索結果ヘッダー */}
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                    {searchArea}の検索結果
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {assistants.length}件のアシスタント美容師が見つかりました
                                </p>
                            </div>

                            {/* 結果リスト */}
                            <div className="flex-1 overflow-y-auto">
                                {assistants.map((assistant) => (
                                    <div
                                        key={assistant.id}
                                        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                                            selectedAssistant?.id === assistant.id 
                                                ? 'bg-pink-50 border-pink-200' 
                                                : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => setSelectedAssistant(assistant)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                {assistant.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-medium text-gray-900 truncate">
                                                        {assistant.name}
                                                    </h3>
                                                    {assistant.availableToday && (
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                            空きあり
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{assistant.salon}</p>
                                                
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center">
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <svg key={i} className={`w-3 h-3 fill-current ${i < Math.floor(assistant.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                        <span className="ml-1 text-gray-600">
                                                            {assistant.rating}
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold text-pink-600">
                                                        {assistant.price}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {assistant.distance}km • {assistant.station}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 選択されたアシスタントの詳細 */}
                            {selectedAssistant && (
                                <div className="border-t border-gray-200 p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-gray-900">
                                            {selectedAssistant.name}
                                        </h3>
                                        <button
                                            onClick={() => setSelectedAssistant(null)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <p>{selectedAssistant.salon}</p>
                                        <p>得意: {selectedAssistant.specialties.join(', ')}</p>
                                        <p>距離: {selectedAssistant.distance}km</p>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Link
                                            href={`/assistant/${selectedAssistant.id}`}
                                            className="block w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors text-center font-medium"
                                        >
                                            詳細を見る
                                        </Link>
                                        <Link
                                            href={`/booking/${selectedAssistant.id}`}
                                            className="block w-full bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg hover:bg-pink-50 transition-colors text-center font-medium"
                                        >
                                            予約する
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* リスト表示 */
                    <div className="flex-1 max-w-4xl mx-auto px-4 py-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {searchArea}の検索結果
                            </h2>
                            <p className="text-gray-600">
                                {assistants.length}件のアシスタント美容師が見つかりました
                            </p>
                        </div>

                        <div className="space-y-4">
                            {assistants.map((assistant) => (
                                <Link
                                    key={assistant.id}
                                    href={`/assistant/${assistant.id}`}
                                    className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                                            {assistant.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {assistant.name}
                                                    </h3>
                                                    <p className="text-gray-600">{assistant.salon}</p>
                                                </div>
                                                {assistant.availableToday && (
                                                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                                                        今日空きあり
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-4 mb-3">
                                                <div className="flex items-center">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg key={i} className={`w-4 h-4 fill-current ${i < Math.floor(assistant.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="ml-2 text-gray-600">
                                                        {assistant.rating} ({assistant.reviewCount}件)
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {assistant.distance}km
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-600">得意:</span>
                                                    <div className="flex gap-1">
                                                        {assistant.specialties.map((specialty, index) => (
                                                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                                                {specialty}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-semibold text-pink-600">
                                                        {assistant.price}
                                                    </span>
                                                    <p className="text-xs text-gray-500">正規料金の約50%OFF</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .pulse {
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.7;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}