import { saveSession } from './_store.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    let body = req.body;

    // Handle stringified body if unparsed
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    if (!body || !body.content || !body.sessionId) {
      return res.status(400).json({ error: 'Missing required session payload fields (content, sessionId).' });
    }

    const result = saveSession(body);

    return res.status(200).json({
      success: true,
      code: result.code,
      expiresInSeconds: result.expiresInSeconds,
      expiresAt: result.expiresAt
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
