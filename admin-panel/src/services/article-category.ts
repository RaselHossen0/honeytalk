/**
 * Article Category API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type { ArticleCategory, ArticleCategoryPayload } from '@/types/article-category';

const DEMO_CATEGORIES: ArticleCategory[] = [
  { id: 1, number: 38, categoryName: 'Withdrawal agreement', articleType: 'Regular article', status: 'Valid', sort: 17 },
  { id: 2, number: 37, categoryName: 'Cancellation agreement', articleType: 'Regular article', status: 'Valid', sort: 16 },
  { id: 3, number: 36, categoryName: 'Platform User Agreement', articleType: 'Regular article', status: 'Valid', sort: 15 },
  { id: 4, number: 35, categoryName: 'Compliance policy', articleType: 'Regular article', status: 'Invalid', sort: 14 },
  { id: 5, number: 34, categoryName: 'Teen Mode', articleType: 'Regular article', status: 'Valid', sort: 13 },
  { id: 6, number: 33, categoryName: '公告01', articleType: 'Announcement article', status: 'Valid', sort: 12 },
  { id: 7, number: 32, categoryName: 'Invite reward', articleType: 'Regular article', status: 'Valid', sort: 11 },
  { id: 8, number: 31, categoryName: 'News bulletin', articleType: 'News announcement', status: 'Valid', sort: 10 },
  { id: 9, number: 30, categoryName: 'Community convention', articleType: 'Regular article', status: 'Valid', sort: 9 },
  { id: 10, number: 29, categoryName: 'Anchor agreement', articleType: 'Regular article', status: 'Valid', sort: 8 },
  { id: 11, number: 28, categoryName: 'Privacy policy', articleType: 'Regular article', status: 'Valid', sort: 7 },
  { id: 12, number: 27, categoryName: 'Terms of service', articleType: 'Regular article', status: 'Valid', sort: 6 },
  { id: 13, number: 8, categoryName: 'Guidelines', articleType: 'Announcement article', status: 'Valid', sort: 5 },
];

let categoriesData = [...DEMO_CATEGORIES];
let categoriesRecycleData: ArticleCategory[] = [];

export async function fetchArticleCategories(page = 1, perPage = 10): Promise<{ data: ArticleCategory[]; total: number }> {
  await new Promise((r) => setTimeout(r, 200));
  const total = categoriesData.length;
  const start = (page - 1) * perPage;
  const data = categoriesData.slice(start, start + perPage);
  return { data, total };
}

export async function createArticleCategory(payload: ArticleCategoryPayload): Promise<ArticleCategory> {
  await new Promise((r) => setTimeout(r, 200));
  const maxNum = Math.max(0, ...categoriesData.map((r) => r.number));
  const newItem: ArticleCategory = {
    id: 100 + categoriesData.length,
    number: maxNum + 1,
    categoryName: payload.categoryName,
    articleType: payload.articleType,
    status: payload.status ?? 'Valid',
    sort: payload.sort ?? 0,
  };
  categoriesData.push(newItem);
  return newItem;
}

export async function updateArticleCategory(id: number, payload: Partial<ArticleCategoryPayload>): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  categoriesData = categoriesData.map((r) => (r.id === id ? { ...r, ...payload } : r));
}

export async function deleteArticleCategory(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  const item = categoriesData.find((r) => r.id === id);
  if (item) {
    categoriesData = categoriesData.filter((r) => r.id !== id);
    categoriesRecycleData.push(item);
  }
}

export async function batchDeleteArticleCategories(ids: number[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  const items = categoriesData.filter((r) => ids.includes(r.id));
  categoriesData = categoriesData.filter((r) => !ids.includes(r.id));
  categoriesRecycleData.push(...items);
}

// Category Recycle Bin
export async function fetchCategoryRecycleBin(page = 1, perPage = 10): Promise<{ data: ArticleCategory[]; total: number }> {
  await new Promise((r) => setTimeout(r, 200));
  const total = categoriesRecycleData.length;
  const start = (page - 1) * perPage;
  const data = categoriesRecycleData.slice(start, start + perPage);
  return { data, total };
}

export async function restoreCategory(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  const item = categoriesRecycleData.find((r) => r.id === id);
  if (item) {
    categoriesRecycleData = categoriesRecycleData.filter((r) => r.id !== id);
    categoriesData.push(item);
  }
}

export async function batchRestoreCategories(ids: number[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  const items = categoriesRecycleData.filter((r) => ids.includes(r.id));
  categoriesRecycleData = categoriesRecycleData.filter((r) => !ids.includes(r.id));
  categoriesData.push(...items);
}

export async function permanentDeleteCategory(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  categoriesRecycleData = categoriesRecycleData.filter((r) => r.id !== id);
}

export async function batchPermanentDeleteCategories(ids: number[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  categoriesRecycleData = categoriesRecycleData.filter((r) => !ids.includes(r.id));
}
