/**
 * Article API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type { Article, ArticlePayload } from '@/types/article';

const DEMO_ARTICLES: Article[] = [
  { id: 1, number: 55, articleTitle: 'Level', category: 'Level', status: 'Valid', content: '', creationTime: '2025-10-31 10:07:01', updateTime: '2024-06-13 08:58:23', sort: 0, clickCount: 0 },
  { id: 2, number: 54, articleTitle: 'Withdrawal agreement', category: 'Withdrawal agreement', status: 'Valid', content: '', creationTime: '2025-10-30 14:22:00', updateTime: '2024-06-12 09:15:00', sort: 0, clickCount: 0 },
  { id: 3, number: 53, articleTitle: 'Platform User Agreement', category: 'Platform User Agreement', status: 'Valid', content: '', creationTime: '2025-10-28 09:00:00', updateTime: '2024-06-10 11:30:00', sort: 0, clickCount: 0 },
  { id: 4, number: 52, articleTitle: 'Privacy policy', category: 'Privacy policy', status: 'Valid', content: '', creationTime: '2025-10-25 16:45:00', updateTime: '2024-06-08 14:20:00', sort: 0, clickCount: 0 },
  { id: 5, number: 51, articleTitle: 'Terms of service', category: 'Terms of service', status: 'Invalid', content: '', creationTime: '2025-10-20 11:00:00', updateTime: '2024-06-05 10:00:00', sort: 0, clickCount: 0 },
];

let articlesData = [...DEMO_ARTICLES];
let articlesRecycleData: Article[] = [];

export async function fetchArticleCategoryOptions(): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 100));
  const names = Array.from(new Set(articlesData.map((r) => r.category)));
  return names.sort();
}

export async function fetchArticles(page = 1, perPage = 10, filters?: { category?: string; name?: string }): Promise<{ data: Article[]; total: number }> {
  await new Promise((r) => setTimeout(r, 200));
  let filtered = [...articlesData];
  if (filters?.category && filters.category !== 'All') {
    filtered = filtered.filter((r) => r.category === filters.category);
  }
  if (filters?.name?.trim()) {
    const q = filters.name.toLowerCase();
    filtered = filtered.filter((r) => r.articleTitle.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  }
  const total = filtered.length;
  const start = (page - 1) * perPage;
  const data = filtered.slice(start, start + perPage);
  return { data, total };
}

export async function createArticle(payload: ArticlePayload): Promise<Article> {
  await new Promise((r) => setTimeout(r, 200));
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const maxNum = Math.max(0, ...articlesData.map((r) => r.number));
  const newItem: Article = {
    id: 100 + articlesData.length,
    number: maxNum + 1,
    articleTitle: payload.articleTitle,
    category: payload.category,
    status: payload.status ?? 'Valid',
    content: payload.content ?? '',
    creationTime: now,
    updateTime: now,
    sort: payload.sort ?? 0,
    clickCount: 0,
  };
  articlesData.push(newItem);
  return newItem;
}

export async function updateArticle(id: number, payload: Partial<ArticlePayload>): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  articlesData = articlesData.map((r) =>
    r.id === id ? { ...r, ...payload, updateTime: now } : r
  );
}

export async function deleteArticle(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  const item = articlesData.find((r) => r.id === id);
  if (item) {
    articlesData = articlesData.filter((r) => r.id !== id);
    articlesRecycleData.push(item);
  }
}

export async function batchDeleteArticles(ids: number[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  const items = articlesData.filter((r) => ids.includes(r.id));
  articlesData = articlesData.filter((r) => !ids.includes(r.id));
  articlesRecycleData.push(...items);
}

// Article Recycle Bin
export async function fetchArticleRecycleBin(page = 1, perPage = 10): Promise<{ data: Article[]; total: number }> {
  await new Promise((r) => setTimeout(r, 200));
  const total = articlesRecycleData.length;
  const start = (page - 1) * perPage;
  const data = articlesRecycleData.slice(start, start + perPage);
  return { data, total };
}

export async function restoreArticle(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  const item = articlesRecycleData.find((r) => r.id === id);
  if (item) {
    articlesRecycleData = articlesRecycleData.filter((r) => r.id !== id);
    articlesData.push(item);
  }
}

export async function batchRestoreArticles(ids: number[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  const items = articlesRecycleData.filter((r) => ids.includes(r.id));
  articlesRecycleData = articlesRecycleData.filter((r) => !ids.includes(r.id));
  articlesData.push(...items);
}

export async function permanentDeleteArticle(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  articlesRecycleData = articlesRecycleData.filter((r) => r.id !== id);
}

export async function batchPermanentDeleteArticles(ids: number[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  articlesRecycleData = articlesRecycleData.filter((r) => !ids.includes(r.id));
}
