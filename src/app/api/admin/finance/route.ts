import { NextRequest, NextResponse } from 'next/server';
import { mockPayments } from '../../../admin/_data/mockData';

// GET /api/admin/finance - 財務データを取得
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement admin authentication check
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // TODO: Replace with actual database queries
    let payments = [...mockPayments];

    // Apply filters
    if (status && status !== 'all') {
      payments = payments.filter(payment => payment.status === status);
    }

    if (startDate) {
      payments = payments.filter(payment => 
        new Date(payment.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      payments = payments.filter(payment => 
        new Date(payment.createdAt) <= new Date(endDate)
      );
    }

    // Calculate summary statistics
    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);
      
    const totalPlatformFees = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + payment.platformFee, 0);

    const totalAssistantEarnings = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + payment.assistantEarnings, 0);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPayments = payments.slice(startIndex, endIndex);

    return NextResponse.json({
      payments: paginatedPayments,
      summary: {
        totalRevenue,
        totalPlatformFees,
        totalAssistantEarnings,
        totalTransactions: payments.length,
        completedTransactions: payments.filter(p => p.status === 'completed').length,
        pendingTransactions: payments.filter(p => p.status === 'pending').length,
        failedTransactions: payments.filter(p => p.status === 'failed').length,
        disputedTransactions: payments.filter(p => p.status === 'disputed').length
      },
      pagination: {
        page,
        limit,
        total: payments.length,
        totalPages: Math.ceil(payments.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching finance data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/finance/refund - 返金処理
export async function POST(request: NextRequest) {
  try {
    // TODO: Implement admin authentication check
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { paymentId, reason, amount } = body;

    // Validate input
    if (!paymentId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database query
    const payment = mockPayments.find(p => p.id === paymentId);

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status !== 'completed') {
      return NextResponse.json(
        { error: 'Payment cannot be refunded' },
        { status: 400 }
      );
    }

    // TODO: Implement actual refund logic with payment processor
    const refundAmount = amount || payment.amount;
    const refund = {
      id: `refund_${Date.now()}`,
      paymentId,
      amount: refundAmount,
      reason,
      status: 'processing',
      processedBy: 'admin', // TODO: Get actual admin ID
      processedAt: new Date().toISOString()
    };

    console.log('Processing refund:', refund);

    return NextResponse.json(refund, { status: 201 });
  } catch (error) {
    console.error('Error processing refund:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}