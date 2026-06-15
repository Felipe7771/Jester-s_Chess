// ================================================
// ================================================
// ! Coeficientes Alpha 
// * Variáveis de incentivo condicional do contexto do jogo

let alphaARMY = 1
let alphaSPMP = 0.8
let alphaSSMP = 0.5

let moved_chuck = {
  id: '',
  step: [],
}
// ================================================
// ================================================

const UPPER_offense = 1.25
const LOWER_defense = 0.85
const DEFAULT_ERROR = 2

// ================================================
// ================================================
// ? Coeficientes Beta 
// * Variáveis de incentivo multiplicativo exclusivo de cada score

const bettaEPS = 1
const bettaAPT = 10
const bettaAAT = 1.5

const bettaOT = 4
const bettaFT = 3

const bettaAST = -10
const bettaCT = 5

const bettaPST = 1

// ================================================
// ================================================
// ? Coeficientes Gamma 
// * Variáveis de incentivo aditivo exclusivo de cada score

const gammaFT = 20

// ================================================
// ================================================

function set_alphaARMY(color, armyAlly) {
    const enemy = get_Enemy(color)

    alphaARMY = 1;

    const num_Ally = countUniqueRC(armyAlly);
    
    let armyEnemy = get_Army(enemy)
    const num_Enemy = countUniqueRC(armyEnemy)

    alphaARMY = num_Enemy == 0? DEFAULT_ERROR: (num_Ally/num_Enemy)

}

function countUniqueRC(dict) {
  const seen = new Set();

  for (const coords of Object.values(dict)) {  // pega cada lista de coordenadas
    for (const [r, c] of coords) {             // desestrutura cada [r, c]
      seen.add(`${r},${c}`);                   // insere no Set (ignora duplicatas)
    }
  }

  return seen.size;
}
