/**
 * showCheckmate(winner)
 * winner: 'w' ou 'b' — o time que GANHOU
 */
function showCheckmate(winner) {

  checkmate.play();
  
  TURN = ''
  const loser = winner === 'w' ? 'b' : 'w';

  const winnerKing = winner + 'K';
  const loserKing  = loser  + 'K';

  let wKPos = null, lKPos = null;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c].visualKey === winnerKing) wKPos = { r, c };
      if (board[r][c].visualKey === loserKing)  lKPos = { r, c };
    }
  }

  function getSqEl(r, c) {
    return squares[r * 8 + c];
  }

  if (lKPos) {
    const el = getSqEl(lKPos.r, lKPos.c);
    el.classList.add('sq-checkmate');

    const badge = document.createElement('div');
    badge.className = 'king-badge badge-checkmate';
    badge.textContent = 'Checkmate';
    el.appendChild(badge);

    const icon = document.createElement('div');
    icon.className = 'king-icon-icon-checkmate';
    const img = document.createElement('img');
    img.src = './img/checkmate_king.png';
    img.width = 40
    img.height = 40
    
    icon.appendChild(img);
    el.appendChild(icon)
  }

  if (wKPos) {
    const el = getSqEl(wKPos.r, wKPos.c);
    el.classList.add('sq-winner');

    const badge = document.createElement('div');
    badge.className = 'king-badge badge-winner';
    badge.textContent = 'Winner';
    el.appendChild(badge);

    const icon = document.createElement('div');
    icon.className = 'king-icon-icon-winner';
    const img = document.createElement('img');
    img.src = './img/crown.png';
    img.width = 40
    img.height = 40

    icon.appendChild(img);
    el.appendChild(icon)
  }
}

/**
 * showCheckmate(winner)
 * winner: 'w' ou 'b' — o time que GANHOU
 */
function showTry() {

  checkmate.play();
  
  TURN = ''

  const King1 = 'wK';
  const King2  = 'bK';

  let wKPos = null, lKPos = null;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c].visualKey === King1) K1Pos = { r, c };
      if (board[r][c].visualKey === King2) K2Pos = { r, c };
    }
  }

  function getSqEl(r, c) {
    return squares[r * 8 + c];
  }

  if (K1Pos) {
    const el = getSqEl(K1Pos.r, K1Pos.c);
    el.classList.add('sq-try');

    const badge = document.createElement('div');
    badge.className = 'king-badge badge-try';
    badge.textContent = 'Draw';
    el.appendChild(badge);

    const icon = document.createElement('div');
    icon.className = 'king-icon-icon-try';
    const img = document.createElement('img');
    img.src = './img/try.png';
    img.width = 40
    img.height = 40
    
    icon.appendChild(img);
    el.appendChild(icon)
  }

  if (K2Pos) {
    const el = getSqEl(K2Pos.r, K2Pos.c);
    el.classList.add('sq-try');

    const badge = document.createElement('div');
    badge.className = 'king-badge badge-try';
    badge.textContent = 'Draw';
    el.appendChild(badge);

    const icon = document.createElement('div');
    icon.className = 'king-icon-icon-try';
    const img = document.createElement('img');
    img.src = './img/try.png';
    img.width = 40
    img.height = 40
    
    icon.appendChild(img);
    el.appendChild(icon)
  }
}