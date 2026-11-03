# Escopo do projeto ImobRAG

Versão 1.0 — 03/11/2026

Status: documento de referência para desenvolvimento e revisão da equipe. As escolhas técnicas abaixo refletem o projeto atual; o conjunto documental, as perguntas e os limites funcionais ainda precisam de validação da equipe. A criação deste documento não representa aprovação coletiva nem conclusão automática da issue #8.

## 1. Visão do produto

O ImobRAG será um assistente de consulta documental para a equipe de uma imobiliária. O usuário fará uma pergunta em português e receberá uma orientação baseada nos documentos cadastrados, acompanhada de fontes verificáveis. Quando não houver informação suficiente, o sistema deverá indicar a lacuna e orientar a consulta à equipe responsável.

O problema a resolver é o tempo gasto procurando orientações em arquivos e a dificuldade de conferir de onde veio uma resposta. O produto deve reunir o conhecimento operacional e tornar sua origem acessível durante a consulta.

O MVP atenderá uma única imobiliária, em ambiente local de demonstração. Os usuários principais serão atendentes, colaboradores administrativos e responsáveis pela base documental. Atendimento direto a clientes por canais externos fica para uma etapa posterior.

## 2. Objetivos e resultados esperados

- Consultar documentos sobre locação, manutenção, vistorias e desocupação.
- Recuperar trechos relevantes e gerar respostas sustentadas por esses trechos.
- Permitir a conferência do documento, página e conteúdo usados como evidência.
- Reconhecer perguntas sem cobertura e solicitar esclarecimento quando necessário.
- Demonstrar um fluxo completo: cadastrar documento, processar, consultar e conferir a fonte.
- Manter uma base de avaliação reproduzível para identificar falhas de recuperação e fundamentação.

O mapeamento da LAIS é referência de organização da interface e configuração da assistente. O ImobRAG terá identidade e implementação próprias. Não se presume acesso ao funcionamento interno ou às métricas da LAIS.

## 3. Assuntos contemplados

| Assunto | Cobertura pretendida | Limite |
|---|---|---|
| Locação | Documentação, garantias e orientações do processo | Usar apenas as regras efetivamente documentadas |
| Manutenção | Registro de solicitações, informações necessárias e encaminhamento | Não atribuir responsabilidade ou custo sem evidência |
| Vistorias | Preparação, registros, laudos e comunicação de divergências | Não aprovar laudos ou decidir conflitos automaticamente |
| Desocupação | Solicitação de saída, vistoria e entrega de chaves | Não presumir prazos, multas ou condições contratuais |

O sistema orienta a consulta ao conteúdo fornecido. Não substitui avaliação humana em decisões contratuais, jurídicas ou operacionais.

## 4. Base documental inicial

O repositório possui quatro textos fictícios em `backend/src/infrastructure/database/seeds.ts`. Eles servem à demonstração técnica e não representam documentos reais aprovados.

O conjunto abaixo é uma proposta de seleção. Nenhum arquivo real foi fornecido ou validado nesta entrega.

| Identificador proposto | Documento a selecionar | Situação |
|---|---|---|
| DOC-LOC-001 | Guia ou procedimento de locação | Arquivo e versão pendentes |
| DOC-MAN-001 | Manual de registro e encaminhamento de manutenção | Arquivo e versão pendentes |
| DOC-VIS-001 | Procedimento ou roteiro de vistoria | Arquivo e versão pendentes |
| DOC-DES-001 | Procedimento de desocupação e entrega de chaves | Arquivo e versão pendentes |

Para cada arquivo selecionado, registrar título, assunto, origem, responsável pela validação, versão ou data, formato e páginas utilizadas. Usar documentos autorizados para a demonstração, sem dados pessoais desnecessários. Caso o conteúdo não cubra uma pergunta prevista, registrar a lacuna em vez de inventar uma resposta.

O formato principal do MVP será PDF com texto selecionável. TXT continuará disponível como apoio. PDF digitalizado sem texto deverá ser identificado como não processado e receber uma explicação; OCR não faz parte da primeira versão.

## 5. Requisitos funcionais

| ID | Requisito | Critério de aceite |
|---|---|---|
| RF01 | Cadastrar documentos e identificar sua origem | Documento fica identificado e disponível na base; arquivo inválido não gera confirmação de sucesso |
| RF02 | Extrair e inspecionar texto de PDF | Texto extraído preserva documento e página; falha ou ausência de texto é informada |
| RF03 | Dividir conteúdo e gerar índice de busca | Trechos mantêm identificadores e metadados; o índice pode ser utilizado após reiniciar |
| RF04 | Recuperar trechos relevantes | Busca retorna evidências relacionadas à pergunta com sua origem |
| RF05 | Gerar respostas com LangChain JS | Resposta usa o contexto recuperado; regras e provedores ficam no backend |
| RF06 | Exibir fontes verificáveis | Usuário consegue abrir o trecho e identificar documento e página reais; páginas simuladas não contam como evidência final |
| RF07 | Tratar ausência ou ambiguidade de evidência | Sistema informa falta de cobertura ou pede esclarecimento, sem apresentar uma conclusão inventada |
| RF08 | Disponibilizar chat responsivo | Perguntar, acompanhar carregamento, ver resposta e abrir fonte funciona em celular e computador |
| RF09 | Gerenciar a apresentação da assistente | Configurações persistem; ajustes editoriais não autorizam ignorar fontes ou inventar informações |
| RF10 | Avaliar o comportamento | Executar 15–20 casos com pergunta, resultado esperado, fonte esperada e resultado observado |

Fontes devem continuar acessíveis na experiência final. A opção atual de ocultar a exibição precisa ser compatibilizada com RF06 antes do aceite do MVP; a API já mantém a evidência no resultado.

## 6. Fluxo principal

1. O responsável seleciona um documento e registra seus metadados.
2. O sistema extrai e apresenta o estado do processamento.
3. O conteúdo é dividido em trechos e indexado com referências de origem.
4. O usuário faz uma pergunta no chat.
5. O backend recupera evidências e chama o motor de respostas.
6. A interface apresenta orientação e fontes, ou indica falta de evidência.
7. O usuário confere os trechos; dúvidas não resolvidas seguem para análise humana.

Devem existir estados claros para base vazia, arquivo sem texto, processamento em andamento, erro da API, erro do provedor e consulta sem evidência.

## 7. Arquitetura e decisões técnicas

- Backend: Fastify + TypeScript, executado em Node.js.
- Organização: módulos por funcionalidade, com Controller → Service → Repository, models e schemas próprios.
- Persistência atual: SQLite para documentos e configurações.
- Motor futuro: LangChain JS, por meio do contrato `AnswerEngine` de `backend/src/modules/chat/chat.model.ts`.
- Adaptadores de IA: `backend/src/infrastructure/ai/`, separados das regras HTTP.
- Frontend atual: HTML, CSS e JavaScript, conectado à API. React + TypeScript + Vite é uma evolução prevista; a troca de tecnologia não é condição para validar o RAG.
- API documentada por OpenAPI; testes de integração executáveis localmente.

O provedor de linguagem, o modelo de embeddings, o armazenamento vetorial e os limites de custo ainda serão definidos. Nenhuma escolha desses componentes é apresentada como implementada.

## 8. Qualidade e restrições

- Respostas fundamentadas no conjunto documental autorizado; instruções encontradas nos documentos não podem redefinir as regras do sistema.
- Sem fabricação de documentos, páginas, valores, prazos, contatos ou políticas.
- Configurações e documentos preservados entre reinicializações.
- Chaves e credenciais somente no backend e fora do Git.
- Uso local para uma imobiliária; esta entrega não estabelece uma arquitetura de produção pública.
- Interface sem transbordamento horizontal nas larguras de referência de 320, 390, 768, 1024, 1366 e 1920 px, com foco visível e controles rotulados.
- Erros devem ser compreensíveis ao usuário, sem expor detalhes internos ou segredos.
- Latência, cobertura, recuperação e correção das fontes devem ser registradas nas avaliações; metas numéricas dependem da primeira medição com documentos reais.

## 9. Fora do escopo do MVP

- Autenticação complexa, permissões avançadas e múltiplas imobiliárias.
- CRM completo, funil de vendas, campanhas, disparos e integrações Meta.
- Gestão comercial de imóveis, cobrança e pagamentos.
- Agendamento automático, aprovação de laudos e execução de processos.
- Decisões jurídicas ou contratuais e cálculos sem respaldo documental.
- OCR, processamento de qualquer formato e sincronização automática de fontes externas.
- Histórico persistente completo de conversas e painéis analíticos avançados.
- Publicação pública e operação em produção com clientes reais.

WhatsApp é uma integração opcional posterior, condicionada à estabilidade do núcleo e às credenciais necessárias. Não é requisito para demonstrar o MVP pelo chat web.

## 10. Entregas e sequência de execução

| Etapa | Entrega | Situação em 03/11/2026 |
|---|---|---|
| Base do projeto | Repositório local, API, SQLite, interface responsiva e testes | Implementada; publicação no GitHub não realizada |
| Escopo e conteúdo | Este documento, seleção documental e perguntas iniciais | Proposta registrada; documentos reais e validação da equipe pendentes |
| Processamento | PDFs com texto extraído, páginas e inspeção | Pendente |
| Recuperação | Trechos, embeddings, índice persistente e busca semântica | Pendente |
| Respostas | LangChain, geração fundamentada e citações reais | Pendente |
| Avaliação e apresentação | Casos revisados, resultados, correções e roteiro de demonstração | Oito casos demonstrativos existentes; bateria final pendente |

O planejamento de sprints e os marcos de apresentação permanecem no roadmap do projeto. Esta proposta não redefine datas ou responsáveis.

## 11. Critérios para encerrar o MVP

- Um conjunto documental validado cobre os quatro assuntos, com suas lacunas registradas.
- O fluxo de processamento e consulta funciona de ponta a ponta com os documentos selecionados.
- Cada assunto possui uma demonstração de resposta sustentada por fonte real verificável.
- Perguntas sem cobertura e perguntas ambíguas recebem tratamento explícito.
- Os casos de avaliação foram executados e revisados; não existem falhas críticas de fundamentação ou referência conhecidas nos casos aceitos.
- Execução local, limitações, decisões e evidências estão documentadas.
- A demonstração não depende da integração opcional com WhatsApp.

Os nove testes atuais validam a API e a persistência; os oito casos atuais validam a busca demonstrativa. Esses resultados não comprovam a qualidade de um RAG semântico ainda não implementado.

## 12. Perguntas, decisões pendentes e aprovação

As 20 perguntas propostas estão em `PERGUNTAS-MVP.md`. São cenários para revisão, sem respostas de política presumidas.

Antes de considerar a definição de escopo concluída, registrar:

1. Arquivos e versões que integrarão a base inicial.
2. Responsável da equipe por validar cada assunto.
3. Perguntas e fontes esperadas após leitura dos arquivos.
4. Concordância da equipe com o que entra e o que fica fora do MVP.
5. Evidência no acompanhamento do projeto, após publicar a documentação.

Documento criado a pedido do usuário. Aprovação formal da equipe: pendente de registro.

## Referências

A definição dos quatro assuntos e os limites iniciais vêm da [issue #8 — Definir escopo e perguntas do MVP](https://github.com/italanleal/imobrag/issues/8). A sequência de processamento, recuperação, respostas, chat e avaliação segue o [roadmap #1](https://github.com/italanleal/imobrag/issues/1). Requisitos detalhados, arquitetura e critérios operacionais deste documento consolidam as decisões desta conversa e propostas para revisão.
