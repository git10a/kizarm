import { useState } from 'react';
import { Link } from 'wouter';
import { getPBRecords } from '../hooks/useRecords';
import type { useRecords, useUserProfile, UserProfile } from '../hooks/useRecords';
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

interface ProfileProps {
  recordsCtx: ReturnType<typeof useRecords>;
  profileCtx: ReturnType<typeof useUserProfile>;
}

export function Profile({ recordsCtx, profileCtx }: ProfileProps) {
  const { records } = recordsCtx;
  const { profile, setProfile } = profileCtx;
  const pbRecords = getPBRecords(records);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserProfile>(profile);
  const categoriesWithRecords = RACE_CATEGORIES.filter((cat) => pbRecords[cat]);

  const handleSave = async () => {
    await setProfile(form);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[#888] text-xs mb-1 block">ユーザー名</label>
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                    placeholder="ランナー名"
                    autoFocus
                    className="w-full bg-[#F5F5F5] border border-[#FFC200] rounded-lg px-3 py-2 text-[#111] text-sm focus:outline-none focus:ring-1 focus:ring-[#FFC200]"
                  />
                </div>
                <div>
                  <label className="text-[#888] text-xs mb-1 block">プロフィール</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="自己紹介・目標など..."
                    rows={3}
                    className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg px-3 py-2 text-[#111] text-sm focus:outline-none focus:ring-1 focus:ring-[#FFC200] resize-none"
                  />
                </div>
                <div>
                  <label className="text-[#888] text-xs mb-1 block">Strava URL</label>
                  <input
                    type="url"
                    value={form.stravaUrl}
                    onChange={(e) => setForm({ ...form, stravaUrl: e.target.value })}
                    placeholder="https://www.strava.com/athletes/..."
                    className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg px-3 py-2 text-[#111] text-sm focus:outline-none focus:ring-1 focus:ring-[#FFC200]"
                  />
                </div>
                <div>
                  <label className="text-[#888] text-xs mb-1 block">Instagram URL</label>
                  <input
                    type="url"
                    value={form.instagramUrl}
                    onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                    placeholder="https://www.instagram.com/..."
                    className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg px-3 py-2 text-[#111] text-sm focus:outline-none focus:ring-1 focus:ring-[#FFC200]"
                  />
                </div>
                <div>
                  <label className="text-[#888] text-xs mb-1 block">X (Twitter) URL</label>
                  <input
                    type="url"
                    value={form.xUrl}
                    onChange={(e) => setForm({ ...form, xUrl: e.target.value })}
                    placeholder="https://x.com/..."
                    className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg px-3 py-2 text-[#111] text-sm focus:outline-none focus:ring-1 focus:ring-[#FFC200]"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2 bg-[#FFC200] text-black text-sm font-bold rounded-lg hover:bg-[#e6af00] transition-colors"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-[#888] text-sm rounded-lg hover:bg-[#F5F5F5] transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-[#777] text-xs tracking-widest uppercase mb-1">Runner</div>
                <h1 className="text-[#111] text-2xl font-bold truncate" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {profile.displayName || '名前未設定'}
                </h1>
                {profile.bio && (
                  <p className="text-[#666] text-sm mt-2 leading-relaxed">{profile.bio}</p>
                )}
                {(profile.stravaUrl || profile.instagramUrl || profile.xUrl) && (
                  <div className="flex items-center gap-3 mt-3">
                    {profile.stravaUrl && (
                      <a href={profile.stravaUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[#FC4C02] hover:opacity-70 transition-opacity" title="Strava">
                        <StravaIcon />
                      </a>
                    )}
                    {profile.instagramUrl && (
                      <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[#E1306C] hover:opacity-70 transition-opacity" title="Instagram">
                        <InstagramIcon />
                      </a>
                    )}
                    {profile.xUrl && (
                      <a href={profile.xUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[#111] hover:opacity-60 transition-opacity" title="X">
                        <XIcon />
                      </a>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {!editing && (
            <button
              onClick={() => { setForm(profile); setEditing(true); }}
              title="プロフィールを編集"
              className="ml-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] transition-colors text-[#AAA] hover:text-[#555] shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* PB Records */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[#111] text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          My PBs
        </h2>
        <Link href="/">
          <button className="text-[#888] text-xs hover:text-[#333] transition-colors">
            記録一覧へ →
          </button>
        </Link>
      </div>

      {categoriesWithRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E8E8] py-16 text-center">
          <div className="text-[#D0D0D0] text-5xl mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            00:00:00
          </div>
          <p className="text-[#888] text-sm mb-4">まだ記録がありません</p>
          <Link href="/add">
            <button className="px-5 py-2 bg-[#FFC200] text-black text-sm font-bold rounded-lg hover:bg-[#e6af00] transition-colors">
              最初の記録を追加
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {RACE_CATEGORIES.map((cat) => {
            const record = pbRecords[cat as RaceCategory];
            if (!record) return null;
            return (
              <div key={cat} className="bg-white rounded-xl border border-[#E8E8E8] overflow-hidden flex items-center gap-4 px-4 py-3">
                <div className="rounded-lg overflow-hidden shrink-0"
                  style={{
                    background: 'linear-gradient(160deg, #FFD000 0%, #FFC200 50%, #E6A800 100%)',
                    padding: '4px 6px 2px',
                    boxShadow: '0 3px 0 #B38600',
                  }}
                >
                  <div className="rounded px-2 py-1" style={{ background: '#0A0A00', border: '2px solid #8B6000' }}>
                    <LCDDisplay hours={record.hours} minutes={record.minutes} seconds={record.seconds} size="sm" />
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
