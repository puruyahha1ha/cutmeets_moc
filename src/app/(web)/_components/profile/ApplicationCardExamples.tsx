import React, { useState } from 'react';
import { ApplicationCard, ApplicationHeader, ApplicationContent, ApplicationActions } from './index';
import { Application } from './types';

// Example data for demonstration
const sampleApplications: Application[] = [
  {
    id: 1,
    jobTitle: '佐藤 花子',
    salon: '26歳 女性',
    location: '渋谷区',
    appliedDate: '2024-01-15',
    status: 'pending',
    jobType: 'part-time',
    salary: '料金: 無料',
    description: 'ボブスタイルの練習にご協力いただけるカットモデルを募集中。練習後のアフターケアも充実。',
    requirements: ['髪の長さ：肩より長い方', '施術時間：約2時間'],
    workingHours: '2時間前',
    daysPerWeek: '平日10:00-19:00'
  },
  {
    id: 2,
    jobTitle: '山田 美咲',
    salon: '25歳 女性',
    location: '新宿区',
    appliedDate: '2024-01-20',
    status: 'accepted',
    jobType: 'full-time',
    salary: '料金: 材料費2,000円',
    description: 'グラデーションカラーの技術向上のため、モデルさんを募集しています。最新のカラー剤を使用。',
    requirements: ['髪質：ブリーチ可能な方', 'カラー履歴の確認あり'],
    workingHours: '昨日',
    daysPerWeek: '土日9:30-18:30'
  },
  {
    id: 3,
    jobTitle: '田中 明子',
    salon: '28歳 女性',
    location: '港区',
    appliedDate: '2024-01-25',
    status: 'accepted',
    jobType: 'contract',
    salary: '料金: 1,000円',
    description: 'ブライダルやパーティー向けのヘアセット練習モデルを募集。プロ仕様のスタイリング剤使用。',
    requirements: ['髪の長さ：ミディアム以上', '写真撮影OK'],
    workingHours: '昨日',
    daysPerWeek: '土日祝8:00-17:00'
  },
  {
    id: 4,
    jobTitle: '鈴木 恵子',
    salon: '32歳 女性',
    location: '世田谷区',
    appliedDate: '2024-02-01',
    status: 'rejected',
    jobType: 'part-time',
    salary: '料金: 半額3,000円',
    description: '最新の髪質改善トリートメントのモニター募集。施術前後の写真撮影にご協力いただきます。',
    requirements: ['ダメージヘアの方歓迎'],
    workingHours: '約2.5時間',
    daysPerWeek: '火木土10:00-16:00'
  }
];

/**
 * ApplicationCardExamples - Demonstration component showing different variants and uses
 * This component showcases the modular design and various configurations of the ApplicationCard system
 */
const ApplicationCardExamples: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>(sampleApplications);
  const [loading, setLoading] = useState<number | null>(null);

  const handleAccept = async (id: number) => {
    setLoading(id);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'accepted' } : app
    ));
    setLoading(null);
  };

  const handleReject = async (id: number) => {
    setLoading(id);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'rejected' } : app
    ));
    setLoading(null);
  };

  const handleViewDetails = (id: number) => {
    console.log('View details for application:', id);
  };

  const handleChat = (id: number) => {
    console.log('Open chat for application:', id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ApplicationCard コンポーネント例</h1>
        <p className="text-gray-600 mb-6">
          モジュラー設計された応募カードコンポーネントの様々なバリエーション
        </p>
      </div>

      {/* Compact Variant */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Compact Variant (コンパクト表示)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map((application) => (
            <ApplicationCard
              key={`compact-${application.id}`}
              application={application}
              onAccept={handleAccept}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
              onChat={handleChat}
              variant="compact"
              loading={loading === application.id}
            />
          ))}
        </div>
      </section>

      {/* Detailed Variant */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Variant (詳細表示)</h2>
        <div className="space-y-4">
          {applications.slice(0, 2).map((application) => (
            <ApplicationCard
              key={`detailed-${application.id}`}
              application={application}
              onAccept={handleAccept}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
              onChat={handleChat}
              variant="detailed"
              loading={loading === application.id}
            />
          ))}
        </div>
      </section>

      {/* Interactive Cards */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Interactive Cards (クリック可能)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.slice(0, 2).map((application) => (
            <ApplicationCard
              key={`interactive-${application.id}`}
              application={application}
              onAccept={handleAccept}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
              onChat={handleChat}
              variant="compact"
              interactive={true}
              loading={loading === application.id}
            />
          ))}
        </div>
      </section>

      {/* Modular Components Showcase */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Modular Components (モジュラーコンポーネント)</h2>
        <p className="text-gray-600 mb-4">個別のコンポーネントを組み合わせてカスタムレイアウトを作成</p>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {/* Custom layout using modular components */}
          <ApplicationHeader 
            application={applications[0]}
            showAvatar={true}
            avatarSize="lg"
            showNewBadge={true}
          />
          
          <ApplicationContent 
            application={applications[0]}
            variant="detailed"
            showDescription={true}
            showRequirements={true}
            maxDescriptionLength={200}
          />
          
          <ApplicationActions
            application={applications[0]}
            onAccept={handleAccept}
            onReject={handleReject}
            onViewDetails={handleViewDetails}
            onChat={handleChat}
            variant="horizontal"
            size="lg"
            loading={loading === applications[0].id}
          />
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">使用例</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="text-sm text-gray-700 overflow-x-auto">
{`// Basic usage
<ApplicationCard 
  application={application}
  onAccept={handleAccept}
  onReject={handleReject}
  variant="compact"
/>

// Detailed variant with interactions
<ApplicationCard 
  application={application}
  onAccept={handleAccept}
  onReject={handleReject}
  onViewDetails={handleViewDetails}
  onChat={handleChat}
  variant="detailed"
  interactive={true}
  loading={isLoading}
/>

// Using modular components
<BaseCard variant="elevated">
  <ApplicationHeader application={app} />
  <ApplicationContent application={app} variant="detailed" />
  <ApplicationActions application={app} onAccept={handleAccept} />
</BaseCard>`}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default ApplicationCardExamples;