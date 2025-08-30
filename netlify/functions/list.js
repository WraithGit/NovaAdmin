import { okAuth, cors } from './_guard.js';
import { readArray, writeArray } from './_gistStore.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors(200, {});
  if (!okAuth(event)) return cors(401, { error: 'unauthorized' });

  try {
    const qs = event.queryStringParameters || {};
    if (qs.init === '1') {
      await writeArray([]);
      return cors(200, { ok: true, items: [] });
    }
    const items = await readArray();
    return cors(200, { items });
  } catch (e) {
    return cors(500, { error: 'server error' });
  }
};
