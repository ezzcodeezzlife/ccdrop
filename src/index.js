import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { scanClaudeSessions } from './scanner.js';
import { importClaudeSession, exportSessionToMarkdown } from './importer.js';
import { uploadSession, downloadSession } from './api.js';
import {
  selectSessionPrompt,
  displayTransferCode,
  promptForCode
} from './ui.js';
import shareHandler from '../api/share.js';
import receiveHandler from '../api/receive.js';
import indexHandler from '../api/index.js';

/**
 * Handle interactive sharing (sender side)
 */
export async function runShareCommand(options = {}) {
  const sessions = scanClaudeSessions();

  const selectedSession = await selectSessionPrompt(sessions);
  if (!selectedSession) return;

  const content = fs.readFileSync(selectedSession.filePath, 'utf8');

  const payload = {
    sessionId: selectedSession.id,
    title: selectedSession.title,
    originalCwd: selectedSession.cwd,
    content
  };

  try {
    const response = await uploadSession(payload, options.server);
    displayTransferCode(response.code, options.server);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Handle session retrieval (receiver side)
 */
export async function runReceiveCommand(codeArg, options = {}) {
  let code = codeArg;
  if (!code) {
    code = await promptForCode();
  }

  try {
    const sessionPayload = await downloadSession(code, options.server);
    const targetPath = process.cwd();

    const result = importClaudeSession(sessionPayload, targetPath);

    try {
      const mdContent = exportSessionToMarkdown(sessionPayload.content);
      const mdFilename = `claude-chat-${sessionPayload.sessionId.slice(0, 8)}.md`;
      fs.writeFileSync(path.join(targetPath, mdFilename), mdContent, 'utf8');
    } catch (e) {
      // Ignore markdown export failure
    }

    console.log(`\nSession imported successfully into ${result.targetPath}`);
    console.log(`Run 'claude' or 'claude --resume' to continue.`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Handle local self-hosted relay server
 */
export function runServerCommand(options = {}) {
  const app = express();
  const port = options.port || process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  app.get('/', indexHandler);
  app.post('/api/share', shareHandler);
  app.get('/api/receive', receiveHandler);

  app.listen(port, () => {
    console.log(`Relay server running on http://localhost:${port}`);
  });
}
