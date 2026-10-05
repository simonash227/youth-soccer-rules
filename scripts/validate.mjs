// SPDX-License-Identifier: MIT
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const dataUrl = new URL('../data/rules.json', import.meta.url);
export const schema = JSON.parse(await readFile(new URL('../schema/rules.schema.json', import.meta.url), 'utf8'));

// This is deliberately a small validator for the keywords used in our schema,
// not a general JSON Schema implementation. Fail on unsupported schema additions.
const keywords = new Set([
  '$schema', 'title', 'description', 'type', 'properties', 'required',
  'additionalProperties', 'items', 'minItems', 'maxItems', 'minLength',
  'minimum', 'maximum', 'exclusiveMinimum', 'pattern', 'format', 'enum',
  'const', 'anyOf', 'allOf', 'if', 'then', 'else',
]);

function checkSchema(node) {
  for (const key of Object.keys(node)) {
    if (!keywords.has(key)) throw new Error(`Unsupported schema keyword: ${key}`);
  }
  if (node.format && !['uri', 'date'].includes(node.format)) {
    throw new Error(`Unsupported schema format: ${node.format}`);
  }
  for (const child of Object.values(node.properties ?? {})) checkSchema(child);
  for (const key of ['items', 'if', 'then', 'else']) if (node[key]) checkSchema(node[key]);
  for (const key of ['anyOf', 'allOf']) for (const child of node[key] ?? []) checkSchema(child);
}
checkSchema(schema);

function matchesType(value, type) {
  if (type === 'null') return value === null;
  if (type === 'array') return Array.isArray(value);
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (type === 'integer') return Number.isInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  return typeof value === type;
}

function validateValue(value, rule, path) {
  const errors = [];
  const fail = message => errors.push(`${path}: ${message}`);
  if (rule.type && ![rule.type].flat().some(type => matchesType(value, type))) {
    return [`${path}: expected ${[rule.type].flat().join(' or ')}`];
  }
  if (rule.enum && !rule.enum.includes(value)) fail(`expected one of ${rule.enum.join(', ')}`);
  if (Object.hasOwn(rule, 'const') && value !== rule.const) fail(`expected ${JSON.stringify(rule.const)}`);
  if (rule.anyOf && !rule.anyOf.some(branch => validateValue(value, branch, path).length === 0)) {
    fail('does not match any allowed variant');
  }
  for (const branch of rule.allOf ?? []) errors.push(...validateValue(value, branch, path));
  if (rule.if) {
    const branch = validateValue(value, rule.if, path).length === 0 ? rule.then : rule.else;
    if (branch) errors.push(...validateValue(value, branch, path));
  }
  if (typeof value === 'string') {
    if (rule.minLength !== undefined && [...value].length < rule.minLength) fail('string is too short');
    if (rule.pattern && !new RegExp(rule.pattern, 'u').test(value)) fail(`must match ${rule.pattern}`);
    if (rule.format === 'uri') {
      try { new URL(value); } catch { fail('expected an absolute URI'); }
    }
    if (rule.format === 'date') {
      const date = new Date(`${value}T00:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
        fail('expected a real calendar date (YYYY-MM-DD)');
      }
    }
  }
  if (typeof value === 'number') {
    if (rule.minimum !== undefined && value < rule.minimum) fail(`must be >= ${rule.minimum}`);
    if (rule.maximum !== undefined && value > rule.maximum) fail(`must be <= ${rule.maximum}`);
    if (rule.exclusiveMinimum !== undefined && value <= rule.exclusiveMinimum) fail(`must be > ${rule.exclusiveMinimum}`);
  }
  if (Array.isArray(value)) {
    if (rule.minItems !== undefined && value.length < rule.minItems) fail(`needs at least ${rule.minItems} items`);
    if (rule.maxItems !== undefined && value.length > rule.maxItems) fail(`needs at most ${rule.maxItems} items`);
    if (rule.items) value.forEach((item, index) => errors.push(...validateValue(item, rule.items, `${path}[${index}]`)));
  } else if (value !== null && typeof value === 'object') {
    for (const key of rule.required ?? []) if (!Object.hasOwn(value, key)) fail(`missing required property ${key}`);
    for (const [key, item] of Object.entries(value)) {
      if (Object.hasOwn(rule.properties ?? {}, key)) {
        errors.push(...validateValue(item, rule.properties[key], `${path}.${key}`));
      } else if (rule.additionalProperties === false) fail(`unknown property ${key}`);
    }
  }
  return errors;
}

export function validateRecords(records) {
  if (!Array.isArray(records) || records.length === 0) return ['data: expected a non-empty array of rule records'];
  const errors = [];
  const seen = new Set();
  records.forEach((record, index) => {
    const path = `records[${index}]`;
    const structural = validateValue(record, schema, path);
    errors.push(...structural);
    if (structural.length) return;
    const key = JSON.stringify([record.organisation, record.country, record.age_group]);
    if (seen.has(key)) errors.push(`${path}: duplicate organisation/country/age_group`);
    seen.add(key);
    const range = record.match_length_minutes_range;
    if (range && range[0] > range[1]) errors.push(`${path}.match_length_minutes_range: minimum exceeds maximum`);
    const { count, length_minutes: length } = record.periods;
    if (count !== null && length !== null && record.match_length_minutes !== null
      && Math.abs(count * length - record.match_length_minutes) > 1e-9) {
      errors.push(`${path}.periods: count times length_minutes must match match_length_minutes`);
    }
  });
  return errors;
}

export async function loadValidatedRecords(url = dataUrl) {
  const records = JSON.parse(await readFile(url, 'utf8'));
  const errors = validateRecords(records);
  if (errors.length) throw new Error(errors.join('\n'));
  return records;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv.length > 3) throw new Error('Usage: node scripts/validate.mjs [path/to/rules.json]');
    const records = await loadValidatedRecords(process.argv[2] ?? dataUrl);
    console.log(`Validated ${records.length} records against schema/rules.schema.json (${new Set(records.map(row => row.organisation)).size} organisations).`);
  } catch (error) {
    console.error(`Validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}
