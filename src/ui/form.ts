import type { FieldErrors, FieldName, RawInput } from '../validation';
import { el } from './dom';
import { EMPTY_VALUES, EXAMPLE_VALUES, FIELDS, type FieldConfig } from './fields';

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export interface FormController {
  element: HTMLFormElement;
  values(): RawInput;
  setValues(values: RawInput): void;
  showErrors(errors: FieldErrors): void;
  showFailure(message: string): void;
  clearErrors(): void;
  setBusy(busy: boolean): void;
  focusFirstField(): void;
}

interface FieldParts {
  config: FieldConfig;
  control: Control;
  error: HTMLElement;
  counter?: HTMLElement;
}

const fieldId = (name: FieldName): string => `field-${name}`;

function buildField(config: FieldConfig): { wrapper: HTMLElement; parts: FieldParts } {
  const id = fieldId(config.name);
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;

  let control: Control;
  if (config.kind === 'select') {
    control = el('select', { id, name: config.name, required: config.required });
    control.append(el('option', { value: '' }, 'Choose an option'));
    for (const option of config.options ?? []) {
      control.append(el('option', { value: option.value }, option.label));
    }
  } else if (config.kind === 'textarea') {
    control = el('textarea', { id, name: config.name, rows: String(config.rows ?? 3) });
  } else {
    control = el('input', { id, name: config.name, type: 'text', autocomplete: 'off' });
  }
  control.setAttribute('aria-describedby', `${helpId} ${errorId}`);
  if (config.required) control.setAttribute('aria-required', 'true');

  const error = el('p', { id: errorId, class: 'field-error', hidden: true });
  const counter = config.limit
    ? el('span', { class: 'counter', 'aria-hidden': 'true' }, `0 / ${config.limit}`)
    : undefined;

  const wrapper = el(
    'div',
    { class: 'field' },
    el('label', { for: id }, config.label),
    el('p', { id: helpId, class: 'field-help' }, config.help),
    control,
    el('div', { class: 'field-meta' }, error, ...(counter ? [counter] : [])),
  );

  if (counter && config.limit) {
    const limit = config.limit;
    control.addEventListener('input', () => {
      counter.textContent = `${Array.from(control.value).length} / ${limit}`;
    });
  }

  return { wrapper, parts: { config, control, error, counter } };
}

export function buildForm(onSubmit: () => void): FormController {
  const parts = new Map<FieldName, FieldParts>();

  const summary = el('div', { class: 'error-summary', tabindex: '-1', hidden: true });
  const submit = el('button', { type: 'submit', class: 'btn btn-primary' }, 'Generate plan');
  const example = el('button', { type: 'button', class: 'btn' }, 'Fill with an example');

  const form = el('form', { novalidate: true, 'aria-labelledby': 'form-title' }, summary);
  for (const config of FIELDS) {
    const { wrapper, parts: fieldParts } = buildField(config);
    parts.set(config.name, fieldParts);
    form.append(wrapper);
  }
  form.append(el('div', { class: 'actions' }, submit, example));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    onSubmit();
  });

  const controller: FormController = {
    element: form,

    values() {
      const read = (name: FieldName): string => parts.get(name)?.control.value ?? '';
      return {
        product: read('product'),
        audience: read('audience'),
        objective: read('objective'),
        channel: read('channel'),
        message: read('message'),
        context: read('context'),
      };
    },

    setValues(values) {
      for (const [name, part] of parts) {
        part.control.value = values[name];
        part.control.dispatchEvent(new Event('input'));
      }
    },

    clearErrors() {
      summary.hidden = true;
      summary.replaceChildren();
      for (const part of parts.values()) {
        part.error.hidden = true;
        part.error.replaceChildren();
        part.control.removeAttribute('aria-invalid');
      }
    },

    showErrors(errors) {
      controller.clearErrors();
      const list = el('ul');
      for (const config of FIELDS) {
        const message = errors[config.name];
        const part = parts.get(config.name);
        if (!message || !part) continue;

        part.control.setAttribute('aria-invalid', 'true');
        part.error.replaceChildren(el('span', { class: 'visually-hidden' }, 'Error: '), message);
        part.error.hidden = false;

        const link = el('a', { href: `#${fieldId(config.name)}` }, `${config.label}: ${message}`);
        link.addEventListener('click', (event) => {
          event.preventDefault();
          part.control.focus();
        });
        list.append(el('li', {}, link));
      }
      const count = list.children.length;
      summary.append(
        el('h3', {}, count === 1 ? 'Fix 1 field to continue' : `Fix ${count} fields to continue`),
        list,
      );
      summary.hidden = false;
      summary.focus();
    },

    showFailure(message) {
      controller.clearErrors();
      summary.append(el('h3', {}, 'The plan could not be created'), el('p', {}, message));
      summary.hidden = false;
      summary.focus();
    },

    setBusy(busy) {
      submit.disabled = busy;
      submit.textContent = busy ? 'Generating…' : 'Generate plan';
    },

    focusFirstField() {
      parts.get(FIELDS[0]!.name)?.control.focus();
    },
  };

  example.addEventListener('click', () => {
    controller.clearErrors();
    controller.setValues(EXAMPLE_VALUES);
    parts.get('product')?.control.focus();
  });

  controller.setValues(EMPTY_VALUES);
  return controller;
}
