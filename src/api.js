import http from 'http';
import https from 'https';

// Default Vercel production URL for fast zero-config relaying
const DEFAULT_RELAY_URL = process.env.RELAY_SERVER_URL || 'https://claude-chat-share.vercel.app';

/**
 * Universal fetch helper for Node HTTP/HTTPS requests
 */
async function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === 'https:' ? https : http;

    const req = lib.request(parsed, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(json.error || `HTTP ${res.statusCode}: ${body}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }

    req.end();
  });
}

/**
 * Upload chat session payload to relay server
 */
export async function uploadSession(payload, customServerUrl = DEFAULT_RELAY_URL) {
  const baseUrl = (customServerUrl || DEFAULT_RELAY_URL).replace(/\/$/, '');
  const url = `${baseUrl}/api/share`;

  return await request(url, {
    method: 'POST',
    body: payload
  });
}

/**
 * Download chat session payload from relay server using 4-digit code
 */
export async function downloadSession(code, customServerUrl = DEFAULT_RELAY_URL) {
  const baseUrl = (customServerUrl || DEFAULT_RELAY_URL).replace(/\/$/, '');
  const cleanCode = String(code).trim();
  const url = `${baseUrl}/api/receive?code=${encodeURIComponent(cleanCode)}`;

  return await request(url, {
    method: 'GET'
  });
}
