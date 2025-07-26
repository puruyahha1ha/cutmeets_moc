'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { value: '', label: '選択してください' },
    { value: 'booking', label: '予約に関するお問い合わせ' },
    { value: 'payment', label: '料金・支払いに関するお問い合わせ' },
    { value: 'account', label: 'アカウント・登録に関するお問い合わせ' },
    { value: 'technical', label: '技術的な問題・不具合' },
    { value: 'hairdresser', label: '美容師登録に関するお問い合わせ' },
    { value: 'salon', label: 'サロン登録に関するお問い合わせ' },
    { value: 'other', label: 'その他' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // エラーをクリア
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      category: '',
      subject: '',
      message: ''
    };

    // 名前のバリデーション
    if (!formData.name.trim()) {
      newErrors.name = 'お名前は必須です';
    }

    // メールアドレスのバリデーション
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    // カテゴリのバリデーション
    if (!formData.category) {
      newErrors.category = 'お問い合わせ種別を選択してください';
    }

    // 件名のバリデーション
    if (!formData.subject.trim()) {
      newErrors.subject = '件名は必須です';
    }

    // メッセージのバリデーション
    if (!formData.message.trim()) {
      newErrors.message = 'お問い合わせ内容は必須です';
    } else if (formData.message.length < 10) {
      newErrors.message = 'お問い合わせ内容は10文字以上で入力してください';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // フォーム送信のシミュレーション
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Contact form submitted:', formData);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">送信完了</h2>
          <p className="text-gray-600 mb-6">
            お問い合わせありがとうございます。
            <br />
            内容を確認の上、2営業日以内にご連絡いたします。
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">お問い合わせフォーム</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* 名前 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors text-sm sm:text-base"
            placeholder="山田 太郎"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* メールアドレス */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors text-sm sm:text-base"
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* 電話番号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            電話番号（任意）
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors text-sm sm:text-base"
            placeholder="090-1234-5678"
          />
        </div>

        {/* お問い合わせ種別 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            お問い合わせ種別 <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors text-sm sm:text-base"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        {/* 件名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            件名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors text-sm sm:text-base"
            placeholder="お問い合わせの件名を入力してください"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
          )}
        </div>

        {/* お問い合わせ内容 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            お問い合わせ内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors resize-none text-sm sm:text-base"
            placeholder="お問い合わせ内容を詳しくご記入ください"
          />
          <div className="mt-1 flex justify-between items-center">
            {errors.message ? (
              <p className="text-sm text-red-500">{errors.message}</p>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500">10文字以上でご記入ください</p>
            )}
            <span className="text-xs sm:text-sm text-gray-500">{formData.message.length}/1000文字</span>
          </div>
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-pink-500 text-white py-4 text-lg font-semibold rounded-xl hover:bg-pink-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '送信中...' : '送信する'}
        </button>
      </form>
    </div>
  );
}