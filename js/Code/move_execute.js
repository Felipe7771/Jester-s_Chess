async function Do_Move_Execute(sq, local_drag, capturedPiece) {
    Castling_Move(local_drag.id, sq.r, sq.c, local_drag.piece[0])

    if (!Is_JesterSecondMove(local_drag.piece[1])) yellowSquares.clear()

    Add_LanceValue(local_drag)

    UI_yellowFlag(local_drag, sq)

    Empty_Memory_moves()
    
    const PROMOTESUCESSOR = Check_SpecialActivities(sq)

    Set_ConfigsPieceMoved(local_drag, sq)
    
    await checkPromotedPawn(board[sq.r][sq.c].id, TURN, sq.r, sq.c)
    
    // Tudo abaixo só roda depois da promoção estar concluída
    set_combat_turn()

    Clear_ElementsCheck()

    isEndedTurn()

    Set_AnalysisCheck()
    
    CHUCK_ChatCheck()
    
    Set_Notation(local_drag, sq, capturedPiece, PROMOTESUCESSOR, TURN)
    
    playMoveSound = false
    castleSound = false
    
    if (valueLancesTurn == 0 && local_drag.piece[1] == 'J') {
        pieceEffects.set(local_drag.id, { spin: true })
    }

    global_drag = null

    renderBoard()
    
    Set_MemoryMovesTEAM(TURN) // setar todos os movimentos pré renderizados
    Set_AnalysisDraw(capturedPiece.captured, local_drag.id[1])
    
    UI_Check()

    CHUCK_Turn()

    console.log(team_pieces[TURN])
}


// ====================================================
// AUXILIAR FUNCTIONS
// ====================================================


function UI_yellowFlag(local_drag, sq) {
    if (!Is_JesterSecondMove(local_drag.piece[1])) yellowSquares.clear()

    const key1 = sqKey(sq.r, sq.c)
    const key2 = sqKey(local_drag.fromR, local_drag.fromC)

    yellowSquares.add(key1)
    yellowSquares.add(key2)
    
    clearMoveHints()
}

function Add_LanceValue(local_drag) {
    valueLancesTurn += local_drag.piece[1] == 'J' ? 0.5 : 1
    
}

function Empty_Memory_moves() {
    memory_moves = {}

}

function Check_SpecialActivities(sq) {
    const PROMOTESUCESSOR = checkPromotedSucessor(TURN)
    checkBreakCastlePermission(board[sq.r][sq.c].id, TURN)

    return PROMOTESUCESSOR
}

function Set_ConfigsPieceMoved(local_drag, sq) {
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
}

function Clear_ElementsCheck() {
    VISUAL_check[TURN] = false

    if (valueLancesTurn == 1) {
        Check_escape_moves = {}
        CHECKpin[TURN] = false
    }
    permited_block_check = {}
    remove_KingAnimationCheck(get_Id_King(TURN))
}

function Set_AnalysisCheck() {
        // if (valueLancesTurn !== 0.5) set_Check(TURN)
        // else move.play()

        set_Check(TURN)
}

function CHUCK_ChatCheck() {
    if (PLAYING_WITH_CHUCKMATT && !memory_checkmate) {
        if (CHECKpin[TURN] && TURN !== PLAY_TURN.chuck) sendBotMessage(get_randomMessage(CHECK_CHUCK_CHAT_BOT))
    }
}

function Set_Notation(local_drag, sq, capturedPiece, PROMOTESUCESSOR, TURN) {
    let Nota_piece = local_drag.piece[1] == 'P' ? '' : local_drag.piece[1]
    let sanNotation = Nota_piece + toChessNotation(sq.r, sq.c)
    view_Notation(local_drag, sanNotation, capturedPiece, PROMOTESUCESSOR, TURN)
}

function UI_Check() {
    CHECKMATE = memory_checkmate
    if (CHECKMATE) renderBoard()
    else if (DRAW) renderBoard()
}

function CHUCK_Turn() {
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
