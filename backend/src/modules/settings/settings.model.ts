export interface AssistantSettings {
  name: string;
  tone: 'Acolhedor e objetivo' | 'Formal e direto';
  instructions: string;
  sources: boolean;
}

export const defaultSettings: AssistantSettings = {
  name: 'Assistente ImobRAG', tone: 'Acolhedor e objetivo',
  instructions: 'Oriente a equipe com clareza. Use apenas as informações presentes na base de conhecimento.',
  sources: true,
};
