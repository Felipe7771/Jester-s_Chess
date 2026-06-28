function set_MemoryMoves(id, color) {
    if (!memory_moves[id]) {

        let legals, illegals, jesterIllegals

        complemnt_illegals = Check_Jokemove(id, color)

        // console.log('id: ',id,JOKEMOVE[color])
        // console.log(JSON.stringify(complemnt_illegals))

        if (CHECKpin[color] && id !== get_Id_King(color)) {

            // console.log('?? ', Is_JesterSecondMove(id[1]))
            // console.log(Check_escape_moves)
            // console.log(Check_escape_moves[id])

            legals = Is_JesterSecondMove(id[1]) ? Check_escape_moves[id]: permited_block_check[id]

            if (Is_JesterSecondMove(id[1])) legals = getCommonSquares(attackers[id],legals)
            // console.log('legals: ',legals)
            illegals = subtractIntersection(legals, attackers[id])
            // console.log('illegals: ',illegals)

        } else if (Is_JesterFirstMove(id[1])) {
            ;({ legals, jesterIllegals } = LegalProvocative_Jester(id, color, false))
            // console.log('Legais: ', legals)
            // console.log('Ilegais por provocação: ', jesterIllegals)
            isJesterPinned = Is_pin(id, color)[0]

            illegals = []

            // console.log(
            //     `[ ${(jesterIllegals || []).map(formatMove).join(', ')} ]`,
            // )
        } else {
            if (id !== get_Id_King(color)) {
                illegals = set_PiecePin(id, color)
                legals = subtractIntersection(illegals, attackers[id])
            } else {
                // proibir movimentos atacados para o rei, mesmo que estejam nos attackers[id], e calcular os movimentos legais normalmente
                const enemy = get_Enemy(color)

                // Sem sucessor = xeque valido, favor evitar situações assim, mas o jogo não caga se acontecer
                checkCastling(id, color)

                if (!Have_Sucessor(color)) {
                    console.log(
                        'Rei sem sucessor, calculando movimentos legais normalmente',
                    )
                    legals = get_SquareMovesKing_Attacked(
                        pieceIndex[id],
                        enemy,
                    ).save_squares

                    if (memory_castling?.length) {
                        legals = legals.concat(memory_castling)
                    }

                    illegals = subtractIntersection(legals, attackers[id])
                } else {
                    console.log(
                        'Rei com sucessor, o movimento PODE ou NÃO fugir ',
                    )
                    legals = attackers[id] || []
                    illegals = []
                }
            }
        }

        legals = !legals ? [] : legals
        illegals = !illegals ? [] : illegals
        jesterIllegals = !jesterIllegals ? [] : jesterIllegals

        // console.log(complemnt_illegals.length)
        
        if (complemnt_illegals.length) illegals.push(...complemnt_illegals)

        // console.log(JSON.stringify(illegals))
            

        let total_moves = [...legals, ...illegals, ...jesterIllegals]

        memory_moves[id] = {
            legal: legals,
            illegal: illegals,
            j_illegal: jesterIllegals,
            total: total_moves,
        }

        total_moves_TURN += Get_Moves_MemoryMoves(legals)
    }
}