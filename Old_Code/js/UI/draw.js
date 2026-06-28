/* =========================
   DESENHO DAS SETAS
   ========================= */
function drawArrows() {
    if (TURN == '') return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let a of arrows) {
        drawArrow(a.fr, a.fc, a.tr, a.tc)
    }
}

/* desenha uma seta individual */
function drawArrow(fr, fc, tr, tc) {
    let from = sqCenter(fr, fc)
    let to = sqCenter(tr, tc)

    let dx = to.x - from.x
    let dy = to.y - from.y

    let len = Math.sqrt(dx * dx + dy * dy)

    let ux = dx / len,
        uy = dy / len

    /* encurta ponta para não invadir centro da casa */
    let shorten = 32
    ex = to.x - ux * shorten
    ey = to.y - uy * shorten

    /* parâmetros geométricos da seta */
    let headLen = 100,
        headWid = 35,
        shaftWid = 20

    let px = -uy,
        py = ux

    // Normalização
    let adx = Math.abs(dx)
    let ady = Math.abs(dy)

    // detecção de seta inclinada
    let isLShapedArrow =
        (adx > ady && adx / ady >= 1.8 && adx / ady <= 2.2) ||
        (ady > adx && ady / adx >= 1.8 && ady / adx <= 2.2)

    if (isLShapedArrow) {
        let wide = adx > ady // true = 2 colunas, 1 linha | false = 1 coluna, 2 linhas

        let sx = dx > 0 ? 1 : -1
        let sy = dy > 0 ? 1 : -1

        let cornerR = 10 // raio da curva no cotovelo
        ctx.fillStyle = 'rgba(246, 166, 35, 0.7)'
        ctx.strokeStyle = 'rgba(246, 166, 35, 0.7)'

        ctx.save()
        ctx.lineWidth = shaftWid

        // ctx.lineCap     = 'round';
        // ctx.lineJoin    = 'round';

        ex = to.x
        ey = to.y

        ctx.beginPath()

        if (wide) {
            // trecho longo = horizontal, trecho curto = vertical
            // cotovelo na coluna de origem, linha de destino
            const pivotX = to.x + sx * cornerR
            const pivotY = to.y - sy * cornerR

            ctx.moveTo(from.x, from.y)
            ctx.lineTo(pivotX, from.y) // vai pra direita/esquerda (longo)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
            ctx.restore()

            dx = 0
            dy = to.y - from.y

            len = Math.sqrt(dx * dx + dy * dy)

            sx = dx > 0 ? 1 : -1
            sy = dy > 0 ? 1 : -1

            ;((ux = dx / len), (uy = dy / len))

            ex = to.x - ux * shorten
            ey = to.y - uy * shorten

            ;((px = -uy), (py = ux))

            ex = to.x - ux * shorten
            ey = to.y - uy * shorten
            // // ponta triangular na direção de chegada
            ctx.beginPath()
            ctx.moveTo(to.x + (px * shaftWid) / 2, from.y + (sy * shaftWid) / 2)
            ctx.lineTo(ex + (px * shaftWid) / 2, ey + (py * shaftWid) / 2)
            ctx.lineTo(ex + (px * headWid) / 2, ey + (py * headWid) / 2)
            ctx.lineTo(to.x, to.y)
            ctx.lineTo(ex - (px * headWid) / 2, ey - (py * headWid) / 2)
            ctx.lineTo(ex - (px * shaftWid) / 2, ey - (py * shaftWid) / 2)
            ctx.lineTo(to.x - (px * shaftWid) / 2, from.y + (sy * shaftWid) / 2)
            ctx.restore()
        } else {
            // trecho longo = vertical, trecho curto = horizontal
            // cotovelo na linha de origem, coluna de destino
            const pivotX = to.x - sx * cornerR
            const pivotY = to.y + sy * cornerR

            ctx.moveTo(from.x, from.y)
            ctx.lineTo(from.x, pivotY) // sobe/desce (longo)

            ctx.closePath()
            ctx.fill()
            ctx.stroke()
            ctx.restore()

            dx = to.x - from.x
            dy = 0

            sx = dx > 0 ? 1 : -1
            sy = dy > 0 ? 1 : -1

            len = Math.sqrt(dx * dx + dy * dy)

            ;((ux = dx / len), (uy = dy / len))

            ex = to.x - ux * shorten
            ey = to.y - uy * shorten

            ;((px = -uy), (py = ux))

            ex = to.x - ux * shorten
            ey = to.y - uy * shorten
            // // ponta triangular na direção de chegada
            ctx.beginPath()
            ctx.moveTo(from.x + (sx * shaftWid) / 2, to.y + (py * shaftWid) / 2)
            ctx.lineTo(ex + (px * shaftWid) / 2, ey + (py * shaftWid) / 2)
            ctx.lineTo(ex + (px * headWid) / 2, ey + (py * headWid) / 2)
            ctx.lineTo(to.x, to.y)
            ctx.lineTo(ex - (px * headWid) / 2, ey - (py * headWid) / 2)
            ctx.lineTo(ex - (px * shaftWid) / 2, ey - (py * shaftWid) / 2)
            ctx.lineTo(from.x + (sx * shaftWid) / 2, to.y - (py * shaftWid) / 2)
            ctx.restore()
        }
    } else {
        ctx.save()
        ctx.fillStyle = 'rgba(246, 166, 35, 0.7)'
        ctx.strokeStyle = 'rgba(246, 166, 35, 0)'
        // ctx.lineWidth = 10;
        // ctx.globalAlpha = 0.5;

        ctx.beginPath()

        // letrução da forma da seta (polígono)
        ctx.moveTo(from.x + (px * shaftWid) / 2, from.y + (py * shaftWid) / 2)
        ctx.lineTo(ex + (px * shaftWid) / 2, ey + (py * shaftWid) / 2)
        ctx.lineTo(ex + (px * headWid) / 2, ey + (py * headWid) / 2)
        ctx.lineTo(to.x, to.y)
        ctx.lineTo(ex - (px * headWid) / 2, ey - (py * headWid) / 2)
        ctx.lineTo(ex - (px * shaftWid) / 2, ey - (py * shaftWid) / 2)
        ctx.lineTo(from.x - (px * shaftWid) / 2, from.y - (py * shaftWid) / 2)
    }

    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.restore()
}