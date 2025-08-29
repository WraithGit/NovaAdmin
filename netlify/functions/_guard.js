const ADMIN = (process.env.ADMIN_TOKEN || '').trim();

export function getToken(event) {
  const hdr = event.headers || {};
  const headerToken = hdr['x-admin-token'] || hdr['X-Admin-Token'] || '';
  const qs = event.queryStringParameters || {};
  const qsToken = (qs.token || '').toString();
  return (headerToken || qsToken).trim();
}

export function okAuth(event) {
  const t = getToken(event);
  return Boolean(ADMIN) && t === ADMIN;
}

export function cors(status, body) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    },
    body: JSON.stringify(body)
  };
}
