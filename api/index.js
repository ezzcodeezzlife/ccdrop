// Unified Vercel Serverless API Handler
if (!globalThis.__CHAT_STORE__) {
  globalThis.__CHAT_STORE__ = new Map();
}

const store = globalThis.__CHAT_STORE__;

function cleanupExpired() {
  const now = Date.now();
  for (const [code, entry] of store.entries()) {
    if (entry.expiresAt && entry.expiresAt < now) {
      store.delete(code);
    }
  }
}

function generateCode() {
  cleanupExpired();
  for (let i = 0; i < 100; i++) {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    if (!store.has(code)) {
      return code;
    }
  }
  return String(Date.now() % 10000).padStart(4, '0');
}

async function uploadBytebinBackup(payload) {
  try {
    const res = await fetch('https://bytebin.lucko.me/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      return data.key;
    }
  } catch (e) {
    // Ignore backup error
  }
  return null;
}

async function fetchBytebinBackup(key) {
  try {
    const res = await fetch(`https://bytebin.lucko.me/${key}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Ignore backup error
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (req.method === 'POST' && (pathname === '/api/share' || pathname === '/share')) {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      if (!body || !body.content || !body.sessionId) {
        return res.status(400).json({ error: 'Missing required session fields (content, sessionId).' });
      }

      const code = generateCode();
      const bytebinKey = await uploadBytebinBackup(body);

      const entry = {
        code,
        sessionId: body.sessionId,
        title: body.title || 'Claude Chat Session',
        originalCwd: body.originalCwd || '',
        content: body.content,
        bytebinKey,
        createdAt: Date.now(),
        expiresAt: Date.now() + 15 * 60 * 1000
      };

      store.set(code, entry);

      return res.status(200).json({
        success: true,
        code,
        expiresInSeconds: 900,
        expiresAt: entry.expiresAt
      });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  }

  if (req.method === 'GET' && (pathname === '/api/receive' || pathname === '/receive')) {
    try {
      const code = url.searchParams.get('code') || url.searchParams.get('c');
      if (!code) {
        return res.status(400).json({ error: 'Missing code parameter. Example: ?code=1234' });
      }

      const cleanCode = String(code).trim();
      let entry = store.get(cleanCode);

      if (entry) {
        store.delete(cleanCode);
      } else {
        for (const [c, e] of store.entries()) {
          if (c === cleanCode && e.bytebinKey) {
            const backup = await fetchBytebinBackup(e.bytebinKey);
            if (backup) {
              entry = backup;
              store.delete(c);
              break;
            }
          }
        }
      }

      if (!entry) {
        return res.status(404).json({
          error: 'Invalid or expired 4-digit code. Sessions are deleted immediately after download or after 15 minutes.'
        });
      }

      return res.status(200).json({
        success: true,
        sessionId: entry.sessionId,
        title: entry.title,
        originalCwd: entry.originalCwd,
        content: entry.content
      });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Claude Code Chat Share Relay</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 80px auto; padding: 0 20px; background: #0f172a; color: #f8fafc; text-align: center; }
          .card { background: #1e293b; padding: 40px; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); }
          h1 { margin-top: 0; color: #38bdf8; font-size: 28px; }
          code { background: #090d16; padding: 6px 12px; border-radius: 6px; color: #a5f3fc; font-family: monospace; font-size: 16px; }
          p { color: #94a3b8; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Claude Code Chat Share Relay</h1>
          <p>Relay server is live and operational.</p>
          <p>Share Claude Code chats between computers with a 4-digit PIN code:</p>
          <p><code>npx claude-chat-share</code></p>
        </div>
      </body>
    </html>
  `);
}
