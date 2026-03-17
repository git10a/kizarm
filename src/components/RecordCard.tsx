import { useState } from 'react';
import { Link } from 'wouter';
import type { RaceRecord } from '../types';
import { LCDDisplay } from './LCDDisplay';

interface RecordCardProps {
  record: RaceRecord;
  isPB: boolean;
  onDelete: (id: string) => void;
}

const CATEGORY_SHORT: Record<string, string> = {
  'フルマラソン': 'フル',
  'ハーフマラソン': 'ハーフ',
  '10km': '10km',
  '5km': '5km',
  '3km': '3km',
  'その他': 'その他',
};

export function RecordCard({ record, isPB, onDelete }: RecordCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div
        className="relative"
        style={{ filter: isPB ? 'drop-shadow(0 0 8px rgba(255,194,0,0.5))' : undefined }}
      >
        {/* SEIKO タイマー本体（黄色ボディ） */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #FFD000 0%, #FFC200 50%, #E6A800 100%)',
            padding: '6px 8px 0px 8px',
            boxShadow: isPB
              ? '0 4px 0 #B38600, 0 6px 16px rgba(255,194,0,0.4)'
              : '0 4px 0 #C49400, 0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {/* PB バッジ */}
          {isPB && (
            <div className="absolute top-2 left-2 z-10">
              <span
                className="text-[#FFC200] text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest"
                style={{ background: '#111', border: '1px solid #FFC200' }}
              >
                PB
              </span>
            </div>
          )}

          {/* LCD パネル */}
          <div
            className="rounded-lg overflow-hidden relative"
            style={{
              background: '#0A0A00',
              border: '3px solid #8B6000',
              padding: '10px 6px',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 3px)',
                zIndex: 1,
              }}
            />
            <div className="relative z-[2] flex justify-center">
              <LCDDisplay
                hours={record.hours}
                minutes={record.minutes}
                seconds={record.seconds}
                size="sm"
                glow
              />
            </div>
          </div>

          {/* ロゴバー */}
          <div className="flex items-center justify-center px-1 py-1.5">
            <span
              className="text-[13px] font-black tracking-[0.15em]"
              style={{ color: '#3D2400', fontFamily: "'Orbitron', sans-serif" }}
            >
              KIZARM
            </span>
          </div>
        </div>

        {/* カード下部 */}
        <div
          className="px-2 pt-2 pb-1.5 rounded-b-xl"
          style={{ background: '#FFFFFF', border: '1px solid #E8E8E8', borderTop: 'none' }}
        >
          <div className="flex items-start gap-1 mb-1.5">
            <p className="text-[#111] text-[11px] font-semibold leading-tight flex-1 min-w-0 truncate">
              {record.raceName}
            </p>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
              style={{ background: '#FFF3CC', color: '#8B6000', border: '1px solid #FFC200' }}
            >
              {CATEGORY_SHORT[record.category] ?? record.category}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[#888] text-[10px]">{record.date}</p>
            <div className="flex items-center gap-1">
              {/* 編集 */}
              <Link href={`/edit/${record.id}`}>
                <button
                  title="編集"
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#F0F0F0] transition-colors text-[#AAA] hover:text-[#555]"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </Link>
              {/* 削除 */}
              <button
                onClick={() => setShowConfirm(true)}
                title="削除"
                className="w-6 h-6 flex items-center justify-center rounded transition-colors text-[#AAA] hover:bg-red-50 hover:text-red-400"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 削除確認モーダル */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#111] font-semibold text-base mb-1">記録を削除しますか？</h3>
            <p className="text-[#777] text-sm mb-6">
              「{record.raceName}」の記録を削除します。この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 bg-[#F0F0F0] text-[#555] text-sm font-semibold rounded-lg hover:bg-[#E8E8E8] transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => { onDelete(record.id); setShowConfirm(false); }}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
