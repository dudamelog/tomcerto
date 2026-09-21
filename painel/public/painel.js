'use strict';

/**
 * Painel de execução do TomCerto.
 * Consome /api/manifest (GET) e /api/executar (POST) servidos por painel/server.mjs
 * na mesma origem (sem CORS necessário).
 */

const estado = {
  manifesto: null,
  emExecucao: new Set(), // ids de linguagem atualmente executando algo
};

function el(tag, atributos, filhos) {
  const node = document.createElement(tag);
  if (atributos) {
    for (const [chave, valor] of Object.entries(atributos)) {
      if (chave === 'texto') node.textContent = valor;
      else if (chave === 'html') node.innerHTML = valor;
      else node.setAttribute(chave, valor);
    }
  }
  if (filhos) {
    for (const filho of filhos) {
      if (filho) node.appendChild(filho);
    }
  }
  return node;
}

function formatarDuracao(ms) {
  if (ms == null) return '';
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

async function buscarManifesto() {
  const resposta = await fetch('/api/manifest');
  if (!resposta.ok) {
    throw new Error(`Servidor respondeu ${resposta.status}`);
  }
  return resposta.json();
}

async function executar(linguagem, etapa) {
  const resposta = await fetch('/api/executar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ linguagem, etapa }),
  });
  if (!resposta.ok) {
    throw new Error(`Servidor respondeu ${resposta.status}`);
  }
  return resposta.json();
}

/* ---------- Renderização ---------- */

function montarCartao(linguagem) {
  const cartao = el('article', {
    class: 'cartao',
    id: `cartao-${linguagem.id}`,
    'data-linguagem': linguagem.id,
  });

  const cabecalho = el('div', { class: 'cartao-cabecalho' }, [
    el('h2', { texto: linguagem.nome }),
    el('span', { class: 'badge', id: `badge-${linguagem.id}`, texto: 'sem execução' }),
  ]);

  const comandos = el('div', { class: 'comandos' }, [
    el('div', {}, [
      el('span', { class: 'rotulo', texto: 'demo' }),
      el('span', { class: 'valor', texto: linguagem.comandos.demo }),
    ]),
    el('div', {}, [
      el('span', { class: 'rotulo', texto: 'testes' }),
      el('span', { class: 'valor', texto: linguagem.comandos.testes }),
    ]),
  ]);

  const listaPilares = el(
    'ul',
    { class: 'lista-pilares' },
    linguagem.pilares.map((p) =>
      el('li', {}, [
        el('span', { class: 'nome-pilar', texto: p.pilar }),
        el('span', { class: 'local-pilar', texto: p.local }),
        el('div', { class: 'detalhe-pilar', texto: p.detalhe }),
      ])
    )
  );

  const detalhesPilares = el('details', { class: 'pilares' }, [
    el('summary', { texto: 'Os 4 pilares de POO neste código' }),
    listaPilares,
  ]);

  const botoes = el('div', { class: 'botoes-cartao' }, [
    el('button', {
      id: `btn-demo-${linguagem.id}`,
      texto: 'Rodar demonstração',
    }),
    el('button', {
      id: `btn-testes-${linguagem.id}`,
      texto: 'Rodar testes',
    }),
  ]);

  const saidaCabecalho = el('div', { class: 'saida-cabecalho' }, [
    el('span', { id: `saida-rotulo-${linguagem.id}`, texto: 'Saída' }),
    el('span', { id: `saida-duracao-${linguagem.id}` }),
  ]);

  const saida = el('div', {
    class: 'saida vazia',
    id: `saida-${linguagem.id}`,
  });

  cartao.appendChild(cabecalho);
  cartao.appendChild(comandos);
  cartao.appendChild(detalhesPilares);
  cartao.appendChild(botoes);
  cartao.appendChild(saidaCabecalho);
  cartao.appendChild(saida);

  return cartao;
}

function renderizarManifesto(manifesto) {
  document.title = `${manifesto.projeto} — painel de execução`;

  const tituloEl = document.getElementById('titulo-projeto');
  const subtituloEl = document.getElementById('subtitulo-projeto');
  tituloEl.textContent = manifesto.projeto;
  subtituloEl.textContent = manifesto.subtitulo;

  const grid = document.getElementById('grid-cartoes');
  grid.innerHTML = '';
  for (const linguagem of manifesto.linguagens) {
    grid.appendChild(montarCartao(linguagem));
  }

  // Liga os eventos depois que os cartões existem no DOM.
  for (const linguagem of manifesto.linguagens) {
    document
      .getElementById(`btn-demo-${linguagem.id}`)
      .addEventListener('click', () => aoClicarExecutar(linguagem.id, 'demo'));
    document
      .getElementById(`btn-testes-${linguagem.id}`)
      .addEventListener('click', () => aoClicarExecutar(linguagem.id, 'testes'));
  }
}

/* ---------- Estados de carregamento / resultado ---------- */

function marcarCarregando(linguagemId, etapa) {
  estado.emExecucao.add(linguagemId);

  const btnDemo = document.getElementById(`btn-demo-${linguagemId}`);
  const btnTestes = document.getElementById(`btn-testes-${linguagemId}`);
  if (btnDemo) btnDemo.disabled = true;
  if (btnTestes) btnTestes.disabled = true;

  const rotulo = document.getElementById(`saida-rotulo-${linguagemId}`);
  if (rotulo) {
    rotulo.innerHTML = '';
    rotulo.appendChild(el('span', { class: 'executando' }, [
      el('span', { class: 'spinner' }),
      el('span', { texto: `Executando ${etapa}…` }),
    ]));
  }
}

function limparCarregando(linguagemId) {
  estado.emExecucao.delete(linguagemId);
  const btnDemo = document.getElementById(`btn-demo-${linguagemId}`);
  const btnTestes = document.getElementById(`btn-testes-${linguagemId}`);
  if (btnDemo) btnDemo.disabled = false;
  if (btnTestes) btnTestes.disabled = false;
}

function aplicarResultado(resultado) {
  const { linguagem: linguagemId, etapa, sucesso, duracaoMs, stdout, stderr, comando } = resultado;

  limparCarregando(linguagemId);

  const cartao = document.getElementById(`cartao-${linguagemId}`);
  const badge = document.getElementById(`badge-${linguagemId}`);
  const rotulo = document.getElementById(`saida-rotulo-${linguagemId}`);
  const duracaoEl = document.getElementById(`saida-duracao-${linguagemId}`);
  const saidaEl = document.getElementById(`saida-${linguagemId}`);

  if (cartao) {
    cartao.classList.remove('estado-sucesso', 'estado-erro');
    cartao.classList.add(sucesso ? 'estado-sucesso' : 'estado-erro');
  }

  if (badge) {
    badge.textContent = sucesso ? `${etapa}: sucesso` : `${etapa}: falhou`;
    badge.classList.remove('sucesso', 'erro');
    badge.classList.add(sucesso ? 'sucesso' : 'erro');
  }

  if (rotulo) {
    rotulo.textContent = `Saída — ${comando || etapa}`;
  }

  if (duracaoEl) {
    duracaoEl.textContent = formatarDuracao(duracaoMs);
  }

  if (saidaEl) {
    saidaEl.classList.remove('vazia');
    saidaEl.innerHTML = '';
    const partes = [];
    if (stdout) partes.push(stdout.replace(/\s+$/, ''));
    if (stderr && stderr.trim()) {
      const linhaStderr = el('span', { class: 'linha-stderr', texto: stderr.replace(/\s+$/, '') });
      if (partes.length) saidaEl.appendChild(document.createTextNode(partes.join('\n') + '\n\n'));
      saidaEl.appendChild(linhaStderr);
    } else if (partes.length) {
      saidaEl.textContent = partes.join('\n');
    } else {
      saidaEl.textContent = '(sem saída)';
    }
  }
}

function aplicarFalhaRede(linguagemId, mensagem) {
  limparCarregando(linguagemId);
  const rotulo = document.getElementById(`saida-rotulo-${linguagemId}`);
  const saidaEl = document.getElementById(`saida-${linguagemId}`);
  const badge = document.getElementById(`badge-${linguagemId}`);
  if (rotulo) rotulo.textContent = 'Saída';
  if (badge) {
    badge.textContent = 'erro de conexão';
    badge.classList.remove('sucesso');
    badge.classList.add('erro');
  }
  if (saidaEl) {
    saidaEl.classList.remove('vazia');
    saidaEl.textContent = mensagem;
  }
}

/* ---------- Ações ---------- */

async function aoClicarExecutar(linguagemId, etapa) {
  marcarCarregando(linguagemId, etapa);
  try {
    const resposta = await executar(linguagemId, etapa);
    const resultado = (resposta.resultados || [])[0];
    if (resultado) {
      aplicarResultado(resultado);
    } else {
      aplicarFalhaRede(linguagemId, 'O servidor não retornou resultado para esta execução.');
    }
  } catch (erro) {
    aplicarFalhaRede(
      linguagemId,
      'Não foi possível conectar ao painel — confirme que `node painel/server.mjs` está rodando.'
    );
  }
}

async function aoClicarRodarTudo() {
  if (!estado.manifesto) return;
  const btnTudo = document.getElementById('btn-rodar-tudo');
  if (btnTudo) btnTudo.disabled = true;

  for (const linguagem of estado.manifesto.linguagens) {
    marcarCarregando(linguagem.id, 'tudo');
  }

  try {
    const resposta = await executar('todas', 'tudo');
    const resultados = resposta.resultados || [];
    for (const resultado of resultados) {
      aplicarResultado(resultado);
    }
    // Garante que nenhum cartão fique preso em "carregando" caso a API
    // não retorne uma entrada para alguma linguagem/etapa esperada.
    for (const linguagem of estado.manifesto.linguagens) {
      limparCarregando(linguagem.id);
    }
  } catch (erro) {
    for (const linguagem of estado.manifesto.linguagens) {
      aplicarFalhaRede(
        linguagem.id,
        'Não foi possível conectar ao painel — confirme que `node painel/server.mjs` está rodando.'
      );
    }
  } finally {
    if (btnTudo) btnTudo.disabled = false;
  }
}

/* ---------- Conexão / inicialização ---------- */

function marcarStatusConexao(ok) {
  const statusEl = document.getElementById('status-conexao');
  if (!statusEl) return;
  statusEl.classList.remove('ok', 'erro');
  statusEl.classList.add(ok ? 'ok' : 'erro');
  const textoEl = statusEl.querySelector('span:last-child');
  if (textoEl) textoEl.textContent = ok ? 'conectado ao servidor local' : 'sem conexão com o servidor';
}

function mostrarAvisoErro(mostrar) {
  const aviso = document.getElementById('aviso-erro');
  if (aviso) aviso.hidden = !mostrar;
}

async function inicializar() {
  const btnTudo = document.getElementById('btn-rodar-tudo');
  if (btnTudo) btnTudo.addEventListener('click', aoClicarRodarTudo);

  try {
    const manifesto = await buscarManifesto();
    estado.manifesto = manifesto;
    renderizarManifesto(manifesto);
    marcarStatusConexao(true);
    mostrarAvisoErro(false);
    if (btnTudo) btnTudo.disabled = false;
  } catch (erro) {
    marcarStatusConexao(false);
    mostrarAvisoErro(true);
    if (btnTudo) btnTudo.disabled = true;
  }
}

document.addEventListener('DOMContentLoaded', inicializar);
