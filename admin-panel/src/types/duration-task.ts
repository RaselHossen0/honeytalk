/** API-ready types for Live Video Duration Task */

export interface DurationTask {
  id: string | number;
  number: number;
  title: string;
  reward: string | number;
  videoDurationMinutes: number;
  status: 'Valid' | 'Invalid' | string;
}
