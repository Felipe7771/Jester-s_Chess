function clearMoveHints() {
    moveCircles.clear()
    moveRings.clear()
}

function flashIllegal(sqList) {

  invalid.play()
  for (const [r, c] of sqList) {
    // console.log(r,c)
    const el = boardEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
    console.log(r,c,": ",!el ? "NAO DEU": 'W')
    if (!el) continue;

    console.log("PASSEI")

    el.classList.remove('flash-illegal');
    void el.offsetWidth; // força reflow pra reiniciar animação se chamar duas vezes seguidas
    el.classList.add('flash-illegal');

    el.addEventListener('animationend', () => {
      el.classList.remove('flash-illegal');
    }, { once: true });
  }
}