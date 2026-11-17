const PREFIX = 'manage_core_feature_records__';
import * as XLSX from 'xlsx';

export const featureKey = (system, featureId) => `${PREFIX}${system}__${featureId}`;

export function readFeatureRecords(system, featureId) {
  try {
    const value = localStorage.getItem(featureKey(system, featureId));
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function writeFeatureRecords(system, featureId, records) {
  try {
    localStorage.setItem(featureKey(system, featureId), JSON.stringify(records));
  } catch {
    // localStorage can fail in private/incognito contexts; UI will still work for current state.
  }
}

export function downloadTextFile(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function toCsv(rows) {
  if (!rows || rows.length === 0) return '';
  const headers = Array.from(rows.reduce((set, row) => {
    Object.keys(row).forEach((key) => set.add(key));
    return set;
  }, new Set()));
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  return [headers.join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\n');
}

export function sanitizeSqlValue(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
}

export function recordsToSql(tableName, records) {
  if (!records.length) return `-- No records available for ${tableName}`;
  const headers = Array.from(records.reduce((set, row) => {
    Object.keys(row).forEach((key) => set.add(key));
    return set;
  }, new Set()));
  return records.map((record) => {
    const columns = headers.map((key) => `\`${key}\``).join(', ');
    const values = headers.map((key) => sanitizeSqlValue(record[key])).join(', ');
    return `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values});`;
  }).join('\n');
}

export function exportToExcel(rows, filename = 'export.xlsx', sheetName = 'Sheet1') {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
}
