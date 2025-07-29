# Cutmeets - コンポーネント一覧

## 🧩 コンポーネント設計概要

Cutmeetsプラットフォームは、モジュラー設計によるコンポーネントライブラリを採用しています。各コンポーネントは再利用可能で、TypeScript による厳密な型定義により一貫性を保っています。

### 設計原則
- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **Single Responsibility**: 単一責任の原則
- **Composition over Inheritance**: 継承より合成
- **TypeScript First**: 型安全性の確保

## 📁 コンポーネント構造

```
src/app/(web)/_components/
├── common/          # 汎用UIコンポーネント
├── client/          # クライアントサイドコンポーネント  
├── profile/         # プロフィール関連コンポーネント
└── providers/       # React Context Providers
```

## 🔧 共通コンポーネント (common/)

### Header.tsx
**役割**: メインナビゲーション・ヘッダー

**Props:**
```typescript
interface HeaderProps {
  className?: string;
}
```

**機能:**
- レスポンシブナビゲーション
- ユーザー認証状態の表示
- モバイルハンバーガーメニュー
- ユーザータイプ別メニュー項目

**使用例:**
```tsx
<Header />
```

**ファイルパス:** `src/app/(web)/_components/common/Header.tsx`

---

### Footer.tsx
**役割**: サイトフッター・モバイル下部ナビゲーション

**Props:**
```typescript
interface FooterProps {
  className?: string;
}
```

**機能:**
- 3層フッター構造（PC版）
- モバイル用下部固定ナビゲーション
- ソーシャルリンク・企業情報
- レスポンシブ対応

**レスポンシブ動作:**
- **PC**: 従来のフッター表示
- **モバイル**: 下部固定ナビゲーションバー

**使用例:**
```tsx
<Footer />
```

**ファイルパス:** `src/app/(web)/_components/common/Footer.tsx`

---

### FontOptimizer.tsx
**役割**: フォント読み込み最適化

**機能:**
- フォント読み込み状態の管理
- FOIT/FOUT対策
- パフォーマンス最適化

**使用例:**
```tsx
<FontOptimizer />
```

**ファイルパス:** `src/app/(web)/_components/common/FontOptimizer.tsx`

## 💻 クライアントコンポーネント (client/)

### SearchInterface.tsx
**役割**: 募集投稿検索インターフェース

**Props:**
```typescript
interface SearchInterfaceProps {
  initialQuery?: string;
  onSearchResults?: (results: RecruitmentPost[]) => void;
  className?: string;
}
```

**機能:**
- 高度な検索フィルタリング
- リアルタイム検索結果表示
- フィルター条件の保存・復元
- ページネーション

**フィルター項目:**
- サービス種別 (カット、カラー、パーマ、トリートメント等)
- 価格帯
- 所要時間
- 募集ステータス
- アシスタントレベル

**使用例:**
```tsx
<SearchInterface 
  initialQuery="ボブカット"
  onSearchResults={handleResults}
/>
```

**ファイルパス:** `src/app/(web)/_components/client/SearchInterface.tsx`

---

### ProfileTypeSelector.tsx
**役割**: ユーザータイプ選択コンポーネント

**Props:**
```typescript
interface ProfileTypeSelectorProps {
  currentType: 'stylist' | 'customer';
  onTypeChange: (type: 'stylist' | 'customer') => void;
  disabled?: boolean;
}
```

**機能:**
- アシスタント美容師・カスタマー切り替え
- 視覚的な選択インディケーター
- アクセシビリティ対応

**使用例:**
```tsx
<ProfileTypeSelector 
  currentType={userType}
  onTypeChange={setUserType}
/>
```

**ファイルパス:** `src/app/(web)/_components/client/ProfileTypeSelector.tsx`

---

### ScheduleCalendar.tsx
**役割**: 予約カレンダーインターフェース

**Props:**
```typescript
interface ScheduleCalendarProps {
  availableDates: string[];
  selectedDate?: string;
  onDateSelect: (date: string) => void;
  timeSlots: TimeSlot[];
  onTimeSelect: (slot: TimeSlot) => void;
  disabled?: boolean;
}

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}
```

**機能:**
- カレンダー表示
- 利用可能日の強調表示
- 時間スロット選択
- 予約競合チェック

**使用例:**
```tsx
<ScheduleCalendar 
  availableDates={['2024-02-10', '2024-02-11']}
  selectedDate={selectedDate}
  onDateSelect={setSelectedDate}
  timeSlots={timeSlots}
  onTimeSelect={handleTimeSelect}
/>
```

**ファイルパス:** `src/app/(web)/_components/common/ScheduleCalendar.tsx`

## 👤 プロフィールコンポーネント (profile/)

### ApplicationCard.tsx
**役割**: 応募カード表示

**Props:**
```typescript
interface ApplicationCardProps {
  application: Application;
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onChat?: (id: number) => void;
  variant?: 'compact' | 'detailed';
  interactive?: boolean;
  loading?: boolean;
}
```

**機能:**
- 応募者情報表示
- ステータス別アクション提供
- 複数バリアント対応
- ローディング状態管理

**バリアント:**
- **compact**: 基本情報のみ
- **detailed**: 詳細情報含む

**使用例:**
```tsx
<ApplicationCard 
  application={application}
  onAccept={handleAccept}
  onReject={handleReject}
  variant="detailed"
/>
```

**ファイルパス:** `src/app/(web)/_components/profile/ApplicationCard.tsx`

---

### RecruitmentPostCard.tsx
**役割**: 募集投稿カード表示

**Props:**
```typescript
interface RecruitmentPostCardProps {
  post: RecruitmentPost;
  onViewApplicants?: (id: string) => void;
  onEdit?: (id: string) => void;
  onViewHistory?: (id: string) => void;
  onStop?: (id: string) => void;
  onDelete?: (id: string) => void;
  variant?: 'summary' | 'detailed';
}
```

**機能:**
- 募集投稿詳細表示
- 管理アクション提供
- 応募状況の可視化
- ステータス管理

**使用例:**
```tsx
<RecruitmentPostCard 
  post={recruitmentPost}
  onViewApplicants={handleViewApplicants}
  onEdit={handleEdit}
  variant="detailed"
/>
```

**ファイルパス:** `src/app/(web)/_components/profile/RecruitmentPostCard.tsx`

---

### ReviewCard.tsx
**役割**: レビュー・口コミ表示

**Props:**
```typescript
interface ReviewCardProps {
  booking: Booking;
  variant?: 'compact' | 'detailed';
  showCustomerInfo?: boolean;
}
```

**機能:**
- 星評価表示
- レビューコメント
- サービス詳細情報
- 日付・顧客情報

**使用例:**
```tsx
<ReviewCard 
  booking={booking}
  variant="detailed"
  showCustomerInfo={true}
/>
```

**ファイルパス:** `src/app/(web)/_components/profile/ReviewCard.tsx`

---

### StatusBadge.tsx
**役割**: ステータス表示バッジ

**Props:**
```typescript
interface StatusBadgeProps {
  status: ApplicationStatus | BookingStatus | PostStatus;
  type: 'application' | 'booking' | 'post';
  variant?: 'solid' | 'soft' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}
```

**機能:**
- 状態別色分け表示
- 複数バリアント対応
- アニメーション効果
- アクセシビリティ対応

**ステータス種別:**
```typescript
// 応募ステータス
type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

// 予約ステータス  
type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

// 投稿ステータス
type PostStatus = 'recruiting' | 'full' | 'closed';
```

**使用例:**
```tsx
<StatusBadge 
  status="pending"
  type="application"
  variant="soft"
  size="sm"
  animated={true}
/>
```

**ファイルパス:** `src/app/(web)/_components/profile/StatusBadge.tsx`

---

### ActionButton.tsx
**役割**: アクションボタン

**Props:**
```typescript
interface ActionButtonProps {
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
```

**機能:**
- 複数デザインバリアント
- ローディング状態表示
- 無効化状態対応
- アクセシビリティ機能

**使用例:**
```tsx
<ActionButton 
  variant="success"
  size="md"
  loading={isLoading}
  onClick={handleSubmit}
>
  承認する
</ActionButton>
```

**ファイルパス:** `src/app/(web)/_components/profile/ActionButton.tsx`

---

### TagList.tsx
**役割**: タグリスト表示

**Props:**
```typescript
interface TagListProps {
  tags: string[];
  variant?: 'default' | 'requirement' | 'skill' | 'service';
  size?: 'xs' | 'sm' | 'md';
  maxItems?: number;
  onTagClick?: (tag: string) => void;
  className?: string;
}
```

**機能:**
- カテゴリ別色分け
- クリック可能タグ
- 表示数制限
- レスポンシブ配置

**バリアント別色:**
- **default**: グレー系
- **requirement**: ブルー系  
- **skill**: グリーン系
- **service**: パープル系

**使用例:**
```tsx
<TagList 
  tags={['カット', 'ボブスタイル', '練習']}
  variant="service"
  size="sm"
  maxItems={5}
  onTagClick={handleTagClick}
/>
```

**ファイルパス:** `src/app/(web)/_components/profile/TagList.tsx`

---

### BaseCard.tsx
**役割**: カードコンポーネントベース

**Props:**
```typescript
interface BaseCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  borderColor?: 'default' | 'success' | 'warning' | 'error' | 'accent';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  interactive?: boolean;
  className?: string;
}
```

**機能:**
- 基本カードレイアウト
- 複数視覚バリアント
- ホバー効果
- アクセシビリティ対応

**使用例:**
```tsx
<BaseCard 
  variant="elevated"
  borderColor="success"
  hoverable={true}
>
  <CardContent />
</BaseCard>
```

**ファイルパス:** `src/app/(web)/_components/profile/BaseCard.tsx`

---

### EmptyState.tsx
**役割**: 空状態表示

**Props:**
```typescript
interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: 'document' | 'plus' | 'star' | 'search';
  variant?: 'application' | 'post' | 'review' | 'search';
  className?: string;
}
```

**機能:**
- 状況別メッセージ表示
- アクションボタン提供
- アイコン・イラスト表示
- 分かりやすいガイダンス

**使用例:**
```tsx
<EmptyState 
  title="応募履歴がありません"
  description="カットモデル募集に応募してみましょう"
  actionText="募集を探す"
  onAction={navigateToSearch}
  icon="document"
  variant="application"
/>
```

**ファイルパス:** `src/app/(web)/_components/profile/EmptyState.tsx`

## 🔄 プロバイダーコンポーネント (providers/)

### AuthProvider.tsx
**役割**: 認証状態管理

**Context:**
```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}
```

**機能:**
- JWT認証管理
- ユーザー状態追跡
- 自動トークンリフレッシュ
- ルート保護

**使用例:**
```tsx
// プロバイダー設定
<AuthProvider>
  <App />
</AuthProvider>

// フック使用
const { user, login, logout, isAuthenticated } = useAuth();
```

**ファイルパス:** `src/app/(web)/_components/providers/AuthProvider.tsx`

---

### BookingProvider.tsx
**役割**: 予約状態管理

**Context:**
```typescript
interface BookingContextType {
  bookings: Booking[];
  applications: Application[];
  createApplication: (data: ApplicationData) => Promise<void>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  refreshBookings: () => Promise<void>;
  isLoading: boolean;
}
```

**機能:**
- 予約・応募状態管理
- リアルタイム同期 (30秒間隔)
- 楽観的更新
- エラーハンドリング

**使用例:**
```tsx
// プロバイダー設定
<BookingProvider>
  <BookingInterface />
</BookingProvider>

// フック使用
const { bookings, createApplication, isLoading } = useBooking();
```

**ファイルパス:** `src/app/(web)/_components/providers/BookingProvider.tsx`

## 📝 型定義 (types.ts)

### 主要インターフェース
```typescript
// ユーザー関連
interface User {
  id: string;
  email: string;
  name: string;
  userType: 'stylist' | 'customer';
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProfile {
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  // アシスタント専用
  experience?: string;
  specialties?: string[];
  salon?: SalonInfo;
  // カスタマー専用  
  preferences?: string[];
  hairType?: string;
}

// 応募関連
interface Application {
  id: number;
  jobTitle: string;
  salon: string;
  location: string;
  status: 'pending' | 'accepted' | 'rejected';
  description: string;
  requirements: string[];
  workingHours: string;
  daysPerWeek: string;
  appliedDate: string;
}

// 募集投稿関連
interface RecruitmentPost {
  id: string;
  title: string;
  description: string;
  assistant: AssistantInfo;
  services: string[];
  duration: number;
  price: number;
  originalPrice: number;
  requirements: string[];
  modelCount: number;
  appliedCount: number;
  status: 'recruiting' | 'full' | 'closed';
  availableDates: string[];
  availableTimes: string[];
  postedDate: string;
}

// 予約関連
interface Booking {
  id: string;
  date: string;
  customer: string;
  service: string;
  price: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  rating: number | null;
  review: string | null;
}
```

**ファイルパス:** `src/app/(web)/_components/profile/types.ts`

## 🎯 コンポーネント使用ガイドライン

### 命名規則
- **PascalCase**: コンポーネント名
- **camelCase**: props・関数名
- **kebab-case**: CSS クラス名

### Props設計原則
```typescript
// ✅ Good: 明確で型安全
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// ❌ Bad: 曖昧で型安全性が低い
interface ButtonProps {
  type?: string;
  data?: any;
  callback?: Function;
}
```

### パフォーマンス最適化
```typescript
// メモ化による再レンダリング防止
const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <ComplexRendering data={data} />;
});

// コールバック最適化
const Parent = () => {
  const handleClick = useCallback(() => {
    // handle logic
  }, [dependency]);
  
  return <Child onClick={handleClick} />;
};
```

### アクセシビリティ対応
```typescript
// ARIA属性の適切な使用
<button
  aria-label="応募を承認"
  aria-pressed={isPressed}
  role="button"
  tabIndex={0}
>
  承認
</button>

// キーボードナビゲーション対応
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleAction();
  }
};
```

---

このコンポーネントライブラリにより、Cutmeets プラットフォームは統一性のある UI と優れた開発者体験を提供します。各コンポーネントは独立してテスト・保守可能で、プロジェクトの拡張性を支えています。