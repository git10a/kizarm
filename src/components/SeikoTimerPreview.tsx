interface SeikoTimerPreviewProps {
  hours: number;
  minutes: number;
  seconds: number;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function SeikoTimerPreview({ hours, minutes, seconds }: SeikoTimerPreviewProps) {
  const timeStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return (
    <div className="mb-8">
      {/* 黄色ボディ（横長） */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #FFD400 0%, #FFC200 55%, #E8A800 100%)',
          padding: '10px 12px 0 12px',
          boxShadow: '0 6px 0 #B38600, 0 8px 20px rgba(0,0,0,0.18)',
        }}
      >
        {/* LCD パネル（横長・黒） */}
        <div
          className="rounded-xl overflow-hidden relative"
          style={{
            background: '#060600',
            border: '4px solid #7A5500',
            padding: '14px 24px',
          }}
        >
          {/* スキャンライン */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 3px)',
              zIndex: 1,
            }}
          />
          {/* 時計 */}
          <div
            className="relative z-[2] text-center"
            style={{
              fontFamily: "'DSEG7', 'Courier New', monospace",
              fontSize: 'clamp(32px, 9vw, 58px)',
              color: '#FFC200',
              letterSpacing: '0.05em',
            }}
          >
            {timeStr}
          </div>
        </div>

        {/* ロゴ行 */}
        <div className="flex items-center justify-center px-2 py-2">
          <span
            className="font-black tracking-[0.2em] text-[18px]"
            style={{ color: '#2E1800', fontFamily: "'Orbitron', sans-serif" }}
          >
            KIZARM
          </span>
        </div>
      </div>
    </div>
  );
}
