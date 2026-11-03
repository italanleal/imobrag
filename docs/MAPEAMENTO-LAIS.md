# LAIS → ImobRAG: mapa de referência e adaptação

Pesquisa: 03/11/2026. Referência: https://casa.lais.ai/configs, inspecionada no navegador com sessão existente. Implementação: pasta local indicada pelo usuário. Tanto a pasta quanto o repositório remoto estavam vazios no início.

## Como interpretar este mapa

“Observado” significa conteúdo exibido na interface; “recomendação” é uma decisão de produto para o ImobRAG. A presença de uma opção não comprova sua eficácia, taxa de conversão ou implementação interna. O mapa cobre arquitetura de navegação e configurações acessíveis; não é uma auditoria completa do produto ou do seu backend. Não foram alteradas configurações na LAIS.

## Arquitetura observada

```text
Casa da LAIS
├── Início
├── Conversas
├── Disparos em massa
├── Gestão de leads
│   ├── Leads
│   └── Visitas
├── Gestão de imóveis
│   ├── Captação
│   ├── Atualização de imóveis
│   └── Empreendimentos
├── Relatórios
│   ├── Bairros e imóveis
│   └── Avaliações no Google
├── Minha Lais
│   ├── Meu negócio
│   ├── Perfil do WhatsApp
│   ├── Modelos de mensagem
│   ├── Integrações Meta
│   └── Comportamento da Lais
│       ├── Pré-agendamento de visita
│       ├── Qualificação e Envio ao CRM
│       ├── Reengajamento automático
│       └── Endereço e IPTU dos imóveis
├── Usuários e equipes
├── Pacotes adicionais
├── Plano e cobranças
├── Guia da Lais
└── Ajuda
```

Também foram observados contexto da imobiliária na lateral, menu recolhível, breadcrumbs, notificações, novidades e perfil. Os submenus de leads, imóveis e relatórios foram expandidos. As demais áreas operacionais não foram auditadas por dentro.

## Inventário de configurações

| Área | Evidência observada | Intenção aparente | Adaptação recomendada |
|---|---|---|---|
| Meu negócio | Cartão descreve funcionamento, documentação e garantias | Dar contexto à assistente | Base de conhecimento com documentos, assunto, versão e fonte |
| Perfil do WhatsApp | Cartão menciona nome, foto e descrição | Identidade consistente | Nome e apresentação da assistente; canal externo posterior |
| Modelos de mensagem | Link `/configs_templates` descreve criação e gestão de modelos | Padronizar comunicação | Perguntas sugeridas e padrão de resposta, sem disparos no MVP |
| Integrações Meta | Link `/configs_meta_integration` menciona leads de campanhas | Aquisição integrada | Fora do MVP documental |
| Pré-agendamento | Cartão propõe sugestões de datas e horários | Aproximar atendimento de uma ação | Apenas orientação documental sobre vistoria, sem agendar |
| Qualificação e CRM | Tela carregada em `/configs_behavior` com perguntas essenciais e envio ao CRM | Coletar contexto antes de encaminhar | Pedir informação de contexto quando necessário; sem pipeline de leads |
| Reengajamento | Cartão descreve leads que deixam de responder | Retomar a conversa | Fora do MVP; considerar continuidade do histórico no futuro |
| Endereço e IPTU | Cartão define comportamento frente a esses dados | Controlar o conteúdo das respostas | Explicitar limites e ausência de evidência |

## Fluxo de qualificação observado em detalhe

A tela apresentava quatro perguntas ativas: nome do lead, bairro desejado, características específicas do imóvel e faixa de preço. Havia uma ação “Editar”, identificação de pergunta qualificatória, categorias e uma explicação contextual. O texto da interface dizia que a opção qualificatória condiciona o envio ao CRM à resposta daquela pergunta. Isso foi lido; não foi testado enviando leads.

O ponto reaproveitável é a configuração orientada a uma decisão do usuário, com explicação próxima. No ImobRAG isso se traduz em “mostrar fontes”, “explicar falta de cobertura” e “qual contexto ainda falta para responder”.

## O que parece promissor — hipóteses, sem métrica de desempenho

1. Navegação permanente: torna o conjunto de áreas visível. Adaptada para cinco entradas relacionadas ao trabalho documental.
2. Separar conhecimento e comportamento: facilita descobrir onde mudar conteúdo e onde mudar a apresentação da assistente.
3. Cartões com pergunta e finalidade: ajudam o operador a entender cada configuração sem aprender terminologia técnica.
4. Contexto persistente: o usuário sabe em qual espaço está; o protótipo usa um único ambiente de demonstração.
5. Ajuda no contexto: explicações junto às opções reduzem ambiguidade. Aplicada às fontes e aos limites do protótipo.
6. Perguntas estruturadas antes do encaminhamento: princípio útil para solicitar esclarecimento. Fluxo de esclarecimento semântico fica para o backend real.

Não há evidência coletada de que esses padrões causam a posição competitiva da LAIS. Validar com usuários e métricas de tarefa.

## Limitações da inspeção

- Meu negócio abriu `/configs_my_business`, mas seu conteúdo incorporado permaneceu carregando.
- Endereço e IPTU abriu `/configs_property_info`, também com conteúdo incorporado em carregamento.
- Parte do comportamento usa tela legada incorporada. Foram observados rótulos e conteúdo carregado; nenhuma conclusão sobre APIs, prompts, modelos ou arquitetura de IA foi inferida disso.
- Não foram testados edição, salvamento, CRM, agendamento, reengajamento, Meta ou envio de mensagens.
- Não foram copiados dados de clientes, conversas, credenciais, logotipo ou ativos da LAIS.

## Decisões para o ImobRAG

O escopo de referência é a [issue #8](https://github.com/italanleal/imobrag/issues/8): consulta documental sobre locação, manutenção, vistorias e desocupação, com exclusão de autenticação complexa, múltiplas imobiliárias e automação de processos. A proposta abaixo é uma recomendação para revisão da equipe, sem aprovação presumida do escopo.

| Prioridade | Entrega | Resultado para o usuário |
|---|---|---|
| P0 | Consulta e fonte verificável | Entender a orientação e conferir sua origem |
| P0 | Base documental identificada | Saber quais informações sustentam o atendimento |
| P0 | Ausência de evidência | Evitar apresentar uma lacuna como resposta confirmada |
| P1 | Configuração simples da assistente | Identidade e apresentação consistentes |
| P1 | Avaliação com casos representativos | Encontrar falhas antes da demonstração |
| Posterior | WhatsApp | Canal adicional, condicionado à estabilidade do núcleo |
| Fora do MVP | CRM, campanhas, cobrança, gestão de leads e imóveis | Evitar ampliar o produto além da consulta documental |

O [roadmap #1](https://github.com/italanleal/imobrag/issues/1) contempla processamento documental, recuperação, respostas com fontes, chat e avaliação; WhatsApp aparece como integração condicional. O protótipo antecipa a experiência dessas áreas, sem concluir as tarefas de backend do roadmap.

## Arquitetura proposta de interface

| Tela | Objetivo | Implementado no protótipo | Integração posterior |
|---|---|---|---|
| Visão geral | Encontrar a próxima ação | Contagens locais, atalhos e assuntos | Indicadores reais e cobertura |
| Consultas | Perguntar e verificar fonte | Busca textual, trechos e modal de fonte | Retriever, LLM, esclarecimentos e citações reais |
| Base | Inspecionar conteúdo | Tabela, pesquisa, filtro, TXT local | PDFs, extração, status e versões |
| Minha assistente | Definir apresentação | Nome, fontes e persistência local | Instruções interpretadas e versionadas |
| Avaliação | Revisar os caminhos | Oito verificações funcionais | 15–20 casos e revisão humana |

## REA fornecido pelo usuário

O [morluto/rea](https://github.com/morluto/rea) foi consultado. Ele oferece ferramentas de inspeção de aplicações e websites. Não foi instalado: a navegação autenticada existente bastou para esta análise de interface. Não foi realizado exame de código interno da LAIS.
