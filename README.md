# Marketing Campaign Planner

A small, open-source web tool that turns basic campaign information into a structured first-draft marketing plan.

You describe what you are promoting, who it is for, what you want to achieve, and where the campaign will run. The tool returns a plan with a summary, audience notes, core message, content ideas, calls to action, a simple campaign structure, success metrics and next steps. You can copy the plan or download it as Markdown.

## Status

This is an **early draft (version 0.1.0)**. It is a deliberately small first version.

- Version 0.1.0 is an early draft release.
- There is no usage data, user base or community to report. Nothing in this repository claims otherwise.
- Everything listed under [Roadmap](#roadmap) is planned or possible, not implemented.

## What it does

- Collects six inputs: product or service, target audience, objective, channel, main message, and optional context.
- Validates them with clear, specific error messages.
- Generates a plan **instantly, in your browser**, from fixed templates keyed by objective and channel.
- Lets you copy the whole plan or a single section, and download the plan as a Markdown file.
- Works with keyboard and screen readers, on phones and desktops, in light and dark mode.

## What it does not do

- **It does not use AI.** The plan comes from hand-written templates filled in with your input. The output is a structured starting point, not tailored strategy or expert advice, and it will feel generic for unusual cases.
- **It does not send your data anywhere.** There is no server, no analytics and no third-party request. The app is static files.
- **It does not save anything.** Reload the page and your input is gone.
- English only for now.

## Quick start

Requirements: [Node.js](https://nodejs.org/) 20.19 or newer.

```bash
git clone https://github.com/<ArdalanHK>/marketing-campaign-planner.git
cd marketing-campaign-planner
npm install
npm run dev
```

Then open the address printed in the terminal (usually http://localhost:5173).

### Other commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | Type-check the code without building |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |

## Using the tool

1. Fill in the form. Use **Fill with an example** to see how it works.
2. Write the product and audience so they read naturally inside a sentence, for example "a refillable water bottle" and "first-time home buyers in their thirties". The templates insert your text as written.
3. Select **Generate plan**.
4. Review the plan. Use **Copy** on a section, **Copy plan** for everything, or **Download as Markdown**.
5. Use **Edit inputs** to adjust and regenerate, or **Start over** to clear the form.

Treat the result as a draft. Rewrite whatever does not fit your situation.

## How the plan is generated

The generator is a pure function: the same input always gives the same plan. Wording lives in `src/generator/templates.ts`, separate from logic, with one template per objective (5) and one per channel (7). To see or improve what the tool says, edit that file.

Supported objectives: brand awareness, lead generation, sales, engagement, customer retention.
Supported channels: Instagram, LinkedIn, email, search ads, YouTube, TikTok, blog / SEO.

See [docs/architecture.md](docs/architecture.md) for the design and how to extend it.

## Project structure

```
src/
  main.ts             Entry point
  types.ts            Shared types and option lists
  validation.ts       Input validation and normalisation
  generator/          Template content and the plan generator
  export/markdown.ts  Markdown output
  ui/                 Form, results view and browser actions
  styles.css
tests/                Unit and UI tests (Vitest)
docs/                 Architecture notes
```

## Privacy and security

- All processing happens locally in the browser.
- User text is only ever inserted into the page as plain text, never as HTML.
- There are no API keys or environment variables, because there is no backend.

If you find a security issue, please open an issue describing it without sensitive details, or contact the maintainer directly through their GitHub profile.

## Roadmap

Ideas for later versions. None of these exist yet, and their order is not fixed.

- More templates and better wording, including additional channels
- Persian and other languages, including right-to-left layout
- Optional AI-assisted generation (this would need a backend or a bring-your-own-key design)
- Content calendar, audience persona builder, PDF export
- Saved campaigns

## Contributing

Contributions are welcome, especially better template wording and bug reports. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
