// ================================================
// ================================================
// ! Coeficientes Alpha 
// * Variáveis de incentivo condicional do contexto do jogo

let alphaARMY = 1
let alphaSPMP = 0.25
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

const betta = {
  EPS: 1,
  EMP: 3,      // era 4, leve redução
  omega: 7,
  eta: 4,      // era 5, leve redução (pois rho.eta vai compensar com mais gradação)
  CT: 8,       // era 6, captura direta com mais peso
  PST: 12,
  OT: 8,       // era 10
  AAT: 10,     // era 6 — mas SEM multiplicar por APT
  APT: 10,     // deixa reservado/decida o que fazer com ele
  PLZS: 4      // NOVO
}

// ================================================
// ================================================
// ? Coeficientes Gamma 
// * Variáveis de incentivo aditivo exclusivo de cada score

const gammaFT = 20

let theta = 0.6
// ================================================
// ================================================
// ? Coeficientes Rho 
// * Variáveis de sensibilidade para normalização [-1,+1]

const rho = {
  PLZS: 90,
  EMP: 15,
  omega: 180,  // era 20
  eta: 25,     // era 6
  CT: 45,
  PST: 10,
  OT: 45,
  AAT: 45,
}


function set_alphaARMY(color, armyAlly) {
  const enemy = get_Enemy(color)

  alphaARMY = 1;

  const num_Ally = countUniqueRC(armyAlly);

  let armyEnemy = get_Army(enemy)
  const num_Enemy = countUniqueRC(armyEnemy)

  alphaARMY = num_Enemy == 0 ? DEFAULT_ERROR : (num_Ally / num_Enemy)

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
