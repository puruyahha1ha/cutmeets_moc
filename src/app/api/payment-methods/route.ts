// 決済方法API エンドポイント
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, errorResponse, successResponse } from '@/lib/api/utils';
import { paymentDb } from '@/lib/api/payment-db';

// GET /api/payment-methods - 決済方法一覧取得
export async function GET(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return errorResponse(authResult.error!, 401);
  }

  try {
    const paymentMethods = await paymentDb.getPaymentMethodsByUserId(authResult.user!!.id);

    return successResponse({
      paymentMethods: paymentMethods.map(pm => ({
        ...pm,
        // セキュリティのため、完全なカード情報は返さない
        cardLast4: pm.cardLast4,
        cardBrand: pm.cardBrand,
        expiryMonth: pm.expiryMonth,
        expiryYear: pm.expiryYear
      }))
    });
  } catch (error) {
    console.error('決済方法取得エラー:', error);
    return errorResponse('決済方法の取得に失敗しました', 500);
  }
}

// POST /api/payment-methods - 新規決済方法追加
export async function POST(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return errorResponse(authResult.error!, 401);
  }

  try {
    const data = await request.json();
    const {
      type,
      provider,
      cardToken, // 実際の実装ではStripeのトークンなど
      isDefault = false
    } = data;

    // バリデーション
    if (!type || !provider) {
      return errorResponse('決済方法のタイプとプロバイダーが必要です', 400);
    }

    // 既存のデフォルト設定を更新
    if (isDefault) {
      const existingMethods = await paymentDb.getPaymentMethodsByUserId(authResult.user!!.id);
      for (const method of existingMethods) {
        if (method.isDefault) {
          await paymentDb.updatePaymentMethod(method.id, { isDefault: false });
        }
      }
    }

    // 実際の実装では、ここでStripe等の決済プロバイダーにカード情報を登録
    // const stripeCustomer = await stripe.customers.create({...});
    // const paymentMethod = await stripe.paymentMethods.create({...});

    // 仮のカード情報（本番では暗号化された情報を保存）
    const paymentMethod = await paymentDb.createPaymentMethod({
      userId: authResult.user!!.id,
      type,
      provider,
      cardLast4: '4242', // 仮データ
      cardBrand: 'visa',
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault,
      isActive: true
    });

    return successResponse({
      paymentMethod: {
        ...paymentMethod,
        cardLast4: paymentMethod.cardLast4,
        cardBrand: paymentMethod.cardBrand,
        expiryMonth: paymentMethod.expiryMonth,
        expiryYear: paymentMethod.expiryYear
      },
      message: '決済方法が正常に追加されました'
    });
  } catch (error) {
    console.error('決済方法追加エラー:', error);
    return errorResponse('決済方法の追加に失敗しました', 500);
  }
}