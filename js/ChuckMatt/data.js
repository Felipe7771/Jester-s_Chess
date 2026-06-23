let VPS_ally = {
    P: 10,
    N: 30,
    B: 30,
    J: 40,
    R: 50,
    Q: 90,
    K: 200,
    S: 500
}

let VPS_enemy = {
    P: 10,
    N: 30,
    B: 30,
    J: 40,
    R: 50,
    Q: 90,
    K: 200,
    S: 500
}

const EPS = {
    P: 5,
    N: 4,
    B: 4,
    J: 3,
    R: 3,
    Q: 2,
    K: 2,
    S: 1
}

let id_AlreadyPlay = ''
const taxAlreadyPlay = 0.6

const PLZpawns = new Set(['P'])
const PLZdefenders = new Set(['K','S'])
const PLZattackers = new Set(['N','B','R','J','Q'])

function set_initialChuckMatt(color_CM) {
    // ! criando plazas padrões
    Pawn_plaza = plazaPawns(color_CM)
    Defenders_plaza = plazaDefenders()
    Default_Attackers_plaza = plazaDefaultAttackers()

    // ! setando cor padrão do ChuckMatt
    CMcolor = color_CM
}

function set_setupScore() {
    PLZS = 0 // Plaza Score
    VPS = 0 // Value piece score
    APS = 0 // Attacked piece score
    EPS = 0 // Exposed piece score
    AST = 0 // attackedSquareTax
    OPT = 0 // offensePieceTax
    PST = 0 // pawnStructureTax
    KST = 0 // kingSquareTax
    DST = 0 // defenseSquareTax
    AAT = 0 // allyAssistTax
    CT = 0 // captureTax
}
 
function get_Army(color) {

    const army = getTeam(color)
    // 3. pegar todos os movimentos possíveis
    for (const id_piece of Object.keys(army)) set_MemoryMoves(id_piece, color)

    // 4. liste-os em um dicionario mais eficiente
    let armyMoves = {}
    for (const id of Object.keys(memory_moves)) armyMoves[id] = memory_moves[id].legal

    return armyMoves
}
