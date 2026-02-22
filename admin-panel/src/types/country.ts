/** API-ready types for Country management */

export interface Country {
  id: string | number;
  number: number;
  name: string;
  imageUrl: string;
  countryCode: number;
  displaySearch: boolean;
  sort: number;
  addTime: string;
}
