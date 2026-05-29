/* =========================
   INTERAÇÕES DO MOUSE
   ========================= */

/* bloqueia menu padrão do botão direito */
boardEl.addEventListener('contextmenu', e => {
  e.preventDefault();
});

/* início de ação com botão direito */
boardEl.addEventListener('mousedown', e => {
  if (e.button === 2) {
    const sq = getSquareFromEvent(e);
    if (sq) rightDragFrom = sq;
  }
});

/* final de ação com botão direito */
boardEl.addEventListener('mouseup', e => {
  if (e.button === 2) {
    const sq = getSquareFromEvent(e);
    if (!sq || !rightDragFrom) {
      rightDragFrom = null;
      return;
    }

    const { r: fr, c: fc } = rightDragFrom;
    const { r: tr, c: tc } = sq;

    rightDragFrom = null;

    // clique na mesma casa -> toggle vermelho
    if (fr === tr && fc === tc && TURN != '') {
      const key = sqKey(fr, fc);
      if (redSquares.has(key)) redSquares.delete(key);
      else redSquares.add(key);

      renderBoard();
      drawArrows();

    } else {
      // cria ou remove seta
      const idx = arrows.findIndex(a =>
        a.fr===fr && a.fc===fc && a.tr===tr && a.tc===tc
      );

      if (idx !== -1) arrows.splice(idx, 1);
      else arrows.push({ fr, fc, tr, tc });

      drawArrows();
    }
  }
});

/* clique esquerdo limpa tudo (reset visual rápido) */
document.addEventListener('mousedown', e => {
  // if (!drag) clearMoveHints();

  if (e.button === 0 && TURN != '') {
    redSquares.clear();

    arrows = [];
    renderBoard();
    drawArrows();
  }

});