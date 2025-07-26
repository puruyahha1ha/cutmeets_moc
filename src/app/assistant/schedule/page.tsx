'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../(web)/_components/providers/AuthProvider';

export const dynamic = 'force-dynamic';

interface TimeSlot {
    hour: number;
    minute: number;
}

interface WorkingHours {
    day: number; // 0-6 (日-土)
    isWorking: boolean;
    startTime: TimeSlot;
    endTime: TimeSlot;
    breakStart?: TimeSlot;
    breakEnd?: TimeSlot;
}

interface SpecialSchedule {
    id: string;
    date: string;
    type: 'holiday' | 'custom';
    label: string;
    startTime?: TimeSlot;
    endTime?: TimeSlot;
}

const DAYS_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土'];

export default function AssistantSchedule() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
    const [specialSchedules, setSpecialSchedules] = useState<SpecialSchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingDay, setEditingDay] = useState<number | null>(null);
    const [showSpecialModal, setShowSpecialModal] = useState(false);

    // 未認証またはアシスタント以外の場合はリダイレクト
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        // TODO: ユーザータイプがassistantでない場合のチェック
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (user) {
            // モックデータを設定
            setWorkingHours([
                // 日曜日
                { day: 0, isWorking: false, startTime: { hour: 10, minute: 0 }, endTime: { hour: 18, minute: 0 } },
                // 月曜日
                { day: 1, isWorking: true, startTime: { hour: 10, minute: 0 }, endTime: { hour: 19, minute: 0 }, breakStart: { hour: 13, minute: 0 }, breakEnd: { hour: 14, minute: 0 } },
                // 火曜日
                { day: 2, isWorking: true, startTime: { hour: 10, minute: 0 }, endTime: { hour: 19, minute: 0 }, breakStart: { hour: 13, minute: 0 }, breakEnd: { hour: 14, minute: 0 } },
                // 水曜日
                { day: 3, isWorking: false, startTime: { hour: 10, minute: 0 }, endTime: { hour: 18, minute: 0 } },
                // 木曜日
                { day: 4, isWorking: true, startTime: { hour: 10, minute: 0 }, endTime: { hour: 19, minute: 0 }, breakStart: { hour: 13, minute: 0 }, breakEnd: { hour: 14, minute: 0 } },
                // 金曜日
                { day: 5, isWorking: true, startTime: { hour: 10, minute: 0 }, endTime: { hour: 20, minute: 0 }, breakStart: { hour: 13, minute: 0 }, breakEnd: { hour: 14, minute: 0 } },
                // 土曜日
                { day: 6, isWorking: true, startTime: { hour: 9, minute: 0 }, endTime: { hour: 18, minute: 0 }, breakStart: { hour: 12, minute: 30 }, breakEnd: { hour: 13, minute: 30 } },
            ]);

            setSpecialSchedules([
                {
                    id: 'special_1',
                    date: '2024-01-20',
                    type: 'holiday',
                    label: '研修のためお休み'
                },
                {
                    id: 'special_2',
                    date: '2024-01-25',
                    type: 'custom',
                    label: '短縮営業',
                    startTime: { hour: 13, minute: 0 },
                    endTime: { hour: 17, minute: 0 }
                }
            ]);

            setIsLoading(false);
        }
    }, [user]);

    const formatTime = (time: TimeSlot) => {
        return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
    };

    const parseTime = (timeString: string): TimeSlot => {
        const [hour, minute] = timeString.split(':').map(Number);
        return { hour, minute };
    };

    const getDayWorkingHours = (day: number) => {
        return workingHours.find(wh => wh.day === day);
    };

    const updateWorkingHours = (day: number, updates: Partial<WorkingHours>) => {
        setWorkingHours(workingHours.map(wh => 
            wh.day === day ? { ...wh, ...updates } : wh
        ));
    };

    const addSpecialSchedule = (schedule: Omit<SpecialSchedule, 'id'>) => {
        const newSchedule: SpecialSchedule = {
            ...schedule,
            id: `special_${Date.now()}`
        };
        setSpecialSchedules([...specialSchedules, newSchedule]);
    };

    const removeSpecialSchedule = (id: string) => {
        setSpecialSchedules(specialSchedules.filter(s => s.id !== id));
    };

    const getWorkingDaysCount = () => {
        return workingHours.filter(wh => wh.isWorking).length;
    };

    const getTotalWorkingHours = () => {
        return workingHours.reduce((total, wh) => {
            if (!wh.isWorking) return total;
            const workMinutes = (wh.endTime.hour * 60 + wh.endTime.minute) - (wh.startTime.hour * 60 + wh.startTime.minute);
            const breakMinutes = wh.breakStart && wh.breakEnd 
                ? (wh.breakEnd.hour * 60 + wh.breakEnd.minute) - (wh.breakStart.hour * 60 + wh.breakStart.minute)
                : 0;
            return total + (workMinutes - breakMinutes) / 60;
        }, 0);
    };

    const DayEditor = ({ day }: { day: number }) => {
        const daySchedule = getDayWorkingHours(day);
        if (!daySchedule) return null;

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{DAYS_OF_WEEK[day]}曜日</h3>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={daySchedule.isWorking}
                            onChange={(e) => updateWorkingHours(day, { isWorking: e.target.checked })}
                            className="mr-2 w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700">勤務する</span>
                    </label>
                </div>

                {daySchedule.isWorking && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    開始時間
                                </label>
                                <input
                                    type="time"
                                    value={formatTime(daySchedule.startTime)}
                                    onChange={(e) => updateWorkingHours(day, { startTime: parseTime(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    終了時間
                                </label>
                                <input
                                    type="time"
                                    value={formatTime(daySchedule.endTime)}
                                    onChange={(e) => updateWorkingHours(day, { endTime: parseTime(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={!!(daySchedule.breakStart && daySchedule.breakEnd)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            updateWorkingHours(day, {
                                                breakStart: { hour: 13, minute: 0 },
                                                breakEnd: { hour: 14, minute: 0 }
                                            });
                                        } else {
                                            updateWorkingHours(day, {
                                                breakStart: undefined,
                                                breakEnd: undefined
                                            });
                                        }
                                    }}
                                    className="mr-2 w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                                />
                                <span className="text-sm text-gray-700">休憩時間を設定</span>
                            </label>

                            {daySchedule.breakStart && daySchedule.breakEnd && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            休憩開始
                                        </label>
                                        <input
                                            type="time"
                                            value={formatTime(daySchedule.breakStart)}
                                            onChange={(e) => updateWorkingHours(day, { breakStart: parseTime(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            休憩終了
                                        </label>
                                        <input
                                            type="time"
                                            value={formatTime(daySchedule.breakEnd)}
                                            onChange={(e) => updateWorkingHours(day, { breakEnd: parseTime(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!daySchedule.isWorking && (
                    <p className="text-gray-500 text-sm">この日は勤務しません</p>
                )}
            </div>
        );
    };

    const SpecialScheduleModal = () => {
        const [formData, setFormData] = useState({
            date: '',
            type: 'holiday' as 'holiday' | 'custom',
            label: '',
            startTime: '10:00',
            endTime: '18:00'
        });

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            
            const schedule: Omit<SpecialSchedule, 'id'> = {
                date: formData.date,
                type: formData.type,
                label: formData.label,
                ...(formData.type === 'custom' && {
                    startTime: parseTime(formData.startTime),
                    endTime: parseTime(formData.endTime)
                })
            };

            addSpecialSchedule(schedule);
            setShowSpecialModal(false);
            setFormData({
                date: '',
                type: 'holiday',
                label: '',
                startTime: '10:00',
                endTime: '18:00'
            });
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">特別スケジュール追加</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                日付
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                種類
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value as 'holiday' | 'custom'})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="holiday">お休み</option>
                                <option value="custom">特別営業時間</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                メモ
                            </label>
                            <input
                                type="text"
                                value={formData.label}
                                onChange={(e) => setFormData({...formData, label: e.target.value})}
                                placeholder="例：研修のため、短縮営業など"
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        {formData.type === 'custom' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        開始時間
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        終了時間
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowSpecialModal(false)}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
                            >
                                追加
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
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
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/assistant/dashboard" className="text-pink-500 hover:text-pink-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <Link href="/" className="text-xl font-bold text-pink-500">
                                Cutmeets
                            </Link>
                            <span className="text-gray-400">|</span>
                            <h1 className="text-lg font-semibold text-gray-900">スケジュール管理</h1>
                        </div>
                        <div className="text-sm text-gray-600">
                            {user?.name}さん
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">スケジュール情報を読み込み中...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 統計カード */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{getWorkingDaysCount()}</p>
                                    <p className="text-sm text-gray-600">勤務日数/週</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{getTotalWorkingHours().toFixed(1)}</p>
                                    <p className="text-sm text-gray-600">総労働時間/週</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{(getTotalWorkingHours() / getWorkingDaysCount() || 0).toFixed(1)}</p>
                                    <p className="text-sm text-gray-600">平均労働時間/日</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">{specialSchedules.length}</p>
                                    <p className="text-sm text-gray-600">特別スケジュール</p>
                                </div>
                            </div>
                        </div>

                        {/* 基本スケジュール */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">基本スケジュール</h2>
                                    <p className="text-sm text-gray-600 mt-1">週の基本的な勤務時間を設定してください</p>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {[1, 2, 4, 5, 6, 0, 3].map(day => (
                                    <DayEditor key={day} day={day} />
                                ))}
                            </div>
                        </div>

                        {/* 特別スケジュール */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">特別スケジュール</h2>
                                    <p className="text-sm text-gray-600 mt-1">休日や特別営業時間を設定してください</p>
                                </div>
                                <button
                                    onClick={() => setShowSpecialModal(true)}
                                    className="bg-pink-500 text-white px-4 py-2 rounded-xl hover:bg-pink-600 transition-colors flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>追加</span>
                                </button>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                                {specialSchedules.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600">特別スケジュールが設定されていません</p>
                                        <button
                                            onClick={() => setShowSpecialModal(true)}
                                            className="mt-4 text-pink-500 hover:text-pink-600 text-sm font-medium"
                                        >
                                            最初の特別スケジュールを追加
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {specialSchedules.map((schedule) => (
                                                <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                    <div>
                                                        <div className="flex items-center space-x-3">
                                                            <span className="font-medium text-gray-900">
                                                                {new Date(schedule.date).toLocaleDateString('ja-JP', { 
                                                                    year: 'numeric', 
                                                                    month: 'short', 
                                                                    day: 'numeric',
                                                                    weekday: 'short'
                                                                })}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                schedule.type === 'holiday' 
                                                                    ? 'bg-red-100 text-red-800' 
                                                                    : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                                {schedule.type === 'holiday' ? 'お休み' : '特別営業'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">{schedule.label}</p>
                                                        {schedule.startTime && schedule.endTime && (
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => removeSpecialSchedule(schedule.id)}
                                                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 保存ボタン */}
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => {
                                    // TODO: スケジュール保存処理
                                    alert('スケジュールを保存しました！');
                                }}
                                className="bg-pink-500 text-white px-8 py-3 rounded-xl hover:bg-pink-600 transition-colors text-lg font-medium"
                            >
                                スケジュールを保存
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* モーダル */}
            {showSpecialModal && <SpecialScheduleModal />}
        </div>
    );
}