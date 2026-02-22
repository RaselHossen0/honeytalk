/**
 * Utility to export data to XLSX (Excel) file.
 */

import * as XLSX from 'xlsx';

export interface ExportColumn<T> {
  key: keyof T | string;
  header: string;
}

export function exportToXlsx<T extends object>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string
): void {
  const rows = data.map((row) => {
    const obj: Record<string, unknown> = {};
    const r = row as Record<string, unknown>;
    columns.forEach((col) => {
      const key = col.key as string;
      obj[col.header] = r[key];
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
