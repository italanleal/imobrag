# ImobRAG

Aplicação local de consulta documental para imobiliárias. Backend em **Fastify + TypeScript** e SQLite. A interface responsiva foi preservada e conectada à API; React + Vite fica para uma etapa futura.

## Executar

Requisito: Node.js 24.15 ou superior.

```powershell
npm ci
npm run dev
```

- Interface: http://127.0.0.1:4173
- API: http://127.0.0.1:3001/api/health
- Documentação interativa: http://127.0.0.1:3001/docs
- OpenAPI: http://127.0.0.1:3001/docs/json

O banco é criado automaticamente em `backend/data/imobrag.sqlite`. Não precisa de conta ou chave de IA para começar. As configurações opcionais estão em `.env.example` de cada pasta.

## Estrutura

```text
imobrag/
├── backend/
│   ├── src/
│   │   ├── config/          Ambiente
│   │   ├── modules/         Documents, settings, chat e evaluation
│   │   ├── infrastructure/  Banco, HTTP e adaptadores de IA
│   │   └── shared/          Utilitários e erros comuns
│   └── test/integration/
├── frontend/                Interface e cliente da API
├── docs/                    Mapeamento e histórico de validação
├── package.json             Comandos das duas partes
└── package-lock.json        Dependências fixadas
```

A API segue **Controller → Service → Repository**, organizada por funcionalidade. Controllers recebem HTTP; services executam regras; repositories acessam o banco. A apresentação fica no frontend. Veja o detalhamento em `backend/README.md`.

## Funcionalidades

- Cadastro de textos, pesquisa, filtros e acesso às fontes.
- Configurações persistidas no SQLite.
- Consultas pelo backend com fonte ou indicação de ausência de evidência.
- Avaliação com oito casos demonstrativos.
- Documentação OpenAPI e página para testar requisições.
- Interface com carregamento, mensagens de falha e confirmação de salvamento pela API.
- Contrato substituível do motor de respostas para a futura integração com LangChain JS.

## Verificar e executar o build

```powershell
npm run check
npm test
npm run build
npm start
```

Só backend: `npm run dev -w backend`. Só interface: `npm run dev -w frontend`. `npm start` requer o build prévio do backend.

## Limites atuais

O motor demonstrativo compara palavras e devolve o texto inteiro. Não usa LangChain, LLM, embeddings ou busca semântica. Os quatro textos iniciais são fictícios e suas páginas são simuladas. As regras podem falhar e não constituem um RAG pronto para atendimento real.

A importação aceita TXT até 200 KB. PDFs, extração, indexação, histórico persistente e autenticação ficam para as próximas etapas. Não há CRM ou WhatsApp. Os servidores estão limitados a loopback para uso local. Tom e instruções editoriais são armazenados, mas não são interpretados pelo motor demonstrativo.

As antigas informações em localStorage não foram apagadas nem migradas automaticamente. Textos importados na versão anterior precisam ser cadastrados na API novamente.

## Documentação

- `docs/ESCOPO-MVP.md`: objetivos, entregas, limites e critérios de aceite do projeto.
- `docs/PERGUNTAS-MVP.md`: 20 cenários iniciais de consulta e avaliação para revisão.
- `backend/README.md`: arquitetura, rotas e integração futura com LangChain.
- `frontend/README.md`: interface, proxy e configuração.
- `docs/MAPEAMENTO-LAIS.md`: referência de produto e adaptações.
- `docs/VALIDACAO.md`: histórico de verificações.
- `docs/BRIEFING-CODEX.md`: direcionamento para evoluir o RAG.

O projeto está publicado no GitHub. A entrega de setup local foi registrada na issue #9.
