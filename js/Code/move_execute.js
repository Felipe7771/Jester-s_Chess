async function Do_Move_Execute(sq, local_drag, capturedPiece) {
    Castling_Move(local_drag.id, sq.r, sq.c, local_drag.piece[0])

    if (!Is_JesterSecondMove(local_drag.piece[1])) yellowSquares.clear()

    valueLancesTurn += local_drag.piece[1] == 'J' ? 0.5 : 1

    SELECTOR_ID = local_drag.piece[1] == 'J' ? SELECTOR_ID : ''
    SELECTOR_COLOR = local_drag.piece[1] == 'J' ? SELECTOR_COLOR : ''

    const key1 = sqKey(sq.r, sq.c)
    const key2 = sqKey(local_drag.fromR, local_drag.fromC)

    yellowSquares.add(key1)
    yellowSquares.add(key2)

    memory_moves = {}
    clearMoveHints()

    const PROMOTESUCESSOR = checkPromotedSucessor(TURN)
    checkBreakCastlePermission(board[sq.r][sq.c].id, TURN)

    set_piece_moved(
        local_drag.id,
        local_drag.piece[1],
        local_drag.piece[0],
        sq.r,
        sq.c,
        local_drag.fromR,
        local_drag.fromC,
    )
    set_piece_moved_team(sq.r, sq.c, local_drag.id, local_drag.piece[0])

    // ✅ Aguarda promoção ANTES de qualquer efeito visual ou mudança de turno
    await checkPromotedPawn(board[sq.r][sq.c].id, TURN, sq.r, sq.c)

    // Tudo abaixo só roda depois da promoção estar concluída
    set_combat_turn()

    VISUAL_check[TURN] = false

    if (valueLancesTurn == 1) {
        Check_escape_moves = {}
        CHECKpin[TURN] = false
    }
    permited_block_check = {}
    remove_KingAnimationCheck(get_Id_King(TURN))

    isEndedTurn()

    if (valueLancesTurn !== 0.5) set_Check(TURN)
    else move.play()

    if (PLAYING_WITH_CHUCKMATT && !memory_checkmate) {
        if (CHECKpin[TURN] && TURN !== PLAY_TURN.chuck) sendBotMessage(get_randomMessage(CHECK_CHUCK_CHAT_BOT))
    }

    let Nota_piece = local_drag.piece[1] == 'P' ? '' : local_drag.piece[1]
    let sanNotation = Nota_piece + toChessNotation(sq.r, sq.c)
    view_Notation(local_drag, sanNotation, capturedPiece, PROMOTESUCESSOR, TURN)

    playMoveSound = false
    castleSound = false

    if (valueLancesTurn == 0 && local_drag.piece[1] == 'J') {
        pieceEffects.set(local_drag.id, { spin: true })
    }
    global_drag = null

    renderBoard()

    CHECKMATE = memory_checkmate

    if (CHECKMATE) renderBoard()

    if (PLAY_TURN.chuck == TURN) {
        setTimeout(() => {
            SET_ChuckMatt_Move()
        }, 1000)
        return
    }
}

function view_Notation(local_drag, sanNotation, capturedPiece, PROMOTESUCESSOR, TURN) {

    LIST_NOTATION.push(sanNotation)

    if (valueLancesTurn == 0.5) return

    if (Is_Jester(local_drag.piece[1])) {
        sanNotation = LIST_NOTATION.at(-2) + '->' + sanNotation.substring(1);
    }

    const pieceCode = local_drag.piece
    if (memory_checkmate) {
        sanNotation += '#'
    } else if (is_Check(TURN).result) {
        sanNotation += '+'
    }
    
    if (PROMOTESUCESSOR) {
        sanNotation += '&'
    }
    logMove(sanNotation, pieceCode, TURN == 'w')

    // se houve captura:
    if (capturedPiece.captured) {
        const capturedCode = TURN + capturedPiece.type
        console.log('OSWALDO: ', capturedCode)
        logCapture(capturedCode, TURN != 'w', capturedPiece.material)
    }
}
