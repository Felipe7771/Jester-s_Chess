const canvas = document.getElementById("arrow-canvas")

const UI = {
    config: {
        SQ: 72,
        default_velocity: 60,
        default_animation: "ease",
    },

    imgs: {
        pieces: {
            wK: 'img/icy_sea/w/wk.png',
            wQ: 'img/icy_sea/w/wq.png',
            wS: 'img/icy_sea/w/ws.png',
            wJ: 'img/icy_sea/w/wj.png',
            wR: 'img/icy_sea/w/wr.png',
            wB: 'img/icy_sea/w/wb.png',
            wN: 'img/icy_sea/w/wn.png',
            wP: 'img/icy_sea/w/wp.png',
            bK: 'img/icy_sea/b/bk.png',
            bQ: 'img/icy_sea/b/bq.png',
            bS: 'img/icy_sea/b/bs.png',
            bJ: 'img/icy_sea/b/bj.png',
            bR: 'img/icy_sea/b/br.png',
            bB: 'img/icy_sea/b/bb.png',
            bN: 'img/icy_sea/b/bn.png',
            bP: 'img/icy_sea/b/bp.png',
        },

        player: {
            w: 'img/playerw.png',
            b: 'img/playerb.png'
        },

        p_captured: {
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
        },

        p_fallback: {
            wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙',
            bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟',
        }
    },

    dom: {
        boardEl: document.getElementById("board"),
        canvas: document.getElementById("arrow-canvas"),
        ctx: canvas.getContext('2d'),
    },

    state: {
        moveCircles: new Set(),
        moveRings: new Set(),

        redSquares: new Set(),
        yellowSquares: new Set(),

        arrows: [],
        squares: [],
    },

    audio: {
        enabled: {
            playMoveSound: false,
            castleSound: false,
        },

        sounds: {
            take:       new Audio('./sounds/capture.mp3'),
            move:       new Audio('./sounds/move-self.mp3'),
            start:      new Audio('./sounds/game-start.mp3'),
            checkmate:  new Audio('./sounds/game-end.mp3'),
            promote:    new Audio('./sounds/promote.mp3'),
            check:      new Audio('./sounds/move-check.mp3'),
            castle:     new Audio('./sounds/castle.mp3'),
            invalid:    new Audio('./sounds/illegal.mp3'),

            hahah:      new Audio('./sounds/hahah.mp3'),
            died:       new Audio('./sounds/last_words.mp3'),
        }
    }
}

let LIST_NOTATION = [];

const MaterialValue = {
  P: 1,
  N: 3,
  B: 3,
  R: 5,
  J: 4,
  Q: 9,
  S: 11,
  K: 20
}

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
const sucession = new Set(['K', 'S'])
const promotions = ['J', 'R', 'B', 'N'];
const insufficient = new Set(['B','N'])

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
  { id: `${color}P7`, type: "P", color, visualKey: `${color}P` },
  { id: `${color}P8`, type: "P", color, visualKey: `${color}P` },
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
  { id: `${color}S0`, type: "S", color, visualKey: `${color}S` },
  { id: `${color}B0`, type: "B", color, visualKey: `${color}B` },
  { id: `${color}Q`, type: "Q", color, visualKey: `${color}Q` },
  { id: `${color}K`, type: "K", color, visualKey: `${color}K` },
  { id: `${color}B1`, type: "B", color, visualKey: `${color}B` },
  { id: `${color}J1`, type: "J", color, visualKey: `${color}J` },
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

let plays = 1
let encrement_plays = 1

let total_moves_TURN = 0

let generate_id_pieces = 10 // evitar duplicação de peças

let TURN = 'w'
const turns = ['w', 'b', 'w']
let id_turn = 0

let RUN_GAME = true
let PLAY_TURN = {player: '', chuck: ''}

let RUN_CHUCKMATT = false
let PLAYING_WITH_CHUCKMATT = false

const LimitValueLance = 1
const LimitNoMoves = 50

let mouseDownPos = null
const DRAG_THRESHOLD = 5 // pixels de tolerância

// ?============================


// ! CONTADORES
// ?============================

let valueLancesTurn = 0

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

let MATERIAL_COLETED = {
  w: 0,
  b: 0,
}

let count_no_moves = 0

// ?============================


// ! MEMÓRIAS
// ?============================

let memory_moves = {}
let memory_checkmate = false
let memory_castling = []

// ?============================


// ! CONFIGURAÇÕES DE XEQUE-MATE
// ?============================

let CHECKMATE = false
let DRAW = false
let END_GAME = false

let VISUAL_check = {
  'w': false,
  'b': false
}

let CHECKpin = {
  'w': false,
  'b': false
}

let permited_block_check = {}
let Check_escape_moves = {}

let JesterFirstMoveBySecondMove = {}

// ?============================


// ! CONFIGURAÇÕES DE JOKEMOVE
// ?============================

let JOKEMOVE = {
  w: false,
  b: false,
}
let JOKER = {
  w: '',
  b: '',
}
let KINGER = {
  w: '',
  b: '',
}
let SADSQUARE = {
  w: '',
  b: '',
}
let LAUGHTER = {
  w: new Set(),
  b: new Set(),
}

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

let team_pieces = {
  w: [],
  b: [],
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
  Array.from({ length: 8 }, () => (new Map()))
);

let pawnMemory = Array.from({ length: 8 }, () =>
  Array.from({ length: 8 }, () => (new Set()))
);

// ?============================


// ! BUSCAR DERIVADAS DO TABULEIRO
// ?============================

let pieceIndex = {}
let attackers = {}
let pieceEffects = new Map();
let offenseIndex = {}
let mobilityIndex = {}
let pawnMemoIndex = {}

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


// ! DRAG
// ?============================

// guarda origem do arraste com botão direito
let rightDragFrom = null;

let drag = null          // só existe se de fato começou a arrastar (ghost criado)

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

