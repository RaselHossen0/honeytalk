/** API-ready types for Popular countries */

export interface PopularCountry {
  id: string | number;
  number: number;
  groupName: string;
  /** Single image URL or comma-separated for multiple flags */
  imageUrls: string[];
  sort: number;
  addTime: string;
}
