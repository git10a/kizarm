import type { RaceRecord, RaceCategory } from '../types';
import { RACE_CATEGORIES } from '../types';
import { LCDDisplay } from './LCDDisplay';

interface PBSummaryProps {
  pbRecords: Record<RaceCategory, RaceRecord | undefined>;
}

export function PBSummary({ pbRecords }: PBSummaryProps) {
  const categories = RACE_CATEGORIES.filter((cat) => pbRecords[cat]);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-[#FFC200] font-[Orbitron,sans-serif] text-sm font-bold tracking-widest uppercase">
          Personal Best
        </h2>
        <div className="flex-1 h-px bg-[#FFC200]/20" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {RACE_CATEGORIES.map((cat) => {
          const record = pbRecords[cat];
          return (
            <div
              key={cat}
              className={`
                rounded-lg border p-3 text-center
                ${
                  record
                    ? 'border-[#FFC200]/40 bg-[#fff8e0]'
                    : 'border-[#E8E8E8] bg-white opacity-40'
                }
              `}
            >
              <div className="text-[#666] text-[10px] tracking-wider uppercase mb-2">
                {cat}
              </div>
              {record ? (
                <>
                  <div className="bg-[#0d1f0d] rounded px-1 py-1.5 mb-1">
                    <LCDDisplay
                      hours={record.hours}
                      minutes={record.minutes}
                      seconds={record.seconds}
                      size="sm"
                      glow
                    />
                  </div>
                  <div className="text-[#777] text-[10px] truncate">{record.raceName}</div>
                </>
              ) : (
                <div className="text-[#999] text-[11px] py-2">未記録</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
