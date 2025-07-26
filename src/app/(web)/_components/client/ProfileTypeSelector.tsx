'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileTypeSelector() {
  const router = useRouter();
  const [userType, setUserType] = useState<'customer' | 'assistant' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserType = () => {
      const storedUserType = localStorage.getItem('userType');
      
      if (storedUserType === 'assistant') {
        router.push('/profile/assistant');
        return;
      } else if (storedUserType === 'customer') {
        router.push('/profile/customer');
        return;
      }
      
      setUserType('customer');
      localStorage.setItem('userType', 'customer');
      setIsLoading(false);
    };

    getUserType();
  }, [router]);

  const handleUserTypeSelection = (type: 'customer' | 'assistant') => {
    setUserType(type);
    localStorage.setItem('userType', type);
    
    if (type === 'assistant') {
      router.push('/profile/assistant');
    } else {
      router.push('/profile/customer');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">プロフィール</h1>
            <p className="text-sm text-gray-600">ユーザータイプを選択してください</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleUserTypeSelection('customer')}
              className="w-full p-4 border border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                  お
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">お客様</h3>
                  <p className="text-sm text-gray-600">美容サービスを受ける方</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleUserTypeSelection('assistant')}
              className="w-full p-4 border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                  美
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">美容師アシスタント</h3>
                  <p className="text-sm text-gray-600">美容サービスを提供する方</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}