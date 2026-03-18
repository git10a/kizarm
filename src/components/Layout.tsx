import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#111] font-[Space_Grotesk,sans-serif]">
      <header className="border-b border-[#E8E8E8] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href={user ? `/u/${user.id}` : '/'}>
            <span className="flex items-center cursor-pointer group">
              <span className="font-[Orbitron,sans-serif] text-[#FFC200] text-xl font-black tracking-widest group-hover:opacity-80 transition-opacity">
                KIZARM
              </span>
            </span>
          </Link>

          {user ? (
            <button
              onClick={signOut}
              className="text-sm text-[#999] hover:text-[#555] transition-colors px-2 py-1 rounded hover:bg-[#EFEFEF]"
            >
              ログアウト
            </button>
          ) : (
            <Link href="/">
              <span className="text-sm text-[#555] hover:text-[#111] transition-colors px-2 py-1 rounded hover:bg-[#EFEFEF] cursor-pointer">
                ログイン
              </span>
            </Link>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      <footer className="border-t border-[#E8E8E8] py-6 text-center bg-white mt-4">
        <div className="flex items-center justify-center gap-6 mb-2">
          <a href="/terms" className="text-[#AAA] text-xs hover:text-[#666] transition-colors">利用規約</a>
          <a href="/privacy" className="text-[#AAA] text-xs hover:text-[#666] transition-colors">プライバシーポリシー</a>
        </div>
        <span className="text-[#CCC] text-xs tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>KIZARM</span>
      </footer>
    </div>
  );
}
