/** Version Management API-ready types */

export interface AppVersion {
  id: number;
  number: number;
  versionNumber: string;
  versionContent: string;
  downloadAddress: string;
  platform: 'Android' | 'iOS';
  forceUpdate: 'Yes' | 'No';
  whetherToPublish: 'Yes' | 'No';
  time: string;
}
