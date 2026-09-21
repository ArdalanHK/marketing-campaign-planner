import { describe, expect, it } from 'vitest';
import { generatePlan } from '../src/generator';
import { sectionToMarkdown, toMarkdown } from '../src/export/markdown';
import type { CampaignPlan } from '../src/types';
import { validInput } from './fixtures';

const plan = generatePlan(validInput) as CampaignPlan;

describe('toMarkdown', () => {
  it('starts with a title and includes the objective and channel', () => {
    const markdown = toMarkdown(plan);
    expect(markdown.startsWith(`# Campaign plan: ${validInput.product}\n`)).toBe(true);
    expect(markdown).toContain('**Objective:** Brand awareness');
    expect(markdown).toContain('**Channel:** Instagram');
  });

  it('renders every section as a heading with bullet items', () => {
    const markdown = toMarkdown(plan);
    for (const section of plan.sections) {
      expect(markdown).toContain(`## ${section.title}`);
      for (const item of section.items) {
        expect(markdown).toContain(`- ${item}`);
      }
    }
  });

  it('quotes multi-line context and omits the block when empty', () => {
    const withContext = toMarkdown({ ...plan, input: { ...plan.input, context: 'First line\nSecond line' } });
    expect(withContext).toContain('> First line\n> Second line');
    expect(toMarkdown(plan)).not.toContain('Additional context');
  });

  it('ends with a single trailing newline', () => {
    const markdown = toMarkdown(plan);
    expect(markdown.endsWith('\n')).toBe(true);
    expect(markdown.endsWith('\n\n')).toBe(false);
  });
});

describe('sectionToMarkdown', () => {
  it('renders one section on its own', () => {
    const section = plan.sections[0]!;
    const markdown = sectionToMarkdown(section);
    expect(markdown.startsWith(`## ${section.title}\n\n- `)).toBe(true);
  });
});
