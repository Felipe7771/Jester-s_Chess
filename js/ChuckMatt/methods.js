function calcule_EEKS() {
    const enemy = get_Enemy(CMcolor)
    const king = pieceIndex[get_Id_King(enemy)]

    let protectedScore = 0

    const Kr = king.r
    const Kc = king.c

    EnemyKing_plaza = plazaEnemyKing(Kr, Kc)

    for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
            if (dr === 0 && dc === 0) continue

            const r = Kr + dr
            const c = Kc + dc

            if (Is_OutBoard(r, c)) continue

            const square = board[r][c]

            if (Is_anyThere(square) && Is_AllyThere(square, enemy)) {
                protectedScore += 3 - Math.max(Math.abs(dr), Math.abs(dc))
            }
        }
    }

    EEKS = 2 * (1 - protectedScore / 32)
}

function growUp_King_ally() {
    VPS_ally.K = 1000
}

function growUp_King_enemy() {
    VPS_enemy.K = 1000
}

function matrixOp(A, B, op) {
    return A.map((row, r) => row.map((value, c) => op(value, B[r][c])))
} 

function generate_Attackersplaza(EEKS) {
    return matrixOp(
        Default_Attackers_plaza,
        EnemyKing_plaza,
        (a, b) => a + b * EEKS,
    )
}

function calcule_PLZS(P, r, c) {
    if (PLZpawns.has(P)) return Pawn_plaza[r][c]
    else if (PLZattackers.has(P)) return Attackers_plaza[r][c]
    else if (PLZdefenders.has(P)) return Defenders_plaza[r][c]
}

function calcule_EPS_APT(PART, enemy) {
    const p = PART.piece
    const from_r = PART.r,
        from_c = PART.c

    const from_num_attackers = get_numAttacks(offense[from_r][from_c][enemy])

    const is_from_attacked = !from_num_attackers ? 0 : 1

    const EPSs = EPS[PART.piece] * bettaEPS
    const APT = is_from_attacked * bettaAPT * VPS_ally[PART.piece]

    return APT + EPSs
}

function calcule_Score(id, PART, color, enemy, r, c) {
    // ? Plaza Score
    const PLZS = calcule_PLZS(PART.piece, r, c)

    const to_num_attackers = get_numAttacks(offense[r][c][enemy])
    is_to_attacked = !to_num_attackers ? 0 : 1

    // ? Attacked Square Tax
    const AST = is_to_attacked * bettaAST * VPS_ally[PART.piece]

    const square = board[r][c]

    // ? Capture Tax
    let CT = 0

    if (Is_anyThere(square) && Is_AllyThere(square, enemy)) {
        let piece_CT = square.type

        CT = bettaCT * VPS_enemy[piece_CT]
    }

    // ? Pawn Struture Tax
    let PST = 0
    if (PART.piece == 'P') {
        const moves = unit_moviment_parts.B.move
        for (const [dr, dc] of moves) {
            const ddr = r + dr
            const ddc = c + dc

            if (Is_OutBoard(ddr, ddc)) continue

            const diagonal_square = board[ddr][ddc]

            if (
                Is_anyThere(diagonal_square) &&
                Is_AllyThere(square, color) &&
                diagonal_square.type == 'P'
            ) {
                PST += EPS.P * bettaPST
            }
        }
    }

    // OPT
    // KST
    // DST
    // AAT

    return PLZS + AST + CT + PST
}

function log_Scores(Scores) {
    console.log(Scores)
    let bestScore = -Infinity
    let bestMove = null

    console.log('===== CHUCKMATT SCORES =====')
    
    for (const key of Object.keys(Scores)) {
        const [id, score] = key.split('|')

        const move = Scores[key]
        const pts = Number(score)
        
        if (pts > bestScore) {
            bestScore = pts
            bestMove = move
        }
        
        const piece = pieceIndex[move.id]

        if (Array.isArray(move.to_r)) {
            // Jester
            console.log(
                `${move.id} [${piece.r},${piece.c} -> ${move.to_r[0]},${move.to_c[0]} -> ${move.to_r[1]},${move.to_c[1]}]: (${pts}) pts`,
            )
        } else {
            console.log(
                `${move.id} [${piece.r},${piece.c} -> ${move.to_r},${move.to_c}]: (${pts}) pts`,
            )
        }
    }
    
    console.log('-------------')

    if (bestMove) {
        const piece = pieceIndex[bestMove.id]
        
        if (Array.isArray(bestMove.to_r)) {
            console.log(
                `RESULTADO: ${bestMove.id} [${piece.r},${piece.c} -> ${bestMove.to_r[0]},${bestMove.to_c[0]} -> ${bestMove.to_r[1]},${bestMove.to_c[1]}]: (${bestScore}) pts`,
            )
        } else {
            console.log(
                `RESULTADO: ${bestMove.id} [${piece.r},${piece.c} -> ${bestMove.to_r},${bestMove.to_c}]: (${bestScore}) pts`,
            )
        }
    }
    
    console.log('===========================')
    console.log(`alpha ARMY: ${alphaARMY}`)
    console.log(`Strategy: ${alphaARMY >= UPPER_offense ? 'Offense': alphaARMY <= LOWER_defense ? 'Defense': 'Neutral'}`)
    console.log('-------------')
    console.log(`EEKS: ${(EEKS).toFixed(2)}`)
}

function set_Moving(BestMove, BestPiece) {
    const local_drag = {
    piece: `${CMcolor}${BestPiece.piece}`,
    fromR: BestPiece.r,
    fromC: BestPiece.c,
    id: BestMove.id,
    }

    board[BestPiece.r][BestPiece.c] = {
        id: ``,
        type: '',
        color: '',
        visualKey: null,
    }
    if (
            board[BestMove.to_r][BestMove.to_c].visualKey != null &&
            board[BestMove.to_r][BestMove.to_c].visualKey[0] != local_drag.piece[0]
        ) {
            take.play()
        } else if (
            board[BestMove.to_r][BestMove.to_c].visualKey == null &&
            (local_drag.fromR != BestMove.to_c || local_drag.fromC != BestMove.to_r)
        ) {
            playMoveSound = true
        }
        if (board[BestMove.to_r][BestMove.to_c].id != '') {
            delete_piece_to_team(
                board[BestMove.to_r][BestMove.to_c].id,
                board[BestMove.to_r][BestMove.to_c].color,
                BestMove.to_c,
                BestMove.to_r,
            )
        }
        // coloca peça na nova casa
        board[BestMove.to_r][BestMove.to_c] = {
            id: local_drag.id,
            type: local_drag.piece[1],
            color: local_drag.piece[0],
            visualKey: local_drag.piece,
        }

        const sq_local = {
            r: BestMove.to_r,
            c: BestMove.to_c
        }


        // lances fora da mesma casa são válidos como um lance jogável
        Do_Move_Execute(sq_local, local_drag)

        renderBoard()
}