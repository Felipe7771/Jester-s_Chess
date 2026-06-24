function clearMoveHints() {
    moveCircles.clear()
    moveRings.clear()
}

function flashIllegal(sqList) {
    invalid.play()
    for (const [r, c] of sqList) {
        // console.log(r,c)
        const el = boardEl.querySelector(`[data-r="${r}"][data-c="${c}"]`)
        console.log(r, c, ': ', !el ? 'NAO DEU' : 'W')
        if (!el) continue

        console.log('PASSEI')

        el.classList.remove('flash-illegal')
        void el.offsetWidth // força reflow pra reiniciar animação se chamar duas vezes seguidas
        el.classList.add('flash-illegal')

        el.addEventListener(
            'animationend',
            () => {
                el.classList.remove('flash-illegal')
            },
            { once: true },
        )
    }
}

function set_KingAnimationCheck(id) {
    pieceEffects.set(id, { shake: true })
}

function remove_KingAnimationCheck(id) {
    pieceEffects.set(id, { shake: false })
}

function setTurn(color) {
    // Remove destaque de todos
    document.querySelectorAll('.player-strip').forEach((strip) => {
        strip.classList.remove('active-turn')
    })

    document.querySelectorAll('.player-name').forEach((name) => {
        name.classList.remove('player-name-active')
        name.style.color = ''
    })

    const group = color === 'w' ? 'white' : 'black'

    const strip = document.getElementById(`strip-${group}`)

    // Nome ativo
    const name = document.getElementById(`name-${group}`)

    // Reinicia animação
    void strip.offsetWidth

    strip.classList.add('active-turn')

    name.classList.add('player-name-active')
}

/**
 * Anima o deslize visual de uma peça de uma casa até outra.
 * Não altera o estado do jogo - isso deve ser feito dentro do callback onDone.
 *
 * @param {number} fromR - linha de origem
 * @param {number} fromC - coluna de origem
 * @param {number} toR   - linha de destino
 * @param {number} toC   - coluna de destino
 * @param {number} duration - duração da animação em ms
 * @param {string} easing   - timing function CSS (ex: 'ease', 'linear', 'cubic-bezier(...)')
 * @param {Function} onDone - callback chamado quando a animação termina.
 *                            É AQUI que você deve fazer o teleporte real de estado
 *                            (mover a peça e remover a capturada, se houver).
 */
function animateSlide(fromR, fromC, toR, toC, duration, easing, onDone) {
    function getSqEl(r, c) {
        return squares[r * 8 + c]
    }

    const fromEl = getSqEl(fromR, fromC)
    const toEl = getSqEl(toR, toC)

    const piece = fromEl.querySelector('img')
    if (!piece) {
        // Não há peça na origem - não há o que animar, segue direto
        onDone()
        return
    }

    const r1 = fromEl.getBoundingClientRect()
    const r2 = toEl.getBoundingClientRect()

    // Clone "fantasma" que vai deslizar por cima do tabuleiro
    const clone = piece.cloneNode(true)
    clone.style.position = 'fixed'
    clone.style.pointerEvents = 'none'
    clone.style.zIndex = '9999'
    clone.style.margin = '0'
    clone.style.width = piece.offsetWidth + 'px'
    clone.style.height = piece.offsetHeight + 'px'
    clone.style.left = r1.left + (r1.width - piece.offsetWidth) / 2 + 'px'
    clone.style.top = r1.top + (r1.height - piece.offsetHeight) / 2 + 'px'
    clone.style.transition = `left ${duration}ms ${easing}, top ${duration}ms ${easing}`
    document.body.appendChild(clone)

    // Esconde a peça original na origem (o clone assume visualmente o lugar dela)
    piece.style.visibility = 'hidden'

    // Se há uma peça no destino (captura), esconde ela também.
    // Ela só será removida de fato do DOM dentro do onDone, junto do teleporte real.
    const capturedPiece = toEl.querySelector('img')
    if (capturedPiece) {
        capturedPiece.style.visibility = 'hidden'
    }

    // Força reflow para garantir que a transition seja aplicada
    clone.getBoundingClientRect()

    // Dispara a animação movendo o clone até o destino
    clone.style.left = r2.left + (r2.width - piece.offsetWidth) / 2 + 'px'
    clone.style.top = r2.top + (r2.height - piece.offsetHeight) / 2 + 'px'

    // Ao final da animação: remove o clone e dispara o callback
    setTimeout(() => {
        clone.remove()
        onDone()
    }, duration)
}
