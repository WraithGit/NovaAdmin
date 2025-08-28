const ADMIN = (process.env.ADMIN_TOKEN || '').trim();
export function okAuth(event){
  const hdr = event.headers || {};
  const token = hdr['x-admin-token'] || hdr['X-Admin-Token'] || '';
  return ADMIN && token && token === ADMIN;
}
export function cors(status, body){
  return { statusCode: status, headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  }, body: JSON.stringify(body) };
}
