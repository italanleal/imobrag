import type { FastifyInstance } from 'fastify';
import type { ChatService } from './chat.service.js';
import { chatSchema } from './chat.schemas.js';

export function chatController(app: FastifyInstance, service: ChatService): void {
  app.post<{ Body: { question: string } }>('/chat', { schema: chatSchema }, async request => service.ask(request.body.question));
}
