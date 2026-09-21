import { toMarkdown } from '../export/markdown';
import { generatePlan } from '../generator';
import type { CampaignPlan, PlanGenerator } from '../types';
import { validateInput } from '../validation';
import { downloadText } from './actions';
import { el } from './dom';
import { EMPTY_VALUES } from './fields';
import { buildForm } from './form';
import { buildResults, copyWithFeedback } from './results';

export interface AppOptions {
  /** Defaults to the built-in template generator. */
  generator?: PlanGenerator;
}

/** Mounts the whole application into `root`. */
export function mountApp(root: HTMLElement, options: AppOptions = {}): void {
  const generator = options.generator ?? generatePlan;
  let busy = false;

  const status = el('div', { class: 'visually-hidden', role: 'status', 'aria-live': 'polite' });
  const announce = (message: string): void => {
    status.textContent = message;
  };

  const form = buildForm(() => void handleSubmit());
  const formView = el(
    'section',
    { id: 'form-view', 'aria-labelledby': 'form-title' },
    el('h2', { id: 'form-title' }, 'Campaign details'),
    form.element,
  );
  const resultsView = el('section', { id: 'results-view', 'aria-labelledby': 'results-title', hidden: true });

  const masthead = el(
    'header',
    { class: 'masthead' },
    el('h1', {}, 'Marketing Campaign Planner'),
    el(
      'p',
      { class: 'lead' },
      'Describe what you are promoting and who it is for. Get a structured first draft of a campaign plan that you can copy or download.',
    ),
    el(
      'ul',
      { class: 'facts' },
      el('li', {}, 'Runs entirely in your browser. Nothing you type is sent anywhere.'),
      el('li', {}, 'Uses fixed templates, not AI, so the output is a starting point rather than expert advice.'),
    ),
  );

  root.replaceChildren(
    el('div', { class: 'page' }, masthead, el('main', { id: 'main', class: 'workspace' }, formView, resultsView)),
    status,
  );

  let currentPlan: CampaignPlan | undefined;

  function showForm(): void {
    resultsView.hidden = true;
    formView.hidden = false;
    form.focusFirstField();
  }

  function showResults(plan: CampaignPlan): void {
    currentPlan = plan;
    const { element, heading } = buildResults(plan, {
      onEdit: showForm,
      onStartOver: () => {
        form.clearErrors();
        form.setValues(EMPTY_VALUES);
        currentPlan = undefined;
        showForm();
      },
      onCopyAll: () => {
        const button = resultsView.querySelector<HTMLButtonElement>('[data-action="copy-all"]');
        if (currentPlan && button) {
          void copyWithFeedback(toMarkdown(currentPlan), button, announce, 'Plan copied to the clipboard.');
        }
      },
      onDownload: () => {
        if (!currentPlan) return;
        downloadText('campaign-plan.md', toMarkdown(currentPlan));
        announce('Download started.');
      },
      announce,
    });
    resultsView.replaceChildren(element);
    formView.hidden = true;
    resultsView.hidden = false;
    heading.focus();
  }

  async function handleSubmit(): Promise<void> {
    if (busy) return;
    const result = validateInput(form.values());
    if (!result.ok) {
      form.showErrors(result.errors);
      return;
    }

    form.clearErrors();
    busy = true;
    form.setBusy(true);
    try {
      showResults(await generator(result.value));
    } catch (error) {
      console.error('Plan generation failed:', error);
      form.showFailure('Something went wrong while creating the plan. Check your input and try again.');
    } finally {
      busy = false;
      form.setBusy(false);
    }
  }
}
