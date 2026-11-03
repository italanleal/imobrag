import type { FastifyError, FastifyInstance } from 'fastify';
import { AppError } from '../../shared/errors/app-error.js';

// Tradução de erros da aplicação para HTTP, em um único lugar.
export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler<FastifyError>((error, request, reply) => {
    if (error instanceof AppError) {
      const missing = error.code === 'document_not_found';
      return reply.code(missing ? 404 : 413).send({ error: missing ? 'not_found' : error.code, message: error.message });
    }
    const status = typeof error.statusCode === 'number' ? error.statusCode : 500;
    if (status >= 500) request.log.error(error);
    return reply.code(status).send({
      error: error.validation ? 'validation_error' : status >= 500 ? 'internal_error' : 'invalid_request',
      message: error.validation ? 'Verifique os campos enviados.' : status >= 500 ? 'Não foi possível concluir a operação.' : error.message,
    });
  });
  app.setNotFoundHandler(async (_request, reply) => reply.code(404).send({ error: 'not_found', message: 'Rota não encontrada.' }));
}
