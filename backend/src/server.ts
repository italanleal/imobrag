import { buildApp } from './app.js';
import { loadEnvironment } from './config/environment.js';

const config = loadEnvironment();
const app = await buildApp({ databasePath: config.databasePath, logger: true });
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, async () => { await app.close(); process.exit(0); });
}
try { await app.listen({ port: config.port, host: config.host }); }
catch (error) { app.log.error(error); await app.close(); process.exitCode = 1; }
