interface LCDDisplayProps {
  hours: number;
  minutes: number;
  seconds: number;
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function LCDDisplay({
  hours,
  minutes,
  seconds,
  size = 'md',
  glow = false,
}: LCDDisplayProps) {
  const timeStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div
      className={`${sizeClasses[size]}`}
      style={{
        fontFamily: "'DSEG7', 'Courier New', monospace",
        color: glow ? '#FFC200' : '#c49600',
        letterSpacing: '0.04em',
      }}
    >
      {timeStr}
    </div>
  );
}
