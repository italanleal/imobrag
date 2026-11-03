import type { DocumentsService } from '../documents/documents.service.js';
import type { SettingsService } from '../settings/settings.service.js';
import type { Answer, AnswerEngine } from './chat.model.js';

export class ChatService {
  constructor(
    private readonly documents: DocumentsService,
    private readonly settings: SettingsService,
    private readonly engine: AnswerEngine,
  ) {}

  get mode(): Answer['mode'] { return this.engine.mode; }

  ask(question: string): Promise<Answer> {
    return this.engine.answer(question.trim(), this.documents.listForEngine(), this.settings.get());
  }
}
