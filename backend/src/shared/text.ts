export const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const stopWords = new Set(['sobre', 'entre', 'pelos', 'pelas', 'todos', 'todas', 'quando', 'antes', 'depois', 'devem', 'podem', 'documento', 'documentos', 'informacao', 'informacoes']);

export function extractKeywords(title: string, text: string): string[] {
  return [...new Set(normalize(`${title} ${text}`).match(/[a-z]{5,}/g) ?? [])]
    .filter(word => !stopWords.has(word)).slice(0, 80);
}
