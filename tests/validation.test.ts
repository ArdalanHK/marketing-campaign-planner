import { describe, expect, it } from 'vitest';
import { LIMITS, validateInput, type RawInput } from '../src/validation';

const raw = (overrides: Partial<RawInput> = {}): RawInput => ({
  product: 'Water bottle',
  audience: 'Students',
  objective: 'awareness',
  channel: 'instagram',
  message: 'Carry it every day',
  context: '',
  ...overrides,
});

describe('validateInput', () => {
  it('accepts valid input and returns normalised values', () => {
    const result = validateInput(raw({ product: '  Water   bottle \n', context: '' }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.product).toBe('Water bottle');
      expect(result.value.objective).toBe('awareness');
      expect(result.value.context).toBe('');
    }
  });

  it('reports every missing required field', () => {
    const result = validateInput(raw({ product: '', audience: '', objective: '', channel: '', message: '' }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(['audience', 'channel', 'message', 'objective', 'product']);
    }
  });

  it('treats whitespace-only text as empty', () => {
    const result = validateInput(raw({ product: '   \n\t  ' }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.product).toContain('Enter');
  });

  it('rejects an unknown objective or channel', () => {
    const result = validateInput(raw({ objective: 'world-domination', channel: 'carrier-pigeon' }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.objective).toBeTruthy();
      expect(result.errors.channel).toBeTruthy();
    }
  });

  it('enforces the length limit exactly at the boundary', () => {
    expect(validateInput(raw({ product: 'a'.repeat(LIMITS.product) })).ok).toBe(true);
    const tooLong = validateInput(raw({ product: 'a'.repeat(LIMITS.product + 1) }));
    expect(tooLong.ok).toBe(false);
    if (!tooLong.ok) expect(tooLong.errors.product).toContain(String(LIMITS.product));
  });

  it('counts characters, not UTF-16 code units', () => {
    // Each emoji is two UTF-16 code units but one character.
    expect(validateInput(raw({ product: '😀'.repeat(LIMITS.product) })).ok).toBe(true);
  });

  it('strips control characters', () => {
    const result = validateInput(raw({ product: 'Water\u0000 bottle\u0007' }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.product).toBe('Water bottle');
  });

  it('normalises multi-line context and enforces its limit', () => {
    const ok = validateInput(raw({ context: '  Line one  \r\n\r\n\r\n\r\nLine   two ' }));
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.value.context).toBe('Line one\n\nLine two');

    const tooLong = validateInput(raw({ context: 'x'.repeat(LIMITS.context + 1) }));
    expect(tooLong.ok).toBe(false);
  });

  it('keeps non-Latin text intact', () => {
    const result = validateInput(raw({ product: 'بطری آب', audience: '学生' }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.product).toBe('بطری آب');
      expect(result.value.audience).toBe('学生');
    }
  });
});
