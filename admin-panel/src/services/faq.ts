/**
 * FAQ API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type { FaqItem, FaqPayload, FaqGroup } from '@/types/faq';

const FAQ_GROUPS: FaqGroup[] = ['Account', 'Frequent', 'Livestream', 'Recharge', 'Report'];

const DEMO_FAQS: FaqItem[] = [
  { id: 1, number: 6, group: 'Account', question: 'Why did my face authentication fail?', answer: 'Please ensure good lighting and your face is clearly visible.', frontEndDisplay: 'Yes', sort: 12, status: 'Valid' },
  { id: 2, number: 7, group: 'Frequent', question: 'How to become an agent?', answer: 'Apply through the agent registration portal.', frontEndDisplay: 'Yes', sort: 0, status: 'Valid' },
  { id: 3, number: 8, group: 'Livestream', question: 'How to start a live stream?', answer: 'Tap the live button and follow the setup steps.', frontEndDisplay: 'Yes', sort: 6, status: 'Valid' },
  { id: 4, number: 9, group: 'Recharge', question: 'How to recharge my account?', answer: 'Go to Wallet and select your preferred payment method.', frontEndDisplay: 'Yes', sort: 5, status: 'Valid' },
  { id: 5, number: 10, group: 'Report', question: 'How to report inappropriate content?', answer: 'Use the report button on the content or profile.', frontEndDisplay: 'Yes', sort: 3, status: 'Valid' },
];

let faqData = [...DEMO_FAQS];

export { FAQ_GROUPS };

export async function fetchFaqs(page = 1, perPage = 10, filters?: { group?: string; question?: string }): Promise<{ data: FaqItem[]; total: number }> {
  await new Promise((r) => setTimeout(r, 200));
  let filtered = [...faqData];
  if (filters?.group && filters.group !== 'All') {
    filtered = filtered.filter((r) => r.group === filters.group);
  }
  if (filters?.question?.trim()) {
    const q = filters.question.toLowerCase();
    filtered = filtered.filter((r) => r.question.toLowerCase().includes(q) || r.answer.toLowerCase().includes(q));
  }
  const total = filtered.length;
  const start = (page - 1) * perPage;
  const data = filtered.slice(start, start + perPage);
  return { data, total };
}

export async function createFaq(payload: FaqPayload): Promise<FaqItem> {
  await new Promise((r) => setTimeout(r, 200));
  const maxNum = Math.max(0, ...faqData.map((r) => r.number));
  const newItem: FaqItem = {
    id: 100 + faqData.length,
    number: maxNum + 1,
    group: payload.group,
    question: payload.question,
    answer: payload.answer,
    imageUrl: payload.imageUrl,
    frontEndDisplay: payload.frontEndDisplay ?? 'Yes',
    sort: payload.sort ?? 0,
    status: 'Valid',
  };
  faqData.push(newItem);
  return newItem;
}

export async function updateFaq(id: number, payload: Partial<FaqPayload>): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  faqData = faqData.map((r) => (r.id === id ? { ...r, ...payload } : r));
}

export async function deleteFaq(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  faqData = faqData.filter((r) => r.id !== id);
}

export async function batchDeleteFaqs(ids: number[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  faqData = faqData.filter((r) => !ids.includes(r.id));
}
