import fs from 'fs/promises';
import path from 'path';

const SEED = path.join(process.cwd(), 'data', 'whitelist.json');
const RUNTIME = '/tmp/whitelist.json';

export async function readArray() {
  let raw = null;
  try { raw = await fs.readFile(RUNTIME, 'utf8'); } catch {}
  if (raw == null) {
    try { raw = await fs.readFile(SEED, 'utf8'); } catch { raw = '[]'; }
    try { await fs.writeFile(RUNTIME, raw); } catch {}
  }
  try { const arr = JSON.parse(raw); return Array.isArray(arr) ? arr : []; } catch { return []; }
}

export async function writeArray(arr) {
  const text = JSON.stringify(arr, null, 2);
  try { await fs.writeFile(RUNTIME, text); } catch {}
  try { await fs.writeFile(SEED, text); } catch {}
}
