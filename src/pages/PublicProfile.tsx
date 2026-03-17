import { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getPBRecords } from '../hooks/useRecords';
import { RACE_CATEGORIES } from '../types';
import type { RaceCategory, RaceRecord } from '../types';
import { LCDDisplay } from '../components/LCDDisplay';
import type { UserProfile } from '../hooks/useRecords';

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

function formatTime(hours: number, minutes: number, seconds: number) {
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function PublicProfile() {
  const params = useParams<{ name: string }>();
  const urlId = decodeURIComponent(params.name ?? '');
  const { user } = useAuth();
  const isOwner = !!user && user.id === urlId;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [records, setRecords] = useState<RaceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Edit state (owner only)
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserProfile | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', urlId)
        .single();

      if (profileError || !profileData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const p: UserProfile = {
        displayName: profileData.display_name ?? '',
        bio: profileData.bio ?? '',
        stravaUrl: profileData.strava_url ?? '',
        instagramUrl: profileData.instagram_url ?? '',
        xUrl: profileData.x_url ?? '',
      };
      setProfile(p);
      setForm(p);

      const { data: recordsData } = await supabase
        .from('race_records')
        .select('*')
        .eq('user_id', profileData.id)
        .order('date', { ascending: false });

      if (recordsData) {
        const mapped: RaceRecord[] = recordsData.map((row) => ({
          id: row.id,
          category: row.category as RaceCategory,
          hours: row.hours,
          minutes: row.minutes,
          seconds: row.seconds,
          raceName: row.race_name,
          date: row.date,
          raceUrl: row.race_url ?? undefined,
          memo: row.memo ?? undefined,
          createdAt: row.created_at,
        }));
        setRecords(mapped);
      }

      setLoading(false);
    })();
  }, [urlId]);

  const handleSave = async () => {
    if (!form) return;
    await supabase.from('user_profiles').upsert({
      id: urlId,
      display_name: form.displayName,
      bio: form.bio,
      strava_url: form.stravaUrl,
      instagram_url: form.instagramUrl,
      x_url: form.xUrl,
    });
    setProfile(form);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-[#CCC] text-sm">読み込み中...</div>
      </div>
    );
  }

  if (notFound || !profile || !form) {
    return (
      <div className="max-w-xl mx-auto text-center py-24">
        <p className="text-[#888] text-sm">ユーザーが見つかりません</p>
      </div>
    );
  }

  const pbRecords = getPBRecords(records);
  const categoriesWithRecords = RACE_CATEGORIES.filter((cat) => pbRecords[cat]);

  // sorted records (already sorted by date desc from DB)
  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-xl mx-auto">

      {/* Owner banner */}
      {isOwner && (
        <div className="mb-4 flex items-center justify-between bg-[#FFFBEA] border border-[#FFE066] rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B38600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="text-[#8B6000] text-xs font-medium">他のユーザーにはこう見えています</span>
          </div>
          <Link href="/">
            <span className="text-[#8B6000] text-xs underline underline-offset-2 cursor-pointer hover:opacity-70 transition-opacity">
              ダッシュボードへ
            </span>
          </Link>
        </div>
      )}

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            {isOwner && editing ? (
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
                <h1 className="text-[#111] text-2xl font-bold mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {profile.displayName || (isOwner ? '名前未設定' : 'Unknown Runner')}
                </h1>
                {profile.bio && <p className="text-[#666] text-sm leading-relaxed mb-3">{profile.bio}</p>}
                {(profile.stravaUrl || profile.instagramUrl || profile.xUrl) && (
                  <div className="flex items-center gap-3">
                    {profile.stravaUrl && (
                      <a href={profile.stravaUrl} target="_blank" rel="noopener noreferrer" className="text-[#FC4C02] hover:opacity-70 transition-opacity" title="Strava">
                        <StravaIcon />
                      </a>
                    )}
                    {profile.instagramUrl && (
                      <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[#E1306C] hover:opacity-70 transition-opacity" title="Instagram">
                        <InstagramIcon />
                      </a>
                    )}
                    {profile.xUrl && (
                      <a href={profile.xUrl} target="_blank" rel="noopener noreferrer" className="text-[#111] hover:opacity-60 transition-opacity" title="X">
                        <XIcon />
                      </a>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {isOwner && !editing && (
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
      {categoriesWithRecords.length > 0 && (
        <>
          <h2 className="text-[#111] text-xs font-bold tracking-widest uppercase mb-3 px-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Personal Bests
          </h2>
          <div className="space-y-2 mb-8">
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
                    {record.memo && (
                      <p className="text-[#AAA] text-[10px] mt-0.5 line-clamp-2">{record.memo}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Race History */}
      {sortedRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E8E8] py-16 text-center">
          <div className="text-[#D0D0D0] text-5xl mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            00:00:00
          </div>
          <p className="text-[#888] text-sm">まだ記録がありません</p>
        </div>
      ) : (
        <>
          <h2 className="text-[#111] text-xs font-bold tracking-widest uppercase mb-3 px-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Race History
          </h2>
          <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">
            {sortedRecords.map((record, i) => {
              const isPB = pbRecords[record.category]?.id === record.id;
              const isLast = i === sortedRecords.length - 1;
              return (
                <div
                  key={record.id}
                  className={`flex items-start gap-3 px-4 py-3 ${!isLast ? 'border-b border-[#F0F0F0]' : ''}`}
                >
                  {/* Date column */}
                  <div className="shrink-0 w-20 pt-0.5">
                    <span className="text-[#999] text-[10px]">{record.date}</span>
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#F5F5F5', color: '#666', border: '1px solid #E8E8E8' }}>
                        {record.category}
                      </span>
                      {isPB && (
                        <span className="text-[9px] font-black px-1 py-0.5 rounded" style={{ background: '#111', color: '#FFC200', border: '1px solid #FFC200' }}>
                          PB
                        </span>
                      )}
                    </div>
                    <p className="text-[#111] text-xs font-medium truncate">{record.raceName}</p>
                    {record.memo && (
                      <p className="text-[#999] text-[10px] mt-0.5 leading-relaxed">{record.memo}</p>
                    )}
                  </div>

                  {/* Time */}
                  <div className="shrink-0 text-right">
                    <span
                      className={`text-sm font-bold tabular-nums ${isPB ? 'text-[#FFC200]' : 'text-[#333]'}`}
                      style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      {formatTime(record.hours, record.minutes, record.seconds)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
