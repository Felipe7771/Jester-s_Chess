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

function set_KingAnimationCheck(id) {

pieceEffects.set(id, { shake: true });
}

function remove_KingAnimationCheck(id) {

pieceEffects.set(id, { shake: false });
}

function setTurn(color) {

    // Remove destaque de todos
    document.querySelectorAll(".player-strip").forEach(strip => {
        strip.classList.remove("active-turn");
    });

    document.querySelectorAll(".player-name").forEach(name => {
        name.classList.remove("player-name-active");
        name.style.color = "";
    });

    const group = color === 'w' ? 'white': 'black'

    const strip = document.getElementById(`strip-${group}`);

    // Nome ativo
    const name = document.getElementById(`name-${group}`);

    // Reinicia animação
    void strip.offsetWidth;

    strip.classList.add("active-turn");

    name.classList.add("player-name-active");
}