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

function estruture_Check(color, num_attacks) {
    const idKing = get_Id_King(color)
    const enemy = get_Enemy(color)

    const King = pieceIndex[idKing]

    // retorno:
    // checkmate: true/false
    // emerging_squares: Set()
}

function get_Attacker_King(King, enemy) {
    const Attacker = get_Attackers(offense[King.r][King.c][enemy])

    return !Attacker.length ? {} : Attacker[0]
}

function can_KillAttacker(King, enemy, Attacker) {
    const team = get_Enemy(enemy)

    const Forward = new Set(
        get_Attackers(offense[Attacker.r][Attacker.c][team]),
    )

    if (!Attacker.size) return (false, new Set())

    for (const fwd of Forward) {
        const backup = createBackup()

        // continuar mais tarde
    }
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
    });

    return backup;
}

function restoreBackup(backup) {
    ({
        board,
        offense,
        mobility,
        influence,
        Complement_Id_Real,
        pieceIndex,
        offenseIndex,
        piece_moved,
    } = backup);
}

function is_SquareMovesKing_Attacked(King, enemy) {
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

    return save_squares
}
