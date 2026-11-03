import type { DatabaseSync } from 'node:sqlite';
import type { AssistantSettings } from './settings.model.js';

export interface SettingsStore {
  get(): AssistantSettings;
  save(settings: AssistantSettings): void;
}

export class SettingsRepository implements SettingsStore {
  constructor(private readonly database: DatabaseSync) {}

  get(): AssistantSettings {
    const row = this.database.prepare('SELECT payload FROM settings WHERE id = 1').get() as { payload: string };
    return JSON.parse(row.payload) as AssistantSettings;
  }

  save(settings: AssistantSettings): void {
    this.database.prepare('UPDATE settings SET payload = ? WHERE id = 1').run(JSON.stringify(settings));
  }
}
