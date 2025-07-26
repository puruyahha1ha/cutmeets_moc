import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'キャンセルポリシー',
    description: 'Cutmeetsの予約キャンセル・返金ポリシーと練習台予約の特別なルールについて詳しく説明します。',
    robots: {
        index: true,
        follow: true,
    },
}

const CancellationPolicyPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* ヘッダー */}
                    <div className="bg-gradient-to-r from-pink-500 to-red-500 px-8 py-12 text-white">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4">キャンセルポリシー</h1>
                        <p className="text-pink-100 text-lg">
                            予約のキャンセル・変更・返金に関するルールとポリシー
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
                                    基本方針
                                </h2>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Cutmeetsでは、お客様とアシスタント美容師の双方にとって公平で透明性の高いキャンセルポリシーを設けています。
                                        練習台という特殊なサービスの性質を考慮し、アシスタントの学習機会確保とお客様の利便性のバランスを重視しています。
                                    </p>
                                    <div className="bg-white p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-2">重要なポイント</h3>
                                        <ul className="space-y-1 text-gray-700 text-sm">
                                            <li>• キャンセル時期により料金が異なります</li>
                                            <li>• 練習台の性質上、通常の美容院とは異なるルールが適用されます</li>
                                            <li>• 緊急時や体調不良には特別な配慮を行います</li>
                                            <li>• 天候や交通機関の影響も考慮いたします</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    キャンセル料金体系
                                </h2>
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-1 gap-6">
                                        <div className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
                                            <div className="bg-green-500 text-white px-6 py-3">
                                                <h3 className="text-lg font-semibold flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    24時間前まで - キャンセル料無料
                                                </h3>
                                            </div>
                                            <div className="p-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-700">キャンセル料</span>
                                                        <span className="font-bold text-green-600 text-lg">0円</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-700">返金額</span>
                                                        <span className="font-bold text-green-600 text-lg">100%</span>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-lg">
                                                        <h4 className="font-semibold text-gray-900 mb-2">適用条件</h4>
                                                        <ul className="space-y-1 text-gray-700 text-sm">
                                                            <li>• 予約日時の24時間前までのキャンセル</li>
                                                            <li>• オンラインまたは電話でのキャンセル申請</li>
                                                            <li>• キャンセル受付の確認メール受信</li>
                                                        </ul>
                                                    </div>
                                                    <div className="bg-green-100 p-4 rounded-lg">
                                                        <p className="text-green-800 text-sm">
                                                            <strong>推奨：</strong>
                                                            アシスタントの準備時間を考慮し、可能な限り早めのキャンセルをお願いします。
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg overflow-hidden">
                                            <div className="bg-yellow-500 text-white px-6 py-3">
                                                <h3 className="text-lg font-semibold flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                    3-24時間前 - キャンセル料50%
                                                </h3>
                                            </div>
                                            <div className="p-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-700">キャンセル料</span>
                                                        <span className="font-bold text-yellow-600 text-lg">料金の50%</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-700">返金額</span>
                                                        <span className="font-bold text-yellow-600 text-lg">50%</span>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-lg">
                                                        <h4 className="font-semibold text-gray-900 mb-2">理由</h4>
                                                        <p className="text-gray-700 text-sm">
                                                            アシスタントは既に準備を開始しており、代替の練習機会を見つけることが困難なため、
                                                            一部費用をご負担いただきます。
                                                        </p>
                                                    </div>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div className="bg-yellow-100 p-3 rounded-lg">
                                                            <h5 className="font-semibold text-gray-900 text-sm">料金例（カット 3,000円の場合）</h5>
                                                            <div className="mt-2 space-y-1 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>キャンセル料</span>
                                                                    <span className="font-bold">1,500円</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>返金額</span>
                                                                    <span className="font-bold text-yellow-700">1,500円</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-yellow-100 p-3 rounded-lg">
                                                            <h5 className="font-semibold text-gray-900 text-sm">返金処理</h5>
                                                            <p className="text-yellow-800 text-sm mt-1">
                                                                3-5営業日以内にクレジットカードへ返金
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
                                            <div className="bg-red-500 text-white px-6 py-3">
                                                <h3 className="text-lg font-semibold flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    3時間以内 - キャンセル料100%
                                                </h3>
                                            </div>
                                            <div className="p-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-700">キャンセル料</span>
                                                        <span className="font-bold text-red-600 text-lg">料金の100%</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-700">返金額</span>
                                                        <span className="font-bold text-red-600 text-lg">0%</span>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-lg">
                                                        <h4 className="font-semibold text-gray-900 mb-2">理由</h4>
                                                        <p className="text-gray-700 text-sm mb-2">
                                                            アシスタントは既にサロンに到着し、お客様のために準備を完了している状態です。
                                                            この時点でのキャンセルは大きな機会損失となるため、全額をご負担いただきます。
                                                        </p>
                                                        <ul className="space-y-1 text-gray-700 text-xs">
                                                            <li>• サロンの準備時間の確保済み</li>
                                                            <li>• 材料・道具の準備完了</li>
                                                            <li>• 他のお客様への対応機会の喪失</li>
                                                        </ul>
                                                    </div>
                                                    <div className="bg-red-100 border border-red-300 p-4 rounded-lg">
                                                        <h5 className="font-semibold text-red-800 text-sm mb-2">
                                                            ⚠️ 例外的な配慮事項
                                                        </h5>
                                                        <p className="text-red-700 text-xs">
                                                            急病、事故、交通機関の大幅な遅延等、やむを得ない事情の場合は個別に対応いたします。
                                                            該当する場合は、可能な限り早急にご連絡ください。
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    練習台特有のキャンセルルール
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            練習台システムの特別な考慮事項
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                    <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs mr-2">1</span>
                                                    アシスタントの学習機会
                                                </h4>
                                                <p className="text-gray-700 text-sm">
                                                    練習台は貴重な学習機会です。キャンセルはアシスタントの技術向上を阻害する可能性があります。
                                                </p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                    <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs mr-2">2</span>
                                                    指導者のスケジュール
                                                </h4>
                                                <p className="text-gray-700 text-sm">
                                                    指導者（先輩美容師）も時間を確保しているため、キャンセルによる影響は大きくなります。
                                                </p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                    <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs mr-2">3</span>
                                                    代替機会の困難性
                                                </h4>
                                                <p className="text-gray-700 text-sm">
                                                    短時間で代替の練習台を見つけることは困難で、アシスタントの成長機会が失われます。
                                                </p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                    <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs mr-2">4</span>
                                                    材料の準備
                                                </h4>
                                                <p className="text-gray-700 text-sm">
                                                    カラー剤などの材料は個人に合わせて調合されており、キャンセルにより無駄になります。
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            練習内容による特別ルール
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">カラー・パーマの場合</h4>
                                                <ul className="space-y-1 text-gray-700 text-sm">
                                                    <li>• 薬剤調合済みの場合、12時間前からキャンセル料50%</li>
                                                    <li>• 3時間前からは100%のキャンセル料</li>
                                                    <li>• 事前カウンセリング後のキャンセルは材料費を請求する場合があります</li>
                                                </ul>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">カット・ブローの場合</h4>
                                                <ul className="space-y-1 text-gray-700 text-sm">
                                                    <li>• 標準のキャンセルポリシーが適用されます</li>
                                                    <li>• 特殊な技術練習の場合は事前に別途ご説明します</li>
                                                </ul>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">初回練習の場合</h4>
                                                <ul className="space-y-1 text-gray-700 text-sm">
                                                    <li>• アシスタントの初回練習は特に重要な機会です</li>
                                                    <li>• 24時間前までのキャンセルを強く推奨します</li>
                                                    <li>• 当日キャンセルの場合は次回予約時に特別料金が適用される場合があります</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    緊急時・やむを得ない事情への配慮
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            キャンセル料免除対象
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">医療的事情</h4>
                                                <ul className="space-y-1 text-gray-700 text-sm">
                                                    <li>• 急病・体調不良</li>
                                                    <li>• 感染症の疑い</li>
                                                    <li>• 医師による外出制限</li>
                                                    <li>• 緊急医療処置</li>
                                                </ul>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">不可抗力</h4>
                                                <ul className="space-y-1 text-gray-700 text-sm">
                                                    <li>• 自然災害（地震、台風等）</li>
                                                    <li>• 交通機関の運休・大幅遅延</li>
                                                    <li>• 事故・緊急事態</li>
                                                    <li>• 家族の緊急事態</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="mt-4 bg-white p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2">必要な手続き</h4>
                                            <ol className="space-y-2 text-gray-700 text-sm">
                                                <li>1. 可能な限り早急にサポートセンターへ連絡</li>
                                                <li>2. 事情の詳細をお伝えください</li>
                                                <li>3. 必要に応じて証明書類の提出をお願いする場合があります</li>
                                                <li>4. 個別に対応方針を決定いたします</li>
                                            </ol>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            特別配慮制度
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">振替予約制度</h4>
                                                <p className="text-gray-700 text-sm">
                                                    やむを得ない事情でキャンセルされた場合、同一アシスタントとの振替予約を優先的に調整いたします。
                                                </p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">アシスタント側都合によるキャンセル</h4>
                                                <p className="text-gray-700 text-sm mb-2">
                                                    アシスタントや指導者の都合によりキャンセルされた場合：
                                                </p>
                                                <ul className="space-y-1 text-gray-700 text-xs">
                                                    <li>• 全額返金いたします</li>
                                                    <li>• 交通費等の実費を補償する場合があります</li>
                                                    <li>• 次回予約時に特別割引を適用します</li>
                                                    <li>• お詫びクーポンを発行いたします</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    予約変更について
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            予約変更のルール
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">変更可能期間</h4>
                                                <div className="grid md:grid-cols-3 gap-4">
                                                    <div className="text-center">
                                                        <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg mb-2">
                                                            <span className="font-bold">48時間前まで</span>
                                                        </div>
                                                        <p className="text-sm text-gray-700">無料で変更可能</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg mb-2">
                                                            <span className="font-bold">24-48時間前</span>
                                                        </div>
                                                        <p className="text-sm text-gray-700">変更手数料 500円</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg mb-2">
                                                            <span className="font-bold">24時間以内</span>
                                                        </div>
                                                        <p className="text-sm text-gray-700">変更不可</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">変更回数制限</h4>
                                                <ul className="space-y-1 text-gray-700 text-sm">
                                                    <li>• 1つの予約につき最大2回まで変更可能</li>
                                                    <li>• 3回目以降の変更は新規予約として扱います</li>
                                                    <li>• 同一日内での時間変更は1回まで無料</li>
                                                </ul>
                                            </div>

                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">変更できる内容</h4>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900 text-sm mb-1">変更可能</h5>
                                                        <ul className="space-y-1 text-gray-700 text-xs">
                                                            <li>• 予約日時</li>
                                                            <li>• 施術時間の延長</li>
                                                            <li>• 追加オプション</li>
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900 text-sm mb-1">変更不可</h5>
                                                        <ul className="space-y-1 text-gray-700 text-xs">
                                                            <li>• アシスタントの変更</li>
                                                            <li>• 基本メニューの変更</li>
                                                            <li>• 施術時間の短縮</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    返金処理について
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            返金の流れ
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">キャンセル申請</h4>
                                                    <p className="text-gray-700 text-sm">オンラインまたは電話でキャンセルを申請</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-4">
                                                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">確認・処理</h4>
                                                    <p className="text-gray-700 text-sm">キャンセル料の計算と返金額の確定（1営業日以内）</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-4">
                                                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">返金実行</h4>
                                                    <p className="text-gray-700 text-sm">クレジットカードへの返金処理（3-5営業日）</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-4">
                                                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">4</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">完了通知</h4>
                                                    <p className="text-gray-700 text-sm">返金完了のメール通知送信</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            返金方法・期間
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">クレジットカード決済</h4>
                                                <ul className="space-y-1 text-gray-700 text-sm">
                                                    <li>• 決済に使用したカードへ返金</li>
                                                    <li>• 返金期間: 3-5営業日</li>
                                                    <li>• カード会社により反映時期が異なります</li>
                                                </ul>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">銀行振込</h4>
                                                <ul className="space-y-1 text-gray-700 text-sm">
                                                    <li>• カードの有効期限切れ等の場合</li>
                                                    <li>• 返金期間: 5-7営業日</li>
                                                    <li>• 振込手数料は当社負担</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    よくある質問
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                                        <details className="group">
                                            <summary className="flex justify-between items-center w-full px-6 py-4 text-left text-gray-900 font-semibold cursor-pointer hover:bg-gray-100 transition-colors">
                                                <span>Q. 当日の体調不良でキャンセルしたい場合はどうすればいいですか？</span>
                                                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </summary>
                                            <div className="px-6 pb-4 text-gray-700 text-sm">
                                                まずは可能な限り早急にサポートセンターへご連絡ください。発熱や感染症の疑いがある場合は、キャンセル料を免除いたします。
                                                一般的な体調不良の場合は、状況に応じて個別対応いたします。無理をせずにご相談ください。
                                            </div>
                                        </details>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                                        <details className="group">
                                            <summary className="flex justify-between items-center w-full px-6 py-4 text-left text-gray-900 font-semibold cursor-pointer hover:bg-gray-100 transition-colors">
                                                <span>Q. 交通機関の遅延で予約時間に間に合わない場合は？</span>
                                                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </summary>
                                            <div className="px-6 pb-4 text-gray-700 text-sm">
                                                遅延証明書が発行される規模の遅延の場合、キャンセル料は免除いたします。
                                                軽微な遅延（30分以内）の場合は、アシスタントと調整して時間をずらすことが可能です。
                                                必ず事前にご連絡をお願いします。
                                            </div>
                                        </details>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                                        <details className="group">
                                            <summary className="flex justify-between items-center w-full px-6 py-4 text-left text-gray-900 font-semibold cursor-pointer hover:bg-gray-100 transition-colors">
                                                <span>Q. アシスタントから練習内容を変更したいと連絡がありました</span>
                                                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </summary>
                                            <div className="px-6 pb-4 text-gray-700 text-sm">
                                                アシスタント側の都合による変更の場合、料金変更はございません。
                                                ただし、お客様が同意できない場合は無料でキャンセルできます。
                                                変更内容によってはより高度な技術練習に参加いただくことで、特別割引を適用する場合もあります。
                                            </div>
                                        </details>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                                        <details className="group">
                                            <summary className="flex justify-between items-center w-full px-6 py-4 text-left text-gray-900 font-semibold cursor-pointer hover:bg-gray-100 transition-colors">
                                                <span>Q. 返金されたはずなのにクレジットカードに反映されていません</span>
                                                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </summary>
                                            <div className="px-6 pb-4 text-gray-700 text-sm">
                                                返金処理は完了していても、クレジットカード会社での反映に時間がかかる場合があります。
                                                返金処理から7営業日を過ぎても反映されない場合は、返金証明書を発行いたしますので、
                                                カード会社にお問い合わせください。
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                                    お問い合わせ・サポート
                                </h2>
                                <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-lg p-6">
                                    <p className="text-gray-700 mb-4">
                                        キャンセル・返金に関するご質問やお困りの際は、以下のサポートセンターまでお気軽にお問い合わせください。
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">緊急連絡先</p>
                                                    <p className="text-gray-700">0120-XXX-XXX（24時間対応）</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">メールサポート</p>
                                                    <p className="text-gray-700">cancel@cutmeets.com</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">対応時間</p>
                                                    <p className="text-gray-700">平日 9:00-20:00 / 土日祝 10:00-18:00</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">チャットサポート</p>
                                                    <p className="text-gray-700">アプリ内チャット（平日 9:00-18:00）</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 p-4 bg-white rounded-lg">
                                        <p className="text-sm text-gray-700">
                                            <strong>※ 重要：</strong>
                                            キャンセルは時間が経つほど料金が高くなります。やむを得ずキャンセルが必要な場合は、
                                            可能な限り早めにご連絡いただくようお願いいたします。
                                        </p>
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

export default CancellationPolicyPage