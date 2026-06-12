
/* =========================
   FUNÇÕES UTILITÁRIAS
   ========================= */
   
   /* transforma posição (r,c) em chave única */
function sqKey(r, c) { return r * 8 + c; }

function sqFromKey(key) {
    const r = Math.floor(key / 8);
    const c = key % 8;
    return [r, c];
}

/* calcula o centro geométrico da casa */
function sqCenter(r, c) {
  return { x: c * SQ + SQ / 2, y: r * SQ + SQ / 2 };
}

function cooSet(r, c) {
  return sqKey(r, c);
}

function cooFromSet(key){
  return sqFromKey(key);
}

function set_RandomTeamsAI() {
  const team_ai = Math.floor(Math.random() * 2) ;

  PLAY_TURN.player = team_ai == 1 ? 'b': 'w'
  const PLAYER = team_ai == 1 ? 'black': 'white'

  PLAY_TURN.chuck = team_ai == 1 ? 'w': 'b'
  const CHUCK = team_ai == 1 ? 'white': 'black'

  return [PLAYER, CHUCK]
}

// ==========================
// ! NOTAÇÃO DE MOVIMENTOS XADREZ
// ==========================

function toChessNotation(r, c) {
    const files = 'abcdefgh'

    const file = files[c]
    const rank = 8 - r

    return file + rank
}

// ==========================
// ! TURNOS
// ==========================

function isEndedTurn() {
  if (valueLancesTurn >= LimitValueLance) {
    valueLancesTurn = 0
    chanceTurn()
  }
}


function chanceTurn() {
  id_turn = (id_turn + 1) % 2
  TURN = turns[id_turn]
  encrement_plays++
  plays = Math.floor((encrement_plays + 1)/2) 
}

// ==========================
// ! OPERAÇÕES COM JESTER
// ==========================

function Is_Jester(piece) {
  return piece == 'J'
}
// O Jester está realizando o segundo movimento ?
function Is_JesterSecondMove(piece) {
  return (Is_Jester(piece) && valueLancesTurn == 0.5)
}

// O Jester está realizando o primeiro movimento ?
function Is_JesterFirstMove(piece) {
  return (Is_Jester(piece) && (valueLancesTurn == 0 || valueLancesTurn == 1))
}

// O Jester está tentando capturar no segundo movimento ?
function Is_JesterAttackingInSecondMove(square, drag) {
  return (Is_JesterSecondMove(drag.piece[1]) && Is_anyThere(square))
}

// retorna o indice de movimento para determinar: tipo de movimento e movimentos do Jester
function getJesterMoveIndex() {
  return [0, 1].includes(valueLancesTurn) ? 0 : 1
}

// ==========================
// ! VALIDAÇÃO DE MOVIMENTOS
// ==========================

function Is_OutBoard(r, c) {
  return (r >= 8 || r < 0) || (c >= 8 || c < 0)
}

function Is_InLegalMoves(id, coo) {
  const legal_moves = memory_moves[id].legal || []

  return legal_moves.includes(coo)
}

function Is_InMoves(id, coo) {
  const total_moves = memory_moves[id].total || [];

  return total_moves.some(
    move => move[0] === coo[0] && move[1] === coo[1]
  );
}

function Is_InIllegalMoves(id, coo) {
  const total_moves = memory_moves[id].illegal || [];
  const total_J_moves = memory_moves[id].j_illegal || [];

  if (!total_moves.length && !total_J_moves) return false

  return total_moves.some(
    move => move[0] === coo[0] && move[1] === coo[1]
  ) || total_J_moves.some(
    move => move[0] === coo[0] && move[1] === coo[1]
  );
}

// ==========================
// ! DETECÇÃO DE PRESENÇA
// ==========================

function Is_anyThere(square) {
  return square.id != ''
}

function There_AllyThere(square, team) {
  return Is_anyThere(square) && Is_AllyThere(square, team)
}

function Is_AllyThere(square, team) {
  return square.color == team
}

// ==========================
// ! ANÁLISES OFENSIVAS
// ==========================

function set_piece_moved(id, piece, color, tr, tc, fr, fc) {
  piece_moved = {
    id,
    piece,
    to_r: tr,
    to_c: tc,
    from_r: fr,
    from_c: fc,
    color,
  }
  
}
function get_Moves(id) {
  return attackers[id]
}

function get_Enemy(team) {
  return team == 'w' ? 'b' : 'w'
}

function get_Attackers(square_offense) {
  if (!Array.isArray(square_offense)) return [];

  const seen = new Set();

  return square_offense.filter(attacker => {
    if (!(attacker.id in pieceIndex)) return false;

    if (seen.has(attacker.id)) return false;

    seen.add(attacker.id);
    return true;
  });
}

function get_numAttacks(square_offense) {
  return get_Attackers(square_offense).length
}

// ==========================
// ! OPERAÇÕES COM A REALEZA (King, Queen & Sucessor)
// ==========================

function Have_King(color) {
  const id_king = get_Id_King(color)
  
  return id_king in pieceIndex
}
function Have_Queen(color) {
  const id_queen = get_Id_Queen(color)
  
  return id_queen in pieceIndex
}
function Have_Sucessor(color) {
  const id_sucessor = get_Id_Sucessor(color)

  return id_sucessor in pieceIndex
}
function Have_Jester(color) {
  const id_jester = get_Id_Jester(color)

  return id_jester in pieceIndex
}

function get_Id_King(color) {
  return `${color}K${Complement_Id_Real[color]['K']}`
}
function get_Id_Queen(color) {
  return `${color}Q${Complement_Id_Real[color]['Q']}`
}
function get_Id_Sucessor(color) {
  return `${color}S0`
}
function get_Id_Jester(color) {
  return `${color}J1`
}

// ==========================
// ! OPERAÇÕES COM INTERCEÇÃO DE LISTA DE MOVIMENTOS E MOVIMENTOS FORA DE INTERCEÇÃO
// ==========================

function subtractIntersection(listA, listB) {
    if (!listB) return listA
    if (!listA) return listB
    const setA = new Set(listA.map(([r, c]) => `${r},${c}`))
    const result = []

    for (let i = 0; i < listB.length; i++) {
        const key = `${listB[i][0]},${listB[i][1]}`
        if (!setA.has(key)) {
            result.push(listB[i])
        }
    }

    return result
}

// ==========================
// ! INFLUENCE
// ==========================

function add_influence(id, row, column, color, piece, fromR, fromC) {

  const key = `${id}-${fromR}-${fromC}-${row}-${column}`;

  influence[row][column][color].set(key, {
    id,
    piece,
    r: fromR,
    c: fromC
  });
}

// ==========================
// ! OFFENSE & MOBILITY
// ==========================

function add_offense(id, row, column, color, piece, fromR, fromC) {
  offense[row][column][color].push({
    id,
    piece,
    r: fromR,
    c: fromC
  });

  add_influence(id, row, column, color, piece, fromR, fromC)

  const content = {
    id,
    r: row,
    c: column,
    color,
  }

  if (offenseIndex[id]) offenseIndex[id].push(content)
  else offenseIndex[id] = [content]
}


function add_mobility(id, row, column, color, piece, fromR, fromC) {
  mobility[row][column][color].push({
    id,
    piece,
    r: fromR,
    c: fromC
  });

  add_influence(id, row, column, color, piece, fromR, fromC)

  // console.log('-> ', row, column)
  // console.log(row, column)
  if (attackers[id]) attackers[id].push([row, column])
  else attackers[id] = [[row, column]]
}


function add_offense_mobility(id, row, column, color, piece, fromR, fromC) {

  add_offense(id, row, column, color, piece, fromR, fromC)
  add_mobility(id, row, column, color, piece, fromR, fromC)
}

// ==========================
// ! PIECE TEAM
// ==========================

function add_piece_team(row, column, color, piece, id) {
  const PART = {
    id,
    piece,
    r: row,
    c: column
  }

  team[color].push(PART)
  pieceIndex[id] = PART

}


function set_piece_moved_team(to_r, to_c, id, color) {
  const indx = team[color].findIndex(piece => piece.id === id);

  team[color][indx]['r'] = to_r
  team[color][indx]['c'] = to_c

  pieceIndex[id]['r'] = to_r
  pieceIndex[id]['c'] = to_c
}

function getTeam(color) {
    const result = {};

    for (const id in pieceIndex) {
        if (id[0] === color) {
            result[id] = pieceIndex[id];
        }
    }

    return result;
}

// ==========================
// ! INSTANCIMENTO
// ==========================

function set_initial_team() {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      
      let content = board[r][c]
      
      console.log(content)
      
      if (content.id != '') {
        
        add_piece_team(r, c, content.color, content.type, content.id)
      }
    }
  }
}
