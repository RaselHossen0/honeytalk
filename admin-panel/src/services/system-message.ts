/**
 * System Message Management API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type { SystemMessage, SystemMessageFilters } from '@/types/system-message';

const ENDPOINT = '/users/system-messages';

const DEMO_ROWS: SystemMessage[] = [
  {
    id: 687,
    title: 'Agent recharge',
    content: 'Agent recharge:100000',
    type: 'Text',
    releaseTime: '2025-12-17 14:16:22',
    userId: '168422',
  },
  {
    id: 686,
    title: 'aaa',
    content: 'bbb',
    type: 'Text',
    releaseTime: '2025-12-17 14:16:00',
    userId: '168422',
  },
  {
    id: 685,
    title: 'Joining Guild successfuly',
    content: 'Congratulations, you have successfully joined the guild. Welcome aboard!',
    type: 'Rich text',
    releaseTime: '2025-12-17 14:15:38',
    userId: 'all',
  },
  {
    id: 684,
    title: 'System maintenance',
    content: 'Scheduled maintenance will occur tonight from 2am to 4am.',
    type: 'Text',
    link: 'qwcd',
    releaseTime: '2025-12-16 09:30:00',
    userId: 'all',
  },
  {
    id: 683,
    title: 'New feature release',
    content: 'We have released a new live streaming feature. Check it out!',
    type: 'Rich text',
    releaseTime: '2025-12-16 08:00:15',
    userId: '168422',
  },
  {
    id: 682,
    title: 'Promotion alert',
    content: 'Limited time offer: 50% off on premium gifts.',
    type: 'Text',
    releaseTime: '2025-12-15 18:22:45',
    userId: 'all',
  },
  {
    id: 681,
    title: 'Welcome message',
    content: 'Welcome to the platform. Complete your profile to get started.',
    type: 'Text',
    releaseTime: '2025-12-15 12:00:00',
    userId: '168500',
  },
  {
    id: 680,
    title: 'Payment confirmation',
    content: 'Your payment of 100 coins has been processed successfully.',
    type: 'Text',
    releaseTime: '2025-12-14 20:15:30',
    userId: '168422',
  },
  {
    id: 679,
    title: 'Level up reward',
    content: 'Congratulations! You have reached Level 10. Claim your reward now.',
    type: 'Rich text',
    releaseTime: '2025-12-14 16:45:22',
    userId: '168600',
  },
];

export async function fetchSystemMessages(
  filters?: SystemMessageFilters,
  page = 1,
  perPage = 10
): Promise<{ data: SystemMessage[]; total: number }> {
  // TODO: return api.get<{ data: SystemMessage[]; total: number }>(`${ENDPOINT}?page=${page}&perPage=${perPage}`, token)
  await new Promise((r) => setTimeout(r, 300));

  let data = [...DEMO_ROWS];
  if (filters?.userId) {
    data = data.filter((r) => r.userId.toLowerCase().includes(filters.userId!.toLowerCase()));
  }
  if (filters?.dateStart) {
    data = data.filter((r) => r.releaseTime >= `${filters.dateStart} 00:00:00`);
  }
  if (filters?.dateEnd) {
    data = data.filter((r) => r.releaseTime <= `${filters.dateEnd} 23:59:59`);
  }

  const total = data.length;
  const start = (page - 1) * perPage;
  return { data: data.slice(start, start + perPage), total };
}

export async function deleteSystemMessage(id: number): Promise<void> {
  // TODO: return api.delete(`${ENDPOINT}/${id}`)
  await new Promise((r) => setTimeout(r, 200));
}
