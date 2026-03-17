import { useState, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import type { RaceRecord, RaceCategory } from '../types';
import { supabase } from '../lib/supabase';


export interface UserProfile {
  displayName: string;
  bio: string;
  stravaUrl: string;
  instagramUrl: string;
  xUrl: string;
}

// DB row ↔ RaceRecord conversion
type DbRow = {
  id: string;
  user_id: string;
  category: string;
  hours: number;
  minutes: number;
  seconds: number;
  race_name: string;
  date: string;
  race_url: string | null;
  memo: string | null;
  created_at: number;
};

function toRecord(row: DbRow): RaceRecord {
  return {
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
  };
}

function toDbRow(r: RaceRecord, userId: string): DbRow {
  return {
    id: r.id,
    user_id: userId,
    category: r.category,
    hours: r.hours,
    minutes: r.minutes,
    seconds: r.seconds,
    race_name: r.raceName,
    date: r.date,
    race_url: r.raceUrl ?? null,
    memo: r.memo ?? null,
    created_at: r.createdAt,
  };
}

export function useRecords(userId: string | undefined) {
  const [records, setRecords] = useState<RaceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('race_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRecords((data as DbRow[]).map(toRecord));
      }
      setLoading(false);
    })();
  }, [userId]);

  const addRecord = useCallback(
    async (data: Omit<RaceRecord, 'id' | 'createdAt'>): Promise<RaceRecord> => {
      const newRecord: RaceRecord = { ...data, id: nanoid(), createdAt: Date.now() };
      setRecords((prev) => [newRecord, ...prev]);
      if (userId) {
        await supabase.from('race_records').insert(toDbRow(newRecord, userId));
      }
      return newRecord;
    },
    [userId]
  );

  const updateRecord = useCallback(
    async (id: string, data: Omit<RaceRecord, 'id' | 'createdAt'>): Promise<void> => {
      let updatedRecord: RaceRecord | undefined;
      setRecords((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            updatedRecord = { ...r, ...data };
            return updatedRecord;
          }
          return r;
        })
      );
      if (userId && updatedRecord) {
        await supabase
          .from('race_records')
          .update(toDbRow(updatedRecord, userId))
          .eq('id', id);
      }
    },
    [userId]
  );

  const deleteRecord = useCallback(
    async (id: string): Promise<void> => {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (userId) {
        await supabase.from('race_records').delete().eq('id', id);
      }
    },
    [userId]
  );

  const getRecord = useCallback(
    (id: string): RaceRecord | undefined => records.find((r) => r.id === id),
    [records]
  );

  return { records, loading, addRecord, updateRecord, deleteRecord, getRecord };
}

export function useUserProfile(userId: string | undefined) {
  const defaultProfile: UserProfile = {
    displayName: '',
    bio: '',
    stravaUrl: '',
    instagramUrl: '',
    xUrl: '',
  };

  const [profile, setProfileState] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    if (!userId) {
      setProfileState(defaultProfile);
      return;
    }

    (async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfileState({
          displayName: data.display_name ?? '',
          bio: data.bio ?? '',
          stravaUrl: data.strava_url ?? '',
          instagramUrl: data.instagram_url ?? '',
          xUrl: data.x_url ?? '',
        });
      } else {
        setProfileState(defaultProfile);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const setProfile = useCallback(
    async (p: UserProfile) => {
      setProfileState(p);
      if (userId) {
        await supabase.from('user_profiles').upsert({
          id: userId,
          display_name: p.displayName,
          bio: p.bio,
          strava_url: p.stravaUrl,
          instagram_url: p.instagramUrl,
          x_url: p.xUrl,
        });
      }
    },
    [userId]
  );

  return { profile, setProfile };
}

export function getPBRecords(records: RaceRecord[]): Record<RaceCategory, RaceRecord | undefined> {
  const pb: Partial<Record<RaceCategory, RaceRecord>> = {};
  for (const record of records) {
    const totalSeconds = record.hours * 3600 + record.minutes * 60 + record.seconds;
    const existing = pb[record.category];
    if (!existing) {
      pb[record.category] = record;
    } else {
      const existingSeconds = existing.hours * 3600 + existing.minutes * 60 + existing.seconds;
      if (totalSeconds < existingSeconds) {
        pb[record.category] = record;
      }
    }
  }
  return pb as Record<RaceCategory, RaceRecord | undefined>;
}
