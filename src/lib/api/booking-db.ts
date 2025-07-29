export interface Booking {
  id: string;
  customerId: string;
  assistantId: string;
  date: string; // ISO 8601 format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  service: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

class BookingDatabase {
  private bookings: Map<string, Booking> = new Map();
  private customerBookings: Map<string, Set<string>> = new Map();
  private assistantBookings: Map<string, Set<string>> = new Map();

  constructor() {
    // 初期データを設定
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockBooking: Booking = {
      id: 'booking_1',
      customerId: 'user_2',
      assistantId: 'user_1',
      date: '2025-02-01',
      startTime: '14:00',
      endTime: '15:30',
      service: 'カット＆カラー',
      status: 'confirmed',
      totalPrice: 3000,
      notes: 'ショートヘアにしたいです',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.bookings.set(mockBooking.id, mockBooking);
    this.addToIndex(mockBooking);
  }

  private addToIndex(booking: Booking) {
    // Customer index
    if (!this.customerBookings.has(booking.customerId)) {
      this.customerBookings.set(booking.customerId, new Set());
    }
    this.customerBookings.get(booking.customerId)!.add(booking.id);

    // Assistant index
    if (!this.assistantBookings.has(booking.assistantId)) {
      this.assistantBookings.set(booking.assistantId, new Set());
    }
    this.assistantBookings.get(booking.assistantId)!.add(booking.id);
  }

  private removeFromIndex(booking: Booking) {
    this.customerBookings.get(booking.customerId)?.delete(booking.id);
    this.assistantBookings.get(booking.assistantId)?.delete(booking.id);
  }

  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newBooking: Booking = {
      id,
      ...bookingData,
      createdAt: now,
      updatedAt: now,
    };

    this.bookings.set(id, newBooking);
    this.addToIndex(newBooking);
    
    return newBooking;
  }

  async findBookingById(id: string): Promise<Booking | null> {
    return this.bookings.get(id) || null;
  }

  async findBookingsByCustomerId(customerId: string): Promise<Booking[]> {
    const bookingIds = this.customerBookings.get(customerId);
    if (!bookingIds) return [];

    return Array.from(bookingIds)
      .map(id => this.bookings.get(id))
      .filter(Boolean) as Booking[];
  }

  async findBookingsByAssistantId(assistantId: string): Promise<Booking[]> {
    const bookingIds = this.assistantBookings.get(assistantId);
    if (!bookingIds) return [];

    return Array.from(bookingIds)
      .map(id => this.bookings.get(id))
      .filter(Boolean) as Booking[];
  }

  async findAllBookings(userId: string, userType: 'stylist' | 'customer'): Promise<Booking[]> {
    if (userType === 'customer') {
      return this.findBookingsByCustomerId(userId);
    } else {
      return this.findBookingsByAssistantId(userId);
    }
  }

  async updateBooking(id: string, updates: Partial<Omit<Booking, 'id' | 'createdAt'>>): Promise<Booking | null> {
    const booking = this.bookings.get(id);
    if (!booking) return null;

    const updatedBooking: Booking = {
      ...booking,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async deleteBooking(id: string): Promise<boolean> {
    const booking = this.bookings.get(id);
    if (!booking) return false;

    this.removeFromIndex(booking);
    this.bookings.delete(id);
    return true;
  }

  // 時間の重複チェック
  async checkTimeConflict(
    assistantId: string, 
    date: string, 
    startTime: string, 
    endTime: string,
    excludeBookingId?: string
  ): Promise<boolean> {
    const assistantBookings = await this.findBookingsByAssistantId(assistantId);
    
    return assistantBookings.some(booking => {
      if (booking.id === excludeBookingId) return false;
      if (booking.date !== date) return false;
      if (booking.status === 'cancelled') return false;

      // 時間の重複チェック
      const bookingStart = this.timeToMinutes(booking.startTime);
      const bookingEnd = this.timeToMinutes(booking.endTime);
      const newStart = this.timeToMinutes(startTime);
      const newEnd = this.timeToMinutes(endTime);

      return (newStart < bookingEnd && newEnd > bookingStart);
    });
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

// シングルトンインスタンス
export const bookingDb = new BookingDatabase();