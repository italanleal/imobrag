import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function loadEnvironment(env: NodeJS.ProcessEnv = process.env) {
  const port = Number(env.PORT ?? 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT deve ser uma porta entre 1 e 65535.');
  // Este arquivo fica em src/config ou dist/config: a raiz permanece a mesma.
  const backendRoot = fileURLToPath(new URL('../..', import.meta.url));
  return { port, host: '127.0.0.1', databasePath: resolve(backendRoot, env.DATABASE_PATH ?? 'data/imobrag.sqlite') };
}
