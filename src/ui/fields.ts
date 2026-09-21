import { CHANNELS, CHANNEL_LABELS, OBJECTIVES, OBJECTIVE_LABELS } from '../types';
import { LIMITS, type FieldName, type RawInput } from '../validation';

export interface FieldConfig {
  name: FieldName;
  label: string;
  help: string;
  kind: 'text' | 'textarea' | 'select';
  required: boolean;
  limit?: number;
  rows?: number;
  options?: ReadonlyArray<{ value: string; label: string }>;
}

export const FIELDS: readonly FieldConfig[] = [
  {
    name: 'product',
    label: 'Product or service',
    help: 'What are you promoting? Write it so it reads naturally in a sentence, for example "a refillable water bottle".',
    kind: 'text',
    required: true,
    limit: LIMITS.product,
  },
  {
    name: 'audience',
    label: 'Target audience',
    help: 'Who do you want to reach? Be specific, for example "first-time home buyers in their thirties".',
    kind: 'textarea',
    required: true,
    limit: LIMITS.audience,
    rows: 3,
  },
  {
    name: 'objective',
    label: 'Campaign objective',
    help: 'The main result you want from this campaign.',
    kind: 'select',
    required: true,
    options: OBJECTIVES.map((value) => ({ value, label: OBJECTIVE_LABELS[value] })),
  },
  {
    name: 'channel',
    label: 'Marketing channel',
    help: 'Where the campaign will run.',
    kind: 'select',
    required: true,
    options: CHANNELS.map((value) => ({ value, label: CHANNEL_LABELS[value] })),
  },
  {
    name: 'message',
    label: 'Main message',
    help: 'The one thing you want your audience to remember.',
    kind: 'textarea',
    required: true,
    limit: LIMITS.message,
    rows: 3,
  },
  {
    name: 'context',
    label: 'Additional context (optional)',
    help: 'Budget, timing, brand tone, past results, or anything else that matters.',
    kind: 'textarea',
    required: false,
    limit: LIMITS.context,
    rows: 4,
  },
];

export const EMPTY_VALUES: RawInput = {
  product: '',
  audience: '',
  objective: '',
  channel: '',
  message: '',
  context: '',
};

/** A fictional example so first-time visitors can see what the output looks like. */
export const EXAMPLE_VALUES: RawInput = {
  product: 'a refillable stainless-steel water bottle',
  audience: 'students and young professionals who want to cut down on single-use plastic',
  objective: 'awareness',
  channel: 'instagram',
  message: 'A bottle you will actually want to carry every day',
  context: 'Small new brand with no advertising budget. Launching in spring.',
};
