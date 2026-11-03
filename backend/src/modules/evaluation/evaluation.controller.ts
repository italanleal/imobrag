import type { FastifyInstance } from 'fastify';
import type { EvaluationService } from './evaluation.service.js';

export function evaluationController(app: FastifyInstance, service: EvaluationService): void {
  app.post('/evaluations', {
    schema: { tags: ['Avaliação'], summary: 'Executa oito casos demonstrativos contra a base atual' },
  }, async () => service.run());
}
