# Security Policy

## Supported Versions

The latest released version of `ccdrop` is the only version that receives security updates. Please always upgrade to the latest version before reporting a vulnerability.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| < latest| :x:                |

## Reporting a Vulnerability

**Please do not file a public issue.** Send security reports privately:

- **Email**: open a private security advisory at https://github.com/ezzcodeezzlife/ccdrop/security/advisories/new
- Or DM via GitHub: https://github.com/ezzcodeezzlife

Please include:

1. A clear description of the vulnerability and impact.
2. Steps to reproduce or a proof-of-concept.
3. The version of `ccdrop`, Node.js, and OS.
4. Any known workarounds.

We aim to acknowledge reports within 72 hours and ship a fix or mitigation as soon as practical.

## Privacy and the Relay

The public relay (`https://claude-chat-share.vercel.app`) is RAM-only: sessions are wiped the instant a download completes, and otherwise expire within 15 minutes. No logs are retained.

If your threat model requires that no byte ever touches infrastructure you do not control, run your own relay:

```bash
npx ccdrop server
```

...or deploy `api/index.js` to Vercel / any Node 18+ host and point `ccdrop` at it with `-s <url>`.
