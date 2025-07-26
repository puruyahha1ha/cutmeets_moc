import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'プライバシーポリシー',
    description: 'Cutmeetsのプライバシーポリシーと個人情報保護方針について詳しく説明します。',
    robots: {
        index: true,
        follow: true,
    },
}

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* ヘッダー */}
                    <div className="bg-gradient-to-r from-pink-500 to-red-500 px-8 py-12 text-white">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4">プライバシーポリシー</h1>
                        <p className="text-pink-100 text-lg">
                            Cutmeetsはお客様の個人情報保護を最優先に考えています
                        </p>
                        <div className="mt-6 text-sm text-pink-100">
                            最終更新日: 2025年1月26日
                        </div>
                    </div>

                    {/* コンテンツ */}
                    <div className="px-8 py-12">
                        <div className="prose prose-lg max-w-none text-ja">
                            
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    1. 基本方針
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    株式会社Cutmeets（以下「当社」）は、美容師アシスタントとお客様をつなぐマッチングプラットフォーム「Cutmeets」（以下「本サービス」）において、お客様の個人情報の重要性を認識し、個人情報の保護に関する法律（個人情報保護法）、その他関連法令等を遵守し、お客様の個人情報を適切に取り扱います。
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    本プライバシーポリシーは、本サービスにおけるお客様の個人情報の取り扱いについて定めたものです。
                                </p>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    2. 収集する情報
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            2.1 お客様から直接ご提供いただく情報
                                        </h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• 氏名、メールアドレス、電話番号</li>
                                            <li>• 生年月日、性別</li>
                                            <li>• 住所（都道府県、市区町村レベル）</li>
                                            <li>• プロフィール写真</li>
                                            <li>• 髪質、希望する施術内容</li>
                                            <li>• 支払い情報（クレジットカード情報等）</li>
                                            <li>• レビューやコメント</li>
                                        </ul>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            2.2 自動的に収集される情報
                                        </h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• IPアドレス、ブラウザ情報</li>
                                            <li>• 利用時間、アクセス頻度</li>
                                            <li>• 端末情報（OS、デバイスID等）</li>
                                            <li>• 位置情報（GPS等）</li>
                                            <li>• Cookieおよび類似技術による情報</li>
                                            <li>• 本サービス内での行動履歴</li>
                                        </ul>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            2.3 練習台システムに関する特別な情報
                                        </h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• 施術前後の写真（同意の上で撮影）</li>
                                            <li>• 施術の難易度評価</li>
                                            <li>• アシスタントの技術レベル評価</li>
                                            <li>• 練習成果に関するフィードバック</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    3. 利用目的
                                </h2>
                                <div className="space-y-4">
                                    <div className="border-l-4 border-pink-500 pl-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">3.1 基本的なサービス提供</h3>
                                        <ul className="space-y-1 text-gray-700">
                                            <li>• アカウントの作成・管理</li>
                                            <li>• 美容師アシスタントとのマッチング</li>
                                            <li>• 予約の管理・調整</li>
                                            <li>• 決済処理</li>
                                            <li>• カスタマーサポート</li>
                                        </ul>
                                    </div>
                                    
                                    <div className="border-l-4 border-pink-500 pl-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">3.2 サービス向上・カスタマイズ</h3>
                                        <ul className="space-y-1 text-gray-700">
                                            <li>• パーソナライズされた推奨の提供</li>
                                            <li>• サービス利用状況の分析</li>
                                            <li>• 新機能の開発・改善</li>
                                            <li>• ユーザビリティの向上</li>
                                        </ul>
                                    </div>

                                    <div className="border-l-4 border-pink-500 pl-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">3.3 安全性・信頼性の確保</h3>
                                        <ul className="space-y-1 text-gray-700">
                                            <li>• 不正利用の防止・検出</li>
                                            <li>• セキュリティ向上</li>
                                            <li>• 年齢認証・本人確認</li>
                                            <li>• 品質管理・モニタリング</li>
                                        </ul>
                                    </div>

                                    <div className="border-l-4 border-pink-500 pl-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">3.4 法的義務の履行</h3>
                                        <ul className="space-y-1 text-gray-700">
                                            <li>• 法令に基づく開示対応</li>
                                            <li>• 税務・会計処理</li>
                                            <li>• 利用規約違反への対応</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    4. 情報の共有・提供
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            4.1 サービス利用者間での情報共有
                                        </h3>
                                        <p className="text-gray-700 mb-3">
                                            マッチングサービスの性質上、以下の情報は適切な範囲で他の利用者と共有されます：
                                        </p>
                                        <ul className="space-y-1 text-gray-700">
                                            <li>• プロフィール情報（氏名、写真、希望する施術等）</li>
                                            <li>• レビュー・評価</li>
                                            <li>• 施術履歴（個人を特定しない形で）</li>
                                        </ul>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            4.2 第三者への提供
                                        </h3>
                                        <p className="text-gray-700 mb-3">
                                            以下の場合を除き、お客様の同意なく第三者に個人情報を提供することはありません：
                                        </p>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• 法令に基づく場合</li>
                                            <li>• 人の生命、身体または財産の保護のために必要がある場合</li>
                                            <li>• 公衆衛生の向上または児童の健全な育成の推進のために必要がある場合</li>
                                            <li>• 国の機関もしくは地方公共団体またはその委託を受けた者による法令の定める事務の遂行に対する協力が必要である場合</li>
                                        </ul>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            4.3 業務委託先への提供
                                        </h3>
                                        <p className="text-gray-700">
                                            サービス提供に必要な範囲で、決済代行業者、データ分析業者等の業務委託先に個人情報を提供する場合があります。この場合、適切な契約を締結し、個人情報の保護を徹底します。
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    5. 保存期間
                                </h2>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <p className="text-gray-700 mb-4">
                                        個人情報は、利用目的の達成に必要な期間に限り保存いたします。具体的な保存期間は以下の通りです：
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2">アカウント情報</h4>
                                            <p className="text-sm text-gray-700">アカウント削除から1年間</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2">予約・決済履歴</h4>
                                            <p className="text-sm text-gray-700">法定保存期間（7年間）</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2">アクセスログ</h4>
                                            <p className="text-sm text-gray-700">取得から1年間</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2">レビュー・評価</h4>
                                            <p className="text-sm text-gray-700">投稿から5年間</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    6. お客様の権利
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            個人情報に関するお客様の権利
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">開示請求権</h4>
                                                <p className="text-sm text-gray-700">保有している個人情報の開示を求める権利</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">訂正・削除権</h4>
                                                <p className="text-sm text-gray-700">個人情報の訂正・削除を求める権利</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">利用停止権</h4>
                                                <p className="text-sm text-gray-700">個人情報の利用停止を求める権利</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">データポータビリティ権</h4>
                                                <p className="text-sm text-gray-700">個人情報の移行を求める権利</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-4 bg-white rounded-lg">
                                            <p className="text-sm text-gray-700">
                                                これらの権利を行使される場合は、本人確認の上で対応いたします。
                                                設定画面またはお問い合わせフォームよりご連絡ください。
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    7. セキュリティ対策
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">技術的対策</h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• SSL/TLS暗号化通信</li>
                                            <li>• ファイアウォールの設置</li>
                                            <li>• アクセス制御・認証システム</li>
                                            <li>• 定期的なセキュリティ監査</li>
                                            <li>• データバックアップの実施</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">組織的対策</h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• 社員教育の実施</li>
                                            <li>• アクセス権限の適切な管理</li>
                                            <li>• 個人情報保護責任者の設置</li>
                                            <li>• インシデント対応体制の構築</li>
                                            <li>• 定期的な内部監査</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    8. Cookie・類似技術について
                                </h2>
                                <div className="space-y-4">
                                    <p className="text-gray-700 leading-relaxed">
                                        本サービスでは、サービス向上のためCookieおよび類似技術を使用しています。
                                    </p>
                                    
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Cookieの利用目的</h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• ログイン状態の維持</li>
                                            <li>• サイト利用状況の分析</li>
                                            <li>• パーソナライズされたコンテンツの提供</li>
                                            <li>• 広告配信の最適化</li>
                                            <li>• セキュリティの向上</li>
                                        </ul>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-gray-700 text-sm">
                                            <strong>Cookie設定の変更：</strong>
                                            ブラウザの設定によりCookieを無効にすることができますが、サービスの一部機能が利用できなくなる場合があります。
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    9. 海外への個人情報の移転
                                </h2>
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                                    <p className="text-gray-700 mb-4">
                                        サービス提供に必要な範囲で、適切な保護措置を講じた上で海外のサーバーに個人情報を保存する場合があります。
                                    </p>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-900">移転先国・地域</h4>
                                        <ul className="text-gray-700 space-y-1">
                                            <li>• アメリカ（クラウドサーバー）</li>
                                            <li>• ヨーロッパ（データ分析サービス）</li>
                                        </ul>
                                    </div>
                                    <div className="mt-4 p-4 bg-white rounded-lg">
                                        <p className="text-sm text-gray-700">
                                            移転先では、十分なレベルの個人情報保護を確保するため、適切な契約締結や認証取得を行っています。
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    10. 未成年の個人情報について
                                </h2>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <p className="text-gray-700 mb-4">
                                        18歳未満のお客様の個人情報を収集する場合は、保護者の同意を得ることを原則とします。
                                    </p>
                                    <ul className="space-y-2 text-gray-700">
                                        <li>• 13歳未満の方のサービス利用はお断りしています</li>
                                        <li>• 13歳以上18歳未満の方は保護者の同意が必要です</li>
                                        <li>• 美容施術については保護者の同伴を推奨します</li>
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    11. プライバシーポリシーの変更
                                </h2>
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <p className="text-gray-700 mb-4">
                                        当社は、法令の変更やサービス内容の変更等により、本プライバシーポリシーを変更する場合があります。
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-white text-xs font-bold">1</span>
                                            </div>
                                            <p className="text-gray-700">重要な変更の場合は、お客様に事前に通知いたします</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-white text-xs font-bold">2</span>
                                            </div>
                                            <p className="text-gray-700">変更後もサービスをご利用いただく場合、変更に同意いただいたものとみなします</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-white text-xs font-bold">3</span>
                                            </div>
                                            <p className="text-gray-700">最新のプライバシーポリシーは常に本ページで確認できます</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    12. お問い合わせ先
                                </h2>
                                <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-lg p-6">
                                    <p className="text-gray-700 mb-4">
                                        個人情報の取り扱いに関するご質問・ご意見は、以下までお気軽にお問い合わせください。
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">メール</p>
                                                <p className="text-gray-700">privacy@cutmeets.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">運営会社</p>
                                                <p className="text-gray-700">株式会社Cutmeets</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">個人情報保護責任者</p>
                                                <p className="text-gray-700">プライバシーオフィサー</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicyPage