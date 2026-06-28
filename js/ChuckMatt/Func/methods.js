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

function log_Scores(Scores,eta0,φ) {
    console.log(Scores)
    let bestScore = -Infinity
    let bestMove = null

    console.log('===== CHUCKMATT SCORES =====')

    // Campos estruturais que NÃO são métricas a exibir
    const knownFields = ['id', 'score', 'to_r', 'to_c']

    const formatValue = (v) => (typeof v === 'number' ? v.toFixed(2) : v)

    const buildMetricsStr = (move) =>
        Object.keys(move)
            .filter((k) => !knownFields.includes(k))
            .map((k) => `${k}: ${formatValue(move[k])}`)
            .join(', ')

    for (const key of Object.keys(Scores)) {
        const [id, score] = key.split('|')

        const move = Scores[key]
        const pts = Number(move.score)

        if (pts > bestScore) {
            bestScore = pts
            bestMove = move
        }

        const piece = pieceIndex[move.id]
        const metricsStr = buildMetricsStr(move)

        if (Array.isArray(move.to_r)) {
            // Jester
            console.log(
                `\n${move.id} [${piece.r},${piece.c} -> ${move.to_r[0]},${move.to_c[0]} -> ${move.to_r[1]},${move.to_c[1]}]: Score: ${pts.toFixed(2)}\n${metricsStr}`,
            )
        } else {
            console.log(
                `\n${move.id} [${piece.r},${piece.c} -> ${move.to_r},${move.to_c}]: Score: ${pts.toFixed(2)}\n${metricsStr}`,
            )
        }
    }

    console.log('-------------')

    if (bestMove) {
        const piece = pieceIndex[bestMove.id]
        const metricsStr = buildMetricsStr(bestMove)

        if (Array.isArray(bestMove.to_r)) {
            console.log(
                `RESULTADO: ${bestMove.id} [${piece.r},${piece.c} -> ${bestMove.to_r[0]},${bestMove.to_c[0]} -> ${bestMove.to_r[1]},${bestMove.to_c[1]}]: Score: ${bestScore.toFixed(2)}\n${metricsStr}`,
            )
        } else {
            console.log(
                `RESULTADO: ${bestMove.id} [${piece.r},${piece.c} -> ${bestMove.to_r},${bestMove.to_c}]: Score: ${bestScore.toFixed(2)}\n${metricsStr}`,
            )
        }
    }

    console.log('===========================')
    console.log(`        η₀: ${eta0}`)
    console.log(`        φ₀: ${φ}`)
    // console.log(
    //     `Strategy: ${alphaARMY >= UPPER_offense ? 'Offense' : alphaARMY <= LOWER_defense ? 'Defense' : 'Neutral'}`,
    // )
    console.log('-------------')
    console.log(`EEKS: ${EEKS.toFixed(2)}`)
}

function set_Moving(BestMove, BestPiece) {
    const local_drag = {
        piece: `${CMcolor}${BestPiece.piece}`,
        fromR: BestPiece.r,
        fromC: BestPiece.c,
        id: BestMove.id,
    }

    let CAPTURE = {
        captured: false,
        type: '',
        material: 0,
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

    animateSlide(BestPiece.r, BestPiece.c, BestMove.to_r, BestMove.to_c, default_velocity, default_animation, () => {
    // Aqui dentro é o seu código real de movimento/captura:
    // - remover a peça capturada do pieceIndex (se houver)
    // - mover a peça no estado
    // - atualizar o DOM (o "teleporte")
    Render_Move(BestMove, local_drag, CAPTURE)
    });

}

function Render_Move(BestMove, local_drag, CAPTURE) {
    if (board[BestMove.to_r][BestMove.to_c].id != '') {
        CAPTURE.captured = true
        CAPTURE.type = board[BestMove.to_r][BestMove.to_c].type
        CAPTURE.material = MaterialValue[CAPTURE.type]
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
        c: BestMove.to_c,
    }

    // lances fora da mesma casa são válidos como um lance jogável
    Do_Move_Execute(sq_local, local_drag, CAPTURE)

    renderBoard()
}
