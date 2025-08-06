'use client'

import { useState, useEffect } from 'react';

// Mock data and types
interface PaymentMethod {
  id: string;
  type: 'credit_card';
  provider: string;
  isDefault: boolean;
  cardBrand: string;
  cardLast4: string;
  expiryMonth: number;
  expiryYear: number;
  createdAt: string;
}

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    type: 'credit_card',
    provider: 'stripe',
    isDefault: true,
    cardBrand: 'visa',
    cardLast4: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    type: 'credit_card',
    provider: 'stripe',
    isDefault: false,
    cardBrand: 'mastercard',
    cardLast4: '5555',
    expiryMonth: 8,
    expiryYear: 2026,
    createdAt: '2024-01-10T14:30:00Z'
  }
];

// Mock API client
const mockApiClient = {
  getPaymentMethods: async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return {
      success: true,
      data: {
        paymentMethods: MOCK_PAYMENT_METHODS
      }
    };
  },
  createPaymentMethod: async (methodData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const newMethod: PaymentMethod = {
      id: 'pm_' + Date.now(),
      type: 'credit_card',
      provider: 'stripe',
      isDefault: methodData.isDefault || false,
      cardBrand: 'visa',
      cardLast4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      createdAt: new Date().toISOString()
    };
    return {
      success: true,
      data: {
        paymentMethod: newMethod
      }
    };
  }
};

export default function PaymentSettingsPage() {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockApiClient.getPaymentMethods();
      if (response.success && response.data) {
        setPaymentMethods(response.data.paymentMethods);
      } else {
        setError('決済方法の取得に失敗しました');
      }
    } catch (err) {
      setError('決済方法の取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    try {
      const response = await mockApiClient.createPaymentMethod({
        type: 'credit_card',
        provider: 'stripe',
        isDefault: paymentMethods.length === 0
      });

      if (response.success) {
        await fetchPaymentMethods();
        setShowAddCard(false);
      }
    } catch (error) {
      console.error('カード追加エラー:', error);
      setError('カードの追加に失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">決済設定</h1>
          <p className="text-gray-600">決済方法の管理と設定を行えます。</p>
        </div>

        {/* 決済方法管理 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">登録済み決済方法</h2>
            <button
              onClick={() => setShowAddCard(true)}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
            >
              + カードを追加
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded mr-3 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {method.cardBrand?.toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {method.cardBrand?.toUpperCase()} **** **** **** {method.cardLast4}
                          </span>
                          {method.isDefault && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              デフォルト
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          有効期限: {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!method.isDefault && (
                        <button className="text-xs text-blue-600 hover:text-blue-800">
                          デフォルトに設定
                        </button>
                      )}
                      <button className="text-xs text-red-600 hover:text-red-800">
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">決済方法が登録されていません</h3>
              <p className="text-gray-600 mb-4">クレジットカードを追加してスムーズな決済を体験しましょう</p>
              <button
                onClick={() => setShowAddCard(true)}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                最初のカードを追加
              </button>
            </div>
          )}
        </div>

        {/* 決済設定 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">決済設定</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">自動決済</h3>
                <p className="text-xs text-gray-600">承認されたサービスを自動的に決済します</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">決済確認メール</h3>
                <p className="text-xs text-gray-600">決済完了時にメール通知を受け取ります</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* セキュリティ情報 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">セキュリティについて</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                お客様の決済情報は業界標準の暗号化技術により保護されています。
                カード情報は弊社サーバーに保存されず、PCI DSS準拠の決済代行業者により安全に処理されます。
              </p>
            </div>
          </div>
        </div>

        {/* カード追加モーダル */}
        {showAddCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">新しいカードを追加</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    カード番号
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                    />
                    <div className="absolute right-3 top-2.5">
                      <div className="w-6 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded text-white text-xs flex items-center justify-center">
                        VISA
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      有効期限
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    カード名義人
                  </label>
                  <input
                    type="text"
                    placeholder="YAMADA TARO"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                </div>

                <div className="flex items-center">
                  <input type="checkbox" id="default" className="mr-2" />
                  <label htmlFor="default" className="text-sm text-gray-700">
                    このカードをデフォルトの決済方法に設定
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-yellow-800">
                  ⚠️ これはデモ画面です。実際の実装では、Stripe Elements等のセキュアなフォームを使用します。
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddCard(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleAddCard}
                  className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  追加（デモ）
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}