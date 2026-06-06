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

         console.log("Inimigo: ", Enemie.id, "Tipo de peça: ", Enemie.piece)
         console.log("Tipo de movimento da peça: ", unit_moviment_parts[Enemie.piece].type_move)
        if(unit_moviment_parts[Enemie.piece].type_move != 'linear') {
            if (index == Length-1) {
                alone = false
            }
            continue
        }

         console.log(">> O inimigo é linear")

        const Er = Enemie.r, Ec = Enemie.c

        const drE = Er - pr, dcE = Ec - pc
        const typeM_Enemie = get_type_move(drE, dcE);

         console.log("Enemie: ", Enemie.id, "Tipo de movimento: ", typeM_Enemie)
         console.log("Estão na mesma linha? ", typeM_Enemie === typeM_King)
        
        if (typeM_Enemie !== typeM_King) {
            if (index == Length-1) {
                alone = false
            }
            continue
        }

         console.log(">> O inimigo está na mesma direção do rei")
        
        const UdrE = Math.sign(drE);
        const UdcE = Math.sign(dcE);

         console.log("Unidade Enemie: ", UdrE, UdcE)
         console.log("Unidade King: ", UdrK, UdcK)

         console.log("São opostos? ", UdrE === -UdrK && UdcE === -UdcK)

        if (UdrE !== -UdrK || UdcE !== -UdcK) {
            if (index == Length-1) {
                alone = false
            }
            continue
        }

         console.log(">> O inimigo está na linha do rei")

        const UdrEK = Math.sign(Kr - Er);
        const UdcEK = Math.sign(Kc - Ec);

        id_attacker = Enemie.id

        const max_len = freq_move[unit_moviment_parts[Enemie.piece].type_move]

        console.log("Verificando casas entre o inimigo e o rei, max len: ", max_len)

        for (let len = 1; len <= max_len; len++) {

            r = Er + UdrEK*len;
            c = Ec + UdcEK*len;

             console.log("Verificando casa: ", r, c)
            if (Is_OutBoard(r, c) || (r == Kr && c == Kc)) break

            const square = board[r][c]

             console.log("Está ocupada? ", Is_anyThere(square))
             console.log("Peça ali? ", square.id)
             console.log("Peça em análise? ", id)
             console.log("São iguais? ", square.id === id)
             console.log("Continuar? ", Is_anyThere(square) && square.id !== id)

            if (Is_anyThere(square) && square.id !== Piece.id) {
                console.log(">> Encontrada peça entre o inimigo e o rei")
                alone = false
                break
            }

            console.log(">> Casa livre entre o inimigo e o rei")

        }

        break
    }

    return [alone, id_attacker]

}

function get_type_move(dr, dc) {
    const produt = Math.abs(dr*dc)

     console.log("Produto: ", produt)
     console.log("dr: ", dr, "dc: ", dc)
     console.log("Tipo: ",!produt ? 'orthogonal' : (produt == dr*dr || produt == dc*dc ? 'diagonal' : 'no_line'))

    if (!produt) {
        return 'orthogonal';
    } else if (produt == dr*dr || produt == dc*dc) {
        return 'diagonal';
    } else {
        return 'no_line'
    }
}

function set_PiecePin(id, color) {
    if (Is_Jester(id[1])) return []

    const [pin, id_attacker] = Is_pin(id, color)
    const formatMove = ([r, c]) => `[${r}, ${c}]`


    console.log('Está cravado? ', pin)

    if (pin) {
        // os únicos movimentos possíveis da peça cravada são aqueles que eliminam o atacante SE tiver nos attackers[id]

        console.log('Atacantes: ', `[ ${(attackers[id] || []).map(formatMove).join(', ')} ]`,)
        
        const moves_pins = []

        if (!attackers[id] || !attackers[id].length) return [] 
        
        for (const offend of attackers[id]) {
            const square = board[offend[0]][offend[1]]
            // console.log('Analisando ofensores: ', offend[0], offend[1], square.id, id_attacker)
            if (square.id !== id_attacker) {
                moves_pins.push([offend[0], offend[1]])
            }
        }
        
        // console.log('Cravados: ', `[ ${(moves_pins || []).map(formatMove).join(', ')} ]`,)
        return moves_pins
    } else return []
}