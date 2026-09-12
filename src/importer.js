import fs from 'fs';
import path from 'path';
import os from 'os';
import { getClaudeDir } from './scanner.js';

/**
 * Encode a workspace filesystem path to Claude Code's project key format
 */
export function encodeProjectKey(targetPath) {
  const normalized = path.resolve(targetPath);

  if (process.platform === 'win32') {
    // Windows: C:\Users\MYPC\Desktop -> C--Users-MYPC-Desktop
    return normalized
      .replace(/^([a-zA-Z]):[/\\]/, '$1--')
      .replace(/[/\\]/g, '-');
  } else {
    // Unix/macOS: /Users/alex/Desktop -> -Users-alex-Desktop
    return normalized.replace(/[/\\]/g, '-');
  }
}

/**
 * Import session JSONL payload into target project in ~/.claude/projects/
 */
export function importClaudeSession(payload, targetPath = process.cwd()) {
  const { sessionId, content, title, originalCwd } = payload;
  const claudeDir = getClaudeDir();
  const projectKey = encodeProjectKey(targetPath);
  const projectDir = path.join(claudeDir, 'projects', projectKey);

  // 1. Create project folder if needed
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  // 2. Write session JSONL file
  const sessionFilePath = path.join(projectDir, `${sessionId}.jsonl`);
  fs.writeFileSync(sessionFilePath, content, 'utf8');

  // 3. Append to ~/.claude/history.jsonl if present
  try {
    const historyPath = path.join(claudeDir, 'history.jsonl');
    const displayTitle = title || 'Imported Session';
    const historyEntry = JSON.stringify({
      display: displayTitle,
      timestamp: Date.now(),
      project: targetPath,
      sessionId
    }) + '\n';

    fs.appendFileSync(historyPath, historyEntry, 'utf8');
  } catch (err) {
    // Ignore history append failure if history.jsonl isn't writable
  }

  return {
    sessionId,
    sessionFilePath,
    projectKey,
    targetPath
  };
}

/**
 * Format session JSONL content into clean Markdown for reading
 */
export function exportSessionToMarkdown(content) {
  const lines = content.split('\n').filter(Boolean);
  let markdown = `# Claude Code Chat Session Export\n\n`;

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);

      if (entry.type === 'ai-title' && entry.aiTitle) {
        markdown += `**Title:** ${entry.aiTitle}\n\n---\n\n`;
      }

      if (entry.type === 'user' && entry.message) {
        const userText = typeof entry.message.content === 'string'
          ? entry.message.content
          : Array.isArray(entry.message.content)
            ? entry.message.content.map(c => c.text || '').join('\n')
            : '';

        if (userText && !userText.includes('<local-command-caveat>') && !userText.startsWith('<command-name>')) {
          markdown += `### 👤 User\n${userText}\n\n`;
        }
      }

      if (entry.type === 'assistant' && entry.message) {
        const assistantText = Array.isArray(entry.message.content)
          ? entry.message.content.filter(c => c.type === 'text').map(c => c.text).join('\n')
          : typeof entry.message.content === 'string'
            ? entry.message.content
            : '';

        if (assistantText) {
          markdown += `### 🤖 Claude\n${assistantText}\n\n`;
        }
      }
    } catch (e) {
      // Ignore non-JSON lines
    }
  }

  return markdown;
}
