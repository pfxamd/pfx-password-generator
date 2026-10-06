# pfx-password-generator

Open-source browser app for secure password and passphrase generation, powered
by `pfx-password-core`.

## Current application

- password generation with configurable character sets and exclusions;
- exact generation entropy and search-space display;
- caller-supplied passphrase wordlists with local text-file loading;
- bounded batch password generation;
- copy and regenerate controls;
- responsive dark interface;
- no accounts, telemetry, secret persistence, or generation server.

Security-sensitive generation and entropy logic remain in
`pfx-password-core v0.1.1`. The application layer does not reimplement the
random sampler.

## Stack

- React 19
- TypeScript 5.9
- Vite 8
- CSS Modules
- Vitest
- Playwright
- ESLint
- Prettier

## Development

Requires Node.js 22.13 or newer and npm 11.

```bash
npm ci
npm run check
npm run test:e2e
```

## Architecture

```text
src/
  app/
  components/
  config/
  features/
  hooks/
  services/
  styles/
  types/
  utils/
```

## Privacy model

Generated secrets stay in the active browser context. The app does not include
analytics, telemetry, secret history, account storage, or a server dependency
for generation.

## License

Apache-2.0.
