import { readArray } from './_fileStore.js';

function json(status, body) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(body)
  };
}

export const handler = async (event) => {
  try {
    const url = new URL(event.rawUrl || `https://${event.headers.host}${event.path}${event.rawQuery ? '?'+event.rawQuery : ''}`);
    const hash = (url.searchParams.get('hash') || '').toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(hash)) return json(400, { allowed:false, error:'invalid hash' });

    const arr = await readArray();
    const allowed = Array.isArray(arr) && arr.includes(hash);
    return json(200, { allowed });
  } catch {
    return json(500, { allowed:false, error:'server error' });
  }
};
