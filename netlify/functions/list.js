import { getStore } from '@netlify/blobs';
import { okAuth, cors } from './_guard.js';
export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors(200, {});
  if (!okAuth(event)) return cors(401, { error: 'unauthorized' });
  try {
    const store = getStore('whitelist');
    const raw = await store.get('hashes', { type: 'text' });
    const arr = raw ? JSON.parse(raw) : [];
    return cors(200, { items: arr });
  } catch { return cors(500, { error: 'server error' }); }
};