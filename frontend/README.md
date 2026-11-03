# Frontend ImobRAG

A interface responsiva anterior foi preservada em HTML, CSS e JavaScript, agora separada em `frontend/` e conectada à API. A migração para React + Vite pode ser feita em uma próxima etapa; ela não faz parte desta implementação de backend.

Inicie tudo pela raiz com `npm run dev`. Para iniciar só o servidor da interface: `npm run dev -w frontend`. Abra http://127.0.0.1:4173.

`api.js` concentra as requisições. `server.mjs` serve os arquivos e encaminha `/api/*` para a API local na porta 3001. A origem da API é fixa em loopback; `API_PORT` pode ser configurado em `frontend/.env` seguindo `.env.example`. Os dois lados usam a mesma origem no navegador, sem liberar CORS indiscriminadamente.

Documentos, consultas, configurações e avaliação usam o backend. A tela indica carregamento e erros, permite tentar novamente e confirma o salvamento depois da resposta da API. Não há fallback silencioso para dados locais quando a API está fora do ar.

As antigas chaves de localStorage do protótipo não foram apagadas nem migradas automaticamente. Caso existam textos importados na versão antiga, eles precisam ser cadastrados novamente na API. O histórico de conversa continua apenas em memória e some ao recarregar.
