function checkCastling(id, team) {
    // console.log(`Castling: ${CastlePermission[team]}`)
    if (!(CastlePermission[team] && kings_castle.has(id))) return
    
    // console.log(`Adicionando Castling`)
    check_Kingside_Castle(id, team)
    check_Queenside_Castle(id, team)
}

function checkBreakCastlePermission(id, color) {
    console.log("verificando QUEBRA DE ROQUE", id)
    if (pieces_castle.has(id)) breakCastlePermission(color)
}

function breakCastlePermission(color) {
    CastlePermission[color] = false
    console.log("QUEBRA DE ROQUE")
}

function check_Kingside_Castle(id_King, team) {
    const check_r = team == 'w' ? 7 : 0
    const enemy = getEnemy(team)

    const cooK = { r: check_r, c: 4 }
    const cooR = { r: check_r, c: 7 }

    const critic_c = new Set([cooK.c, cooR.c])

    let any_problem = false

    for (let dc = cooK.c; dc <= cooR.c; dc++) {
        // console.log(board[check_r][dc].id)
        const is_There = Is_anyThere(board[check_r][dc])
        const num_Atcks = get_numAttacks(offense[check_r][dc][enemy])

        if (!critic_c.has(dc) && is_There) {
            any_problem = true
            break
        } else if (num_Atcks >= 1) {
            any_problem = true
            break
        }
    }

    if (!any_problem) {
        console.log(`Adicionando VERDADEIRO Kingside`)

        attackers[id_King].push([check_r, 6])
        const id_coo = `${check_r}6${team}`

        castle_atives[id_coo] = {
            id: board[check_r][cooR.c].id,
            to_r: check_r,
            to_c: 5,
        }
    }
}

function check_Queenside_Castle(id_King, team) {
    const check_r = team == 'w' ? 7 : 0
    const enemy = getEnemy(team)

    const cooK = { r: check_r, c: 4 }
    const cooR = { r: check_r, c: 0 }

    const critic_c = new Set([cooK.c, cooR.c])

    let any_problem = false

    for (let dc = cooK.c; dc >= cooR.c; dc--) {
        const is_There = Is_anyThere(board[check_r][dc])
        const num_Atcks = get_numAttacks(offense[check_r][dc][enemy])

        if (!critic_c.has(dc) && is_There) {
            any_problem = true
            break
        } else if (num_Atcks >= 1) {
            any_problem = true
            break
        }
    }

    if (!any_problem) {
        console.log(`Adicionando VERDADEIRO`)
        
        attackers[id_King].push([check_r, 2])
        // console.log(attackers[id_King])
        
        const id_coo = `${check_r}2${team}`

        castle_atives[id_coo] = {
            id: board[check_r][cooR.c].id,
            to_r: check_r,
            to_c: 3,
        }
    }
}

function Castling_Move(id, r, c, color) {
    console.log("VENDO CASTLING")
    if (!(CastlePermission[color] && kings_castle.has(id))) return
    
    const id_coo = `${r}${c}${color}`
    
    const Keys = new Set(Object.keys(castle_atives))
    
    if (Keys.has(id_coo)) {
        console.log("EXECUTADO CASTLING")

        castleSound = true;
        const id_Rook = castle_atives[id_coo].id

        const Rr = pieceIndex[id_Rook].r
        const Rc = pieceIndex[id_Rook].c

        const tr = castle_atives[id_coo].to_r
        const tc = castle_atives[id_coo].to_c

        board[Rr][Rc] = {
            id: ``,
            type: '',
            color: '',
            visualKey: null,
        }

        // coloca peça na nova casa
        board[tr][tc] = {
            id: id_Rook,
            type: 'R',
            color: color,
            visualKey: `${color}R`,
        }

        breakCastlePermission(color)

        set_piece_moved(
            id_Rook,
            'R',
            color,
            tr,
            tc,
            Rr,
            Rc,
        )
        set_piece_moved_team(tr, tc, id_Rook, color)

        set_combat_turn()
    }
}
