import type { DatabaseSync } from 'node:sqlite';
import type { StoredDocument } from './documents.model.js';

export interface DocumentsStore {
  list(): StoredDocument[];
  findById(id: string): StoredDocument | undefined;
  insert(document: StoredDocument): void;
}

type DocumentRow = { payload: string };

// Acesso ao banco, sem regras de negócio ou dependência de HTTP.
export class DocumentsRepository implements DocumentsStore {
  constructor(private readonly database: DatabaseSync) {}

  list(): StoredDocument[] {
    return (this.database.prepare('SELECT payload FROM documents ORDER BY rowid').all() as DocumentRow[])
      .map(row => JSON.parse(row.payload) as StoredDocument);
  }

  findById(id: string): StoredDocument | undefined {
    const row = this.database.prepare('SELECT payload FROM documents WHERE id = ?').get(id) as DocumentRow | undefined;
    return row ? JSON.parse(row.payload) as StoredDocument : undefined;
  }

  insert(document: StoredDocument): void {
    this.database.prepare('INSERT INTO documents (id, payload) VALUES (?, ?)').run(document.id, JSON.stringify(document));
  }
}
