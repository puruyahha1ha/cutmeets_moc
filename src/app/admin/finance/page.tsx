'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  CurrencyYenIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BanknotesIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { mockPayments, mockSystemSettings } from '../_data/mockData';
import type { Payment } from '../_types';

export default function FinanceManagementPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleRefund = (paymentId: string) => {
    setPayments(prevPayments =>
      prevPayments.map(payment =>
        payment.id === paymentId 
          ? { ...payment, status: 'refunded', refundedAt: new Date().toISOString() }
          : payment
      )
    );
    console.log('Refund processed:', paymentId);
  };

  const handleExportFinanceData = () => {
    const csvData = [
      ['ID', '予約ID', 'お客様', 'アシスタント', '金額', 'プラットフォーム手数料', 'アシスタント収益', 'ステータス', '決済方法', '作成日', '処理日'],
      ...payments.map(payment => [
        payment.id,
        payment.bookingId,
        payment.customerName,
        payment.assistantName,
        payment.amount,
        payment.platformFee,
        payment.assistantEarnings,
        payment.status,
        payment.method,
        new Date(payment.createdAt).toLocaleDateString('ja-JP'),
        payment.processedAt ? new Date(payment.processedAt).toLocaleDateString('ja-JP') : ''
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `finance_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate statistics
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
    
  const totalPlatformFees = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.platformFee, 0);

  const totalAssistantEarnings = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.assistantEarnings, 0);

  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const failedPayments = payments.filter(p => p.status === 'failed').length;
  const disputedPayments = payments.filter(p => p.status === 'disputed').length;
  const refundRequests = payments.filter(p => p.refundRequested).length;

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.assistantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'pending': return '処理中';
      case 'completed': return '完了';
      case 'failed': return '失敗';
      case 'refunded': return '返金済み';
      case 'disputed': return '紛争中';
      default: return '不明';
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'disputed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getMethodText = (method: Payment['method']) => {
    switch (method) {
      case 'credit_card': return 'クレジットカード';
      case 'bank_transfer': return '銀行振込';
      case 'digital_wallet': return 'デジタルウォレット';
      default: return '不明';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-heading-ja">
            財務管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-body-ja">
            決済監視・手数料管理・返金処理
          </p>
        </div>
        <button
          onClick={handleExportFinanceData}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
          財務データエクスポート
        </button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CurrencyYenIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                総売上
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ¥{totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+15.3%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <BanknotesIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                プラットフォーム手数料
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ¥{totalPlatformFees.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {mockSystemSettings.platformFeeRate}% 手数料率
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <CreditCardIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                アシスタント収益
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ¥{totalAssistantEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {totalRevenue > 0 ? ((totalAssistantEarnings / totalRevenue) * 100).toFixed(1) : 0}% 配分
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-500">
              <ExclamationTriangleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                要対応
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {disputedPayments + refundRequests}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                紛争 {disputedPayments}件・返金 {refundRequests}件
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(disputedPayments > 0 || refundRequests > 0) && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-400">
                要対応の決済があります
              </h3>
              <p className="text-orange-700 dark:text-orange-300 mt-1">
                {disputedPayments}件の紛争と{refundRequests}件の返金リクエストを確認してください。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          決済状況
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {payments.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">完了</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {pendingPayments}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">処理中</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {failedPayments}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">失敗</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {payments.filter(p => p.status === 'refunded').length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">返金済み</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {disputedPayments}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">紛争中</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="決済を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
          />
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">全ステータス</option>
              <option value="completed">完了</option>
              <option value="pending">処理中</option>
              <option value="failed">失敗</option>
              <option value="refunded">返金済み</option>
              <option value="disputed">紛争中</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  決済ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  利用者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  決済方法
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  日時
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {payment.id}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      予約ID: {payment.bookingId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <strong>{payment.customerName}</strong>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      → {payment.assistantName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ¥{payment.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      手数料: ¥{payment.platformFee.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      収益: ¥{payment.assistantEarnings.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </span>
                    {payment.refundRequested && (
                      <div className="text-xs text-red-500 mt-1">
                        返金要求中
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getMethodText(payment.method)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true, locale: ja })}
                    </div>
                    {payment.processedAt && (
                      <div className="text-xs">
                        処理済み: {formatDistanceToNow(new Date(payment.processedAt), { addSuffix: true, locale: ja })}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {payment.status === 'completed' && !payment.refundedAt && (
                      <button
                        onClick={() => handleRefund(payment.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-2"
                      >
                        返金
                      </button>
                    )}
                    {payment.status === 'disputed' && (
                      <button
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        詳細
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-8">
            <CurrencyYenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              決済が見つかりません
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              検索条件を変更してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}