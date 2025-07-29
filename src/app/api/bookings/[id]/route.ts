import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/lib/api/middleware';
import { successResponse, errorResponse, notFoundResponse, forbiddenResponse, serverErrorResponse } from '@/lib/api/response';
import { bookingDb } from '@/lib/api/booking-db';
import { updateBookingSchema, validateRequest } from '@/lib/api/validation';

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface UpdateBookingRequest {
  date?: string;
  startTime?: string;
  endTime?: string;
  service?: string;
  totalPrice?: number;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

// GET /api/bookings/[id] - 予約詳細取得
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 認証チェック
    const { authenticated, user, response } = await authenticateRequest(request);
    if (!authenticated || !user) {
      return response!;
    }

    // 予約情報を取得
    const booking = await bookingDb.findBookingById(id);
    if (!booking) {
      return notFoundResponse('予約が見つかりません');
    }

    // 自分の予約のみ閲覧可能
    if (user.userType === 'customer' && booking.customerId !== user.userId) {
      return forbiddenResponse('この予約を閲覧する権限がありません');
    }
    if (user.userType === 'stylist' && booking.assistantId !== user.userId) {
      return forbiddenResponse('この予約を閲覧する権限がありません');
    }

    return successResponse({
      booking,
    });
  } catch (error) {
    console.error('Get booking error:', error);
    return serverErrorResponse('予約情報の取得中にエラーが発生しました');
  }
}

// PUT /api/bookings/[id] - 予約更新
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 認証チェック
    const { authenticated, user, response } = await authenticateRequest(request);
    if (!authenticated || !user) {
      return response!;
    }

    // リクエストボディを取得
    const body = await request.json();

    // バリデーション
    const { value, errors } = validateRequest<UpdateBookingRequest>(updateBookingSchema, body);
    if (errors) {
      return errorResponse('入力内容に誤りがあります', 400, errors);
    }

    // 予約情報を取得
    const booking = await bookingDb.findBookingById(id);
    if (!booking) {
      return notFoundResponse('予約が見つかりません');
    }

    // 更新権限のチェック
    const canUpdate = 
      (user.userType === 'customer' && booking.customerId === user.userId) ||
      (user.userType === 'stylist' && booking.assistantId === user.userId);
    
    if (!canUpdate) {
      return forbiddenResponse('この予約を更新する権限がありません');
    }

    // キャンセル済みの予約は更新不可
    if (booking.status === 'cancelled') {
      return errorResponse('キャンセル済みの予約は更新できません', 400);
    }

    // 時間変更の場合は重複チェック
    if (value!.date || value!.startTime || value!.endTime) {
      const newDate = value!.date || booking.date;
      const newStartTime = value!.startTime || booking.startTime;
      const newEndTime = value!.endTime || booking.endTime;

      // 時間の妥当性チェック
      const startMinutes = timeToMinutes(newStartTime);
      const endMinutes = timeToMinutes(newEndTime);
      if (startMinutes >= endMinutes) {
        return errorResponse('終了時間は開始時間より後に設定してください', 400);
      }

      const hasConflict = await bookingDb.checkTimeConflict(
        booking.assistantId,
        newDate,
        newStartTime,
        newEndTime,
        id
      );
      if (hasConflict) {
        return errorResponse('指定された時間帯は既に予約があります', 409);
      }
    }

    // 予約を更新
    const updatedBooking = await bookingDb.updateBooking(id, value!);
    if (!updatedBooking) {
      return serverErrorResponse('予約の更新に失敗しました');
    }

    return successResponse({
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Update booking error:', error);
    return serverErrorResponse('予約更新中にエラーが発生しました');
  }
}

// DELETE /api/bookings/[id] - 予約キャンセル
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 認証チェック
    const { authenticated, user, response } = await authenticateRequest(request);
    if (!authenticated || !user) {
      return response!;
    }

    // 予約情報を取得
    const booking = await bookingDb.findBookingById(id);
    if (!booking) {
      return notFoundResponse('予約が見つかりません');
    }

    // キャンセル権限のチェック
    const canCancel = 
      (user.userType === 'customer' && booking.customerId === user.userId) ||
      (user.userType === 'stylist' && booking.assistantId === user.userId);
    
    if (!canCancel) {
      return forbiddenResponse('この予約をキャンセルする権限がありません');
    }

    // 既にキャンセル済みの場合
    if (booking.status === 'cancelled') {
      return errorResponse('この予約は既にキャンセルされています', 400);
    }

    // 完了済みの予約はキャンセル不可
    if (booking.status === 'completed') {
      return errorResponse('完了済みの予約はキャンセルできません', 400);
    }

    // 予約をキャンセル（ステータスを更新）
    const cancelledBooking = await bookingDb.updateBooking(id, { status: 'cancelled' });
    if (!cancelledBooking) {
      return serverErrorResponse('予約のキャンセルに失敗しました');
    }

    return successResponse({
      booking: cancelledBooking,
      message: '予約をキャンセルしました',
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return serverErrorResponse('予約キャンセル中にエラーが発生しました');
  }
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}