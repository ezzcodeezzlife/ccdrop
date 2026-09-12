import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { getClaudeConfigFile } from './scanner.js';

// Fields copied from an existing chat so the import inherits this machine's setup
const INHERITED = [
  'model',
  'effort',
  'permissionMode',
  'classifierSummaryEnabled',
  'enabledMcpTools',
  'remoteMcpServersConfig'
];

/**
 * Get the Claude desktop app's user-data directory for this platform
 */
export function getDesktopDir() {
  const home = os.homedir();

  if (process.platform === 'darwin') {
    return path.join(home, 'Library', 'Application Support', 'Claude');
  }

  if (process.platform === 'win32') {
    return path.join(process.env.APPDATA || path.join(home, 'AppData', 'Roaming'), 'Claude');
  }

  return path.join(process.env.XDG_CONFIG_HOME || path.join(home, '.config'), 'Claude');
}

/**
 * Read the signed-in account and organization, which name the app's chat folder
 */
export function readAccount() {
  try {
    const config = JSON.parse(fs.readFileSync(getClaudeConfigFile(), 'utf8'));
    const { accountUuid, organizationUuid } = config.oauthAccount || {};

    return accountUuid && organizationUuid ? { accountUuid, organizationUuid } : null;
  } catch (err) {
    return null;
  }
}

/**
 * Read the most recently touched chat in a folder, used as a settings template
 */
function findTemplate(chatDir) {
  let newest = null;

  let files = [];
  try {
    files = fs.readdirSync(chatDir);
  } catch (err) {
    return null;
  }

  for (const file of files) {
    if (!file.startsWith('local_') || !file.endsWith('.json')) continue;

    const filePath = path.join(chatDir, file);

    try {
      const stat = fs.statSync(filePath);
      if (!newest || stat.mtime > newest.mtime) {
        newest = { filePath, mtime: stat.mtime };
      }
    } catch (err) {
      // Skip unreadable chats
    }
  }

  if (!newest) return null;

  try {
    return JSON.parse(fs.readFileSync(newest.filePath, 'utf8'));
  } catch (err) {
    return null;
  }
}

/**
 * Register an imported transcript with the Claude desktop app.
 *
 * The app's chat list is driven by its own index of small JSON files rather
 * than by a scan of ~/.claude/projects, so a transcript dropped on disk stays
 * invisible there until it has an entry. Best-effort: returns null when the
 * app is not installed, not signed in, or has no chat to copy settings from.
 */
export function registerDesktopSession({ cliSessionId, cwd, title }) {
  try {
    const account = readAccount();
    if (!account) return null;

    const chatDir = path.join(
      getDesktopDir(),
      'claude-code-sessions',
      account.accountUuid,
      account.organizationUuid
    );

    const template = findTemplate(chatDir);
    if (!template) return null;

    const now = Date.now();
    const sessionId = `local_${crypto.randomUUID()}`;
    const entry = { sessionId, cliSessionId, cwd, originCwd: cwd };

    for (const field of INHERITED) {
      if (template[field] !== undefined) entry[field] = template[field];
    }

    Object.assign(entry, {
      createdAt: now,
      lastActivityAt: now,
      lastFocusedAt: now,
      title: title || 'Imported session',
      titleSource: 'user',
      isArchived: false,
      completedTurns: 0,
      alwaysAllowedReasons: [],
      sessionPermissionUpdates: [],
      spawnSeed: {}
    });

    const entryPath = path.join(chatDir, `${sessionId}.json`);
    fs.writeFileSync(entryPath, JSON.stringify(entry, null, 2), 'utf8');

    return entryPath;
  } catch (err) {
    // Never let desktop registration break an otherwise good import
    return null;
  }
}
