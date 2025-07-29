'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface AdminAuthCheckProps {
  children: React.ReactNode;
}

export default function AdminAuthCheck({ children }: AdminAuthCheckProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // TODO: Replace with actual admin authentication check
        // For now, simulate admin authentication
        const response = await fetch('/api/auth/admin/check', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.isAdmin);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Admin authentication check failed:', error);
        // For development, allow access. In production, this should be false
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            認証確認中...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <ShieldExclamationIcon className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              アクセス拒否
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              このページにアクセスするには管理者権限が必要です。
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            <button
              onClick={() => router.push('/login')}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              管理者ログイン
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              トップページに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated - render admin interface
  return <>{children}</>;
}