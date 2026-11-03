# Briefing para continuar o ImobRAG no Codex

Trabalhe na pasta `C:\Users\carlo\OneDrive\Documentos\imobrag`. Leia README.md e docs/MAPEAMENTO-LAIS.md antes de editar. O protótipo existente é a referência visual inicial. Mantenha alterações do usuário e confira o estado do repositório antes de iniciar.

## Objetivo

Evoluir o protótipo para uma aplicação de consulta documental imobiliária. Inspirar-se nos padrões observados na Casa da LAIS: navegação permanente, separação entre conhecimento e comportamento, configurações com finalidade explícita e ajuda no contexto. Manter identidade própria verde e creme, sem copiar marca, textos comerciais ou dados da LAIS.

O foco é locação, manutenção, vistorias e desocupação. Validar o conjunto documental com a equipe. Não tratar os textos fictícios como base de produção. Não implementar CRM, campanhas, multiempresa, autenticação complexa ou automações como parte deste MVP.

## Experiência a preservar

- Visão geral com atalhos e indicadores derivados de dados reais.
- Consultas com pergunta, orientação e fontes verificáveis por documento, página e trecho.
- Ausência de evidência explícita; solicitar esclarecimento em perguntas ambíguas.
- Base documental com importação, status, pesquisa e inspeção.
- Configuração editorial simples; rotular opções ainda não conectadas.
- Avaliação com perguntas, resultado esperado, resultado obtido e revisão humana.
- Layout responsivo, foco visível, controles rotulados e navegação por teclado.

## Implementação por etapas

1. Ler o backlog atual e verificar decisões técnicas já tomadas. A stack atual é Fastify + TypeScript, SQLite e frontend HTML/CSS/JS. Preservar a organização modular Controller → Service → Repository. React + Vite continua sendo uma evolução futura da interface.
2. Receber PDFs aprovados para demonstração, extrair texto preservando documento e página e inspecionar a qualidade. Tratar PDF sem texto como caso explícito, sem marcar processamento como concluído.
3. Criar chunks com identificadores estáveis, metadados e versões; gerar embeddings e persistir o índice conforme decisão técnica da equipe.
4. Implementar recuperação semântica com evidências rastreáveis. Substituir o DemoAnswerEngine em backend/src/infrastructure/ai, implementando o contrato AnswerEngine de modules/chat. A busca de palavras-chave e os bloqueios demonstrativos não são o motor do produto final.
5. Integrar geração condicionada ao contexto recuperado. Citações devem apontar exclusivamente para trechos efetivamente usados. Não inventar documentos, páginas, prazos, multas ou responsabilidades.
6. Conectar a interface a endpoints documentados. Expor estados de carregamento, erro, base vazia, processamento e ausência de evidência. Evitar mensagens de sucesso antes da confirmação do backend.
7. Preparar 15–20 perguntas com e sem cobertura, ambiguidades, documentos conflitantes e tentativas de instrução dentro dos documentos. Avaliar a fundamentação e a correção da fonte, além da recuperação.
8. Demonstrar os quatro assuntos e uma pergunta sem evidência. Atualizar README com execução, variáveis de ambiente, limitações e evidências dos testes.

## Critérios de revisão

- Uma pergunta coberta apresenta orientação sustentada por trecho real acessível na interface.
- Uma pergunta sem cobertura não recebe uma conclusão fabricada.
- O usuário consegue identificar o documento consultado e conferir o trecho.
- Importação inválida, falha de processamento e base vazia têm estados claros.
- O caminho básico é utilizável em desktop e celular e por teclado.
- Segredos ficam fora do frontend e do controle de versão.
- As métricas e os resultados de avaliação usam execuções reais; não confundir verificações do protótipo com qualidade do RAG.

Referências: https://github.com/italanleal/imobrag/issues/8 e https://github.com/italanleal/imobrag/issues/1. Usar o board para alinhamento; não marcar tarefas concluídas nem publicar comentários sem solicitação do usuário.
