function Do_Move_Execute(sq, local_drag) {

    Castling_Move(local_drag.id, sq.r, sq.c, local_drag.piece[0])

    
    if (!Is_JesterSecondMove(local_drag.piece[1]))
        yellowSquares.clear()

    valueLancesTurn += local_drag.piece[1] == 'J' ? 0.5 : 1 // por enquanto, toda peça tem o mesmo valor de lance (Jester: 1/2)
    
    SELECTOR_ID = local_drag.piece[1] == 'J' ? SELECTOR_ID : ''
    SELECTOR_COLOR = local_drag.piece[1] == 'J' ? SELECTOR_COLOR : ''
    
    console.log('==========================')
    console.log(
        `Peça movida (${local_drag.id}) | valorLance-> ${valueLancesTurn}`,
    )
    
    const key1 = sqKey(sq.r, sq.c)
    const key2 = sqKey(local_drag.fromR, local_drag.fromC)
    
    yellowSquares.add(key1)
    yellowSquares.add(key2)

    memory_moves = {}

    clearMoveHints()

    checkPromotedSucessor(TURN)
    checkPromotedPawn(board[sq.r][sq.c].id, TURN, sq.r, sq.c)
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
    set_piece_moved_team(
        sq.r,
        sq.c,
        local_drag.id,
        local_drag.piece[0],
    )
    
    set_combat_turn()

    isEndedTurn() // tente encerrar o turno
    
    console.log('FIM DE TURNO')
    set_Check(TURN)
    
    playMoveSound = false
    castleSound = false
    
    global_drag = null
}