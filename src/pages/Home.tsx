import { useState } from 'react';
import { Link } from 'wouter';
import { useRecords, getPBRecords, isPB } from '../hooks/useRecords';
import { RACE_CATEGORIES } from '../types';
import type { RaceCategory } from '../types';
import { RecordCard } from '../components/RecordCard';
import { PBSummary } from '../components/PBSummary';
import { GrowthChart } from '../components/GrowthChart';

export function Home() {
  const { records, deleteRecord } = useRecords();
  const [activeCategory, setActiveCategory] = useState<RaceCategory | 'すべて'>('すべて');

  const pbRecords = getPBRecords(records);

  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));

  const filteredRecords =
    activeCategory === 'すべて'
      ? sortedRecords
      : sortedRecords.filter((r) => r.category === activeCategory);

  return (
    <div>

      {/* PB Summary */}
      <PBSummary pbRecords={pbRecords} />

      {/* Records section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[#111] font-[Orbitron,sans-serif] text-sm font-bold tracking-widest uppercase">
            Records
          </h2>
          <div className="text-[#888] text-xs">{records.length} 件</div>
        </div>
        <Link href="/add">
          <button className="px-4 py-2 bg-[#FFC200] text-black text-sm font-bold rounded-lg hover:bg-[#e6af00] transition-colors active:scale-95">
            + 記録追加
          </button>
        </Link>
      </div>

      {/* Category filter */}
      {records.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {(['すべて', ...RACE_CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as RaceCategory | 'すべて')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                activeCategory === cat
                  ? 'bg-[#FFC200] text-black border-[#FFC200] font-semibold'
                  : 'text-[#888] border-[#E8E8E8] hover:border-[#D0D0D0] hover:text-[#666]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Record grid */}
      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-[#D0D0D0] text-7xl mb-6 font-[Orbitron,sans-serif]">00:00:00</div>
          <p className="text-[#777] text-sm mb-6">まだ記録がありません</p>
          <Link href="/add">
            <button className="px-6 py-3 bg-[#FFC200] text-black font-bold rounded-lg hover:bg-[#e6af00] transition-colors">
              最初の記録を追加
            </button>
          </Link>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-16 text-[#888] text-sm">
          このカテゴリの記録はありません
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredRecords.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              isPB={isPB(record, records)}
              onDelete={deleteRecord}
            />
          ))}
        </div>
      )}

      {/* Growth Chart */}
      <div className="mt-12">
        <GrowthChart records={records} />
      </div>

    </div>
  );
}
