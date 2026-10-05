// SPDX-License-Identifier: MIT
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { loadValidatedRecords, validateRecords, schema } from './validate.mjs';

export const columns = Object.keys(schema.properties).flatMap(key => {
  if (key === 'periods') return ['periods.count', 'periods.length_minutes', 'periods.note'];
  if (key === 'additional_sources') return ['additional_sources.url', 'additional_sources.title'];
  return [key];
});

function flattenedValue(row, column) {
  const [key, child] = column.split('.');
  const value = child
    ? (Array.isArray(row[key]) ? row[key].map(item => item[child]) : row[key][child])
    : row[key];
  if (value === null || value === undefined) return '';
  return Array.isArray(value) ? value.join(' | ') : String(value);
}

function escapeCsv(value) {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export function toCsv(records) {
  const errors = validateRecords(records);
  if (errors.length) throw new Error(errors.join('\n'));
  const rows = [columns, ...records.map(row => columns.map(column => flattenedValue(row, column)))];
  return rows.map(row => row.map(escapeCsv).join(',')).join('\r\n') + '\r\n';
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const records = await loadValidatedRecords();
    await writeFile(new URL('../data/rules.csv', import.meta.url), toCsv(records), 'utf8');
    console.log(`Built data/rules.csv: ${records.length} records, ${columns.length} columns.`);
  } catch (error) {
    console.error(`CSV build failed: ${error.message}`);
    process.exitCode = 1;
  }
}
