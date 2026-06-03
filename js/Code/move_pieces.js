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

function startDrag(e, r, c, piece, ID) {
    if (!Is_Jester(piece[1]) && valueLancesTurn == 0.5) return

    // impede seleção estranha do navegador
    e.preventDefault()

    SELECTOR_ID = ID
    SELECTOR_COLOR = ID[0]

    // cria clone visual da peça
    const ghost = document.createElement('img')

    ghost.src = PIECES[piece]
    ghost.className = 'piece'

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
            illegalMovesTratament(drag.piece[1], [sq.r, sq.c], drag.piece[0])
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
        if (drag.fromR != sq.r || drag.fromC != sq.c) Do_Move_Execute(sq, drag)

        renderBoard()
    }

    drag = null
})

function showMoveIndicators(id, color) {
    clearMoveHints()

    const formatMove = ([r, c]) => `[${8 - r}, ${c + 1}]`

    if (!memory_moves[id]) {
        console.log(memory_moves)

        checkCastling(id, color)

        let legals, illegals, jesterIllegals

        if (Is_JesterFirstMove(id[1])) {
            ;({ legals, jesterIllegals } = LegalProvocative_Jester(id, color))
            // console.log('Legais: ', legals)
            // console.log('Ilegais por provocação: ', jesterIllegals)
            illegals = []

            // console.log(
            //     `[ ${(jesterIllegals || []).map(formatMove).join(', ')} ]`,
            // )
        } else {
            illegals = set_PiecePin(id, color)
            legals = subtractIntersection(illegals, attackers[id])
        }

        legals = !legals ? [] : legals
        illegals = !illegals ? [] : illegals
        jesterIllegals = !jesterIllegals ? [] : jesterIllegals
        // console.log(legals)
        let total_moves = [...legals, ...illegals, ...jesterIllegals]

        // por enquanto, não vamos calcular ilegalidades

        memory_moves[id] = {
            legal: legals,
            illegal: illegals,
            j_illegal: jesterIllegals,
            total: total_moves,
        }
    }

    console.log(
        `[ ${(memory_moves[id].total || []).map(formatMove).join(', ')} ]`,
    )

    showMoveHints(memory_moves[id], color)
}

document.addEventListener('mouseup', (e) => {
    if (!global_drag || e.button !== 0) return

    const sq = getSquareFromEvent(e)

    if (!sq) return

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

        board[global_drag.fromR][global_drag.fromC] = {
            id: ``,
            type: '',
            color: '',
            visualKey: null,
        }

        if (board[sq.r][sq.c].id != '') {
            delete_piece_to_team(
                board[sq.r][sq.c].id,
                board[sq.r][sq.c].color,
                sq.r,
                sq.c,
            )
        }

        // coloca peça na nova casa
        board[sq.r][sq.c] = {
            id: global_drag.id,
            type: global_drag.piece[1],
            color: global_drag.piece[0],
            visualKey: global_drag.piece,
        }

        // lances fora da mesma casa são válidos como um lance jogável
        if (global_drag.fromR != sq.r || global_drag.fromC != sq.c) Do_Move_Execute(sq, global_drag)

        renderBoard()
    }
})
