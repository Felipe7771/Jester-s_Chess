function get_randomMessage(list) {
    const indx = Math.floor(Math.random() * list.length) ;

    return list[indx]
}

const INICIATE_CHAT_BOT = [
    'Não prometo jogo limpo, meu mano',
    'Eu jurava que tinhamos combinado poker...',
    'Tenho uma piada, será você nessa partida?',
    'Minha estratégia dessa vez será fé e força de vontade',
    'Não sei quem temo hoje, você ou eu mesmo nesse jogo...',
    'Na teoria é você contra a calculadora nesse jogo, mas fica a vontade...'
]