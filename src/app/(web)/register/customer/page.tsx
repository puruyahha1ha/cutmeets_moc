'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CustomerRegistrationData {
    // 基本情報
    name: string;
    furigana: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    birthDate: string;
    gender: 'male' | 'female' | 'other' | '';
    
    // プロフィール情報
    profileImage: File | null;
    preferredArea: string;
    
    // 美容に関する好み
    hairType: string;
    preferredServices: string[];
    budgetRange: string;
    preferredTime: string[];
    
    // 利用規約同意
    agreeToTerms: boolean;
    agreeToPrivacy: boolean;
    agreeToMarketing: boolean;
}

export default function CustomerRegistrationPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState<CustomerRegistrationData>({
        name: '',
        furigana: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        birthDate: '',
        gender: '',
        profileImage: null,
        preferredArea: '',
        hairType: '',
        preferredServices: [],
        budgetRange: '',
        preferredTime: [],
        agreeToTerms: false,
        agreeToPrivacy: false,
        agreeToMarketing: false
    });

    const areaOptions = [
        '東京都内',
        '横浜・川崎',
        '千葉',
        '埼玉',
        '大阪',
        '京都',
        '神戸',
        'その他'
    ];

    const hairTypeOptions = [
        'ストレート',
        'ウェーブ',
        'くせ毛',
        '天然パーマ',
        '硬毛',
        '軟毛',
        '細毛',
        '太毛'
    ];

    const serviceOptions = [
        'カット',
        'カラー',
        'パーマ',
        'ストレート',
        'トリートメント',
        'セット・ブロー',
        'ヘッドスパ'
    ];

    const budgetOptions = [
        '2,000円以下',
        '2,000-3,000円',
        '3,000-4,000円',
        '4,000-5,000円',
        '5,000-6,000円',
        '6,000円以上'
    ];

    const timeOptions = [
        '平日午前',
        '平日午後',
        '平日夕方',
        '土日午前',
        '土日午後',
        '土日夕方'
    ];

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleServiceToggle = (service: string) => {
        setFormData(prev => ({
            ...prev,
            preferredServices: prev.preferredServices.includes(service)
                ? prev.preferredServices.filter(s => s !== service)
                : [...prev.preferredServices, service]
        }));
    };

    const handleTimeToggle = (time: string) => {
        setFormData(prev => ({
            ...prev,
            preferredTime: prev.preferredTime.includes(time)
                ? prev.preferredTime.filter(t => t !== time)
                : [...prev.preferredTime, time]
        }));
    };

    const validateStep = (step: number) => {
        switch (step) {
            case 1:
                return formData.name && formData.furigana && formData.email && 
                       formData.password && formData.password === formData.confirmPassword && 
                       formData.phone && formData.birthDate && formData.gender;
            case 2:
                return formData.preferredArea && formData.hairType && 
                       formData.preferredServices.length > 0 && formData.budgetRange;
            case 3:
                return formData.agreeToTerms && formData.agreeToPrivacy;
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(3)) return;

        setIsSubmitting(true);
        
        // モック登録処理
        setTimeout(() => {
            alert('一般ユーザーとしての登録が完了しました！');
            router.push('/');
        }, 2000);
    };

    const renderProgressBar = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            step <= currentStep ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                            {step}
                        </div>
                        {step < 3 && (
                            <div className={`w-20 md:w-32 h-1 mx-2 ${
                                step < currentStep ? 'bg-pink-500' : 'bg-gray-200'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>基本情報</span>
                <span>好み設定</span>
                <span>確認</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* ヘッダー */}
                <div className="text-center mb-8">
                    <Link href="/register" className="inline-block mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-pink-500">Cutmeets</h1>
                    </Link>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                        一般ユーザー 新規登録
                    </h2>
                    <p className="text-gray-600">
                        お得にヘアカットを利用して、理想のスタイルを見つけましょう
                    </p>
                </div>

                {renderProgressBar()}

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        お名前 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        placeholder="田中 花子"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        フリガナ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.furigana}
                                        onChange={(e) => handleInputChange('furigana', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        placeholder="タナカ ハナコ"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    メールアドレス <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                    placeholder="example@email.com"
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        パスワード <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        placeholder="8文字以上"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        パスワード確認 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        placeholder="パスワードを再入力"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        電話番号 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        placeholder="090-1234-5678"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        生年月日 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    性別 <span className="text-red-500">*</span>
                                </label>
                                <div className="flex space-x-4">
                                    {[
                                        { value: 'male', label: '男性' },
                                        { value: 'female', label: '女性' },
                                        { value: 'other', label: 'その他' }
                                    ].map(({ value, label }) => (
                                        <label key={value} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={value}
                                                checked={formData.gender === value}
                                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                                className="mr-2 text-pink-500 focus:ring-pink-500"
                                            />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">好み・利用設定</h3>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        希望エリア <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.preferredArea}
                                        onChange={(e) => handleInputChange('preferredArea', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        required
                                    >
                                        <option value="">エリアを選択</option>
                                        {areaOptions.map((area) => (
                                            <option key={area} value={area}>{area}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        髪質 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.hairType}
                                        onChange={(e) => handleInputChange('hairType', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        required
                                    >
                                        <option value="">髪質を選択</option>
                                        {hairTypeOptions.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    利用したいサービス <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {serviceOptions.map((service) => (
                                        <label key={service} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.preferredServices.includes(service)}
                                                onChange={() => handleServiceToggle(service)}
                                                className="mr-2 text-pink-500 focus:ring-pink-500"
                                            />
                                            <span className="text-sm">{service}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    予算範囲 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.budgetRange}
                                    onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                    required
                                >
                                    <option value="">予算を選択</option>
                                    {budgetOptions.map((budget) => (
                                        <option key={budget} value={budget}>{budget}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    希望時間帯（複数選択可）
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {timeOptions.map((time) => (
                                        <label key={time} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.preferredTime.includes(time)}
                                                onChange={() => handleTimeToggle(time)}
                                                className="mr-2 text-pink-500 focus:ring-pink-500"
                                            />
                                            <span className="text-sm">{time}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                                <h4 className="font-semibold text-pink-900 mb-2 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    お得情報
                                </h4>
                                <div className="text-pink-800 text-sm space-y-1">
                                    <p>• 正規料金の約50%OFFで利用可能</p>
                                    <p>• 技術の高い若手美容師による施術</p>
                                    <p>• 安心の予約システムとサポート</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">確認・同意事項</h3>
                            
                            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                <h4 className="font-semibold text-gray-900">登録内容の確認</h4>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">お名前:</span>
                                        <span className="ml-2 font-medium">{formData.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">メールアドレス:</span>
                                        <span className="ml-2 font-medium">{formData.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">希望エリア:</span>
                                        <span className="ml-2 font-medium">{formData.preferredArea}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">予算範囲:</span>
                                        <span className="ml-2 font-medium">{formData.budgetRange}</span>
                                    </div>
                                    <div className="md:col-span-2">
                                        <span className="text-gray-600">希望サービス:</span>
                                        <span className="ml-2 font-medium">{formData.preferredServices.join(', ')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.agreeToTerms}
                                        onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                                        className="mt-1 text-pink-500 focus:ring-pink-500"
                                        required
                                    />
                                    <div className="text-sm">
                                        <Link href="/terms" className="text-pink-500 hover:underline">利用規約</Link>
                                        に同意します
                                    </div>
                                </label>

                                <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.agreeToPrivacy}
                                        onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
                                        className="mt-1 text-pink-500 focus:ring-pink-500"
                                        required
                                    />
                                    <div className="text-sm">
                                        <Link href="/privacy" className="text-pink-500 hover:underline">プライバシーポリシー</Link>
                                        に同意します
                                    </div>
                                </label>

                                <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.agreeToMarketing}
                                        onChange={(e) => handleInputChange('agreeToMarketing', e.target.checked)}
                                        className="mt-1 text-pink-500 focus:ring-pink-500"
                                    />
                                    <div className="text-sm">
                                        キャンペーン情報やお得な情報の配信に同意します（任意）
                                    </div>
                                </label>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">ご利用について</h4>
                                <div className="text-blue-800 text-sm space-y-1">
                                    <p>• 登録後すぐにアシスタント美容師の検索・予約が可能</p>
                                    <p>• 初回利用時は事前に相談メッセージでのやり取りをおすすめします</p>
                                    <p>• サービス利用後はレビューの投稿にご協力ください</p>
                                    <p>• 問題が発生した場合はサポートチームが対応します</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ナビゲーションボタン */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                        <div>
                            {currentStep > 1 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                >
                                    前へ
                                </button>
                            ) : (
                                <Link
                                    href="/register"
                                    className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium inline-block"
                                >
                                    戻る
                                </Link>
                            )}
                        </div>
                        
                        <div>
                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!validateStep(currentStep)}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                                        validateStep(currentStep)
                                            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 hover:shadow-lg'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    次へ
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={!validateStep(3) || isSubmitting}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                                        validateStep(3) && !isSubmitting
                                            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 hover:shadow-lg'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            登録中...
                                        </div>
                                    ) : (
                                        '登録完了'
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}