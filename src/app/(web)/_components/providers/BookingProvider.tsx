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
  
  // 予約作成
  createBooking: (bookingData: CreateBookingData) => Promise<{ success: boolean; error?: string; bookingId?: string }>;
  
  // 予約管理
  getBookings: (userId: string, userType: 'customer' | 'assistant') => Promise<Booking[]>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<{ success: boolean; error?: string }>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  
  // スケジュール管理  
  getAvailableTimeSlots: (assistantId: string, date: string) => Promise<TimeSlot[]>;
  getAssistantSchedule: (assistantId: string, startDate: string, endDate: string) => Promise<{ [date: string]: TimeSlot[] }>;
  
  // サービス管理
  getServices: () => Service[];
  calculatePrice: (serviceId: string, duration: number, hourlyRate: number) => number;
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

    setIsLoading(true);
    
    try {
      // TODO: 実際のAPI呼び出しに置き換える
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 料金計算 (モック: アシスタントの時給は2000円とする)
      const hourlyRate = 2000;
      const totalPrice = calculatePrice(bookingData.serviceId, bookingData.duration, hourlyRate);
      
      // エンドタイムを計算
      const [startHour, startMinute] = bookingData.startTime.split(':').map(Number);
      const endTime = new Date();
      endTime.setHours(startHour, startMinute + bookingData.duration);
      const endTimeString = endTime.toTimeString().slice(0, 5);

      const newBooking: Booking = {
        id: `booking_${Date.now()}`,
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

      return filteredBookings;
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
    calculatePrice
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}