import { HttpError } from './errors.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function intParam(value, { name, min = 1, max = Number.MAX_SAFE_INTEGER, fallback }) {
  if (value === undefined || value === '') return fallback;
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new HttpError(400, `"${name}" must be an integer between ${min} and ${max}`);
  }
  return number;
}

export function idList(value, name = 'ids') {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(400, `"${name}" must be a comma-separated list of ids`);
  }
  const ids = [...new Set(value.split(',').map((v) => v.trim()).filter(Boolean))];
  if (ids.length > 100 || ids.some((id) => !/^\d+$/.test(id))) {
    throw new HttpError(400, `"${name}" must be a comma-separated list of up to 100 ids`);
  }
  return ids.map(Number);
}

/**
 * Checks `body` against a map of field -> { required, max, email }. Returns the
 * trimmed values, or throws a 422 listing every problem at once.
 */
export function validateFields(body, rules) {
  const source = body && typeof body === 'object' ? body : {};
  const values = {};
  const errors = {};

  for (const [field, rule] of Object.entries(rules)) {
    const raw = source[field];
    const value = typeof raw === 'string' ? raw.trim() : raw == null ? '' : String(raw).trim();

    if (rule.required && value === '') errors[field] = 'is required';
    else if (rule.max && value.length > rule.max) errors[field] = `must be at most ${rule.max} characters`;
    else if (rule.email && value !== '' && !EMAIL_RE.test(value)) errors[field] = 'must be a valid email';

    values[field] = value;
  }

  if (Object.keys(errors).length > 0) throw new HttpError(422, 'Validation failed', errors);
  return values;
}
