/**
 * showCheckmate(winner)
 * winner: 'w' ou 'b' — o time que GANHOU
 */
function showCheckmate(winner) {
    checkmate.play()

    TURN = ''
    const loser = winner === 'w' ? 'b' : 'w'

    const winnerKing = winner + 'K'
    const loserKing = loser + 'K'

    let wKPos = null,
        lKPos = null
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c].visualKey === winnerKing) wKPos = { r, c }
            if (board[r][c].visualKey === loserKing) lKPos = { r, c }
        }
    }

    function getSqEl(r, c) {
        return squares[r * 8 + c]
    }

    if (lKPos) {
        const el = getSqEl(lKPos.r, lKPos.c)
        el.classList.add('sq-checkmate')

        const piece = el.querySelector('img')

        const effect = pieceEffects.get(board[lKPos.r][lKPos.c].id)

        if (effect?.shake) {
            piece.classList.remove('shake-soft') // limpa estado antigo
        }

        
        
        piece.classList.add('king-defeat')
        piece.addEventListener('animationend', () => {
            piece.classList.add('king-dead-twitch');
        }, { once: true });

        piece.addEventListener('mouseenter', () => {
            died.volume = 0.3;
            died.play()
        })

        piece.addEventListener('mouseleave', () => {
            died.pause()
            died.currentTime = 0
        })

        const badge = document.createElement('div')
        badge.className = 'king-badge badge-checkmate'
        badge.textContent = 'CHECKMATE'
        el.appendChild(badge)

        const icon = document.createElement('div')
        icon.className = 'king-icon-icon-checkmate'
        const img = document.createElement('img')
        img.src = './img/checkmate_king.png'
        img.width = 40
        img.height = 40

        icon.appendChild(img)
        el.appendChild(icon)
    }

    if (wKPos) {
        const el = getSqEl(wKPos.r, wKPos.c)
        el.classList.add('sq-winner')

        const piece = el.querySelector('img')

        const effect = pieceEffects.get(board[wKPos.r][wKPos.c].id)

        if (effect?.shake) {
            piece.classList.remove('shake-soft') // limpa estado antigo
        }

        piece.classList.add('victory')

        const badge = document.createElement('div')
        badge.className = 'king-badge badge-winner'
        badge.textContent = 'WINNER'
        el.appendChild(badge)

        const icon = document.createElement('div')
        icon.className = 'king-icon-icon-winner'
        const img = document.createElement('img')
        img.src = './img/crown.png'
        img.width = 40
        img.height = 40

        icon.appendChild(img)
        el.appendChild(icon)
    }

    Laugth_Jester()
}

/**
 * showCheckmate(winner)
 * winner: 'w' ou 'b' — o time que GANHOU
 */
function showTry() {
    checkmate.play()

    TURN = ''

    const King1 = 'wK'
    const King2 = 'bK'

    let wKPos = null,
        lKPos = null
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c].visualKey === King1) K1Pos = { r, c }
            if (board[r][c].visualKey === King2) K2Pos = { r, c }
        }
    }

    function getSqEl(r, c) {
        return squares[r * 8 + c]
    }

    if (K1Pos) {
        const el = getSqEl(K1Pos.r, K1Pos.c)
        el.classList.add('sq-try')

        const badge = document.createElement('div')
        badge.className = 'king-badge badge-try'
        badge.textContent = 'Draw'
        el.appendChild(badge)

        const icon = document.createElement('div')
        icon.className = 'king-icon-icon-try'
        const img = document.createElement('img')
        img.src = './img/try.png'
        img.width = 40
        img.height = 40

        icon.appendChild(img)
        el.appendChild(icon)
    }

    if (K2Pos) {
        const el = getSqEl(K2Pos.r, K2Pos.c)
        el.classList.add('sq-try')

        const badge = document.createElement('div')
        badge.className = 'king-badge badge-try'
        badge.textContent = 'Draw'
        el.appendChild(badge)

        const icon = document.createElement('div')
        icon.className = 'king-icon-icon-try'
        const img = document.createElement('img')
        img.src = './img/try.png'
        img.width = 40
        img.height = 40

        icon.appendChild(img)
        el.appendChild(icon)
    }
}

function Laugth_Jester() {
    function getSqEl(r, c) {
        return squares[r * 8 + c]
    }

    for (const color of ['w', 'b']) {
        console.log('Jester ', color, Have_Jester(color))
        if (!Have_Jester(color)) continue

        const id = get_Id_Jester(color)
        const Jester = pieceIndex[id]
        const r = Jester.r,
            c = Jester.c

        const el = getSqEl(r, c)

        const piece = el.querySelector('img')

        const effect = pieceEffects.get(board[r][c].id)

        if (effect?.spin) {
            piece.classList.remove('spin') // limpa estado antigo
        }

        piece.classList.add('jester-endgame')

        piece.addEventListener('mouseenter', () => {
            hahah.volume = 0.1;
            hahah.play()
        })

        piece.addEventListener('mouseleave', () => {
            hahah.pause()
            hahah.currentTime = 0
        })
    }
}
