import { useState } from 'react';
import { useLocation } from 'wouter';
import type { useRecords } from '../hooks/useRecords';
import { RACE_CATEGORIES } from '../types';
import type { RaceCategory } from '../types';
import { TimeSpinner } from '../components/TimeSpinner';
import { SeikoTimerPreview } from '../components/SeikoTimerPreview';

interface AddRecordProps {
  recordsCtx: ReturnType<typeof useRecords>;
}

export function AddRecord({ recordsCtx }: AddRecordProps) {
  const [, navigate] = useLocation();
  const { addRecord } = recordsCtx;

  const today = new Date().toISOString().split('T')[0];

  const [category, setCategory] = useState<RaceCategory>('フル');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [raceName, setRaceName] = useState('');
  const [raceUrl, setRaceUrl] = useState('');
  const [date, setDate] = useState(today);
  const [memo, setMemo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await addRecord({
      category, hours, minutes, seconds,
      raceName: raceName.trim(),
      raceUrl: raceUrl.trim() || undefined,
      date,
      memo: memo.trim() || undefined,
    });
    navigate('/');
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-[#111] font-[Orbitron,sans-serif] text-xl font-bold tracking-wider mb-1">
          記録追加
        </h1>
        <p className="text-[#777] text-sm">レース記録を入力してください</p>
      </div>

      {/* SEIKO タイマープレビュー（横長） */}
      <SeikoTimerPreview hours={hours} minutes={minutes} seconds={seconds} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label className="block text-[#666] text-xs tracking-wider uppercase mb-2">カテゴリ</label>
          <div className="grid grid-cols-3 gap-2">
            {RACE_CATEGORIES.map((cat) => (
              <button key={cat} type="button" onClick={() => setCategory(cat)}
                className={`py-2.5 text-sm rounded-lg border transition-colors ${
                  category === cat
                    ? 'bg-[#FFC200] text-black border-[#FFC200] font-bold'
                    : 'bg-[#F5F5F5] text-[#666] border-[#E8E8E8] hover:border-[#D0D0D0] hover:text-[#111]'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="block text-[#666] text-xs tracking-wider uppercase mb-3">タイム</label>
          <TimeSpinner hours={hours} minutes={minutes} seconds={seconds}
            onHoursChange={setHours} onMinutesChange={setMinutes} onSecondsChange={setSeconds} />
        </div>

        {/* Race name */}
        <div>
          <label htmlFor="raceName" className="block text-[#666] text-xs tracking-wider uppercase mb-2">
            大会名 <span className="text-red-500">*</span>
          </label>
          <input id="raceName" type="text" value={raceName} onChange={(e) => setRaceName(e.target.value)}
            placeholder="例: 東京マラソン2026" required
            className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg px-4 py-3 text-[#111] text-sm placeholder-[#999] focus:outline-none focus:border-[#FFC200] focus:ring-1 focus:ring-[#FFC200]/30 transition-colors" />
        </div>

        {/* Race URL */}
        <div>
          <label htmlFor="raceUrl" className="block text-[#666] text-xs tracking-wider uppercase mb-2">
            大会URL <span className="text-[#999]">(任意)</span>
          </label>
          <input id="raceUrl" type="url" value={raceUrl} onChange={(e) => setRaceUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg px-4 py-3 text-[#111] text-sm placeholder-[#999] focus:outline-none focus:border-[#FFC200] focus:ring-1 focus:ring-[#FFC200]/30 transition-colors" />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-[#666] text-xs tracking-wider uppercase mb-2">
            開催日 <span className="text-red-500">*</span>
          </label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required
            className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg px-4 py-3 text-[#111] text-sm focus:outline-none focus:border-[#FFC200] focus:ring-1 focus:ring-[#FFC200]/30 transition-colors" />
        </div>

        {/* Memo */}
        <div>
          <label htmlFor="memo" className="block text-[#666] text-xs tracking-wider uppercase mb-2">
            メモ <span className="text-[#999]">(任意)</span>
          </label>
          <textarea id="memo" value={memo} onChange={(e) => setMemo(e.target.value)}
            placeholder="大会で得た学びや思い出など..." rows={3}
            className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg px-4 py-3 text-[#111] text-sm placeholder-[#999] focus:outline-none focus:border-[#FFC200] focus:ring-1 focus:ring-[#FFC200]/30 transition-colors resize-none" />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/')}
            className="flex-1 py-3 bg-[#F0F0F0] text-[#666] text-sm font-semibold rounded-lg border border-[#E8E8E8] hover:bg-[#E8E8E8] hover:text-[#111] transition-colors">
            キャンセル
          </button>
          <button type="submit" disabled={submitting}
            className="flex-1 py-3 bg-[#FFC200] text-black text-sm font-bold rounded-lg hover:bg-[#e6af00] transition-colors disabled:opacity-50 active:scale-95">
            {submitting ? '保存中...' : '記録を保存'}
          </button>
        </div>
      </form>
    </div>
  );
}
