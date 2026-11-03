export const documentTopics = ['Locação', 'Manutenção', 'Vistorias', 'Desocupação', 'Importados'] as const;
export type DocumentTopic = typeof documentTopics[number];

export interface KnowledgeDocument {
  id: string;
  title: string;
  topic: DocumentTopic;
  text: string;
  page: number | null;
  imported: boolean;
  demo: boolean;
  createdAt: string;
}

export interface StoredDocument extends KnowledgeDocument { keywords: string[] }
export interface CreateDocumentInput { title: string; text: string; topic?: DocumentTopic }
export interface DocumentFilters { q?: string; topic?: DocumentTopic }

export function toPublicDocument(document: StoredDocument): KnowledgeDocument {
  const { keywords: _keywords, ...result } = document;
  return result;
}
