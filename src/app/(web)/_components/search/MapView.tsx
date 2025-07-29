'use client'

import { useState, useEffect, useRef } from 'react';
import { SearchableItem } from '@/lib/search/search-engine';
import { useGoogleMaps } from '@/lib/maps/google-maps-loader';

interface MapViewProps {
  items: SearchableItem[];
  onItemSelect?: (item: SearchableItem) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

interface MapMarker {
  id: string | number;
  position: { lat: number; lng: number };
  item: SearchableItem;
}

// 東京駅をデフォルトセンターとする
const DEFAULT_CENTER = { lat: 35.6812, lng: 139.7671 };

// 駅名から座標を取得するマップ（実際にはAPIを使用）
const STATION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  '渋谷駅': { lat: 35.6580, lng: 139.7016 },
  '新宿駅': { lat: 35.6896, lng: 139.7006 },
  '原宿駅': { lat: 35.6702, lng: 139.7027 },
  '表参道駅': { lat: 35.6657, lng: 139.7122 },
  '銀座駅': { lat: 35.6717, lng: 139.7641 },
  '池袋駅': { lat: 35.7295, lng: 139.7109 },
  '心斎橋駅': { lat: 34.6745, lng: 135.5038 },
  '梅田駅': { lat: 34.7024, lng: 135.4959 },
  '横浜駅': { lat: 35.4657, lng: 139.6220 },
  '名古屋駅': { lat: 35.1706, lng: 136.8816 },
  '博多駅': { lat: 33.5896, lng: 130.4206 },
  '札幌駅': { lat: 43.0642, lng: 141.3469 }
};

export default function MapView({ 
  items, 
  onItemSelect, 
  center = DEFAULT_CENTER, 
  zoom = 12,
  height = '400px'
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchableItem | null>(null);
  
  // Google Maps APIの読み込み状態を管理
  const { isLoaded: mapsLoaded, error: mapsError, isLoading: mapsLoading, retry } = useGoogleMaps();

  // Google Maps APIが読み込まれたら地図を初期化
  useEffect(() => {
    if (mapsLoaded) {
      initializeMap();
    }
  }, [mapsLoaded]);

  // 地図の初期化
  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false
      });

      setMap(mapInstance);
    } catch (err) {
      console.error('地図の初期化に失敗しました:', err);
    }
  };

  // マーカーの更新
  useEffect(() => {
    if (!map || !window.google) return;

    // 既存のマーカーをクリア
    markers.forEach(marker => marker.setMap(null));

    // 新しいマーカーを作成
    const newMarkers: google.maps.Marker[] = [];
    const bounds = new window.google.maps.LatLngBounds();

    items.forEach((item) => {
      const coordinates = getItemCoordinates(item);
      if (!coordinates) return;

      const marker = new window.google.maps.Marker({
        position: coordinates,
        map,
        title: item.title,
        icon: {
          url: createMarkerIcon(item),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40)
        }
      });

      // マーカークリックイベント
      marker.addListener('click', () => {
        setSelectedItem(item);
        onItemSelect?.(item);
      });

      newMarkers.push(marker);
      bounds.extend(coordinates);
    });

    setMarkers(newMarkers);

    // 地図の表示範囲を調整
    if (items.length > 0) {
      map.fitBounds(bounds);
      if (items.length === 1) {
        map.setZoom(15);
      }
    }
  }, [map, items]);

  // アイテムから座標を取得
  const getItemCoordinates = (item: SearchableItem): { lat: number; lng: number } | null => {
    // アイテムに直接座標が含まれている場合
    if (item.location?.coordinates) {
      return item.location.coordinates;
    }

    // 駅名から座標を取得
    if (item.location?.station) {
      return STATION_COORDINATES[item.location.station] || null;
    }

    return null;
  };

  // マーカーアイコンの作成
  const createMarkerIcon = (item: SearchableItem): string => {
    const color = 
      item.status === 'recruiting' ? '#EC4899' :  // ピンク
      item.status === 'full' ? '#F59E0B' :        // オレンジ
      '#6B7280';                                  // グレー

    // SVGマーカーアイコンを作成
    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="15" r="12" fill="${color}" stroke="white" stroke-width="2"/>
        <path d="M20 27 L15 20 L25 20 Z" fill="${color}"/>
        <text x="20" y="19" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">
          ${item.urgency === 'urgent' ? '!' : '¥'}
        </text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  // 現在地取得
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('位置情報がサポートされていません');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = { lat: latitude, lng: longitude };
        
        if (map) {
          map.setCenter(userLocation);
          map.setZoom(15);

          // 現在地マーカーを追加
          new window.google.maps.Marker({
            position: userLocation,
            map,
            title: '現在地',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
                  <circle cx="10" cy="10" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(20, 20),
              anchor: new window.google.maps.Point(10, 10)
            }
          });
        }
      },
      (error) => {
        console.error('位置情報の取得に失敗しました:', error);
        alert('位置情報の取得に失敗しました');
      }
    );
  };

  // 価格フォーマット
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(price);
  };

  if (mapsError) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6" style={{ height }}>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">地図を読み込めません</h3>
          <p className="text-gray-600 text-sm">{mapsError}</p>
          <button
            onClick={retry}
            className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* 地図コントロール */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-sm font-medium text-gray-900">
              地図表示 ({items.length}件)
            </h3>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="text-gray-600">募集中</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600">満員</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-gray-600">終了</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={getCurrentLocation}
              className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>現在地</span>
            </button>
          </div>
        </div>
      </div>

      {/* 地図 */}
      <div className="relative" style={{ height }}>
        {(mapsLoading || !mapsLoaded) && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">地図を読み込んでいます...</p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* 選択されたアイテムの詳細 */}
      {selectedItem && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-gray-900 mb-1">
                {selectedItem.title}
              </h4>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <span>{selectedItem.salon?.name}</span>
                <span>•</span>
                <span>{selectedItem.location?.station}</span>
                {selectedItem.location?.distance && (
                  <>
                    <span>•</span>
                    <span>{selectedItem.location.distance < 1 
                      ? `${Math.round(selectedItem.location.distance * 1000)}m` 
                      : `${selectedItem.location.distance.toFixed(1)}km`}</span>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {selectedItem.services.map((service, idx) => (
                  <span key={idx} className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">
                    {service}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                {selectedItem.description}
              </p>
            </div>
            
            <div className="ml-4 text-right">
              <div className="text-lg font-bold text-pink-600 mb-1">
                {selectedItem.price ? formatPrice(selectedItem.price) : '要相談'}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedItem.status === 'recruiting' ? 'bg-green-100 text-green-800' :
                selectedItem.status === 'full' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {selectedItem.status === 'recruiting' ? '募集中' : 
                 selectedItem.status === 'full' ? '満員' : '終了'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4 text-xs text-gray-600">
              <span>所要時間: {selectedItem.duration}分</span>
              <span>募集: {selectedItem.modelCount}名</span>
              <span>申込: {selectedItem.appliedCount}名</span>
            </div>
            <button
              onClick={() => onItemSelect?.(selectedItem)}
              className="px-4 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors font-medium"
            >
              詳細を見る
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Google Maps APIの型定義を拡張
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => google.maps.Map;
        Marker: new (options: any) => google.maps.Marker;
        LatLngBounds: new () => google.maps.LatLngBounds;
        Size: new (width: number, height: number) => google.maps.Size;
        Point: new (x: number, y: number) => google.maps.Point;
      };
    };
  }
}

declare namespace google.maps {
  class Map {
    setCenter(center: { lat: number; lng: number }): void;
    setZoom(zoom: number): void;
    fitBounds(bounds: LatLngBounds): void;
  }

  class Marker {
    setMap(map: Map | null): void;
    addListener(event: string, handler: () => void): void;
  }

  class LatLngBounds {
    extend(point: { lat: number; lng: number }): void;
  }

  class Size {}
  class Point {}
}