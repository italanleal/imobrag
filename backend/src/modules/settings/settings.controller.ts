import type { FastifyInstance } from 'fastify';
import type { SettingsService } from './settings.service.js';
import type { AssistantSettings } from './settings.model.js';
import { settingsSchema } from './settings.schemas.js';

export function settingsController(app: FastifyInstance, service: SettingsService): void {
  app.get('/settings', {
    schema: { tags: ['Assistente'], summary: 'Lê as configurações persistidas', response: { 200: settingsSchema } },
  }, async () => service.get());

  app.put<{ Body: AssistantSettings }>('/settings', {
    schema: { tags: ['Assistente'], summary: 'Substitui as configurações da assistente', body: settingsSchema, response: { 200: settingsSchema } },
  }, async request => service.update(request.body));
}
