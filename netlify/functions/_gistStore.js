const GITHUB_TOKEN = (process.env.GITHUB_TOKEN || '').trim();
const GIST_ID = (process.env.GIST_ID || '').trim();
const FILE = 'whitelist.json';

async function gh(path, method='GET', body){
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'novaid-admin'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const txt = await res.text().catch(()=>'');
    throw new Error(`GitHub ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function readArray() {
  const j = await gh(`/gists/${GIST_ID}`);
  const file = j.files?.[FILE];
  if(!file) return [];
  try {
    const raw = file.content ?? '';
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

export async function writeArray(arr) {
  const content = JSON.stringify(arr, null, 2);
  await gh(`/gists/${GIST_ID}`, 'PATCH', { files: { [FILE]: { content } } });
}
