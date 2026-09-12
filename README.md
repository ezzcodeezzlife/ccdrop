# ccdrop

**Super easy way to copy a Claude Code chat between computers**: upload it to a small RAM-only server, get a 4-digit PIN, then run `npx ccdrop <PIN>` on the other machine. The session is auto-deleted from the server the instant it lands.

```bash
npx ccdrop
```

Share: pick a session, get a 4-digit PIN, then `npx ccdrop <PIN>` on the other computer to import.

No accounts. No login. No setup.

## How it works

1. **Share**: run `npx ccdrop` on the computer with the chat, pick the session, get a 4-digit PIN.
2. **Import**: run `npx ccdrop <PIN>` on the other computer. The session lands in `~/.claude/projects/`.

## Privacy

The session is uploaded to a small relay server so the second computer can fetch it.

- **RAM only**: sessions live in an in-memory store (no database, no disk, no backups).
- **Auto-deleted on download**: the payload is wiped from memory the instant the receiver grabs it.
- **15-minute expiry**: even if nobody downloads it, the PIN self-destructs after 15 minutes.
- **No accounts, no logs**: there is no way to associate a PIN with a person.

## Commands

| Command | Description |
| :--- | :--- |
| `npx ccdrop` | Select a chat session and get a 4-digit PIN |
| `npx ccdrop <code>` | Download and import a chat using the PIN |

## License

MIT
