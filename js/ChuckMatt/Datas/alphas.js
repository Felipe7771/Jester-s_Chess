// ================================================
// ================================================
// ! Coeficientes Alpha 
// * Variáveis de incentivo condicional do contexto do jogo

let alphaSPMP = 0.25
let alphaSSMP = 0.5

let theta = 0.6

let tax_PHIwithSucessor = 0.25

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
  b_π: 3,
  b_πAA: 4,
  b_vΔη: 1000,

  b_PS: 1,

  vEPS: 1,
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
// ? Coeficientes Lambda 
// * Peso de cada neurônio

const lambda = {
  lamb_vΔΩη: 6,
  lamb_vPlz: 1,
  lamb_vEP: 3,
  lamb_vCE: 4,
  lamb_vPS: 2,
  lamb_vΔφ: 6,
  lamb_AA: 4,
  lamb_OO: 4,
  lamb_ωDS: 10,
}

// ================================================
// ================================================
// ? Coeficientes Rho 
// * Variáveis de sensibilidade para normalização [-1,+1]

const rho = {

  rh_vΔη: 25,
  rh_vΔΩ: 180,
  rh_vPlzS: 90,

  rh_EP: 18,
  rh_CE: 45,
  rh_PS: 10,

  rh_ξΩ: 15,

  PLZS: 90,
  EMP: 15,
  omega: 180,  // era 20
  eta: 25,     // era 6
  CT: 45,
  PST: 10,
  OT: 45,
  AAT: 45,
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
