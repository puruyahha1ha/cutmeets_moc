// 募集投稿・応募関連のバリデーション
import Joi from 'joi';

// 募集投稿作成時のバリデーション
export const createPostSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      'string.min': 'タイトルは5文字以上で入力してください',
      'string.max': 'タイトルは100文字以内で入力してください',
      'any.required': 'タイトルは必須です'
    }),
  
  description: Joi.string()
    .min(20)
    .max(1000)
    .required()
    .messages({
      'string.min': '説明文は20文字以上で入力してください',
      'string.max': '説明文は1000文字以内で入力してください',
      'any.required': '説明文は必須です'
    }),
  
  services: Joi.array()
    .items(Joi.string().valid('カット', 'カラー', 'パーマ', 'トリートメント', 'ストレート', 'その他'))
    .min(1)
    .required()
    .messages({
      'array.min': 'サービス種別を1つ以上選択してください',
      'any.required': 'サービス種別は必須です'
    }),
  
  duration: Joi.number()
    .integer()
    .min(30)
    .max(480)
    .required()
    .messages({
      'number.min': '所要時間は30分以上で設定してください',
      'number.max': '所要時間は8時間以内で設定してください',
      'any.required': '所要時間は必須です'
    }),
  
  price: Joi.number()
    .integer()
    .min(500)
    .max(20000)
    .required()
    .messages({
      'number.min': '料金は500円以上で設定してください',
      'number.max': '料金は20,000円以内で設定してください',
      'any.required': '料金は必須です'
    }),
  
  originalPrice: Joi.number()
    .integer()
    .min(Joi.ref('price'))
    .required()
    .messages({
      'number.min': '通常料金は設定料金以上にしてください',
      'any.required': '通常料金は必須です'
    }),
  
  requirements: Joi.array()
    .items(Joi.string().max(100))
    .max(10)
    .default([])
    .messages({
      'string.max': '応募条件は100文字以内で入力してください',
      'array.max': '応募条件は10個以内で設定してください'
    }),
  
  modelCount: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .required()
    .messages({
      'number.min': '募集人数は1人以上で設定してください',
      'number.max': '募集人数は10人以内で設定してください',
      'any.required': '募集人数は必須です'
    }),
  
  availableDates: Joi.array()
    .items(Joi.string().isoDate())
    .min(1)
    .max(30)
    .required()
    .messages({
      'array.min': '実施可能日を1つ以上設定してください',
      'array.max': '実施可能日は30日以内で設定してください',
      'any.required': '実施可能日は必須です'
    }),
  
  availableTimes: Joi.array()
    .items(Joi.string().pattern(/^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$/))
    .min(1)
    .required()
    .messages({
      'array.min': '時間帯を1つ以上設定してください',
      'string.pattern.base': '時間帯は HH:MM-HH:MM 形式で入力してください',
      'any.required': '時間帯は必須です'
    }),
  
  salon: Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    station: Joi.string().required(),
    distance: Joi.number().min(0).max(50).required(),
    phone: Joi.string().optional()
  }).required(),
  
  urgency: Joi.string()
    .valid('normal', 'urgent')
    .default('normal')
});

// 募集投稿更新時のバリデーション
export const updatePostSchema = Joi.object({
  title: Joi.string().min(5).max(100),
  description: Joi.string().min(20).max(1000),
  services: Joi.array().items(Joi.string().valid('カット', 'カラー', 'パーマ', 'トリートメント', 'ストレート', 'その他')).min(1),
  duration: Joi.number().integer().min(30).max(480),
  price: Joi.number().integer().min(500).max(20000),
  originalPrice: Joi.number().integer(),
  requirements: Joi.array().items(Joi.string().max(100)).max(10),
  modelCount: Joi.number().integer().min(1).max(10),
  availableDates: Joi.array().items(Joi.string().isoDate()).min(1).max(30),
  availableTimes: Joi.array().items(Joi.string().pattern(/^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$/)).min(1),
  status: Joi.string().valid('recruiting', 'full', 'closed'),
  urgency: Joi.string().valid('normal', 'urgent')
}).min(1);

// 応募作成時のバリデーション
export const createApplicationSchema = Joi.object({
  postId: Joi.string()
    .required()
    .messages({
      'any.required': '募集投稿IDは必須です'
    }),
  
  message: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'メッセージは10文字以上で入力してください',
      'string.max': 'メッセージは500文字以内で入力してください',
      'any.required': 'メッセージは必須です'
    }),
  
  photos: Joi.array()
    .items(Joi.string().uri())
    .max(5)
    .default([])
    .messages({
      'array.max': '写真は5枚まで投稿できます',
      'string.uri': '写真のURLが正しくありません'
    }),
  
  availableTimes: Joi.array()
    .items(Joi.string().pattern(/^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$/))
    .min(1)
    .required()
    .messages({
      'array.min': '希望時間を1つ以上選択してください',
      'string.pattern.base': '時間帯は HH:MM-HH:MM 形式で入力してください',
      'any.required': '希望時間は必須です'
    }),
  
  additionalInfo: Joi.object({
    hairLength: Joi.string().max(50).optional(),
    previousTreatments: Joi.string().max(200).optional(),
    allergies: Joi.string().max(200).optional()
  }).default({})
});

// 応募ステータス更新時のバリデーション
export const updateApplicationSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'accepted', 'rejected')
    .required()
    .messages({
      'any.required': 'ステータスは必須です',
      'any.only': 'ステータスは pending, accepted, rejected のいずれかである必要があります'
    }),
  
  feedback: Joi.string()
    .max(500)
    .when('status', {
      is: 'rejected',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'string.max': 'フィードバックは500文字以内で入力してください',
      'any.required': '拒否の場合はフィードバックが必須です'
    }),
  
  scheduledDate: Joi.string()
    .isoDate()
    .when('status', {
      is: 'accepted',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'any.required': '承認の場合は予約日時が必須です',
      'string.isoDate': '予約日時は正しい日時形式で入力してください'
    })
});

// 検索フィルターのバリデーション
export const searchPostsSchema = Joi.object({
  query: Joi.string().max(100).optional(),
  services: Joi.array().items(Joi.string()).optional(),
  location: Joi.string().max(50).optional(),
  priceMin: Joi.number().integer().min(0).optional(),
  priceMax: Joi.number().integer().min(0).optional(),
  status: Joi.string().valid('recruiting', 'full', 'closed').optional(),
  sortBy: Joi.string().valid('date', 'price', 'distance').default('date'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

// 予約作成時のバリデーション
export const createBookingSchema = Joi.object({
  applicationId: Joi.string()
    .required()
    .messages({
      'any.required': '応募IDは必須です'
    }),
  
  scheduledDate: Joi.string()
    .isoDate()
    .required()
    .messages({
      'any.required': '予約日時は必須です',
      'string.isoDate': '予約日時は正しい日時形式で入力してください'
    }),
  
  duration: Joi.number()
    .integer()
    .min(30)
    .max(480)
    .required()
    .messages({
      'number.min': '所要時間は30分以上で設定してください',
      'number.max': '所要時間は8時間以内で設定してください',
      'any.required': '所要時間は必須です'
    }),
  
  notes: Joi.string()
    .max(300)
    .optional()
    .messages({
      'string.max': '備考は300文字以内で入力してください'
    })
});

// レビュー投稿時のバリデーション
export const createReviewSchema = Joi.object({
  bookingId: Joi.string()
    .required()
    .messages({
      'any.required': '予約IDは必須です'
    }),
  
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.min': '評価は1以上で入力してください',
      'number.max': '評価は5以下で入力してください',
      'any.required': '総合評価は必須です'
    }),
  
  comment: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'コメントは10文字以上で入力してください',
      'string.max': 'コメントは500文字以内で入力してください',
      'any.required': 'コメントは必須です'
    }),
  
  serviceQuality: Joi.number().integer().min(1).max(5).optional(),
  communication: Joi.number().integer().min(1).max(5).optional(),
  cleanliness: Joi.number().integer().min(1).max(5).optional(),
  cooperation: Joi.number().integer().min(1).max(5).optional(),
  punctuality: Joi.number().integer().min(1).max(5).optional(),
  
  photos: Joi.array()
    .items(Joi.string().uri())
    .max(3)
    .optional()
    .messages({
      'array.max': '写真は3枚まで投稿できます',
      'string.uri': '写真のURLが正しくありません'
    })
});