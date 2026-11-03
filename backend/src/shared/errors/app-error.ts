export class AppError extends Error {
  constructor(readonly code: 'document_not_found' | 'text_too_large', message: string) {
    super(message);
    this.name = 'AppError';
  }
}
