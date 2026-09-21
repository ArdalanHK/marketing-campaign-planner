/** Shared data types and the fixed option lists used by the form and the generator. */

export const OBJECTIVES = ['awareness', 'leads', 'sales', 'engagement', 'retention'] as const;
export type Objective = (typeof OBJECTIVES)[number];

export const CHANNELS = [
  'instagram',
  'linkedin',
  'email',
  'search-ads',
  'youtube',
  'tiktok',
  'blog-seo',
] as const;
export type Channel = (typeof CHANNELS)[number];

export const OBJECTIVE_LABELS: Record<Objective, string> = {
  awareness: 'Brand awareness',
  leads: 'Lead generation',
  sales: 'Sales',
  engagement: 'Engagement',
  retention: 'Customer retention',
};

export const CHANNEL_LABELS: Record<Channel, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  email: 'Email',
  'search-ads': 'Search ads',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  'blog-seo': 'Blog / SEO',
};

/** Validated, normalised user input. */
export interface CampaignInput {
  product: string;
  audience: string;
  objective: Objective;
  channel: Channel;
  message: string;
  /** Optional extra context; empty string when not provided. */
  context: string;
}

export interface PlanSection {
  id: string;
  title: string;
  items: string[];
}

export interface CampaignPlan {
  input: CampaignInput;
  sections: PlanSection[];
}

/**
 * Anything that can turn an input into a plan.
 * The built-in generator is synchronous; the return type allows a future
 * asynchronous implementation (e.g. one backed by an AI service) without UI changes.
 */
export type PlanGenerator = (input: CampaignInput) => CampaignPlan | Promise<CampaignPlan>;
