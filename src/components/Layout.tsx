import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const [location] = useLocation();

  const isOnDashboard = location === '/';
  const isOnProfile = user ? location === `/u/${user.id}` : false;

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#111] font-[Space_Grotesk,sans-serif]">
      <header className="border-b border-[#E8E8E8] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/">
            <span className="flex items-center cursor-pointer group shrink-0">
              <span className="font-[Orbitron,sans-serif] text-[#FFC200] text-xl font-black tracking-widest group-hover:opacity-80 transition-opacity">
                KIZARM
              </span>
            </span>
          </Link>

          {user && (
            <nav className="flex items-center gap-1 flex-1">
              <Link href="/">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  isOnDashboard
                    ? 'bg-[#F5F5F5] text-[#111]'
                    : 'text-[#999] hover:text-[#555] hover:bg-[#F9F9F9]'
                }`}>
                  ダッシュボード
                </span>
              </Link>
              <Link href={`/u/${user.id}`}>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  isOnProfile
                    ? 'bg-[#F5F5F5] text-[#111]'
                    : 'text-[#999] hover:text-[#555] hover:bg-[#F9F9F9]'
                }`}>
                  公開プロフ
                </span>
              </Link>
            </nav>
          )}

          {user && (
            <button
              onClick={signOut}
              title="ログアウト"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#EFEFEF] transition-colors text-[#BBB] hover:text-[#666] shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
