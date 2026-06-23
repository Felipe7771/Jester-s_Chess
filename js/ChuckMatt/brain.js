function SET_ChuckMatt_Move() {
    
    if (CHECKMATE || !PLAYING_WITH_CHUCKMATT) return
    if (!RUN_CHUCKMATT) set_initialChuckMatt(PLAY_TURN.chuck)
        
    // console.clear()
    // 1. pegue a cor do time
    const color = CMcolor
    const enemy = get_Enemy(color)

    let armyMoves = get_Army(color)

    Scores = {
        /**
         * 'id|score': {
         * id: id,
         * score,
         * to_r: r,
         * to_c: c
         * }
         */
    }

    // 5. calcule EEKS
    // ? Exposed Enemy King Scale
    calcule_EEKS()

    let eta0 = Calcule_η(color)

    // 6. se o sucessor está morto, aumente o valor do rei
    if (!Have_Sucessor(color)) growUp_King_ally()
    if (!Have_Sucessor(enemy)) growUp_King_enemy()

    // 7. Gerar plaza dos atacantes
    Attackers_plaza = generate_Attackersplaza(EEKS)

    // 8. calcular pontuação
    console.log('REAL GAME')
    for (const id of Object.keys(armyMoves)) {
        const PART = pieceIndex[id]
        const enemy = get_Enemy(color)

        // ? Default Piece Score
        let {DPS, kappa0_NAS, omega0_MAOS} = calcule_InitialEstatistics(PART, color, enemy)


        for (const [r, c] of armyMoves[id]) {

            if (!Is_Jester(id[1])) {
                    console.log(`DPS: ${DPS} Ω₀: ${omega0_MAOS}`)
                    let [score, PLZS, EMP, N_omegaδ, COMBAT, CT, PST, AAT, OT] = calcule_Score(id, PART, color, enemy, r, c, omega0_MAOS, eta0)
                    // console.clear()

                    score += DPS

                    if (id == moved_chuck.id && EMP<0) {
                        // ? Same Piece Move Penalided
                        score*= alphaSPMP
                    }

                    if (JSON.stringify([r,c]) === JSON.stringify(moved_chuck.step)) {
                        // ? Same Step Move Penalided
                        score*=theta
                    }

                    if (id == id_AlreadyPlay) {
                        const taxAlreadyPlay = (6 + 4 * is_to_attacked) / 10
                        score *= taxAlreadyPlay
                    }

                    const content = {
                        id,
                        score,
                        PLZS,
                        EMP,
                        'NΔΩ²':N_omegaδ,
                        'NΔΩη':COMBAT,
                        CT,
                        PST,
                        AAT,
                        OT,
                        to_r: r,
                        to_c: c,
                    }

                        const id_score = `${id}|${score}`

                    Scores[id_score] = content
                }
        }
    }

    // 9. Exiba resultados
    console.clear()
    log_Scores(Scores, eta0)

    let BestMove = {}

    // 10. Pegar maior pontuação
    if (plays <= 1) {
        console.log('====================')
        console.log('SELECIONADO DO TOP3')
        console.log('====================')
        const top3 = Object.values(Scores)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)

        const weights = [0.6, 0.3, 0.1]
        const rnd = Math.random()

        let acc = 0
        for (let i = 0; i < top3.length; i++) {
            acc += weights[i]
            if (rnd < acc) {
                BestMove = top3[i]
                break
            }
        }
    } else {

        BestMove = Object.values(Scores).reduce((max, obj) =>
            obj.score > max.score ? obj : max,
        )
    }

    if (BestMove.id === moved_chuck.id && JSON.stringify([BestMove.to_r, BestMove.to_c]) === JSON.stringify(moved_chuck.step)) {

        theta -= 0.3
    } else {
        theta = 0.6
    }

    
    const BestPiece = pieceIndex[BestMove.id]

    moved_chuck = {
        id: BestMove.id,
        step: [BestPiece.r, BestPiece.c]
    }
    // 11. Executar
    set_Moving(BestMove, BestPiece)
}
