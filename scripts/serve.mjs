import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const port = Number(process.env.PORT || 4173); // 本地端口
const assets = { '/': ['index.html', 'text/html'], '/index.html': ['index.html', 'text/html'], '/styles.css': ['styles.css', 'text/css'], '/app.js': ['app.js', 'text/javascript'], '/ai.js': ['ai.js', 'text/javascript'], '/content.js': ['content.js', 'text/javascript'] }; // 页面资源

createServer(async (request, response) => {
  const asset = assets[new URL(request.url, `http://localhost:${port}`).pathname];
  if (!asset) { response.writeHead(404); response.end('Not found'); return; }
  const content = await readFile(new URL(`../${asset[0]}`, import.meta.url));
  response.writeHead(200, { 'Content-Type': `${asset[1]}; charset=utf-8`, 'Cache-Control': 'no-store' });
  response.end(content);
}).listen(port, '127.0.0.1', () => console.log(`Daily Speak: http://localhost:${port}`));
