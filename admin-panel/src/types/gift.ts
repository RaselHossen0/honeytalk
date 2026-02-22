/** API-ready types for Gift List (Prop Management) */

export interface Gift {
  id: string | number;
  number: number;
  name: string;
  imageUrl: string;
  points: number;
  diamond: number;
  coin: number;
  pushToAllChannels: 'Yes' | 'No';
  type: string;
  displayAnimation: string;
  status: 'Valid' | 'Invalid' | string;
  sort: number;
}
