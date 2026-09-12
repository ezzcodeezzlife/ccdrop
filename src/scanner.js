import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Get the Claude Code data directory, honouring a CLAUDE_CONFIG_DIR override
 */
export function getClaudeDir() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
}

/**
 * Get the path to the Claude Code config file
 */
export function getClaudeConfigFile() {
  return process.env.CLAUDE_CONFIG_DIR
    ? path.join(process.env.CLAUDE_CONFIG_DIR, '.claude.json')
    : path.join(os.homedir(), '.claude.json');
}

/**
 * Format project key back to readable project path/name if possible
 */
export function formatProjectName(projectKey, cwd) {
  if (cwd) {
    return path.basename(cwd);
  }
  const parts = projectKey.split('-');
  return parts[parts.length - 1] || projectKey;
}

/**
 * Clean strings by stripping newlines, tabs, and duplicate spaces
 */
export function sanitizeString(str) {
  if (!str) return '';
  return String(str)
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse session JSONL file to extract customTitle/aiTitle, first user prompt, cwd, and message count
 */
export function parseSessionFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(Boolean);

  let customTitle = '';
  let aiTitle = '';
  let firstPrompt = '';
  let cwd = '';
  let messageCount = 0;

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      messageCount++;

      // Extract custom-title or ai-title if present and not "Untitled session"
      if (entry.customTitle && entry.customTitle !== 'Untitled session') {
        customTitle = sanitizeString(entry.customTitle);
      }

      if (entry.aiTitle && entry.aiTitle !== 'Untitled session') {
        aiTitle = sanitizeString(entry.aiTitle);
      }

      if (entry.type === 'custom-title' && entry.customTitle && entry.customTitle !== 'Untitled session') {
        customTitle = sanitizeString(entry.customTitle);
      }

      if (entry.type === 'ai-title' && entry.aiTitle && entry.aiTitle !== 'Untitled session') {
        aiTitle = sanitizeString(entry.aiTitle);
      }

      // Check for cwd
      if (entry.cwd && !cwd) {
        cwd = entry.cwd;
      }

      // Check for first user message prompt
      if (entry.type === 'user' && entry.message) {
        const text = typeof entry.message.content === 'string'
          ? entry.message.content
          : Array.isArray(entry.message.content)
            ? entry.message.content.map(c => c.text || '').join(' ')
            : '';

        const clean = sanitizeString(text);

        if (clean && !clean.includes('<local-command-caveat>') && !clean.startsWith('<command-name>')) {
          if (!firstPrompt) {
            firstPrompt = clean;
          }
        }
      }
    } catch (e) {
      // Ignore line parse errors
    }
  }

  // Precedence: customTitle -> aiTitle -> firstPrompt
  const finalTitle = customTitle || aiTitle || firstPrompt;

  return {
    title: sanitizeString(finalTitle),
    firstPrompt: sanitizeString(firstPrompt),
    cwd,
    messageCount
  };
}

/**
 * Scan ~/.claude/projects and return all chat sessions sorted by newest first
 */
export function scanClaudeSessions() {
  const claudeDir = getClaudeDir();
  const projectsDir = path.join(claudeDir, 'projects');

  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  const sessions = [];

  try {
    const projectEntries = fs.readdirSync(projectsDir, { withFileTypes: true });

    for (const entry of projectEntries) {
      if (!entry.isDirectory()) continue;

      const projectKey = entry.name;
      const projectPath = path.join(projectsDir, projectKey);

      try {
        const files = fs.readdirSync(projectPath);

        for (const file of files) {
          if (!file.endsWith('.jsonl')) continue;

          const filePath = path.join(projectPath, file);
          const sessionId = file.replace(/\.jsonl$/, '');

          try {
            const stat = fs.statSync(filePath);
            const metadata = parseSessionFile(filePath);

            const sessionTitle = metadata.title || `Session ${sessionId.slice(0, 8)}`;

            sessions.push({
              id: sessionId,
              filePath,
              projectKey,
              projectName: formatProjectName(projectKey, metadata.cwd),
              cwd: metadata.cwd || '',
              title: sanitizeString(sessionTitle),
              firstPrompt: metadata.firstPrompt || '',
              updatedAt: stat.mtime,
              fileSizeBytes: stat.size,
              messageCount: metadata.messageCount
            });
          } catch (err) {
            // Ignore unparseable or corrupted session files
          }
        }
      } catch (err) {
        // Skip inaccessible folders
      }
    }
  } catch (err) {
    return [];
  }

  // Sort newest first
  return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
}
