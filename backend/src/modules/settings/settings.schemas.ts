export const settingsSchema = {
  type: 'object', additionalProperties: false, required: ['name', 'tone', 'instructions', 'sources'],
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 60, pattern: '\\S' },
    tone: { type: 'string', enum: ['Acolhedor e objetivo', 'Formal e direto'] },
    instructions: { type: 'string', maxLength: 1000 }, sources: { type: 'boolean' },
  },
} as const;
