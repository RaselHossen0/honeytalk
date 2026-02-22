/** API-ready types for Room background cover */

export interface RoomBackground {
  id: string | number;
  number: number;
  title: string;
  imageUrl: string;
  status: 'Valid' | 'Invalid' | string;
  sort: number;
}
