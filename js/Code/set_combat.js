function getEnemy(color) {
    return color == 'b' ? 'w' : 'b'
}

function set_initial_combat() {
    for (const [id, content] of Object.entries(pieceIndex)) {
        let color = id[0] // id: [cor][peça][identificador]
        set_combat_piece(id, color, content, initial=true)
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
    function updateInfluenceSquare(r,c, square, pawnSet, calculate_pieces, idMoved) {
        console.log('----')
        addPawnMemory_toInfluence(r,c,idMoved)
        const survivous = new Map()

        for (const [key, piece] of square) {
            if (!(piece.id in pieceIndex)) continue

            console.log(`WWW ${r} ${c}`, pawnSet)

            if (pieces_one_step.has(piece.type) && !pawnSet.has(piece.id)) {
                survivous.set(key, piece)
                continue
            }

            console.log('Adicionando: ',piece.id)

            calculate_pieces.add(piece.id)
            delete attackers[piece.id]
        }

        influence[r][c] = survivous
    }

    function addPawnMemory_toInfluence(r, c, idMoved) {
        for (const idpawn of pawnMemory[r][c]) {

            if (idMoved[1] === 'P' && idpawn === idMoved) continue
            const Pawn = pieceIndex[idpawn]

            add_influence(idpawn, r, c, Pawn.color, 'P', Pawn.r, Pawn.c)
        }
    }

    let fr = piece_moved.from_r
    let fc = piece_moved.from_c
    let tr = piece_moved.to_r
    let tc = piece_moved.to_c

    const from_square = influence[fr][fc]
    const to_square = influence[tr][tc]

    if (piece_moved.piece == 'P') PawnMovedDeleteMemory(piece_moved.id)

    const calculate_pieces = new Set()
    calculate_pieces.add(piece_moved.id)
    delete attackers[piece_moved.id]

    updateInfluenceSquare(fr,fc, from_square, pawnMemory[fr][fc], calculate_pieces, piece_moved.id);
    updateInfluenceSquare(tr,tc, to_square, pawnMemory[tr][tc], calculate_pieces, piece_moved.id);

    // FALTANDO LIMPAR ANTIGA ANALISE DE OFFENSE PARA ADICIONAR A NOVA
    // console.log(calculate_pieces)
    for (const id of calculate_pieces) {
        const content = pieceIndex[id]
        const color = id[0]

        if (content) {

            deleteOffenseMobility(id, color)

            set_combat_piece(id, color, content)
            if (Is_JesterFirstMove(content.piece)) LegalProvocative_Jester(id, color, true);
        }
    }
}

function set_combat_piece(id, color, content, initial=false) {
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

    // console.log(`\nVez: (${color == 'w'? "white": "black"}) ${name_pieces[piece]}`, content.r, content.c, '(', type_move_piece, ')')

    calculateOffense[type_move_piece](
        id,
        content.r,
        content.c,
        piece,
        color,
        moves,
        initial
    )

}