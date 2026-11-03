import type { AnswerEngine, Answer } from '../../modules/chat/chat.model.js';
import type { StoredDocument } from '../../modules/documents/documents.model.js';
import { toPublicDocument } from '../../modules/documents/documents.model.js';
import { normalize } from '../../shared/text.js';

const unsupported = /\b(multa|prazo|prazos|dias|valor|valores|paga|pagar|responsabilidade|juridic|legal|lei|iptu|endereco|cpf|senha)\b/;

// Somente busca textual. Não é RAG semântico, não chama LLM e não interpreta instruções.
export class DemoAnswerEngine implements AnswerEngine {
  readonly mode = 'demo' as const;
  async answer(question: string, documents: StoredDocument[]): Promise<Answer> {
    const normalized = normalize(question);
    const best = unsupported.test(normalized) ? undefined : documents
      .map(document => ({ document, score: document.keywords.reduce((total, word) => total + Number(normalized.includes(normalize(word))), 0) }))
      .sort((a, b) => b.score - a.score)[0];
    const source = best && best.score > 0 ? toPublicDocument(best.document) : null;
    return {
      answer: source?.text ?? 'Não encontrei evidência suficiente na base para responder com segurança. Consulte a equipe responsável e inclua um documento que trate dessa dúvida antes de usar uma orientação.',
      status: source ? 'answered' : 'insufficient_evidence', mode: this.mode, source,
    };
  }
}
