# Backend ImobRAG

API local em Fastify + TypeScript. Node.js 24.15 ou superior. Não utiliza Python.

## Executar

Na raiz do projeto, execute `npm ci` e depois `npm run dev` para iniciar API e interface. Para iniciar só a API: `npm run dev -w backend`.

- API: http://127.0.0.1:3001/api/health
- Documentação com formulário de teste: http://127.0.0.1:3001/docs
- OpenAPI: http://127.0.0.1:3001/docs/json

Configuração opcional: copie `.env.example` para `.env` dentro de `backend/`. Os padrões funcionam sem arquivo de ambiente. `PORT` define a porta; `DATABASE_PATH` define o arquivo SQLite, relativo a `backend/` ou por caminho absoluto. Se mudar a porta, configure `API_PORT` em `frontend/.env` também.

## Rotas

| Método | Rota | Função |
|---|---|---|
| GET | `/api/health` | Verifica API e banco e informa o modo do motor |
| GET | `/api/documents` | Lista documentos; aceita `q` e `topic` |
| GET | `/api/documents/:id` | Retorna o documento usado como fonte |
| POST | `/api/documents` | Cadastra texto via JSON |
| GET | `/api/settings` | Lê configurações |
| PUT | `/api/settings` | Substitui configurações |
| POST | `/api/chat` | Consulta a base com uma pergunta |
| POST | `/api/evaluations` | Executa oito verificações demonstrativas |

Cadastro de documento:

```json
{
  "title": "Manual de elevadores",
  "text": "Elevadores devem passar por inspeções periódicas.",
  "topic": "Manutenção"
}
```

Título: 1–160 caracteres, sem aceitar apenas espaços. Texto: até 200 KB em UTF-8. Assuntos: Locação, Manutenção, Vistorias, Desocupação e Importados. O padrão é Importados. ID, data e marcação de origem são atribuídos pelo servidor. Não há upload multipart nem extração de PDF nesta etapa.

Consulta: `{"question":"Como solicitar manutenção?"}`. A resposta contém `answer`, `status`, `mode` e `source`. Sem cobertura, `status` é `insufficient_evidence` e `source` é `null`. O campo `sources` da configuração controla a exibição na interface; a API mantém a evidência no resultado para rastreabilidade.

Erros usam códigos HTTP e `{ "error": "...", "message": "..." }`. Campos desconhecidos e tipos incorretos são rejeitados; falhas internas não expõem detalhes ao cliente.

## Organização: módulos com camadas

Cada funcionalidade reúne seus próprios arquivos. O padrão é **Controller → Service → Repository**. Models definem os dados e schemas definem o contrato HTTP. A apresentação fica no frontend.

```text
src/
├── app.ts                         Montagem das dependências e módulos
├── server.ts                      Inicialização e encerramento
├── config/environment.ts          Configuração do ambiente
├── modules/
│   ├── documents/
│   │   ├── documents.controller.ts
│   │   ├── documents.service.ts
│   │   ├── documents.repository.ts
│   │   ├── documents.model.ts
│   │   └── documents.schemas.ts
│   ├── settings/                  Camadas próprias para configurações
│   ├── chat/                      Controller, service, model e schemas
│   └── evaluation/                Controller, service e casos
├── infrastructure/
│   ├── database/                  Conexão, migrações e seed
│   ├── ai/                        Adaptador de IA demonstrativo
│   └── http/                      Erros, saúde e documentação
└── shared/                        Erros da aplicação e utilitários

test/integration/api.test.ts        Testes da API e persistência
```

Exemplo: `POST /api/documents` passa pelo controller e pela validação de schemas. O controller chama `DocumentsService.create`, que aplica limites, cria o ID e prepara o conteúdo. O service chama `DocumentsRepository.insert`, responsável pelo SQL.

Regras para manter a organização:

- Controller lida com HTTP e delega ao service; não executa SQL nem define regras de busca.
- Service contém regras e coordena operações; não importa Fastify.
- Repository cuida apenas da persistência do seu módulo; não recebe request ou reply.
- Model define os tipos da funcionalidade. Schemas validam e documentam a entrada e a saída HTTP.
- `app.ts` monta e injeta as dependências explicitamente, sem dependências globais.
- Infraestrutura cuida de detalhes externos. A conexão do banco é compartilhada e encerrada com a aplicação.
- Módulos sem persistência própria não precisam de repository: chat e avaliação usam os services existentes.

## Dados

O banco é criado automaticamente em `backend/data/imobrag.sqlite` e fica fora do Git. Na primeira execução, uma migração cadastra quatro textos fictícios e a configuração padrão. Reiniciar não duplica esses dados. Os testes não usam esse banco; criam bancos em memória ou arquivos temporários próprios.

Esta é uma base local, sem autenticação ou isolamento entre usuários. Os servidores escutam apenas em `127.0.0.1`. Não publicar esta configuração como serviço aberto. Histórico de conversas não é persistido. A avaliação usa a base atual, então novos textos podem alterar os resultados.

## Futuro LangChain JS

Implemente `AnswerEngine`, definido em `src/modules/chat/chat.model.ts`, em um novo adaptador dentro de `src/infrastructure/ai/` e passe a instância para `buildApp({ databasePath, engine })`. Esse contrato recebe pergunta, documentos e configurações e retorna resposta, status, modo e evidência. Há um teste que comprova a substituição sem mudar as rotas.

Ao criar o motor real, adicionar recuperação de trechos, embeddings, referências de página reais e um critério para ausência de evidência. O motor atual só compara palavras e devolve o texto inteiro; pode recuperar material inadequado e não deve orientar atendimentos reais. Seus bloqueios de termos são regras demonstrativas, não uma política de segurança. Nome e fontes afetam a interface; tom e instruções editoriais ainda não são interpretados pelo motor.

LangChain e provedores de IA não foram instalados e nenhuma chamada externa de IA é feita. Chaves futuras devem ficar apenas no ambiente do backend.

## Verificação

Na raiz: `npm run check`, `npm test`, `npm run build`. Para executar o código compilado: `npm start` na raiz ou `npm start -w backend` para só a API. O build fica em `backend/dist/`; o SQLite é o mesmo em desenvolvimento e no código compilado.

Referências de implementação: [Fastify TypeScript](https://fastify.dev/docs/latest/Reference/TypeScript/), [testes com Fastify](https://fastify.dev/docs/latest/Guides/Testing/) e [LangChain JS](https://docs.langchain.com/oss/javascript/langchain/overview).
