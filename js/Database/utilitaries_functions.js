
/* =========================
   FUNÇÕES UTILITÁRIAS
   ========================= */

/* transforma posição (r,c) em chave única */
function sqKey(r, c) { return r * 8 + c; }

/* calcula o centro geométrico da casa */
function sqCenter(r, c) {
  return { x: c * SQ + SQ / 2, y: r * SQ + SQ / 2 };
}

function isEndedTurn() {
  if (valueLancesTurn >= LimitValueLance) {
    valueLancesTurn = 0
    chanceTurn()
  }
}


function chanceTurn() {
  id_turn = (id_turn + 1) % 2
  TURN = turns[id_turn]
}


function Is_Jester(piece) {
  return piece == 'J'
}
// O Jester está realizando o segundo movimento ?
function Is_JesterSecondMove(piece) {
  return (Is_Jester(piece) && valueLancesTurn == 0.5)
}

// O Jester está realizando o primeiro movimento ?
function Is_JesterFirstMove(piece) {
  return (Is_Jester(piece) && valueLancesTurn == 0)
}

// O Jester está tentando capturar no segundo movimento ?
function Is_JesterAttackingInSecondMove(square, drag) {
  return (Is_JesterSecondMove(drag.piece[1]) && Is_anyThere(square))
}


// retorna o indice de movimento para determinar: tipo de movimento e movimentos do Jester
function getJesterMoveIndex() {
  return [0, 1].includes(valueLancesTurn) ? 0 : 1
}

function get_Moves(id) {
  return attackers[id]
}

function Is_anyThere(square) {
  return square.id != ''
}

function Is_AllyThere(square, team) {
  return square.color == team
}

function Is_OutBoard(r, c) {
  return (r >= 8 || r < 0) || (c >= 8 || c < 0)
}

function add_offense_mobility(id, row, column, color, piece, fromR, fromC) {

  add_offense(id, row, column, color, piece, fromR, fromC)
  add_mobility(id, row, column, color, piece, fromR, fromC)
}

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

  console.log('-> ', row, column)
  // console.log(row, column)
  if (attackers[id]) attackers[id].push([row, column])
  else attackers[id] = [[row, column]]
}

function add_influence(id, row, column, color, piece, fromR, fromC) {

  const key = `${id}-${fromR}-${fromC}-${row}-${column}`;

  influence[row][column][color].set(key, {
    id,
    piece,
    r: fromR,
    c: fromC
  });
}


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

function Have_Sucessor(color) {
  const id_sucessor = `${color}S0`

  return id_sucessor in pieceIndex
}

function Have_Sucessor(color) {
  const id_sucessor = get_Id_Sucessor(color)

  return id_sucessor in pieceIndex
}

function Have_King(color) {
  const id_king = get_Id_King(color)

  return id_king in pieceIndex
}

function get_Id_Sucessor(color) {
  return `${color}S0`
}
function get_Id_Queen(color) {
  return `${color}Q${Complement_Id_Real[color]['Q']}`
}
function get_Id_King(color) {
  return `${color}K${Complement_Id_Real[color]['K']}`
}

function Have_Queen(color) {
  const id_queen = get_Id_Queen(color)

  return id_queen in pieceIndex
}

function get_Enemy(team) {
  return team == 'w' ? 'b' : 'w'
}

function get_Attackers(square_offense) {
  return Array.isArray(square_offense)
    ? square_offense.filter(attacker => attacker.id in pieceIndex)
    : []
}

function get_numAttacks(square_offense) {
  return get_Attackers(square_offense).length
}
