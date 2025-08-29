import { getStore } from '@netlify/blobs';
import { okAuth, cors } from './_guard.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors(200, {});
  if (!okAuth(event)) return cors(401, { error: 'unauthorized' });

  try {
    const store = getStore('whitelist');
    const qs = event.queryStringParameters || {};
    if (qs.init === '1') {
      await store.set('hashes', JSON.stringify([]));
      return cors(200, { ok: true, items: [] });
    }
    const items = await readArray(store);
    return cors(200, { items });
  } catch (e) {
    return cors(500, { error: 'server error' });
  }
};

async function readArray(store) {
  const raw = await store.get('hashes', { type: 'text' });
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
