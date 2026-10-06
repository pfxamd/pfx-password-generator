# pfx-password-generator

Open-source web app for secure password and passphrase generation, powered by
`pfx-password-core`.

## Foundation

- React + TypeScript + Vite
- `pfx-password-core` pinned to `v0.1.1`
- local-only secret generation
- no telemetry, analytics, persistence, or server dependency for generation
- Vitest unit coverage
- Playwright browser smoke coverage
- ESLint + Prettier

The current UI is intentionally minimal. The repository is being established
and verified before interface design work begins.

## Development

Requires Node.js 22.13 or newer and npm 11.

```bash
npm install
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
```

Application components do not implement password-generation algorithms. The
security-sensitive generation and entropy logic is delegated to
`pfx-password-core`.

## License

Apache-2.0.
