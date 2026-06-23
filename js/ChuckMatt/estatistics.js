function calcule_InitialEstatistics(PART, color, enemy) {
    const p = PART.piece
    const from_r = PART.r
    const from_c = PART.c

    const kappa0_NAS =               Calcule_κ(from_r, from_c, enemy)
    const [omega0_MAOS, SV, SD] =    Calcule_Ω(from_r, from_c, PART, color, kappa0_NAS)

    const DPS = EPS[PART.piece] * betta.EPS

    return {DPS, kappa0_NAS, omega0_MAOS}
}

/**
 * ! η - eta
 * ? Mean Control Table Scale
 *
 */
function Calcule_η(color) {
    const enemy = get_Enemy(color)
    let total = 0;
    
    let ally = 0;
    let enemy_total = 0;

    for (let r = 0; r < 8; r++) {

        for (let c = 0; c < 8; c++) {
            const sq = offense[r][c];

            // controle da casa
            ally += offense[r][c][color]?.length ?? 0;
            enemy_total += offense[r][c][enemy]?.length ?? 0;

            total += (sq[color]?.length ?? 0) - (sq[enemy]?.length ?? 0);

            // peça ocupando a casa
            const piece = board[r][c];
            if (Is_anyThere(piece)) {
                total += piece.color === color
                    ? MaterialValue[piece.type]
                    : -MaterialValue[piece.type];
                    
            }
        }
    }

    console.log({
        ally,
        enemy: enemy_total,
        diff: ally - enemy_total
    });

    return total / 64;

}

/**
 * Versão "barra de avaliação": η normalizado em -1..+1 e em % de favorabilidade.
 * scale controla a sensibilidade — quanto menor, mais rápido a barra satura.
 */
function Calcule_normalize_η(color, scale = 5) {
    const eta = Calcule_η(color);
    // const eta = 0;
    const normalized = Math.tanh(eta / scale);
    const percent = (normalized + 1) / 2 * 100; // 0% = domínio total inimigo, 100% = domínio total aliado

    return { eta, normalized, percent };
}

function Normalization(estatistic, rho) {
    console.log('estatist: ',estatistic)
    console.log('rho: ',rho)
    return Math.tanh(estatistic/ rho)
}

// ! κ - kappa
// ? Number Attackers Square

function Calcule_κ(r, c, enemy) {
    const offend = offense[r][c]

    return get_numAttacks(offend[enemy])
}

// ! Ω - omega
// ? Material Advantage Over Square

function Calcule_Ω(r, c, PART, color, kappa) {
    function Sum_V_teams(offend, color, ChuckTEAM) {
        let sum = 0
        for (const part of offend[color])
            sum +=
                color === ChuckTEAM
                    ? VPS_ally[part.piece]
                    : VPS_enemy[part.piece]

        return sum
    }

    const V_moved_piece = VPS_ally[PART.piece]
    const enemy = get_Enemy(color)
    const offend = offense[r][c]

    let Sum_V_defenders = Sum_V_teams(offend, color, color)
    let Sum_V_attackers = Sum_V_teams(offend, enemy, color)
    
    const Ω = Sum_V_defenders - (Sum_V_attackers + (Math.sign(kappa) * V_moved_piece))
    
    return [Ω, V_moved_piece, Sum_V_defenders]
}

// ! σ - sigma
// ? Loss Ally Material Punishment

function Calcule_σ(r, c, color, V_moved_piece, Sum_V_defenders, kappa) {

    return (-1) * Math.sign(kappa) * (Sum_V_defenders + V_moved_piece)
}
