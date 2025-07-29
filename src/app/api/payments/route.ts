// 決済API エンドポイント
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, errorResponse, successResponse } from '@/lib/api/utils';
import { paymentDb } from '@/lib/api/payment-db';
import { NotificationService } from '@/lib/api/notification-service';

// GET /api/payments - 決済履歴取得
export async function GET(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return errorResponse(authResult.error!, 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('userType') as 'customer' | 'assistant' || 'customer';
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let payments = await paymentDb.getPaymentsByUserId(authResult.user!.id, userType);

    // ステータスでフィルタリング
    if (status) {
      payments = payments.filter(payment => payment.status === status);
    }

    // ページネーション
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPayments = payments.slice(startIndex, endIndex);

    return successResponse({
      payments: paginatedPayments,
      pagination: {
        current: page,
        total: Math.ceil(payments.length / limit),
        totalCount: payments.length
      }
    });
  } catch (error) {
    console.error('決済履歴取得エラー:', error);
    return errorResponse('決済履歴の取得に失敗しました', 500);
  }
}

// POST /api/payments - 新規決済作成
export async function POST(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return errorResponse(authResult.error!, 401);
  }

  try {
    const data = await request.json();
    const {
      applicationId,
      assistantId,
      amount,
      paymentMethodId,
      description,
      metadata
    } = data;

    // バリデーション
    if (!applicationId || !assistantId || !amount || !paymentMethodId) {
      return errorResponse('必須フィールドが不足しています', 400);
    }

    if (amount <= 0) {
      return errorResponse('金額は0より大きい値である必要があります', 400);
    }

    // 決済メソッドの存在確認
    const paymentMethods = await paymentDb.getPaymentMethodsByUserId(authResult.user!.id);
    const paymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId);
    if (!paymentMethod) {
      return errorResponse('指定された決済方法が見つかりません', 404);
    }

    // 決済作成
    const payment = await paymentDb.createPayment({
      applicationId,
      customerId: authResult.user!.id,
      assistantId,
      amount,
      currency: 'JPY',
      status: 'pending',
      paymentMethodId,
      description: description || '美容サービス料金',
      metadata: metadata || {}
    });

    // 実際の決済処理（Stripe等の実装）
    // const paymentIntent = await stripe.paymentIntents.create({...});
    
    // 仮の処理として即座に完了扱い
    await paymentDb.updatePaymentStatus(payment.id, 'completed', {
      transactionId: `txn_${Date.now()}`
    });

    const updatedPayment = await paymentDb.getPayment(payment.id);

    // 決済完了通知を送信
    try {
      await NotificationService.sendPaymentCompletedNotification(
        authResult.user!.id,
        payment.id,
        amount,
        description || '美容サービス料金'
      );
    } catch (notificationError) {
      console.error('決済完了通知の送信に失敗:', notificationError);
      // 通知送信の失敗は決済処理には影響させない
    }

    return successResponse({
      payment: updatedPayment,
      message: '決済が正常に処理されました'
    });
  } catch (error) {
    console.error('決済作成エラー:', error);
    return errorResponse('決済処理に失敗しました', 500);
  }
}