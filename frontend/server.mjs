import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const apiPort = Number(process.env.API_PORT ?? 3001);
if (!Number.isInteger(apiPort) || apiPort < 1 || apiPort > 65535) throw new Error('API_PORT inválida.');
const allowed = new Map([
  ['/', ['index.html', 'text/html']], ['/index.html', ['index.html', 'text/html']],
  ['/app.js', ['app.js', 'text/javascript']], ['/api.js', ['api.js', 'text/javascript']],
  ['/style.css', ['style.css', 'text/css']],
]);

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) {
    const proxy = http.request({
      hostname: '127.0.0.1', port: apiPort, path: url.pathname + url.search, method: request.method,
      headers: request.headers['content-type'] ? { 'content-type': request.headers['content-type'] } : {},
    }, upstream => { response.writeHead(upstream.statusCode ?? 502, upstream.headers); upstream.pipe(response); });
    proxy.setTimeout(15000, () => proxy.destroy(new Error('API timeout')));
    proxy.on('error', () => {
      if (!response.headersSent) {
        response.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
        response.end(JSON.stringify({ error: 'api_unavailable', message: 'A API está indisponível. Inicie o backend e tente novamente.' }));
      } else response.destroy();
    });
    request.on('aborted', () => proxy.destroy());
    request.pipe(proxy);
    return;
  }
  const entry = allowed.get(url.pathname);
  if (!entry) { response.writeHead(404); response.end('Não encontrado'); return; }
  if (request.method !== 'GET' && request.method !== 'HEAD') { response.writeHead(405); response.end(); return; }
  try {
    const content = await readFile(path.join(root, entry[0]));
    response.writeHead(200, { 'Content-Type': `${entry[1]}; charset=utf-8`, 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch { response.writeHead(500); response.end('Não foi possível carregar a interface.'); }
});
server.listen(4173, '127.0.0.1', () => console.log('ImobRAG: http://127.0.0.1:4173'));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close(() => process.exit(0)));
