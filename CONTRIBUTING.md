# Contributing to ccdrop

Thanks for your interest in ccdrop — a tiny CLI that makes it painless to **share Claude Code chats across computers with a 4-digit PIN**.

## Project facts

- **Language**: JavaScript (ES modules, Node.js ≥ 18)
- **CLI**: `bin/cli.js` (Commander.js)
- **Public relay**: `api/index.js` (Vercel serverless, RAM-only)
- **License**: MIT

## Setup

```bash
git clone https://github.com/ezzcodeezzlife/ccdrop.git
cd ccdrop
npm install
```

Run the CLI locally:

```bash
node bin/cli.js
```

Run the relay locally on `http://localhost:3000`:

```bash
node bin/cli.js server
```

Then point the CLI at it:

```bash
node bin/cli.js -s http://localhost:3000 share
```

## Project layout

```
bin/cli.js        # commander entrypoint
src/
  index.js        # command dispatch (share / receive / server)
  scanner.js      # enumerate Claude Code sessions from disk
  api.js          # POST share / GET receive over the relay
  ui.js           # chalk + boxen console UI
  desktop.js      # register the session with the Claude desktop app
  importer.js     # write the session into ~/.claude/projects/
api/
  index.js        # Vercel serverless relay (RAM-only)
```

## Pull request checklist

- [ ] Code is formatted (`npm run lint` if available)
- [ ] No secrets, tokens, or real session payloads are committed
- [ ] Public API changes are reflected in `README.md` and `--help` output
- [ ] Commits reference an issue if one exists

## Reporting bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:

- `node -v`
- OS and version
- Output of `npx ccdrop --version`
- A minimal reproduction

## Suggesting features

Open a [feature request](.github/ISSUE_TEMPLATE/feature_request.md). Tag it appropriately so it can be triaged.

## By participating, you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
