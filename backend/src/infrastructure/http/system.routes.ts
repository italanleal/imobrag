import type { FastifyInstance } from 'fastify';
import type { SqliteDatabase } from '../database/sqlite.js';
import type { ChatService } from '../../modules/chat/chat.service.js';
import { documentation } from './api-documentation.js';

export function registerSystemRoutes(app: FastifyInstance, database: SqliteDatabase, chat: ChatService): void {
  app.get('/docs', { schema: { hide: true } }, async (_request, reply) => reply.type('text/html; charset=utf-8').send(documentation));
  app.get('/docs/', { schema: { hide: true } }, async (_request, reply) => reply.type('text/html; charset=utf-8').send(documentation));
  app.get('/docs/json', { schema: { hide: true } }, async () => app.swagger());
  app.get('/api/health', { schema: { tags: ['Sistema'], summary: 'Verifica conexão com API e banco' } }, async () => {
    database.ping();
    return { status: 'ok', service: 'imobrag-api', version: '0.2.0', mode: chat.mode };
  });
}
