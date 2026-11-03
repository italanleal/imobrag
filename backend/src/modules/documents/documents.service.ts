import { randomUUID } from 'node:crypto';
import type { DocumentsStore } from './documents.repository.js';
import type { CreateDocumentInput, DocumentFilters, KnowledgeDocument, StoredDocument } from './documents.model.js';
import { toPublicDocument } from './documents.model.js';
import { AppError } from '../../shared/errors/app-error.js';
import { extractKeywords, normalize } from '../../shared/text.js';

// Regras do módulo. Não conhece Fastify nem executa SQL.
export class DocumentsService {
  constructor(private readonly repository: DocumentsStore) {}

  list(filters: DocumentFilters = {}): KnowledgeDocument[] {
    return this.repository.list()
      .filter(document => (!filters.topic || document.topic === filters.topic)
        && (!filters.q || normalize(document.title + ' ' + document.text).includes(normalize(filters.q))))
      .map(toPublicDocument);
  }

  findById(id: string): KnowledgeDocument {
    const document = this.repository.findById(id);
    if (!document) throw new AppError('document_not_found', 'Documento não encontrado.');
    return toPublicDocument(document);
  }

  create(input: CreateDocumentInput): KnowledgeDocument {
    if (Buffer.byteLength(input.text, 'utf8') > 200 * 1024) {
      throw new AppError('text_too_large', 'O texto deve ter no máximo 200 KB em UTF-8.');
    }
    const document: StoredDocument = {
      id: randomUUID(), title: input.title.trim(), text: input.text.trim(), topic: input.topic ?? 'Importados',
      page: null, imported: true, demo: false, createdAt: new Date().toISOString(),
      keywords: extractKeywords(input.title, input.text),
    };
    this.repository.insert(document);
    return toPublicDocument(document);
  }

  listForEngine(): StoredDocument[] { return this.repository.list(); }
}
