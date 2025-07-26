import dynamic from 'next/dynamic';

// Dynamic import for ProfileTypeSelector to improve initial page load
const ProfileTypeSelector = dynamic(() => import('../_components/client/ProfileTypeSelector'), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-32 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto"></div>
          </div>
          <div className="space-y-4">
            {/* Customer option skeleton */}
            <div className="w-full p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                </div>
              </div>
            </div>
            {/* Assistant option skeleton */}
            <div className="w-full p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-36"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});

// Server Component with metadata
export const metadata = {
  title: 'プロフィール - Cutmeets',
  description: 'Cutmeetsのプロフィールページです。お客様または美容師アシスタントとしてサービスをご利用いただけます。',
  keywords: 'プロフィール,アカウント,お客様,美容師,アシスタント',
};

export default function ProfilePage() {
  return <ProfileTypeSelector />;
}