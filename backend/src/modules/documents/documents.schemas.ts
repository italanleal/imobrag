import { documentTopics } from './documents.model.js';

export const documentSchema = {
  type: 'object', required: ['id', 'title', 'topic', 'text', 'page', 'imported', 'demo', 'createdAt'],
  properties: {
    id: { type: 'string' }, title: { type: 'string' }, topic: { type: 'string', enum: documentTopics },
    text: { type: 'string' }, page: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
    imported: { type: 'boolean' }, demo: { type: 'boolean' }, createdAt: { type: 'string' },
  },
} as const;

export const documentsSchemas = {
  list: {
    tags: ['Documentos'], summary: 'Lista e filtra os documentos cadastrados',
    querystring: { type: 'object', additionalProperties: false, properties: {
      q: { type: 'string', maxLength: 200 }, topic: { type: 'string', enum: documentTopics },
    } },
    response: { 200: { type: 'array', items: documentSchema } },
  },
  findById: {
    tags: ['Documentos'], summary: 'Retorna o documento para conferir uma fonte',
    params: { type: 'object', required: ['id'], properties: { id: { type: 'string', minLength: 1, maxLength: 100 } } },
    response: { 200: documentSchema },
  },
  create: {
    tags: ['Documentos'], summary: 'Cadastra um texto de até 200 KB',
    body: { type: 'object', additionalProperties: false, required: ['title', 'text'], properties: {
      title: { type: 'string', minLength: 1, maxLength: 160, pattern: '\\S' },
      text: { type: 'string', minLength: 1, maxLength: 204800, pattern: '\\S' },
      topic: { type: 'string', enum: documentTopics },
    } },
    response: { 201: documentSchema },
  },
} as const;
