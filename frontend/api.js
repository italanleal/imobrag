export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`/api${path}`, {
      ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers }, signal: controller.signal,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(error.message || 'Não foi possível concluir a operação.', response.status);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Não foi possível conectar à API. Confira se o backend está em execução e tente novamente.', 0);
  } finally { clearTimeout(timeout); }
}

export const api = {
  documents: () => request('/documents'),
  settings: () => request('/settings'),
  saveSettings: settings => request('/settings', { method: 'PUT', body: JSON.stringify(settings) }),
  createDocument: document => request('/documents', { method: 'POST', body: JSON.stringify(document) }),
  chat: question => request('/chat', { method: 'POST', body: JSON.stringify({ question }) }),
  evaluate: () => request('/evaluations', { method: 'POST' }),
};
