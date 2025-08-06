'use client'

import { useState } from 'react';

// Mock API client
const mockApiClient = {
  createReview: async (reviewData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return {
      success: true,
      data: {
        review: {
          id: 'review_' + Date.now(),
          ...reviewData,
          createdAt: new Date().toISOString()
        }
      }
    };
  }
};

interface ReviewFormProps {
  bookingId: string;
  assistantId: string;
  assistantName: string;
  serviceName: string;
  onSuccess?: (review: any) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  bookingId,
  assistantId,
  assistantName,
  serviceName,
  onSuccess,
  onError,
  onCancel
}: ReviewFormProps) {
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    categories: {
      technical: 5,
      communication: 5,
      cleanliness: 5,
      timeliness: 5,
      atmosphere: 5
    },
    tags: [] as string[],
    isRecommended: true,
    serviceExperience: 'excellent' as 'excellent' | 'good' | 'average' | 'poor',
    wouldBookAgain: true,
    isPublic: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const availableTags = [
    '技術力', '丁寧', 'カウンセリング', '清潔', '時間厳守', '雰囲気',
    'コスパ', '親切', '相談しやすい', '仕上がり満足', 'また利用したい'
  ];

  const handleRatingChange = (field: string, rating: number) => {
    if (field === 'overall') {
      setFormData(prev => ({ ...prev, rating }));
    } else {
      setFormData(prev => ({
        ...prev,
        categories: { ...prev.categories, [field]: rating }
      }));
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.comment.trim()) {
      onError?.('タイトルとコメントは必須です');
      return;
    }

    if (formData.comment.length < 10) {
      onError?.('コメントは10文字以上で入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await mockApiClient.createReview({
        bookingId,
        assistantId,
        ...formData
      });

      if (response.success && response.data) {
        onSuccess?.(response.data.review);
      } else {
        onError?.('レビューの投稿に失敗しました');
      }
    } catch (error) {
      console.error('レビュー投稿エラー:', error);
      onError?.('レビューの投稿中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, onRate?: (rating: number) => void, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate?.(star)}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400 transition-colors ${!onRate ? 'cursor-default' : ''}`}
            disabled={!onRate}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 p-6">
      {/* ヘッダー */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">レビューを投稿</h2>
        <p className="text-sm text-gray-600">
          {assistantName}さんの「{serviceName}」についてレビューをお聞かせください
        </p>
      </div>

      {/* プログレスバー */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            ステップ {currentStep} / 3
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* ステップ1: 総合評価 */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">総合的な満足度をお聞かせください</h3>
            <div className="flex justify-center mb-4">
              {renderStars(formData.rating, (rating) => handleRatingChange('overall', rating), 'lg')}
            </div>
            <p className="text-sm text-gray-600">
              {formData.rating === 5 ? '非常に満足' :
               formData.rating === 4 ? '満足' :
               formData.rating === 3 ? '普通' :
               formData.rating === 2 ? '不満' : '非常に不満'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              レビュータイトル *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="例: 丁寧で技術力の高いアシスタントさんでした！"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              maxLength={100}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.title.length}/100
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              詳細コメント *
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="サービスの感想、技術力、接客態度などについて詳しく教えてください"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
              maxLength={1000}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.comment.length}/1000 (最低10文字)
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!formData.title.trim() || formData.comment.length < 10}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ
            </button>
          </div>
        </div>
      )}

      {/* ステップ2: カテゴリ別評価 */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">項目別に評価してください</h3>
          
          <div className="space-y-4">
            {[
              { key: 'technical', label: '技術力', description: 'カットやカラーの技術レベル' },
              { key: 'communication', label: 'コミュニケーション', description: 'カウンセリングや接客態度' },
              { key: 'cleanliness', label: '清潔感', description: '身だしなみや衛生管理' },
              { key: 'timeliness', label: '時間厳守', description: '予定時間の遵守' },
              { key: 'atmosphere', label: '雰囲気', description: '居心地の良さやリラックス度' }
            ].map((item) => (
              <div key={item.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                  {renderStars(
                    formData.categories[item.key as keyof typeof formData.categories],
                    (rating) => handleRatingChange(item.key, rating)
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              戻る
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              次へ
            </button>
          </div>
        </div>
      )}

      {/* ステップ3: 追加情報 */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">最後にいくつか質問があります</h3>

          {/* タグ選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              当てはまるタグを選択してください（複数選択可）
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-pink-100 border-pink-300 text-pink-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-pink-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 追加質問 */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isRecommended}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRecommended: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">このアシスタントを他の人におすすめしますか？</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.wouldBookAgain}
                  onChange={(e) => setFormData(prev => ({ ...prev, wouldBookAgain: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">また機会があれば利用したいですか？</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">このレビューを公開する（他のユーザーが閲覧可能）</span>
              </label>
            </div>
          </div>

          {/* 最終確認 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">レビュー内容確認</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center">
                <span>総合評価: </span>
                {renderStars(formData.rating, undefined, 'sm')}
                <span className="ml-2">({formData.rating}/5)</span>
              </div>
              <p>タイトル: {formData.title}</p>
              <p>コメント: {formData.comment.substring(0, 50)}{formData.comment.length > 50 ? '...' : ''}</p>
              <p>選択タグ: {formData.tags.join(', ') || 'なし'}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              戻る
            </button>
            <div className="flex space-x-3">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    投稿中...
                  </div>
                ) : (
                  'レビューを投稿'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}