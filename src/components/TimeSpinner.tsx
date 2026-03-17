import React from 'react';

interface SpinnerFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

function SpinnerField({ label, value, min, max, onChange }: SpinnerFieldProps) {
  const increment = () => {
    onChange(value >= max ? min : value + 1);
  };

  const decrement = () => {
    onChange(value <= min ? max : value - 1);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num)) {
      onChange(Math.max(min, Math.min(max, num)));
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[#888] text-xs tracking-widest uppercase font-medium">
        {label}
      </span>
      <div className="flex flex-col items-center bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={increment}
          className="w-14 h-10 text-[#FFC200] hover:bg-[#EFEFEF] transition-colors text-lg font-bold active:scale-95"
          aria-label={`Increment ${label}`}
        >
          ▲
        </button>
        <input
          type="number"
          value={String(value).padStart(2, '0')}
          onChange={handleInput}
          min={min}
          max={max}
          className="
            w-14 h-12 text-center bg-[#0A0A00] text-[#FFC200]
            text-2xl border-y border-[#333300]
            focus:outline-none focus:ring-1 focus:ring-[#FFC200]
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          "
          style={{ fontFamily: "'DSEG7', 'Courier New', monospace" }}
        />
        <button
          type="button"
          onClick={decrement}
          className="w-14 h-10 text-[#FFC200] hover:bg-[#EFEFEF] transition-colors text-lg font-bold active:scale-95"
          aria-label={`Decrement ${label}`}
        >
          ▼
        </button>
      </div>
    </div>
  );
}

interface TimeSpinnerProps {
  hours: number;
  minutes: number;
  seconds: number;
  onHoursChange: (v: number) => void;
  onMinutesChange: (v: number) => void;
  onSecondsChange: (v: number) => void;
}

export function TimeSpinner({
  hours,
  minutes,
  seconds,
  onHoursChange,
  onMinutesChange,
  onSecondsChange,
}: TimeSpinnerProps) {
  return (
    <div className="flex items-end gap-2 justify-center">
      <SpinnerField
        label="時"
        value={hours}
        min={0}
        max={23}
        onChange={onHoursChange}
      />
      <span className="text-[#FFC200] text-3xl pb-4" style={{ fontFamily: "'DSEG7', monospace" }}>
        :
      </span>
      <SpinnerField
        label="分"
        value={minutes}
        min={0}
        max={59}
        onChange={onMinutesChange}
      />
      <span className="text-[#FFC200] text-3xl pb-4" style={{ fontFamily: "'DSEG7', monospace" }}>
        :
      </span>
      <SpinnerField
        label="秒"
        value={seconds}
        min={0}
        max={59}
        onChange={onSecondsChange}
      />
    </div>
  );
}
