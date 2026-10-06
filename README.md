# pfx-password-generator

## Live

https://pfxamd.github.io/pfx-password-generator/

Open-source browser app for secure password and passphrase generation, powered
by `pfx-password-core`.

## Current application

- password generation with configurable character sets and exclusions;
- exact generation entropy and search-space display;
- caller-supplied passphrase wordlists with local text-file loading;
- bounded batch password generation;
- copy and regenerate controls;
- responsive visual interface;
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

## UI invariants

Generated passwords and passphrases are rendered through the shared
`SecretField` component. It is intentionally a fixed-height, single-line,
read-only text field. Long secrets remain on one line and overflow horizontally;
they must never wrap, increase the field height, or change the surrounding
layout geometry.

The browser release audit verifies this invariant with the maximum supported
password length.

## Privacy model

Generated secrets stay in the active browser context. The app does not include
analytics, telemetry, secret history, account storage, or a server dependency
for generation.

## License

Apache-2.0.
