import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function Login() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

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
