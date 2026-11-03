import type { FastifyInstance } from 'fastify';
import type { DocumentsService } from './documents.service.js';
import type { CreateDocumentInput, DocumentFilters } from './documents.model.js';
import { documentsSchemas } from './documents.schemas.js';

// Fronteira HTTP: valida contratos, chama o service e monta a resposta.
export function documentsController(app: FastifyInstance, service: DocumentsService): void {
  app.get<{ Querystring: DocumentFilters }>('/documents', { schema: documentsSchemas.list },
    async request => service.list(request.query));

  app.get<{ Params: { id: string } }>('/documents/:id', { schema: documentsSchemas.findById },
    async request => service.findById(request.params.id));

  app.post<{ Body: CreateDocumentInput }>('/documents', { schema: documentsSchemas.create }, async (request, reply) => {
    const document = service.create(request.body);
    return reply.code(201).header('Location', `/api/documents/${document.id}`).send(document);
  });
}
