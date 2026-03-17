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
  | 'フルマラソン'
  | 'ハーフマラソン'
  | '10km'
  | '5km'
  | '3km'
  | 'その他';

export const RACE_CATEGORIES: RaceCategory[] = [
  'フルマラソン',
  'ハーフマラソン',
  '10km',
  '5km',
  '3km',
  'その他',
];
