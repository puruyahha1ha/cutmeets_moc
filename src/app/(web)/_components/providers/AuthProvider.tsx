'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'stylist' | 'customer';
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
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (profileData: Partial<User['profile']>) => Promise<{ success: boolean; error?: string }>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  userType: 'stylist' | 'customer';
  profile: User['profile'];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // アプリ起動時に認証状態を復元
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        
        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // TODO: 実際のAPI呼び出しに置き換える
      // 現在はモックロジック
      await new Promise(resolve => setTimeout(resolve, 1000)); // API呼び出しのシミュレート

      // モックユーザーデータ（実際はAPIから取得）
      const mockUsers = [
        {
          email: 'assistant@test.com',
          password: 'password123',
          userData: {
            id: '1',
            email: 'assistant@test.com',
            name: '田中 美香',
            userType: 'stylist' as const,
            profile: {
              phoneNumber: '090-1234-5678',
              birthDate: '1995-05-15',
              gender: 'female',
              experience: '2-3',
              specialties: ['カット', 'カラー'],
              hourlyRate: '2000',
              salonName: 'SALON TOKYO'
            }
          }
        },
        {
          email: 'customer@test.com',
          password: 'password123',
          userData: {
            id: '2',
            email: 'customer@test.com',
            name: '佐藤 花子',
            userType: 'customer' as const,
            profile: {
              phoneNumber: '090-9876-5432',
              birthDate: '1990-10-20',
              gender: 'female',
              preferredArea: 'tokyo',
              hairLength: 'medium',
              hairType: 'straight'
            }
          }
        }
      ];

      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        return { success: false, error: 'メールアドレスまたはパスワードが間違っています' };
      }

      const token = `mock_token_${Date.now()}`;
      
      setUser(foundUser.userData);
      localStorage.setItem('user', JSON.stringify(foundUser.userData));
      localStorage.setItem('authToken', token);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'ログインに失敗しました。しばらく後にお試しください。' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // TODO: 実際のAPI呼び出しに置き換える
      await new Promise(resolve => setTimeout(resolve, 1000));

      // モック登録処理
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        name: userData.name,
        userType: userData.userType,
        profile: userData.profile
      };

      const token = `mock_token_${Date.now()}`;
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('authToken', token);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: '登録に失敗しました。しばらく後にお試しください。' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType'); // 既存のuserType情報もクリア
  };

  const updateProfile = async (profileData: Partial<User['profile']>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'ログインが必要です' };
    }

    try {
      // TODO: 実際のAPI呼び出しに置き換える
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedUser = {
        ...user,
        profile: { ...user.profile, ...profileData }
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'プロフィールの更新に失敗しました' };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}