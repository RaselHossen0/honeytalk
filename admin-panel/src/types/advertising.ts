/** API-ready types for Advertising Configuration */

export interface AdvertisingConfig {
  id: string | number;
  number: number;
  title: string;
  imageUrl?: string;
  displayPosition: string;
  type: string;
  sort: number;
}

export interface AdvertisingConfigCreate {
  title: string;
  imageUrl?: string;
  displayPosition: string;
  type: string;
  sort: number;
}

export interface AdvertisingConfigUpdate extends Partial<AdvertisingConfigCreate> {}
