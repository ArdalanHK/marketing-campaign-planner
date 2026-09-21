/**
 * Template content for the built-in generator.
 *
 * All wording lives here, separate from logic, so content can be improved
 * (or translated) without touching code. Placeholders:
 *   {product}  {audience}  {message}
 * are replaced with the user's (normalised) input.
 *
 * TypeScript enforces completeness: adding a value to OBJECTIVES or CHANNELS
 * fails to compile until a matching template is added below.
 */
import type { Channel, Objective } from '../types';

export interface ObjectiveTemplate {
  /** One-sentence statement of what the campaign is trying to achieve. */
  goal: string;
  /** Channel-independent content ideas that support this objective. */
  ideas: string[];
  /** Suggested calls to action. */
  ctas: string[];
  /** Ways to measure whether the objective was reached. */
  metrics: string[];
  /** What to do when launching, for this objective. */
  launchStep: string;
  /** What to review afterwards, for this objective. */
  reviewStep: string;
}

export interface ChannelTemplate {
  /** Channel-specific content ideas. */
  ideas: string[];
  /** Guidance on tone and style for the channel. */
  tone: string;
  /** Preparation step specific to the channel. */
  setupStep: string;
  /** Launch step specific to the channel. */
  launchStep: string;
}

export const OBJECTIVE_TEMPLATES: Record<Objective, ObjectiveTemplate> = {
  awareness: {
    goal: 'Make {audience} aware of {product}.',
    ideas: [
      'Explain in one clear sentence what {product} is and who it is for, and reuse that sentence across all content.',
      'Describe the problem {audience} faces in their own words before mentioning {product}.',
      'Share a short behind-the-scenes look at how {product} is made or delivered.',
    ],
    ctas: [
      'Follow or subscribe to see more about {product}.',
      'Share this with someone who would find it useful.',
      'Learn more about {product}.',
      'Save this for later.',
    ],
    metrics: [
      'Reach and impressions',
      'Follower or subscriber growth',
      'Direct or branded-search visits',
      'Video views or content saves',
    ],
    launchStep:
      'Publish an introductory piece that states the core message clearly, followed by a few related pieces in quick succession so the audience sees a pattern.',
    reviewStep:
      'Check reach and audience growth to see whether more of {audience} are encountering the message.',
  },
  leads: {
    goal: 'Collect enquiries or contact details from {audience} who are interested in {product}.',
    ideas: [
      'Offer a useful free resource (guide, checklist or template) that helps {audience} with a problem {product} relates to.',
      'Show a short example of the result {audience} could get from {product}, followed by a clear way to ask for more.',
      'Answer the questions {audience} typically ask before getting in touch.',
    ],
    ctas: [
      'Download a free guide related to {product}.',
      'Book a short call or demo.',
      'Request a quote or more information.',
      'Join the waiting list or newsletter.',
    ],
    metrics: [
      'Number of sign-ups or enquiries',
      'Conversion rate from visit to sign-up',
      'Cost per lead (if you are spending money)',
      'Lead quality: how many respond or turn out to be a good fit',
    ],
    launchStep: 'Publish the offer with a single, clearly visible way to respond.',
    reviewStep:
      'Compare how many people saw the offer with how many responded, and check whether the responses come from the right people.',
  },
  sales: {
    goal: 'Turn interest from {audience} into purchases of {product}.',
    ideas: [
      'State the main benefit of {product} for {audience} and back it with a concrete detail or example.',
      'Address the most likely hesitation {audience} may have before buying, such as price, trust or fit.',
      'Show real use or results of {product}, using only what you can honestly demonstrate.',
    ],
    ctas: [
      'Buy {product} now.',
      'Get started today.',
      'Claim the current offer (only if you have one).',
      'See pricing and options.',
    ],
    metrics: [
      'Number of purchases',
      'Conversion rate from visit to purchase',
      'Revenue and average order value',
      'Cost per acquisition (if you are spending money)',
    ],
    launchStep:
      'Publish the offer with a direct purchase path, and check that every buying step works before promoting it.',
    reviewStep:
      'Look at where people drop off between seeing the offer and buying, and fix the biggest gap first.',
  },
  engagement: {
    goal: 'Encourage {audience} to interact with content about {product}.',
    ideas: [
      'Ask {audience} a simple question connected to your message and reply to the answers.',
      'Run a poll comparing two options related to {product}.',
      'Invite {audience} to share their own stories or examples, and feature some of them with permission.',
    ],
    ctas: [
      'Tell us what you think in the comments.',
      'Vote in the poll.',
      'Share your own experience with {product}.',
      'Tag someone who would enjoy this.',
    ],
    metrics: [
      'Comments, replies and shares',
      'Engagement rate per piece of content',
      'Saves or bookmarks',
      'Number of returning viewers or readers',
    ],
    launchStep: 'Publish interactive content and be ready to reply to responses quickly.',
    reviewStep: 'See which questions and formats prompted the most replies, and reuse them.',
  },
  retention: {
    goal: 'Keep {audience} engaged with {product} after their first purchase or sign-up.',
    ideas: [
      'Share tips that help {audience} get more value from {product}.',
      'Send a thank-you or "what is new" update that reminds them why {product} is useful.',
      'Ask for feedback and show what changed because of it.',
    ],
    ctas: [
      'Try a feature you have not used yet.',
      'Share feedback to help improve {product}.',
      'Refer a friend.',
      'Come back and see what is new.',
    ],
    metrics: [
      'Repeat purchase or return rate',
      'Churn or unsubscribe rate',
      'Feedback and survey responses',
      'Number of referrals',
    ],
    launchStep:
      'Reach existing customers first, and keep the message personal and useful rather than purely promotional.',
    reviewStep:
      'Track how many existing customers return, and collect their feedback on what would keep them.',
  },
};

export const CHANNEL_TEMPLATES: Record<Channel, ChannelTemplate> = {
  instagram: {
    ideas: [
      'A short video showing {product} in use, with the core message as the opening line.',
      'A carousel post that breaks "{message}" into three or four simple points.',
      'Stories with a poll or question box asking {audience} about their biggest challenge.',
    ],
    tone: 'Visual first: lead with a strong image or the opening seconds of a video.',
    setupStep: 'Check that the profile bio says what {product} is and includes a link.',
    launchStep: 'Post a mix of feed posts and Stories rather than relying on a single format.',
  },
  linkedin: {
    ideas: [
      'A text post that opens with a specific problem {audience} deals with and ends with a question.',
      'A short case-style post explaining how {product} addresses that problem.',
      'A document or carousel post that summarises "{message}" in a few slides.',
    ],
    tone: 'Professional and specific: concrete detail works better than slogans.',
    setupStep: 'Make sure the company page or personal profile clearly states what you offer.',
    launchStep: 'Post at a steady pace and reply to comments, since conversation extends the reach of a post.',
  },
  email: {
    ideas: [
      'An introduction email that explains {product} in a few sentences.',
      'A short story or example email that shows "{message}" in practice.',
      'A follow-up email with one clear link and one clear request.',
    ],
    tone: 'Personal and concise: one message, one link and one request per email.',
    setupStep:
      'Confirm you have permission to email each recipient, and include a clear way to unsubscribe.',
    launchStep: 'Send a first email, then a short follow-up to people who did not open or respond.',
  },
  'search-ads': {
    ideas: [
      'Several ad headline variations that state the main benefit of {product} in plain words.',
      'Ad descriptions that address a specific need of {audience} and repeat "{message}".',
      'A landing page section that matches the ad wording so visitors see the same promise.',
    ],
    tone: 'Direct and literal: people search with intent, so use the words they use.',
    setupStep: 'List the phrases {audience} would type when looking for something like {product}.',
    launchStep: 'Start with a small budget and a few ad variations so you can compare them.',
  },
  youtube: {
    ideas: [
      'A short explainer video answering the most common question about {product}.',
      'A demonstration video showing {product} solving a real problem for {audience}.',
      'A title and description that state "{message}" in the first line.',
    ],
    tone: 'Lead with the value in the first seconds and keep the structure simple.',
    setupStep: 'Plan titles and thumbnails together so they tell the same story.',
    launchStep: 'Publish the first video with a clear description and a link to the next step.',
  },
  tiktok: {
    ideas: [
      'A short video that opens with a hook aimed at {audience} and shows {product} within a few seconds.',
      'A quick tip or myth-busting clip related to "{message}".',
      'A follow-up video that answers a question from a comment.',
    ],
    tone: 'Informal and quick to the point; polished production is optional.',
    setupStep: 'Look at how similar accounts open their videos and note what holds attention.',
    launchStep: 'Publish several short videos in the first weeks to see which hooks work.',
  },
  'blog-seo': {
    ideas: [
      'A how-to article that answers the main question {audience} has about the topic {product} relates to.',
      'A checklist or comparison article that helps readers decide what they need.',
      'A page that explains "{message}" with examples and a clear next step.',
    ],
    tone: 'Clear and useful: answer the reader\'s question early and organise the page with headings.',
    setupStep: 'Choose a main topic or search phrase for each article before writing.',
    launchStep: 'Publish the first articles and link them to each other and to {product}.',
  },
};
