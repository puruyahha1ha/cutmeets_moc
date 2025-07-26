'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AssistantRegistrationData {
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
    bio: string;
    
    // 職歴・資格
    experience: number;
    currentSalon: string;
    position: string;
    qualifications: string[];
    
    // サービス・料金
    services: {
        name: string;
        price: number;
        duration: number;
        description: string;
    }[];
    
    // 勤務情報
    availableAreas: string[];
    workingHours: {
        [key: string]: {
            start: string;
            end: string;
            available: boolean;
        };
    };
    
    // 利用規約同意
    agreeToTerms: boolean;
    agreeToPrivacy: boolean;
}

export default function AssistantRegistrationPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState<AssistantRegistrationData>({
        name: '',
        furigana: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        birthDate: '',
        gender: '',
        profileImage: null,
        bio: '',
        experience: 0,
        currentSalon: '',
        position: '',
        qualifications: [],
        services: [
            { name: 'カット', price: 3000, duration: 60, description: '' }
        ],
        availableAreas: [],
        workingHours: {
            monday: { start: '09:00', end: '18:00', available: true },
            tuesday: { start: '09:00', end: '18:00', available: true },
            wednesday: { start: '09:00', end: '18:00', available: true },
            thursday: { start: '09:00', end: '18:00', available: true },
            friday: { start: '09:00', end: '18:00', available: true },
            saturday: { start: '09:00', end: '18:00', available: true },
            sunday: { start: '09:00', end: '18:00', available: false }
        },
        agreeToTerms: false,
        agreeToPrivacy: false
    });

    const qualificationOptions = [
        '美容師免許',
        'カラリスト検定',
        'パーマ技能士',
        'アイリスト',
        'ネイリスト',
        'まつげエクステ',
        'その他'
    ];

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

    const serviceOptions = [
        'カット',
        'カラー',
        'パーマ',
        'ストレート',
        'トリートメント',
        'セット・ブロー',
        'ヘッドスパ',
        'その他'
    ];

    const dayNames = {
        monday: '月曜日',
        tuesday: '火曜日',
        wednesday: '水曜日',
        thursday: '木曜日',
        friday: '金曜日',
        saturday: '土曜日',
        sunday: '日曜日'
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleServiceChange = (index: number, field: string, value: any) => {
        const updatedServices = [...formData.services];
        updatedServices[index] = { ...updatedServices[index], [field]: value };
        setFormData(prev => ({ ...prev, services: updatedServices }));
    };

    const addService = () => {
        setFormData(prev => ({
            ...prev,
            services: [...prev.services, { name: '', price: 0, duration: 60, description: '' }]
        }));
    };

    const removeService = (index: number) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.filter((_, i) => i !== index)
        }));
    };

    const handleQualificationToggle = (qualification: string) => {
        setFormData(prev => ({
            ...prev,
            qualifications: prev.qualifications.includes(qualification)
                ? prev.qualifications.filter(q => q !== qualification)
                : [...prev.qualifications, qualification]
        }));
    };

    const handleAreaToggle = (area: string) => {
        setFormData(prev => ({
            ...prev,
            availableAreas: prev.availableAreas.includes(area)
                ? prev.availableAreas.filter(a => a !== area)
                : [...prev.availableAreas, area]
        }));
    };

    const handleWorkingHoursChange = (day: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: { ...prev.workingHours[day], [field]: value }
            }
        }));
    };

    const validateStep = (step: number) => {
        switch (step) {
            case 1:
                return formData.name && formData.furigana && formData.email && 
                       formData.password && formData.password === formData.confirmPassword && 
                       formData.phone && formData.birthDate && formData.gender;
            case 2:
                return formData.bio && formData.experience >= 0 && formData.currentSalon && formData.position;
            case 3:
                return formData.services.every(s => s.name && s.price > 0 && s.duration > 0) && 
                       formData.availableAreas.length > 0;
            case 4:
                return formData.agreeToTerms && formData.agreeToPrivacy;
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) return;

        setIsSubmitting(true);
        
        // モック登録処理
        setTimeout(() => {
            alert('アシスタント美容師としての登録が完了しました！');
            router.push('/assistant/dashboard');
        }, 2000);
    };

    const renderProgressBar = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            step <= currentStep ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                            {step}
                        </div>
                        {step < 4 && (
                            <div className={`w-16 h-1 mx-2 ${
                                step < currentStep ? 'bg-pink-500' : 'bg-gray-200'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>基本情報</span>
                <span>プロフィール</span>
                <span>サービス</span>
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
                        アシスタント美容師 新規登録
                    </h2>
                    <p className="text-gray-600">
                        あなたの技術を活かして、お客様とつながりましょう
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
                                        placeholder="山田 太郎"
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
                                        placeholder="ヤマダ タロウ"
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">プロフィール・職歴</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    自己紹介 <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                                    rows={4}
                                    placeholder="あなたの経験や技術、お客様への想いなどを教えてください"
                                    maxLength={500}
                                    required
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {formData.bio.length}/500
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        美容師経験年数 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.experience}
                                        onChange={(e) => handleInputChange('experience', parseInt(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        required
                                    >
                                        <option value="">選択してください</option>
                                        {Array.from({ length: 21 }, (_, i) => (
                                            <option key={i} value={i}>{i === 0 ? '未経験' : `${i}年`}</option>
                                        ))}
                                        <option value={21}>21年以上</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        現在の勤務先 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.currentSalon}
                                        onChange={(e) => handleInputChange('currentSalon', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                        placeholder="サロン名"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    役職・ポジション <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.position}
                                    onChange={(e) => handleInputChange('position', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                    placeholder="例: アシスタント、ジュニアスタイリスト"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    保有資格・スキル
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {qualificationOptions.map((qualification) => (
                                        <label key={qualification} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.qualifications.includes(qualification)}
                                                onChange={() => handleQualificationToggle(qualification)}
                                                className="mr-2 text-pink-500 focus:ring-pink-500"
                                            />
                                            <span className="text-sm">{qualification}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">サービス・勤務情報</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    提供サービス <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-4">
                                    {formData.services.map((service, index) => (
                                        <div key={index} className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="font-medium text-gray-900">サービス {index + 1}</span>
                                                {formData.services.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeService(index)}
                                                        className="text-red-500 hover:text-red-700 text-sm"
                                                    >
                                                        削除
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid md:grid-cols-3 gap-3">
                                                <div>
                                                    <select
                                                        value={service.name}
                                                        onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                                        required
                                                    >
                                                        <option value="">サービス選択</option>
                                                        {serviceOptions.map((option) => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={service.price}
                                                        onChange={(e) => handleServiceChange(index, 'price', parseInt(e.target.value))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                                        placeholder="料金"
                                                        min="0"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={service.duration}
                                                        onChange={(e) => handleServiceChange(index, 'duration', parseInt(e.target.value))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                                        placeholder="時間(分)"
                                                        min="15"
                                                        step="15"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <textarea
                                                value={service.description}
                                                onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                                                className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                                                rows={2}
                                                placeholder="サービスの詳細説明（任意）"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addService}
                                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-pink-500 hover:text-pink-500 transition-colors"
                                    >
                                        + サービスを追加
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    対応可能エリア <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {areaOptions.map((area) => (
                                        <label key={area} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.availableAreas.includes(area)}
                                                onChange={() => handleAreaToggle(area)}
                                                className="mr-2 text-pink-500 focus:ring-pink-500"
                                            />
                                            <span className="text-sm">{area}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    勤務可能時間
                                </label>
                                <div className="space-y-3">
                                    {Object.entries(dayNames).map(([day, dayName]) => (
                                        <div key={day} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                                            <label className="flex items-center min-w-[80px]">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.workingHours[day].available}
                                                    onChange={(e) => handleWorkingHoursChange(day, 'available', e.target.checked)}
                                                    className="mr-2 text-pink-500 focus:ring-pink-500"
                                                />
                                                {dayName}
                                            </label>
                                            {formData.workingHours[day].available && (
                                                <>
                                                    <input
                                                        type="time"
                                                        value={formData.workingHours[day].start}
                                                        onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                                    />
                                                    <span>〜</span>
                                                    <input
                                                        type="time"
                                                        value={formData.workingHours[day].end}
                                                        onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
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
                                        <span className="text-gray-600">経験年数:</span>
                                        <span className="ml-2 font-medium">{formData.experience === 0 ? '未経験' : `${formData.experience}年`}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">提供サービス:</span>
                                        <span className="ml-2 font-medium">{formData.services.length}件</span>
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
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">アシスタント美容師として</h4>
                                <div className="text-blue-800 text-sm space-y-1">
                                    <p>• 登録後は審査を行います（通常1-3営業日）</p>
                                    <p>• 審査通過後、お客様からの予約を受け付けられます</p>
                                    <p>• 技術の向上と安全な施術を心がけてください</p>
                                    <p>• お客様とのトラブル時はサポートチームが対応します</p>
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
                            {currentStep < 4 ? (
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
                                    disabled={!validateStep(4) || isSubmitting}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                                        validateStep(4) && !isSubmitting
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