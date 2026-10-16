import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SleepEntry } from '../types';

const STORAGE_KEY = '@restlog_entries';
const SETTINGS_STORAGE_KEY = '@restlog_settings';

export interface RatingSettings {
  minimumHours: number;
  hoursPerAdditionalStar: number;
}

export const DEFAULT_RATING_SETTINGS: RatingSettings = {
  minimumHours: 4,
  hoursPerAdditionalStar: 1.5,
};

interface SleepContextType {
  entries: SleepEntry[];
  addEntry: (entry: Omit<SleepEntry, 'id' | 'createdAt'>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  loading: boolean;
  ratingSettings: RatingSettings;
  updateRatingSettings: (settings: RatingSettings) => Promise<void>;
}

const SleepContext = createContext<SleepContextType | undefined>(undefined);

export const SleepProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingSettings, setRatingSettings] = useState<RatingSettings>(DEFAULT_RATING_SETTINGS);

  // Load persisted entries on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setEntries(JSON.parse(stored));
        }
        const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings) as Partial<RatingSettings>;
          if (Number.isFinite(parsed.minimumHours) && Number.isFinite(parsed.hoursPerAdditionalStar) && (parsed.hoursPerAdditionalStar ?? 0) > 0) {
            setRatingSettings({ minimumHours: parsed.minimumHours!, hoursPerAdditionalStar: parsed.hoursPerAdditionalStar! });
          }
        }
      } catch (e) {
        console.error('Failed to load logs', e);
      } finally {
        setLoading(false);
      }
    };
    loadEntries();
  }, []);

  // Save entry
  const addEntry = async (data: Omit<SleepEntry, 'id' | 'createdAt'>) => {
    const newEntry: SleepEntry = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Delete entry
  const deleteEntry = async (id: string) => {
    const updated = entries.filter((item) => item.id !== id);
    setEntries(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const updateRatingSettings = async (settings: RatingSettings) => {
    setRatingSettings(settings);
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  };

  return (
    <SleepContext.Provider value={{ entries, addEntry, deleteEntry, loading, ratingSettings, updateRatingSettings }}>
      {children}
    </SleepContext.Provider>
  );
};

export const useSleep = () => {
  const context = useContext(SleepContext);
  if (!context) throw new Error('useSleep must be used within SleepProvider');
  return context;
};
