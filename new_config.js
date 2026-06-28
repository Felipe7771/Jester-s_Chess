
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

const UI = {
    config: {
        SQ: 72,
        default_velocity: 60,
        default_animation: "ease",
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
        endGame: new Set(),

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