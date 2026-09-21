# Architecture

Marketing Campaign Planner is a static, client-side web app. There is no backend, database or external service. This document explains how it is organised, why, and how to extend it.

## Overview

```
 form (ui/form.ts)
     │  raw strings
     ▼
 validateInput (validation.ts)  ── errors ──► shown inline and in the error summary
     │  CampaignInput
     ▼
 PlanGenerator (types.ts)  ◄── default: generatePlan (generator/index.ts + templates.ts)
     │  CampaignPlan
     ▼
 results view (ui/results.ts) ──► toMarkdown (export/markdown.ts) ──► copy / download
```

Each arrow is a plain function call with plain data. Only `src/ui/` touches the DOM. Validation, generation and Markdown export are pure functions and are tested without a browser.

## Modules

| Path | Responsibility |
| --- | --- |
| `src/types.ts` | Shared types, the fixed lists of objectives and channels, display labels, and the `PlanGenerator` type. |
| `src/validation.ts` | Cleans raw input (whitespace, control characters), checks required fields, enforces length limits, and returns either a `CampaignInput` or per-field errors. |
| `src/generator/templates.ts` | All wording, as data. One `ObjectiveTemplate` per objective and one `ChannelTemplate` per channel. |
| `src/generator/index.ts` | `generatePlan`: combines the templates with the input into a `CampaignPlan` made of titled sections. |
| `src/export/markdown.ts` | Converts a plan (or one section) to Markdown. |
| `src/ui/dom.ts` | `el()`, a small element factory that only ever creates text nodes from strings. |
| `src/ui/form.ts`, `fields.ts` | Builds the form from a field configuration, handles errors, counters and the example. |
| `src/ui/results.ts` | Builds the results view and copy feedback. |
| `src/ui/app.ts` | Wires everything together: submit flow, view switching, focus management, status announcements. |
| `src/ui/actions.ts` | Clipboard and file download, isolated so they are easy to stub. |

## Data model

```ts
interface CampaignInput {
  product: string; audience: string; objective: Objective;
  channel: Channel; message: string; context: string;
}
interface PlanSection { id: string; title: string; items: string[] }
interface CampaignPlan { input: CampaignInput; sections: PlanSection[] }
```

Nothing is persisted. A plan is a list of generic sections, so the renderer and the exporter need no change when a section is added.

## Decisions

**Static and client-side.** Nothing in the requirements needs a server. Staying static means no hosting cost, no secrets, no data handling, and a one-command setup.

**Templates instead of AI.** Templates are free, instant, offline, private and deterministic, which also makes them easy to test. The trade-off is that output quality depends entirely on the wording in `templates.ts` and can feel generic. AI generation could be added later, but it would require either a backend that holds the API key or a bring-your-own-key design, and it would send user input to a third party. That is a significant change to the privacy story, so it should be an explicit decision.

**Vite and TypeScript, no UI framework.** The interface is one form and one results view. TypeScript makes the data model explicit and lets the compiler enforce that every objective and channel has a template. Vite provides the dev server, the build and Vitest. A framework would add concepts and dependencies this size of app does not need.

**Plain CSS, system fonts.** No CSS framework and no web fonts, so the page makes no third-party requests and the privacy statement stays true.

**No persistence.** Storing input would require disclosure and a way to clear it. It can be added later behind an explicit user action.

## Extending

**New channel or objective.** Add it to `src/types.ts` and add its template. The compiler reports what is missing. See `CONTRIBUTING.md`.

**Different generator.** `PlanGenerator` is `(input) => CampaignPlan | Promise<CampaignPlan>`. `mountApp(root, { generator })` accepts any implementation, and the UI already awaits the result. An AI-backed generator would fit here. It would also need a loading state and error messages for network failures, which the current UI does not have because generation is instant.

**Other languages.** Template text is already separate from logic. To add a language, provide translated templates, translate the UI strings in `src/ui/`, and add right-to-left styling for Persian and similar scripts. This is not implemented.

## Security

- User text reaches the page only through `textContent`/text nodes (`el()`), never `innerHTML`. A test covers markup-like input.
- Input is normalised and length-limited before use.
- The Markdown export writes user text as-is. It is the user's own text in the user's own file, but if you paste it into a system that renders Markdown or HTML, review it first.
- There are no secrets, no network requests and no cookies.

## Accessibility

- Every control has a visible `label`, help text and an error element linked by `aria-describedby`.
- Failed submits show a focusable error summary with links to each field, and mark fields `aria-invalid`.
- Copy and download results are announced through a polite live region.
- Focus moves to the results heading after a plan is generated and back to the form when editing.
- Visible focus styles, colour contrast chosen to meet WCAG AA in both themes, touch targets sized for coarse pointers, and no essential information carried by colour alone.

## Known limitations

- Output is generic by design.
- Interpolated text is inserted as written, so it reads best if the product and audience are phrased to fit inside a sentence (the form says so).
- English only, and left-to-right layout only.
