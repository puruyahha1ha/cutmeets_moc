import Joi from 'joi';

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