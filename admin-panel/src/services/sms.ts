/**
 * SMS Management API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type {
  SmsInterface,
  SmsInterfacePayload,
  SystemMessage,
  SystemMessagePayload,
  BusinessQueueItem,
} from '@/types/sms';

const INTERFACES_ENDPOINT = '/api/sms/interfaces';
const MESSAGES_ENDPOINT = '/api/sms/messages';
const BUSINESS_QUEUE_ENDPOINT = '/api/sms/business-queue';

const DEMO_INTERFACES: SmsInterface[] = [
  { id: 1, number: 17, interfaceName: 'AliCloud SMS', description: '', status: 'Valid' },
  { id: 2, number: 19, interfaceName: 'Vonage SMS', description: 'https://www.vonage.com', status: 'Invalid' },
  { id: 3, number: 21, interfaceName: 'ENGAGES_SMS', description: 'https://www.engagelab.com/', status: 'Valid' },
  { id: 4, number: 22, interfaceName: 'ENGAGES_OTP', description: 'https://www.engagelab.com/', status: 'Valid' },
];

const DEMO_MESSAGES: SystemMessage[] = [
  { id: 1, number: 79, content: 'Welcome MR Himo', sender: '166593', time: '2025-11-01 02:58:29', status: 'Send successfully', sendingMethod: 'All anchors.' },
  { id: 2, number: 80, content: 'Bigo live OFFICIA', sender: '166593', time: '2025-11-01 02:55:10', status: 'Not sent', sendingMethod: 'Group' },
  { id: 3, number: 81, content: 'ترحب بمستخدميها الجدد وتتمنى لهم قضاء وقت ممتع على Bigo live منصة ي البرنامج كونو في الموعد', sender: '166589', time: '2025-10-28 14:22:00', status: 'Send successfully', sendingMethod: 'Customized anchor' },
  { id: 4, number: 82, content: 'Thank you for joining our platform', sender: '166586', time: '2025-10-25 09:15:33', status: 'Send successfully', sendingMethod: 'All anchors.' },
  { id: 5, number: 83, content: 'System maintenance scheduled', sender: '0', time: '2025-10-20 18:00:00', status: 'Not sent', sendingMethod: 'Group' },
  { id: 6, number: 84, content: 'New features available', sender: '166593', time: '2025-10-15 11:30:00', status: 'Send successfully', sendingMethod: 'Customized anchor' },
  { id: 7, number: 85, content: 'Welcome to the community', sender: '166600', time: '2025-10-10 08:45:22', status: 'Send successfully', sendingMethod: 'All anchors.' },
  { id: 8, number: 86, content: 'Your verification code is 123456', sender: '0', time: '2025-10-05 16:20:00', status: 'Not sent', sendingMethod: 'Group' },
  { id: 9, number: 87, content: 'Event reminder', sender: '166789', time: '2025-10-01 12:00:00', status: 'Send successfully', sendingMethod: 'Customized anchor' },
  { id: 10, number: 88, content: 'Promotional offer', sender: '167001', time: '2025-09-28 10:15:00', status: 'Send successfully', sendingMethod: 'All anchors.' },
];

const DEMO_QUEUE: BusinessQueueItem[] = [
  { id: 1, number: 13395, type: 'SMS', recipient: '860****3628', userId: '0', title: 'SMS verification code', content: 'View', verificationCode: '888888', creationTime: '2026-02-17 21:39:20', status: 'Yes', result: 'Failure', logInformation: '测试发送' },
  { id: 2, number: 13394, type: 'SMS', recipient: '860****3629', userId: '0', title: 'SMS verification code', content: 'View', verificationCode: '888888', creationTime: '2026-02-17 21:38:15', status: 'Yes', result: 'Failure', logInformation: '测试发送' },
  { id: 3, number: 13393, type: 'SMS', recipient: '861****1234', userId: '0', title: 'SMS verification code', content: 'View', verificationCode: '123456', creationTime: '2026-02-17 21:37:00', status: 'Yes', result: 'Success', logInformation: 'Sent' },
  { id: 4, number: 13392, type: 'SMS', recipient: '919****5678', userId: '166593', title: 'SMS verification code', content: 'View', verificationCode: '888888', creationTime: '2026-02-17 21:36:45', status: 'Yes', result: 'Failure', logInformation: '测试发送' },
  { id: 5, number: 13391, type: 'SMS', recipient: '1***5551234', userId: '0', title: 'SMS verification code', content: 'View', verificationCode: '654321', creationTime: '2026-02-17 21:35:30', status: 'Yes', result: 'Success', logInformation: 'Sent' },
];

let interfacesData = [...DEMO_INTERFACES];
let messagesData = [...DEMO_MESSAGES];
let queueData = [...DEMO_QUEUE];

// SMS Interfaces
export async function fetchSmsInterfaces(): Promise<SmsInterface[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...interfacesData];
}

export async function createSmsInterface(payload: SmsInterfacePayload): Promise<SmsInterface> {
  await new Promise((r) => setTimeout(r, 200));
  const maxNum = Math.max(0, ...interfacesData.map((r) => r.number));
  const newItem: SmsInterface = {
    id: 100 + interfacesData.length,
    number: maxNum + 1,
    interfaceName: payload.interfaceName,
    description: payload.description,
    status: payload.status ?? 'Valid',
  };
  interfacesData.push(newItem);
  return newItem;
}

export async function updateSmsInterface(id: number, payload: Partial<SmsInterfacePayload>): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  interfacesData = interfacesData.map((r) => (r.id === id ? { ...r, ...payload } : r));
}

export async function deleteSmsInterface(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  interfacesData = interfacesData.filter((r) => r.id !== id);
}

export async function batchDeleteSmsInterfaces(ids: number[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  interfacesData = interfacesData.filter((r) => !ids.includes(r.id));
}

// System Messages
export async function fetchSystemMessages(page = 1, perPage = 10): Promise<{ data: SystemMessage[]; total: number }> {
  await new Promise((r) => setTimeout(r, 200));
  const total = 50;
  const start = (page - 1) * perPage;
  const slice = messagesData.slice(start, start + perPage);
  return { data: slice, total };
}

export async function createSystemMessage(payload: SystemMessagePayload): Promise<SystemMessage> {
  await new Promise((r) => setTimeout(r, 200));
  const maxNum = Math.max(0, ...messagesData.map((r) => r.number));
  const newItem: SystemMessage = {
    id: 200 + messagesData.length,
    number: maxNum + 1,
    content: payload.content,
    sender: payload.sender,
    time: new Date().toISOString().replace('T', ' ').slice(0, 19),
    status: 'Not sent',
    sendingMethod: payload.sendingMethod,
  };
  messagesData.push(newItem);
  return newItem;
}

export async function deleteSystemMessage(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  messagesData = messagesData.filter((r) => r.id !== id);
}

export async function batchDeleteSystemMessages(ids: number[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  messagesData = messagesData.filter((r) => !ids.includes(r.id));
}

// Business Queue
export async function fetchBusinessQueue(page = 1, perPage = 10): Promise<{ data: BusinessQueueItem[]; total: number }> {
  await new Promise((r) => setTimeout(r, 200));
  const total = 8795;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  // Demo: pad with generated rows for pagination
  const base = queueData[0] ?? DEMO_QUEUE[0];
  const data: BusinessQueueItem[] = [];
  for (let i = start; i < end; i++) {
    if (i < queueData.length) {
      data.push(queueData[i]);
    } else {
      data.push({
        ...base,
        id: 10000 + i,
        number: 13395 - i,
        creationTime: new Date(Date.now() - i * 60000).toISOString().replace('T', ' ').slice(0, 19),
      });
    }
  }
  return { data, total };
}

export async function sendBusinessQueueItem(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}

export async function deleteBusinessQueueItem(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  queueData = queueData.filter((r) => r.id !== id);
}

export async function batchDeleteBusinessQueue(ids: number[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  queueData = queueData.filter((r) => !ids.includes(r.id));
}
