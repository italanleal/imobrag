import type { AssistantSettings } from './settings.model.js';
import type { SettingsStore } from './settings.repository.js';

export class SettingsService {
  constructor(private readonly repository: SettingsStore) {}

  get(): AssistantSettings { return this.repository.get(); }

  update(input: AssistantSettings): AssistantSettings {
    const settings = { ...input, name: input.name.trim(), instructions: input.instructions.trim() };
    this.repository.save(settings);
    return settings;
  }
}
