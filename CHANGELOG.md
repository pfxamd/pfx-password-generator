# Changelog

## 0.1.0 - 2026-10-06

### Added

- Browser-only password generation powered by `pfx-password-core v0.1.1`.
- Configurable length, character sets, exclusions, ambiguous-character filtering,
  and minimum composition rules.
- Exact generation entropy and search-space reporting from the core.
- Passphrase generation from caller-supplied local wordlists.
- Local plain-text wordlist loading with duplicate normalization.
- Batch password generation with preserved duplicate outputs.
- Copy, copy-all, and regenerate controls.
- Responsive dark interface for desktop and mobile.
- Keyboard-accessible generator tabs and labeled interactive controls.
- GitHub Pages deployment from `main`.
- Unit, browser, release-audit, mobile-overflow, clipboard, privacy, and boundary
  tests.

### Security

- Secret generation is performed locally in the browser.
- No application telemetry, analytics, accounts, secret persistence, or
  generation API.
- Web Crypto randomness is provided through `pfx-password-core`.
- Password and passphrase generation use the operational limits enforced by the
  core.
- This release has not undergone an independent security audit.
