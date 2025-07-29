// モックデータベース - 実際の実装では PostgreSQL や MongoDB などを使用
export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'stylist' | 'customer';
  passwordHash: string;
  profile: {
    phoneNumber?: string;
    birthDate?: string;
    gender?: string;
    // アシスタント美容師用
    experience?: string;
    specialties?: string[];
    hourlyRate?: string;
    salonName?: string;
    // お客様用
    preferredArea?: string;
    hairLength?: string;
    hairType?: string;
  };
  createdAt: string;
  updatedAt: string;
}

class MockDatabase {
  private users: Map<string, User> = new Map();
  private emailIndex: Map<string, string> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // モックユーザーデータ
    const mockUsers: User[] = [
      // テスト用アカウント
      {
        id: 'user_1',
        email: 'assistant@test.com',
        name: '田中 美香',
        userType: 'stylist',
        passwordHash: '$2b$10$Hp6sYMwOp0z3.YVoxW5fluwrFa7JFWbUcpcmjECEOug83DBCegr5C', // password123
        profile: {
          experience: '3年',
          specialties: ['カット', 'カラー'],
          hourlyRate: '2000',
          salonName: 'SALON TOKYO',
          phoneNumber: '090-1234-5678'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'user_2',
        email: 'customer@test.com',
        name: '山田 花子',
        userType: 'customer',
        passwordHash: '$2b$10$Hp6sYMwOp0z3.YVoxW5fluwrFa7JFWbUcpcmjECEOug83DBCegr5C', // password123
        profile: {
          preferredArea: '東京都',
          hairLength: 'ロング',
          hairType: 'ストレート',
          phoneNumber: '090-9876-5432'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    mockUsers.forEach(user => {
      this.users.set(user.id, user);
      this.emailIndex.set(user.email, user.id);
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const userId = this.emailIndex.get(email);
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newUser: User = {
      id,
      ...userData,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(id, newUser);
    this.emailIndex.set(newUser.email, id);
    
    return newUser;
  }

  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(id, updatedUser);
    
    // メールアドレスが変更された場合はインデックスを更新
    if (updates.email && updates.email !== user.email) {
      this.emailIndex.delete(user.email);
      this.emailIndex.set(updates.email, id);
    }
    
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;

    this.emailIndex.delete(user.email);
    this.users.delete(id);
    return true;
  }

  async findUsersByType(userType: 'stylist' | 'customer'): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.userType === userType);
  }
}

// シングルトンインスタンス
export const mockDb = new MockDatabase();