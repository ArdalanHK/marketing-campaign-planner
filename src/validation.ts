import {
  CHANNELS,
  OBJECTIVES,
  type CampaignInput,
  type Channel,
  type Objective,
} from './types';

/** Maximum lengths, in characters (Unicode code points), for free-text fields. */
export const LIMITS = {
  product: 200,
  audience: 300,
  message: 300,
  context: 1000,
} as const;

export type FieldName = 'product' | 'audience' | 'objective' | 'channel' | 'message' | 'context';

/** Raw values as they come from the form, before any cleaning. */
export type RawInput = Record<FieldName, string>;

export type FieldErrors = Partial<Record<FieldName, string>>;

export type ValidationResult =
  | { ok: true; value: CampaignInput }
  | { ok: false; errors: FieldErrors };

// Control characters other than tab (\u0009) and newline (\u000A).
const CONTROL_CHARS = /[\u0000-\u0008\u000B-\u001F\u007F]/g;

function stripControlChars(text: string): string {
  return text.replace(CONTROL_CHARS, '');
}

/** Collapses all whitespace (including newlines) to single spaces. */
export function normalizeSingleLine(text: string): string {
  return stripControlChars(text).replace(/\s+/g, ' ').trim();
}

/** Trims lines, collapses runs of spaces and limits consecutive blank lines to one. */
export function normalizeMultiline(text: string): string {
  return stripControlChars(text)
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function length(text: string): number {
  return Array.from(text).length;
}

function checkText(
  raw: string,
  field: 'product' | 'audience' | 'message',
  label: string,
  errors: FieldErrors,
): string {
  const value = normalizeSingleLine(raw);
  if (value === '') {
    errors[field] = `Enter ${label}.`;
  } else if (length(value) > LIMITS[field]) {
    errors[field] = `Shorten this to ${LIMITS[field]} characters or fewer (currently ${length(value)}).`;
  }
  return value;
}

function isObjective(value: string): value is Objective {
  return (OBJECTIVES as readonly string[]).includes(value);
}

function isChannel(value: string): value is Channel {
  return (CHANNELS as readonly string[]).includes(value);
}

/** Validates and normalises raw form input. Pure: no DOM access, no side effects. */
export function validateInput(raw: RawInput): ValidationResult {
  const errors: FieldErrors = {};

  const product = checkText(raw.product, 'product', 'the product or service you want to promote', errors);
  const audience = checkText(raw.audience, 'audience', 'the people you want to reach', errors);
  const message = checkText(raw.message, 'message', 'the main message of the campaign', errors);

  const objective = raw.objective.trim();
  if (!isObjective(objective)) {
    errors.objective = 'Choose a campaign objective.';
  }

  const channel = raw.channel.trim();
  if (!isChannel(channel)) {
    errors.channel = 'Choose a marketing channel.';
  }

  const context = normalizeMultiline(raw.context);
  if (length(context) > LIMITS.context) {
    errors.context = `Shorten this to ${LIMITS.context} characters or fewer (currently ${length(context)}).`;
  }

  if (Object.keys(errors).length > 0 || !isObjective(objective) || !isChannel(channel)) {
    return { ok: false, errors };
  }

  return { ok: true, value: { product, audience, objective, channel, message, context } };
}
