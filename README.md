<!--
SEO / social preview
Title and alt text below are picked up by GitHub's social card generator
and most external link preview bots (Twitter, Discord, Slack, LinkedIn).
-->

<div align="center">

# ccdrop

### Share Claude Code chats between computers in seconds — with a 4-digit PIN

**`npx ccdrop`** to share &nbsp;&nbsp;•&nbsp;&nbsp; **`npx ccdrop <PIN>`** to import &nbsp;&nbsp;•&nbsp;&nbsp; No accounts, no setup, no logs.

</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/ccdrop.svg?style=flat-square&logo=npm&label=npm)](https://www.npmjs.com/package/ccdrop)
[![npm downloads](https://img.shields.io/npm/dm/ccdrop.svg?style=flat-square&logo=npm&label=downloads)](https://www.npmjs.com/package/ccdrop)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/ccdrop.svg?style=flat-square&label=size)](https://bundlephobia.com/package/ccdrop)
[![GitHub stars](https://img.shields.io/github/stars/ezzcodeezzlife/ccdrop.svg?style=flat-square&logo=github)](https://github.com/ezzcodeezzlife/ccdrop/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ezzcodeezzlife/ccdrop.svg?style=flat-square&logo=github)](https://github.com/ezzcodeezzlife/ccdrop/network/members)
[![GitHub issues](https://img.shields.io/github/issues/ezzcodeezzlife/ccdrop.svg?style=flat-square&logo=github)](https://github.com/ezzcodeezzlife/ccdrop/issues)
[![GitHub license](https://img.shields.io/github/license/ezzcodeezzlife/ccdrop.svg?style=flat-square)](https://github.com/ezzcodeezzlife/ccdrop/blob/master/LICENSE)
[![Node.js](https://img.shields.io/node/v/ccdrop.svg?style=flat-square&logo=node.js&label=node)](https://nodejs.org)
[![Vercel](https://img.shields.io/badge/deploy-vercel-black.svg?style=flat-square&logo=vercel)](https://claude-chat-share.vercel.app)
[![Powered by RAM only](https://img.shields.io/badge/storage-RAM--only-ff3366.svg?style=flat-square)](https://github.com/ezzcodeezzlife/ccdrop#privacy)
[![Privacy](https://img.shields.io/badge/privacy-no%20logs-blueviolet.svg?style=flat-square)](https://github.com/ezzcodeezzlife/ccdrop#privacy)
[![Made with Node.js](https://img.shields.io/badge/made%20with-Node.js-339933.svg?style=flat-square&logo=node.js)](https://nodejs.org)

</div>

<div align="center">

[**npm**](https://www.npmjs.com/package/ccdrop) · [**GitHub**](https://github.com/ezzcodeezzlife/ccdrop) · [**Report a bug**](https://github.com/ezzcodeezzlife/ccdrop/issues) · [**Sponsor**](https://github.com/sponsors/ezzcodeezzlife)

</div>

---

**ccdrop** is a zero-friction CLI for **[Claude Code](https://claude.ai)** by **[Anthropic](https://www.anthropic.com)**. Pick a chat session, get a **4-digit PIN**, run `npx ccdrop <PIN>` on any other computer — the session lands in `~/.claude/projects/` and shows up in Claude Code's session list after a restart. The session is retargeted to the current working directory on the way in, so it resumes cleanly across machines and operating systems.

If you've ever wanted to **share a Claude Code chat**, **move a Claude Code session between computers**, **back up an important AI conversation**, or **hand off a debugging session** to a teammate, ccdrop is the fastest way to do it.

---

## Why ccdrop?

- **One command** — `npx ccdrop` on both sides, no config files, no accounts.
- **4-digit PIN transfer** — way faster than copy-pasting a chat transcript or scp-ing a JSON file.
- **Cross-platform** — works between macOS, Linux, and Windows. Sender's cloud-sync metadata is stripped on import.
- **Privacy by default** — RAM-only relay, auto-deleted on download, 15-minute expiry, no accounts, no logs.
- **Self-hostable** — point ccdrop at your own Vercel-deployable relay and every byte stays on infrastructure you control.
- **Open source** — MIT licensed, single dependency footprint, written for transparency.

## Table of Contents

- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Commands](#commands)
- [Privacy](#privacy)
- [Self-hosting](#self-hosting)
- [Tags & Topics](#tags--topics)
- [Links](#links)
- [License](#license)

## Quick start

```bash
npx ccdrop
```

Then, on the other computer:

```bash
npx ccdrop 4829
```

That's the whole interface.

## How it works

1. **Share** — run `npx ccdrop` on the computer with the chat, pick the session, get a 4-digit PIN.
2. **Import** — run `npx ccdrop <PIN>` on the other computer. The session lands in `~/.claude/projects/` and is registered with Claude Code, where it appears after a restart.

The chat is retargeted at the current directory on the way in, so a session shared from another machine — or another operating system — resumes cleanly. The sender's cloud-sync records are stripped.

## Commands

| Command | Description |
| :--- | :--- |
| `npx ccdrop` | Select a Claude Code chat session and get a 4-digit transfer PIN |
| `npx ccdrop <code>` | Download and import a Claude Code chat session using the PIN |
| `npx ccdrop share` | Same as no args; explicit share mode |
| `npx ccdrop receive <code>` | Same as `npx ccdrop <code>`; explicit receive mode |
| `npx ccdrop server` | Run a local self-hosted relay server on `http://localhost:3000` |
| `npx ccdrop server -p 8080` | Run the self-hosted relay on a custom port |
| `npx ccdrop -s <url>` | Point the client at a custom relay URL |

## Privacy

The session is uploaded to a small relay server so the second computer can fetch it.

- **RAM only** — sessions live in an in-memory `Map` (no database, no disk, no backups).
- **Auto-deleted on download** — the payload is wiped from memory the instant the receiver grabs it.
- **15-minute expiry** — even if nobody downloads it, the PIN self-destructs after 15 minutes.
- **No accounts, no logs** — there is no way to associate a PIN with a person.
- **No telemetry** — ccdrop does not phone home. It only talks to the relay you point it at.

## Self-hosting

By default `npx ccdrop` uses the public relay. Run your own to keep every byte on a machine you control.

### Run the relay locally

```bash
npx ccdrop server                  # relay on http://localhost:3000
npx ccdrop server -p 8080          # custom port
```

The relay stores everything in RAM and wipes each session the moment it is downloaded.

### Point the client at your relay

```bash
npx ccdrop -s http://localhost:3000               # share to your local relay
npx ccdrop -s http://localhost:3000 4829          # import from your local relay
```

Replace `localhost` with your server's LAN IP, hostname, or public URL as needed.

### Deploy to Vercel

```bash
npm run deploy     # uses `vercel --prod`
```

Then point clients at your deployment:

```bash
npx ccdrop -s https://your-app.vercel.app
```

## Tags & Topics

`ccdrop`, `claude`, `claude-code`, `claude-ai`, `anthropic`, `claude-chat`, `ai-tools`, `ai-coding`, `ai-coding-assistant`, `developer-tools`, `cli`, `cli-tool`, `nodejs`, `npm`, `npx`, `vercel`, `serverless`, `chat-share`, `chat-transfer`, `session-share`, `session-transfer`, `privacy`, `ephemeral`, `ram-only`, `pin-code`, `cross-computer`, `multi-device`, `share`, `transfer`, `import`, `export`, `sync`, `relay`, `qr-code`, `pin`, `no-logs`

## Related tools

- **[Claude Code](https://claude.ai)** — the AI coding assistant by Anthropic that this tool is built for.
- **[Claude Desktop](https://claude.ai/download)** — the desktop client whose session storage ccdrop reads from and writes to.

## Contributing

Contributions are welcome! See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for setup, conventions, and how to run the test suite.

By participating, you agree to abide by the project's [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

## Security

Found a vulnerability? Please review [`SECURITY.md`](./SECURITY.md) for responsible disclosure instructions before opening a public issue.

## Links

- **GitHub**: https://github.com/ezzcodeezzlife/ccdrop
- **npm**: https://www.npmjs.com/package/ccdrop
- **Issues**: https://github.com/ezzcodeezzlife/ccdrop/issues
- **Sponsors**: https://github.com/sponsors/ezzcodeezzlife

## License

[MIT](./LICENSE) — Copyright (c) ezzcodeezzlife and contributors.
