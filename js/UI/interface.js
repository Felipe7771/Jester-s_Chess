/* =========================
   RENDERIZAÇÃO DO TABULEIRO
   ========================= */
function renderBoard() {
    boardEl.innerHTML = ''
    squares = []

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement('div')
            sq.className = 'sq ' + ((r + c) % 2 === 0 ? 'light' : 'dark')

            // guarda posição na célula DOM
            sq.dataset.r = r
            sq.dataset.c = c

            // aplica destaque vermelho se existir
            if (redSquares.has(sqKey(r, c))) {
                sq.classList.add('highlight-red')
            }

            if (yellowSquares.has(sqKey(r, c))) {
                sq.classList.add('highlight-yellow')
            }

            if (moveCircles.has(sqKey(r, c))) {
                sq.classList.add('move-circle');
            }

            if (moveRings.has(sqKey(r, c))) {
                sq.classList.add('move-ring');
            }

            // se existir peça, renderiza símbolo
            if (board[r][c].visualKey) {
                const img = document.createElement('img')
                img.className = 'piece'
                img.src = PIECES[board[r][c].visualKey]

                img.draggable = false

                img.addEventListener('mousedown', (e) => {
                    if (e.button !== 0 || board[r][c].color != TURN) return
                    showMoveIndicators(board[r][c].id, board[r][c].color)
                    startDrag(e, r, c, board[r][c].visualKey, board[r][c].id)
                })

                sq.appendChild(img)
            }

            squares.push(sq)
            boardEl.appendChild(sq)
        }
    }
}

/* =========================
   COORDENADAS VISUAIS
   ========================= */

const filesEl = document.getElementById('coords-file')
const ranksEl = document.getElementById('coords-rank')

/* letras a-h */
'abcdefgh'.split('').forEach((f) => {
    const d = document.createElement('div')
    d.className = 'coord-file'
    d.textContent = f
    filesEl.appendChild(d)
})

/* números 1-8 (invertidos visualmente) */
for (let r = 1; r <= 8; r++) {
    const d = document.createElement('div')
    d.className = 'coord-rank'
    d.textContent = 9 - r
    ranksEl.appendChild(d)
}

function showMoveHints(moves, color) {

    if (!moves.legal) return

    console.log("ShowMove: ", moves)

    const legal_moves = moves.legal

    clearMoveHints();

    for (const move of legal_moves) {
        // console.log(move)

        const key = sqKey(move[0], move[1]);

        const square = board[move[0]][move[1]]

        if (Is_anyThere(square) && !Is_AllyThere(square, color)) {
            moveRings.add(key);

        } else if (!Is_anyThere(square)) {
            moveCircles.add(key);
        }
    }

    renderBoard();
}

// document.addEventListener('mousedown', e => {
    

//   const sq = getSquareFromEvent(e);

//   if (!sq) return

//   if (
//     moveCircles.has(sqKey(sq.r,sq.c)) ||
//     moveRings.has(sqKey(sq.r,sq.c))
//   ) {

//     console.log('movimento válido');

//     const part = pieceIndex[SELECTOR_ID]

//     drag = {
//     piece: part.piece,
//     fromR: part.r,
//     fromC: part.c,
//     id: SELECTOR_ID,
//     }

//      Move(sq, drag)
//   }

// });