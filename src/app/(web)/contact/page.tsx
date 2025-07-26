import Link from 'next/link';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for ContactForm to improve initial page load
const ContactForm = dynamic(() => import('../_components/client/ContactForm'), {
  loading: () => (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-6"></div>
      <div className="space-y-6">
        {/* Name field skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
          <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
        {/* Email field skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-2"></div>
          <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
        {/* Phone field skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-28 mb-2"></div>
          <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
        {/* Category field skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-36 mb-2"></div>
          <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
        {/* Subject field skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-2"></div>
          <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
        {/* Message field skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-40 mb-2"></div>
          <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
        {/* Submit button skeleton */}
        <div className="h-14 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  )
});

// Server Component with metadata and static data
export const metadata = {
  title: 'お問い合わせ - Cutmeets',
  description: 'Cutmeetsへのお問い合わせページです。ご質問やご要望がございましたら、お気軽にお問い合わせください。',
  keywords: 'お問い合わせ,サポート,ヘルプ,連絡先,質問,カスタマーサポート',
};

// Static contact information - defined at build time
const contactInfo = {
  phone: '0120-123-456',
  email: 'support@cutmeets.com',
  businessHours: '平日 10:00〜18:00（土日祝除く)',
  responseTime: '24時間受付・2営業日以内に返信'
};

const helpLinks = [
  { href: '/help#booking', text: '予約の取り方について' },
  { href: '/help#payment', text: '支払い方法について' },
  { href: '/help#cancellation', text: 'キャンセル・変更について' },
  { href: '/help#account', text: 'アカウント登録について' }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        {/* ページヘッダー */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">お問い合わせ</h1>
          <p className="text-sm sm:text-base text-gray-600">
            ご質問やご要望がございましたら、お気軽にお問い合わせください。
            <br />
            2営業日以内にご回答いたします。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* お問い合わせフォーム */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 営業時間・連絡先 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">営業時間・連絡先</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">📞 電話でのお問い合わせ</h4>
                  <p className="text-pink-600 font-semibold text-lg">{contactInfo.phone}</p>
                  <p className="text-sm text-gray-600">{contactInfo.businessHours}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">📧 メールでのお問い合わせ</h4>
                  <p className="text-pink-600">{contactInfo.email}</p>
                  <p className="text-sm text-gray-600">{contactInfo.responseTime}</p>
                </div>
              </div>
            </div>

            {/* よくある質問 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">よくある質問</h3>
              <div className="space-y-3">
                {helpLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="block text-sm text-gray-700 hover:text-pink-600 transition-colors"
                  >
                    • {link.text}
                  </Link>
                ))}
              </div>
              <Link
                href="/help"
                className="inline-block mt-4 text-pink-600 hover:text-pink-700 font-medium text-sm"
              >
                ヘルプセンターを見る →
              </Link>
            </div>

            {/* 緊急時の連絡先 */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">🚨 緊急時のご連絡</h3>
              <p className="text-sm text-orange-800 mb-3">
                予約当日の急なトラブルやキャンセルは、直接サロンへお電話ください。
              </p>
              <p className="text-sm text-orange-700">
                各サロンの連絡先は、予約確認メールまたはマイページの予約履歴からご確認いただけます。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}