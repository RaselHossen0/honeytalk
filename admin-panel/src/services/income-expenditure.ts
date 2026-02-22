/**
 * Income and Expenditure Records API service.
 * Replace demo data with actual api calls when backend is ready.
 */

import type { IncomeExpenditureRecord, IncomeExpenditureFilters } from '@/types/income-expenditure';
import { INCOME_EXPENDITURE_DEMO } from '@/lib/demo-data';

const ENDPOINT = '/users/income-expenditure';

export async function fetchIncomeExpenditureRecords(
  filters?: IncomeExpenditureFilters,
  page = 1,
  perPage = 10
): Promise<{ data: IncomeExpenditureRecord[]; total: number }> {
  // TODO: return api.get<{ data: IncomeExpenditureRecord[]; total: number }>(...)
  let data = [...INCOME_EXPENDITURE_DEMO];
  if (filters?.userId) {
    data = data.filter((r) => String(r.userId).includes(filters.userId!));
  }
  if (filters?.user) {
    data = data.filter((r) =>
      r.userNickname.toLowerCase().includes(filters.user!.toLowerCase())
    );
  }
  const total = 273282;
  const start = (page - 1) * perPage;
  const pageData = Array.from({ length: perPage }, (_, i) => {
    const row = data[(start + i) % data.length];
    if (!row) return null;
    return { ...row, id: start + i + 1, number: total - start - i };
  }).filter(Boolean) as IncomeExpenditureRecord[];
  return { data: pageData, total };
}
