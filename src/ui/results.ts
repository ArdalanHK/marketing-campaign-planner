import { sectionToMarkdown } from '../export/markdown';
import { CHANNEL_LABELS, OBJECTIVE_LABELS, type CampaignPlan } from '../types';
import { copyText } from './actions';
import { el } from './dom';

export interface ResultsHandlers {
  onEdit(): void;
  onStartOver(): void;
  onCopyAll(): void;
  onDownload(): void;
  /** Called after any copy attempt so the app can announce the outcome. */
  announce(message: string): void;
}

/** Builds the results view. Returns the element and the heading that should receive focus. */
export function buildResults(
  plan: CampaignPlan,
  handlers: ResultsHandlers,
): { element: HTMLElement; heading: HTMLElement } {
  const heading = el('h2', { id: 'results-title', tabindex: '-1' }, `Plan for ${plan.input.product}`);

  const toolbar = el(
    'div',
    { class: 'actions', role: 'group', 'aria-label': 'Plan actions' },
    el('button', { type: 'button', class: 'btn btn-primary', 'data-action': 'copy-all' }, 'Copy plan'),
    el('button', { type: 'button', class: 'btn', 'data-action': 'download' }, 'Download as Markdown'),
    el('button', { type: 'button', class: 'btn', 'data-action': 'edit' }, 'Edit inputs'),
    el('button', { type: 'button', class: 'btn btn-quiet', 'data-action': 'start-over' }, 'Start over'),
  );
  bind(toolbar, 'copy-all', handlers.onCopyAll);
  bind(toolbar, 'download', handlers.onDownload);
  bind(toolbar, 'edit', handlers.onEdit);
  bind(toolbar, 'start-over', handlers.onStartOver);

  const note = el(
    'p',
    { class: 'note' },
    `${OBJECTIVE_LABELS[plan.input.objective]} on ${CHANNEL_LABELS[plan.input.channel]}. `,
    'Built from templates in your browser, so treat it as a starting draft and adapt it to your situation.',
  );

  const sections = plan.sections.map((section) => {
    const list = el('ul', { role: 'list' });
    section.items.forEach((text, index) => {
      const isPullQuote = section.id === 'message' && index === 0;
      list.append(
        isPullQuote ? el('li', { class: 'pull' }, el('span', { class: 'marker' }, text)) : el('li', {}, text),
      );
    });

    const copy = el(
      'button',
      { type: 'button', class: 'btn btn-small', 'aria-label': `Copy ${section.title}` },
      'Copy',
    );
    copy.addEventListener('click', () => {
      void copyWithFeedback(sectionToMarkdown(section), copy, handlers.announce, `${section.title} copied.`);
    });

    return el(
      'section',
      { class: 'plan-section', 'aria-labelledby': `section-${section.id}` },
      el('div', { class: 'plan-section-head' }, el('h3', { id: `section-${section.id}` }, section.title), copy),
      list,
    );
  });

  const element = el('div', {}, heading, note, toolbar, ...sections);
  return { element, heading };
}

function bind(container: HTMLElement, action: string, handler: () => void): void {
  container.querySelector(`[data-action="${action}"]`)?.addEventListener('click', handler);
}

/** Copies text and gives both visual (button label) and spoken (live region) feedback. */
export async function copyWithFeedback(
  text: string,
  button: HTMLButtonElement,
  announce: (message: string) => void,
  successMessage: string,
): Promise<void> {
  const original = button.textContent ?? '';
  const ok = await copyText(text);
  announce(ok ? successMessage : 'Copy failed. Select the text and copy it manually.');
  button.textContent = ok ? 'Copied' : 'Copy failed';
  window.setTimeout(() => {
    button.textContent = original;
  }, 1800);
}
