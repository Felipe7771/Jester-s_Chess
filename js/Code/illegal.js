function LegalProvocative_Jester(id, color) {

    console.log("Verificando")
    const Jester = pieceIndex[id]

    attackers[id] = []
    set_combat_piece(id, color, Jester)

    const Provocative = attackers[id]

    if (!Provocative) return

    const Escape = unit_moviment_parts.J.move[1]

    let legals = []
    let illegals = []

    for (const [Pr, Pc] of Provocative) {

        let Escape_moves = 0

        for (const [dr, dc] of Escape) {
            
            let r = Pr + dr
            let c = Pc + dc

            if (Is_OutBoard(r, c)) continue

            const square = board[r][c]

            if (!Is_anyThere(square)) Escape_moves++

        }

        console.log("Escapes: ",Escape_moves)

        if (Escape_moves) legals.push([Pr, Pc])
        else illegals.push([Pr, Pc])

    }

    attackers[id] = legals

    console.log(legals)
    console.log(illegals)

    for (const [ilr, ilc] of illegals) {

        offenseIndex[id] = offenseIndex[id].filter(item => item.r !== ilr && item.c !== ilc);

        offense[ilr][ilc][color] = offense[ilr][ilc][color].filter(item => item.id !== id);
        mobility[ilr][ilc][color] = mobility[ilr][ilc][color].filter(item => item.id !== id);

    }

    console.log("Verificado!!")

    return {legals, illegals}


}