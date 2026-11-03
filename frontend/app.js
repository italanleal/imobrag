import { api } from './api.js';

const $ = s => document.querySelector(s);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
let docs = [];
let settings = { name: 'Assistente ImobRAG', tone: 'Acolhedor e objetivo', instructions: '', sources: true };
let loading = true;
let loadError = '';
let chatBusy = false;
let evaluationBusy = false;
let evaluationResult = null;
let evaluationError = '';
let messages = [];
const routes=[['inicio','⌂','Visão geral'],['consultas','▤','Consultas'],['base','▧','Base de conhecimento'],['assistente','✧','Minha assistente'],['avaliacao','◴','Avaliação']];
const topics=[['Locação','⌂','Documentação e garantias','Quais documentos preciso para alugar?'],['Manutenção','⚒','Solicitações e encaminhamentos','Como solicitar manutenção?'],['Vistorias','▧','Laudos e registros do imóvel','Como registrar uma vistoria?'],['Desocupação','↗','Saída e entrega das chaves','Como iniciar a desocupação?']];
const btn=(label,route,secondary=false)=>`<a class="btn ${secondary?'secondary':''}" href="#${route}">${label} <span>↗</span></a>`;
const head=(label,title,description,action='')=>`<div class="page-head"><div><span class="eyebrow">${label}</span><h1>${title}</h1><p>${description}</p></div>${action}</div>`;
function toast(text){$('#toast').textContent=text;$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',3500);}
function docRows(){return docs.slice(0,4).map(d=>`<div class="row"><span class="doc-icon">▧</span><div><b>${escapeHTML(d.title)}</b><p>${escapeHTML(d.topic)} · ${d.demo?'exemplo fictício':'texto cadastrado'}</p></div><span class="badge">Disponível</span></div>`).join('');}
function topicCards(){return topics.map(t=>`<button class="topic-card" data-question="${escapeHTML(t[3])}"><span class="topic-icon">${t[1]}</span><div><b>${t[0]}</b><p>${t[2]}</p></div><span class="arrow">↗</span></button>`).join('');}
function home(){return head('SUA CENTRAL DE CONHECIMENTO','Boas-vindas ao ImobRAG','O conhecimento da sua imobiliária, sempre por perto.',btn('Nova consulta','consultas'))+`<section class="hero"><div><span class="eyebrow">MENOS BUSCA. MAIS CLAREZA.</span><h2>Uma boa resposta começa com a informação certa.</h2><p>Consulte seus documentos e encontre orientações com a fonte sempre à vista.</p>${btn('Consultar a base','consultas')}</div><div class="orbit" aria-hidden="true"><div class="doc-art"><b>✧</b><i></i><i></i><i style="width:60%"></i></div><span class="orbit-label">✓ Respostas com referência</span></div></section><div class="stats"><article class="stat"><div><small>Documentos na base</small><strong>${docs.length.toString().padStart(2,'0')}</strong><span class="hint">Documentos disponíveis na base</span></div><span class="stat-icon">▧</span></article><article class="stat"><div><small>Áreas de conhecimento</small><strong>04</strong><span class="hint">Do início à entrega das chaves</span></div><span class="stat-icon">▦</span></article><article class="stat"><div><small>Consultas nesta sessão</small><strong>${messages.filter(m=>m.role==='user').length.toString().padStart(2,'0')}</strong><span class="hint">Explore as perguntas sugeridas</span></div><span class="stat-icon">↗</span></article></div><div class="grid-two"><section class="panel"><div class="panel-head"><h2>Sua base de conhecimento</h2><a href="#base">Ver documentos ↗</a></div>${docRows()}</section><section class="panel"><div class="panel-head"><h2>O que você precisa resolver?</h2></div>${topicCards()}</section></div><div class="notice">✧ &nbsp; Busca textual demonstrativa, sem IA. A base inicial contém exemplos fictícios. Confira as fontes antes de usar uma orientação.</div>`;}
function chat(){return head('RESPOSTAS COM CONTEXTO','Converse com seu conhecimento','Pergunte, confira a orientação e consulte a origem.',`<button class="btn secondary" id="clear-chat">Nova conversa +</button>`)+`<div class="chat-layout"><section class="panel chat-panel"><div class="chat-top"><span class="avatar">✧</span><div>${escapeHTML(settings.name)}<small>Busca textual em ${docs.length} documentos · demonstração</small></div></div><div id="messages" class="chat-messages" role="log" aria-label="Mensagens da consulta" aria-live="polite"></div><form class="chat-form" id="chat-form"><div class="input-row"><input id="question" enterkeyhint="send" aria-label="Sua pergunta" autocomplete="off" maxlength="1000" placeholder="O que você gostaria de saber?" required><button class="btn" type="submit" aria-label="Enviar pergunta">Enviar ↗</button></div><small>Confira as fontes. A base inicial contém exemplos fictícios.</small></form></section><aside class="panel chat-aside"><span class="eyebrow">CONHECIMENTO DISPONÍVEL</span><h2>Por onde começar?</h2><p>Explore os assuntos da sua base.</p>${topicCards()}<div class="notice">Sem informação suficiente? A assistente indica a lacuna e orienta a consultar a equipe.</div></aside></div>`;}
function renderMessages(){const el=$('#messages');if(!el)return;el.innerHTML=messages.length?messages.map(m=>`<div class="msg ${m.role}">${m.role==='assistant'?`<div class="msg-label">${escapeHTML(settings.name)}</div>`:''}${escapeHTML(m.text)}${m.source&&settings.sources?`<button class="source-link" data-source="${escapeHTML(m.source.id)}">▧ ${escapeHTML(m.source.title)} · ${m.source.page?`p. ${m.source.page} (simulada)`:'texto importado'} ↗</button>`:''}</div>`).join(''):`<div class="welcome"><span class="spark">✧</span><span class="eyebrow">SEU CONHECIMENTO, EM CONVERSA</span><h2>Como posso ajudar hoje?</h2><p>Encontre orientações para a rotina da imobiliária, com referências que você pode conferir.</p><div class="suggestions">${topics.map(t=>`<button data-question="${escapeHTML(t[3])}">${t[1]} &nbsp; ${t[3]} <span class="arrow">↗</span></button>`).join('')}</div></div>`;if(chatBusy)el.innerHTML+='<div class="msg assistant" role="status">Buscando na base…</div>';el.scrollTop=el.scrollHeight;}
async function ask(question) {
  const text = question.trim();
  if (!text || loading || loadError) return;
  if (chatBusy) { toast('Aguarde a consulta em andamento.'); return; }
  chatBusy = true;
  messages.push({ role: 'user', text });
  if (location.hash !== '#consultas') location.hash = 'consultas';
  else { renderMessages(); updateChatBusy(); }
  try {
    const result = await api.chat(text);
    messages.push({ role: 'assistant', text: result.answer, source: result.source });
  } catch (error) {
    messages.push({ role: 'error', text: 'Consulta não concluída. ' + error.message });
  } finally { chatBusy = false; renderMessages(); updateChatBusy(); }
}
function updateChatBusy() {
  const input = $('#question');
  if (!input) return;
  input.disabled = chatBusy;
  $('#chat-form button').disabled = chatBusy;
  $('#chat-form button').textContent = chatBusy ? 'Buscando…' : 'Enviar ↗';
  $('#clear-chat').disabled = chatBusy;
}
function base(){return head('A ORIGEM DE CADA RESPOSTA','Base de conhecimento','Organize o que sua assistente pode consultar.',`<button class="btn" id="import-text" type="button">Importar texto +</button><input type="file" id="file-input" class="visually-hidden" aria-label="Importar arquivo de texto" accept=".txt,text/plain" tabindex="-1">`)+`<div class="toolbar"><input id="doc-search" class="search" aria-label="Buscar documento" placeholder="⌕  Buscar por nome ou conteúdo..."><select id="topic-filter" aria-label="Filtrar por assunto"><option value="">Todos os assuntos</option>${topics.map(t=>`<option>${t[0]}</option>`).join('')}<option>Importados</option></select></div><section class="panel"><div class="panel-head"><h2>Documentos <span class="badge gray">${docs.length}</span></h2><span class="muted" style="font-size:10px">Salvos na base local da imobiliária</span></div><div class="table-wrap"><table class="doc-table" role="table" aria-label="Documentos da base"><thead role="rowgroup"><tr><th>DOCUMENTO</th><th>ASSUNTO</th><th>ORIGEM</th><th>STATUS</th><th></th></tr></thead><tbody id="doc-body" role="rowgroup"></tbody></table></div><div id="doc-empty" class="empty" hidden>Nenhum documento encontrado. Tente outro termo.</div></section><div class="notice">Cadastro de arquivos .txt de até 200 KB na base local. PDFs, extração, embeddings e indexação ainda não estão implementados.</div>`;}
function renderDocs(){const q=normalize($('#doc-search').value),topic=$('#topic-filter').value;const filtered=docs.filter(d=>(!topic||d.topic===topic)&&normalize(d.title+' '+d.text).includes(q));$('#doc-body').innerHTML=filtered.map(d=>`<tr role="row"><td role="cell" class="doc-name"><button data-source="${escapeHTML(d.id)}">▧ &nbsp; ${escapeHTML(d.title)}</button></td><td role="cell" data-label="Assunto">${escapeHTML(d.topic)}</td><td role="cell" data-label="Origem">${d.demo?'Exemplo fictício':'Texto cadastrado'}</td><td role="cell" data-label="Status"><span class="badge">Disponível</span></td><td role="cell" class="doc-open"><button data-source="${escapeHTML(d.id)}" aria-label="Abrir ${escapeHTML(d.title)}">↗</button></td></tr>`).join('');$('#doc-empty').hidden=filtered.length>0;}
function config(){return head('DO SEU JEITO, COM CRITÉRIO','Minha assistente','Defina como apresentar as respostas da sua base.')+`<form id="settings-form" class="settings-layout"><div><section class="panel setting-section"><h2>Identidade e comunicação</h2><p>Uma presença clara e consistente em cada conversa.</p><label class="field">Nome da assistente<input name="name" maxlength="60" required value="${escapeHTML(settings.name)}"></label><label class="field">Tom de voz<select name="tone"><option>Acolhedor e objetivo</option><option>Formal e direto</option></select></label><label class="field">Orientação editorial<textarea name="instructions" maxlength="1000">${escapeHTML(settings.instructions)}</textarea></label><p class="notice">Tom e orientação ficam salvos para a futura integração com IA. A busca textual desta demonstração não interpreta essas instruções.</p></section><section class="panel setting-section"><h2>Fontes e limites</h2><label class="switch-row"><div>Exibir fonte da resposta<p>Permite abrir o trecho usado na consulta.</p></div><input type="checkbox" name="sources" ${settings.sources?'checked':''}></label><div class="switch-row"><div>Reconhecer ausência de evidência<p>Quando a base não cobre a pergunta, orientar a consultar a equipe.</p></div><span class="badge">Sempre ativo</span></div><div class="switch-row"><div>Usar apenas a base cadastrada<p>Nenhuma consulta externa ou acesso a dados de clientes.</p></div><span class="badge">Sempre ativo</span></div></section><button class="btn" type="submit">Salvar configurações ✓</button></div><aside class="panel" style="align-self:start"><span class="eyebrow">PRÉVIA DA IDENTIDADE</span><h2 id="preview-name">${escapeHTML(settings.name)}</h2><div class="preview-bubble">Olá! Como posso ajudar com as orientações da imobiliária hoje?</div><div class="config-tags"><span class="badge">Base documental</span><span class="badge gray">Ambiente local</span></div><p class="notice">Comece com uma consulta para conferir fontes e o tratamento das dúvidas sem resposta.</p></aside></form>`;}
const evalQuestions=[['Quais documentos preciso para alugar?','locacao'],['Como solicitar manutenção?','manutencao'],['Como registrar uma vistoria?','vistoria'],['Como iniciar a desocupação?','desocupacao'],['Qual é o valor da multa de saída?',null],['Quem paga pelo reparo do vazamento?',null],['Qual o prazo para devolver as chaves?',null],['Qual é a senha do sistema?',null]];
function evaluation(){return head('QUALIDADE ANTES DE ESCALAR','Avaliação da assistente','Valide os caminhos principais e as dúvidas sem cobertura.',`<button id="run-evaluation" class="btn">Executar verificação ↗</button>`)+`<div class="stats"><article class="stat"><div><small>Perguntas de verificação</small><strong>08</strong><span class="hint">Casos fixos de demonstração</span></div><span class="stat-icon">▤</span></article><article class="stat"><div><small>Com evidência esperada</small><strong>04</strong><span class="hint">Um caso por assunto</span></div><span class="stat-icon">▧</span></article><article class="stat"><div><small>Sem evidência esperada</small><strong>04</strong><span class="hint">Limites da base demonstrativa</span></div><span class="stat-icon">◴</span></article></div><section class="panel"><div class="panel-head"><h2>Roteiro de verificação</h2><span id="eval-summary" class="badge gray">Aguardando execução</span></div>${evalQuestions.map((q,i)=>`<div class="evaluation-row"><div>${escapeHTML(q[0])}<small>Esperado: ${q[1]?'recuperar documento de '+topics[i][0].toLowerCase():'informar ausência de evidência'}</small></div><span class="badge gray" id="eval-${i}">Não executado</span></div>`).join('')}</section><div class="notice">Verificação funcional da busca textual, sem medir qualidade de IA. Para o MVP, ampliar para 15–20 perguntas, revisão humana e documentos reais.</div>`;}
function render() {
  const route = location.hash.slice(1) || 'inicio';
  const current = routes.find(r => r[0] === route) || routes[0];
  $('#nav').innerHTML = routes.map(r => `<a href="#${r[0]}" class="${r[0]===current[0]?'active':''}" ${r[0]===current[0]?'aria-current="page"':''}><span class="nav-icon" aria-hidden="true">${r[1]}</span><span class="nav-text">${r[2]}</span></a>`).join('');
  $('#breadcrumb').innerHTML = `Espaço de trabalho <span>/</span> ${current[2]}`;
  if (loading) { $('#main').innerHTML = '<section class="panel" role="status"><h1>Carregando sua base…</h1><p class="muted">Buscando documentos e configurações.</p></section>'; return; }
  if (loadError) {
    $('#main').innerHTML = `<section class="panel" role="alert"><h1>Não foi possível abrir a base</h1><p class="notice">${escapeHTML(loadError)}</p><button id="retry-api" class="btn" style="margin-top:20px">Tentar novamente</button></section>`;
    $('#retry-api').onclick = loadData;
    return;
  }
  $('#main').innerHTML = ({ inicio: home, consultas: chat, base, assistente: config, avaliacao: evaluation }[current[0]])();
  if (current[0] === 'consultas') {
    renderMessages(); updateChatBusy();
    $('#chat-form').onsubmit = e => { e.preventDefault(); const text=$('#question').value; $('#question').value=''; void ask(text); };
    $('#clear-chat').onclick = () => { if(!chatBusy){ messages=[]; renderMessages(); } };
  }
  if (current[0] === 'base') {
    renderDocs(); $('#doc-search').oninput=renderDocs; $('#topic-filter').onchange=renderDocs;
    $('#file-input').onchange=importText; $('#import-text').onclick=()=>$('#file-input').click();
  }
  if (current[0] === 'assistente') {
    $('[name=tone]').value=settings.tone;
    $('[name=name]').oninput=e=>$('#preview-name').textContent=e.target.value;
    $('#settings-form').onsubmit = async e => {
      e.preventDefault(); const form=e.target; const f=new FormData(form); const button=form.querySelector('[type=submit]');
      button.disabled=true; button.textContent='Salvando…';
      try {
        settings=await api.saveSettings({name:f.get('name').trim(),tone:f.get('tone'),instructions:f.get('instructions'),sources:f.has('sources')});
        toast('Configurações salvas na base local.');
      } catch(error) { toast(error.message); }
      finally { button.disabled=false; button.textContent='Salvar configurações ✓'; }
    };
  }
  if (current[0] === 'avaliacao') {
    renderEvaluation();
    $('#run-evaluation').onclick = async () => {
      if(evaluationBusy)return;
      evaluationBusy=true; evaluationError=''; evaluationResult=null; renderEvaluation();
      try { evaluationResult=await api.evaluate(); }
      catch(error) { evaluationError=error.message; }
      finally { evaluationBusy=false; renderEvaluation(); }
    };
  }
}
function renderEvaluation() {
  const button=$('#run-evaluation'); if(!button)return;
  button.disabled=evaluationBusy; button.textContent=evaluationBusy?'Verificando…':'Executar verificação ↗';
  $('#eval-summary').textContent=evaluationError?'Falha na execução':evaluationResult?`${evaluationResult.passed} de ${evaluationResult.total} casos passaram`:'Aguardando execução';
  if(evaluationError)toast(evaluationError);
  if(!evaluationResult)evalQuestions.forEach((_,i)=>{const badge=$(`#eval-${i}`);if(badge){badge.textContent=evaluationBusy?'Aguardando…':'Não executado';badge.className='badge gray';}});
  evaluationResult?.results.forEach((result,i)=>{const badge=$(`#eval-${i}`);if(badge){badge.textContent=result.passed?'✓ Passou':'Revisar';badge.className='badge '+(result.passed?'':'amber');}});
}
async function loadData() {
  loading=true; loadError=''; render();
  try { const result=await Promise.all([api.documents(),api.settings()]);docs=result[0];settings=result[1]; }
  catch(error) { loadError=error.message; }
  finally { loading=false; render(); }
}
async function importText(e) {
  const file=e.target.files[0]; if(!file)return;
  if(!/\.txt$/i.test(file.name)||file.size>200*1024){toast('Escolha um arquivo .txt de até 200 KB.');e.target.value='';return;}
  const button=$('#import-text'); button.disabled=true; button.textContent='Cadastrando…';
  try {
    const text=(await file.text()).trim();if(!text){toast('O arquivo está vazio.');return;}
    const document=await api.createDocument({title:file.name.replace(/\.txt$/i,''),text,topic:'Importados'});
    docs.push(document);if(location.hash==='#base')render();toast('Texto cadastrado e disponível para consulta.');
  } catch(error) { toast(error.message); }
  finally { if(button.isConnected){button.disabled=false;button.textContent='Importar texto +';}e.target.value=''; }
}
function showSource(id){const d=docs.find(d=>d.id===id);if(!d)return;$('#source-title').textContent=d.title;$('#source-meta').textContent=d.topic+' · '+(d.demo?'Exemplo fictício · página '+d.page+' simulada':'Texto cadastrado · sem paginação');$('#source-content').textContent=d.text;$('#source-dialog .notice').textContent=d.demo?'Conteúdo fictício para validar a experiência. Não representa política de uma imobiliária.':'Texto cadastrado na base local. Confira a versão e o contexto antes de usar a orientação.';$('#source-dialog').showModal();}
document.addEventListener('click',e=>{const q=e.target.closest('[data-question]');if(q)ask(q.dataset.question);const s=e.target.closest('[data-source]');if(s)showSource(s.dataset.source);});$('#close-dialog').onclick=()=>$('#source-dialog').close();$('#demo-tour').onclick=()=>ask(topics[0][3]);function closeMenu(){ $('.sidebar').classList.remove('menu-open');$('#mobile-menu').setAttribute('aria-expanded','false'); }
$('.skip-link').onclick=e=>{e.preventDefault();$('#main').focus();$('#main').scrollIntoView({block:'start'});};
$('#mobile-menu').onclick=()=>{const open=$('#mobile-menu').getAttribute('aria-expanded')!=='true';$('.sidebar').classList.toggle('menu-open',open);$('#mobile-menu').setAttribute('aria-expanded',String(open));};
$('#nav').addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('.sidebar').classList.contains('menu-open')){closeMenu();$('#mobile-menu').focus();}});
window.addEventListener('hashchange',()=>{closeMenu();render();window.scrollTo({top:0,behavior:'instant'});$('#main').focus({preventScroll:true});});void loadData();
