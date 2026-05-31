function getEnemy(color) {
    return color == 'b' ? 'w' : 'b'
}

function set_initial_combat() {
    for (const [id, content] of Object.entries(pieceIndex)) {
        let color = id[0] // id: [cor][peça][identificador]
        set_combat_piece(id, color, content)
    }
}

function set_combat_turn() {
    /**
     * O set_combat_turn só altera a composição das seguintes peças:
     * - a Peça movida, pois ela vai aterar inevitavelmente as casas que ele ataca e protege;
     * - peças que atacavam a posição antiga (Tanto inimiga/aliada), poderia estar bloqueando a continuação do ataque (APENAS se for tipo linear/two_steps)
     * - peças que atacavam a posição atual (Tanto inimiga/aliada), pode agora bloquear ataques
     *
     * # Demais peças não alteram suas composições de ataque já que não estão interagindo com o movimento da peça
     *
     */

    let fr = piece_moved.from_r
    let fc = piece_moved.from_c
    let tr = piece_moved.to_r
    let tc = piece_moved.to_c

    const from_square = influence[fr][fc]
    const to_square = influence[tr][tc]

    const calculate_pieces = new Set()
    calculate_pieces.add(piece_moved.id)
    delete attackers[piece_moved.id]

    for (const [indx, color] of ['w', 'b'].entries()) {
        let survivous = new Map()

        for (const [key, piece] of from_square[color]) {
            if ((!key) in pieceIndex) continue

            if (pieces_one_step.has(piece.type)) {
                survivous.set(key, piece)
                continue
            }

            calculate_pieces.add(piece.id)
            delete attackers[piece.id]
            // console.log('Deletado: ', piece.id)
        }

        from_square[color] = survivous
        influence[fr][fc][color] = survivous

        survivous = new Map()

        for (const [key, piece] of to_square[color]) {
            if ((!key) in pieceIndex) continue

            if (pieces_one_step.has(piece.type)) {
                survivous.set(key, piece)
                continue
            }

            calculate_pieces.add(piece.id)
            delete attackers[piece.id]
        }

        to_square[color] = survivous
        influence[tr][tc][color] = survivous

        
        const pawns = Object.fromEntries(
            Object.entries(pieceIndex).filter(([id_piece, piece]) => {
                return (
                    id_piece.substring(0, 2) == `${color}P`
                )
            }),
        )

        // console.log(`${color}:`, pawns)

        const id_pawns = Object.values(pawns).map((piece) => piece.id)

        // console.log(`${color}:`, id_pawns)
        // console.log(`calculate_pieces `, calculate_pieces)

        id_pawns.forEach((id) => calculate_pieces.add(id))
    }

    // console.log('Finalizando peãos')

    // FALTANDO LIMPAR ANTIGA ANALISE DE OFFENSE PARA ADICIONAR A NOVA
    for (const id of calculate_pieces) {
        const content = pieceIndex[id]
        const color = id[0]

        if (content) {
            for (const place_offense of offenseIndex[id]) {
                
                const ro = place_offense.r
                const co = place_offense.c

                const index = offense[ro][co][color].findIndex(
                    (part_offense) => part_offense.id === id,
                )

                if (index !== -1) offense[ro][co][color].splice(index, 1)
            }

            set_combat_piece(id, color, content)
            if (Is_JesterFirstMove(content.piece)) LegalProvocative_Jester(id, color);
        }
    }
}

function set_combat_piece(id, color, content) {
    let piece = content.piece
    let type_move_piece
    let moves

    const base = unit_moviment_parts[piece]

    if (Is_Jester(piece)) {
        const index_move = TURN == color ? getJesterMoveIndex() : 0
        type_move_piece = base.type_move[index_move]
        moves = base.move[index_move]
    } else {
        type_move_piece = base.type_move
        moves = base.move
    }

    console.log(`\nVez: (${color == 'w'? "white": "black"}) ${name_pieces[piece]}`, content.r, content.c, '(', type_move_piece, ')')

    calculateOffense[type_move_piece](
        id,
        content.r,
        content.c,
        piece,
        color,
        moves,
    )

}