import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import for HelpSearch to improve initial page load
const HelpSearch = dynamic(() => import('../_components/client/HelpSearch'), {
  loading: () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
});

// Server Component with metadata and static FAQ data
export const metadata = {
  title: 'ヘルプセンター - Cutmeets',
  description: 'Cutmeetsの使い方やよくある質問をまとめています。予約方法、支払い、アカウント設定など詳しく説明しています。',
  keywords: 'ヘルプ,よくある質問,FAQ,使い方,予約方法,支払い,サポート',
};
const faqCategories = [
        {
            title: '予約について',
            faqs: [
                {
                    id: 1,
                    question: '予約の取り方を教えてください',
                    answer: '美容師の詳細ページから「予約する」ボタンをクリックし、希望の日時を選択してください。予約確定後、確認メールが送信されます。'
                },
                {
                    id: 2,
                    question: '予約のキャンセルはできますか？',
                    answer: '予約日時の24時間前までであれば、マイページの予約履歴からキャンセル可能です。24時間を切った場合は、直接サロンにお電話でご連絡ください。'
                },
                {
                    id: 3,
                    question: '予約の変更はできますか？',
                    answer: 'マイページの予約履歴から変更可能です。空きがない場合は、一度キャンセルして新たに予約を取り直してください。'
                }
            ]
        },
        {
            title: '料金・支払いについて',
            faqs: [
                {
                    id: 4,
                    question: '支払い方法を教えてください',
                    answer: '現金、クレジットカード、電子マネーでのお支払いが可能です。対応可能な支払い方法は各サロンによって異なりますので、予約時にご確認ください。'
                },
                {
                    id: 5,
                    question: '料金はいつ支払うのですか？',
                    answer: '施術完了後、サロンでのお会計となります。事前決済は行っておりません。'
                },
                {
                    id: 6,
                    question: '表示価格以外に追加料金はかかりますか？',
                    answer: '基本的には表示価格での施術となりますが、髪の長さや施術内容によって追加料金が発生する場合があります。詳細は事前にご相談ください。'
                }
            ]
        },
        {
            title: 'アカウント・登録について',
            faqs: [
                {
                    id: 7,
                    question: '会員登録は必要ですか？',
                    answer: '予約をするためには会員登録が必要です。登録は無料で、メールアドレスがあればすぐに登録できます。'
                },
                {
                    id: 8,
                    question: 'パスワードを忘れました',
                    answer: 'ログインページの「パスワードを忘れた方」から、登録済みのメールアドレスを入力してパスワードリセットを行ってください。'
                },
                {
                    id: 9,
                    question: 'プロフィール情報の変更方法を教えてください',
                    answer: 'マイページのプロフィール設定から変更可能です。「プロフィール編集」ボタンをクリックして情報を更新してください。'
                }
            ]
        },
        {
            title: 'サービス・その他',
            faqs: [
                {
                    id: 10,
                    question: '美容師の評価システムについて教えてください',
                    answer: '施術完了後、5段階評価とコメントで美容師を評価できます。この評価は他のユーザーの参考になります。'
                },
                {
                    id: 11,
                    question: 'お気に入り機能の使い方を教えてください',
                    answer: '美容師の詳細ページでハートマークをクリックするとお気に入りに追加されます。お気に入りページから一覧で確認できます。'
                },
                {
                    id: 12,
                    question: '初回利用の流れを教えてください',
                    answer: '1. 会員登録 → 2. 美容師検索 → 3. 予約 → 4. 来店・施術 → 5. 評価・レビューの順で進みます。'
                }
            ]
        }
    ];

const quickLinks = [
    { title: '予約方法', icon: '📅', href: '/help/booking' },
    { title: 'お支払いについて', icon: '💳', href: '/help/payment' },
    { title: 'キャンセル・変更', icon: '🔄', href: '/help/cancellation' },
    { title: 'よくある質問', icon: '❓', href: '/help/faq' },
    { title: 'お問い合わせ', icon: '📞', href: '/contact' },
    { title: '利用規約', icon: '📜', href: '/terms' }
];

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* ページヘッダー */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">ヘルプセンター</h1>
                    <p className="text-gray-600 mb-8">cutmeetsの使い方やよくある質問をまとめています</p>
                    
                </div>

                {/* クイックリンク */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">よく利用される項目</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {quickLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md hover:border-pink-200 transition-all group"
                            >
                                <div className="text-2xl mb-2">{link.icon}</div>
                                <div className="text-sm font-medium text-gray-900 group-hover:text-pink-600 transition-colors">
                                    {link.title}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* FAQ セクション - Client Component for search and expand functionality */}
                <HelpSearch faqCategories={faqCategories} />

                {/* お問い合わせセクション */}
                <div className="mt-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-8 text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">解決しない問題がありますか？</h2>
                    <p className="text-pink-100 mb-6">
                        お探しの情報が見つからない場合は、お気軽にお問い合わせください。
                        <br />
                        専門スタッフが丁寧にサポートいたします。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="bg-white text-pink-600 px-6 py-3 rounded-xl font-semibold hover:bg-pink-50 transition-colors"
                        >
                            お問い合わせフォーム
                        </Link>
                        <a
                            href="tel:0120-123-456"
                            className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors border-2 border-white/20"
                        >
                            📞 0120-123-456
                        </a>
                    </div>
                    <p className="text-sm text-pink-100 mt-4">
                        受付時間: 平日 10:00〜18:00（土日祝除く）
                    </p>
                </div>

                {/* その他のヘルプリンク */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">美容師の方へ</h3>
                        <p className="text-gray-600 mb-4">
                            cutmeetsに美容師として登録をご希望の方はこちらをご覧ください。
                        </p>
                        <Link
                            href="/hairdresser-register"
                            className="text-pink-600 hover:text-pink-700 font-medium"
                        >
                            美容師登録について →
                        </Link>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">サロン運営者の方へ</h3>
                        <p className="text-gray-600 mb-4">
                            サロンの登録や運営に関する情報はこちらをご確認ください。
                        </p>
                        <Link
                            href="/salon-partnership"
                            className="text-pink-600 hover:text-pink-700 font-medium"
                        >
                            サロンパートナーシップ →
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}