import { useParams } from 'wouter';
import { useRecords, useUserProfile, getPBRecords } from '../hooks/useRecords';
import { RACE_CATEGORIES } from '../types';
import type { RaceCategory } from '../types';
import { LCDDisplay } from '../components/LCDDisplay';

function StravaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0 5 13.828h4.172" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function PublicProfile() {
  const params = useParams<{ name: string }>();
  const urlName = decodeURIComponent(params.name ?? '');
  const { records } = useRecords();
  const { profile } = useUserProfile();
  const pbRecords = getPBRecords(records);

  // If viewing own profile, use full profile data; otherwise show name only
  const isOwn = profile.displayName === urlName;
  const displayName = isOwn ? profile.displayName : urlName;
  const bio = isOwn ? profile.bio : '';
  const stravaUrl = isOwn ? profile.stravaUrl : '';
  const instagramUrl = isOwn ? profile.instagramUrl : '';
  const xUrl = isOwn ? profile.xUrl : '';

  const categoriesWithRecords = RACE_CATEGORIES.filter((cat) => pbRecords[cat]);

  return (
    <div className="max-w-xl mx-auto">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 mb-6">
        <div className="text-[#777] text-xs tracking-widest uppercase mb-1">Runner</div>
        <h1 className="text-[#111] text-2xl font-bold mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          {displayName || 'Unknown Runner'}
        </h1>
        {bio && <p className="text-[#666] text-sm leading-relaxed mb-3">{bio}</p>}
        {(stravaUrl || instagramUrl || xUrl) && (
          <div className="flex items-center gap-3">
            {stravaUrl && (
              <a href={stravaUrl} target="_blank" rel="noopener noreferrer" className="text-[#FC4C02] hover:opacity-70 transition-opacity" title="Strava">
                <StravaIcon />
              </a>
            )}
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[#E1306C] hover:opacity-70 transition-opacity" title="Instagram">
                <InstagramIcon />
              </a>
            )}
            {xUrl && (
              <a href={xUrl} target="_blank" rel="noopener noreferrer" className="text-[#111] hover:opacity-60 transition-opacity" title="X">
                <XIcon />
              </a>
            )}
          </div>
        )}
        <div className="mt-3 pt-3 border-t border-[#F0F0F0]">
          <span className="text-[#FFC200] text-xs tracking-wider">
            {categoriesWithRecords.length} カテゴリ記録
          </span>
        </div>
      </div>

      {/* PB Records */}
      <h2 className="text-[#111] text-sm font-bold tracking-widest uppercase mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
        Personal Bests
      </h2>

      {categoriesWithRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E8E8] py-16 text-center">
          <div className="text-[#D0D0D0] text-5xl mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            00:00:00
          </div>
          <p className="text-[#888] text-sm">まだ記録がありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {RACE_CATEGORIES.map((cat) => {
            const record = pbRecords[cat as RaceCategory];
            if (!record) return null;
            return (
              <div
                key={cat}
                className="bg-white rounded-xl border border-[#E8E8E8] overflow-hidden flex items-center gap-4 px-4 py-3"
              >
                <div
                  className="rounded-lg overflow-hidden shrink-0"
                  style={{
                    background: 'linear-gradient(160deg, #FFD000 0%, #FFC200 50%, #E6A800 100%)',
                    padding: '4px 6px 2px',
                    boxShadow: '0 3px 0 #B38600',
                  }}
                >
                  <div
                    className="rounded px-2 py-1"
                    style={{ background: '#0A0A00', border: '2px solid #8B6000' }}
                  >
                    <LCDDisplay
                      hours={record.hours}
                      minutes={record.minutes}
                      seconds={record.seconds}
                      size="sm"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#FFF3CC', color: '#8B6000', border: '1px solid #FFC200' }}>
                      {cat}
                    </span>
                    <span className="text-[9px] font-black px-1 py-0.5 rounded" style={{ background: '#111', color: '#FFC200', border: '1px solid #FFC200' }}>
                      PB
                    </span>
                  </div>
                  <p className="text-[#111] text-xs font-semibold truncate">{record.raceName}</p>
                  <p className="text-[#888] text-[10px]">{record.date}</p>
                  {record.memo && (
                    <p className="text-[#AAA] text-[10px] mt-0.5 line-clamp-1">{record.memo}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
