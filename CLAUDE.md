# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cutmeets is a Japanese beauty salon matching platform built with Next.js 15.4.2, React 19, and TypeScript. The application helps users find and book assistant hairdressers for various beauty services.

## Development Commands

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Run production server
npm run lint         # ESLint checking
```

## Architecture Overview

### App Router Structure
- Uses Next.js 15 App Router with route groups
- `src/app/(web)/` - Main website with Header/Footer layout
- `src/app/admin/` - Separate admin interface with different layout
- `src/app/api/` - API routes (currently empty, ready for expansion)

### Component Organization
- `_components/common/` - Shared UI components (Header, Footer)
- `_components/layout/` - Layout-specific components (empty, ready for expansion)
- `_components/providers/` - Context providers (empty, ready for state management)

### Key Architectural Patterns
- **Route Groups**: `(web)` separates main site from admin, enabling different layouts
- **Mobile-First Design**: Responsive components with desktop/mobile variants
- **Japanese UX**: Optimized for Japanese text rendering and user patterns

### Technology Stack
- **Framework**: Next.js 15.4.2 with App Router and Turbopack
- **React**: Version 19.1.0
- **Styling**: Tailwind CSS v4 with custom theme variables
- **Fonts**: Geist Sans/Mono from Google Fonts
- **Language**: Japanese (lang="ja") with text optimization classes

### Current Implementation Status
- **Landing Page**: Hero section, service categories, station selection modal
- **Registration**: Multi-step form (step 1/3 implemented)
- **Navigation**: Fixed header with mobile hamburger menu, responsive footer with mobile bottom nav
- **Styling**: Pink/red gradient theme, glass morphism effects, dark mode support

### Path Mapping
- `@/*` points to `./src/*`

## Page Structure

### Main Website (`/src/app/(web)/`)
```
/                           - ランディングページ（トップページ）
/register                   - アシスタント美容師・お客様登録（Step 1/3）
/register/step2             - 登録ステップ2（予定）
/register/step3             - 登録ステップ3（予定）
/search                     - アシスタント美容師検索
/contact                    - お問い合わせ
/help                       - ヘルプ・FAQ
/favorites                  - お気に入り（ブックマーク）
/profile                    - マイページ（共通）
/profile/assistant          - アシスタント美容師用プロフィール
/profile/customer           - お客様用プロフィール
```

### Admin Interface (`/src/app/admin/`)
```
/admin                      - 管理者ダッシュボード
```

### API Routes (`/src/app/api/`)
```
/api/*                      - APIエンドポイント（今後実装予定）
```

### Component Structure
```
_components/
├── common/                 - 共通コンポーネント
│   ├── Header.tsx         - ヘッダー（ナビゲーション）
│   └── Footer.tsx         - フッター（モバイル対応）
├── layout/                - レイアウト専用（拡張予定）
└── providers/             - Context Providers（状態管理用・拡張予定）
```

### Implementation Status
- ✅ **実装済み**: /, /register, /contact, /help, /favorites, /search, /profile/*
- 🔄 **部分実装**: /register（Step 1のみ完了、Step 2-3は今後）
- ❌ **未実装**: API routes, 管理画面詳細機能

## 機能不足分析・今後の実装予定

### 🔴 緊急度高：プラットフォームとして最低限必要な機能

#### 認証・ログイン機能
- **ログイン/ログアウト**: 現在登録フォームのみで、ログイン機能が未実装
- **認証状態管理**: ユーザーの認証状態を管理するContext/Provider
- **パスワードリセット**: パスワード忘れ時のリセット機能
- **アカウント認証**: メール認証、SMS認証

#### 予約・決済システム
- **予約機能**: アシスタント美容師への予約システム（現在完全に未実装）
- **予約管理**: 予約の確認、変更、キャンセル
- **決済システム**: オンライン決済（Stripe、PayPal等）
- **料金計算**: サービス内容・時間に応じた料金自動計算

#### データベース・API基盤
- **データベース設計**: ユーザー、予約、レビュー等のデータ管理
- **API routes**: 全ページがモックデータで動作、実際のデータ処理未実装
- **画像アップロード**: プロフィール写真、作品画像のアップロード機能

### 🟡 中程度：ユーザビリティ向上のための機能

#### 検索・マッチング機能強化
- **高度な検索フィルター**: 現在は基本的なフィルターのみ
- **地図連携**: Google Maps APIでの位置情報検索
- **おすすめ機能**: AIによるアシスタント美容師の推薦システム

#### コミュニケーション機能
- **メッセージ機能**: アシスタント美容師とお客様間のチャット
- **レビュー・評価システム**: 実際の評価投稿・表示機能
- **通知システム**: 予約確認、リマインダー通知

#### プロフィール管理強化
- **ポートフォリオ機能**: アシスタント美容師の作品画像ギャラリー
- **スケジュール管理**: アシスタント美容師の空き時間管理
- **売上管理**: アシスタント美容師向けの収益管理画面

### 🟢 低優先度：付加価値機能

#### 管理機能
- **管理者ダッシュボード**: 現在空の状態、全データの管理機能
- **レポート機能**: 売上、利用状況等の分析
- **不正利用対策**: スパム検知、不適切投稿の管理

#### マーケティング機能
- **クーポン・キャンペーン**: 割引システム
- **紹介制度**: 友達紹介による特典システム
- **SEO対策**: OGP設定、構造化データ

### 現在の実装状況詳細

#### ✅ 実装済み（UI層のみ、バックエンド未実装）
- **ランディングページ**: 完全実装、アシスタント美容師向けに最適化済み
- **登録フォーム**: Step 1完了、アシスタント美容師特化型に調整済み
- **検索ページ**: UI完成、モックデータ表示
- **お気に入りページ**: UI完成、モックデータ表示
- **プロフィールページ**: UI完成、ユーザータイプ切り替え可能
- **お問い合わせページ**: フォーム完成、送信処理未実装

#### 🔄 部分実装
- **登録フォーム**: Step 2-3未実装
- **レスポンシブデザイン**: 基本対応済み、細かい調整が必要

#### ❌ 未実装
- **全てのバックエンド機能**（API、データベース、認証）
- **決済システム**
- **予約システム**
- **リアルタイム通信**

## ユーザータイプ別登録フロー仕様

### 1. 基本登録フロー
1. **トップ画面** → **新規登録**ボタン
2. **ユーザータイプ選択**画面
   - 🎨 アシスタント美容師として登録
   - 👤 一般ユーザーとして登録
3. **プロフィール設定**（ユーザータイプ別）
4. **登録完了**（ユーザータイプ別の初期画面へ）

### 2. アシスタント美容師の登録フロー
#### プロフィール設定内容：
- **基本情報**: 名前、メール、パスワード
- **所属サロン情報**: サロン名、住所、最寄り駅
- **経験・技術**: 経験年数、取得資格、技術レベル
- **得意分野**: カット、カラー、パーマ、ストレート等
- **料金設定**: 時給、サービス別料金
- **勤務情報**: 勤務可能時間、曜日、休日
- **自己紹介**: プロフィール文、アピールポイント
- **画像**: プロフィール写真、作品ポートフォリオ（任意）

#### 登録完了後の動作：
- **アシスタント専用ダッシュボード**へリダイレクト
- 予約管理、顧客メッセージ、売上管理機能へアクセス
- プロフィール公開設定・編集

### 3. 一般ユーザーの登録フロー
#### プロフィール設定内容：
- **基本情報**: 名前、メール、パスワード
- **個人情報**: 年齢層、性別（任意）
- **髪の情報**: 髪質、髪の長さ、髪色
- **好み・要望**: 好みのスタイル、避けたいスタイル
- **予算**: 料金範囲設定
- **利用頻度**: 月何回程度利用予定か
- **特記事項**: アレルギー、注意事項（任意）

#### 登録完了後の動作：
- **一般ユーザー向けホーム画面**へリダイレクト
- おすすめアシスタント表示
- 検索・予約機能、お気に入り管理

### 4. 実装技術要件
- **AuthProvider拡張**: userType ('customer' | 'assistant') 判定追加
- **動的ルーティング**: ユーザータイプ別の画面遷移
- **条件分岐**: プロフィール設定画面の表示内容切り替え
- **リダイレクト処理**: 登録完了後の適切な画面遷移

### 5. ファイル構成予定
```
/register                    - ユーザータイプ選択
/register/assistant         - アシスタント美容師登録
/register/customer          - 一般ユーザー登録
/dashboard/assistant        - アシスタント専用ダッシュボード
/home                       - 一般ユーザー向けホーム
```

### Ready for Expansion Areas
- API routes in `src/app/api/`
- Layout components in `_components/layout/`
- State management providers in `_components/providers/`
- Additional registration steps
- Search functionality, user profiles, favorites system