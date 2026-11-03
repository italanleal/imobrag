import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import { SqliteDatabase } from './infrastructure/database/sqlite.js';
import { DemoAnswerEngine } from './infrastructure/ai/demo-answer-engine.js';
import { registerErrorHandler } from './infrastructure/http/error-handler.js';
import { registerSystemRoutes } from './infrastructure/http/system.routes.js';
import { DocumentsRepository } from './modules/documents/documents.repository.js';
import { DocumentsService } from './modules/documents/documents.service.js';
import { documentsController } from './modules/documents/documents.controller.js';
import { SettingsRepository } from './modules/settings/settings.repository.js';
import { SettingsService } from './modules/settings/settings.service.js';
import { settingsController } from './modules/settings/settings.controller.js';
import { ChatService } from './modules/chat/chat.service.js';
import { chatController } from './modules/chat/chat.controller.js';
import type { AnswerEngine } from './modules/chat/chat.model.js';
import { EvaluationService } from './modules/evaluation/evaluation.service.js';
import { evaluationController } from './modules/evaluation/evaluation.controller.js';

export interface AppOptions { databasePath: string; logger?: boolean; engine?: AnswerEngine }

// Composition root: monta as dependências, sem implementar regras ou SQL.
export async function buildApp(options: AppOptions) {
  const app = Fastify({ logger: options.logger ?? false, bodyLimit: 1024 * 1024,
    ajv: { customOptions: { removeAdditional: false, coerceTypes: false } } });
  const database = new SqliteDatabase(options.databasePath);
  app.addHook('onClose', async () => database.close());

  const documents = new DocumentsService(new DocumentsRepository(database.connection));
  const settings = new SettingsService(new SettingsRepository(database.connection));
  const chat = new ChatService(documents, settings, options.engine ?? new DemoAnswerEngine());
  const evaluation = new EvaluationService(chat);
  registerErrorHandler(app);

  try {
    await app.register(swagger, { openapi: { info: { title: 'ImobRAG API', version: '0.2.0',
      description: 'API local. Busca textual demonstrativa; LangChain ainda não integrado.' } } });
    registerSystemRoutes(app, database, chat);

    await app.register(async api => {
      documentsController(api, documents);
      settingsController(api, settings);
      chatController(api, chat);
      evaluationController(api, evaluation);
    }, { prefix: '/api' });

    await app.ready();
    return app;
  } catch (error) { await app.close(); throw error; }
}
