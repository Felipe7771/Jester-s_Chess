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

function calcule_Score(id, PART, color, enemy, r, c, omega0, eta0) {
    // ? Plaza Score
    const vPLZS = calcule_PLZS(PART.piece, r, c)
    const PLZS = Normalization(vPLZS, rho.PLZS)

    // ? Emergent Piece
    const EMP = Normalization(omega0, rho.EMP) * -betta.EMP

    const kappa_NAS = Calcule_κ(r, c, enemy)

    const [omega_MAOS, V_moved_piece, Sum_V_defenders] = Calcule_Ω(r, c, PART, color, kappa_NAS)
    const sigma_LAMP =                                   Calcule_σ(r, c, color, V_moved_piece, Sum_V_defenders, kappa_NAS)
    const eta_MCTS =                                     Calcule_η(color)

    const delta_omega = omega_MAOS - omega0
    const delta_eta = eta_MCTS - eta0

    const omegaδ = Math.sign(delta_omega) * (delta_omega**2) + sigma_LAMP
    const etaδ = (delta_eta*100)

    const N_omegaδ = Normalization(omegaδ, rho.omega) 
    const N_etaδ = Normalization(etaδ, rho.eta) 

    const COMBAT = (N_omegaδ) * betta.omega + (N_etaδ) * betta.eta


    const square = board[r][c]

    // ? Capture Tax
    // console.log('CT')
    let CT = 0

    if (Is_anyThere(square) && Is_AllyThere(square, enemy)) {
        let piece_CT = square.type

        vCT = (VPS_enemy[piece_CT] + omega_MAOS)
        CT = Normalization(vCT, rho.CT) * betta.CT
    }

    // ? Pawn Struture Tax
    // console.log('PST')
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
                Is_AllyThere(diagonal_square, color) &&
                diagonal_square.type == 'P'
            ) {
                PST += EPS.P
            }
        }

        PST = Normalization(PST, rho.PST) * betta.PST
    }

    const {AAT, OT} = score_Releases(id, PART, color, r, c, omega_MAOS, sigma_LAMP)

    // OPT
    // KST
    // DST
    // AAT

    const SCORE = PLZS + COMBAT + CT + PST + AAT + OT + EMP

    return [SCORE, PLZS, EMP, N_omegaδ, COMBAT, CT, PST, AAT, OT]
}



function score_Releases(id, PART, color, r, c, omegaMAOS, sigmaLAMP) {
    console.log('!!!!! ===== score_Releases ===== !!!!!')

    // ? Assistence Ally Tax
    let AAT = 0

    // ? Offense Tax
    let OT = 0
    const enemy = get_Enemy(color)

    const backup = createBackup()

    make_theoretical_move(id, PART.piece, color, PART.r, PART.c, r, c)

    set_MemoryMoves(id, color)

    if (memory_moves[id].legal) {
        let VPS_CT = 0
        let Omega_Sigma = 0

        for (const [mr, mc] of memory_moves[id].legal) {

            const square = board[mr][mc]

            if (!get_numAttacks(offense[r][c][enemy])) {

                if (
                    There_AllyThere(square,color) &&
                    get_numAttacks(offense[mr][mc][enemy])
                ) {
                    AAT += VPS_ally[square.type]
                }
            }

            if(omegaMAOS >= 0 && There_AllyThere(square, enemy) && square.type !== PART.piece) {
                VPS_CT +=     (VPS_enemy[square.type])
                Omega_Sigma += (omegaMAOS + sigmaLAMP)
            }
        }
        // console.log('AAT')
        AAT = Normalization(AAT, rho.AAT) * betta.AAT
        // console.log('OT')
        OT = Normalization(VPS_CT, rho.OT) * betta.CT + Normalization(Omega_Sigma, rho.OT-30) * betta.OT

        restoreBackup(backup)
    }

    return {AAT, OT}
}

function log_Scores(Scores,eta0) {
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
        const pts = Number(score)

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
