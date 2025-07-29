import { Suspense } from 'react';
import AssistantProfileClient from './AssistantProfileClient';

export const metadata = {
  title: 'アシスタント美容師プロフィール - Cutmeets',
  description: 'カットモデル募集状況の管理とプロフィール設定ができます。',
};

export default function AssistantProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      }>
        <AssistantProfileClient />
      </Suspense>
    </div>
  );
}