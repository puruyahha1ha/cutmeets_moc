import { NextRequest, NextResponse } from 'next/server';
import { mockSystemSettings } from '../../../admin/_data/mockData';

// GET /api/admin/settings - システム設定を取得
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement admin authentication check
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Replace with actual database query
    const settings = { ...mockSystemSettings };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - システム設定を更新
export async function PUT(request: NextRequest) {
  try {
    // TODO: Implement admin authentication check
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();

    // Validate settings
    const allowedSettings = [
      'platformFeeRate',
      'minBookingAmount',
      'maxBookingAmount',
      'maintenanceMode',
      'registrationEnabled',
      'paymentProcessingEnabled',
      'emailNotificationsEnabled',
      'smsNotificationsEnabled',
      'autoApprovalEnabled',
      'maxReportsBeforeAutoSuspension'
    ];

    const updates: any = {};
    for (const setting of allowedSettings) {
      if (body[setting] !== undefined) {
        // Validate specific settings
        if (setting === 'platformFeeRate') {
          const rate = parseFloat(body[setting]);
          if (isNaN(rate) || rate < 0 || rate > 30) {
            return NextResponse.json(
              { error: 'Invalid platform fee rate' },
              { status: 400 }
            );
          }
          updates[setting] = rate;
        } else if (setting === 'minBookingAmount' || setting === 'maxBookingAmount') {
          const amount = parseInt(body[setting]);
          if (isNaN(amount) || amount < 0) {
            return NextResponse.json(
              { error: `Invalid ${setting}` },
              { status: 400 }
            );
          }
          updates[setting] = amount;
        } else if (setting === 'maxReportsBeforeAutoSuspension') {
          const reports = parseInt(body[setting]);
          if (isNaN(reports) || reports < 1 || reports > 20) {
            return NextResponse.json(
              { error: 'Invalid max reports value' },
              { status: 400 }
            );
          }
          updates[setting] = reports;
        } else {
          updates[setting] = body[setting];
        }
      }
    }

    // Additional validation
    if (updates.minBookingAmount && updates.maxBookingAmount) {
      if (updates.minBookingAmount >= updates.maxBookingAmount) {
        return NextResponse.json(
          { error: 'Minimum booking amount must be less than maximum' },
          { status: 400 }
        );
      }
    }

    // TODO: Implement actual database update
    const updatedSettings = { ...mockSystemSettings, ...updates };
    console.log('Updating system settings:', updates);

    // Log critical changes
    if (updates.maintenanceMode !== undefined) {
      console.log(`Maintenance mode ${updates.maintenanceMode ? 'enabled' : 'disabled'} by admin`);
    }

    if (updates.platformFeeRate !== undefined) {
      console.log(`Platform fee rate changed to ${updates.platformFeeRate}%`);
    }

    return NextResponse.json({
      settings: updatedSettings,
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin' // TODO: Get actual admin ID
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings/reset - 設定をデフォルトにリセット
export async function POST(request: NextRequest) {
  try {
    // TODO: Implement admin authentication check
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Implement actual database reset
    const defaultSettings = {
      platformFeeRate: 10,
      minBookingAmount: 1000,
      maxBookingAmount: 50000,
      maintenanceMode: false,
      registrationEnabled: true,
      paymentProcessingEnabled: true,
      emailNotificationsEnabled: true,
      smsNotificationsEnabled: false,
      autoApprovalEnabled: false,
      maxReportsBeforeAutoSuspension: 5
    };

    console.log('Settings reset to defaults by admin');

    return NextResponse.json({
      settings: defaultSettings,
      resetAt: new Date().toISOString(),
      resetBy: 'admin' // TODO: Get actual admin ID
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}