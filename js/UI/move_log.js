/* =============================
   MOVE LOG — painel lateral
   ============================= */

(function() {

  /* ── mapeamento peça → caminho da imagem ──
     Ajuste os caminhos para os seus assets reais.
     Chave: código interno da peça (o mesmo que você já usa)  */
  const PIECE_IMG = {
    /* brancas */
    wK: 'img/w/wk.png',
    wQ: 'img/w/wq.png',
    wR: 'img/w/wr.png',
    wB: 'img/w/wb.png',
    wN: 'img/w/wn.png',
    wP: 'img/w/wp.png',
    /* pretas */
    bK: 'img/b/bk.png',
    bQ: 'img/b/bq.png',
    bR: 'img/b/br.png',
    bB: 'img/b/bb.png',
    bN: 'img/b/bn.png',
    bP: 'img/b/bp.png',
  };

  /* estado do log */
  let moveHistory = [];   /* [{san, pieceKey, isWhite}, ...] */
  let activeIndex  = -1;

  /* ── API pública ── */

  /**
   * Registra um lance e atualiza o painel.
   *
   * @param {string} san       - Notação algébrica, ex: "e4", "Nf3", "O-O"
   * @param {string} pieceCode - Código da peça: 'wP','bN','wQ', etc.
   *                             (cor + tipo, ex: isWhite=true + tipo='P' → 'wP')
   * @param {boolean} isWhite  - true = lance das brancas
   */
  window.logMove = function(san, pieceCode, isWhite) {
    moveHistory.push({ san, pieceCode, isWhite });
    activeIndex = moveHistory.length - 1;
    renderMoveList();
    scrollMoveListToBottom();
  };

  /**
   * Registra uma peça capturada e atualiza o strip do jogador.
   *
   * @param {string} pieceCode  - Código da peça capturada, ex: 'wP'
   * @param {boolean} capturedByWhite - true = brancas capturaram
   * @param {number}  materialDiff    - diferença de material (+1, +3, etc.)
   */
  window.logCapture = function(pieceCode, capturedByWhite, materialDiff) {
    const containerId = capturedByWhite ? 'captured-white' : 'captured-black';
    const diffId      = capturedByWhite ? 'diff-white'     : 'diff-black';

    const container = document.getElementById(containerId);
    const diffEl    = document.getElementById(diffId);
    if (!container) return;

    const img = new Image();
    img.src = PIECE_IMG[pieceCode] || '';
    img.title = pieceCode;

    /* fallback: se não tiver imagem, usa símbolo unicode */
    img.onerror = function() {
      const span = document.createElement('span');
      span.className = 'cap-char';
      span.textContent = PIECE_FALLBACK[pieceCode] || '?';
      container.appendChild(span);
    };

    container.appendChild(img);

    if (diffEl && materialDiff) {
      diffEl.textContent = materialDiff > 0 ? '+' + materialDiff : '';
    }
  };

  /**
   * Define nome e avatar de um jogador.
   * @param {'white'|'black'} side
   * @param {string} name
   * @param {string} [avatarUrl]  - URL da foto (opcional)
   */
  window.setPlayerInfo = function(side, name, avatarUrl) {
    const nameEl   = document.getElementById('name-' + side);
    const avatarEl = document.getElementById('avatar-' + side);
    if (nameEl)   nameEl.textContent = name;
    if (avatarEl && avatarUrl) {
      avatarEl.innerHTML = `<img src="${avatarUrl}" alt="${name}">`;
    }
  };

  /** Limpa o log (nova partida) */
  window.clearMoveLog = function() {
    moveHistory = [];
    activeIndex = -1;
    renderMoveList();
    ['captured-white','captured-black'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });
    ['diff-white','diff-black'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  };

  /* ── renderização interna ── */

  function renderMoveList() {
    const list = document.getElementById('move-list');
    if (!list) return;
    list.innerHTML = '';

    /* agrupa em pares: brancas + pretas */
    const rows = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
      rows.push({ w: moveHistory[i], b: moveHistory[i + 1] || null, num: Math.floor(i / 2) + 1 });
    }

    rows.forEach((row, rowIdx) => {
      console.log('row: ',row)
      const rowEl = document.createElement('div');
      rowEl.className = 'move-row';

      /* número do lance */
      const numEl = document.createElement('div');
      numEl.className = 'move-num';
      numEl.textContent = row.num;
      rowEl.appendChild(numEl);

      /* célula brancas */
      rowEl.appendChild(makeMoveCell(row.w, rowIdx * 2));

      /* célula pretas */
      if (row.b) {
        rowEl.appendChild(makeMoveCell(row.b, rowIdx * 2 + 1));
      } else {
        rowEl.appendChild(document.createElement('div')); /* placeholder */
      }

      list.appendChild(rowEl);
    });
  }

  function makeMoveCell(move, globalIdx) {
    const cell = document.createElement('div');
    cell.className = 'move-cell' + (globalIdx === activeIndex ? ' active' : '');
    cell.dataset.idx = globalIdx;

    /* ícone da peça */
    const iconEl = document.createElement('div');
    iconEl.className = 'move-icon';

    const imgSrc = PIECE_IMG[move.pieceCode];
    console.log('move.pieceCode: ',move.pieceCode)
    console.log('imgSrc: ',imgSrc)
    if (imgSrc) {
      const img = new Image();
      img.src = imgSrc;
      img.width = 18;
      img.height = 18;
      iconEl.appendChild(img);
    } else {
      iconEl.textContent = PIECE_FALLBACK[move.pieceCode] || '?';
      iconEl.style.fontSize = '14px';
    }

    /* texto da notação */
    const textEl = document.createElement('span');
    textEl.className = 'move-text';
    textEl.textContent = move.san;

    cell.appendChild(iconEl);
    cell.appendChild(textEl);

    cell.addEventListener('click', () => {
      activeIndex = globalIdx;
      renderMoveList();
      /* aqui você pode chamar a função de replay do seu engine se quiser */
    });

    return cell;
  }

  function scrollMoveListToBottom() {
    const list = document.getElementById('move-list');
    if (list) list.scrollTop = list.scrollHeight;
  }

  /* símbolos unicode como fallback quando não há imagem */
  const PIECE_FALLBACK = {
    wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙',
    bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟',
  };

  /* botões de navegação (sem replay por enquanto — basta adicionar) */
  document.addEventListener('DOMContentLoaded', () => {
    const go = (delta) => {
      activeIndex = Math.max(-1, Math.min(moveHistory.length - 1, activeIndex + delta));
      renderMoveList();
    };
    document.getElementById('nav-start')?.addEventListener('click', () => { activeIndex = 0; renderMoveList(); });
    document.getElementById('nav-prev') ?.addEventListener('click', () => go(-1));
    document.getElementById('nav-next') ?.addEventListener('click', () => go(+1));
    document.getElementById('nav-end')  ?.addEventListener('click', () => { activeIndex = moveHistory.length - 1; renderMoveList(); });
  });

})();