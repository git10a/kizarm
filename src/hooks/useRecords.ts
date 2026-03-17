import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import type { RaceRecord, RaceCategory } from '../types';

const RECORDS_KEY = 'kizarm_records';
const RUNNER_NAME_KEY = 'kizarm_runner_name';
const USER_PROFILE_KEY = 'kizarm_user_profile';

export interface UserProfile {
  displayName: string;
  bio: string;
  stravaUrl: string;
  instagramUrl: string;
  xUrl: string;
}

function loadRecords(): RaceRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RaceRecord[];
  } catch {
    return [];
  }
}

function saveRecords(records: RaceRecord[]): void {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function useRecords() {
  const [records, setRecords] = useState<RaceRecord[]>(() => loadRecords());

  const addRecord = useCallback(
    (data: Omit<RaceRecord, 'id' | 'createdAt'>): RaceRecord => {
      const newRecord: RaceRecord = {
        ...data,
        id: nanoid(),
        createdAt: Date.now(),
      };
      const currentRecords = loadRecords();
      const next = [newRecord, ...currentRecords];
      saveRecords(next);
      setRecords(next);
      return newRecord;
    },
    []
  );

  const updateRecord = useCallback(
    (id: string, data: Omit<RaceRecord, 'id' | 'createdAt'>): void => {
      const currentRecords = loadRecords();
      const next = currentRecords.map((r) =>
        r.id === id ? { ...r, ...data } : r
      );
      saveRecords(next);
      setRecords(next);
    },
    []
  );

  const deleteRecord = useCallback((id: string): void => {
    const currentRecords = loadRecords();
    const next = currentRecords.filter((r) => r.id !== id);
    saveRecords(next);
    setRecords(next);
  }, []);

  const getRecord = useCallback(
    (id: string): RaceRecord | undefined => {
      return records.find((r) => r.id === id);
    },
    [records]
  );

  return { records, addRecord, updateRecord, deleteRecord, getRecord };
}

export function useRunnerName() {
  const [runnerName, setRunnerNameState] = useState<string>(() => {
    return localStorage.getItem(RUNNER_NAME_KEY) ?? '';
  });

  const setRunnerName = useCallback((name: string) => {
    localStorage.setItem(RUNNER_NAME_KEY, name);
    setRunnerNameState(name);
  }, []);

  return { runnerName, setRunnerName };
}

export function useUserProfile() {
  const [profile, setProfileState] = useState<UserProfile>(() => {
    try {
      const raw = localStorage.getItem(USER_PROFILE_KEY);
      if (raw) return JSON.parse(raw) as UserProfile;
    } catch {}
    const name = localStorage.getItem(RUNNER_NAME_KEY) ?? '';
    return { displayName: name, bio: '', stravaUrl: '', instagramUrl: '', xUrl: '' };
  });

  const setProfile = useCallback((p: UserProfile) => {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(p));
    localStorage.setItem(RUNNER_NAME_KEY, p.displayName);
    setProfileState(p);
  }, []);

  return { profile, setProfile };
}

export function getPBRecords(records: RaceRecord[]): Record<RaceCategory, RaceRecord | undefined> {
  const pb: Partial<Record<RaceCategory, RaceRecord>> = {};
  for (const record of records) {
    const totalSeconds =
      record.hours * 3600 + record.minutes * 60 + record.seconds;
    const existing = pb[record.category];
    if (!existing) {
      pb[record.category] = record;
    } else {
      const existingSeconds =
        existing.hours * 3600 + existing.minutes * 60 + existing.seconds;
      if (totalSeconds < existingSeconds) {
        pb[record.category] = record;
      }
    }
  }
  return pb as Record<RaceCategory, RaceRecord | undefined>;
}

export function isPB(record: RaceRecord, records: RaceRecord[]): boolean {
  const pb = getPBRecords(records);
  return pb[record.category]?.id === record.id;
}
