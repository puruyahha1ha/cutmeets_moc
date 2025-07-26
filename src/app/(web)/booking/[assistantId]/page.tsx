'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../_components/providers/AuthProvider';
import { useBooking, TimeSlot } from '../../_components/providers/BookingProvider';

interface Assistant {
    id: string;
    name: string;
    salonName?: string;
    hourlyRate: number;
}

export default function BookingPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { getServices, getAvailableTimeSlots, createBooking, calculatePrice, isLoading } = useBooking();

    const assistantId = params.assistantId as string;
    const serviceId = searchParams.get('service') || '';

    const [assistant, setAssistant] = useState<Assistant | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [notes, setNotes] = useState('');
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [bookingError, setBookingError] = useState('');

    const services = getServices();
    const selectedService = services.find(s => s.id === serviceId);

    // 未認証の場合はリダイレクト
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
    }, [isAuthenticated, router]);

    // アシスタント情報を取得 (モック)
    useEffect(() => {
        const mockAssistant: Assistant = {
            id: assistantId,
            name: '田中 美香',
            salonName: 'SALON TOKYO',
            hourlyRate: 2000
        };
        setAssistant(mockAssistant);
    }, [assistantId]);

    // 今日から7日後までの日付を生成
    const generateAvailableDates = () => {
        const dates = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push({
                value: date.toISOString().split('T')[0],
                label: i === 0 ? '今日' : i === 1 ? '明日' : 
                       `${date.getMonth() + 1}/${date.getDate()} (${['日', '月', '火', '水', '木', '金', '土'][date.getDay()]})`
            });
        }
        return dates;
    };

    const availableDates = generateAvailableDates();

    // 日付選択時に時間枠を取得
    useEffect(() => {
        if (selectedDate && assistantId) {
            setIsLoadingSlots(true);
            getAvailableTimeSlots(assistantId, selectedDate)
                .then(setTimeSlots)
                .finally(() => setIsLoadingSlots(false));
        }
    }, [selectedDate, assistantId, getAvailableTimeSlots]);

    // 予約実行
    const handleBooking = async () => {
        if (!selectedService || !selectedDate || !selectedTime || !assistant) {
            setBookingError('必要な情報が不足しています');
            return;
        }

        setBookingError('');
        
        const bookingData = {
            assistantId,
            serviceId: selectedService.id,
            date: selectedDate,
            startTime: selectedTime,
            duration: selectedService.duration,
            notes: notes.trim() || undefined
        };

        const result = await createBooking(bookingData);
        
        if (result.success) {
            router.push(`/booking/confirmation/${result.bookingId}`);
        } else {
            setBookingError(result.error || '予約に失敗しました');
        }
    };

    if (!isAuthenticated || !assistant || !selectedService) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    const totalPrice = calculatePrice(selectedService.id, selectedService.duration, assistant.hourlyRate);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-16 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href={`/assistant/${assistantId}`} className="flex items-center text-gray-600 hover:text-pink-500">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            戻る
                        </Link>
                        <h1 className="text-lg font-semibold text-gray-900">予約</h1>
                        <div className="w-12"></div>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* 予約内容確認 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">予約内容</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">アシスタント美容師:</span>
                            <span className="font-medium">{assistant.name}</span>
                        </div>
                        {assistant.salonName && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">サロン:</span>
                                <span className="font-medium">{assistant.salonName}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-600">サービス:</span>
                            <span className="font-medium">{selectedService.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">所要時間:</span>
                            <span className="font-medium">{selectedService.duration}分</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">料金:</span>
                            <span className="font-medium text-pink-600">¥{totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* 日時選択 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">日時選択</h2>
                    
                    {/* 日付選択 */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">日付</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {availableDates.map((date) => (
                                <button
                                    key={date.value}
                                    onClick={() => {
                                        setSelectedDate(date.value);
                                        setSelectedTime(''); // 時間選択をリセット
                                    }}
                                    className={`p-3 text-left border rounded-xl transition-all ${
                                        selectedDate === date.value
                                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="font-medium">{date.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 時間選択 */}
                    {selectedDate && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                時間 {isLoadingSlots && <span className="text-gray-500">(読み込み中...)</span>}
                            </label>
                            {isLoadingSlots ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot.time}
                                            onClick={() => setSelectedTime(slot.time)}
                                            disabled={!slot.available}
                                            className={`p-3 text-center border rounded-xl transition-all text-sm ${
                                                !slot.available
                                                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : selectedTime === slot.time
                                                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {slot.time}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {timeSlots.length === 0 && !isLoadingSlots && (
                                <p className="text-center text-gray-500 py-8">
                                    この日は予約可能な時間がありません
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* 備考 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">備考・要望 (任意)</h2>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="髪質や希望のスタイル、アレルギーなどがあればお書きください"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                        rows={4}
                    />
                </div>

                {/* エラー表示 */}
                {bookingError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-red-600">{bookingError}</p>
                    </div>
                )}

                {/* 予約ボタン */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="mb-4">
                        <div className="flex justify-between items-center text-lg font-semibold">
                            <span>合計金額:</span>
                            <span className="text-pink-600">¥{totalPrice.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">正規料金の約50%OFF</p>
                    </div>
                    
                    <button
                        onClick={handleBooking}
                        disabled={!selectedDate || !selectedTime || isLoading}
                        className={`w-full py-4 text-lg font-semibold rounded-xl transition-all flex items-center justify-center ${
                            selectedDate && selectedTime && !isLoading
                                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 shadow-lg hover:shadow-xl'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                予約中...
                            </>
                        ) : (
                            '予約を確定する'
                        )}
                    </button>

                    <p className="text-xs text-gray-500 mt-3 text-center">
                        予約確定後、アシスタント美容師からの確認連絡をお待ちください
                    </p>
                </div>
            </div>
        </div>
    );
}