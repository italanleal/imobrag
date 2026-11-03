import { documentSchema } from '../documents/documents.schemas.js';

const answerSchema = {
  type: 'object', required: ['answer', 'status', 'mode', 'source'],
  properties: {
    answer: { type: 'string' }, status: { type: 'string', enum: ['answered', 'insufficient_evidence'] },
    mode: { type: 'string', enum: ['demo', 'langchain'] },
    source: { anyOf: [documentSchema, { type: 'null' }] },
  },
} as const;

export const chatSchema = {
  tags: ['Consultas'], summary: 'Consulta o motor demonstrativo de busca textual',
  description: 'Ainda não usa LangChain, embeddings ou um modelo de linguagem. Sempre confira a fonte.',
  body: { type: 'object', additionalProperties: false, required: ['question'], properties: {
    question: { type: 'string', minLength: 1, maxLength: 1000, pattern: '\\S' },
  } },
  response: { 200: answerSchema },
} as const;
