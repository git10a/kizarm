import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function Login() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [googleLoading, setGoogleLoading] = useState(false);
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
    setGoogleLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setDone(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError('メールアドレスまたはパスワードが違います');
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#E8E8E8] p-8 w-full max-w-sm text-center">
          <div className="text-3xl mb-4">✉️</div>
          <h2 className="text-[#111] font-bold text-lg mb-2">確認メールを送信しました</h2>
          <p className="text-[#666] text-sm leading-relaxed">
            {email} に確認リンクを送りました。<br />
            メール内のリンクをクリックして登録完了してください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span
            className="text-[#FFC200] text-3xl font-black tracking-widest"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            KIZARM
          </span>
          <p className="text-[#888] text-sm mt-2">ランニング記録を刻む</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6">
          {/* Toggle */}
          <div className="flex rounded-lg bg-[#F5F5F5] p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === 'signin'
                  ? 'bg-white text-[#111] shadow-sm'
                  : 'text-[#888]'
              }`}
            >
              ログイン
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === 'signup'
                  ? 'bg-white text-[#111] shadow-sm'
                  : 'text-[#888]'
              }`}
            >
              新規登録
            </button>
          </div>

          {/* Google login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 py-3 border border-[#E8E8E8] rounded-lg text-sm font-semibold text-[#333] hover:bg-[#F5F5F5] transition-colors disabled:opacity-50 mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? '...' : 'Googleでログイン'}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#E8E8E8]" />
            <span className="text-[#BBB] text-xs">または</span>
            <div className="flex-1 h-px bg-[#E8E8E8]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#666] text-xs tracking-wider uppercase block mb-1.5">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg px-4 py-3 text-[#111] text-sm placeholder-[#999] focus:outline-none focus:border-[#FFC200] focus:ring-1 focus:ring-[#FFC200]/30 transition-colors"
              />
            </div>
            <div>
              <label className="text-[#666] text-xs tracking-wider uppercase block mb-1.5">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg px-4 py-3 text-[#111] text-sm placeholder-[#999] focus:outline-none focus:border-[#FFC200] focus:ring-1 focus:ring-[#FFC200]/30 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FFC200] text-black font-bold rounded-lg hover:bg-[#e6af00] transition-colors disabled:opacity-50 active:scale-95 mt-2"
            >
              {loading ? '...' : mode === 'signin' ? 'ログイン' : 'アカウント作成'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
