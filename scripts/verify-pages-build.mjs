import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

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

const viteServer = await createServer({
  root: new URL('..', import.meta.url).pathname,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { default: App } = await viteServer.ssrLoadModule('/src/App.jsx');
  const rendered = renderToString(React.createElement(App));

  if (!rendered.includes('מפת הספקטרום הישראלי')) {
    throw new Error('The React app did not render the expected Hebrew title during smoke verification.');
  }
} finally {
  await viteServer.close();
}

console.log(`Verified ${assetMatches.length} relative built asset paths and React smoke render for GitHub Pages.`);
