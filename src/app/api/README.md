# Cutmeets API Documentation

## Overview

Cutmeets APIはNext.js 15のApp Routerを使用して構築されたRESTful APIです。JWTトークンによる認証システムを実装しています。

## Base URL

```
http://localhost:3000/api
```

## Authentication

ほとんどのAPIエンドポイントは認証が必要です。ログイン後に取得したJWTトークンを以下の形式でリクエストヘッダーに含めてください：

```
Authorization: Bearer <token>
```

## API Endpoints

### 1. 認証API (Authentication)

#### POST /api/auth/login
ユーザーログイン

**Request Body:**
```json
{
  "email": "assistant@test.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_1",
      "email": "assistant@test.com",
      "name": "田中 美香",
      "userType": "stylist",
      "profile": { ... }
    }
  }
}
```

#### POST /api/auth/register
新規ユーザー登録

**Request Body:**
```json
{
  "email": "newuser@test.com",
  "password": "password123",
  "name": "新規ユーザー",
  "userType": "customer",
  "profile": {
    "phoneNumber": "090-0000-0000",
    "birthDate": "1995-01-01"
  }
}
```

#### POST /api/auth/logout
ログアウト（認証不要）

#### GET /api/auth/me
現在のユーザー情報取得（要認証）

#### POST /api/auth/forgot-password
パスワードリセット

**Request Body:**
```json
{
  "email": "user@test.com"
}
```

### 2. ユーザーAPI (Users)

#### GET /api/users/[id]
ユーザー詳細取得（要認証）

#### PUT /api/users/[id]
ユーザー情報更新（要認証、自分のプロフィールのみ）

**Request Body:**
```json
{
  "name": "更新後の名前",
  "profile": {
    "phoneNumber": "090-1111-1111"
  }
}
```

### 3. アシスタント美容師API (Assistants)

#### GET /api/assistants
アシスタント美容師一覧取得

**Query Parameters:**
- `area`: エリアでフィルタリング
- `specialties`: 得意分野でフィルタリング（カンマ区切り）
- `minRate`: 最低時給
- `maxRate`: 最高時給
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 10）

**Example:**
```
GET /api/assistants?area=tokyo&specialties=カット,カラー&minRate=1500&page=1&limit=20
```

#### GET /api/assistants/[id]
アシスタント美容師詳細取得

### 4. 予約API (Bookings)

#### POST /api/bookings
予約作成（要認証、カスタマーのみ）

**Request Body:**
```json
{
  "assistantId": "user_1",
  "date": "2025-02-01",
  "startTime": "14:00",
  "endTime": "15:30",
  "service": "カット＆カラー",
  "totalPrice": 3000,
  "notes": "ショートヘアにしたいです"
}
```

#### GET /api/bookings
予約一覧取得（要認証）

**Query Parameters:**
- `status`: ステータスでフィルタリング（pending, confirmed, cancelled, completed）
- `page`: ページ番号
- `limit`: 1ページあたりの件数

#### GET /api/bookings/[id]
予約詳細取得（要認証、自分の予約のみ）

#### PUT /api/bookings/[id]
予約更新（要認証、自分の予約のみ）

**Request Body:**
```json
{
  "date": "2025-02-02",
  "startTime": "15:00",
  "endTime": "16:30",
  "status": "confirmed"
}
```

#### DELETE /api/bookings/[id]
予約キャンセル（要認証、自分の予約のみ）

## Error Responses

エラーレスポンスは以下の形式で返されます：

```json
{
  "success": false,
  "error": "エラーメッセージ",
  "errors": {
    "fieldName": ["エラー詳細1", "エラー詳細2"]
  }
}
```

### HTTP Status Codes

- `200 OK`: 成功
- `201 Created`: リソース作成成功
- `400 Bad Request`: リクエストが不正
- `401 Unauthorized`: 認証が必要
- `403 Forbidden`: アクセス権限なし
- `404 Not Found`: リソースが見つからない
- `409 Conflict`: リソースの競合（例：予約時間の重複）
- `500 Internal Server Error`: サーバーエラー

## Test Accounts

開発環境で使用できるテストアカウント：

**アシスタント美容師:**
- Email: assistant@test.com
- Password: password123

**一般ユーザー:**
- Email: customer@test.com
- Password: password123

## Notes

- 現在はモックデータベースを使用していますが、将来的には実際のデータベースに置き換える予定です
- JWT トークンの有効期限は7日間です
- 開発環境では、パスワードリセットAPIがリセットトークンを返します（本番環境では削除）