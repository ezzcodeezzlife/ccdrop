// In-memory store for ephemeral 4-digit code sessions
if (!globalThis.__CHAT_STORE__) {
  globalThis.__CHAT_STORE__ = new Map();
}

const store = globalThis.__CHAT_STORE__;

/**
 * Clean up expired entries (> 15 minutes)
 */
function cleanupExpired() {
  const now = Date.now();
  for (const [code, entry] of store.entries()) {
    if (entry.expiresAt && entry.expiresAt < now) {
      store.delete(code);
    }
  }
}

/**
 * Generate unique 4-digit PIN code
 */
export function generateCode() {
  cleanupExpired();

  // Try generating random 4 digit code up to 100 attempts
  for (let i = 0; i < 100; i++) {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    if (!store.has(code)) {
      return code;
    }
  }

  // Fallback to timestamp digits if collisions occur
  return String(Date.now() % 10000).padStart(4, '0');
}

/**
 * Save session payload with 4-digit code
 */
export function saveSession(payload) {
  cleanupExpired();
  const code = generateCode();
  const ttlMs = 15 * 60 * 1000; // 15 minutes TTL

  const entry = {
    code,
    sessionId: payload.sessionId,
    title: payload.title || 'Claude Chat Session',
    originalCwd: payload.originalCwd || '',
    content: payload.content,
    createdAt: Date.now(),
    expiresAt: Date.now() + ttlMs
  };

  store.set(code, entry);

  return {
    code,
    expiresInSeconds: 900,
    expiresAt: entry.expiresAt
  };
}

/**
 * Get and immediately delete session payload (one-time download)
 */
export function getAndDeleteSession(code) {
  cleanupExpired();
  const cleanCode = String(code).trim();

  const entry = store.get(cleanCode);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt < Date.now()) {
    store.delete(cleanCode);
    return null;
  }

  // Delete session immediately after download
  store.delete(cleanCode);

  return entry;
}
