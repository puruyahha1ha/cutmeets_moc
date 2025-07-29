import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/lib/api/middleware';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api/response';
import { bookingDb } from '@/lib/api/booking-db';
import { createBookingSchema, validateRequest } from '@/lib/api/validation';
import { mockDb } from '@/lib/api/mock-db';

interface CreateBookingRequest {
  assistantId: string;
  date: string;
  startTime: string;
  endTime: string;
  service: string;
  totalPrice: number;
  notes?: string;
}

// POST /api/bookings - 予約作成
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const { authenticated, user, response } = await authenticateRequest(request);
    if (!authenticated || !user) {
      return response!;
    }

    // カスタマーのみ予約作成可能
    if (user.userType !== 'customer') {
      return errorResponse('お客様のみ予約を作成できます', 403);
    }

    // リクエストボディを取得
    const body = await request.json();

    // バリデーション
    const { value, errors } = validateRequest<CreateBookingRequest>(createBookingSchema, body);
    if (errors) {
      return errorResponse('入力内容に誤りがあります', 400, errors);
    }

    // アシスタント美容師の存在確認
    const assistant = await mockDb.findUserById(value!.assistantId);
    if (!assistant || assistant.userType !== 'stylist') {
      return errorResponse('指定されたアシスタント美容師が見つかりません', 404);
    }

    // 時間の妥当性チェック
    const startMinutes = timeToMinutes(value!.startTime);
    const endMinutes = timeToMinutes(value!.endTime);
    if (startMinutes >= endMinutes) {
      return errorResponse('終了時間は開始時間より後に設定してください', 400);
    }

    // 時間の重複チェック
    const hasConflict = await bookingDb.checkTimeConflict(
      value!.assistantId,
      value!.date,
      value!.startTime,
      value!.endTime
    );
    if (hasConflict) {
      return errorResponse('指定された時間帯は既に予約があります', 409);
    }

    // 予約を作成
    const newBooking = await bookingDb.createBooking({
      customerId: user.userId,
      assistantId: value!.assistantId,
      date: value!.date,
      startTime: value!.startTime,
      endTime: value!.endTime,
      service: value!.service,
      totalPrice: value!.totalPrice,
      notes: value!.notes,
      status: 'pending',
    });

    return successResponse({
      booking: newBooking,
    }, 201);
  } catch (error) {
    console.error('Create booking error:', error);
    return serverErrorResponse('予約作成中にエラーが発生しました');
  }
}

// GET /api/bookings - 予約一覧取得
export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const { authenticated, user, response } = await authenticateRequest(request);
    if (!authenticated || !user) {
      return response!;
    }

    // クエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // ユーザーの予約一覧を取得
    let bookings = await bookingDb.findAllBookings(user.userId, user.userType);

    // ステータスでフィルタリング
    if (status) {
      bookings = bookings.filter(b => b.status === status);
    }

    // 日付でソート（新しい順）
    bookings.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.startTime.localeCompare(a.startTime);
    });

    // ページネーション
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBookings = bookings.slice(startIndex, endIndex);

    return successResponse({
      bookings: paginatedBookings,
      pagination: {
        page,
        limit,
        total: bookings.length,
        totalPages: Math.ceil(bookings.length / limit),
      },
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return serverErrorResponse('予約一覧の取得中にエラーが発生しました');
  }
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}