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

    console.log('Who:.',get_Attackers(offense[kr][kc][enemy]))

    const Attacks = get_numAttacks(offense[kr][kc][enemy])

    console.log('Quant:.',Attacks)

    const result = Attacks >= 1

    console.log(result)

    return { result, Attacks }
}

function set_Check(color) {

    console.log("Analisando check: ")

    const { result, Attacks } = is_Check(color)

    console.log(playMoveSound)


    if (result) check.play()
    else if (castleSound) castle.play()
    else if (playMoveSound) move.play()

    castle_atives = {}


}