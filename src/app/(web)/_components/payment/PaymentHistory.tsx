'use client'

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface PaymentHistoryProps {
  userType: 'customer' | 'assistant';
  limit?: number;
  showActions?: boolean;
}

export default function PaymentHistory({ 
  userType, 
  limit = 10, 
  showActions = false 
}: PaymentHistoryProps) {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [userType]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getPayments({
        userType,
        limit
      });

      if (response.success && response.data) {
        setPayments(response.data.payments);
      } else {
        setError(response.error || '決済履歴の取得に失敗しました');
      }
    } catch (err) {
      setError('決済履歴の取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '完了';
      case 'pending': return '保留中';
      case 'processing': return '処理中';
      case 'failed': return '失敗';
      case 'refunded': return '返金済み';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRefundRequest = async (payment: any) => {
    setSelectedPayment(payment);
    setShowRefundModal(true);
  };

  const processRefund = async (reason: string, description: string) => {
    if (!selectedPayment) return;

    try {
      const response = await apiClient.createRefund({
        paymentId: selectedPayment.id,
        amount: selectedPayment.amount,
        reason: reason as "customer_request" | "service_cancelled" | "quality_issue" | "other",
        description
      });

      if (response.success) {
        await fetchPayments();
        setShowRefundModal(false);
        setSelectedPayment(null);
      }
    } catch (error) {
      console.error('返金リクエストエラー:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchPayments}
          className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
        >
          再試行
        </button>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">決済履歴がありません</h3>
        <p className="text-gray-600">
          {userType === 'customer' ? 'サービスを利用すると決済履歴が表示されます' : 'サービス提供時の決済履歴が表示されます'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {payment.description}
              </h3>
              <p className="text-xs text-gray-600">
                {userType === 'customer' 
                  ? `アシスタント: ${payment.assistantName || '不明'}`
                  : `お客様: ${payment.customerName || '不明'}`
                }
              </p>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                {getStatusText(payment.status)}
              </span>
              <span className="text-sm font-bold text-gray-900">
                ¥{payment.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-3">
            <div>
              <span className="block">決済日時:</span>
              <span className="font-medium">{formatDate(payment.createdAt)}</span>
            </div>
            <div>
              <span className="block">取引ID:</span>
              <span className="font-medium font-mono">{payment.transactionId || payment.id}</span>
            </div>
          </div>

          {payment.metadata && (
            <div className="bg-gray-50 rounded p-3 mb-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {payment.metadata.serviceName && (
                  <div>
                    <span className="text-gray-600">サービス: </span>
                    <span className="font-medium">{payment.metadata.serviceName}</span>
                  </div>
                )}
                {payment.metadata.duration && (
                  <div>
                    <span className="text-gray-600">所要時間: </span>
                    <span className="font-medium">{payment.metadata.duration}分</span>
                  </div>
                )}
                {payment.metadata.scheduledDate && (
                  <div className="col-span-2">
                    <span className="text-gray-600">予定日時: </span>
                    <span className="font-medium">{formatDate(payment.metadata.scheduledDate)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {showActions && payment.status === 'completed' && userType === 'customer' && (
            <div className="flex space-x-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleRefundRequest(payment)}
                className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                返金リクエスト
              </button>
            </div>
          )}
        </div>
      ))}

      {/* 返金モーダル */}
      {showRefundModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">返金リクエスト</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                決済ID: {selectedPayment.id}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                金額: ¥{selectedPayment.amount.toLocaleString()}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                返金理由
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="customer_request">お客様都合</option>
                <option value="service_cancelled">サービスキャンセル</option>
                <option value="quality_issue">品質に関する問題</option>
                <option value="other">その他</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                詳細説明（任意）
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                rows={3}
                placeholder="返金理由の詳細をご記入ください"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={() => processRefund('customer_request', '')}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                返金リクエスト
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}