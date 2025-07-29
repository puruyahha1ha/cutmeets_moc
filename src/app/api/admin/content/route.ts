import { NextRequest, NextResponse } from 'next/server';
import { mockRecruitmentPosts, mockReviews, mockReports } from '../../../admin/_data/mockData';

// GET /api/admin/content - コンテンツ管理データを取得
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement admin authentication check
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // posts, reviews, reports
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let content: any[] = [];

    // TODO: Replace with actual database queries
    switch (type) {
      case 'posts':
        content = [...mockRecruitmentPosts];
        break;
      case 'reviews':
        content = [...mockReviews];
        break;
      case 'reports':
        content = [...mockReports];
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
    }

    // Apply status filter
    if (status && status !== 'all') {
      content = content.filter(item => item.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContent = content.slice(startIndex, endIndex);

    return NextResponse.json({
      content: paginatedContent,
      pagination: {
        page,
        limit,
        total: content.length,
        totalPages: Math.ceil(content.length / limit)
      },
      type
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/content/moderate - コンテンツの承認/拒否
export async function POST(request: NextRequest) {
  try {
    // TODO: Implement admin authentication check
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { contentId, contentType, action, reason } = body;

    // Validate input
    if (!contentId || !contentType || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject', 'remove'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // TODO: Implement actual moderation logic
    const moderationResult = {
      contentId,
      contentType,
      action,
      reason,
      moderatedBy: 'admin', // TODO: Get actual admin ID
      moderatedAt: new Date().toISOString(),
      newStatus: action === 'approve' ? 'active' : 'removed'
    };

    console.log('Content moderation:', moderationResult);

    return NextResponse.json(moderationResult);
  } catch (error) {
    console.error('Error moderating content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}