'use client'

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface PaymentFormProps {
  applicationId: string;
  assistantId: string;
  amount: number;
  serviceName: string;
  onSuccess?: (payment: any) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export default function PaymentForm({
  applicationId,
  assistantId,
  amount,
  serviceName,
  onSuccess,
  onError,
  onCancel
}: PaymentFormProps) {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getPaymentMethods();
      if (response.success && response.data) {
        setPaymentMethods(response.data.paymentMethods);
        // デフォルトの決済方法があれば選択
        const defaultMethod = response.data.paymentMethods.find(pm => pm.isDefault);
        if (defaultMethod) {
          setSelectedMethodId(defaultMethod.id);
        }
      }
    } catch (error) {
      console.error('決済方法取得エラー:', error);
      onError?.('決済方法の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedMethodId) {
      onError?.('決済方法を選択してください');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await apiClient.createPayment({
        applicationId,
        assistantId,
        amount,
        paymentMethodId: selectedMethodId,
        description: `${serviceName}の料金`,
        metadata: {
          serviceName,
          processedAt: new Date().toISOString()
        }
      });

      if (response.success && response.data) {
        onSuccess?.(response.data.payment);
      } else {
        onError?.(response.error || '決済処理に失敗しました');
      }
    } catch (error) {
      console.error('決済処理エラー:', error);
      onError?.('決済処理中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddCard = async () => {
    // 実際の実装では、Stripe Elements等のフォームを表示
    // 仮の実装として新しいカードを追加
    try {
      const response = await apiClient.createPaymentMethod({
        type: 'credit_card',
        provider: 'stripe',
        isDefault: paymentMethods.length === 0
      });

      if (response.success && response.data) {
        await fetchPaymentMethods();
        setSelectedMethodId(response.data.paymentMethod.id);
        setShowAddCard(false);
      }
    } catch (error) {
      console.error('カード追加エラー:', error);
      onError?.('カードの追加に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">決済情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        {/* 決済詳細 */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">決済詳細</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">サービス:</span>
              <span className="text-sm font-medium">{serviceName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">料金:</span>
              <span className="text-lg font-bold text-pink-600">¥{amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 決済方法選択 */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">決済方法</h4>
          
          {paymentMethods.length > 0 ? (
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <label key={method.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethodId === method.id}
                    onChange={(e) => setSelectedMethodId(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {method.cardBrand?.toUpperCase()} **** **** **** {method.cardLast4}
                        </span>
                        {method.isDefault && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            デフォルト
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {method.expiryMonth}/{method.expiryYear}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">登録されている決済方法がありません</p>
            </div>
          )}

          {/* カード追加ボタン */}
          <button
            onClick={() => setShowAddCard(true)}
            className="w-full mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            + 新しいカードを追加
          </button>
        </div>

        {/* アクションボタン */}
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handlePayment}
            disabled={!selectedMethodId || isProcessing}
            className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                処理中...
              </div>
            ) : (
              `¥${amount.toLocaleString()}を支払う`
            )}
          </button>
        </div>

        {/* セキュリティ情報 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start">
            <svg className="w-4 h-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="text-xs text-blue-800 leading-relaxed">
                お支払い情報は暗号化され、安全に処理されます。カード情報は弊社サーバーに保存されません。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* カード追加モーダル */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">新しいカードを追加</h3>
            <p className="text-sm text-gray-600 mb-4">
              実際の実装では、ここにStripe Elements等のセキュアなカード入力フォームが表示されます。
            </p>
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
    </div>
  );
}