export interface RaceRecord {
  id: string;
  category: RaceCategory;
  hours: number;
  minutes: number;
  seconds: number;
  raceName: string;
  date: string; // YYYY-MM-DD
  raceUrl?: string;
  memo?: string;
  createdAt: number; // Unix timestamp
}

export type RaceCategory =
  | 'フル'
  | 'ハーフ'
  | '10K'
  | '5K'
  | 'その他';

export const RACE_CATEGORIES: RaceCategory[] = [
  'フル',
  'ハーフ',
  '10K',
  '5K',
  'その他',
];
