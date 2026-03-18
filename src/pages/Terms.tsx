export function Terms() {
  return (
    <div className="min-h-screen bg-[#F8F8F6]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <header className="px-6 py-5 border-b border-[#E8E8E8] bg-white">
        <a href="/" className="text-[#FFC200] text-xl font-black tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          KIZARM
        </a>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-black text-[#111] mb-2">利用規約</h1>
        <p className="text-[#999] text-xs mb-10">最終更新：2026年3月</p>

        <div className="space-y-8 text-sm text-[#444] leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">第1条（総則）</h2>
            <p>
              本利用規約（以下「本規約」）は、KIZARM（以下「本サービス」）の利用条件を定めるものです。
              ユーザーは本規約に同意のうえ、本サービスを利用するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">第2条（サービスの内容）</h2>
            <p>
              本サービスは、ランナーが自身のレース記録（大会名・種目・タイムなど）を登録・管理し、
              公開プロフィールページとして共有できる記録管理サービスです。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">第3条（登録情報の取り扱い）</h2>
            <p className="mb-3">
              ユーザーが本サービスに登録した大会名・種目・開催日・タイム等のレース情報（以下「大会情報」）は、
              個人を特定しない形で集計・分析し、以下の目的に使用する場合があります。
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#555]">
              <li>国内外マラソン・ランニング大会に関するデータベースの構築・提供</li>
              <li>大会情報の統計的な分析・調査・研究</li>
              <li>本サービスの機能改善や新機能の開発</li>
            </ul>
            <p className="mt-3">
              なお、氏名・メールアドレス等の個人情報を第三者に提供することはありません。
              詳細は<a href="/privacy" className="text-[#FFC200] hover:underline">プライバシーポリシー</a>をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">第4条（禁止事項）</h2>
            <p className="mb-2">ユーザーは以下の行為を行ってはなりません。</p>
            <ul className="list-disc list-inside space-y-1 text-[#555]">
              <li>虚偽の情報を登録する行為</li>
              <li>他のユーザーや第三者の権利を侵害する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>不正アクセスやリバースエンジニアリング等の行為</li>
              <li>その他、運営者が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">第5条（アカウントの停止・削除）</h2>
            <p>
              運営者は、ユーザーが本規約に違反した場合、予告なくアカウントを停止または削除することができます。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">第6条（サービスの変更・停止）</h2>
            <p>
              運営者は、事前の通知なく本サービスの内容を変更・停止・終了する場合があります。
              これにより生じた損害について、運営者は責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">第7条（免責事項）</h2>
            <p>
              本サービスは現状有姿で提供されます。運営者は本サービスの完全性・正確性・有用性等について
              いかなる保証もしません。本サービスの利用によって生じた損害について、運営者は責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">第8条（規約の変更）</h2>
            <p>
              運営者は必要に応じて本規約を変更できます。変更後の規約は本サービス上に掲載した時点で
              効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">第9条（準拠法）</h2>
            <p>
              本規約は日本法を準拠法とし、本サービスに関する紛争は日本国内の裁判所を専属的合意管轄とします。
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-[#E8E8E8] py-6 text-center bg-white mt-12">
        <div className="flex items-center justify-center gap-6 mb-3">
          <a href="/terms" className="text-[#AAA] text-xs hover:text-[#666] transition-colors">利用規約</a>
          <a href="/privacy" className="text-[#AAA] text-xs hover:text-[#666] transition-colors">プライバシーポリシー</a>
        </div>
        <span className="text-[#CCC] text-xs tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>KIZARM</span>
      </footer>
    </div>
  );
}
