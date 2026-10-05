// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadValidatedRecords, validateRecords } from '../scripts/validate.mjs';
import { columns, toCsv } from '../scripts/build-csv.mjs';

const records = await loadValidatedRecords();
const sample = () => structuredClone(records[0]);
const rejects = (change, pattern) => {
  const row = sample();
  change(row);
  assert.match(validateRecords([row]).join('\n'), pattern);
};

test('all published records validate and CSV is reproducible', async () => {
  assert.deepEqual(validateRecords(records), []);
  assert.equal(await readFile(new URL('../data/rules.csv', import.meta.url), 'utf8'), toCsv(records));
});

test('missing, mistyped, extra and nested invalid values fail', () => {
  rejects(row => delete row.quote, /missing required property quote/);
  rejects(row => { row.goalkeeper = 'false'; }, /goalkeeper: expected/);
  rejects(row => { row.players_on_field = 7.5; }, /players_on_field: expected/);
  rejects(row => { row.periods.extra = 1; }, /unknown property extra/);
  rejects(row => { row.additional_sources[0].url = 'not-a-url'; }, /additional_sources\[0\].url/);
  rejects(row => { row.retrieved_date = '2026-02-30'; }, /real calendar date/);
  rejects(row => { row.ball_size = 6; }, /allowed variant/);
});

test('range, unspecified, fixed and maximum duration contracts are enforced', () => {
  rejects(row => { row.match_length_basis = 'range'; row.match_length_minutes = null; }, /match_length_minutes_range/);
  rejects(row => { row.match_length_basis = 'unspecified'; }, /match_length_minutes: expected null/);
  rejects(row => { row.match_length_minutes = null; }, /match_length_minutes: expected number/);
  rejects(row => { row.match_length_minutes_range = [20, 40]; }, /match_length_minutes_range: expected null/);
  const range = structuredClone(records.find(row => row.match_length_basis === 'range'));
  range.match_length_minutes_range.reverse();
  assert.match(validateRecords([range]).join('\n'), /minimum exceeds maximum/);
});

test('duplicates, empty datasets and inconsistent period totals fail', () => {
  assert.match(validateRecords([sample(), sample()]).join('\n'), /duplicate/);
  for (const input of [[], {}, null, [null]]) assert.ok(validateRecords(input).length > 0);
  rejects(row => { row.periods.length_minutes = 11; }, /must match match_length_minutes/);
});

test('nullable values and fractional period lengths remain representable', () => {
  const row = sample();
  Object.assign(row, { goalkeeper: null, ball_size: '3 or 4', heading_rule: null, match_length_minutes: 30 });
  row.periods = { count: 4, length_minutes: 7.5, note: null };
  assert.deepEqual(validateRecords([row]), []);
});

// Independent CSV reader used to check quoting and cell boundaries, including
// commas, quotes, Unicode and embedded CRLF. It is intentionally test-only.
function parseCsv(text) {
  const result = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) { row.push(cell); cell = ''; }
    else if (char === '\r' && text[i + 1] === '\n' && !quoted) {
      row.push(cell); result.push(row); row = []; cell = ''; i++;
    } else cell += char;
  }
  assert.equal(quoted, false);
  return result;
}

test('CSV preserves special characters, false, null, arrays and source pairs', () => {
  const row = sample();
  row.notes = 'Māori, "quoted"\r\nnext line | keep this';
  row.heading_rule = null;
  row.additional_sources.push({ url: 'https://example.org/official.pdf', title: 'Second, "source"' });
  const [header, cells] = parseCsv(toCsv([row]));
  assert.deepEqual(header, columns);
  assert.equal(cells.length, columns.length);
  const values = Object.fromEntries(header.map((key, i) => [key, cells[i]]));
  assert.equal(values.notes, row.notes);
  assert.equal(values.goalkeeper, 'false');
  assert.equal(values.heading_rule, '');
  assert.equal(values['periods.count'], '4');
  assert.equal(values['additional_sources.url'], row.additional_sources.map(source => source.url).join(' | '));
  assert.equal(values['additional_sources.title'], row.additional_sources.map(source => source.title).join(' | '));
  const range = records.find(item => item.match_length_basis === 'range');
  const [, rangeCells] = parseCsv(toCsv([range]));
  assert.equal(rangeCells[columns.indexOf('match_length_minutes_range')], range.match_length_minutes_range.join(' | '));
});

test('CLI resolves repository data from another working directory and fails on bad input', () => {
  const script = fileURLToPath(new URL('../scripts/validate.mjs', import.meta.url));
  const cwd = fileURLToPath(new URL('./', import.meta.url));
  const good = spawnSync(process.execPath, [script], { cwd, encoding: 'utf8' });
  assert.equal(good.status, 0, good.stderr);
  const bad = spawnSync(process.execPath, [script, fileURLToPath(new URL('../package.json', import.meta.url))], { cwd, encoding: 'utf8' });
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /non-empty array/);
});
