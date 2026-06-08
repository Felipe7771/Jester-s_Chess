/* =========================
   MAPA DAS PEÇAS (símbolos Unicode)
   Cada código representa uma peça no tabuleiro
   ========================= */
const PIECES = {
  wK: 'img/w/wk.png',
  wQ: 'img/w/wq.png',
  wS: 'img/w/ws.png',
  wJ: 'img/w/wj.png',
  wR: 'img/w/wr.png',
  wB: 'img/w/wb.png',
  wN: 'img/w/wn.png',
  wP: 'img/w/wp.png',
  bK: 'img/b/bk.png',
  bQ: 'img/b/bq.png',
  bS: 'img/b/bs.png',
  bJ: 'img/b/bj.png',
  bR: 'img/b/br.png',
  bB: 'img/b/bb.png',
  bN: 'img/b/bn.png',
  bP: 'img/b/bp.png',
};

const type = {
  pawn: 'P',
  knight: 'N',
  bishop: 'B',
  rook: 'R',
  jester: 'J',
  sucessor: 'S',
  queen: 'Q',
  king: 'K'
}

const name_pieces = {
  P: "pawn",
  N: 'knight',
  B: "bishop",
  R: 'rook',
  J: 'jester',
  S: 'sucessor',
  Q: 'queen',
  K: 'king',
}

const pieces_one_step = new Set(['N', 'K', 'S', 'P'])
const promotions = ['J', 'R', 'B', 'N'];

const pieces_castle = new Set(['wK', 'bK', 'wR0', 'wR1', 'bR0', 'bR1']);
const kings_castle = new Set(['wK', 'bK'])

/* =========================
   POSIÇÃO INICIAL DO TABULEIRO
   Matriz 8x8 representando peças e casas vazias
   ========================= */
const pawnRow = (color) => [
  { id: `${color}P1`, type: "P", color, visualKey: `${color}P` },
  { id: `${color}P2`, type: "P", color, visualKey: `${color}P` },
  { id: `${color}P3`, type: "P", color, visualKey: `${color}P` },
  { id: `${color}P4`, type: "P", color, visualKey: `${color}P` },
  { id: `${color}P5`, type: "P", color, visualKey: `${color}P` },
  { id: `${color}P6`, type: "P", color, visualKey: `${color}P` },
  { id: `${color}P8`, type: "P", color, visualKey: `${color}P` },
  { id: `${color}P7`, type: "P", color, visualKey: `${color}P` },
];

const knightRow = (color) => [
  { id: `${color}N0`, type: "N", color, visualKey: `${color}N` },
  { id: ``, type: "", color: "", visualKey: null },
  { id: ``, type: "", color: "", visualKey: null },
  { id: ``, type: "", color: "", visualKey: null },
  { id: ``, type: "", color: "", visualKey: null },
  { id: ``, type: "", color: "", visualKey: null },
  { id: ``, type: "", color: "", visualKey: null },
  { id: `${color}N1`, type: "N", color, visualKey: `${color}N` },
];

const backRow = (color) => [
  { id: `${color}R0`, type: "R", color, visualKey: `${color}R` },
  { id: `${color}B0`, type: "B", color, visualKey: `${color}B` },
  { id: `${color}S0`, type: "S", color, visualKey: `${color}S` },
  { id: `${color}Q`, type: "Q", color, visualKey: `${color}Q` },
  { id: `${color}K`, type: "K", color, visualKey: `${color}K` },
  { id: `${color}J1`, type: "J", color, visualKey: `${color}J` },
  { id: `${color}B1`, type: "B", color, visualKey: `${color}B` },
  { id: `${color}R1`, type: "R", color, visualKey: `${color}R` }
];

const emptyCell = () => ({
  id: "",
  type: "",
  color: "",
  visualKey: null
});

const emptyRow = () =>
  Array.from({ length: 8 }, () => emptyCell());

const INIT_BOARD = [
  backRow("b"),
  pawnRow("b"),
  knightRow("b"),
  emptyRow(),
  emptyRow(),
  knightRow("w"),
  pawnRow("w"),
  backRow("w")
];

// ! CONFIGURAÇÕES GLOBAIS
// ?============================
// ?============================

let generate_id_pieces = 10 // evitar duplicação de peças

let TURN = 'w'
const turns = ['w', 'b', 'w']
let id_turn = 0

const LimitValueLance = 1
let valueLancesTurn = 0

let memory_moves = {}

let Complement_Id_Real = {
  'w': {
    'K': '',
    'Q': ''
  },

  'b': {
    'K': '',
    'Q': ''
  }
}

// ?============================


// ! CONFIGURAÇÕES DE XEQUE-MATE
// ?============================

let CHECKMATE = false
let END_GAME = false

let memory_checkmate = false

let VISUAL_check = {
  'w': false,
  'b': false
}

let permited_block_check = {}

// ?============================


// ! CONFIGURAÇÕES DE CASTLING
// ?============================

let CastlePermission = {
  w: true,
  b: true
}

let castle_atives = {}

// ?============================


// ! TABULEIROS DINÂMICOS
// ?============================

let team = {
  w: [],
  b: []
}

// cópia mutável do tabuleiro atual
let board = INIT_BOARD.map(r => [...r]);

let offense = Array.from({ length: 8 }, () =>
  Array.from({ length: 8 }, () => ({
    w: [],
    b: []
  }))
);

let mobility = Array.from({ length: 8 }, () =>
  Array.from({ length: 8 }, () => ({
    w: [],
    b: []
  }))
);

let influence = Array.from({ length: 8 }, () =>
  Array.from({ length: 8 }, () => ({
    w: new Map(),
    b: new Map()
  }))
);

// ?============================


// ! BUSCAR DERIVADAS DO TABULEIRO
// ?============================

let pieceIndex = {}
let attackers = {}
let pieceEffects = new Map();
let offenseIndex = {}

let piece_moved = {
  id: '',
  piece: '',
  to_r: null,
  to_c: null,
  from_r: null,
  from_c: null,
  color: ''
}

// ?============================


// ! ARMAZENAMENTO DE VISUAIS
// ?============================

/* tamanho de cada casa */
const SQ = 72;

/* elementos DOM principais */
const boardEl = document.getElementById('board');
const canvas = document.getElementById('arrow-canvas');
const ctx = canvas.getContext('2d');

const moveCircles = new Set();
const moveRings = new Set();

// conjunto de casas marcadas em vermelho
let redSquares = new Set();
let yellowSquares = new Set();
let endGame = new Set();

// lista de setas desenhadas
// cada seta: {fr, fc, tr, tc}
let arrows = [];

// referência das casas DOM (uso futuro/otimização)
let squares = [];

// ?============================


// ! DRAG
// ?============================

// guarda origem do arraste com botão direito
let rightDragFrom = null;

let drag = null;
/*
{
  piece,
  fromR,
  fromC,
  ghost
}
*/

let global_drag = null;

// ?============================


// ! AUDIO
// ?============================

const take = new Audio('./sounds/capture.mp3')
const move = new Audio('./sounds/move-self.mp3')
const start = new Audio('./sounds/game-start.mp3')
const checkmate = new Audio('./sounds/game-end.mp3')
const promote = new Audio('./sounds/promote.mp3')
const check = new Audio('./sounds/move-check.mp3')
const castle = new Audio('./sounds/castle.mp3')
const invalid = new Audio('./sounds/illegal.mp3')
const hahah = new Audio('./sounds/hahah.mp3')
const died = new Audio('./sounds/last_words.mp3')

let playMoveSound = false;
let castleSound = false;

