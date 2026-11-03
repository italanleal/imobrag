import type { DatabaseSync } from 'node:sqlite';
import { demoDocuments } from './seeds.js';
import { defaultSettings } from '../../modules/settings/settings.model.js';

export function runMigrations(database: DatabaseSync): void {
  database.exec(`
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, payload TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY CHECK (id = 1), payload TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS migrations (id INTEGER PRIMARY KEY);
  `);
  if (database.prepare('SELECT id FROM migrations WHERE id = 1').get()) return;
  database.exec('BEGIN');
  try {
    const insert = database.prepare('INSERT INTO documents (id, payload) VALUES (?, ?)');
    for (const document of demoDocuments) insert.run(document.id, JSON.stringify(document));
    database.prepare('INSERT INTO settings (id, payload) VALUES (1, ?)').run(JSON.stringify(defaultSettings));
    database.exec('INSERT INTO migrations (id) VALUES (1); COMMIT');
  } catch (error) { database.exec('ROLLBACK'); throw error; }
}
