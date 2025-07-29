'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthProvider';

export interface Service {
  id: string;
  name: string;
  duration: number; // 分単位
  price: number;
  description?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  assistantId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // 関連データ
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  assistant?: {
    id: string;
    name: string;
    email: string;
    salonName?: string;
    hourlyRate: number;
  };
  service?: Service;
}

export interface TimeSlot {
  time: string; // HH:MM
  available: boolean;
  booked?: boolean;
}

interface BookingContextType {
  // 予約データ
  bookings: Booking[];
  isLoading: boolean;
  lastSyncTime: Date;
  
  // 予約作成
  createBooking: (bookingData: CreateBookingData) => Promise<{ success: boolean; error?: string; bookingId?: string }>;
  
  // 予約管理
  getBookings: (userId: string, userType: 'customer' | 'assistant') => Promise<Booking[]>;
  getBookingById: (bookingId: string) => Promise<Booking | null>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<{ success: boolean; error?: string }>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  
  // スケジュール管理  
  getAvailableTimeSlots: (assistantId: string, date: string) => Promise<TimeSlot[]>;
  getAssistantSchedule: (assistantId: string, startDate: string, endDate: string) => Promise<{ [date: string]: TimeSlot[] }>;
  
  // サービス管理
  getServices: () => Service[];
  calculatePrice: (serviceId: string, duration: number, hourlyRate: number) => number;
  
  // 同期機能
  syncBookings: () => Promise<void>;
}

interface CreateBookingData {
  assistantId: string;
  serviceId: string;
  date: string;
  startTime: string;
  duration: number;
  notes?: string;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

interface BookingProviderProps {
  children: ReactNode;
}

export function BookingProvider({ children }: BookingProviderProps) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // サービス一覧 (モックデータ)
  const services: Service[] = [
    {
      id: 'cut',
      name: 'カット',
      duration: 60,
      price: 0, // アシスタントの時給によって決定
      description: 'シャンプー・カット・ブロー込み'
    },
    {
      id: 'color',
      name: 'カラー',
      duration: 120,
      price: 0,
      description: 'シャンプー・カラー・ブロー込み'
    },
    {
      id: 'perm',
      name: 'パーマ',
      duration: 150,
      price: 0,
      description: 'シャンプー・パーマ・カット・ブロー込み'
    },
    {
      id: 'treatment',
      name: 'トリートメント',
      duration: 45,
      price: 0,
      description: 'シャンプー・トリートメント・ブロー込み'
    },
    {
      id: 'shampoo-blow',
      name: 'シャンプー・ブロー',
      duration: 30,
      price: 0,
      description: 'シャンプー・ブローのみ'
    }
  ];

  // 予約作成
  const createBooking = async (bookingData: CreateBookingData): Promise<{ success: boolean; error?: string; bookingId?: string }> => {
    if (!user) {
      return { success: false, error: 'ログインが必要です' };
    }

    // バリデーション
    const validationResult = validateBookingData(bookingData);
    if (!validationResult.isValid) {
      return { success: false, error: validationResult.error };
    }

    setIsLoading(true);
    
    try {
      // 時間の重複チェック
      const [startHour, startMinute] = bookingData.startTime.split(':').map(Number);
      const endTime = new Date();
      endTime.setHours(startHour, startMinute + bookingData.duration);
      const endTimeString = endTime.toTimeString().slice(0, 5);

      const hasConflict = await checkTimeConflict(
        bookingData.assistantId,
        bookingData.date,
        bookingData.startTime,
        endTimeString
      );

      if (hasConflict) {
        return { success: false, error: '選択された時間は既に予約されています。別の時間を選択してください。' };
      }

      // TODO: 実際のAPI呼び出しに置き換える
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 料金計算 (モック: アシスタントの時給は2000円とする)
      const hourlyRate = 2000;
      const totalPrice = calculatePrice(bookingData.serviceId, bookingData.duration, hourlyRate);

      const newBooking: Booking = {
        id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        customerId: user.id,
        assistantId: bookingData.assistantId,
        serviceId: bookingData.serviceId,
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: endTimeString,
        status: 'pending',
        totalPrice,
        notes: bookingData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customer: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        service: services.find(s => s.id === bookingData.serviceId)
      };

      // ローカル状態を更新
      setBookings(prev => [...prev, newBooking]);
      
      return { success: true, bookingId: newBooking.id };
    } catch (error) {
      console.error('Booking creation error:', error);
      return { success: false, error: '予約の作成に失敗しました。しばらく後にお試しください。' };
    } finally {
      setIsLoading(false);
    }
  };

  // 予約一覧取得
  const getBookings = async (userId: string, userType: 'customer' | 'assistant'): Promise<Booking[]> => {
    try {
      // TODO: 実際のAPI呼び出しに置き換える
      await new Promise(resolve => setTimeout(resolve, 500));

      // モックデータをフィルタリング
      const filteredBookings = bookings.filter(booking => 
        userType === 'customer' ? booking.customerId === userId : booking.assistantId === userId
      );

      // 日付順にソート（新しい順）
      return filteredBookings.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.startTime);
        const dateB = new Date(b.date + ' ' + b.startTime);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('Get bookings error:', error);
      return [];
    }
  };

  // 予約ステータス更新
  const updateBookingStatus = async (bookingId: string, status: Booking['status']): Promise<{ success: boolean; error?: string }> => {
    try {
      // TODO: 実際のAPI呼び出しに置き換える
      await new Promise(resolve => setTimeout(resolve, 500));

      setBookings(prev => prev.map(booking =>
        booking.id === bookingId
          ? { ...booking, status, updatedAt: new Date().toISOString() }
          : booking
      ));

      return { success: true };
    } catch (error) {
      console.error('Update booking status error:', error);
      return { success: false, error: 'ステータスの更新に失敗しました' };
    }
  };

  // 予約キャンセル
  const cancelBooking = async (bookingId: string, reason?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // TODO: 実際のAPI呼び出しに置き換える
      await new Promise(resolve => setTimeout(resolve, 500));

      setBookings(prev => prev.map(booking =>
        booking.id === bookingId
          ? { 
              ...booking, 
              status: 'cancelled', 
              notes: reason ? `${booking.notes || ''}\nキャンセル理由: ${reason}` : booking.notes,
              updatedAt: new Date().toISOString() 
            }
          : booking
      ));

      return { success: true };
    } catch (error) {
      console.error('Cancel booking error:', error);
      return { success: false, error: '予約のキャンセルに失敗しました' };
    }
  };

  // 利用可能な時間枠取得
  const getAvailableTimeSlots = async (assistantId: string, date: string): Promise<TimeSlot[]> => {
    try {
      // TODO: 実際のAPI呼び出しに置き換える
      await new Promise(resolve => setTimeout(resolve, 300));

      // モック: 9:00-18:00の時間枠を30分刻みで生成
      const timeSlots: TimeSlot[] = [];
      for (let hour = 9; hour < 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // 既存の予約をチェック
          const isBooked = bookings.some(booking => 
            booking.assistantId === assistantId &&
            booking.date === date &&
            booking.startTime <= time &&
            booking.endTime > time &&
            booking.status !== 'cancelled'
          );

          timeSlots.push({
            time,
            available: !isBooked,
            booked: isBooked
          });
        }
      }

      return timeSlots;
    } catch (error) {
      console.error('Get time slots error:', error);
      return [];
    }
  };

  // アシスタントのスケジュール取得
  const getAssistantSchedule = async (assistantId: string, startDate: string, endDate: string): Promise<{ [date: string]: TimeSlot[] }> => {
    try {
      // TODO: 実際のAPI呼び出しに置き換える
      await new Promise(resolve => setTimeout(resolve, 500));

      const schedule: { [date: string]: TimeSlot[] } = {};
      
      // 日付範囲でループ
      const current = new Date(startDate);
      const end = new Date(endDate);
      
      while (current <= end) {
        const dateString = current.toISOString().split('T')[0];
        schedule[dateString] = await getAvailableTimeSlots(assistantId, dateString);
        current.setDate(current.getDate() + 1);
      }

      return schedule;
    } catch (error) {
      console.error('Get assistant schedule error:', error);
      return {};
    }
  };

  // サービス一覧取得
  const getServices = (): Service[] => {
    return services;
  };

  // 料金計算
  const calculatePrice = (serviceId: string, duration: number, hourlyRate: number): number => {
    // 時給ベースで計算
    return Math.round((duration / 60) * hourlyRate);
  };

  // バリデーション関数
  const validateBookingData = (data: CreateBookingData): { isValid: boolean; error?: string } => {
    if (!data.assistantId) {
      return { isValid: false, error: 'アシスタント美容師を選択してください' };
    }
    if (!data.serviceId) {
      return { isValid: false, error: 'サービスを選択してください' };
    }
    if (!data.date) {
      return { isValid: false, error: '日付を選択してください' };
    }
    if (!data.startTime) {
      return { isValid: false, error: '時間を選択してください' };
    }
    if (!data.duration || data.duration <= 0) {
      return { isValid: false, error: '無効なサービス時間です' };
    }

    // 日付が過去でないかチェック
    const bookingDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return { isValid: false, error: '過去の日付は選択できません' };
    }

    // 営業時間内かチェック (9:00-18:00)
    const [hour, minute] = data.startTime.split(':').map(Number);
    const startMinutes = hour * 60 + minute;
    const endMinutes = startMinutes + data.duration;
    
    if (startMinutes < 9 * 60 || endMinutes > 18 * 60) {
      return { isValid: false, error: '営業時間外です。9:00-18:00の間で選択してください' };
    }

    return { isValid: true };
  };

  // 時間重複チェック
  const checkTimeConflict = async (
    assistantId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> => {
    const existingBookings = bookings.filter(
      booking =>
        booking.assistantId === assistantId &&
        booking.date === date &&
        booking.status !== 'cancelled'
    );

    const newStartMinutes = timeToMinutes(startTime);
    const newEndMinutes = timeToMinutes(endTime);

    return existingBookings.some(booking => {
      const bookingStartMinutes = timeToMinutes(booking.startTime);
      const bookingEndMinutes = timeToMinutes(booking.endTime);

      return newStartMinutes < bookingEndMinutes && newEndMinutes > bookingStartMinutes;
    });
  };

  // 時間を分に変換
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // 予約詳細取得
  const getBookingById = async (bookingId: string): Promise<Booking | null> => {
    try {
      // TODO: 実際のAPI呼び出しに置き換える
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const booking = bookings.find(b => b.id === bookingId);
      return booking || null;
    } catch (error) {
      console.error('Get booking by id error:', error);
      return null;
    }
  };

  // リアルタイム同期機能 - 定期的に予約状況を更新
  useEffect(() => {
    if (!user) return;

    const syncInterval = setInterval(async () => {
      try {
        // バックグラウンドで最新の予約状況を取得
        const latestBookings = await getBookings(user.id, user.userType === 'stylist' ? 'assistant' : 'customer');
        
        // 変更があった場合のみ更新
        if (JSON.stringify(latestBookings) !== JSON.stringify(bookings)) {
          setBookings(latestBookings);
          setLastSyncTime(new Date());
        }
      } catch (error) {
        console.error('Background sync error:', error);
      }
    }, 30000); // 30秒ごとに同期

    return () => clearInterval(syncInterval);
  }, [user, bookings]); // bookingsが変更されるたびに同期間隔をリセット

  // 強制的に最新状態に同期する関数
  const syncBookings = async (): Promise<void> => {
    if (!user) return;

    try {
      const latestBookings = await getBookings(user.id, user.userType === 'stylist' ? 'assistant' : 'customer');
      setBookings(latestBookings);
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Manual sync error:', error);
    }
  };

  const value: BookingContextType = {
    bookings,
    isLoading,
    createBooking,
    getBookings,
    updateBookingStatus,
    cancelBooking,
    getAvailableTimeSlots,
    getAssistantSchedule,
    getServices,
    calculatePrice,
    getBookingById,
    syncBookings,
    lastSyncTime
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}