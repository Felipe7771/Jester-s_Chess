function is_Check(color) {
    const idKing = get_Id_King(color)
    const enemy = get_Enemy(color)

    console.log(idKing)
    console.log(enemy)

    const pieceKing = pieceIndex[idKing]

    const kr = pieceKing.r
    const kc = pieceKing.c
    console.log(kr, kc)
    console.log(offense[kr][kc][enemy])

    console.log('Who:.', get_Attackers(offense[kr][kc][enemy]))

    const Attacks = get_numAttacks(offense[kr][kc][enemy])

    console.log('Quant:.', Attacks)

    const result = Attacks >= 1

    console.log(result)

    return { result, Attacks }
}

function set_Check(color) {
    console.log('Analisando check: ')

    const { result, Attacks } = is_Check(color)

    console.log(playMoveSound)

    if (result) check.play()
    else if (castleSound) castle.play()
    else if (playMoveSound) move.play()

    if (result && !Have_Sucessor(color)) {
    } else {
        InCheck = false
    }

    castle_atives = {}
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

    const { save_king_squares, num_squares_save } =
        get_SquareMovesKing_Attacked(King, enemy)

    if (num_attacks > 1) {

        if (!num_squares_save) {
            checkmate = true
            return (checkmate, new Set())

        } else return (checkmate, save_king_squares)
    }

    const Attacker = get_Attacker_King(King, enemy)


}

function get_Attacker_King(King, enemy) {
    const Attacker = get_Attackers(offense[King.r][King.c][enemy])

    return !Attacker.length ? {} : Attacker[0]
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
        delete_piece_to_team(
            board[tr][tc].id,
            board[tr][tc].color,
            tr,
            tc,
        )
    }

    // Coloca peça na nova casa
    board[tr][tc] = {
        id: fwd_id,
        type: fwd_type,
        color: team,
        visualKey: `${team}${fwd_type}`,
    }

    set_piece_moved(
        fwd_id,
        fwd_type,
        team,
        tr,
        tc,
        Fr,
        Fc,
    )
    set_piece_moved_team(tr, tc, fwd_id, team)

    set_combat_turn()
}
function get_SafeKillersAttackerMoves(King, enemy, Attacker, num_king_svSquares) {

    const Kr = King.r, Kc = King.c, Ar = Attacker.r, Ac = Attacker.c, PieceAttc = Attacker.piece
    const team = get_Enemy(enemy)
    const dist_r = Kr - Ar // ! Acima do Rei: <0, Abaixo do Rei: >0
    const dist_c = Ac - Kc // ! Direita: <0, Esquerda: >0

    const closest = new Set([0, 1])

    let permited_moves = {}
    let num_permited_moves = 0

    if (!num_king_svSquares && (closest.has(dist_c) && closest.has(dist_r)))
        return { permited_moves, num_permited_moves }

    // Principal Backup
    const Principal_Backup = createBackup();
    // Cálculo do Jester movimentos obressivos
    calculateJesterSecoundMove(team);
    // Pegar casas atacas em direção ao rei APENAS aquela que tenham pelo menos um imimigo protegendo
    const unit_r = Math.sign(dist_r);
    const unit_c = Math.sign(dist_c);

    const num_Defenders = []

    for (let len = 1; len <= 8; len++) {

        const r = Ar + unit_r * len
        const c = Ac + unit_c * len

        if (Is_OutBoard(r, c) || ((r == Kr) && (c == Kc))) break

        const offend = offense[r][c][team];

        if (get_numAttacks(offend)) {
            const attackers = get_Attackers(offend);

            for (let i = 0; i < attackers.length; i++) {
                num_Defenders.push(attackers[i]);
            }
        }
    }

    // Para cada casa
    // Sub Backup
    // executar movimento teórico
    // se funcionar, salvar movimento
    // Resturar sub Backup
    const {permited_defends, num_permited_defends} = check_theoretical_move(num_Defenders, permited_moves, num_permited_moves);

    // Restaurar Principal Backup
    restoreBackup(Principal_Backup) // restaurando estado ao jogo

    return {permited_defends, num_permited_defends}
}


function get_SafeKillersAttackerMoves(King, enemy, Attacker) {
    const team = get_Enemy(enemy)

    let permited_moves = {}
    let num_permited_moves = 0

    const Forward = get_Attackers(offense[Attacker.r][Attacker.c][team]);


    return check_theoretical_move(Forward, permited_moves, num_permited_moves);

}

function check_theoretical_move(Forward, permited_moves, num_permited_moves) {
    if (Forward == null) return { permited_moves, num_permited_moves }

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
            const Attr = Attacker.r, Attc = Attacker.c
            num_permited_moves++

            (permited_moves[fwd.id] ??= []).push([Attr, Attc])
        }

        restoreBackup(backup) // restaurando estado ao jogo
    }

    return { permited_moves, num_permited_moves }
}

function createBackup() {
    const backup = structuredClone({
        board,
        offense,
        mobility,
        influence,
        Complement_Id_Real,
        pieceIndex,
        offenseIndex,
        piece_moved,
    })

    return backup
}

function restoreBackup(backup) {
    ; ({
        board,
        offense,
        mobility,
        influence,
        Complement_Id_Real,
        pieceIndex,
        offenseIndex,
        piece_moved,
    } = backup)
}

function get_SquareMovesKing_Attacked(King, enemy) {
    const moves = unit_moviment_parts['K'].move

    let save_squares = new Set()

    for (const [dr, dc] of moves) {
        let r = from_r + dr
        let c = from_c + dc

        if (Is_OutBoard(r, c)) continue

        let square = board[r][c]

        // ocupado aliado  -> não fuga
        // ocupado inimigo & defendido -> não fuga
        // ocupado inimigo -> fuga
        // livre & atacado -> não fuga
        // livre -> fuga

        if (Is_anyThere(square)) {
            if (
                !Is_AllyThere(square, color) &&
                get_numAttacks(offense[r][c][enemy]) == 0
            ) {
                save_squares.add([r, c])
            }

            continue
        }

        if (get_numAttacks(offense[r][c][enemy]) == 0) {
            save_squares.add([r, c])
        }
    }

    const num_squares = save_squares.size()

    return { save_squares, num_squares }
}

function Is_pin(id, color) {

    // Se tem sucessor, não tem peça cravada
    if (Have_Sucessor(color)) return [false, null]
    
    const Piece = pieceIndex[id];
    const pr = Piece.r, pc = Piece.c
    const enem = get_Enemy(color)

    const King = pieceIndex[get_Id_King(color)]
    const Kr = King.r, Kc = King.c

    const square_Piece = offense[pr][pc][enem]
    const Enemies = get_Attackers(square_Piece)


    if (!Enemies.length) return [false, null]

    const Length = Enemies.length

    const drK = Kr - pr, dcK = Kc - pc
    console.log("======= ANALISANDO REI =======")
    const typeM_King = get_type_move(drK, dcK);

    if (typeM_King == 'no_line') return [false, null]

    const UdrK = Math.sign(drK);
    const UdcK = Math.sign(dcK);
    
    let alone = true
    let id_attacker = null

    console.log("======= ANALISANDO INIMIGOS =======")
    
    for (const [index, Enemie] of Enemies.entries()) {

        // console.log("Inimigo: ", Enemie.id, "Tipo de peça: ", Enemie.piece)
        // console.log("Tipo de movimento da peça: ", unit_moviment_parts[Enemie.piece].type_move)
        if(unit_moviment_parts[Enemie.piece].type_move != 'linear') {
            if (index == Length-1) {
                alone = false
            }
            continue
        }

        // console.log(">> O inimigo é linear")

        const Er = Enemie.r, Ec = Enemie.c

        const drE = Er - pr, dcE = Ec - pc
        const typeM_Enemie = get_type_move(drE, dcE);

        // console.log("Enemie: ", Enemie.id, "Tipo de movimento: ", typeM_Enemie)
        // console.log("Estão na mesma linha? ", typeM_Enemie === typeM_King)
        
        if (typeM_Enemie !== typeM_King) {
            if (index == Length-1) {
                alone = false
            }
            continue
        }

        // console.log(">> O inimigo está na mesma direção do rei")
        
        const UdrE = Math.sign(drE);
        const UdcE = Math.sign(dcE);

        // console.log("Unidade Enemie: ", UdrE, UdcE)
        // console.log("Unidade King: ", UdrK, UdcK)

        // console.log("São opostos? ", UdrE === -UdrK && UdcE === -UdcK)

        if (UdrE !== -UdrK || UdcE !== -UdcK) {
            if (index == Length-1) {
                alone = false
            }
            continue
        }

        // console.log(">> O inimigo está na linha do rei")

        const UdrEK = Math.sign(Kr - Er);
        const UdcEK = Math.sign(Kc - Ec);

        id_attacker = Enemie.id

        const max_len = freq_move[unit_moviment_parts[Enemie.piece].type_move]

        for (let len = 1; len <= max_len; len++) {

            r = Er + UdrEK*len;
            c = Ec + UdcEK*len;

            // console.log("Verificando casa: ", r, c)
            if (Is_OutBoard(r, c) || (r == Kr && c == Kc)) break

            const square = board[r][c]

            // console.log("Está ocupada? ", Is_anyThere(square))
            // console.log("Peça ali? ", square.id)

            if (Is_anyThere(square) && square.id !== Piece.id) {
                alone = false
                break
            }

        }

        break
    }

    return [alone, id_attacker]

}

function get_type_move(dr, dc) {
    const produt = Math.abs(dr*dc)

    // console.log("Produto: ", produt)
    // console.log("dr: ", dr, "dc: ", dc)
    // console.log("Tipo: ",!produt ? 'orthogonal' : (produt == dr*dr || produt == dc*dc ? 'diagonal' : 'no_line'))

    if (!produt) {
        return 'orthogonal';
    } else if (produt == dr*dr || produt == dc*dc) {
        return 'diagonal';
    } else {
        return 'no_line'
    }
}
