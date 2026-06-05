/* =========================
   RENDERIZAÇÃO DO TABULEIRO
   ========================= */
function renderBoard(initialize = false) {
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
                sq.classList.add('move-circle')
            }

            if (moveRings.has(sqKey(r, c))) {
                sq.classList.add('move-ring')
            }

            // se existir peça, renderiza símbolo
            if (board[r][c].visualKey) {
                const img = document.createElement('img')
                img.className = 'piece'
                img.src = PIECES[board[r][c].visualKey]

                img.draggable = false

                const effect = pieceEffects.get(board[r][c].id)

                if (effect?.shake) {
                    img.classList.add('shake-soft')
                }

                if (effect?.spin) {
                    img.classList.remove('spin') // limpa estado antigo

                    void img.offsetWidth // força reset

                    img.classList.add('spin')

                    effect.spin = false // spin é só uma animação, não estado permanente
                }

                img.addEventListener('mousedown', (e) => {
                    if (e.button !== 0 || board[r][c].color != TURN) return
                    startDrag(e, r, c, board[r][c].visualKey, board[r][c].id, img)
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

    console.log('ShowMove: ', moves)

    const legal_moves = moves.legal

    clearMoveHints()

    for (const move of legal_moves) {
        // console.log(move)

        const key = sqKey(move[0], move[1])

        const square = board[move[0]][move[1]]

        if (Is_anyThere(square) && !Is_AllyThere(square, color)) {
            moveRings.add(key)
        } else if (!Is_anyThere(square)) {
            moveCircles.add(key)
        }
    }

    renderBoard()
}
