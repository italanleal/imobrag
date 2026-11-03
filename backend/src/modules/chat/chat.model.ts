import type { KnowledgeDocument, StoredDocument } from '../documents/documents.model.js';
import type { AssistantSettings } from '../settings/settings.model.js';

export interface Answer {
  answer: string;
  status: 'answered' | 'insufficient_evidence';
  mode: 'demo' | 'langchain';
  source: KnowledgeDocument | null;
}

// Contrato da aplicação. O adaptador LangChain implementará esta interface.
export interface AnswerEngine {
  readonly mode: Answer['mode'];
  answer(question: string, documents: StoredDocument[], settings: AssistantSettings): Promise<Answer>;
}
