'use client'

import { useState, useEffect } from 'react';
import { useBooking, TimeSlot, Booking } from '../providers/BookingProvider';

interface ScheduleCalendarProps {
  assistantId: string;
  onTimeSlotSelect?: (date: string, time: string) => void;
  readonly?: boolean;
  showBookingDetails?: boolean;
}

export default function ScheduleCalendar({ 
  assistantId, 
  onTimeSlotSelect, 
  readonly = false, 
  showBookingDetails = false 
}: ScheduleCalendarProps) {
  const { getAssistantSchedule, getBookings } = useBooking();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [schedule, setSchedule] = useState<{ [date: string]: TimeSlot[] }>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // 週の開始日（月曜日）を取得
  const getWeekStart = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  // 週の日付配列を生成
  const getWeekDates = (startDate: Date): Date[] => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekStart = getWeekStart(new Date(currentWeek));
  const weekDates = getWeekDates(weekStart);

  // スケジュールデータを取得
  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const startDate = weekDates[0].toISOString().split('T')[0];
        const endDate = weekDates[6].toISOString().split('T')[0];
        
        const scheduleData = await getAssistantSchedule(assistantId, startDate, endDate);
        setSchedule(scheduleData);

        if (showBookingDetails) {
          const bookingData = await getBookings(assistantId, 'assistant');
          setBookings(bookingData);
        }
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (assistantId) {
      fetchSchedule();
    }
  }, [assistantId, currentWeek, getAssistantSchedule, getBookings, showBookingDetails]);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date): string => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getDayName = (date: Date): string => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[date.getDay()];
  };

  const handleTimeSlotClick = (date: string, time: string) => {
    if (readonly) return;
    
    setSelectedDate(date);
    setSelectedTime(time);
    onTimeSlotSelect?.(date, time);
  };

  const getBookingForTimeSlot = (date: string, time: string): Booking | undefined => {
    return bookings.find(booking => 
      booking.date === date && 
      booking.startTime <= time && 
      booking.endTime > time &&
      booking.status !== 'cancelled'
    );
  };

  const goToPreviousWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newWeek);
  };

  const goToNextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  // 営業時間（9:00-18:00）の時間枠を生成
  const timeSlots = [];
  for (let hour = 9; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h3 className="text-lg font-semibold text-gray-900">
            {weekDates[0].getFullYear()}年{weekDates[0].getMonth() + 1}月
          </h3>
          
          <button
            onClick={goToNextWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <button
          onClick={goToToday}
          className="px-4 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
        >
          今日
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            {/* ヘッダー行（曜日と日付） */}
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-gray-500 py-2 w-20">時間</th>
                {weekDates.map((date, index) => (
                  <th key={index} className="text-center text-sm font-medium text-gray-900 py-2 min-w-[100px]">
                    <div className={`${
                      date.toDateString() === new Date().toDateString() 
                        ? 'text-pink-600 font-semibold' 
                        : ''
                    }`}>
                      <div>{getDayName(date)}</div>
                      <div className="text-xs text-gray-500">{formatDisplayDate(date)}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* 時間枠 */}
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time} className="border-t border-gray-100">
                  <td className="text-sm text-gray-500 py-1 pr-4">
                    {time}
                  </td>
                  {weekDates.map((date, dateIndex) => {
                    const dateString = formatDate(date);
                    const timeSlot = schedule[dateString]?.find(slot => slot.time === time);
                    const booking = showBookingDetails ? getBookingForTimeSlot(dateString, time) : null;
                    
                    return (
                      <td key={dateIndex} className="py-1 px-1">
                        <div
                          onClick={() => timeSlot?.available && handleTimeSlotClick(dateString, time)}
                          className={`
                            h-8 rounded text-xs flex items-center justify-center transition-all cursor-pointer
                            ${!timeSlot?.available 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : selectedDate === dateString && selectedTime === time
                              ? 'bg-pink-500 text-white'
                              : booking
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }
                          `}
                          title={
                            booking 
                              ? `予約済み: ${booking.customer?.name || 'お客様'} - ${booking.service?.name}`
                              : timeSlot?.available 
                              ? '予約可能' 
                              : '予約不可'
                          }
                        >
                          {booking ? (
                            <span className="truncate px-1">
                              {booking.customer?.name?.substring(0, 2) || '予約'}
                            </span>
                          ) : timeSlot?.available ? (
                            '●'
                          ) : (
                            '×'
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 凡例 */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
          <span>予約可能</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span>予約済み</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
          <span>予約不可</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-pink-500 rounded mr-2"></div>
          <span>選択中</span>
        </div>
      </div>

      {selectedDate && selectedTime && (
        <div className="mt-4 p-3 bg-pink-50 rounded-lg">
          <p className="text-sm text-pink-800">
            選択中: {selectedDate} {selectedTime}
          </p>
        </div>
      )}
    </div>
  );
}