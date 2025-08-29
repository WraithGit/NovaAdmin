import { getStore } from '@netlify/blobs';
import { okAuth, cors } from './_guard.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors(200, {});
  if (!okAuth(event)) return cors(401, { error: 'unauthorized' });

  try {
    const { hash } = JSON.parse(event.body || '{}');
    const h = (hash || '').toLowerCase().trim();

    const store = getStore('whitelist');
    let arr = await readArray(store);
    arr = arr.filter(x => x !== h);
    await store.set('hashes', JSON.stringify(arr));
    return cors(200, { ok: true });
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
