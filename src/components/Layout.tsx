import React from 'react';
import { Link } from 'wouter';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#111] font-[Space_Grotesk,sans-serif]">
      <header className="border-b border-[#E8E8E8] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/">
            <span className="flex items-center cursor-pointer group">
              <span className="font-[Orbitron,sans-serif] text-[#FFC200] text-xl font-black tracking-widest group-hover:opacity-80 transition-opacity">
                KIZARM
              </span>
            </span>
          </Link>
          <Link href="/profile">
            <button
              title="プロフィール"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#EFEFEF] transition-colors text-[#888] hover:text-[#333]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </button>
          </Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
