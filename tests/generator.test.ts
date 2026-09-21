import { describe, expect, it } from 'vitest';
import { generatePlan } from '../src/generator';
import { CHANNELS, OBJECTIVES, type CampaignInput, type CampaignPlan } from '../src/types';
import { validInput } from './fixtures';

const SECTION_IDS = [
  'summary',
  'audience',
  'message',
  'content-ideas',
  'cta',
  'structure',
  'metrics',
  'next-steps',
];

// The built-in generator is synchronous, so the result can be used directly.
const plan = (input: CampaignInput): CampaignPlan => generatePlan(input) as CampaignPlan;

describe('generatePlan', () => {
  for (const objective of OBJECTIVES) {
    for (const channel of CHANNELS) {
      it(`produces a complete plan for ${objective} on ${channel}`, () => {
        const result = plan({ ...validInput, objective, channel });
        expect(result.sections.map((section) => section.id)).toEqual(SECTION_IDS);
        for (const section of result.sections) {
          expect(section.title.length).toBeGreaterThan(0);
          expect(section.items.length).toBeGreaterThan(0);
          for (const item of section.items) {
            expect(item.trim().length).toBeGreaterThan(0);
            // No template placeholder should survive into the output.
            expect(item).not.toMatch(/\{(product|audience|message)\}/);
          }
        }
      });
    }
  }

  it('uses the user input in the summary and core message', () => {
    const result = plan(validInput);
    const summary = result.sections.find((section) => section.id === 'summary');
    const message = result.sections.find((section) => section.id === 'message');
    expect(summary?.items[0]).toContain(validInput.product);
    expect(summary?.items[0]).toContain('Instagram');
    expect(message?.items[0]).toContain(validInput.message);
  });

  it('is deterministic', () => {
    expect(plan(validInput)).toEqual(plan(validInput));
  });

  it('includes context only when provided', () => {
    const without = plan(validInput).sections[0]?.items.join(' ') ?? '';
    const withContext = plan({ ...validInput, context: 'Small budget.\nSpring launch.' }).sections[0]?.items.join(' ') ?? '';
    expect(without).not.toContain('Context to keep in mind');
    expect(withContext).toContain('Context to keep in mind: Small budget. Spring launch.');
  });

  it('does not expand placeholder-like text typed by the user', () => {
    const result = plan({ ...validInput, product: 'Acme {message}', message: '{product} rocks' });
    const message = result.sections.find((section) => section.id === 'message');
    expect(message?.items[0]).toBe('"{product} rocks"');
    const ideas = result.sections.find((section) => section.id === 'content-ideas');
    expect(ideas?.items.join(' ')).toContain('Acme {message}');
  });
});
