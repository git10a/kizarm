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

          {user && (
            <button
              onClick={signOut}
              title="ログアウト"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#EFEFEF] transition-colors text-[#BBB] hover:text-[#666]"
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
