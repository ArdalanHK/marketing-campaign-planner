import {
  CHANNEL_LABELS,
  OBJECTIVE_LABELS,
  type CampaignInput,
  type CampaignPlan,
  type PlanGenerator,
  type PlanSection,
} from '../types';
import { normalizeSingleLine } from '../validation';
import { CHANNEL_TEMPLATES, OBJECTIVE_TEMPLATES } from './templates';

/**
 * Replaces {product}, {audience} and {message} in a single pass.
 * Single-pass replacement means placeholder-like text typed by the user
 * (e.g. "{message}") is never expanded a second time.
 */
export function fill(template: string, input: CampaignInput): string {
  return template.replace(/\{(product|audience|message)\}/g, (_match, key: string) => {
    return input[key as 'product' | 'audience' | 'message'];
  });
}

/** Built-in generator: deterministic, offline, and free of side effects. */
export const generatePlan: PlanGenerator = (input) => buildPlan(input);

function buildPlan(input: CampaignInput): CampaignPlan {
  const objective = OBJECTIVE_TEMPLATES[input.objective];
  const channel = CHANNEL_TEMPLATES[input.channel];
  const objectiveLabel = OBJECTIVE_LABELS[input.objective];
  const channelLabel = CHANNEL_LABELS[input.channel];
  const f = (template: string): string => fill(template, input);

  const summary: string[] = [
    `This ${objectiveLabel.toLowerCase()} campaign promotes ${input.product} to ${input.audience} on ${channelLabel}.`,
    f(objective.goal),
  ];
  if (input.context !== '') {
    summary.push(`Context to keep in mind: ${normalizeSingleLine(input.context)}`);
  }

  const sections: PlanSection[] = [
    { id: 'summary', title: 'Campaign summary', items: summary },
    {
      id: 'audience',
      title: 'Target audience',
      items: [
        `Primary audience: ${input.audience}`,
        f('What problem does {audience} want solved, and how do they describe it?'),
        `Where do they already spend time online, and is ${channelLabel} one of those places?`,
        'What might stop them from acting: cost, trust, time or awareness?',
      ],
    },
    {
      id: 'message',
      title: 'Core message',
      items: [
        `"${input.message}"`,
        f('Check that someone from {audience} can understand this in one reading, without extra context.'),
        'Back it with one or two proof points you can honestly support, such as results, examples or feedback you actually have.',
        channel.tone,
      ],
    },
    {
      id: 'content-ideas',
      title: 'Content ideas',
      items: [...channel.ideas, ...objective.ideas].map(f),
    },
    { id: 'cta', title: 'Call-to-action suggestions', items: objective.ctas.map(f) },
    {
      id: 'structure',
      title: 'Campaign structure',
      items: [
        `Prepare: confirm the goal. ${f(objective.goal)} Agree on how you will know it worked.`,
        `Prepare: ${f(channel.setupStep)}`,
        `Prepare: write the core message and test it on one or two people from your audience.`,
        `Launch: ${f(channel.launchStep)}`,
        `Launch: ${f(objective.launchStep)}`,
        `Sustain: ${f(objective.reviewStep)}`,
        'Sustain: repeat the formats that get the strongest response and drop the ones that do not.',
      ],
    },
    { id: 'metrics', title: 'Success metrics', items: [...objective.metrics] },
    {
      id: 'next-steps',
      title: 'Next steps',
      items: [
        'Review this plan and rewrite anything that does not fit your situation. It is a starting draft, not a finished strategy.',
        'Decide on a realistic time frame and how you will measure the metrics above.',
        'Draft the first two or three pieces of content from the ideas list.',
        f('Get feedback from one or two people in {audience} before publishing widely.'),
        'Publish, measure and adjust.',
      ],
    },
  ];

  return { input, sections };
}
