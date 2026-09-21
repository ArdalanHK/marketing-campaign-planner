// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import type { CampaignPlan, PlanGenerator } from '../src/types';
import { generatePlan } from '../src/generator';
import { mountApp } from '../src/ui/app';

const $ = <T extends Element>(selector: string): T => {
  const node = document.querySelector<T>(selector);
  if (!node) throw new Error(`Missing element: ${selector}`);
  return node;
};

const setValue = (name: string, value: string): void => {
  $<HTMLInputElement>(`#field-${name}`).value = value;
};

const fillValid = (): void => {
  setValue('product', 'Water bottle');
  setValue('audience', 'Students');
  setValue('objective', 'awareness');
  setValue('channel', 'instagram');
  setValue('message', 'Carry it every day');
};

const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

const submit = async (): Promise<void> => {
  $<HTMLButtonElement>('button[type="submit"]').click();
  await flush();
};

const mount = (generator?: PlanGenerator): void => {
  document.body.innerHTML = '<div id="app"></div>';
  mountApp($('#app'), generator ? { generator } : {});
};

const stubClipboard = (writeText: (text: string) => Promise<void>): void => {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
};

describe('application', () => {
  beforeEach(() => mount());

  it('renders a labelled control for every field', () => {
    const controls = document.querySelectorAll('form input, form textarea, form select');
    expect(controls.length).toBe(6);
    controls.forEach((control) => {
      expect(document.querySelector(`label[for="${control.id}"]`)).not.toBeNull();
    });
  });

  it('shows accessible errors and no results when the form is empty', async () => {
    await submit();
    expect($<HTMLElement>('.error-summary').hidden).toBe(false);
    expect($('#field-product').getAttribute('aria-invalid')).toBe('true');
    expect($('#field-context').getAttribute('aria-invalid')).toBeNull();
    expect(document.activeElement).toBe($('.error-summary'));
    expect($<HTMLElement>('#results-view').hidden).toBe(true);
  });

  it('generates a plan from valid input and moves focus to the result', async () => {
    fillValid();
    await submit();
    expect($<HTMLElement>('#results-view').hidden).toBe(false);
    expect($<HTMLElement>('#form-view').hidden).toBe(true);
    expect(document.querySelectorAll('.plan-section').length).toBe(8);
    expect(document.activeElement).toBe($('#results-title'));
    expect($('#results-title').textContent).toBe('Plan for Water bottle');
  });

  it('fills the form with an example', () => {
    $<HTMLButtonElement>('.actions .btn:not(.btn-primary)').click();
    expect($<HTMLInputElement>('#field-product').value).not.toBe('');
    expect($<HTMLSelectElement>('#field-channel').value).toBe('instagram');
  });

  it('keeps the inputs when returning to edit', async () => {
    fillValid();
    await submit();
    $<HTMLButtonElement>('[data-action="edit"]').click();
    expect($<HTMLElement>('#form-view').hidden).toBe(false);
    expect($<HTMLInputElement>('#field-product').value).toBe('Water bottle');
  });

  it('clears the form on start over', async () => {
    fillValid();
    await submit();
    $<HTMLButtonElement>('[data-action="start-over"]').click();
    expect($<HTMLInputElement>('#field-product').value).toBe('');
    expect($<HTMLSelectElement>('#field-objective').value).toBe('');
  });

  it('renders markup-like input as plain text', async () => {
    fillValid();
    setValue('product', '<img src=x onerror="window.__pwned=1">');
    setValue('message', '<script>window.__pwned=1</script>');
    await submit();
    const results = $('#results-view');
    expect(results.querySelector('img')).toBeNull();
    expect(results.querySelector('script')).toBeNull();
    expect(results.textContent).toContain('<img src=x onerror="window.__pwned=1">');
    expect((window as unknown as { __pwned?: number }).__pwned).toBeUndefined();
  });

  it('copies the whole plan as Markdown and announces it', async () => {
    let copied = '';
    stubClipboard(async (text) => {
      copied = text;
    });
    fillValid();
    await submit();
    $<HTMLButtonElement>('[data-action="copy-all"]').click();
    await flush();
    expect(copied.startsWith('# Campaign plan: Water bottle')).toBe(true);
    expect($('[role="status"]').textContent).toContain('copied');
  });

  it('reports a failed copy instead of failing silently', async () => {
    stubClipboard(async () => {
      throw new Error('denied');
    });
    fillValid();
    await submit();
    $<HTMLButtonElement>('[data-action="copy-all"]').click();
    await flush();
    expect($('[role="status"]').textContent).toContain('Copy failed');
  });

  it('shows a friendly message, without internals, if generation fails', async () => {
    mount(() => {
      throw new Error('secret-internal-detail');
    });
    fillValid();
    await submit();
    const summary = $<HTMLElement>('.error-summary');
    expect(summary.hidden).toBe(false);
    expect(summary.textContent).toContain('could not be created');
    expect(summary.textContent).not.toContain('secret-internal-detail');
    expect($<HTMLElement>('#results-view').hidden).toBe(true);
  });

  it('accepts an asynchronous generator', async () => {
    mount(async (input): Promise<CampaignPlan> => generatePlan(input) as CampaignPlan);
    fillValid();
    await submit();
    expect($<HTMLElement>('#results-view').hidden).toBe(false);
  });
});
