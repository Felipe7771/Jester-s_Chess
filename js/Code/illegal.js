function LegalProvocative_Jester(id, color) {

    // console.log("Verificando")
    const Jester = pieceIndex[id]

    attackers[id] = []
    set_combat_piece(id, color, Jester)

    const Provocative = attackers[id]

    if (!Provocative) return

    const Escape = unit_moviment_parts.J.move[1]

    let legals = []
    let jesterIllegals = []

    for (const [Pr, Pc] of Provocative) {

        let Escape_moves = 0

        for (const [dr, dc] of Escape) {
            
            let r = Pr + dr
            let c = Pc + dc

            if (Is_OutBoard(r, c)) continue

            const square = board[r][c]

            if (!Is_anyThere(square)) Escape_moves++

        }

        // console.log("Escapes: ",Escape_moves)

        if (Escape_moves) legals.push([Pr, Pc])
        else jesterIllegals.push([Pr, Pc])

    }

    attackers[id] = legals

    // console.log(legals)
    // console.log(jesterIllegals)

    for (const [ilr, ilc] of jesterIllegals) {

        offenseIndex[id] = offenseIndex[id].filter(item => item.r !== ilr && item.c !== ilc);

        offense[ilr][ilc][color] = offense[ilr][ilc][color].filter(item => item.id !== id);
        mobility[ilr][ilc][color] = mobility[ilr][ilc][color].filter(item => item.id !== id);

    }

    // console.log("Verificado!!")

    return {legals, jesterIllegals}


}

function illegalMovesTratament(piece, coo_try_move, color) {
    console.log("===== ILLEGAL MOVES TRATAMENT ===")

    const r = coo_try_move[0]
    const c = coo_try_move[1]

    console.log("BASE: ",r, c)


    if (Is_Jester(piece)) {

        let illegal_alerts = []

        const moves = unit_moviment_parts.J.move[1]

        for (const [dr, dc] of moves) {
            console.log("ADICIONAL: ",dr, dc)
            const Ar = r + dr
            const Ac = c + dc

            if (Is_OutBoard(Ar,Ac)) continue

            illegal_alerts.push([Ar,Ac])
        }

        console.log(illegal_alerts)

        flashIllegal(illegal_alerts)
    } else {
        // exibir que o rei vai ficar em xeque 
        const King = pieceIndex[get_Id_King(color)]
        const Kr = King.r
        const Kc = King.c

        flashIllegal([[Kr, Kc]])
    }
}