import Joi from 'joi';

// 認証関連のバリデーションスキーマ
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '有効なメールアドレスを入力してください',
    'any.required': 'メールアドレスは必須です',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'パスワードは6文字以上で入力してください',
    'any.required': 'パスワードは必須です',
  }),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '有効なメールアドレスを入力してください',
    'any.required': 'メールアドレスは必須です',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'パスワードは6文字以上で入力してください',
    'any.required': 'パスワードは必須です',
  }),
  name: Joi.string().min(1).max(100).required().messages({
    'string.min': '名前を入力してください',
    'string.max': '名前は100文字以内で入力してください',
    'any.required': '名前は必須です',
  }),
  userType: Joi.string().valid('stylist', 'customer').required().messages({
    'any.only': 'ユーザータイプはstylistまたはcustomerのいずれかです',
    'any.required': 'ユーザータイプは必須です',
  }),
  profile: Joi.object({
    phoneNumber: Joi.string().optional(),
    birthDate: Joi.string().optional(),
    gender: Joi.string().optional(),
    // アシスタント美容師用
    experience: Joi.string().optional(),
    specialties: Joi.array().items(Joi.string()).optional(),
    hourlyRate: Joi.string().optional(),
    salonName: Joi.string().optional(),
    // お客様用
    preferredArea: Joi.string().optional(),
    hairLength: Joi.string().optional(),
    hairType: Joi.string().optional(),
  }).optional(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '有効なメールアドレスを入力してください',
    'any.required': 'メールアドレスは必須です',
  }),
});

// 予約作成のバリデーションスキーマ
export const createBookingSchema = Joi.object({
  assistantId: Joi.string().required().messages({
    'any.required': 'アシスタント美容師IDは必須です',
  }),
  date: Joi.string().isoDate().required().messages({
    'string.isoDate': '有効な日付形式で入力してください',
    'any.required': '予約日は必須です',
  }),
  startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
    'string.pattern.base': '時間はHH:mm形式で入力してください',
    'any.required': '開始時間は必須です',
  }),
  endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
    'string.pattern.base': '時間はHH:mm形式で入力してください',
    'any.required': '終了時間は必須です',
  }),
  service: Joi.string().min(1).max(100).required().messages({
    'string.min': 'サービス内容を入力してください',
    'string.max': 'サービス内容は100文字以内で入力してください',
    'any.required': 'サービス内容は必須です',
  }),
  totalPrice: Joi.number().min(0).required().messages({
    'number.min': '料金は0円以上で入力してください',
    'any.required': '料金は必須です',
  }),
  notes: Joi.string().max(500).optional().messages({
    'string.max': '備考は500文字以内で入力してください',
  }),
});

// 予約更新のバリデーションスキーマ
export const updateBookingSchema = Joi.object({
  date: Joi.string().isoDate().optional().messages({
    'string.isoDate': '有効な日付形式で入力してください',
  }),
  startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().messages({
    'string.pattern.base': '時間はHH:mm形式で入力してください',
  }),
  endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().messages({
    'string.pattern.base': '時間はHH:mm形式で入力してください',
  }),
  service: Joi.string().min(1).max(100).optional().messages({
    'string.min': 'サービス内容を入力してください',
    'string.max': 'サービス内容は100文字以内で入力してください',
  }),
  totalPrice: Joi.number().min(0).optional().messages({
    'number.min': '料金は0円以上で入力してください',
  }),
  notes: Joi.string().max(500).optional().allow('').messages({
    'string.max': '備考は500文字以内で入力してください',
  }),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').optional().messages({
    'any.only': '無効なステータスです',
  }),
});

// バリデーションヘルパー関数
export function validateRequest<T>(schema: Joi.Schema, data: unknown): { 
  value?: T; 
  errors?: Record<string, string[]> 
} {
  const { error, value } = schema.validate(data, { 
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors: Record<string, string[]> = {};
    error.details.forEach((detail) => {
      const key = detail.path.join('.');
      if (!errors[key]) {
        errors[key] = [];
      }
      errors[key].push(detail.message);
    });
    return { errors };
  }

  return { value: value as T };
}