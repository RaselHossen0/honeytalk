/** API-ready types for SMS Management */

export interface SmsInterface {
  id: number;
  number: number;
  interfaceName: string;
  categoryName: string;
  smsInterface: string;
  account: string;
  smsInterfaceType: string;
  password: string;
  description: string;
  status: 'Valid' | 'Invalid';
}

export interface SmsInterfacePayload {
  interfaceName: string;
  categoryName: string;
  smsInterface: string;
  account: string;
  smsInterfaceType: string;
  password: string;
  description: string;
  status?: 'Valid' | 'Invalid';
}

export interface SystemMessage {
  id: number;
  number: number;
  content: string;
  sender: string;
  time: string;
  status: 'Send successfully' | 'Not sent';
  sendingMethod: string;
}

export interface SystemMessagePayload {
  content: string;
  sender: string;
  sendingMethod: string;
}

export interface BusinessQueueItem {
  id: number;
  number: number;
  type: string;
  recipient: string;
  userId: string;
  title: string;
  content: string;
  verificationCode: string;
  creationTime: string;
  time: string;
  status?: string;
  result?: string;
  logInformation?: string;
}
