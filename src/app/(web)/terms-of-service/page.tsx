import { Metadata } from 'next'

export const metadata: Metadata = {
    title: '利用規約',
    description: 'Cutmeetsサービスの利用規約と練習台システムのルールについて詳しく説明します。',
    robots: {
        index: true,
        follow: true,
    },
}

const TermsOfServicePage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* ヘッダー */}
                    <div className="bg-gradient-to-r from-pink-500 to-red-500 px-8 py-12 text-white">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4">利用規約</h1>
                        <p className="text-pink-100 text-lg">
                            Cutmeetsサービスをご利用いただくためのルールと約束事
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
                                    第1条（定義）
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    本規約において、以下の用語は次の意味を有するものとします。
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-2">「本サービス」</h4>
                                        <p className="text-sm text-gray-700">株式会社Cutmeetsが運営する美容師アシスタントマッチングプラットフォーム「Cutmeets」</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-2">「利用者」</h4>
                                        <p className="text-sm text-gray-700">本サービスを利用するすべての個人（お客様・アシスタント美容師）</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-2">「練習台」</h4>
                                        <p className="text-sm text-gray-700">アシスタント美容師の技術向上を目的とした施術を受けること</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-2">「お客様」</h4>
                                        <p className="text-sm text-gray-700">美容サービスを受ける利用者</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-2">「アシスタント」</h4>
                                        <p className="text-sm text-gray-700">美容師免許を保有し技術向上を目指す美容師</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-2">「マッチング」</h4>
                                        <p className="text-sm text-gray-700">お客様とアシスタントを結びつけるサービス</p>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    第2条（本規約への同意）
                                </h2>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                    <ol className="space-y-3 text-gray-700">
                                        <li>1. 利用者は、本規約に同意した上で本サービスを利用するものとします。</li>
                                        <li>2. 本サービスの利用を開始した時点で、本規約に同意したものとみなします。</li>
                                        <li>3. 未成年者が本サービスを利用する場合は、保護者の同意が必要です。</li>
                                        <li>4. 法人が本サービスを利用する場合は、代表者または権限を有する者の同意が必要です。</li>
                                    </ol>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    第3条（練習台システムについて）
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            3.1 練習台システムの目的
                                        </h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• アシスタント美容師の技術向上とキャリア発展支援</li>
                                            <li>• お客様への低価格での美容サービス提供</li>
                                            <li>• 美容業界全体のスキルアップと質の向上</li>
                                            <li>• 新しい美容師と顧客の出会いの創出</li>
                                        </ul>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            3.2 練習台の性質と理解事項
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="border-l-4 border-blue-500 pl-4">
                                                <h4 className="font-semibold text-gray-900">技術レベルについて</h4>
                                                <p className="text-gray-700 text-sm">アシスタントの技術レベルは向上途中であり、完璧な仕上がりを保証するものではありません。</p>
                                            </div>
                                            <div className="border-l-4 border-blue-500 pl-4">
                                                <h4 className="font-semibold text-gray-900">料金について</h4>
                                                <p className="text-gray-700 text-sm">練習台価格は正規料金より大幅に割引された価格設定となっています。</p>
                                            </div>
                                            <div className="border-l-4 border-blue-500 pl-4">
                                                <h4 className="font-semibold text-gray-900">指導体制について</h4>
                                                <p className="text-gray-700 text-sm">経験豊富な美容師による指導・監督のもとで施術が行われます。</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            3.3 お客様の同意事項
                                        </h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• 練習台として協力することに同意すること</li>
                                            <li>• 技術向上のための施術過程に理解を示すこと</li>
                                            <li>• 施術前後の写真撮影（記録用）に同意すること</li>
                                            <li>• フィードバックの提供に協力すること</li>
                                            <li>• 予定より時間がかかる場合があることを了承すること</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    第4条（アカウント登録）
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            4.1 アカウント作成要件
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">お客様</h4>
                                                <ul className="space-y-1 text-gray-700 text-sm">
                                                    <li>• 18歳以上であること</li>
                                                    <li>• 有効なメールアドレス</li>
                                                    <li>• 本人確認書類の提出</li>
                                                    <li>• 利用規約への同意</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">アシスタント美容師</h4>
                                                <ul className="space-y-1 text-gray-700 text-sm">
                                                    <li>• 美容師免許の保有</li>
                                                    <li>• 所属サロンの承認</li>
                                                    <li>• 経歴・技術レベルの申告</li>
                                                    <li>• 指導者の推薦状</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">登録情報の正確性</h4>
                                        <p className="text-gray-700 text-sm">
                                            利用者は、登録情報を正確かつ最新の状態に保つ義務があります。
                                            虚偽の情報が判明した場合、アカウントの停止や削除を行う場合があります。
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    第5条（サービス利用のルール）
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            5.1 適切な利用
                                        </h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• 相手への敬意と思いやりを持った言動</li>
                                            <li>• 予約時間の厳守</li>
                                            <li>• 正確な情報の提供</li>
                                            <li>• サービス向上への協力</li>
                                            <li>• 法令および公序良俗の遵守</li>
                                        </ul>
                                    </div>

                                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            5.2 禁止行為
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">共通禁止事項</h4>
                                                <ul className="space-y-1 text-gray-700 text-sm">
                                                    <li>• 虚偽情報の提供</li>
                                                    <li>• 他者への嫌がらせ</li>
                                                    <li>• 無断キャンセル</li>
                                                    <li>• 個人情報の悪用</li>
                                                    <li>• 著作権侵害</li>
                                                    <li>• 営業妨害行為</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">特定禁止事項</h4>
                                                <ul className="space-y-1 text-gray-700 text-sm">
                                                    <li>• 直接取引の誘導</li>
                                                    <li>• 不適切な写真の投稿</li>
                                                    <li>• 競合サービスの宣伝</li>
                                                    <li>• システムの不正利用</li>
                                                    <li>• 複数アカウントの作成</li>
                                                    <li>• レビューの操作</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    第6条（料金・決済）
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            6.1 料金体系
                                        </h3>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">練習台料金</h4>
                                                <p className="text-sm text-gray-700">正規料金の40-60%</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">サービス手数料</h4>
                                                <p className="text-sm text-gray-700">料金の10-15%</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">決済手数料</h4>
                                                <p className="text-sm text-gray-700">決済金額の3-4%</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            6.2 決済方法・タイミング
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-white text-xs font-bold">1</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">予約確定時</h4>
                                                    <p className="text-gray-700 text-sm">クレジットカード情報の登録・認証</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-white text-xs font-bold">2</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">施術完了時</h4>
                                                    <p className="text-gray-700 text-sm">自動決済の実行</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-white text-xs font-bold">3</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">翌営業日</h4>
                                                    <p className="text-gray-700 text-sm">アシスタントへの報酬支払い</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    第7条（キャンセル・返金）
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            7.1 キャンセルポリシー
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="bg-white p-4 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-semibold text-gray-900">24時間前まで</h4>
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">無料</span>
                                                </div>
                                                <p className="text-gray-700 text-sm">キャンセル料なし・全額返金</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-semibold text-gray-900">3-24時間前</h4>
                                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">50%</span>
                                                </div>
                                                <p className="text-gray-700 text-sm">料金の50%をキャンセル料として徴収</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-semibold text-gray-900">3時間以内</h4>
                                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">100%</span>
                                                </div>
                                                <p className="text-gray-700 text-sm">全額をキャンセル料として徴収</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 text-sm bg-gray-50 p-4 rounded-lg">
                                        <strong>※ 詳細なキャンセル・返金ポリシーについては、</strong>
                                        <a href="/cancellation-policy" className="text-pink-600 hover:text-pink-700 underline ml-1">
                                            キャンセルポリシーページ
                                        </a>
                                        をご確認ください。
                                    </p>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    第8条（責任・免責事項）
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            8.1 当社の責任範囲
                                        </h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• 当社はマッチングプラットフォームの提供者です</li>
                                            <li>• 実際の美容サービスは美容師・サロンが提供します</li>
                                            <li>• 施術結果について当社は直接的な責任を負いません</li>
                                            <li>• 利用者間のトラブルは当事者間で解決していただきます</li>
                                            <li>• システムの不具合による損害は原則として責任を負いません</li>
                                        </ul>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            8.2 保険・補償制度
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">美容師賠償責任保険</h4>
                                                <p className="text-gray-700 text-sm">登録アシスタントは全員加入済み（最大500万円まで補償）</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">施術品質保証</h4>
                                                <p className="text-gray-700 text-sm">明らかな施術ミスの場合は修正対応またはお見舞金の支給</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            8.3 利用者の注意義務
                                        </h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• アレルギーや健康状態の事前申告</li>
                                            <li>• 施術中の体調不良の即座の申告</li>
                                            <li>• 不安や疑問点の事前相談</li>
                                            <li>• アフターケアの指示の遵守</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    第9条（知的財産権）
                                </h2>
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">サービスの知的財産権</h4>
                                            <p className="text-gray-700 text-sm">本サービスに関するすべての知的財産権は当社に帰属します。</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">利用者投稿コンテンツ</h4>
                                            <p className="text-gray-700 text-sm">レビューや写真等の投稿コンテンツについて、当社はサービス運営に必要な範囲で使用する権利を有します。</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">第三者の権利侵害</h4>
                                            <p className="text-gray-700 text-sm">利用者は第三者の知的財産権を侵害するコンテンツの投稿を禁止します。</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    第10条（サービスの変更・終了）
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            10.1 サービス変更
                                        </h3>
                                        <p className="text-gray-700 mb-3">
                                            当社は、サービス向上のため機能の追加・変更・削除を行う場合があります。
                                        </p>
                                        <ul className="space-y-1 text-gray-700 text-sm">
                                            <li>• 重要な変更は事前に通知します</li>
                                            <li>• 軽微な変更は事後報告の場合があります</li>
                                            <li>• 利用者の同意なく変更する場合があります</li>
                                        </ul>
                                    </div>

                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            10.2 サービス終了
                                        </h3>
                                        <p className="text-gray-700 mb-3">
                                            当社は、以下の場合にサービスを終了することがあります：
                                        </p>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• 事業戦略の変更</li>
                                            <li>• 技術的な問題</li>
                                            <li>• 法的な制約</li>
                                            <li>• その他やむを得ない事情</li>
                                        </ul>
                                        <div className="mt-4 p-4 bg-white rounded-lg">
                                            <p className="text-gray-700 text-sm">
                                                <strong>終了通知：</strong>サービス終了の際は、30日前までに利用者に通知いたします。
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    第11条（規約違反への対応）
                                </h2>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        違反行為への対応
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="bg-white p-4 rounded-lg text-center">
                                                <h4 className="font-semibold text-gray-900 mb-2">警告</h4>
                                                <p className="text-gray-700 text-sm">軽微な違反への注意喚起</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg text-center">
                                                <h4 className="font-semibold text-gray-900 mb-2">利用制限</h4>
                                                <p className="text-gray-700 text-sm">一定期間の機能制限</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg text-center">
                                                <h4 className="font-semibold text-gray-900 mb-2">アカウント停止</h4>
                                                <p className="text-gray-700 text-sm">重大な違反への対応</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-sm">
                                            対応方針は違反の内容・程度により決定し、事前通知なく実施する場合があります。
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    第12条（準拠法・管轄裁判所）
                                </h2>
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">準拠法</h4>
                                            <p className="text-gray-700">本規約は日本法に準拠し、日本法により解釈されるものとします。</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">管轄裁判所</h4>
                                            <p className="text-gray-700">
                                                本サービスに関して生じた紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    第13条（お問い合わせ）
                                </h2>
                                <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-lg p-6">
                                    <p className="text-gray-700 mb-4">
                                        本規約に関するご質問やサービスについてのお問い合わせは、以下までご連絡ください。
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">サポート窓口</p>
                                                <p className="text-gray-700">support@cutmeets.com</p>
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
                                        <div className="mt-4 p-4 bg-white rounded-lg">
                                            <p className="text-sm text-gray-700">
                                                営業時間: 平日 9:00-18:00 | 土日祝日はお休みをいただいております
                                            </p>
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

export default TermsOfServicePage