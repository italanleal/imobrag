import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root = path.dirname(fileURLToPath(import.meta.url));
const allowed = new Map([['/', ['index.html', 'text/html']], ['/index.html', ['index.html', 'text/html']], ['/app.js', ['app.js', 'text/javascript']], ['/style.css', ['style.css', 'text/css']]]);
const server = http.createServer(async (req,res) => {
  const entry = allowed.get(new URL(req.url, 'http://localhost').pathname);
  if (!entry) {res.writeHead(404); res.end('Não encontrado'); return;}
  try {res.writeHead(200, {'Content-Type': `${entry[1]}; charset=utf-8`, 'Cache-Control':'no-store'}); res.end(await readFile(path.join(root, entry[0])));}
  catch {res.writeHead(500); res.end('Não foi possível carregar o protótipo.');}
});
server.listen(4173, '127.0.0.1', () => console.log('ImobRAG: http://127.0.0.1:4173'));
