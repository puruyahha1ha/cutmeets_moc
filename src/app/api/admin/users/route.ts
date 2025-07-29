import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '../../../admin/_data/mockData';

// GET /api/admin/users - 全ユーザーを取得
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement admin authentication check
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // TODO: Replace with actual database queries
    let filteredUsers = [...mockUsers];

    // Apply filters
    if (type && type !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.type === type);
    }

    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - 新しいユーザーを作成（管理者用）
export async function POST(request: NextRequest) {
  try {
    // TODO: Implement admin authentication check
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { name, email, type, status } = body;

    // TODO: Validate input data
    if (!name || !email || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Implement user creation logic
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      type,
      status: status || 'active',
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      bookingsCount: 0
    };

    console.log('Creating new user:', newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}