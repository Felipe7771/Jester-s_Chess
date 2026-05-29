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

    renderBoard()
    moveGhost(e)
}

function toChessNotation(r, c) {
    const files = 'abcdefgh'

    const file = files[c]
    const rank = 8 - r

    return file + rank
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
    if (
        !sq ||
        (Is_anyThere(board[sq.r][sq.c]) &&
            Is_AllyThere(board[sq.r][sq.c], drag.piece[0])) ||
        Is_JesterAttackingInSecondMove(board[sq.r][sq.c], drag) ||
        !Is_InMoves(drag.id, [sq.r, sq.c])
    ) {
        board[drag.fromR][drag.fromC] = {
            id: drag.id,
            type: drag.piece[1],
            color: drag.piece[0],
            visualKey: drag.piece,
        }
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
        if (drag.fromR != sq.r || drag.fromC != sq.c) {
            Castling_Move(global_drag.id, sq.r, sq.c, global_drag.piece[0])

            global_drag = null

            if (!Is_JesterSecondMove(drag.piece[1])) yellowSquares.clear()

            valueLancesTurn += drag.piece[1] == 'J' ? 0.5 : 1 // por enquanto, toda peça tem o mesmo valor de lance (Jester: 1/2)

            SELECTOR_ID = drag.piece[1] == 'J' ? SELECTOR_ID : ''
            SELECTOR_COLOR = drag.piece[1] == 'J' ? SELECTOR_COLOR : ''

            console.log('==========================')
            console.log(
                `Peça movida (${drag.id}) | valorLance-> ${valueLancesTurn}`,
            )

            const key1 = sqKey(sq.r, sq.c)
            const key2 = sqKey(drag.fromR, drag.fromC)

            yellowSquares.add(key1)
            yellowSquares.add(key2)

            memory_moves = {}

            clearMoveHints()

            checkPromotedSucessor(TURN)
            checkPromotedPawn(board[sq.r][sq.c].id, TURN, sq.r, sq.c)
            checkBreakCastlePermission(board[sq.r][sq.c].id, TURN)

            set_piece_moved(
                drag.id,
                drag.piece[1],
                drag.piece[0],
                sq.r,
                sq.c,
                drag.fromR,
                drag.fromC,
            )
            set_piece_moved_team(sq.r, sq.c, drag.id, drag.piece[0])

            set_combat_turn()

            isEndedTurn() // tente encerrar o turno

            console.log('FIM DE TURNO')
            set_Check(TURN)

            playMoveSound = false
            castleSound = false
            renderBoard()
        }
        const pos = toChessNotation(sq.r, sq.c)
        console.log(pos)
    }
    
    drag = null
    
    renderBoard()
})

function showMoveIndicators(id, color) {
    clearMoveHints()

    const formatMove = ([r, c]) => `[${8 - r}, ${c + 1}]`
    
    if (!memory_moves[id]) {
        console.log(memory_moves)

        console.log('Calculando para memória')

        total_moves = attackers[id]

        checkCastling(id, color)

        // por enquanto, não vamos calcular ilegalidades
        
        memory_moves[id] = {
            legal: total_moves,
            illegal: [],
            total: total_moves,
        }
    }

    console.log(
        `[ ${(memory_moves[id].total || []).map(formatMove).join(', ')} ]`,
    )
    
    showMoveHints(memory_moves[id], color)
}

function clearMoveHints() {
    moveCircles.clear()
    moveRings.clear()
}

document.addEventListener('mouseup', (e) => {
    if (!global_drag || e.button !== 0) return

    const sq = getSquareFromEvent(e)

    if (!sq) return
    
    if (
        moveCircles.has(sqKey(sq.r, sq.c)) ||
        moveRings.has(sqKey(sq.r, sq.c))
    ) {
        console.log('movimento válido')
        
        // se soltou fora do tabuleiro → volta
        if (
            !sq ||
            (Is_anyThere(board[sq.r][sq.c]) &&
            Is_AllyThere(board[sq.r][sq.c], global_drag.piece[0])) ||
            Is_JesterAttackingInSecondMove(board[sq.r][sq.c], global_drag) ||
            !Is_InMoves(global_drag.id, [sq.r, sq.c])
        ) {
            return
        } else {
            // console.log((global_drag.fromR, global_drag.fromC) == (sq.r, sq.c))
            
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
            if (global_drag.fromR != sq.r || global_drag.fromC != sq.c) {
                Castling_Move(global_drag.id, sq.r, sq.c, global_drag.piece[0])

                global_global_drag = null
                
                if (!Is_JesterSecondMove(global_drag.piece[1]))
                    yellowSquares.clear()
                
                valueLancesTurn += global_drag.piece[1] == 'J' ? 0.5 : 1 // por enquanto, toda peça tem o mesmo valor de lance (Jester: 1/2)
                
                SELECTOR_ID = global_drag.piece[1] == 'J' ? SELECTOR_ID : ''
                SELECTOR_COLOR =
                    global_drag.piece[1] == 'J' ? SELECTOR_COLOR : ''
                    
                console.log('==========================')
                console.log(
                    `Peça movida (${global_drag.id}) | valorLance-> ${valueLancesTurn}`,
                )
                
                const key1 = sqKey(sq.r, sq.c)
                const key2 = sqKey(global_drag.fromR, global_drag.fromC)
                
                yellowSquares.add(key1)
                yellowSquares.add(key2)
                
                memory_moves = {}
                
                clearMoveHints()
                
                checkPromotedSucessor(TURN)
                checkPromotedPawn(board[sq.r][sq.c].id, TURN, sq.r, sq.c)
                checkBreakCastlePermission(board[sq.r][sq.c].id, TURN)
                
                set_piece_moved(
                    global_drag.id,
                    global_drag.piece[1],
                    global_drag.piece[0],
                    sq.r,
                    sq.c,
                    global_drag.fromR,
                    global_drag.fromC,
                )
                set_piece_moved_team(
                    sq.r,
                    sq.c,
                    global_drag.id,
                    global_drag.piece[0],
                )

                set_combat_turn()
                
                isEndedTurn() // tente encerrar o turno
                
                console.log('FIM DE TURNO')
                set_Check(TURN)
                
                playMoveSound = false
                castleSound = false

                renderBoard()
            }
            const pos = toChessNotation(sq.r, sq.c)
            console.log(pos)
        }

        renderBoard()
    } else {
        // clearMoveHints()
    }
})
