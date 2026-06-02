unit_moviment_parts = {
    P: {
        type_move: 'pawn',
        move: [
            [-1, -1],
            [-1, 0],
            [-1, 1],
        ],
    },
    B: {
        type_move: 'linear',
        move: [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ],
    },
    N: {
        type_move: 'one_step',
        move: [
            [-2, -1],
            [-2, 1],
            [-1, 2],
            [1, 2],
            [2, -1],
            [2, 1],
            [1, -2],
            [-1, -2],
        ],
    },
    R: {
        type_move: 'linear',
        move: [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ],
    },
    J: {
        type_move: ['two_steps', 'one_step'],
        move: [
            [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
            ],
            [
                [-1, -1],
                [-1, 1],
                [1, 1],
                [1, -1],
            ],
        ],
    },
    Q: {
        type_move: 'linear',
        move: [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ],
    },
    K: {
        type_move: 'one_step',
        move: [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ],
    },
    S: {
        type_move: 'one_step',
        move: [
            [-1, 0],
            [0, -1],
            [1, 0],
            [0, 1],
        ],
    },
}

const sqKey_secondMove_Jester = new Map([
    [
        '-1,0',
        [
            [0, 1],
            [-2, 1],
            [-2, -1],
            [0, -1],
        ],
    ],
    [
        '-2,0',
        [
            [-1, 1],
            [-3, 1],
            [-3, -1],
            [-1, -1],
        ],
    ],
    [
        '1,0',
        [
            [2, 1],
            [0, 1],
            [0, -1],
            [2, -1],
        ],
    ],
    [
        '2,0',
        [
            [3, 1],
            [1, 1],
            [1, -1],
            [3, -1],
        ],
    ],
    [
        '0,-1',
        [
            [1, 0],
            [-1, 0],
            [-1, -2],
            [1, -2],
        ],
    ],
    [
        '0,-2',
        [
            [1, -1],
            [-1, -1],
            [-1, -3],
            [1, -3],
        ],
    ],
    [
        '0,1',
        [
            [1, 2],
            [-1, 2],
            [-1, 0],
            [1, 0],
        ],
    ],
    [
        '0,2',
        [
            [1, 3],
            [-1, 3],
            [-1, 1],
            [1, 1],
        ],
    ],
])

// dicionário de funções
const calculateOffense = {
    linear: calculateLinearOffense,
    one_step: calculateOneStepOffense,
    two_steps: calculateLinearOffense,
    pawn: calculatePawnOffense,
}

freq_move = {
    linear: 8,
    one_step: 1,
    two_steps: 2,
    pawn: 1,
}

function calculateLinearOffense(id, from_r, from_c, piece, color, moves) {
    const base = unit_moviment_parts[piece]
    const type_move = Is_Jester(piece) ? base.type_move[0] : base.type_move
    const max = freq_move[type_move]

    for (const [dr, dc] of moves) {
        for (let len = 1; len <= max; len++) {
            let r = from_r + dr * len
            let c = from_c + dc * len

            if (Is_OutBoard(r, c)) break

            let square = board[r][c]

            // ocupado aliado  -> apenas offense para defesa
            // ocupado inimigo -> offense & mobility
            // livre           -> offense & mobility

            if (Is_anyThere(square)) {
                if (Is_AllyThere(square, color))
                    add_offense(id, r, c, color, piece, from_r, from_c)
                else
                    add_offense_mobility(id, r, c, color, piece, from_r, from_c)

                break
            }

            add_offense_mobility(id, r, c, color, piece, from_r, from_c)
        }
    }
}

function calculateOneStepOffense(id, from_r, from_c, piece, color, moves) {
    for (const [dr, dc] of moves) {
        let r = from_r + dr
        let c = from_c + dc

        if (Is_OutBoard(r, c)) continue

        let square = board[r][c]

        // ocupado aliado  -> apenas offense para defesa
        // ocupado inimigo -> offense & mobility
        // livre           -> offense & mobility

        if (Is_anyThere(square)) {
            if (Is_AllyThere(square, color))
                add_offense(id, r, c, color, piece, from_r, from_c)
            else if (!Is_JesterSecondMove(piece))
                add_offense_mobility(id, r, c, color, piece, from_r, from_c)

            continue
        }

        add_offense_mobility(id, r, c, color, piece, from_r, from_c)
    }
}

function calculatePawnOffense(id, from_r, from_c, piece, color, list_moves) {
    const type_move = unit_moviment_parts[piece].type_move

    // console.log("Antes: ",attackers[id])

    let moves = [...list_moves]

    const ajust = color == 'w' ? 1 : -1
    const first_line = color == 'w' ? 6 : 1

    // console.log(first_line)
    // console.log(from_r)
    // console.log(from_r === first_line)

    if (
        from_r === first_line &&
        !moves.some((m) => m[0] === -2 && m[1] === 0)
    ) {
        moves.push([-2, 0])
    }

    let can_do_two_steps = true

    for (const [dr, dc] of moves) {
        let r = from_r + dr * ajust
        let c = from_c + dc * ajust

        // console.log("Peao",dr, dc)

        if (Is_OutBoard(r, c)) continue

        let square = board[r][c]

        if (dc == 0) {
            // console.log(attackers[id])
            // movimento endiante

            if (!Is_anyThere(square)) {
                if (dr == -1 || (dr == -2 && can_do_two_steps))
                    add_mobility(id, r, c, color, piece, from_r, from_c)
            } else {
                if (dr == -1) can_do_two_steps = false
            }
            continue
        } else {
            if (Is_anyThere(square) && !Is_AllyThere(square, color))
                add_offense_mobility(id, r, c, color, piece, from_r, from_c)
            else add_offense(id, r, c, color, piece, from_r, from_c)

            continue
        }
    }
}

function calculateJesterSecoundMove(color) {
    const prefix = `${color}J`

    for (const key in pieceIndex) {
        if (!key.startsWith(prefix)) continue

        const jester = pieceIndex[key]
        const Jr = jester.r
        const Jc = jester.c

        const moves = unit_moviment_parts.J.move[0]

        for (let m = 0; m < moves.length; m++) {
            const [dr, dc] = moves[m]

            for (let i = 1; i <= 2; i++) {
                const r = Jr + dr * i
                const c = Jc + dc * i

                const square = board[r][c]
                const isSomeone = Is_anyThere(square)

                if (!isSomeone || (isSomeone && !Is_AllyThere(square, color))) {
                    const key = `${dr},${dc}`
                    const list = sqKey_secondMove_Jester.get(key)

                    // equivalente a spread, mas sem recriar arrays
                    for (let j = 0; j < list.length; j++) {
                        
                        add_mobility(key, r, c, color, 'J', Jr, Jc)
                    }
                } else {
                    if (i === 1) break
                }
            }
        }
    }

}
