# Cutmeets - デザインシステム・スタイリング仕様書

## 🎨 デザインシステム概要

CutmeetsプラットフォームのデザインシステムはJapanese-first設計を採用し、日本のユーザーに最適化されたモダンで直感的なUI/UXを提供します。

### デザイン原則
- **日本語最適化**: 日本語文字に最適化されたタイポグラフィとスペーシング
- **モバイルファースト**: スマートフォンでの利用を前提とした設計
- **アクセシビリティ**: WCAG 2.1 AAレベル準拠
- **一貫性**: 統一されたビジュアル言語とインタラクションパターン

## 🎯 カラーシステム

### プライマリーカラー
```css
/* ピンク・レッドグラデーション（メインブランドカラー） */
:root {
  --color-primary-50: #fdf2f8;
  --color-primary-100: #fce7f3; 
  --color-primary-200: #fbcfe8;
  --color-primary-300: #f9a8d4;
  --color-primary-400: #f472b6;
  --color-primary-500: #ec4899;    /* メインピンク */
  --color-primary-600: #db2777;    /* ダークピンク */
  --color-primary-700: #be185d;
  --color-primary-800: #9d174d;
  --color-primary-900: #831843;
  --color-primary-950: #500724;
}
```

### セカンダリーカラー
```css
/* パープル（アクセントカラー） */
:root {
  --color-secondary-50: #f5f3ff;
  --color-secondary-100: #ede9fe;
  --color-secondary-200: #ddd6fe;
  --color-secondary-300: #c4b5fd;
  --color-secondary-400: #a78bfa;
  --color-secondary-500: #8b5cf6;   /* メインパープル */
  --color-secondary-600: #7c3aed;
  --color-secondary-700: #6d28d9;
  --color-secondary-800: #5b21b6;
  --color-secondary-900: #4c1d95;
  --color-secondary-950: #2e1065;
}
```

### ステータスカラー
```css
:root {
  /* 成功（グリーン） */
  --color-success-50: #ecfdf5;
  --color-success-100: #d1fae5;
  --color-success-500: #10b981;
  --color-success-600: #059669;
  --color-success-900: #064e3b;
  
  /* 警告（アンバー） */
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-900: #78350f;
  
  /* エラー（レッド） */
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-900: #7f1d1d;
  
  /* 情報（ブルー） */
  --color-info-50: #eff6ff;
  --color-info-100: #dbeafe;
  --color-info-500: #3b82f6;
  --color-info-600: #2563eb;
  --color-info-900: #1e3a8a;
}
```

### グレースケール
```css
:root {
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;    /* ベースグレー */
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  --color-gray-950: #030712;
}
```

## 📝 タイポグラフィシステム

### フォントファミリー
```css
:root {
  --font-sans: 'Noto Sans JP', 'Geist Sans', 'Hiragino Kaku Gothic ProN', 
               'ヒラギノ角ゴ ProN W3', 'Yu Gothic Medium', '游ゴシック Medium',
               'YuGothic', '游ゴシック体', 'Meiryo', 'メイリオ', sans-serif;
               
  --font-mono: 'Geist Mono', 'SF Mono', Monaco, 'Inconsolata', 'Roboto Mono',
               'Noto Sans Mono', 'Ubuntu Mono', monospace;
}
```

### フォントサイズとライン高
```css
:root {
  /* フォントサイズ */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  
  /* ライン高 */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### 日本語テキスト最適化
```css
/* 日本語テキスト基本設定 */
.text-ja {
  word-break: keep-all;
  overflow-wrap: break-word;
  line-break: strict;
  font-feature-settings: "palt" 1, "pkna" 1;
  text-spacing: trim-start;
}

/* 文字間隔バリエーション */
.text-ja-tight {
  letter-spacing: 0.01em;
  line-height: 1.6;
}

.text-ja-normal {
  letter-spacing: 0.025em;
  line-height: 1.7;
}

.text-ja-relaxed {
  letter-spacing: 0.06em;    /* 改善された文字間隔 */
  line-height: 2.0;          /* 改善された行間 */
}

.text-ja-loose {
  letter-spacing: 0.08em;
  line-height: 2.2;
}

/* レスポンシブ対応 */
@media (max-width: 640px) {
  .text-ja-mobile {
    letter-spacing: 0.035em;
    line-height: 1.8;
  }
}
```

### 見出しスタイル
```css
.heading-1 {
  font-size: var(--text-4xl);
  font-weight: 700;
  line-height: var(--leading-tight);
  letter-spacing: -0.025em;
}

.heading-2 {
  font-size: var(--text-3xl);
  font-weight: 600;
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

.heading-3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  line-height: var(--leading-snug);
  letter-spacing: -0.015em;
}

.heading-4 {
  font-size: var(--text-xl);
  font-weight: 500;
  line-height: var(--leading-snug);
}

/* 日本語見出し用 */
.heading-ja-1 {
  @apply heading-1 text-ja-tight;
}

.heading-ja-2 {
  @apply heading-2 text-ja-tight;
}

.heading-ja-3 {
  @apply heading-3 text-ja-normal;
}
```

## 📏 スペーシングシステム

### スペース単位
```css
:root {
  --space-px: 1px;
  --space-0: 0;
  --space-0-5: 0.125rem;    /* 2px */
  --space-1: 0.25rem;       /* 4px */
  --space-1-5: 0.375rem;    /* 6px */
  --space-2: 0.5rem;        /* 8px */
  --space-2-5: 0.625rem;    /* 10px */
  --space-3: 0.75rem;       /* 12px */
  --space-3-5: 0.875rem;    /* 14px */
  --space-4: 1rem;          /* 16px */
  --space-5: 1.25rem;       /* 20px */
  --space-6: 1.5rem;        /* 24px */
  --space-7: 1.75rem;       /* 28px */
  --space-8: 2rem;          /* 32px */
  --space-10: 2.5rem;       /* 40px */
  --space-12: 3rem;         /* 48px */
  --space-16: 4rem;         /* 64px */
  --space-20: 5rem;         /* 80px */
  --space-24: 6rem;         /* 96px */
  --space-32: 8rem;         /* 128px */
}
```

### コンポーネント間スペーシング
```css
/* セクション間スペーシング */
.section-spacing {
  margin-bottom: var(--space-16);
}

.section-spacing-sm {
  margin-bottom: var(--space-8);
}

.section-spacing-lg {
  margin-bottom: var(--space-24);
}

/* カード内スペーシング */
.card-padding-sm {
  padding: var(--space-3);
}

.card-padding {
  padding: var(--space-4);
}

.card-padding-lg {
  padding: var(--space-6);
}
```

## 🔘 コンポーネントスタイル

### ボタンスタイル
```css
/* ベースボタンスタイル */
.btn-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  text-decoration: none;
}

.btn-base:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.btn-base:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* サイズバリエーション */
.btn-xs {
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-xs);
  line-height: var(--leading-none);
}

.btn-sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  line-height: var(--leading-none);
}

.btn-md {
  padding: var(--space-2-5) var(--space-4);
  font-size: var(--text-base);
  line-height: var(--leading-none);
}

.btn-lg {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-lg);
  line-height: var(--leading-none);
}

/* カラーバリエーション */
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-300);
}

.btn-secondary:hover {
  background-color: var(--color-gray-200);
  border-color: var(--color-gray-400);
}

.btn-success {
  background-color: var(--color-success-500);
  color: white;
}

.btn-success:hover {
  background-color: var(--color-success-600);
}

.btn-warning {
  background-color: var(--color-warning-500);
  color: white;
}

.btn-warning:hover {
  background-color: var(--color-warning-600);
}

.btn-danger {
  background-color: var(--color-error-500);
  color: white;
}

.btn-danger:hover {
  background-color: var(--color-error-600);
}
```

### カードスタイル
```css
/* ベースカードスタイル */
.card-base {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

.card-elevated {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card-hoverable:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

/* カード境界線カラー */
.card-border-success {
  border-left: 4px solid var(--color-success-500);
}

.card-border-warning {
  border-left: 4px solid var(--color-warning-500);
}

.card-border-error {
  border-left: 4px solid var(--color-error-500);
}

.card-border-primary {
  border-left: 4px solid var(--color-primary-500);
}
```

### フォームスタイル
```css
/* 入力フィールド */
.input-base {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: 0.5rem;
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  background-color: white;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.input-base:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.input-base::placeholder {
  color: var(--color-gray-400);
}

.input-error {
  border-color: var(--color-error-500);
}

.input-error:focus {
  border-color: var(--color-error-500);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* ラベル */
.label {
  display: block;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-gray-700);
  margin-bottom: var(--space-1);
}

.label-required::after {
  content: ' *';
  color: var(--color-error-500);
}
```

### ステータスバッジ
```css
.badge-base {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border-radius: 9999px;
  font-size: var(--text-xs);
  font-weight: 500;
  line-height: var(--leading-none);
}

/* ステータス別カラー */
.badge-pending {
  background-color: var(--color-warning-100);
  color: var(--color-warning-800);
}

.badge-accepted {
  background-color: var(--color-success-100);
  color: var(--color-success-800);
}

.badge-rejected {
  background-color: var(--color-error-100);
  color: var(--color-error-800);
}

.badge-completed {
  background-color: var(--color-info-100);
  color: var(--color-info-800);
}

.badge-recruiting {
  background-color: var(--color-primary-100);
  color: var(--color-primary-800);
}
```

## 📱 レスポンシブデザイン

### ブレイクポイント
```css
:root {
  --breakpoint-sm: 640px;   /* スモールタブレット */
  --breakpoint-md: 768px;   /* タブレット */
  --breakpoint-lg: 1024px;  /* ラップトップ */
  --breakpoint-xl: 1280px;  /* デスクトップ */
  --breakpoint-2xl: 1536px; /* 大型デスクトップ */
}

/* メディアクエリ */
@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

### モバイル最適化
```css
/* モバイル用スペーシング */
@media (max-width: 640px) {
  .mobile-spacing {
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }
  
  .mobile-text-sm {
    font-size: var(--text-sm);
  }
  
  .mobile-btn-full {
    width: 100%;
  }
}

/* タッチデバイス用インタラクション */
@media (hover: none) and (pointer: coarse) {
  .btn-base {
    min-height: 44px;    /* iOSガイドライン準拠 */
    min-width: 44px;
  }
}
```

## 🌗 ダークモード対応

### CSS Variables（ダークモード）
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: var(--color-gray-900);
    --color-bg-secondary: var(--color-gray-800);
    --color-text: var(--color-gray-100);
    --color-text-secondary: var(--color-gray-300);
    --color-border: var(--color-gray-700);
  }
  
  .card-base {
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
  }
  
  .input-base {
    background-color: var(--color-bg-secondary);
    border-color: var(--color-border);
    color: var(--color-text);
  }
}
```

## 🎯 アニメーション・トランジション

### トランジション設定
```css
:root {
  --transition-fast: 0.1s ease-in-out;
  --transition-base: 0.2s ease-in-out;
  --transition-slow: 0.3s ease-in-out;
  
  /* イージング関数 */
  --ease-in-out-cubic: cubic-bezier(0.4, 0, 0.2, 1);  
  --ease-out-cubic: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-cubic: cubic-bezier(0.4, 0, 1, 1);
}

/* 共通トランジション */
.transition-colors {
  transition: color var(--transition-base), 
              background-color var(--transition-base),
              border-color var(--transition-base);
}

.transition-transform {
  transition: transform var(--transition-base) var(--ease-out-cubic);
}

.transition-opacity {
  transition: opacity var(--transition-base);
}
```

### ホバーエフェクト
```css
.hover-lift {
  transition: transform var(--transition-base), 
              box-shadow var(--transition-base);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.hover-scale {
  transition: transform var(--transition-fast);
}

.hover-scale:hover {
  transform: scale(1.05);
}
```

## 📐 グリッドシステム

### CSS Grid Layout
```css
.grid-container {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.grid-2-cols {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3-cols {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4-cols {
  grid-template-columns: repeat(4, 1fr);
}

/* レスポンシブグリッド */
@media (max-width: 768px) {
  .grid-2-cols,
  .grid-3-cols,
  .grid-4-cols {
    grid-template-columns: 1fr;
  }
}
```

## 🎨 グラデーション・エフェクト

### ブランドグラデーション
```css
.gradient-primary {
  background: linear-gradient(135deg, 
    var(--color-primary-500) 0%, 
    var(--color-primary-600) 100%);
}

.gradient-secondary {
  background: linear-gradient(135deg, 
    var(--color-secondary-500) 0%, 
    var(--color-secondary-600) 100%);
}

.gradient-hero {
  background: linear-gradient(135deg, 
    var(--color-primary-500) 0%, 
    var(--color-secondary-500) 50%,
    var(--color-primary-600) 100%);
}

/* グラスモーフィズム効果 */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

このデザインシステムにより、Cutmeetsプラットフォームは一貫性のある美しいUI/UXを提供し、日本のユーザーにとって最適化された美容体験を実現します。