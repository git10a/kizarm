import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getPBRecords } from '../hooks/useRecords';
import { RACE_CATEGORIES } from '../types';
import type { RaceCategory, RaceRecord } from '../types';
import { LCDDisplay } from '../components/LCDDisplay';
import { GrowthChart } from '../components/GrowthChart';
import type { UserProfile } from '../hooks/useRecords';

// ── Icons ────────────────────────────────────────────────
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

function MedalIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8 2L5 8l5 3L8 2z" fill="#FFC200" opacity="0.85" />
      <path d="M16 2L19 8l-5 3L16 2z" fill="#FFC200" opacity="0.85" />
      <circle cx="12" cy="15" r="7" fill="#FFC200" />
      <circle cx="12" cy="15" r="5.5" fill="#FFD84D" />
      <path d="M12 11l.9 2.6H16l-2.5 1.8.9 2.6L12 16.4l-2.4 1.6.9-2.6L8 13.6h3.1z" fill="#B38600" />
    </svg>
  );
}

// ── Read-only clock card (RecordCard visual without edit buttons) ──
function PBCard({ record }: { record: RaceRecord }) {
  return (
    <div style={{ filter: 'drop-shadow(0 0 8px rgba(255,194,0,0.5))' }}>
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #FFD000 0%, #FFC200 50%, #E6A800 100%)',
          padding: '6px 8px 0px 8px',
          boxShadow: '0 4px 0 #B38600, 0 6px 16px rgba(255,194,0,0.4)',
        }}
      >
        {/* PB medal */}
        <div className="absolute top-2 left-2 z-10">
          <MedalIcon size={18} />
        </div>

        {/* LCD panel */}
        <div
          className="rounded-lg overflow-hidden relative"
          style={{ background: '#0A0A00', border: '3px solid #8B6000', padding: '10px 6px' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 3px)',
              zIndex: 1,
            }}
          />
          <div className="relative z-[2] flex justify-center">
            <LCDDisplay hours={record.hours} minutes={record.minutes} seconds={record.seconds} size="sm" glow />
          </div>
        </div>

        {/* Logo bar */}
        <div className="flex items-center justify-center px-1 py-1.5">
          <span className="text-[13px] font-black tracking-[0.15em]" style={{ color: '#3D2400', fontFamily: "'Orbitron', sans-serif" }}>
            KIZARM
          </span>
        </div>
      </div>

      {/* Card bottom */}
      <div className="px-2 pt-2 pb-1.5 rounded-b-xl" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8', borderTop: 'none' }}>
        <div className="flex items-start gap-1 mb-1">
          <p className="text-[#111] text-[11px] font-semibold leading-tight flex-1 min-w-0 truncate">{record.raceName}</p>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ background: '#FFF3CC', color: '#8B6000', border: '1px solid #FFC200' }}>
            {record.category}
          </span>
        </div>
        <p className="text-[#888] text-[10px]">{record.date}</p>
        {record.memo && <p className="text-[#AAA] text-[10px] mt-0.5 line-clamp-2">{record.memo}</p>}
      </div>
    </div>
  );
}

function formatTime(hours: number, minutes: number, seconds: number) {
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

// ── Main component ────────────────────────────────────────
export function PublicProfile() {
  const params = useParams<{ name: string }>();
  const urlId = decodeURIComponent(params.name ?? '');
  const { user } = useAuth();
  const isOwner = !!user && user.id === urlId;

  const [, navigate] = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [records, setRecords] = useState<RaceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserProfile | null>(null);
  const [activeCategory, setActiveCategory] = useState<RaceCategory | 'すべて'>('すべて');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles').select('*').eq('id', urlId).single();

      if (profileError || !profileData) { setNotFound(true); setLoading(false); return; }

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
        .from('race_records').select('*').eq('user_id', profileData.id).order('date', { ascending: false });

      if (recordsData) {
        setRecords(recordsData.map((row) => ({
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
        })));
      }
      setLoading(false);
    })();
  }, [urlId]);

  const handleDeleteRecord = async (id: string) => {
    await supabase.from('race_records').delete().eq('id', id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setConfirmDeleteId(null);
  };

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

  if (loading) return <div className="flex items-center justify-center py-24"><div className="text-[#CCC] text-sm">読み込み中...</div></div>;
  if (notFound || !profile || !form) return <div className="max-w-xl mx-auto text-center py-24"><p className="text-[#888] text-sm">ユーザーが見つかりません</p></div>;

  const pbRecords = getPBRecords(records);
  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));

  // filtered data
  const filteredPBCategories = RACE_CATEGORIES.filter((cat) => {
    if (activeCategory !== 'すべて' && cat !== activeCategory) return false;
    return !!pbRecords[cat];
  });
  const filteredHistory = activeCategory === 'すべて'
    ? sortedRecords
    : sortedRecords.filter((r) => r.category === activeCategory);

  return (
    <div className="max-w-xl mx-auto">


      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {isOwner && editing ? (
              <div className="space-y-3">
                {[
                  { label: 'ユーザー名', key: 'displayName', placeholder: 'ランナー名', type: 'text' },
                  { label: 'Strava URL', key: 'stravaUrl', placeholder: 'https://www.strava.com/athletes/...', type: 'url' },
                  { label: 'Instagram URL', key: 'instagramUrl', placeholder: 'https://www.instagram.com/...', type: 'url' },
                  { label: 'X (Twitter) URL', key: 'xUrl', placeholder: 'https://x.com/...', type: 'url' },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label className="text-[#888] text-xs mb-1 block">{label}</label>
                    <input type={type} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
                      className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg px-3 py-2 text-[#111] text-sm focus:outline-none focus:ring-1 focus:ring-[#FFC200]"
                      style={key === 'displayName' ? { borderColor: '#FFC200' } : {}} autoFocus={key === 'displayName'} />
                  </div>
                ))}
                <div>
                  <label className="text-[#888] text-xs mb-1 block">プロフィール</label>
                  <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="自己紹介・目標など..." rows={3}
                    className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-lg px-3 py-2 text-[#111] text-sm focus:outline-none focus:ring-1 focus:ring-[#FFC200] resize-none" />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={handleSave} className="flex-1 py-2 bg-[#FFC200] text-black text-sm font-bold rounded-lg hover:bg-[#e6af00] transition-colors">保存</button>
                  <button onClick={() => { setForm(profile); setEditing(false); }} className="px-4 py-2 text-[#888] text-sm rounded-lg hover:bg-[#F5F5F5] transition-colors">キャンセル</button>
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
                    {profile.stravaUrl && <a href={profile.stravaUrl} target="_blank" rel="noopener noreferrer" className="text-[#FC4C02] hover:opacity-70 transition-opacity" title="Strava"><StravaIcon /></a>}
                    {profile.instagramUrl && <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[#E1306C] hover:opacity-70 transition-opacity" title="Instagram"><InstagramIcon /></a>}
                    {profile.xUrl && <a href={profile.xUrl} target="_blank" rel="noopener noreferrer" className="text-[#111] hover:opacity-60 transition-opacity" title="X"><XIcon /></a>}
                  </div>
                )}
              </>
            )}
          </div>
          {isOwner && !editing && (
            <div className="ml-3 flex items-center gap-1 shrink-0">
              <button onClick={() => { setForm(profile); setEditing(true); }} title="プロフィールを編集"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] transition-colors text-[#AAA] hover:text-[#555]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button onClick={() => navigate('/add')}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#FFC200] text-black text-xs font-bold rounded-lg hover:bg-[#e6af00] transition-colors active:scale-95">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                記録追加
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category filter */}
      {records.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {(['すべて', ...RACE_CATEGORIES] as const).map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat as RaceCategory | 'すべて')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                activeCategory === cat
                  ? 'bg-[#FFC200] text-black border-[#FFC200] font-semibold'
                  : 'text-[#888] border-[#E8E8E8] hover:border-[#D0D0D0] hover:text-[#666]'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Personal Bests */}
      {filteredPBCategories.length > 0 && (
        <>
          <h2 className="text-[#111] text-xs font-bold tracking-widest uppercase mb-3 px-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Personal Bests
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 relative">
            {filteredPBCategories.map((cat) => {
              const record = pbRecords[cat];
              if (!record) return null;
              return <PBCard key={cat} record={record} />;
            })}
          </div>
        </>
      )}

      {/* Race History */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E8E8] py-16 text-center mb-8">
          <div className="text-[#D0D0D0] text-5xl mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>00:00:00</div>
          <p className="text-[#888] text-sm">まだ記録がありません</p>
        </div>
      ) : (
        <>
          <h2 className="text-[#111] text-xs font-bold tracking-widest uppercase mb-4 px-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Race History
          </h2>
          {(() => {
            const byYear: Record<string, RaceRecord[]> = {};
            for (const r of filteredHistory) {
              const year = r.date.slice(0, 4);
              if (!byYear[year]) byYear[year] = [];
              byYear[year].push(r);
            }
            const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));
            return years.map((year) => (
              <div key={year} className="mb-8">
                <div className="text-[#111] text-2xl font-black mb-4 px-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>{year}</div>
                <div className="relative">
                  {byYear[year].map((record, i) => {
                    const isPB = pbRecords[record.category]?.id === record.id;
                    const isLast = i === byYear[year].length - 1;
                    const monthDay = record.date.slice(5);
                    return (
                      <div key={record.id} className="flex gap-3">
                        {/* Timeline spine */}
                        <div className="flex flex-col items-center shrink-0" style={{ width: 28 }}>
                          <div className="w-2 h-2 rounded-full mt-1 shrink-0 z-10"
                            style={{ background: isPB ? '#FFC200' : '#D0D0D0', boxShadow: isPB ? '0 0 0 3px #FFF3CC' : 'none' }} />
                          {!isLast && <div className="flex-1 w-px mt-1" style={{ borderLeft: '2px dashed #E8E8E8', minHeight: 24 }} />}
                        </div>
                        {/* Card */}
                        <div className={`flex-1 min-w-0 ${isLast ? 'pb-0' : 'pb-4'}`}>
                          <div className="text-[#AAA] text-[10px] mb-1">{monthDay.replace('-', '月')}日</div>
                          <div className="bg-white rounded-xl border border-[#E8E8E8] px-4 py-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#F5F5F5', color: '#666', border: '1px solid #E8E8E8' }}>
                                    {record.category}
                                  </span>
                                  {isPB && <span title="Personal Best"><MedalIcon size={16} /></span>}
                                </div>
                                <p className="text-[#111] text-sm font-semibold truncate">{record.raceName}</p>
                                {record.memo && <p className="text-[#999] text-xs mt-1 leading-relaxed">{record.memo}</p>}
                              </div>
                              <div className="shrink-0 text-right flex flex-col items-end gap-2">
                                <span className={`text-base font-bold tabular-nums ${isPB ? 'text-[#FFC200]' : 'text-[#333]'}`}
                                  style={{ fontFamily: "'Orbitron', sans-serif" }}>
                                  {formatTime(record.hours, record.minutes, record.seconds)}
                                </span>
                                {isOwner && (
                                  <div className="flex items-center gap-1">
                                    <Link href={`/edit/${record.id}`}>
                                      <button title="編集" className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#F0F0F0] transition-colors text-[#AAA] hover:text-[#555]">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                      </button>
                                    </Link>
                                    <button title="削除" onClick={() => setConfirmDeleteId(record.id)}
                                      className="w-6 h-6 flex items-center justify-center rounded transition-colors text-[#AAA] hover:bg-red-50 hover:text-red-400">
                                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                        <path d="M10 11v6"/><path d="M14 11v6"/>
                                      </svg>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
        </>
      )}

      {/* Growth Chart */}
      {records.length >= 2 && (
        <div className="mb-8">
          <GrowthChart records={activeCategory === 'すべて' ? records : records.filter(r => r.category === activeCategory)} />
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDeleteId && (() => {
        const target = records.find(r => r.id === confirmDeleteId);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setConfirmDeleteId(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
              <h3 className="text-[#111] font-semibold text-base mb-1">記録を削除しますか？</h3>
              <p className="text-[#777] text-sm mb-6">「{target?.raceName}」の記録を削除します。この操作は取り消せません。</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 bg-[#F0F0F0] text-[#555] text-sm font-semibold rounded-lg hover:bg-[#E8E8E8] transition-colors">
                  キャンセル
                </button>
                <button onClick={() => handleDeleteRecord(confirmDeleteId)}
                  className="flex-1 py-2.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors">
                  削除する
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* CTA for non-logged-in visitors */}
      {!user && (
        <div className="mt-8 mb-4 bg-[#111] rounded-2xl px-6 py-8 text-center">
          <div className="text-[#FFC200] text-lg font-black tracking-widest mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            KIZARM
          </div>
          <p className="text-white text-sm font-medium mb-1">あなたの記録も刻みませんか？</p>
          <p className="text-[#888] text-xs mb-5">レースの軌跡を、あなただけのページに。</p>
          <Link href="/">
            <button className="px-6 py-2.5 bg-[#FFC200] text-black text-sm font-bold rounded-lg hover:bg-[#e6af00] transition-colors active:scale-95">
              無料ではじめる
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
