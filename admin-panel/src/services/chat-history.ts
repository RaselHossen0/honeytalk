/**
 * Chat History API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type { ChatRecord, ChatHistoryFilters, SessionMessage } from '@/types/chat-history';

const ENDPOINT = '/users/chat-history';

const DEMO_ROWS: Omit<ChatRecord, 'number'>[] = [
  { id: 1, sendUserId: 168748, sendUserNickname: '『BS』DOLL G☺ツ', receiveUserId: 166596, receiveUserNickname: '', contentType: 'text', content: 'hloo', addTime: '2026-02-06 16:45:22' },
  { id: 2, sendUserId: 166593, sendUserNickname: '', receiveUserId: 167186, receiveUserNickname: 'Bogo167186????????11', contentType: 'audio', content: '', addTime: '2026-02-06 16:42:18' },
  { id: 3, sendUserId: 167186, sendUserNickname: 'Bogo167186????????11', receiveUserId: 166593, receiveUserNickname: '', contentType: 'audio', content: '', addTime: '2026-02-05 15:50:33' },
  { id: 4, sendUserId: 168712, sendUserNickname: 'Heart beat', receiveUserId: 166586, receiveUserNickname: 'DOLLAR', contentType: 'audio', content: '', addTime: '2026-02-05 14:20:10' },
  { id: 5, sendUserId: 166586, sendUserNickname: 'DOLLAR', receiveUserId: 168712, receiveUserNickname: 'Heart beat', contentType: 'text', content: 'Hello!', addTime: '2026-02-04 17:50:42' },
  { id: 6, sendUserId: 166630, sendUserNickname: 'viya', receiveUserId: 166968, receiveUserNickname: 'Mr_Rahu 🌍', contentType: 'audio', content: '', addTime: '2026-02-04 15:30:00' },
  { id: 7, sendUserId: 166968, sendUserNickname: 'Mr_Rahu 🌍', receiveUserId: 166630, receiveUserNickname: 'viya', contentType: 'text', content: 'Thanks!', addTime: '2026-02-04 12:15:22' },
  { id: 8, sendUserId: 167081, sendUserNickname: 'Nasro', receiveUserId: 167132, receiveUserNickname: 'MR. Ǝ €lix00/', contentType: 'audio', content: '', addTime: '2026-02-03 18:45:10' },
  { id: 9, sendUserId: 167132, sendUserNickname: 'MR. Ǝ €lix00/', receiveUserId: 167081, receiveUserNickname: 'Nasro', contentType: 'audio', content: '', addTime: '2026-02-03 17:22:55' },
  { id: 10, sendUserId: 168690, sendUserNickname: 'Lucky Star', receiveUserId: 166977, receiveUserNickname: 'KING 🦙', contentType: 'text', content: 'See you tomorrow', addTime: '2026-02-03 16:10:00' },
];

const DEMO_SESSION_MESSAGES: SessionMessage[] = [
  { id: '1', type: 'audio', duration: '0:00' },
  { id: '2', type: 'audio', duration: '0:00' },
  { id: '3', type: 'text', content: '😊😊😊' },
  { id: '4', type: 'audio', duration: '0:00' },
  { id: '5', type: 'audio', duration: '0:00' },
];

export async function fetchChatRecords(
  filters?: ChatHistoryFilters,
  page = 1,
  perPage = 10
): Promise<{ data: ChatRecord[]; total: number }> {
  // TODO: return api.get<{ data: ChatRecord[]; total: number }>(...)
  await new Promise((r) => setTimeout(r, 300));

  let data = [...DEMO_ROWS];
  if (filters?.sendUserId) {
    data = data.filter((r) => String(r.sendUserId).includes(filters.sendUserId!));
  }
  if (filters?.receiveUserId) {
    data = data.filter((r) => String(r.receiveUserId).includes(filters.receiveUserId!));
  }
  if (filters?.userNickname) {
    const q = filters.userNickname.toLowerCase();
    data = data.filter(
      (r) =>
        r.sendUserNickname.toLowerCase().includes(q) ||
        r.receiveUserNickname.toLowerCase().includes(q)
    );
  }
  if (filters?.keyword) {
    const q = filters.keyword.toLowerCase();
    data = data.filter((r) => r.content.toLowerCase().includes(q));
  }
  if (filters?.type) {
    data = data.filter((r) => r.contentType === filters.type);
  }

  const total = data.length;
  const start = (page - 1) * perPage;
  const slice = data.slice(start, start + perPage);
  const withNumbers = slice.map((r, i) => ({ ...r, id: r.id, number: total - start - i }));

  return { data: withNumbers as ChatRecord[], total };
}

export async function fetchSessionRecords(
  sendUserId: number,
  receiveUserId: number,
  addTime: string
): Promise<SessionMessage[]> {
  // TODO: return api.get(`/users/chat-history/session?sendUserId=...&receiveUserId=...&addTime=...`)
  await new Promise((r) => setTimeout(r, 200));
  return [...DEMO_SESSION_MESSAGES];
}
