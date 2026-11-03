# ImobRAG — protótipo de interface

Protótipo local construído a partir de padrões observados na Casa da LAIS e do escopo do ImobRAG. Pesquisa realizada em 03/11/2026.

## Executar

Com Node.js instalado, abra um terminal nesta pasta e execute:

```powershell
npm start
```

Abra http://127.0.0.1:4173. Não há dependências para instalar. Para conferir a sintaxe: `npm run check`.

## O que funciona

- Cinco áreas navegáveis: visão geral, consultas, base documental, assistente e avaliação.
- Consulta por palavras-chave sobre quatro textos fictícios, com referência e abertura do conteúdo.
- Resposta de ausência de evidência para perguntas sem correspondência e alguns limites explícitos.
- Busca documental por título e conteúdo, filtro de assunto e importação local de TXT de até 200 KB.
- Nome da assistente e exibição de fontes aplicados à interface; configurações e textos importados persistidos no navegador.
- Oito casos funcionais executáveis na tela Avaliação.

## Limites

Não há backend de RAG, embeddings, LLM, extração de PDF, autenticação, CRM, WhatsApp ou armazenamento compartilhado. As páginas de referência são simuladas. A busca por palavras-chave pode recuperar um texto inadequado; o bloqueio de alguns termos é apenas uma regra de demonstração e não uma solução de segurança ou avaliação semântica. Tom e instruções editoriais são apenas salvos, sem interpretação por IA. As conversas duram uma sessão e somem ao recarregar.

Os textos de exemplo não são documentos reais, políticas contratuais nem orientação jurídica. A importação TXT adiciona palavras de busca e disponibiliza o texto inteiro; não extrai nem resume conteúdo. Não use documentos pessoais ou de clientes para apresentar este protótipo.

Os estilos usam Google Fonts com fontes locais alternativas. A aplicação funciona sem as fontes remotas. O servidor aceita apenas conexões locais e uma lista fixa de arquivos.

## Documentação

- `docs/MAPEAMENTO-LAIS.md`: observações, limitações e decisões de adaptação.
- `docs/BRIEFING-CODEX.md`: especificação para evoluir o protótipo.
- `docs/VALIDACAO.md`: verificações realizadas e pendências.

Não foi feito commit, push ou alteração de issues no GitHub.
