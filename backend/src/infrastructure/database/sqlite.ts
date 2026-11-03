import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { runMigrations } from './migrations.js';

export class SqliteDatabase {
  readonly connection: DatabaseSync;

  constructor(filename: string) {
    if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true });
    this.connection = new DatabaseSync(filename);
    try { runMigrations(this.connection); }
    catch (error) { this.connection.close(); throw error; }
  }

  ping(): void { this.connection.prepare('SELECT 1').get(); }
  close(): void { this.connection.close(); }
}
