import { okAuth, cors } from './_guard.js';
import { readArray, writeArray } from './_gistStore.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors(200, {});
  if (!okAuth(event)) return cors(401, { error: 'unauthorized' });

  try {
    const { hash } = JSON.parse(event.body || '{}');
    const h = (hash || '').toLowerCase().trim();

    let arr = await readArray();
    arr = arr.filter(x => x !== h);
    await writeArray(arr);
    return cors(200, { ok: true });
  } catch (e) {
    return cors(500, { error: 'server error' });
  }
};
