# Validação do protótipo — 03/11/2026

## Verificado

- `npm run check`: verificação sintática do app.js passou.
- Servidor local iniciou em 127.0.0.1:4173 e a interface carregou no Chrome.
- Revisão visual da tela inicial em desktop: navegação, hierarquia e painel principal renderizados.
- Tela Avaliação executada pelo navegador: 8 de 8 casos passaram (quatro documentos esperados e quatro ausências de evidência).
- Pergunta sugerida de locação exibiu o texto esperado e um botão de fonte.
- Botão da fonte abriu o documento e identificou a página como simulada.
- Busca por “vistoria” retornou os dois documentos que contêm o termo, incluindo desocupação.
- Configurações salvas e tela recarregada sem erro; o nome alterado persistiu após recarregar. O nome padrão foi restaurado em seguida.

## Limites desta validação

As oito verificações são casos fixos do protótipo textual, não avaliação de um modelo de IA. A importação TXT não foi testada nesta rodada. Revisão em dispositivo físico e validação de acessibilidade completa seguem pendentes. A revisão responsiva em navegador está registrada abaixo.

Nenhum documento real foi importado. Não houve teste de integração, pois não há backend de RAG nesta entrega.

## Revisão responsiva — 03/11/2026

- Conferidas as cinco rotas em larguras de 320, 390, 768, 1024, 1366 e 1920 px: 30 combinações. A leitura foi feita após confirmar o título de cada tela.
- A largura rolável foi igual à largura útil da página em todas as combinações. Nenhum elemento visível de conteúdo, cabeçalho ou navegação ultrapassou horizontalmente a viewport.
- Revisão visual do início em desktop, da base documental em celular e do modal de fonte em celular.
- Menu móvel abriu; a escolha de Consultas fechou o menu e atualizou o estado aria-expanded para false. Escape também fechou o menu e devolveu o foco ao botão.
- Consulta sugerida e abertura da fonte funcionaram no layout de celular.
- Reexecução dos oito casos funcionais: 8 de 8 passaram.
- Melhorias: grades com minmax(0, 1fr), barra lateral rolável, margens compartilhadas, botões e formulários maiores, tabelas convertidas em cartões no celular, quebra de texto e modal limitado à altura disponível.
- Não houve teste em dispositivo físico nem simulação de teclado virtual. Os textos importados e testes completos de leitores de tela continuam pendentes.

## Backend Fastify e arquitetura modular — 03/11/2026

- Organização por funcionalidade: documents, settings, chat e evaluation.
- Separação Controller → Service → Repository, com models e schemas próprios por módulo.
- Banco, migrações, seed, erros HTTP e adaptador de IA separados em infraestrutura.
- Nove testes de integração passaram após a reorganização: contratos, limites de entrada, documentos, consultas com e sem fonte, persistência, erros e motor substituível.
- TypeScript e verificação sintática do frontend passaram; build do backend compilou.
- Auditoria npm não apontou vulnerabilidades nas dependências instaladas.
- Consulta com fonte executada pelo frontend por chamada à API. Oito casos da avaliação retornaram sucesso na interface conectada.
- Nome da assistente salvo pela interface e persistido após recarregar via API. O nome padrão foi restaurado.
- Documentação interativa executou POST /api/chat e exibiu HTTP 200 com fonte.
- A requisição de avaliação sem corpo foi corrigida para não enviar Content-Type JSON vazio e foi repetida com sucesso.
- Frontend preservado sem migração para React. LangChain, PDFs e embeddings ainda não implementados.
