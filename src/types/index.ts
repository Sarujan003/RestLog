export interface SleepEntry {
  id: string;
  bedtime: string; // ISO string
  wakeTime: string; // ISO string
  durationHours: number; // e.g. 7.5
  rating: number; // 1 to 5
  note?: string;
  createdAt: string; // ISO string
}