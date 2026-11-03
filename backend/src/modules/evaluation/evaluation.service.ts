import type { ChatService } from '../chat/chat.service.js';
import { evaluationCases } from './evaluation.cases.js';

export class EvaluationService {
  constructor(private readonly chat: ChatService) {}

  async run() {
    const results = await Promise.all(evaluationCases.map(async sample => {
      const result = await this.chat.ask(sample.question);
      const actualSourceId = result.source?.id ?? null;
      return { ...sample, actualSourceId, passed: actualSourceId === sample.expectedSourceId };
    }));
    return { mode: this.chat.mode, total: results.length, passed: results.filter(result => result.passed).length, results };
  }
}
