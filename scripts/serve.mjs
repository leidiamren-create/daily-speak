import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { bundledAudio } from '../audio.js';

const port = Number(process.env.PORT || 4173); // 本地端口
const host = process.argv.includes('--host') ? '0.0.0.0' : '127.0.0.1'; // 预览监听地址
const assets = { '/': ['index.html', 'text/html'], '/index.html': ['index.html', 'text/html'], '/styles.css': ['styles.css', 'text/css'], '/app.js': ['app.js', 'text/javascript'], '/ai.js': ['ai.js', 'text/javascript'], '/tts.js': ['tts.js', 'text/javascript'], '/content.js': ['content.js', 'text/javascript'] }; // 页面资源
assets['/audio.js'] = ['audio.js', 'text/javascript'];
for (const file of Object.values(bundledAudio)) assets[`/${file}`] = [file, 'audio/wav'];

createServer(async (request, response) => {
  const asset = assets[new URL(request.url, `http://localhost:${port}`).pathname];
  if (!asset) { response.writeHead(404); response.end('Not found'); return; }
  const content = await readFile(new URL(`../${asset[0]}`, import.meta.url));
  response.writeHead(200, { 'Content-Type': asset[1].startsWith('text/') ? `${asset[1]}; charset=utf-8` : asset[1], 'Content-Length': content.length, 'Cache-Control': 'no-store' });
  response.end(content);
}).listen(port, host, () => console.log(`Daily Speak: http://localhost:${port}${host === '0.0.0.0' ? ' (LAN enabled)' : ''}`));
