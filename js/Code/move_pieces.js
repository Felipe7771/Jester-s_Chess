/* =========================
   DETECTA CASA A PARTIR DO CLIQUE
   ========================= */
function getSquareFromEvent(e) {
    const rect = boardEl.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const c = Math.floor(x / SQ)
    const r = Math.floor(y / SQ)

    if (r < 0 || r > 7 || c < 0 || c > 7) return null

    return { r, c }
}

function startDrag(e, r, c, piece, ID, img) {
    if (!Is_Jester(piece[1]) && valueLancesTurn == 0.5) return

    showMoveIndicators(board[r][c].id, board[r][c].color)

    console.log(">>>>>>>> ",ID,"<<<<<<<<")

    // impede seleção estranha do navegador
    e.preventDefault()

    // cria clone visual da peça
    const ghost = document.createElement('img')

    ghost.src = PIECES[piece]
    ghost.className = img.className

    // estilo do fantasma
    ghost.style.position = 'fixed'
    ghost.style.pointerEvents = 'none'
    ghost.style.zIndex = 9999
    ghost.style.width = '72px'
    ghost.style.height = '72px'

    document.body.appendChild(ghost)

    // guarda estado do drag
    drag = {
        piece,
        fromR: r,
        fromC: c,
        id: ID,
        ghost,
    }

    global_drag = { ...drag }

    // remove peça temporariamente do board
    board[r][c] = {
        id: ``,
        type: '',
        color: '',
        visualKey: null,
    }

    moveGhost(e)
}

function moveGhost(e) {
    if (!drag) return

    drag.ghost.style.left = e.clientX - 36 + 'px'
    drag.ghost.style.top = e.clientY - 36 + 'px'
}

document.addEventListener('mousemove', (e) => {
    moveGhost(e)
})

document.addEventListener('mouseup', (e) => {
    if (!drag) return

    let CAPTURE = {
        captured: false,
        type: '',
        material: 0
    }

    const sq = getSquareFromEvent(e)

    // remove fantasma visual
    drag.ghost.remove()

    // se soltou fora do tabuleiro → volta
    if (!sq || !Is_InLegalMoves(drag.id, [sq.r, sq.c])) {
        board[drag.fromR][drag.fromC] = {
            id: drag.id,
            type: drag.piece[1],
            color: drag.piece[0],
            visualKey: drag.piece,
        }

        renderBoard()

        if (sq && Is_InIllegalMoves(drag.id, [sq.r, sq.c]))
            illegalMovesTratament(drag.id,drag.piece[1], [sq.r, sq.c], drag.piece[0])
    } else {
        // console.log((drag.fromR, drag.fromC) == (sq.r, sq.c))

        if (
            board[sq.r][sq.c].visualKey != null &&
            board[sq.r][sq.c].visualKey[0] != drag.piece[0]
        ) {
            take.play()
        } else if (
            board[sq.r][sq.c].visualKey == null &&
            (drag.fromR != sq.r || drag.fromC != sq.c)
        ) {
            playMoveSound = true
        }
        if (board[sq.r][sq.c].id != '') {
            CAPTURE.captured = true
            CAPTURE.type = board[sq.r][sq.c].type
            CAPTURE.material = MaterialValue[CAPTURE.type]
            delete_piece_to_team(
                board[sq.r][sq.c].id,
                board[sq.r][sq.c].color,
                sq.r,
                sq.c,
            )
        }
        // coloca peça na nova casa
        board[sq.r][sq.c] = {
            id: drag.id,
            type: drag.piece[1],
            color: drag.piece[0],
            visualKey: drag.piece,
        }

        // lances fora da mesma casa são válidos como um lance jogável
        if (drag.fromR != sq.r || drag.fromC != sq.c)
            Do_Move_Execute(sq, drag, CAPTURE)

        renderBoard()
    }

    drag = null
})

function showMoveIndicators(id, color) {
    clearMoveHints()

    showMoveHints(memory_moves[id], color)
}

document.addEventListener('mouseup', (e) => {
    if (!global_drag || e.button !== 0) return

    const sq = getSquareFromEvent(e)

    if (!sq) return

    let CAPTURE = {
        captured: false,
        type: '',
        material: 0
    }

    if (
        moveCircles.has(sqKey(sq.r, sq.c)) ||
        moveRings.has(sqKey(sq.r, sq.c))
    ) {
        if (
            board[sq.r][sq.c].visualKey != null &&
            board[sq.r][sq.c].visualKey[0] != global_drag.piece[0]
        ) {
            take.play()
        } else if (
            board[sq.r][sq.c].visualKey == null &&
            (global_drag.fromR != sq.r || global_drag.fromC != sq.c)
        ) {
            playMoveSound = true
        }

        animateSlide(global_drag.fromR, global_drag.fromC, sq.r, sq.c, default_velocity, default_animation, () => {
        // Aqui dentro é o seu código real de movimento/captura:
        // - remover a peça capturada do pieceIndex (se houver)
        // - mover a peça no estado
        // - atualizar o DOM (o "teleporte")
        execute_MovePoiter(global_drag, sq, CAPTURE);
        });

    }
})
