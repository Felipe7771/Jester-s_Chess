function is_Check(color) {
    // console.log("========= IS CHECK? ========")
    const idKing = get_Id_King(color)
    const enemy = get_Enemy(color)

    // console.log('id: ',idKing)
    // console.log('color inimigo ', enemy)

    const pieceKing = pieceIndex[idKing]

    const kr = pieceKing.r
    const kc = pieceKing.c

    // console.log('Onde o Rei está? ', pieceKing.r, pieceKing.c)

    // console.log(
    //     'Who: (ids).',
    //     get_Attackers(offense[kr][kc][enemy]).map((item) => item.id),
    // )
    // console.log(
    //     'Who: (onde?).',
    //     get_Attackers(offense[kr][kc][enemy]).map(
    //         (item) => `${item.r} ${item.c}`,
    //     ),
    // )

    const Attacks = get_numAttacks(offense[kr][kc][enemy])

    // console.log('Quant:.', Attacks)

    const result = Attacks >= 1

    // console.log(result)

    return { result, Attacks }
}

function set_Check(color) {
    console.log('Analisando check: ')

    const { result, Attacks } = is_Check(color)

    // console.log('Resultado: ', result)
    // console.log('Estava em check? ', VISUAL_check.color)
    console.log(CHECKpin)

    const enemy = get_Enemy(color)

    if (VISUAL_check[color] && !result) {
        // console.log('Removendo animação de check')
        remove_KingAnimationCheck(get_Id_King(enemy))
    } else if (result) set_KingAnimationCheck(get_Id_King(color))

    VISUAL_check[color] = result
    // console.log(playMoveSound)

    if (result) check.play()
    else if (castleSound) castle.play()
    else if (playMoveSound) move.play()

    if (result && !Have_Sucessor(color)) {

        CHECKpin[color] = true

        const [checkmate, save_king_squares, permited_moves, permited_blocks] =
            estruture_Check(color, Attacks)

        console.log('===== RESULTADO CHECKMATE? =====')
        console.log(checkmate)
        console.log('Casas de fuga do rei: ', save_king_squares)
        console.log('Movimentos de ataque permitido: ', permited_moves)
        console.log('Movimentos de bloqueio permitido: ', permited_blocks)

        if (checkmate) {
            memory_checkmate = true
        } else {

            permited_block_check = mergeDictsOfLists(permited_moves, permited_blocks);
        }

    }

    castle_atives = {}
}

function mergeDictsOfLists(obj1, obj2) {
    for (const key in obj2) {
        if (obj1[key]) {
            obj1[key].push(...obj2[key]);
        } else {
            obj1[key] = obj2[key];
        }
    }

    return obj1;
}

// retorno:
// checkmate, save_king_squares
function estruture_Check(color, num_attacks) {
    const idKing = get_Id_King(color)
    const enemy = get_Enemy(color)

    const King = pieceIndex[idKing]

    // retorno:
    // checkmate: true/false
    // emerging_squares: Set()

    let checkmate = false

    const { save_squares, num_squares } = get_SquareMovesKing_Attacked(
        King,
        enemy,
    )

    console.log('Número de ataques: ', num_attacks)
    console.log('Número de casas de fuga do rei: ', num_squares)
    if (num_attacks > 1) {
        if (!num_squares) {
            checkmate = true
            return [checkmate, [], [], []]
        } else return [checkmate, save_squares, [], []]
    }

    const Attacker = get_Attacker_King(King, enemy)

    const { permited_moves, num_permited_moves } = get_SafeKillersAttackerMoves(
        King,
        enemy,
        Attacker,
    )

    if (
        num_squares == 0 &&
        num_permited_moves == 0 &&
        pieces_one_step.has(Attacker.piece)
    ) {
        checkmate = true
        return [checkmate, [], [], []]
    }

    console.log('===== GET SAFE BLOCKS MOVES =====')
    const [permited_blocks, num_permited_blocks] = get_SafeBlocksMoves(
        King,
        enemy,
        Attacker,
        num_squares,
    )

    if (
        num_squares == 0 &&
        num_permited_moves == 0 &&
        num_permited_blocks == 0
    ) {
        checkmate = true
        return [checkmate, [], [], []]
    }

    return [checkmate, save_squares, permited_moves, permited_blocks]
}

function get_SquareMovesKing_Attacked(King, enemy) {
    const moves = unit_moviment_parts['K'].move
    const team = get_Enemy(enemy)

    let save_squares = []
    console.log('King: ',King.r,King.c)

    for (const [dr, dc] of moves) {
        let r = King.r + dr
        let c = King.c + dc

        console.log('Olhando: ',r,c)


        if (Is_OutBoard(r, c)) continue

        let square = board[r][c]

        // ocupado aliado  -> não fuga
        // ocupado inimigo & defendido -> não fuga
        // ocupado inimigo -> fuga
        // livre & atacado -> não fuga
        // livre -> fuga

        if (Is_anyThere(square)) {
            if (
                !Is_AllyThere(square, team) &&
                get_numAttacks(offense[r][c][enemy]) == 0
            ) {
                save_squares.push([r, c])
            }

            continue
        }

        if (get_numAttacks(offense[r][c][enemy]) == 0) {
            save_squares.push([r, c])
        }
    }

    console.log('Casas de fuga: ', save_squares)

    const num_squares = save_squares.length

    return { save_squares, num_squares }
}

function get_Attacker_King(King, enemy) {
    const Attacker = get_Attackers(offense[King.r][King.c][enemy])

    return !Attacker.length ? {} : Attacker[0]
}

function get_SafeKillersAttackerMoves(King, enemy, Attacker) {
    const team = get_Enemy(enemy)

    let permited_moves = {}
    let num_permited_moves = 0

    const Forward = get_Attackers(offense[Attacker.r][Attacker.c][team])

    console.log(
        'Id dos atacantes do atacante: ',
        Forward.map((item) => item.id),
    )

    return check_theoretical_move(
        team,
        Forward,
        Attacker,
        permited_moves,
        num_permited_moves,
    )
}

function get_SafeBlocksMoves(King, enemy, Attacker, num_king_svSquares) {
    const Kr = King.r,
        Kc = King.c,
        Ar = Attacker.r,
        Ac = Attacker.c,
        PieceAttc = Attacker.piece
    const team = get_Enemy(enemy)
    const dist_r = Kr - Ar // ! Acima do Rei: <0, Abaixo do Rei: >0
    const dist_c = Kc - Ac // ! Direita: <0, Esquerda: >0

    const closest = new Set([0, 1])

    let permited_moves = {}
    let num_permited_moves = 0

    console.log('Distância entre o Rei e o Atacante: ', dist_r, dist_c)

    if (!num_king_svSquares && closest.has(dist_c) && closest.has(dist_r))
        return [permited_moves, num_permited_moves]

    // Principal Backup
    const Principal_Backup = createBackup()
    // Cálculo do Jester movimentos obressivos
    calculateJesterSecoundMove(team)
    // Pegar casas atacas em direção ao rei APENAS aquela que tenham pelo menos um imimigo protegendo
    const unit_r = Math.sign(dist_r)
    const unit_c = Math.sign(dist_c)

    const num_Defenders = []
    const to_blocks = []

    console.log('unit_r: ', unit_r, 'unit_c: ', unit_c)

    for (let len = 1; len <= 8; len++) {
        const r = Ar + unit_r * len
        const c = Ac + unit_c * len

        if (Is_OutBoard(r, c) || (r == Kr && c == Kc)) break

        const offend = offense[r][c][team]
        const mobili = mobility[r][c][team]

        if (get_numAttacks(mobili)) {
            const Forwards = get_Attackers(mobili)

            console.log(
                `Defensores na casa [${r}, ${c}]: `,
                Forwards.map((item) => item.id),
            )

            for (let i = 0; i < Forwards.length; i++) {

                const f_id = Forwards[i].id
                const can_block = mobili.some(Pmove => Pmove.id === f_id);

                if (can_block && Forwards[i].piece !== 'K') {
                    num_Defenders.push(Forwards[i])
                    to_blocks.push({ r, c })
                }
            }
        }
    }

    // Para cada casa
    // Sub Backup
    // executar movimento teórico
    // se funcionar, salvar movimento
    // Resturar sub Backup
    // ({permited_moves, num_permited_moves} = check_theoretical_move(team, num_Defenders, Attacker, permited_moves, num_permited_moves))

    if (num_Defenders !== null) {
        for (const [i, fwd] of num_Defenders.entries()) {
            const backup = createBackup() // salvando estado atual do jogo

            const Blocker = to_blocks[i]

            make_theoretical_move(
                fwd.id,
                fwd.piece,
                team,
                fwd.r,
                fwd.c,
                Blocker.r,
                Blocker.c,
            ) // executando movimento teórico

            const { result, Attacks } = is_Check(team)

            if (!result) {
                const Attr = Blocker.r,
                    Attc = Blocker.c
                num_permited_moves++
                ;(permited_moves[fwd.id] ??= []).push([Attr, Attc])
            }

            restoreBackup(backup) // restaurando estado ao jogo
        }

        console.log(
            'AAAAAAAAAAAA movimentos de bloqueio permitido: ',
            permited_moves,
        )

        // se tiver Jester na lista de movimentos permitidos, calcular o movimento do primeiro movimento e salvar também o segundo movimento
        const id_JESTER = get_Id_Jester(team)
        Check_escape_moves = {}
        
        if (id_JESTER in permited_moves) {
            
            const save_permited_J = structuredClone(permited_moves[id_JESTER])
            const Jr = pieceIndex[id_JESTER].r
            const Jc = pieceIndex[id_JESTER].c

            permited_moves[id_JESTER] = []

            console.log('#',save_permited_J)

            // Check_escape_moves[id_JESTER].push(save_permited_J)

            if (Check_escape_moves[id_JESTER]) Check_escape_moves[id_JESTER].push(save_permited_J)
            else Check_escape_moves[id_JESTER] = save_permited_J

            for (let i = 0; i < save_permited_J.length; i++) {
                const mover = ([r, c], [a, b]) => [r + a, c + b];

                const r = save_permited_J[i][0]
                const c = save_permited_J[i][1]
                console.log(`${r},${c}`)
                const first_m = JesterFirstMoveBySecondMove[`${r},${c}`]
                console.log('-',first_m)
                permited_moves[id_JESTER].push(first_m)
            }
        }

        console.log('Check_escape_moves: ',Check_escape_moves)
    }

    // Restaurar Principal Backup
    restoreBackup(Principal_Backup) // restaurando estado ao jogo

    return [permited_moves, num_permited_moves]
}

function make_theoretical_move(fwd_id, fwd_type, team, Fr, Fc, tr, tc) {
    // Limpa a casa de origem
    board[Fr][Fc] = {
        id: ``,
        type: '',
        color: '',
        visualKey: null,
    }

    // Remove peça capturada se houver
    if (board[tr][tc].id != '') {
        delete_piece_to_team(board[tr][tc].id, board[tr][tc].color, tr, tc)
    }

    // Coloca peça na nova casa
    board[tr][tc] = {
        id: fwd_id,
        type: fwd_type,
        color: team,
        visualKey: `${team}${fwd_type}`,
    }

    set_piece_moved(fwd_id, fwd_type, team, tr, tc, Fr, Fc)

    set_piece_moved_team(tr, tc, fwd_id, team)

    set_combat_turn()
}

function check_theoretical_move(
    team,
    Forward,
    Attacker,
    permited_moves,
    num_permited_moves,
) {
    console.log(
        'Defensores: ',
        Forward.map((item) => item.id),
    )
    console.log('Defensores é nulo? ', Forward == null)
    if (Forward == null || !Forward.length) return { permited_moves, num_permited_moves }

    for (const fwd of Forward) {
        const backup = createBackup() // salvando estado atual do jogo

        make_theoretical_move(
            fwd.id,
            fwd.piece,
            team,
            fwd.r,
            fwd.c,
            Attacker.r,
            Attacker.c,
        ) // executando movimento teórico

        const { result, Attacks } = is_Check(team)

        if (!result) {
            const Attr = Attacker.r,
                Attc = Attacker.c
            num_permited_moves++
            ;(permited_moves[fwd.id] ??= []).push([Attr, Attc])
        }

        restoreBackup(backup) // restaurando estado ao jogo
    }

    return { permited_moves, num_permited_moves }
}

function createBackup() {
    return structuredClone({
        board,
        offense,
        mobility,
        influence,
        team,
        Complement_Id_Real,
        pieceIndex,
        offenseIndex,
        offenseIndexRemove,
        piece_moved,
        attackers,
        memory_moves,
    })
}

function restoreBackup(backup) {
    board = backup.board
    offense = backup.offense
    mobility = backup.mobility
    influence = backup.influence
    team = backup.team
    Complement_Id_Real = backup.Complement_Id_Real
    pieceIndex = backup.pieceIndex
    offenseIndex = backup.offenseIndex
    offenseIndexRemove = backup.offenseIndexRemove
    piece_moved = backup.piece_moved
    attackers = backup.attackers
    memory_moves = backup.memory_moves
}
