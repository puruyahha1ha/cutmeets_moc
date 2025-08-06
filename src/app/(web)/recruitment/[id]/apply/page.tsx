'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PaymentForm } from '../../../_components/payment';

// Mock data and API client
const MOCK_RECRUITMENT_POST = {
  id: '1',
  title: 'ボブカット練習のモデルさん募集！',
  description: 'ボブカットの技術向上のため、練習台をお願いします。丁寧にカットさせていただきます。初心者の方でも大歓迎です！',
  price: 1500,
  duration: 90,
  salon: {
    name: 'SALON TOKYO',
    station: '渋谷駅'
  },
  assistant: {
    id: 'assistant1',
    name: '田中 美香'
  }
};

const mockApiClient = {
  getRecruitmentPost: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return {
      success: true,
      data: {
        post: MOCK_RECRUITMENT_POST
      }
    };
  },
  createApplication: async (applicationData: any) => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    return {
      success: true,
      data: {
        application: {
          id: 'app_' + Date.now(),
          ...applicationData,
          createdAt: new Date().toISOString()
        }
      }
    };
  }
};

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const recruitmentId = params.id as string;

  const [recruitmentPost, setRecruitmentPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'application' | 'payment' | 'confirmation'>('application');
  const [applicationData, setApplicationData] = useState({
    message: '',
    availableTimes: [] as string[],
    photos: [] as string[],
    additionalInfo: {
      hairLength: '',
      previousTreatments: '',
      allergies: ''
    }
  });
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    fetchRecruitmentPost();
  }, [recruitmentId]);

  const fetchRecruitmentPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockApiClient.getRecruitmentPost(recruitmentId);
      if (response.success && response.data) {
        setRecruitmentPost(response.data.post);
      } else {
        setError('募集情報の取得に失敗しました');
      }
    } catch (err) {
      setError('募集情報の取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = async () => {
    try {
      const response = await mockApiClient.createApplication({
        postId: recruitmentId,
        message: applicationData.message,
        photos: applicationData.photos,
        availableTimes: applicationData.availableTimes,
        additionalInfo: applicationData.additionalInfo
      });

      if (response.success && response.data) {
        setApplicationId(response.data.application.id);
        setStep('payment');
      } else {
        setError('応募の送信に失敗しました');
      }
    } catch (err) {
      setError('応募の送信中にエラーが発生しました');
    }
  };

  const handlePaymentSuccess = (payment: any) => {
    setStep('confirmation');
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">募集情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!recruitmentPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">募集情報が見つかりません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* プログレスバー */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              ステップ {step === 'application' ? '1' : step === 'payment' ? '2' : '3'} / 3
            </span>
            <span className="text-sm text-gray-500">
              {step === 'application' ? '応募内容入力' : 
               step === 'payment' ? '決済' : '完了'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: step === 'application' ? '33%' : 
                       step === 'payment' ? '66%' : '100%' 
              }}
            ></div>
          </div>
        </div>

        {/* 募集情報 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h1 className="text-lg font-semibold text-gray-900 mb-2">{recruitmentPost.title}</h1>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">料金: </span>
              <span className="font-medium text-pink-600">¥{recruitmentPost.price?.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">所要時間: </span>
              <span className="font-medium">{recruitmentPost.duration}分</span>
            </div>
            <div>
              <span className="text-gray-600">場所: </span>
              <span className="font-medium">{recruitmentPost.salon?.name}</span>
            </div>
            <div>
              <span className="text-gray-600">アシスタント: </span>
              <span className="font-medium">{recruitmentPost.assistant?.name}</span>
            </div>
          </div>
        </div>

        {/* ステップ別コンテンツ */}
        {step === 'application' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">応募内容</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  応募メッセージ *
                </label>
                <textarea
                  value={applicationData.message}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="このサービスに応募する理由や、ご希望などをお聞かせください"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  現在の髪の長さ
                </label>
                <select
                  value={applicationData.additionalInfo.hairLength}
                  onChange={(e) => setApplicationData(prev => ({
                    ...prev,
                    additionalInfo: { ...prev.additionalInfo, hairLength: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                >
                  <option value="">選択してください</option>
                  <option value="short">ショート</option>
                  <option value="bob">ボブ</option>
                  <option value="medium">ミディアム</option>
                  <option value="long">ロング</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  過去の施術歴
                </label>
                <input
                  type="text"
                  value={applicationData.additionalInfo.previousTreatments}
                  onChange={(e) => setApplicationData(prev => ({
                    ...prev,
                    additionalInfo: { ...prev.additionalInfo, previousTreatments: e.target.value }
                  }))}
                  placeholder="例: カラー（2ヶ月前）、パーマ（半年前）"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  アレルギー・注意事項
                </label>
                <input
                  type="text"
                  value={applicationData.additionalInfo.allergies}
                  onChange={(e) => setApplicationData(prev => ({
                    ...prev,
                    additionalInfo: { ...prev.additionalInfo, allergies: e.target.value }
                  }))}
                  placeholder="特になければ「なし」とご記入ください"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                戻る
              </button>
              <button
                onClick={handleApplicationSubmit}
                disabled={!applicationData.message.trim()}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                決済に進む
              </button>
            </div>
          </div>
        )}

        {step === 'payment' && applicationId && (
          <PaymentForm
            applicationId={applicationId}
            assistantId={recruitmentPost.assistant?.id}
            amount={recruitmentPost.price}
            serviceName={recruitmentPost.title}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={() => setStep('application')}
          />
        )}

        {step === 'confirmation' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">応募が完了しました！</h2>
            <p className="text-gray-600 mb-6">
              決済が正常に処理され、アシスタント美容師に応募内容が送信されました。
              結果についてはメールまたはアプリ内通知でお知らせいたします。
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/applications')}
                className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                応募履歴を確認
              </button>
              <button
                onClick={() => router.push('/search')}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                他の募集を探す
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}