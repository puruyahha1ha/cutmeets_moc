// 決済詳細API エンドポイント
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, errorResponse, successResponse } from '@/lib/api/utils';
import { paymentDb } from '@/lib/api/payment-db';

// GET /api/payments/[id] - 決済詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return errorResponse(authResult.error!, 401);
  }

  try {
    const { id } = await params;
    const payment = await paymentDb.getPayment(id);
    if (!payment) {
      return errorResponse('決済が見つかりません', 404);
    }

    // アクセス権限チェック
    if (payment.customerId !== authResult.user!.id && payment.assistantId !== authResult.user!.id) {
      return errorResponse('この決済にアクセスする権限がありません', 403);
    }

    // 返金履歴も取得
    const refunds = await paymentDb.getRefundsByPaymentId(id);

    return successResponse({
      payment,
      refunds
    });
  } catch (error) {
    console.error('決済詳細取得エラー:', error);
    return errorResponse('決済詳細の取得に失敗しました', 500);
  }
}

// PUT /api/payments/[id] - 決済ステータス更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return errorResponse(authResult.error!, 401);
  }

  try {
    const data = await request.json();
    const { status, failureReason } = data;

    const { id } = await params;
    const payment = await paymentDb.getPayment(id);
    if (!payment) {
      return errorResponse('決済が見つかりません', 404);
    }

    // 権限チェック（アシスタントは自分の決済のみ、管理者は全て）
    if (payment.assistantId !== authResult.user!.id && authResult.user!.userType !== 'admin') {
      return errorResponse('この決済を更新する権限がありません', 403);
    }

    // ステータス更新
    const updatedPayment = await paymentDb.updatePaymentStatus(
      id,
      status,
      failureReason ? { failureReason } : {}
    );

    return successResponse({
      payment: updatedPayment,
      message: '決済ステータスが更新されました'
    });
  } catch (error) {
    console.error('決済ステータス更新エラー:', error);
    return errorResponse('決済ステータスの更新に失敗しました', 500);
  }
}