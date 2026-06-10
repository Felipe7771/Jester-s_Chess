/* =========================
   RENDERIZAÇÃO DO TABULEIRO
   ========================= */
function renderBoard() {
    if (CHECKMATE) {
        setTimeout(() => {
            if (!END_GAME) {
                showCheckmate(get_Enemy(TURN))
                END_GAME = true
            }
        }, 500)

        return
    }

    boardEl.innerHTML = ''
    squares = []

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement('div')
            const isLight = (r + c) % 2 === 0
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

            const coordColor = isLight ? '#b58863' : '#f0d9b5'

            if (r === 7) {
                const file = document.createElement('div')
                file.className = 'coord-inside file'

                file.textContent = String.fromCharCode(97 + c) // a-h

                file.style.color = coordColor
                sq.appendChild(file)
            }

            if (c === 0) {
                const rank = document.createElement('div')
                rank.className = 'coord-inside rank'

                rank.textContent = 8 - r

                rank.style.color = coordColor
                sq.appendChild(rank)
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
                    if (e.button !== 0 || board[r][c].color != TURN || !RUN_GAME || TURN != PLAY_TURN?.player) return
                    startDrag(
                        e,
                        r,
                        c,
                        board[r][c].visualKey,
                        board[r][c].id,
                        img,
                    )
                })

                sq.appendChild(img)
            }

            squares.push(sq)
            boardEl.appendChild(sq)
        }
    }
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
