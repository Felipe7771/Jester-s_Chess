function Is_Jokemove(id, enemy) {
    const King = pieceIndex[get_Id_King(enemy)]
    const cooKing = [King.r, King.c]

    if (Is_InjesterLegalMoves(id, cooKing)) Set_Jokemove(id, King, enemy)

}

function Set_Jokemove(idj, King, enemy) {

    const Kr = King.r
    const Kc = King.c
    const Jester = pieceIndex[idj]

    JOKEMOVE[enemy] = true
    JOKER[enemy] = sqKey(Jester.r, Jester.c)
    KINGER[enemy] = sqKey(Kr, Kc)

    const SSR = (Kr + Jester.r)/2
    const SSC = (Kc + Jester.c)/2

    const moves = unit_moviment_parts.B.move
    let laughters = []
    for (const [dr,dc] of moves) laughters.push(sqKey(Kr+dr,Kc+dc))

    SADSQUARE[enemy] = sqKey(SSR,SSC)
    LAUGHTER[enemy] = new Set(laughters)

}

function Check_Jokemove(id, color) {

    if (!JOKEMOVE[color]) return []

    const Piece = pieceIndex[id]
    const sqKeyPiece = sqKey(Piece.r, Piece.c)

    if (LAUGHTER[color]?.has(sqKeyPiece) && attackers[id]) {

        const legal = []
        const illegal = []

        const sqKeyAttakcers = []
        attackers[id].forEach(coo => sqKeyAttakcers.push(sqKey(coo[0],coo[1])));

        for (const sqAttck of sqKeyAttakcers) {

            if(SADSQUARE[color] === sqAttck || JOKER[color] === sqAttck) {
                legal.push(sqFromKey(sqAttck))
            } else {
                
                illegal.push(sqFromKey(sqAttck))
            }
        }

        attackers[id] = legal
        return illegal

    }

    return []
}

function Check_BreakJokemove(sq, local_drag) {
    const color = TURN

    console.log('sq: ',sq.r,sq.c)
    console.log('color:', color)
    console.log('JOKEMOVE:', JOKEMOVE[color])
    console.log('Lance:', valueLancesTurn !== 1)
    console.log('Portanto:', valueLancesTurn !== 1 || !JOKEMOVE[color])
    
    if (valueLancesTurn !== 1 || !JOKEMOVE[color]) return
    
    
    const sqKeyMove = sqKey(sq.r,sq.c)
    const enemy = get_Enemy(color)
    
    const [jr, jc] = sqFromKey(JOKER[color])
    console.log('JOKER:', jr,jc)
    const plJoker = board[jr][jc]
    
    const JokerAlive = (plJoker.type == 'J' && plJoker.color == enemy)
    
    const [kr, kc] = sqFromKey(KINGER[color])
    console.log('KINGER:', kr,kc)
    const plKinger = board[kr][kc]

    const KingerAlive = (plKinger.type == 'K' && plKinger.color == color)

    if (!JokerAlive || !KingerAlive || SADSQUARE[color] === sqKeyMove) {

        RestorePiecesLaughters(color)
        
        JOKEMOVE[color] = false
        JOKER[color] = ''
        KINGER[color] = ''
        SADSQUARE[color] = ''
        LAUGHTER[color] = new Set()

    }
}

function RestorePiecesLaughters(color) {
    LAUGHTER[color].add(SADSQUARE[color])

    for (key of LAUGHTER[color]) {
        const [r, c] = sqFromKey(key)

        const square = board[r][c]

        if (There_AllyThere(square, color)) {
            delete attackers[square.id]
            deleteOffenseMobility(square.id)
            const content = pieceIndex[square.id]

            set_combat_piece(square.id, color, content)

        }
    }
}