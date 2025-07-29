# Cutmeets - API仕様書

## 📋 API概要

CutmeetsプラットフォームのRESTful API仕様書です。全てのAPIエンドポイントはJSON形式でデータを送受信し、JWT認証を使用します。

### Base URL
```
Development: http://localhost:3000/api
Production:  https://cutmeets.com/api
```

### 認証
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

## 🔐 認証API

### POST /auth/login
ユーザーログイン

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "山田太郎",
      "userType": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

**Error Responses:**
```json
// 400 - 無効な入力
{
  "success": false,
  "error": "Invalid email or password format",
  "details": {
    "email": ["Invalid email format"],
    "password": ["Password must be at least 8 characters"]
  }
}

// 401 - 認証失敗
{
  "success": false,
  "error": "Invalid credentials"
}
```

### POST /auth/register
新規ユーザー登録

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "name": "田中花子",
  "userType": "customer"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_124",
      "email": "newuser@example.com",
      "name": "田中花子",
      "userType": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

### POST /auth/logout
ログアウト（トークン無効化）

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### GET /auth/me
現在のユーザー情報取得

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "山田太郎",
      "userType": "customer",
      "profile": {
        "phoneNumber": "090-1234-5678",
        "avatar": "https://example.com/avatar.jpg",
        "preferences": ["ショート", "ナチュラル"]
      }
    }
  }
}
```

## 👤 ユーザー管理API

### GET /users/[id]
ユーザー詳細情報取得

**Parameters:**
- `id`: ユーザーID

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "山田太郎",
      "userType": "customer",
      "profile": {
        "bio": "美容に興味があります",
        "avatar": "https://example.com/avatar.jpg",
        "preferences": ["ショート", "ナチュラル"],
        "hairType": "細毛・軟毛",
        "preferredArea": "渋谷・新宿"
      },
      "stats": {
        "totalBookings": 5,
        "averageRating": 4.8
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### PUT /users/[id]
ユーザー情報更新

**Parameters:**
- `id`: ユーザーID

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "山田太郎",
  "profile": {
    "bio": "更新された自己紹介",
    "preferences": ["ボブ", "カジュアル"],
    "phoneNumber": "090-1234-5678"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "山田太郎",
      "profile": {
        "bio": "更新された自己紹介",
        "preferences": ["ボブ", "カジュアル"],
        "phoneNumber": "090-1234-5678"
      },
      "updatedAt": "2024-01-20T15:45:00Z"
    }
  }
}
```

## 🎨 アシスタント管理API

### GET /assistants
アシスタント一覧取得

**Query Parameters:**
```
?page=1&limit=20&location=渋谷&specialties=カット,カラー&priceRange=1000-5000
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "assistants": [
      {
        "id": "assistant_456",
        "name": "佐藤美香",
        "profile": {
          "experience": "3年",
          "specialties": ["カット", "カラー"],
          "bio": "お客様に寄り添ったスタイル提案を心がけています",
          "avatar": "https://example.com/assistant_avatar.jpg",
          "salon": {
            "name": "Hair Salon TOKYO",
            "location": "渋谷区",
            "station": "渋谷駅",
            "distance": 0.3
          }
        },
        "stats": {
          "completedServices": 45,
          "averageRating": 4.7,
          "responseRate": 0.95
        }
      }
    ],
    "pagination": {
      "current": 1,
      "total": 5,
      "totalCount": 89
    }
  }
}
```

### GET /assistants/[id]
アシスタント詳細情報

**Parameters:**
- `id`: アシスタントID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "assistant": {
      "id": "assistant_456",
      "name": "佐藤美香",
      "profile": {
        "experience": "3年",
        "specialties": ["カット", "カラー", "トリートメント"],
        "bio": "お客様一人ひとりに合わせたスタイル提案を心がけています",
        "avatar": "https://example.com/assistant_avatar.jpg",
        "certifications": ["カラーリスト検定1級"],
        "workingHours": {
          "start": "10:00",
          "end": "20:00"
        },
        "availableDays": ["monday", "tuesday", "wednesday", "friday", "saturday"],
        "salon": {
          "name": "Hair Salon TOKYO",
          "location": "渋谷区神南1-1-1",
          "station": "渋谷駅",
          "distance": 0.3,
          "phone": "03-1234-5678"
        }
      },
      "stats": {
        "completedServices": 45,
        "averageRating": 4.7,
        "responseRate": 0.95,
        "experienceYears": 3
      },
      "portfolio": [
        {
          "id": "portfolio_1",
          "image": "https://example.com/portfolio1.jpg",
          "title": "ナチュラルボブ",
          "description": "お手入れしやすいナチュラルなボブスタイル",
          "tags": ["カット", "ナチュラル"]
        }
      ],
      "reviews": [
        {
          "id": "review_1",
          "customerName": "田中さん",
          "rating": 5,
          "comment": "とても丁寧で理想通りの仕上がりでした",
          "service": "カット + カラー",
          "date": "2024-01-10T14:00:00Z"
        }
      ]
    }
  }
}
```

## 📝 募集投稿API

### GET /recruitment-posts
募集投稿一覧取得

**Query Parameters:**
```
?page=1&limit=20&services=カット&location=渋谷&priceMax=3000&status=recruiting&sortBy=date
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post_789",
        "title": "ボブカット練習モデル募集",
        "description": "ボブスタイルの技術向上のため、練習台をお願いします",
        "assistant": {
          "id": "assistant_456",
          "name": "佐藤美香",
          "experienceLevel": "中級",
          "salon": {
            "name": "Hair Salon TOKYO",
            "station": "渋谷駅",
            "distance": 0.3
          }
        },
        "services": ["カット"],
        "duration": 90,
        "price": 1500,
        "originalPrice": 3000,
        "discount": 50,
        "requirements": ["肩より長い髪", "ダメージが少ない髪"],
        "modelCount": 3,
        "appliedCount": 1,
        "status": "recruiting",
        "urgency": "normal",
        "availableDates": ["2024-02-10", "2024-02-11", "2024-02-12"],
        "availableTimes": ["10:00-11:30", "14:00-15:30", "16:00-17:30"],
        "postedDate": "2024-02-05T09:00:00Z"
      }
    ],
    "pagination": {
      "current": 1,
      "total": 3,
      "totalCount": 47
    }
  }
}
```

### POST /recruitment-posts
新規募集投稿作成（アシスタント専用）

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "カラー練習モデル募集",
  "description": "グラデーションカラーの技術向上のため、モデルさんを募集しています",
  "services": ["カラー"],
  "duration": 120,
  "price": 2000,
  "originalPrice": 4000,
  "requirements": ["ブリーチ可能な方", "4時間程度お時間いただける方"],
  "modelCount": 2,
  "availableDates": ["2024-02-15", "2024-02-16"],
  "availableTimes": ["13:00-17:00"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "post_790",
      "title": "カラー練習モデル募集",
      "status": "recruiting",
      "createdAt": "2024-02-08T10:30:00Z"
    }
  }
}
```

### GET /recruitment-posts/[id]
募集投稿詳細取得

**Parameters:**
- `id`: 投稿ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "post_789",
      "title": "ボブカット練習モデル募集",
      "description": "ボブスタイルの技術向上のため、練習台をお願いします。丁寧にカットさせていただきます。",
      "assistant": {
        "id": "assistant_456",
        "name": "佐藤美香",
        "experienceLevel": "中級",
        "avatar": "https://example.com/assistant_avatar.jpg",
        "salon": {
          "name": "Hair Salon TOKYO",
          "location": "渋谷区神南1-1-1",
          "station": "渋谷駅",
          "distance": 0.3
        }
      },
      "services": ["カット"],
      "duration": 90,
      "price": 1500,
      "originalPrice": 3000,
      "discount": 50,
      "requirements": ["肩より長い髪", "ダメージが少ない髪"],
      "modelCount": 3,
      "appliedCount": 1,
      "status": "recruiting",
      "urgency": "normal",
      "availableDates": ["2024-02-10", "2024-02-11", "2024-02-12"],
      "availableTimes": ["10:00-11:30", "14:00-15:30", "16:00-17:30"],
      "applications": [
        {
          "id": "app_001",
          "customer": {
            "name": "山田花子",
            "avatar": "https://example.com/customer_avatar.jpg"
          },
          "appliedAt": "2024-02-06T14:30:00Z",
          "status": "pending"
        }
      ],
      "postedDate": "2024-02-05T09:00:00Z"
    }
  }
}
```

## 📋 応募管理API

### POST /applications
募集への応募

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "postId": "post_789",
  "message": "ぜひ参加させていただきたいです。よろしくお願いします。",
  "photos": ["https://example.com/hair1.jpg", "https://example.com/hair2.jpg"],
  "availableTimes": ["10:00-11:30", "16:00-17:30"],
  "additionalInfo": {
    "hairLength": "肩下10cm",
    "previousTreatments": "3ヶ月前にカラー",
    "allergies": "なし"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "application": {
      "id": "app_002",
      "postId": "post_789",
      "status": "pending",
      "appliedAt": "2024-02-07T16:20:00Z"
    }
  }
}
```

### GET /applications
応募一覧取得（ユーザー別）

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```
?status=pending&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "app_002",
        "post": {
          "id": "post_789",
          "title": "ボブカット練習モデル募集",
          "assistant": {
            "name": "佐藤美香",
            "salon": "Hair Salon TOKYO"
          },
          "price": 1500,
          "duration": 90
        },
        "status": "pending",
        "appliedAt": "2024-02-07T16:20:00Z",
        "message": "ぜひ参加させていただきたいです"
      }
    ],
    "pagination": {
      "current": 1,
      "total": 2,
      "totalCount": 15
    }
  }
}
```

### PUT /applications/[id]
応募ステータス更新（アシスタント専用）

**Parameters:**
- `id`: 応募ID

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "accepted",
  "feedback": "ご応募ありがとうございます。ぜひお越しください。",
  "scheduledDate": "2024-02-10T10:00:00Z"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "application": {
      "id": "app_002",
      "status": "accepted",
      "feedback": "ご応募ありがとうございます。ぜひお越しください。",
      "scheduledDate": "2024-02-10T10:00:00Z",
      "updatedAt": "2024-02-08T11:30:00Z"
    }
  }
}
```

## 📅 予約管理API

### GET /bookings
予約一覧取得

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```
?status=confirmed&startDate=2024-02-01&endDate=2024-02-29
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "booking_123",
        "applicationId": "app_002",
        "post": {
          "title": "ボブカット練習モデル募集",
          "services": ["カット"]
        },
        "assistant": {
          "id": "assistant_456",
          "name": "佐藤美香",
          "salon": {
            "name": "Hair Salon TOKYO",
            "location": "渋谷区神南1-1-1",
            "station": "渋谷駅"
          }
        },
        "customer": {
          "id": "user_123",
          "name": "山田太郎"
        },
        "scheduledDate": "2024-02-10T10:00:00Z",
        "duration": 90,
        "totalPrice": 1500,
        "status": "confirmed",
        "createdAt": "2024-02-08T11:30:00Z"
      }
    ]
  }
}
```

### POST /bookings
予約作成（応募承認時に自動生成される場合が多い）

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "applicationId": "app_002",
  "scheduledDate": "2024-02-10T10:00:00Z",
  "duration": 90,
  "notes": "初回のお客様です"
}
```

### PUT /bookings/[id]
予約ステータス更新

**Parameters:**
- `id`: 予約ID

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "completed",
  "actualDuration": 95,
  "notes": "スムーズに完了しました"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking_123",
      "status": "completed",
      "actualDuration": 95,
      "completedAt": "2024-02-10T11:35:00Z"
    }
  }
}
```

## ⭐ レビューAPI

### POST /reviews
レビュー投稿

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "bookingId": "booking_123",
  "rating": 5,
  "comment": "とても丁寧で理想通りの仕上がりでした。ありがとうございました。",
  "serviceQuality": 5,
  "communication": 5,
  "cleanliness": 5,
  "photos": ["https://example.com/after1.jpg"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "review": {
      "id": "review_456",
      "rating": 5,
      "comment": "とても丁寧で理想通りの仕上がりでした。ありがとうございました。",
      "createdAt": "2024-02-10T18:00:00Z"
    }
  }
}
```

### GET /reviews
レビュー一覧取得

**Query Parameters:**
```
?assistantId=assistant_456&page=1&limit=10&sortBy=date
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "review_456",
        "customer": {
          "name": "山田太郎",
          "avatar": "https://example.com/avatar.jpg"
        },
        "booking": {
          "service": "カット",
          "date": "2024-02-10T10:00:00Z"
        },
        "rating": 5,
        "comment": "とても丁寧で理想通りの仕上がりでした",
        "serviceQuality": 5,
        "communication": 5,
        "cleanliness": 5,
        "photos": ["https://example.com/after1.jpg"],
        "createdAt": "2024-02-10T18:00:00Z"
      }
    ],
    "stats": {
      "averageRating": 4.8,
      "totalReviews": 127,
      "ratingDistribution": {
        "5": 89,
        "4": 28,
        "3": 8,
        "2": 2,
        "1": 0
      }
    }
  }
}
```

## 🔍 検索API

### GET /search
総合検索

**Query Parameters:**
```
?query=ボブカット&type=posts&location=渋谷&priceMax=3000&services=カット&page=1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "recruitment_post",
        "item": {
          "id": "post_789",
          "title": "ボブカット練習モデル募集",
          "description": "ボブスタイルの技術向上のため...",
          "assistant": {
            "name": "佐藤美香",
            "salon": "Hair Salon TOKYO"
          },
          "price": 1500,
          "status": "recruiting"
        }
      }
    ],
    "filters": {
      "locations": ["渋谷", "新宿", "池袋"],
      "services": ["カット", "カラー", "パーマ"],
      "priceRanges": [
        {"min": 0, "max": 1000, "count": 12},
        {"min": 1000, "max": 3000, "count": 23}
      ]
    },
    "pagination": {
      "current": 1,
      "total": 5,
      "totalCount": 89
    }
  }
}
```

## 📊 統計・分析API

### GET /analytics/dashboard
ダッシュボード統計（認証ユーザー用）

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "totalBookings": 15,
      "completedBookings": 12,
      "totalSavings": 18000,
      "averageRating": 4.8
    },
    "recentActivity": [
      {
        "type": "booking_completed",
        "title": "カット＋カラー完了",
        "date": "2024-02-10T11:30:00Z"
      }
    ],
    "upcomingBookings": [
      {
        "id": "booking_124",
        "title": "トリートメント練習",
        "date": "2024-02-15T14:00:00Z",
        "assistant": "田中美咲"
      }
    ]
  }
}
```

## ❌ エラーレスポンス

### 共通エラーフォーマット
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": ["Validation error message"]
  },
  "timestamp": "2024-02-08T12:00:00Z"
}
```

### HTTPステータスコード
- `200` - 成功
- `201` - 作成成功
- `400` - 無効なリクエスト
- `401` - 認証が必要
- `403` - アクセス権限なし
- `404` - リソースが見つからない
- `409` - コンフリクト（重複データなど）
- `422` - バリデーションエラー
- `429` - レート制限
- `500` - サーバーエラー

### エラーコード例
```
AUTH_REQUIRED          - 認証が必要
INVALID_TOKEN          - 無効なトークン
USER_NOT_FOUND         - ユーザーが見つからない
BOOKING_CONFLICT       - 予約の競合
VALIDATION_ERROR       - バリデーションエラー
RATE_LIMIT_EXCEEDED    - レート制限超過
INSUFFICIENT_PERMISSIONS - 権限不足
```

---

この API 仕様書により、Cutmeets プラットフォームの全機能が適切にサポートされ、フロントエンドとバックエンドの連携が円滑に行われます。