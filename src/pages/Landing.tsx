import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LCDDisplay } from '../components/LCDDisplay';

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function WreathIcon({ size = 14 }: { size?: number }) {
  const cx = 50, cy = 47;
  const leftAngles  = [135, 152, 169, 186, 203, 220, 237, 254, 270];
  const rightAngles = [ 45,  28,  11,  -6, -23, -40, -57, -74, -90];
  const outerLeaf = 'M 0 0 C -7 -2,-7 -16, 0 -19 C 7 -16, 7 -2, 0 0 Z';
  const innerLeaf = 'M 0 0 C -5 -1.5,-5 -11, 0 -13 C 5 -11, 5 -1.5, 0 0 Z';
  const renderBranch = (angles: number[]) =>
    angles.map((θ) => {
      const a = θ * Math.PI / 180;
      const ox = (cx + 30 * Math.cos(a)).toFixed(2);
      const oy = (cy + 30 * Math.sin(a)).toFixed(2);
      const ix = (cx + 21 * Math.cos(a)).toFixed(2);
      const iy = (cy + 21 * Math.sin(a)).toFixed(2);
      return (
        <g key={θ}>
          <path d={outerLeaf} transform={`translate(${ox},${oy}) rotate(${θ + 90})`} />
          <path d={innerLeaf} transform={`translate(${ix},${iy}) rotate(${θ - 90})`} />
        </g>
      );
    });
  return (
    <svg width={size} height={size} viewBox="0 0 100 96" fill="#FFC200" style={{ overflow: 'visible' }}>
      {renderBranch(leftAngles)}
      {renderBranch(rightAngles)}
      <path d="M 68 70 C 58 80,47 86,35 93" stroke="#FFC200" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 32 70 C 42 80,53 86,65 93" stroke="#FFC200" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ── Mock card for demo ───────────────────────────────────
function DemoCard({ hours, minutes, seconds, name, cat, date, pb, size = 'md' }: {
  hours: number; minutes: number; seconds: number;
  name: string; cat: string; date: string; pb?: boolean;
  size?: 'sm' | 'md';
}) {
  const pad = size === 'sm' ? '10px 8px' : '14px 10px';
  return (
    <div style={{ filter: pb ? 'drop-shadow(0 0 12px rgba(255,194,0,0.45))' : undefined }}>
      <div className="rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #FFD000 0%, #FFC200 50%, #E6A800 100%)',
          padding: '8px 10px 0px 10px',
          boxShadow: pb
            ? '0 4px 0 #B38600, 0 6px 20px rgba(255,194,0,0.35)'
            : '0 4px 0 #C49400, 0 4px 14px rgba(0,0,0,0.12)',
        }}
      >
        <div className="rounded-lg overflow-hidden relative"
          style={{ background: '#0A0A00', border: '3px solid #8B6000', padding: pad }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 3px)', zIndex: 1 }} />
          <div className="relative z-[2] flex justify-center overflow-hidden">
            <LCDDisplay hours={hours} minutes={minutes} seconds={seconds} size={size} glow />
          </div>
        </div>
        <div className="flex items-center justify-center px-1 py-1.5">
          <span className="text-[13px] font-black tracking-[0.15em]" style={{ color: '#3D2400', fontFamily: "'Orbitron', sans-serif" }}>KIZARM</span>
        </div>
      </div>
      <div className="px-2 pt-2 pb-1.5 rounded-b-xl" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8', borderTop: 'none' }}>
        <div className="flex items-start gap-1 mb-1">
          <p className="text-[#111] text-[11px] font-semibold leading-tight flex-1 min-w-0 truncate">{name}</p>
          <span className="text-[9px] font-bold px-1 py-0.5 rounded shrink-0" style={{ background: '#FFF3CC', color: '#8B6000', border: '1px solid #FFC200' }}>{cat}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[#888] text-[10px]">{date}</p>
          {pb && <WreathIcon size={14} />}
        </div>
      </div>
    </div>
  );
}

// ── Main Landing page ─────────────────────────────────────
export function Landing() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setDone(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError('メールアドレスまたはパスワードが違います');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#111]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between w-full border-b border-[#E8E8E8] bg-white">
        <span className="text-[#FFC200] text-xl font-black tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>KIZARM</span>
        <button onClick={() => setShowEmailForm(true)}
          className="px-4 py-2 text-sm font-semibold text-[#888] hover:text-[#111] transition-colors">
          ログイン
        </button>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-16 text-center">
        <div className="inline-block bg-[#FFC200]/10 border border-[#FFC200]/40 text-[#8B6000] text-xs font-bold px-3 py-1 rounded-full tracking-wider mb-6">
          ランナーのための記録サービス
        </div>
        <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4 text-[#111]">
          レースの記録を<br />
          <span className="text-[#FFC200]">自分だけのページ</span>に。
        </h1>
        <p className="text-[#777] text-base max-w-md mx-auto mb-10 leading-relaxed">
          自己ベストを刻み、レースの歴史を年表に。<br />
          あなたの走りを、シェアできるプロフィールページとして残そう。
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 mb-14">
          <button onClick={handleGoogleLogin} disabled={googleLoading}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-[#111] text-white text-sm font-bold rounded-xl hover:bg-[#222] transition-colors disabled:opacity-50 shadow-lg w-full max-w-xs">
            <GoogleIcon size={20} />
            {googleLoading ? '...' : 'Googleで無料ではじめる'}
          </button>
          <button onClick={() => setShowEmailForm(!showEmailForm)}
            className="text-[#AAA] text-xs hover:text-[#666] transition-colors underline underline-offset-2">
            メールアドレスで{mode === 'signin' ? 'ログイン' : '登録'}
          </button>
        </div>

        {/* Email form (collapsible) */}
        {showEmailForm && !done && (
          <div className="max-w-xs mx-auto bg-white border border-[#E8E8E8] rounded-2xl p-5 mb-12 text-left shadow-sm">
            <div className="flex rounded-lg bg-[#F5F5F5] p-1 mb-4">
              {(['signin', 'signup'] as const).map((m) => (
                <button key={m} onClick={() => { setMode(m); setError(''); }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${mode === m ? 'bg-white text-[#111] shadow-sm' : 'text-[#999]'}`}>
                  {m === 'signin' ? 'ログイン' : '新規登録'}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#E8E8E8] rounded-lg text-xs font-semibold text-[#333] hover:bg-[#F5F5F5] transition-colors disabled:opacity-50 mb-3"
            >
              <GoogleIcon size={16} />
              {googleLoading ? '...' : mode === 'signin' ? 'Googleでログイン' : 'Googleで新規登録'}
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-[#E8E8E8]" />
              <span className="text-[#BBB] text-xs">または</span>
              <div className="flex-1 h-px bg-[#E8E8E8]" />
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="メールアドレス"
                className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-[#111] text-sm placeholder-[#BBB] focus:outline-none focus:border-[#FFC200] transition-colors" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="パスワード（6文字以上）"
                className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-[#111] text-sm placeholder-[#BBB] focus:outline-none focus:border-[#FFC200] transition-colors" />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-[#FFC200] text-black text-sm font-bold rounded-lg hover:bg-[#e6af00] transition-colors disabled:opacity-50">
                {loading ? '...' : mode === 'signin' ? 'ログイン' : 'アカウント作成'}
              </button>
            </form>
          </div>
        )}
        {done && (
          <div className="max-w-xs mx-auto bg-white border border-[#E8E8E8] rounded-2xl p-5 mb-12 text-center shadow-sm">
            <div className="text-2xl mb-2">✉️</div>
            <p className="text-[#111] text-sm font-semibold mb-1">確認メールを送信しました</p>
            <p className="text-[#888] text-xs">{email} のリンクから登録完了してください</p>
          </div>
        )}

        {/* Demo cards */}
        <div className="relative max-w-xl mx-auto">
          {/* Row 1: PBs */}
          <div className="grid grid-cols-2 gap-5 mb-5">
            <DemoCard hours={2} minutes={58} seconds={42} name="東京マラソン" cat="フル" date="2025-03-02" pb />
            <DemoCard hours={1} minutes={22} seconds={8} name="横浜マラソン" cat="ハーフ" date="2024-10-20" pb />
          </div>
          {/* Row 2: more records, faded */}
          <div className="grid grid-cols-3 gap-4 opacity-50 scale-95 origin-top">
            <DemoCard hours={3} minutes={12} seconds={55} name="水戸黄門漫遊マラソン" cat="フル" date="2024-11-03" size="sm" />
            <DemoCard hours={2} minutes={59} seconds={18} name="ソウルマラソン" cat="フル" date="2024-03-17" size="sm" />
            <DemoCard hours={3} minutes={8} seconds={44} name="京都マラソン" cat="フル" date="2025-03-16" size="sm" />
          </div>
          {/* Fade out */}
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(transparent, #F8F8F6)' }} />
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#E8E8E8] py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-4 gap-8 text-center">
          {[
            { icon: <WreathIcon size={34} />, title: 'Personal Bests', desc: '種目ごとの自己ベストを自動で管理。更新のたびにPBバッジが輝く。' },
            { icon: '📅', title: 'Race History', desc: '出走したすべてのレースを年表形式で振り返れる。メモも残せる。' },
            { icon: '📈', title: 'Growth Chart', desc: 'カテゴリごとのタイム推移をグラフで可視化。成長を一目で確認。' },
            { icon: '🔗', title: 'シェアできるページ', desc: '専用URLでSNSや友人にシェア。ランナーとしての軌跡を見せよう。' },
          ].map(({ icon, title, desc }) => (
            <div key={title}>
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="text-[#111] font-bold text-sm mb-2">{title}</h3>
              <p className="text-[#888] text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-6 text-center border-t border-[#E8E8E8]">
        <h2 className="text-2xl font-black mb-3 text-[#111]">あなたの記録を、<span className="text-[#FFC200]">刻もう。</span></h2>
        <p className="text-[#999] text-sm mb-8">無料ではじめられます。</p>
        <button onClick={handleGoogleLogin} disabled={googleLoading}
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#FFC200] text-black text-sm font-bold rounded-xl hover:bg-[#e6af00] transition-colors disabled:opacity-50 shadow-md">
          <GoogleIcon />
          {googleLoading ? '...' : 'Googleで無料ではじめる'}
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8E8E8] py-6 text-center bg-white">
        <span className="text-[#CCC] text-xs tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>KIZARM</span>
      </footer>
    </div>
  );
}
