import fs from 'fs';
import path from 'path';
import { getClaudeDir } from './scanner.js';
import { registerDesktopSession } from './desktop.js';

// Claude Code truncates project keys past this length and appends a hash
const PROJECT_KEY_MAX_LENGTH = 200;

// Keys whose value is a single working-directory path, rewritten on import
const CWD_KEYS = new Set(['cwd', 'workingDirectory', 'originalCwd']);

/**
 * Hash a path the way Claude Code does, for keys that exceed the length limit
 */
function hashPath(value) {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i) | 0;
  }

  return Math.abs(hash).toString(36);
}

/**
 * Encode a workspace filesystem path to Claude Code's project key format.
 *
 * Every non-alphanumeric character becomes a dash, so this covers dots and
 * drive colons too: /Users/alex/.config -> -Users-alex--config, and
 * C:\Users\alex\Desktop -> C--Users-alex-Desktop. Long keys are truncated
 * and suffixed with a hash, matching Claude Code's own 200-character limit.
 */
export function encodeProjectKey(targetPath) {
  const normalized = path.resolve(targetPath);
  const key = normalized.replace(/[^a-zA-Z0-9]/g, '-');

  if (key.length <= PROJECT_KEY_MAX_LENGTH) return key;

  return `${key.slice(0, PROJECT_KEY_MAX_LENGTH)}-${hashPath(normalized)}`;
}

/**
 * Rewrite a transferred transcript so it belongs to this machine.
 *
 * A transcript records the sender's working directory in dedicated fields and
 * again inside rendered prompt text, so resuming an import untouched would
 * hand Claude Code a directory that does not exist here - possibly one from
 * another operating system entirely.
 */
export function rebaseSession(content, targetPath, originalCwd) {
  const entries = [];

  for (const line of content.split('\n').filter(Boolean)) {
    try {
      const entry = JSON.parse(line);

      // Cloud-sync records carry the sender's account, not the receiver's
      if (entry.type !== 'bridge-session') entries.push(entry);
    } catch (err) {
      // Ignore non-JSON lines
    }
  }

  const sourceCwd = originalCwd || entries.find(entry => typeof entry.cwd === 'string')?.cwd || '';
  const rebased = entries.map(entry => JSON.stringify(retargetPaths(entry, targetPath, sourceCwd)));

  return rebased.length ? rebased.join('\n') + '\n' : '';
}

/**
 * Recursively point every recorded working directory at the import target
 */
function retargetPaths(value, targetPath, sourceCwd) {
  if (typeof value === 'string') {
    return sourceCwd && value.includes(sourceCwd)
      ? value.split(sourceCwd).join(targetPath)
      : value;
  }

  if (Array.isArray(value)) {
    return value.map(item => retargetPaths(item, targetPath, sourceCwd));
  }

  if (value && typeof value === 'object') {
    const result = {};

    for (const [key, nested] of Object.entries(value)) {
      result[key] = CWD_KEYS.has(key) && typeof nested === 'string'
        ? targetPath
        : retargetPaths(nested, targetPath, sourceCwd);
    }

    return result;
  }

  return value;
}

/**
 * Import session JSONL payload into target project in ~/.claude/projects/
 */
export function importClaudeSession(payload, targetPath = process.cwd()) {
  const { sessionId, content, title, originalCwd } = payload;
  const claudeDir = getClaudeDir();
  const resolvedTarget = path.resolve(targetPath);
  const projectKey = encodeProjectKey(resolvedTarget);
  const projectDir = path.join(claudeDir, 'projects', projectKey);

  // 1. Create project folder if needed
  fs.mkdirSync(projectDir, { recursive: true });

  // 2. Write session JSONL file, retargeted at this machine
  const sessionFilePath = path.join(projectDir, `${sessionId}.jsonl`);
  fs.writeFileSync(sessionFilePath, rebaseSession(content, resolvedTarget, originalCwd), 'utf8');

  try {
    // Match the permissions Claude Code gives its own transcripts
    fs.chmodSync(sessionFilePath, 0o600);
  } catch (err) {
    // Ignore on filesystems without POSIX permissions
  }

  // 3. Append to ~/.claude/history.jsonl if present
  try {
    const historyPath = path.join(claudeDir, 'history.jsonl');
    const displayTitle = title || 'Imported Session';
    const historyEntry = JSON.stringify({
      display: displayTitle,
      timestamp: Date.now(),
      project: resolvedTarget,
      sessionId
    }) + '\n';

    fs.appendFileSync(historyPath, historyEntry, 'utf8');
  } catch (err) {
    // Ignore history append failure if history.jsonl isn't writable
  }

  // 4. Register with the Claude desktop app, which keeps its own chat index
  const desktopEntryPath = registerDesktopSession({
    cliSessionId: sessionId,
    cwd: resolvedTarget,
    title
  });

  return {
    sessionId,
    sessionFilePath,
    projectKey,
    targetPath: resolvedTarget,
    desktopEntryPath
  };
}

/**
 * Format session JSONL content into clean Markdown for reading
 */
export function exportSessionToMarkdown(content) {
  const lines = content.split('\n').filter(Boolean);
  let markdown = `# Claude Code Chat Session Export\n\n`;
  let titleWritten = false;

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);

      const entryTitle = entry.aiTitle || entry.customTitle;

      if (!titleWritten && (entry.type === 'ai-title' || entry.type === 'custom-title') && entryTitle) {
        markdown += `**Title:** ${entryTitle}\n\n---\n\n`;
        titleWritten = true;
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
