/** API-ready types for System Operation Logs */

export interface OperationLog {
  id: string | number;
  number: number;
  logInformation: string;
  addTime: string;
  ip: string;
  systemAdministrator: string;
  result: 'Success' | 'Failed';
  module: string;
  /** API field name may be "function" - mapped to action for JS compatibility */
  action: string;
}
