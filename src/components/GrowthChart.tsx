import { useState, useRef } from 'react';
import type { RaceRecord } from '../types';
import { RACE_CATEGORIES } from '../types';

interface GrowthChartProps {
  records: RaceRecord[];
}

function toSeconds(r: RaceRecord): number {
  return r.hours * 3600 + r.minutes * 60 + r.seconds;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function formatDateShort(date: string): string {
  const [y, m, d] = date.split('-');
  return `'${y.slice(2)} ${parseInt(m)}/${parseInt(d)}`;
}

const CATEGORY_COLORS: Record<string, string> = {
  'フルマラソン': '#FFC200',
  'ハーフマラソン': '#EF4444',
  '10km': '#10B981',
  '5km': '#3B82F6',
  '3km': '#8B5CF6',
  'その他': '#6B7280',
};

const PAD = { top: 32, right: 24, bottom: 36, left: 24 };
const W = 560;
const H = 200;
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

export function GrowthChart({ records }: GrowthChartProps) {
  const chartableCategories = RACE_CATEGORIES.filter(
    (cat) => records.filter((r) => r.category === cat).length >= 2
  );

  const defaultCat = chartableCategories.includes('フルマラソン')
    ? 'フルマラソン'
    : chartableCategories[0] ?? '';
  const [activeCategory, setActiveCategory] = useState<string>(defaultCat);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; time: string; containerWidth: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (chartableCategories.length === 0) {
    return (
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2
            className="text-[#111] text-sm font-bold tracking-widest uppercase"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Growth
          </h2>
          <div className="flex-1 h-px bg-[#E8E8E8]" />
        </div>
        <div className="bg-white rounded-xl border border-[#E8E8E8] py-10 text-center">
          <p className="text-[#CCC] text-sm">
            同じ種目の記録が2件以上になるとグラフが表示されます
          </p>
        </div>
      </section>
    );
  }

  const current = chartableCategories.includes(activeCategory)
    ? activeCategory
    : chartableCategories[0];

  const catRecs = records
    .filter((r) => r.category === current)
    .sort((a, b) => a.date.localeCompare(b.date));

  const secs = catRecs.map(toSeconds);
  const minS = Math.min(...secs);
  const maxS = Math.max(...secs);
  const rangeS = maxS - minS || 1;
  const pad = rangeS * 0.25;
  const color = CATEGORY_COLORS[current] ?? '#FFC200';

  const toY = (s: number): number =>
    PAD.top + ((s - (minS - pad)) / (rangeS + 2 * pad)) * CH;

  const toX = (i: number): number =>
    PAD.left + (catRecs.length === 1 ? CW / 2 : (i / (catRecs.length - 1)) * CW);

  const points = catRecs.map((r, i) => `${toX(i)},${toY(toSeconds(r))}`).join(' ');

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2
          className="text-[#111] text-sm font-bold tracking-widest uppercase"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Growth
        </h2>
        <div className="flex-1 h-px bg-[#E8E8E8]" />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {chartableCategories.map((cat) => {
          const c = CATEGORY_COLORS[cat] ?? '#888';
          const isActive = current === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-1 text-xs rounded-full border transition-all"
              style={
                isActive
                  ? { color: 'white', borderColor: c, background: c }
                  : { color: '#AAA', borderColor: '#E8E8E8', background: 'white' }
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-[#E8E8E8] overflow-hidden relative">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }} onMouseLeave={() => setTooltip(null)}>
          {/* Horizontal grid lines */}
          {[0, 0.5, 1].map((t, i) => {
            const y = PAD.top + t * CH;
            return (
              <line
                key={i}
                x1={PAD.left}
                y1={y}
                x2={W - PAD.right}
                y2={y}
                stroke="#F0F0F0"
                strokeWidth="1"
                strokeDasharray={i === 1 ? '4 3' : '0'}
              />
            );
          })}

          {/* Area fill */}
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0" />
              <stop offset="100%" stopColor={color} stopOpacity="0.12" />
            </linearGradient>
          </defs>
          <polygon
            points={`${toX(0)},${PAD.top + CH} ${points} ${toX(catRecs.length - 1)},${PAD.top + CH}`}
            fill="url(#areaGrad)"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {catRecs.map((r, i) => {
            const x = toX(i);
            const y = toY(toSeconds(r));
            const isPBPoint = toSeconds(r) === minS;
            const showLabel = isPBPoint || i === 0 || i === catRecs.length - 1;
            return (
              <g
                key={r.id}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => {
                  if (!svgRef.current) return;
                  const rect = svgRef.current.getBoundingClientRect();
                  const scaleX = rect.width / W;
                  const scaleY = rect.height / H;
                  setTooltip({
                    x: x * scaleX,
                    y: y * scaleY,
                    name: r.raceName,
                    time: formatTime(toSeconds(r)),
                    containerWidth: rect.width,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Hit area */}
                <circle cx={x} cy={y} r="12" fill="transparent" />
                <circle
                  cx={x} cy={y} r={isPBPoint ? 5 : 4}
                  fill={isPBPoint ? color : 'white'}
                  stroke={color} strokeWidth="2"
                />
                {showLabel && (
                  <text
                    x={x} y={y - 9}
                    textAnchor="middle" fontSize="9"
                    fontWeight={isPBPoint ? '700' : '500'}
                    fill={isPBPoint ? color : '#999'}
                  >
                    {formatTime(toSeconds(r))}
                  </text>
                )}
                <text x={x} y={H - 8} textAnchor="middle" fontSize="9" fill="#BBB">
                  {formatDateShort(r.date)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (() => {
          const TW = 180; // estimated tooltip width
          const MARGIN = 8;
          const rawLeft = tooltip.x;
          const clampedLeft = Math.min(
            Math.max(rawLeft, TW / 2 + MARGIN),
            tooltip.containerWidth - TW / 2 - MARGIN
          );
          const arrowOffset = rawLeft - clampedLeft; // shift arrow to keep pointing at dot
          return (
            <div
              className="absolute pointer-events-none z-10 bg-[#111] text-white text-xs rounded-lg px-3 py-2 shadow-lg"
              style={{
                left: clampedLeft,
                top: tooltip.y - 8,
                transform: 'translate(-50%, -100%)',
                whiteSpace: 'nowrap',
                width: TW,
              }}
            >
              <div className="font-semibold truncate">{tooltip.name}</div>
              <div className="text-[#FFC200] font-mono mt-0.5">{tooltip.time}</div>
              <div
                className="absolute -bottom-1.5"
                style={{
                  left: `calc(50% + ${arrowOffset}px)`,
                  transform: 'translateX(-50%)',
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid #111',
                }}
              />
            </div>
          );
        })()}
      </div>
    </section>
  );
}
