# Security Policy

## Supported version

The current pre-1.0 release line is:

```text
0.1.x
```

Security fixes target the latest development state and, when appropriate, a new
patch release.

## Reporting a vulnerability

Please avoid opening a public issue for a vulnerability that could expose
generated secrets, weaken randomness, bypass validation, or otherwise affect
security-sensitive behavior.

Use GitHub private vulnerability reporting for this repository when available.

Include enough detail to reproduce and understand the issue without including
real passwords, passphrases, credentials, private wordlists, or other secrets.

## Security model

The application is designed to generate secrets locally in the browser and does
not require a generation server. It does not intentionally store generated
secrets in local storage, session storage, analytics, telemetry, or application
logs.

Security-sensitive generation and entropy calculations are delegated to
`pfx-password-core v0.1.1`.

The application and its core dependency have not undergone an independent
security audit. Pre-1.0 behavior and APIs may change as the project is hardened
and reviewed.
