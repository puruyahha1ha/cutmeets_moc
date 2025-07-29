// 返金API エンドポイント
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, errorResponse, successResponse } from '@/lib/api/utils';
import { paymentDb } from '@/lib/api/payment-db';

// POST /api/refunds - 返金リクエスト作成
export async function POST(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return errorResponse(authResult.error!, 401);
  }

  try {
    const data = await request.json();
    const {
      paymentId,
      amount,
      reason,
      description
    } = data;

    // バリデーション
    if (!paymentId || !amount || !reason) {
      return errorResponse('必須フィールドが不足しています', 400);
    }

    // 決済の存在確認
    const payment = await paymentDb.getPayment(paymentId);
    if (!payment) {
      return errorResponse('指定された決済が見つかりません', 404);
    }

    // 権限チェック（顧客または関連するアシスタント）
    if (payment.customerId !== authResult.user!.id && payment.assistantId !== authResult.user!.id) {
      return errorResponse('この決済の返金をリクエストする権限がありません', 403);
    }

    // 決済が完了していることを確認
    if (payment.status !== 'completed') {
      return errorResponse('完了していない決済は返金できません', 400);
    }

    // 返金額の妥当性チェック
    if (amount > payment.amount) {
      return errorResponse('返金額が決済額を超えています', 400);
    }

    // 既存の返金確認
    const existingRefunds = await paymentDb.getRefundsByPaymentId(paymentId);
    const totalRefunded = existingRefunds
      .filter(refund => refund.status === 'completed')
      .reduce((sum, refund) => sum + refund.amount, 0);

    if (totalRefunded + amount > payment.amount) {
      return errorResponse('返金総額が決済額を超えています', 400);
    }

    // 返金作成
    const refund = await paymentDb.createRefund({
      paymentId,
      amount,
      reason,
      status: 'pending',
      description,
      requestedBy: authResult.user!.id
    });

    // 実際の実装では、ここで決済プロバイダーに返金リクエスト
    // const stripeRefund = await stripe.refunds.create({...});

    return successResponse({
      refund,
      message: '返金リクエストが正常に作成されました'
    });
  } catch (error) {
    console.error('返金リクエスト作成エラー:', error);
    return errorResponse('返金リクエストの作成に失敗しました', 500);
  }
}

// GET /api/refunds - 返金履歴取得
export async function GET(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return errorResponse(authResult.error!, 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return errorResponse('paymentIdパラメータが必要です', 400);
    }

    // 決済の存在確認
    const payment = await paymentDb.getPayment(paymentId);
    if (!payment) {
      return errorResponse('指定された決済が見つかりません', 404);
    }

    // 権限チェック
    if (payment.customerId !== authResult.user!.id && payment.assistantId !== authResult.user!.id) {
      return errorResponse('この決済の返金履歴を閲覧する権限がありません', 403);
    }

    const refunds = await paymentDb.getRefundsByPaymentId(paymentId);

    return successResponse({
      refunds: refunds.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    });
  } catch (error) {
    console.error('返金履歴取得エラー:', error);
    return errorResponse('返金履歴の取得に失敗しました', 500);
  }
}