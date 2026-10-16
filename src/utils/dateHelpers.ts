export const calculateDurationInHours = (bedtime: Date, wakeTime: Date): number => {
  let diffMs = wakeTime.getTime() - bedtime.getTime();
  // If wake time is set before bedtime, assume it's next day
  if (diffMs < 0) {
    diffMs += 24 * 60 * 60 * 1000;
  }
  return Number((diffMs / (1000 * 60 * 60)).toFixed(1));
};

/** Converts sleep duration into a configurable 1–5 hour-based score. */
export const calculateSleepRating = (
  durationHours: number,
  minimumHours = 4,
  hoursPerAdditionalStar = 1.5,
): number => {
  if (!Number.isFinite(durationHours) || durationHours <= 0) return 1;
  if (!Number.isFinite(minimumHours) || !Number.isFinite(hoursPerAdditionalStar) || hoursPerAdditionalStar <= 0) return 1;
  return Math.min(5, Math.max(1, Math.floor((durationHours - minimumHours) / hoursPerAdditionalStar) + 1));
};

export const formatTime = (isoString: string): string => {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString([], { month: 'short', day: 'numeric' });
};
