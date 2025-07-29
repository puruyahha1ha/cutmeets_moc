import { Suspense } from 'react';
import PaymentHistory from '../_components/payment/PaymentHistory';

export const metadata = {
  title: '決済履歴 - Cutmeets',
  description: 'カットモデルサービスの決済履歴を確認できます。',
};

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">決済履歴</h1>
          <p className="text-gray-600">ご利用いただいたサービスの決済履歴をご確認いただけます。</p>
        </div>

        {/* タブ切り替え（顧客・アシスタント両方の場合） */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button className="flex-1 px-4 py-3 text-center text-sm font-medium text-pink-600 border-b-2 border-pink-600">
                支払い履歴
              </button>
              <button className="flex-1 px-4 py-3 text-center text-sm font-medium text-gray-600 hover:text-gray-800">
                受取履歴
              </button>
            </nav>
          </div>
        </div>

        {/* 決済履歴リスト */}
        <Suspense fallback={
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">決済履歴を読み込み中...</p>
          </div>
        }>
          <PaymentHistory 
            userType="customer" 
            showActions={true}
          />
        </Suspense>

        {/* サポート情報 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">決済に関するお問い合わせ</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                決済に関してご不明な点がございましたら、カスタマーサポートまでお気軽にお問い合わせください。
                返金や決済トラブルについても迅速に対応いたします。
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline">
                サポートに連絡する
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}