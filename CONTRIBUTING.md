# Contributing

Thanks for your interest. This project aims to stay small, readable and honest about what it does, so please keep changes focused.

## Setup

```bash
npm install
npm run dev
```

Node.js 20.19 or newer is required.

## Before you open a pull request

```bash
npm run typecheck
npm test
npm run build
```

All three should pass. CI runs the same checks.

## Good first contributions

- **Improve template wording** in `src/generator/templates.ts`. Keep advice practical, avoid claims about results, and avoid statistics you cannot source.
- **Fix bugs** or accessibility problems. Include steps to reproduce.
- **Add tests** for edge cases.

## Adding a channel or objective

1. Add the value to `CHANNELS` or `OBJECTIVES` and its label in `src/types.ts`.
2. TypeScript will now report a missing template. Add one in `src/generator/templates.ts`.
3. The form picks the new option up automatically. The generator test runs every objective and channel combination, so it covers the new value.

## Guidelines

- Keep dependencies minimal. Please open an issue before adding one.
- Do not use `innerHTML` with user-supplied text. Use the `el()` helper in `src/ui/dom.ts`.
- Keep functions small and names clear. Add comments only where they explain something non-obvious.
- Keep the interface accessible: labels on every control, visible focus, sensible keyboard behaviour.
- Larger features (accounts, storage, AI, analytics) should be discussed in an issue first, because they change the project's privacy and complexity.

## Reporting issues

Use the issue templates. For bugs, include your browser, what you did, what you expected and what happened.
