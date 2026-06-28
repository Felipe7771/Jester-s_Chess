
function checkPromotedSucessor(team_color) {
    const enemy = get_Enemy(team_color)

    let have_sucessor = false
    // console.log('Analisando')

    if (Have_Sucessor(enemy) && !Have_King(enemy)) {
        console.log('Rei morreu')

        const id_Sucessor = get_Id_Sucessor(enemy)

        const sucessor = pieceIndex[id_Sucessor]

        const r = sucessor.r
        const c = sucessor.c

        Complement_Id_Real[enemy]['K'] = '1'

        setPromote(id_Sucessor, get_Id_King(enemy), 'K', enemy, r, c)
        have_sucessor = true


    } else if (Have_Sucessor(enemy) && !Have_Queen(enemy)) {
        const id_Sucessor = get_Id_Sucessor(enemy)

        const sucessor = pieceIndex[id_Sucessor]

        const r = sucessor.r
        const c = sucessor.c

        Complement_Id_Real[enemy]['Q'] = '1'

        setPromote(id_Sucessor, get_Id_Queen(enemy), 'Q', enemy, r, c)
        have_sucessor = true
    }

    return have_sucessor
}

function setPromote(old_id, new_id, new_type, enemy, r, c) {
    board[r][c].id = new_id
    board[r][c].type = new_type
    board[r][c].visualKey = `${enemy}${new_type}`

    console.log(board[r][c].visualKey)

    team[enemy] = team[enemy].map((piece) => {
        if (piece.id === old_id) {
            // Retorna um novo objeto com os dados antigos e substitui o email
            return { ...piece, id: new_id }
        }
        return piece // Retorna o objeto original se não for o ID buscado
    })

    delete attackers[old_id]

    const content = {
        ...pieceIndex[old_id],
        id: new_id,
        piece: new_type,
    }
    delete pieceIndex[old_id]

    const indice = team_pieces[enemy].indexOf(old_id[1]); 
    team_pieces[enemy].splice(indice, 1);

    team_pieces[enemy].push(new_type)
    pieceIndex[new_id] = content
    attackers[old_id] = []
    attackers[new_id] = []

    set_combat_piece(new_id, enemy, content)
    promote.play()

    console.log(offense[0][4][enemy])

    const key = sqKey(r, c)

    yellowSquares.add(key)
    const team_color = get_Enemy(enemy)
    set_Check(team_color)
}

function PromotePawn(old_id, team, r, c) {

    if (PLAYING_WITH_CHUCKMATT && team === PLAY_TURN.chuck) {
        generate_id_pieces += 1
        const promotedPiece = 'Q' // por definição, o ChuckMatt sempre promove para Rainha
        const new_id = `${team}${promotedPiece}${generate_id_pieces}`

        setPromote(old_id, new_id, promotedPiece, team, r, c)

        sendBotMessage(get_randomMessage(PROMOTE_QUEEN_CHUCK_CHAT_BOT))

        return Promise.resolve()
    }

    return new Promise(resolve => {
        showPromotionMenu(r, c, team, promotedPiece => {
            generate_id_pieces += 1
            const new_id = `${team}${promotedPiece}${generate_id_pieces}`

            setPromote(old_id, new_id, promotedPiece, team, r, c)

            resolve()
        })
    })
}

function checkPromotedPawn(id, team, r, c) {
    if (id[1] != 'P') return Promise.resolve()

    const critic_row = team == 'w' ? 0 : 7
    if (r == critic_row) return PromotePawn(id, team, r, c)

    return Promise.resolve()
}


function showPromotionMenu(r, c, color, onSelect) {

    if (CHECKMATE) return

  // remove menu antigo se existir
  document.getElementById('promotion-menu')?.remove();

  const menu = document.createElement('div');

  menu.id = 'promotion-menu';

  Object.assign(menu.style, {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',

    background: '#ffffff',
    border: '1px solid #c0c0c0',
    // borderRadius: '10px',

    padding: '4px',

    zIndex: 9999,

    left: `${c * 72 + 76}px`,
    top: `${r * 72}px`
  });

  const promotions = ['Q', 'R', 'B', 'N'];

  for (const piece of promotions) {

    const img = document.createElement('img');

    img.src = PIECES[color + piece];

    Object.assign(img.style, {
      width: '60px',
      height: '60px',
      cursor: 'pointer',
      borderRadius: '6px'
    });

    img.addEventListener('click', () => {

      menu.remove();

      onSelect(piece);
    });

    menu.appendChild(img);
  }

  document.getElementById('board-wrapper').appendChild(menu);
}

