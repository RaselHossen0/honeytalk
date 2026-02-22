/** Fund Management API-ready types */

export type PaymentType = 'Offline payment' | 'Online Payment' | 'WAP payment' | 'App payment';

export interface PaymentInterface {
  id: number;
  number: number;
  name: string;
  displayName?: string;
  categoryName: string;
  status: string;
  receivedPayment: number;
  automaticWithdrawal: 'Yes' | 'No';
  withdrawalPaymentAccount: string;
  paymentType: PaymentType;
  imageUrl: string;
  description: string;
  sort: number;
}

export interface RechargeRecord {
  id: number;
  number: number;
  userId: number;
  userNickname: string;
  paymentOrderNumber: string;
  projectName: string;
  externalOrderNumber: string;
  paymentMethod: string;
  creationTime: string;
  paymentTime: string;
  amount: string;
  whetherPaid: 'Yes' | 'No';
}

export interface Bank {
  id: number;
  number: number;
  bankName: string;
  bankAbbreviation: string;
  bankCode: string;
  status: string;
  sort: number;
  addTime: string;
}

export interface Withdrawal {
  id: number;
  number: number;
  anchorId: number;
  anchorNickname: string;
  accountType: string;
  bankAccountNumber: string;
  accountName: string;
  amount: number;
  coin: number;
  applicationTime: string;
  applicationNote: string;
  whetherToReview: 'Yes' | 'No';
  confirmPaymentTime: string;
  operationNotes: string;
  businessOrderNumber: string;
  paymentNotes: string;
  status: string;
}

export interface InviteUserWithdrawal {
  id: number;
  userId: number;
  userNickname: string;
  amount: number;
  coin: number;
  accountType: string;
  bankAccountNumber: string;
  paymentName: string;
  status: string;
  applicationTime: string;
}

export interface RechargeStatisticsRecord {
  id: number;
  userId: number;
  userNickname: string;
  amount: number;
  lastRechargeTime: string;
  whetherPaid: 'Yes' | 'No';
}

export interface WithdrawalStatisticsRecord {
  id: number;
  userId: number;
  userNickname: string;
  amount: number;
  coin: number;
  lastWithdrawalTime: string;
  whetherToReview: 'Yes' | 'No';
}

export interface AnchorDailyReportRecord {
  id: number;
  number: number;
  time: string;
  userNickname: string;
  guild: string;
  liveStreamingDuration: string;
  totalRevenue: string | number;
  valid: number;
}

export interface MonthlyReportRecord {
  id: number;
  time: string;
  userNickname: string;
  guild: string;
  liveStreamingDuration: string;
  totalRevenue: number;
  valid: number;
}

export interface ManualRechargeRecord {
  id: number;
  number: number;
  userId: number;
  userNickname: string;
  numberOfChanges: string;
  changeAmount: number;
  accountBalance: string;
  accountLog: string;
  ip: string;
  operator: string;
  addTime: string;
}
