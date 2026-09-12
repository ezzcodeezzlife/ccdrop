import { getAndDeleteSession } from './_store.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
  }

  try {
    const code = req.query.code || req.query.c;

    if (!code) {
      return res.status(400).json({ error: 'Missing code parameter. Example: ?code=1234' });
    }

    const session = getAndDeleteSession(code);

    if (!session) {
      return res.status(404).json({
        error: 'Invalid or expired 4-digit code. Sessions are auto-deleted after single download or 15 minutes.'
      });
    }

    return res.status(200).json({
      success: true,
      sessionId: session.sessionId,
      title: session.title,
      originalCwd: session.originalCwd,
      content: session.content
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
