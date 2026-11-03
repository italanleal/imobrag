import { test, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { buildApp } from '../../src/app.js';
import type { AnswerEngine } from '../../src/modules/chat/chat.model.js';

async function fixture(t: TestContext, engine?: AnswerEngine) {
  const app = await buildApp({ databasePath: ':memory:', engine });
  t.after(() => app.close());
  return app;
}

test('saúde, OpenAPI e interface de documentação estão disponíveis', async t => {
  const app = await fixture(t);
  const health = await app.inject('/api/health');
  assert.equal(health.statusCode, 200);
  assert.equal(health.json().mode, 'demo');
  const spec = await app.inject('/docs/json');
  assert.equal(spec.statusCode, 200);
  assert.ok(spec.json().paths['/api/chat'].post);
  const page = await app.inject('/docs/');
  assert.equal(page.statusCode, 200);
  assert.match(page.headers['content-type']!, /text\/html/);
  assert.match(page.body, /Executar requisição/);
});

test('cadastra, filtra e recupera um documento sem expor palavras-chave internas', async t => {
  const app = await fixture(t);
  const created = await app.inject({ method: 'POST', url: '/api/documents', payload: {
    title: '  Política de elevadores  ', text: 'Elevadores devem passar por inspeções periódicas.', topic: 'Manutenção',
  } });
  assert.equal(created.statusCode, 201);
  const document = created.json();
  assert.equal(document.title, 'Política de elevadores');
  assert.equal(document.demo, false);
  assert.equal(document.page, null);
  assert.equal(document.keywords, undefined);
  assert.equal(created.headers.location, `/api/documents/${document.id}`);
  assert.deepEqual((await app.inject(`/api/documents/${document.id}`)).json(), document);
  const filtered = await app.inject('/api/documents?q=ELEVADORES&topic=Manuten%C3%A7%C3%A3o');
  assert.equal(filtered.json().length, 1);
  const answer = await app.inject({ method: 'POST', url: '/api/chat', payload: { question: 'Como inspecionar elevadores?' } });
  assert.equal(answer.json().source.id, document.id);
  assert.equal(answer.json().answer, document.text);
});

test('rejeita conteúdo vazio, campos extras, assunto inválido e tipos incorretos', async t => {
  const app = await fixture(t);
  for (const payload of [
    { title: '   ', text: 'Conteúdo' }, { title: 'Teste', text: '\n  ' },
    { title: 'Teste', text: 'Conteúdo', id: 'forjado' },
    { title: 'Teste', text: 'Conteúdo', topic: 'Inexistente' },
    { title: 123, text: 'Conteúdo' },
  ]) {
    const response = await app.inject({ method: 'POST', url: '/api/documents', payload });
    assert.equal(response.statusCode, 400);
    assert.equal(response.json().error, 'validation_error');
  }
  const settings = (await app.inject('/api/settings')).json();
  assert.equal((await app.inject({ method: 'PUT', url: '/api/settings', payload: { ...settings, sources: 'false' } })).statusCode, 400);
  assert.equal((await app.inject('/api/documents?topic=Inexistente')).statusCode, 400);
  assert.equal((await app.inject('/api/documents?q=teste&extra=1')).statusCode, 400);
});

test('limita o texto por bytes UTF-8 e limita o corpo HTTP', async t => {
  const app = await fixture(t);
  const unicode = await app.inject({ method: 'POST', url: '/api/documents', payload: { title: 'Grande', text: 'á'.repeat(110000) } });
  assert.equal(unicode.statusCode, 413);
  assert.equal(unicode.json().error, 'text_too_large');
  const oversized = await app.inject({ method: 'POST', url: '/api/documents', payload: { title: 'Grande', text: 'x'.repeat(1100000) } });
  assert.equal(oversized.statusCode, 413);
});

test('consulta devolve evidência rastreável e reconhece perguntas sem cobertura', async t => {
  const app = await fixture(t);
  const response = await app.inject({ method: 'POST', url: '/api/chat', payload: { question: 'Quais documentos preciso para alugar?' } });
  assert.equal(response.statusCode, 200);
  assert.equal(response.json().status, 'answered');
  assert.equal(response.json().source.id, 'locacao');
  assert.equal(response.json().source.demo, true);
  for (const question of ['Qual a multa de desocupação?', 'Qual é a capital da França?']) {
    const missing = await app.inject({ method: 'POST', url: '/api/chat', payload: { question } });
    assert.equal(missing.json().status, 'insufficient_evidence');
    assert.equal(missing.json().source, null);
  }
  for (const question of ['', '   ', 'x'.repeat(1001)]) {
    assert.equal((await app.inject({ method: 'POST', url: '/api/chat', payload: { question } })).statusCode, 400);
  }
});

test('avaliação inicial executa oito casos contra o backend', async t => {
  const app = await fixture(t);
  const result = await app.inject({ method: 'POST', url: '/api/evaluations' });
  assert.equal(result.statusCode, 200);
  assert.equal(result.json().total, 8);
  assert.equal(result.json().passed, 8);
});

test('configurações e documentos persistem ao reabrir o banco, sem duplicar a base inicial', async () => {
  const tempRoot = resolve('test/.tmp');
  mkdirSync(tempRoot, { recursive: true });
  const filename = resolve(tempRoot, `${randomUUID()}.sqlite`);
  let app = await buildApp({ databasePath: filename });
  try {
    const settings = (await app.inject('/api/settings')).json();
    const saved = await app.inject({ method: 'PUT', url: '/api/settings', payload: { ...settings, name: 'Assistente persistida', sources: false } });
    assert.equal(saved.statusCode, 200);
    await app.inject({ method: 'POST', url: '/api/documents', payload: { title: 'Elevadores', text: 'Inspecionar elevadores.' } });
    await app.close();
    app = await buildApp({ databasePath: filename });
    const reloaded = (await app.inject('/api/settings')).json();
    assert.equal(reloaded.name, 'Assistente persistida');
    assert.equal(reloaded.sources, false);
    assert.equal((await app.inject('/api/documents')).json().length, 5);
  } finally { await app.close(); unlinkSync(filename); }
});

test('motor é substituível e recebe pergunta, documentos e configurações', async t => {
  const engine: AnswerEngine = { mode: 'langchain', async answer(question, documents, settings) {
    assert.equal(question, 'Teste de integração');
    assert.equal(documents.length, 4);
    assert.equal(settings.name, 'Assistente ImobRAG');
    return { answer: 'Motor substituído.', mode: 'langchain', status: 'insufficient_evidence', source: null };
  } };
  const app = await fixture(t, engine);
  const result = await app.inject({ method: 'POST', url: '/api/chat', payload: { question: 'Teste de integração' } });
  assert.equal(result.json().answer, 'Motor substituído.');
  assert.equal(result.json().mode, 'langchain');
  assert.equal((await app.inject('/api/health')).json().mode, 'langchain');
});

test('falha do motor retorna erro sem vazar detalhes e recursos inexistentes retornam 404', async t => {
  const engine: AnswerEngine = { mode: 'demo', async answer() { throw new Error('segredo-interno'); } };
  const app = await fixture(t, engine);
  const result = await app.inject({ method: 'POST', url: '/api/chat', payload: { question: 'Teste' } });
  assert.equal(result.statusCode, 500);
  assert.doesNotMatch(result.body, /segredo-interno/);
  assert.equal((await app.inject('/api/documents/inexistente')).statusCode, 404);
  assert.equal((await app.inject('/api/inexistente')).statusCode, 404);
});
