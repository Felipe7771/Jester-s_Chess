function Calcule_Score(id, PART, color, enemy, r, c, Ω0, Ψ, φ0) {

    /**
     * * Ω        - Omega value
     * * σ        - Sigma value
     * * κ        - Kappa value
     * * η        - Eta value
     * * φ        - Phi value
     * * ξ        - Xi value
     * 
     * * λ        - Lambda value
     * * Ψ        - Psi value (initial η)
     * 
     * ! [-1, +1] value normalization
     * ? νPLZscore      - Plaza score
     * ? vEP            - Emergent Piece score
     * ? vΔΩ            - Diff Omega score
     * ? vΔη            - Diff Eta score
     * ? vΔΩη (PIfM)    - Positive Incentive for Moviment score
     * ? vCE            - Capture Enemy score
     * ? vPS            - Pawn Struture score
     * ? vAA            - Assistence Ally score
     * ? vOO            - Opressive Offense score
     * ? vΔφ            - Diff Phi score
     * 
     * ! [-infinity OR +infinity] value 
     * ? ωCM            - Checkmate power
     * ? ωDS            - Dead Sucessor power
     */

    // por enquanto, manter nulo enquando não feito
    const ωCM = 0
    const ωDS = 0

    const κ =                   Calcule_κ (r, c, enemy)
    const [Ω, vPiece, ΣvDef] =  Calcule_Ω (r, c, PART, color, κ);
    const sigma =               Calcule_σ (r, c, color, vPiece,ΣvDef, κ)
    const η =                   Calcule_η (color)

    const vδΩ = (Ω0 - Ω)
    const vΔη = Normalization ( betta.b_vΔη * (Ψ - η), rho.rh_vΔη)
    const vΔΩ = Normalization ( Math.sign(vδΩ) * (vδΩ**2) + sigma, rho.rh_vΔΩ )

    /**
     * * Positive Incentive for Moviment score
     * ? PIfM (vΔΩη) determina quanto o movimento é seguro e que avança o jogo a favor
     * ? do time
     * 
     * Junta tanto o pontencial de troca daquela casa quanto o progresso ofensivo 
     * do tabuleiro
     */
    const vΔΩη = vΔΩ + vΔη

    /**
     * * Plaza score
     * ? Plaza determina o quão interessante a aquela casa pode ser 
     * ? dependendo do tipo da peça
     * 
     * ? -- DEFENSORES: Rei e Sucessor
     * ?        >> Quinas do mapa
     * 
     * ? -- ATACANTES: Bispo, Cavalo, Torre, Jester e Rainha
     * ?        >> Centro do mapa & casas próximas ao Rei inimigo
     * 
     * ? -- PEÕES: Peões
     * ?        >> Ao centro das colunas & mais próximo do campo inimigo
     * 
     * A Plaza APENAS TEM SENTIDO se e apenas se á uma defesa positiva (@param {vΔΩ})
     */
    const Plz  = calcule_PLZS (PART.piece, r, c) * vΔΩ
    const vPlz = Normalization ( PlzS, rho.rh_vPlzS )


    /**
     * * Emergent Piece score
     * ? EP determina o quão importante é mover essa peça, provavelmente está sendo
     * ? atacada
     * 
     * O determinante melhor é o @param {-1*Ω0}, pois descreve o comportamento da posição, se @param {Ω0} > 0, não considerar nada para não desfavorecer.
     * ! Para o APLICAMENTO DE PESOS:
     * @neuron_EP = (@vEP + 1 * @Emergent )² * @weight
     * 
     */
    const Emergent = (Ω0 >= 0)? (0): (1)
    const vEP = Emergent? Normalization ( -Ω0+vPiece , rho.rh_EP ): (0)


    /**
     * * Capture Enemy score
     * ? CE determina um apoio para captura de peças inimigas
     * 
     * O melhor composto trata-se de @material_enemy (ao quadrado), @param {Ω} e @param {σ}, pois o pontencial de material deve se levado em conta junto PRINCIPALMENTE se for uma captura interessante
     */
    let vCE = 0

    if (There_AllyThere(square, enemy)) {
        const piece_CT = square.type

        CE = (VPS_enemy[piece_CT]**2) + (Ω + sigma)
        vCE = Normalization ( CE, rho.rh_CE )
    }


    /**
     * * Pawn Structure score
     * ? PS determina um bonus para peões caso o avanço deste crie uma estrutura de peões
     * 
     * Analise feita pelo movimento padrão de @bishop_move para uma casa só, olhando as
     * diagonais, cada peão aliado incrementa @pawn_material * @weight 
     */
    let vPS = 0
    if (PART.piece == 'P') {
        const moves = unit_moviment_parts.B.move
        let PS = 0

        for (const [dr, dc] of moves) {
            const ddr = r + dr
            const ddc = c + dc

            if (Is_OutBoard(ddr, ddc)) continue

            const diagonal_square = board[ddr][ddc]

            if (
                There_AllyThere(diagonal_square, color) &&
                diagonal_square.type == 'P'
            ) {
                PS += MaterialValue.P * betta.b_PS
            }
        }

        vPS = Normalization(PST, rho.rh_PS)
    }

    const {φ, vΔφ, AA, OO} = Calcule_ScoresOf_Moviment(id, PART, color, enemy, r, c, Ω,sigma,κ, φ0)

    const Score = calcule_Neurons(vΔΩη, vPlz, vEP, vCE, vPS, vΔφ, AA, OO, ωCM, ωDS)

    return [Score, vΔΩη, vPlz, vEP, vCE, vPS, vΔφ, AA, OO, ωCM, ωDS]
}

function Calcule_ScoresOf_Moviment(id,PART, color, enemy, r, c, Ω, sigma,κ,φ0) {

    const backup = createBackup()

    make_theoretical_move(id, PART.piece, color, PART.r, PART.c, r, c)
    set_MemoryMoves(id, color)

    
    /**
     * * Diff Phi score
     * ? Δφ determina o acréssimo de controle perante o rei inimigo
     * 
     * A aplicação serve mais para o fim de jogo, mas pode ser usado,
     * logo, @Have_EnemySucessor é verdadeiro, vale por 
     * @tax_PHIwithSucessor , falso vale por 1. Devido a aplicabilidade
     * para o xeque-mate, Seu @weight é MUITO ALTO
     * 
     * Adendo, o emcremento dado por @param {Δφ} só faz sentido SE E APENAS SE
     * não há ataques no quadrado, se houver, há uma grande penalização, assim 
     * como baixa defesa na casa
    */
    const φ = Calcule_φ(color, id, enemy)
    const PhiApply = Have_Sucessor(enemy)? tax_PHIwithSucessor: 1

    const ξκ = 1/((1+κ)**(betta.b_π))
    const ξΩ = Ω < 0 ? 0: 1+Normalization(μ(Ω+1), rho.rh_ξΩ)

    const vΔφ = (φ0 - φ)*(PhiApply)*(ξκ)*(ξΩ)


    /**
     * * Assistence Ally score
     * ? AA determina o bônus ao proteger peças aliadas ao realizar o movimento
     * 
     * Auxiliar peças soltas é importante, Assistence Ally é a soma dos valores
     * das peças ao quadrado para intensificar ajuda, contudo, a assistencia só
     * faz sentido SE E APENAS SE @param {ξκAA} e @param {ωΩ}, pois descrevem o
     * comportamento daquela casa, e é necessário proteção também ao protetor
     */
    const ξκAA = 1/((1+κ)**(betta.b_πAA))
    const ωΩ = ω(Ω+1)
    let AA = 0


    /**
     * * Opresive Offense score
     * ? OO determina o bônus ao ameaçar peças inimigas
     * 
     * Assim como o @AA , o OO também precisa de @param {ξκAA} e @param {ωΩsigma}
     * (semelhante ao @param {ωΩ} só que aplicado com @sigma ) pelos mesmos
     * motivos
     */
    const ωΩsigma = ω(Ω+sigma+1)
    let OO = 0


    if (memory_moves[id].legal) {
        let VPS_CT = 0

        for (const [mr, mc] of memory_moves[id].legal) {

            const square = board[mr][mc]

            if (
                There_AllyThere(square,color) &&
                get_numAttacks(offense[mr][mc][enemy])
            ) {
                AA += MaterialValue[square.type]**2
            }

            if(There_AllyThere(square, enemy) && square.type !== PART.piece) {
                
                VPS_CT += MaterialValue[square.type]**2
            }
        }

        AA = AA * (ξκAA) * (ωΩ)
        AA = Normalization(AA, rho.AAT)

        OO = VPS_CT * (ξκAA) * (ωΩsigma)
        OT = Normalization(OO, rho.OT)

    }

    restoreBackup(backup)

    return {φ, vΔφ, AA, OO}
}

function calcule_Neurons(vΔΩη, vPlz, vEP, vCE, vPS, vΔφ, AA, OO, ωCM, ωDS) {

    if (ωCM > 0) return Infinity

    const vΔΩη_λ    = vΔΩη * lambda.lamb_vΔΩη
    const vPlz_λ    = vPlz * lambda.lamb_vPlz
    const vEP_λ     = vEP  * lambda.lamb_vEP
    const vCE_λ     = vCE  * lambda.lamb_vCE
    const vPS_λ     = vPS  * lambda.lamb_vPS
    const vΔφ_λ     = vΔφ  * lambda.lamb_vΔφ
    const AA_λ      = AA   * lambda.lamb_AA
    const OO_λ      = OO   * lambda.lamb_OO
    const ωDS_λ     = ωDS  * lambda.lamb_ωDS

    return vΔΩη_λ + vPlz_λ + vEP_λ + vCE_λ + vPS_λ + vΔφ_λ + AA_λ + OO_λ + ωDS_λ

}

function calcule_Score(id, PART, color, enemy, r, c, omega0, eta0) {
    // ? Plaza Score
    const vPLZS = calcule_PLZS(PART.piece, r, c)
    const PLZS = Normalization(vPLZS, rho.PLZS)

    // ? Emergent Piece
    const EMP = Normalization(omega0, rho.EMP) * -betta.EMP

    const kappa_NAS = Calcule_κ(r, c, enemy)

    const [omega_MAOS, V_moved_piece, Sum_V_defenders] = Calcule_Ω(r, c, PART, color, kappa_NAS)
    const sigma_LAMP =                                   Calcule_σ(r, c, color, V_moved_piece, Sum_V_defenders, kappa_NAS)
    const eta_MCTS =                                     Calcule_η(color)

    const delta_omega = omega_MAOS - omega0
    const delta_eta = eta_MCTS - eta0

    const omegaδ = Math.sign(delta_omega) * (delta_omega**2) + sigma_LAMP
    const etaδ = (delta_eta*100)

    const N_omegaδ = Normalization(omegaδ, rho.omega) 
    const N_etaδ = Normalization(etaδ, rho.eta) 

    const COMBAT = (N_omegaδ) * betta.omega + (N_etaδ) * betta.eta


    const square = board[r][c]

    // ? Capture Tax
    // console.log('CT')
    let CT = 0

    if (Is_anyThere(square) && Is_AllyThere(square, enemy)) {
        let piece_CT = square.type

        vCT = (VPS_enemy[piece_CT] + omega_MAOS)
        CT = Normalization(vCT, rho.CT) * betta.CT
    }

    // ? Pawn Struture Tax
    // console.log('PST')
    let PST = 0
    if (PART.piece == 'P') {
        const moves = unit_moviment_parts.B.move
        for (const [dr, dc] of moves) {
            const ddr = r + dr
            const ddc = c + dc

            if (Is_OutBoard(ddr, ddc)) continue

            const diagonal_square = board[ddr][ddc]

            if (
                Is_anyThere(diagonal_square) &&
                Is_AllyThere(diagonal_square, color) &&
                diagonal_square.type == 'P'
            ) {
                PST += EPS.P
            }
        }

        PST = Normalization(PST, rho.PST) * betta.PST
    }

    const {AAT, OT} = score_Releases(id, PART, color, r, c, omega_MAOS, sigma_LAMP)

    // OPT
    // KST
    // DST
    // AAT

    const SCORE = PLZS + COMBAT + CT + PST + AAT + OT + EMP

    return [SCORE, PLZS, EMP, N_omegaδ, COMBAT, CT, PST, AAT, OT]
}



function score_Releases(id, PART, color, r, c, omegaMAOS, sigmaLAMP) {
    console.log('!!!!! ===== score_Releases ===== !!!!!')

    // ? Assistence Ally Tax
    let AAT = 0

    // ? Offense Tax
    let OT = 0
    const enemy = get_Enemy(color)

    const backup = createBackup()

    make_theoretical_move(id, PART.piece, color, PART.r, PART.c, r, c)

    set_MemoryMoves(id, color)

    if (memory_moves[id].legal) {
        let VPS_CT = 0
        let Omega_Sigma = 0

        for (const [mr, mc] of memory_moves[id].legal) {

            const square = board[mr][mc]

            if (!get_numAttacks(offense[r][c][enemy])) {

                if (
                    There_AllyThere(square,color) &&
                    get_numAttacks(offense[mr][mc][enemy])
                ) {
                    AAT += VPS_ally[square.type]
                }
            }

            if(omegaMAOS >= 0 && There_AllyThere(square, enemy) && square.type !== PART.piece) {
                VPS_CT +=     (VPS_enemy[square.type])
                Omega_Sigma += (omegaMAOS + sigmaLAMP)
            }
        }
        // console.log('AAT')
        AAT = Normalization(AAT, rho.AAT) * betta.AAT
        // console.log('OT')
        OT = Normalization(VPS_CT, rho.OT) * betta.CT + Normalization(Omega_Sigma, rho.OT-30) * betta.OT

        restoreBackup(backup)
    }

    return {AAT, OT}
}