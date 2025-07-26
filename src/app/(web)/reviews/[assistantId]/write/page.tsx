'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../_components/providers/AuthProvider';

interface ReviewData {
    rating: number;
    title: string;
    content: string;
    service: string;
    images: File[];
}

export default function WriteReviewPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [reviewData, setReviewData] = useState<ReviewData>({
        rating: 0,
        title: '',
        content: '',
        service: '',
        images: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [assistantName, setAssistantName] = useState('');
    const [availableServices] = useState(['カット', 'カラー', 'パーマ', 'トリートメント', 'ストレート', 'セット']);

    const assistantId = params.assistantId as string;

    // 未認証の場合はリダイレクト
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        // モックデータでアシスタント名を設定
        setAssistantName('田中 美香');
    }, [assistantId]);

    const handleRatingClick = (rating: number) => {
        setReviewData(prev => ({ ...prev, rating }));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (reviewData.images.length + files.length > 5) {
            alert('画像は最大5枚まで追加できます');
            return;
        }
        setReviewData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    };

    const removeImage = (index: number) => {
        setReviewData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (reviewData.rating === 0) {
            alert('評価を選択してください');
            return;
        }
        
        if (!reviewData.title.trim()) {
            alert('タイトルを入力してください');
            return;
        }
        
        if (!reviewData.content.trim()) {
            alert('レビュー内容を入力してください');
            return;
        }
        
        if (!reviewData.service) {
            alert('サービスを選択してください');
            return;
        }

        setIsSubmitting(true);
        
        // モック送信処理
        setTimeout(() => {
            alert('レビューを投稿しました！');
            router.push(`/reviews/${assistantId}`);
        }, 1500);
    };

    const renderStars = (interactive: boolean = false) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => interactive && handleRatingClick(star)}
                        className={`w-8 h-8 ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                        disabled={!interactive}
                    >
                        <svg
                            className={`w-full h-full fill-current ${
                                star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                ))}
            </div>
        );
    };

    const getRatingText = (rating: number) => {
        switch (rating) {
            case 1: return '不満';
            case 2: return 'やや不満';
            case 3: return '普通';
            case 4: return '満足';
            case 5: return '大満足';
            default: return '評価してください';
        }
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href={`/reviews/${assistantId}`} className="flex items-center text-gray-600 hover:text-pink-500">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            レビュー一覧に戻る
                        </Link>
                        <h1 className="text-lg font-semibold text-gray-900">レビューを書く</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* アシスタント情報 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                            {assistantName.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{assistantName}さんのレビューを書く</h2>
                            <p className="text-gray-600">あなたの体験を他のユーザーと共有しましょう</p>
                        </div>
                    </div>
                </div>

                {/* レビューフォーム */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 評価 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">総合評価</h3>
                        <div className="text-center">
                            {renderStars(true)}
                            <p className="text-lg font-medium text-gray-900 mt-2">
                                {getRatingText(reviewData.rating)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                星をクリックして評価してください
                            </p>
                        </div>
                    </div>

                    {/* サービス選択 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">利用したサービス</h3>
                        <select
                            value={reviewData.service}
                            onChange={(e) => setReviewData(prev => ({ ...prev, service: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                            required
                        >
                            <option value="">サービスを選択してください</option>
                            {availableServices.map((service) => (
                                <option key={service} value={service}>{service}</option>
                            ))}
                        </select>
                    </div>

                    {/* タイトル */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">レビュータイトル</h3>
                        <input
                            type="text"
                            value={reviewData.title}
                            onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="例: 丁寧で素晴らしい技術！"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                            maxLength={100}
                            required
                        />
                        <div className="text-right text-sm text-gray-500 mt-2">
                            {reviewData.title.length}/100
                        </div>
                    </div>

                    {/* レビュー内容 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">詳細なレビュー</h3>
                        <textarea
                            value={reviewData.content}
                            onChange={(e) => setReviewData(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="サービスの感想、技術力、接客、雰囲気など、詳しく教えてください"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                            rows={6}
                            maxLength={1000}
                            required
                        />
                        <div className="text-right text-sm text-gray-500 mt-2">
                            {reviewData.content.length}/1000
                        </div>
                    </div>

                    {/* 画像アップロード */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">写真を追加（任意）</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            施術後の写真を追加すると、他のユーザーの参考になります（最大5枚）
                        </p>
                        
                        {/* 画像プレビュー */}
                        {reviewData.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                {reviewData.images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                <span className="text-gray-500 text-sm">{image.name}</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* アップロードボタン */}
                        {reviewData.images.length < 5 && (
                            <label className="block">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-pink-500 hover:bg-pink-50 transition-colors cursor-pointer">
                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <p className="text-gray-600">
                                        写真を追加する<br />
                                        <span className="text-sm">（{5 - reviewData.images.length}枚まで追加可能）</span>
                                    </p>
                                </div>
                            </label>
                        )}
                    </div>

                    {/* 注意事項 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            レビュー投稿について
                        </h3>
                        <div className="text-blue-800 text-sm space-y-2">
                            <p>• 実際にサービスを利用した方のみレビューを投稿できます</p>
                            <p>• 個人情報や誹謗中傷を含む内容は削除される場合があります</p>
                            <p>• 投稿されたレビューは編集・削除できません</p>
                            <p>• レビューは他のユーザーが参考にするため、正確で建設的な内容をお願いします</p>
                        </div>
                    </div>

                    {/* 送信ボタン */}
                    <div className="flex space-x-4">
                        <Link
                            href={`/reviews/${assistantId}`}
                            className="flex-1 py-4 px-6 text-center text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                        >
                            キャンセル
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting || reviewData.rating === 0}
                            className={`flex-1 py-4 px-6 text-center text-white rounded-xl font-medium transition-all ${
                                isSubmitting || reviewData.rating === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 hover:shadow-lg'
                            }`}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    投稿中...
                                </div>
                            ) : (
                                'レビューを投稿'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}