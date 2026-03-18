export function Privacy() {
  return (
    <div className="min-h-screen bg-[#F8F8F6]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <header className="px-6 py-5 border-b border-[#E8E8E8] bg-white">
        <a href="/" className="text-[#FFC200] text-xl font-black tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          KIZARM
        </a>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-black text-[#111] mb-2">プライバシーポリシー</h1>
        <p className="text-[#999] text-xs mb-10">最終更新：2026年3月</p>

        <div className="space-y-8 text-sm text-[#444] leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">1. 収集する情報</h2>
            <p className="mb-2">本サービスでは、以下の情報を収集します。</p>
            <ul className="list-disc list-inside space-y-1 text-[#555]">
              <li>Googleアカウントまたはメールアドレスによるログイン情報（メールアドレス）</li>
              <li>ユーザーが登録したレース記録（大会名・種目・開催日・タイム・メモ等）</li>
              <li>サービス利用時のアクセスログ（IPアドレス、ブラウザ情報等）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">2. 情報の利用目的</h2>
            <p className="mb-2">収集した情報は以下の目的で利用します。</p>
            <ul className="list-disc list-inside space-y-1 text-[#555]">
              <li>本サービスの提供・運営・改善</li>
              <li>ユーザー認証およびアカウント管理</li>
              <li>不正利用の防止および対応</li>
              <li>
                大会情報（大会名・種目・開催日等）を個人と紐付けない形で集計し、
                マラソン・ランニング大会に関するデータベースの構築および提供
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">3. 大会情報の活用について</h2>
            <p>
              ユーザーが登録した大会名・種目・開催日・タイム等の情報は、個人を特定できない形に加工したうえで、
              国内外のマラソン・ランニング大会に関するデータベースの構築・整備・公開に活用する場合があります。
              これにより、より多くのランナーが大会情報にアクセスしやすい環境の提供を目指します。
              個人情報（メールアドレス、ユーザーIDなど）がこの目的に使用されることはありません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">4. 第三者への提供</h2>
            <p>
              運営者は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-[#555]">
              <li>ユーザー本人の同意がある場合</li>
              <li>法令に基づく場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">5. 利用するサービス</h2>
            <p className="mb-2">本サービスは以下のサービスを利用しています。</p>
            <ul className="list-disc list-inside space-y-1 text-[#555]">
              <li>
                <span className="font-medium">Supabase</span>
                ——データベースおよび認証基盤。
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer"
                  className="text-[#FFC200] hover:underline ml-1">プライバシーポリシー</a>
              </li>
              <li>
                <span className="font-medium">Google OAuth</span>
                ——Googleアカウントによるログイン。
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
                  className="text-[#FFC200] hover:underline ml-1">プライバシーポリシー</a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">6. Cookieについて</h2>
            <p>
              本サービスは、ログイン状態の維持のためにCookieおよびローカルストレージを使用します。
              ブラウザの設定によりCookieを無効にすることができますが、その場合は一部機能が利用できなくなります。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">7. 情報の保管・セキュリティ</h2>
            <p>
              収集した情報はSupabaseが提供するセキュアな環境に保存されます。
              運営者は適切な安全管理措置を講じますが、完全なセキュリティを保証するものではありません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">8. アカウントの削除</h2>
            <p>
              ユーザーはいつでもアカウントを削除することができます。
              アカウント削除時には、メールアドレス等の個人情報は削除されます。
              ただし、個人と紐付けない形で集計・加工済みの大会情報は引き続き保持される場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#111] mb-2">9. ポリシーの変更</h2>
            <p>
              本ポリシーは必要に応じて更新されることがあります。
              重要な変更がある場合はサービス内でお知らせします。
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
