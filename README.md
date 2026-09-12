# claude-chat-share

CLI tool to transfer Claude Code chat sessions between computers and accounts using a 4-digit PIN code.

## Quick Start

### 1. Share a Chat (Sender)
Run on the computer with the chat session:

```bash
npx claude-chat-share
```

Select a local Claude Code chat session. You will receive a 4-digit PIN code (for example: 4829).

### 2. Import a Chat (Receiver)
Run on the destination computer:

```bash
npx claude-chat-share 4829
```

Downloads the session payload and imports it into your local Claude environment (`~/.claude/projects/`).

The session payload is deleted from the server immediately after download.

## Commands

| Command | Description |
| :--- | :--- |
| `npx claude-chat-share` | Select a chat session and get a 4-digit PIN |
| `npx claude-chat-share <code>` | Download and import a chat using the PIN |
| `npx claudeshare` | Alias for `claude-chat-share` |
| `npx ccs` | Short alias for `claude-chat-share` |
| `npx cdrop` | Short alias for `claude-chat-share` |

## License
MIT
