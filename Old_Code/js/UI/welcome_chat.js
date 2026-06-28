
/**
 * Injeta o modal no <body> e retorna uma Promise que resolve com:
 *   { playerName, opponentName, mode }
 *
 * mode: 'local' → Jogo local 1×1  (opponentName preenchido)
 *        'ai'   → Jogar contra ChuckMatt (opponentName = 'ChuckMatt')
 */
function showWelcomeModal() {
  return new Promise((resolve) => {

    const overlay = document.createElement('div');
    overlay.id = 'welcome-overlay';
    document.body.appendChild(overlay);

    function renderStep1() {
      overlay.innerHTML = `
        <div id="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="wm-title">

          <div class="wm-crown" aria-hidden="true"><img src='img/icy_sea/b/bj.png' width=70 height=70></div>
          <h1 id="wm-title">JESTER'S CHESS</h1>
          <p class="wm-subtitle">Bem-vindo ao tabuleiro</p>

          <div class="wm-divider"></div>

          <label for="wm-name">Seu nome</label>
          <input
            id="wm-name"
            type="text"
            placeholder="Como devo te chamar?"
            maxlength="32"
            autocomplete="off"
            autofocus
          />
          <p class="wm-error" id="wm-error" role="alert" aria-live="polite"></p>

          <div class="wm-buttons">

          <button class="wm-btn btn-ai" id="btn-ai">
            <div class="btn-icon" aria-hidden="true"><img src='img/w/wj.png' width=30 height=30></div>
            <div class="btn-label">
              <span>Jogar contra ChuckMatt</span>
              <span>Enfrente a inteligência artificial</span>
            </div>
          </button>

            <button class="wm-btn btn-online" id="btn-online" disabled>
              <div class="btn-icon" aria-hidden="true">♟♟</div>
              <div class="btn-label">
                <span>Jogo Online</span>
                <span>Disputa com alguém de fora</span>
              </div>
            </button>

            <button class="wm-btn btn-vs" id="btn-local">
              <div class="btn-icon" aria-hidden="true">♟</div>
              <div class="btn-label">
                <span>Jogo Local 1vs1</span>
                <span>Dois jogadores na mesma tela</span>
              </div>
            </button>


          </div>
          <a href='https://github.com/Felipe7771/Jester-s_Chess' target="_blank" rel="noopener noreferrer">Como jogar ?</a>
        </div>
      `;

      const nameInput = overlay.querySelector('#wm-name');
      const errorEl   = overlay.querySelector('#wm-error');

      function validateName() {
        const name = nameInput.value.trim();
        if (!name) {
          errorEl.textContent = 'Por favor, insira seu nome para continuar.';
          nameInput.focus();
          return null;
        }
        errorEl.textContent = '';
        return name;
      }

      overlay.querySelector('#btn-local').addEventListener('click', () => {
        const name = validateName();
        if (name) renderStep2(name);
      });

      overlay.querySelector('#btn-ai').addEventListener('click', () => {
        const name = validateName();
        if (name) closeAndResolve(name, 'ChuckMatt', 'ai');
      });

      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const name = validateName();
          if (name) closeAndResolve(name, 'ChuckMatt', 'ai');
        }
      });
    }

    /* ────────────────────────────────────────────
       PASSO 2 — nome do oponente (modo local)
    ──────────────────────────────────────────────*/
    function renderStep2(player1Name) {
      const modal = overlay.querySelector('#welcome-modal');

      /* transição: desliza para cima e troca conteúdo */
      modal.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
      modal.style.opacity    = '0';
      modal.style.transform  = 'translateY(-10px)';

      setTimeout(() => {
        modal.innerHTML = `
          <div class="wm-crown" aria-hidden="true"><img src='img/icy_sea/w/wk.png' width=70 height=70><img src='img/icy_sea/b/bk.png' width=70 height=70></div>
          <h1 id="wm-title">JESTER'S CHESS</h1>
          <p class="wm-subtitle">Jogo local — 1 VS 1</p>

          <div class="wm-divider"></div>

          <div class="wm-versus-row">
            <div class="wm-player-badge">
              <span class="wm-badge-icon"><img src='img/icy_sea/w/wp.png' width=20 height=20></span>
              <span class="wm-badge-name">${_escapeHtml(player1Name)}</span>
              <span class="wm-badge-side">Brancas</span>
            </div>
            <span class="wm-vs-label">VS</span>
            <div class="wm-player-badge">
              <span class="wm-badge-icon"><img src='img/icy_sea/b/bp.png' width=20 height=20></span>
              <span class="wm-badge-name" id="wm-preview-p2">?</span>
              <span class="wm-badge-side">Pretas</span>
            </div>
          </div>

          <label for="wm-opponent">Nome do oponente</label>
          <input
            id="wm-opponent"
            type="text"
            placeholder="Quem vai jogar de Pretas?"
            maxlength="32"
            autocomplete="off"
            autofocus
          />
          <p class="wm-error" id="wm-error2" role="alert" aria-live="polite"></p>

          <div class="wm-buttons">
            <button class="wm-btn btn-vs" id="btn-start-local">
              <div class="btn-icon" aria-hidden="true">♟</div>
              <div class="btn-label">
                <span>Iniciar Partida</span>
                <span>Que vença o melhor!</span>
              </div>
            </button>
            <button class="wm-btn wm-btn-back" id="btn-back">
              <div class="btn-icon" aria-hidden="true">‹</div>
              <div class="btn-label">
                <span>Voltar</span>
                <span>Alterar modo de jogo</span>
              </div>
            </button>
          </div>
        `;

        /* animação de entrada */
        requestAnimationFrame(() => {
          modal.style.opacity   = '1';
          modal.style.transform = 'translateY(0)';
        });

        const opponentInput = modal.querySelector('#wm-opponent');
        const errorEl2      = modal.querySelector('#wm-error2');
        const previewP2     = modal.querySelector('#wm-preview-p2');

        /* preview ao vivo do nome */
        opponentInput.addEventListener('input', () => {
          previewP2.textContent = opponentInput.value.trim() || '?';
        });

        function attemptStartLocal() {
          const opponentName = opponentInput.value.trim();
          if (!opponentName) {
            errorEl2.textContent = 'Insira o nome do oponente para começar.';
            opponentInput.focus();
            return;
          }
          if (opponentName.toLowerCase() === player1Name.toLowerCase()) {
            errorEl2.textContent = 'Os dois jogadores precisam ter nomes diferentes.';
            opponentInput.focus();
            return;
          }
          errorEl2.textContent = '';
          closeAndResolve(player1Name, opponentName, 'local');
        }

        modal.querySelector('#btn-start-local').addEventListener('click', attemptStartLocal);
        opponentInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') attemptStartLocal();
        });

        modal.querySelector('#btn-back').addEventListener('click', renderStep1);

      }, 180);
    }

    // Fecha overlay e resolve a Promise
    function closeAndResolve(playerName, opponentName, mode) {
      overlay.classList.add('hidden');
      overlay.addEventListener('transitionend', () => {
        overlay.remove();
        resolve({ playerName, opponentName, mode });
      }, { once: true });
    }

    /* Renderiza o passo inicial */
    renderStep1();
  });
}

/* Estado do chat */
const _chat = {
  playerName:   'Jogador',
  playerAvatar: null,       /* URL da imagem ou null */
  botName:      'ChuckMatt',
  botAvatar:    'img/ChuckMattIcon_beta.png',
};


function initPanelTabs(playerName, playerAvatar = null) {
  _chat.playerName   = playerName  || 'Jogador';
  _chat.playerAvatar = playerAvatar;

  const panel = document.getElementById('move-panel');
  if (!panel) return;

  /* Recupera o move-list original */
  const moveList = document.getElementById('move-list');
  const moveNav  = panel.querySelector('.move-nav');

  /* ── Injeta abas ── */
  const tabsHTML = `
    <div class="panel-tabs" role="tablist">
      <div class="panel-tab active" role="tab" aria-selected="true"  data-tab="moves" tabindex="0">Lances</div>
      <div class="panel-tab"        role="tab" aria-selected="false" data-tab="chat"  tabindex="-1">Chat</div>
    </div>

    <div class="panel-tab-content active" id="tab-moves" role="tabpanel">
      <!-- move-list e move-nav serão movidos aqui -->
    </div>

    <div class="panel-tab-content" id="tab-chat" role="tabpanel">
      <div id="chat-messages"></div>
      <div class="chat-input-area">
        <input
          type="text"
          id="chat-input"
          placeholder="Mensagem…"
          maxlength="200"
          autocomplete="off"
        />
        <button class="chat-send-btn" id="chat-send" title="Enviar" aria-label="Enviar mensagem">➤</button>
      </div>
    </div>
  `;

  /* Limpa cabeçalho original e insere abas */
  const oldHeader = panel.querySelector('.move-panel-header');
  if (oldHeader) oldHeader.remove();

  panel.insertAdjacentHTML('afterbegin', tabsHTML);

  /* Move os elementos de lance para dentro da aba correta */
  const tabMoves = document.getElementById('tab-moves');
  if (moveList) tabMoves.appendChild(moveList);
  if (moveNav)  tabMoves.appendChild(moveNav);

  /* ── Lógica das abas ── */
  const tabs     = panel.querySelectorAll('.panel-tab');
  const contents = panel.querySelectorAll('.panel-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });

    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tab.click();
      }
    });
  });

  /* ── Envio de mensagem pelo usuário ── */
  const chatInput = document.getElementById('chat-input');
  const chatSend  = document.getElementById('chat-send');

  function sendPlayerMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';
    _appendChatMessage({
      name:   _chat.playerName,
      avatar: _chat.playerAvatar,
      text,
      type:   'self',
    });
  }

  chatSend.addEventListener('click', sendPlayerMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendPlayerMessage();
  });
}


function _formatTime(date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}


function _initials(name) {
  return (name || '?').charAt(0).toUpperCase();
}

function _renderAvatar(avatarUrl, name, isSelf) {
  if (avatarUrl) {
    return `<img class="chat-avatar" src="${avatarUrl}" alt="${name}" onerror="this.replaceWith(_makeFallbackAvatar('${name}'))">`;
  }
  const bg = isSelf ? 'rgba(232,213,163,0.2)' : 'rgba(150,100,255,0.18)';
  return `<div class="chat-avatar-fallback" style="background:${bg}">${_initials(name)}</div>`;
}

function _appendChatMessage({ name, avatar, text, type }) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const time    = _formatTime(new Date());
  const msgClass = type === 'self' ? 'msg-self' : type === 'bot' ? 'msg-bot' : '';
  const avatarHTML = _renderAvatar(avatar, name, type === 'self');

  const el = document.createElement('div');
  el.className = `chat-msg ${msgClass}`;
  el.innerHTML = `
    ${avatarHTML}
    <div class="chat-bubble-wrap">
      <div class="chat-meta">
        <span class="chat-name">${_escapeHtml(name)}</span>
        <span class="chat-time">${time}</span>
      </div>
      <div class="chat-bubble">${_escapeHtml(text)}</div>
    </div>
  `;

  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

/** Previne XSS simples */
function _escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}




function sendBotMessage(message) {
  _appendChatMessage({
    name:   _chat.botName,
    avatar: _chat.botAvatar,
    text:   message,
    type:   'bot',
  });

  /* Muda automaticamente para a aba de chat se não estiver nela */
  const chatTab = document.querySelector('.panel-tab[data-tab="chat"]');
  if (chatTab && !chatTab.classList.contains('active')) {
    chatTab.click();
  }
}


function sendPlayerMessage(message) {
  _appendChatMessage({
    name:   _chat.playerName,
    avatar: _chat.playerAvatar,
    text:   message,
    type:   'self',
  });
}