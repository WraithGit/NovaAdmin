import { getStore } from '@netlify/blobs';
import { okAuth, cors } from './_guard.js';
export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors(200, {});
  if (!okAuth(event)) return cors(401, { error: 'unauthorized' });
  try {
    const { hash } = JSON.parse(event.body || '{}');
    const store = getStore('whitelist');
    const raw = await store.get('hashes', { type: 'text' });
    let arr = raw ? JSON.parse(raw) : [];
    arr = arr.filter(h => h != (hash || '').toLowerCase());
    await store.set('hashes', JSON.stringify(arr));
    return cors(200, { ok: true });
  } catch { return cors(500, { error: 'server error' }); }
};