/** Agent Recharge Management API-ready types */

export interface AgentAccount {
  id: number;
  userId: number;
  userNickname: string;
  phoneNumber: string;
  accountBalance: number;
  totalRevenue: number;
  consumptionAmount: number;
  numberOfBuyers: number;
  country: string;
  certification: string;
  platform: string;
  invitationCode: string;
  level: string;
  status: string;
  superiorId: number;
  superiorName: string;
  registrationTime: string;
  updateTime: string;
}

export interface AgentRechargeRecord {
  id: number;
  agentId: number;
  agentName: string;
  receivingAccount: number;
  accountBalance: number;
  note: string;
  superiorId: number;
  superiorName: string;
  registrationTime: string;
}

export interface AgentSalesRecord {
  id: number;
  userNickname: string;
  agentId: number;
  agentName: string;
  receivingAccount: number;
  accountBalance: number;
  note: string;
  registrationTime: string;
}

export interface AgentInvitationRecord {
  id: number;
  userId: number;
  userNickname: string;
  agentId: number;
  agentName: string;
  registrationTime: string;
}
