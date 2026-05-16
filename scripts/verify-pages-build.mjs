import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');

if (html.includes('src="/src/main.jsx"')) {
  throw new Error('dist/index.html still points at the Vite development entry instead of bundled assets.');
}

const assetMatches = [...html.matchAll(/(?:src|href)="([^"]*assets\/[^"]+)"/g)].map((match) => match[1]);

if (assetMatches.length === 0) {
  throw new Error('dist/index.html does not reference any built assets.');
}

const absoluteAsset = assetMatches.find((asset) => asset.startsWith('/'));
if (absoluteAsset) {
  throw new Error(`GitHub Pages asset path must be relative, but found: ${absoluteAsset}`);
}

if (!html.includes('מפת הספקטרום הישראלי')) {
  throw new Error('dist/index.html does not contain the expected Hebrew page title.');
}

console.log(`Verified ${assetMatches.length} relative built asset paths for GitHub Pages.`);
