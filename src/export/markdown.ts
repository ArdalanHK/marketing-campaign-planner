import { CHANNEL_LABELS, OBJECTIVE_LABELS, type CampaignPlan, type PlanSection } from '../types';

function quote(text: string): string {
  return text
    .split('\n')
    .map((line) => `> ${line}`.trimEnd())
    .join('\n');
}

/** Markdown for a single section, used by the per-section copy button. */
export function sectionToMarkdown(section: PlanSection): string {
  return [`## ${section.title}`, '', ...section.items.map((item) => `- ${item}`)].join('\n');
}

/** Full plan as a Markdown document. Pure function. */
export function toMarkdown(plan: CampaignPlan): string {
  const { input } = plan;
  const lines: string[] = [
    `# Campaign plan: ${input.product}`,
    '',
    `- **Objective:** ${OBJECTIVE_LABELS[input.objective]}`,
    `- **Channel:** ${CHANNEL_LABELS[input.channel]}`,
    '',
    '**Audience**',
    '',
    quote(input.audience),
    '',
  ];

  if (input.context !== '') {
    lines.push('**Additional context**', '', quote(input.context), '');
  }

  for (const section of plan.sections) {
    lines.push(sectionToMarkdown(section), '');
  }

  lines.push('---', '', '_Generated from templates by Marketing Campaign Planner. Treat this as a starting draft._', '');
  return lines.join('\n');
}
