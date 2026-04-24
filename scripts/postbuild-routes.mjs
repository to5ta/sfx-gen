import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';

const langs = ['en', 'de', 'fr', 'it', 'es'];
const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');

for (const lang of langs) {
  const langDir = path.join(distDir, lang);
  await mkdir(langDir, { recursive: true });
  await cp(indexPath, path.join(langDir, 'index.html'));
}

await cp(indexPath, notFoundPath);
