/** Plugin Management types */

export interface PluginConfig {
  id: number;
  number: number;
  name: string;
  iconUrl: string;
  status: 'Valid' | 'Invalid';
  sort: number;
}
