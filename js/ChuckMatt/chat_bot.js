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
];

const ENDED_DEFEAT_CHAT_BOT = [
    'Posso desligar o tutorial já?',
    'Anotado. Evitar perder o rei',
    'Meu advogado recomentda classificar esta partida como ficção',
    'Jogando sério até eu ganho',
    'Ainda bem que tava testando uma teoria',
    'Quer mais vinho, vossa excelência?',
    'Pelo menos no poker eu posso trapacear...',
    'Trapaceando até eu',
    'Isso estava indo bem até parar de ir...',
    'Vou fingir que deixei',
    'Parabéns! Você derrotou uma inteligência artifical, o que, olhando para esta partida, talvez não seja um feito tão impressionante',
    'Já tava velho e capenga mesmo...',
    'Pelo menos posso beijar a rainha antes da guilhotina?',
    'Olha o que as drogas fazem com as pessoas',
    '...Tava mexendo no celular, o que rolou?',
    'Vou precisar culpar alguém.',
    'Senta aqui e calcula a pontuação de todas as casas sem ver o tabuleiro, vamos ver que é o bom nessa budega',
    'Cortem as cabeças!... não, pera...',
    'Quem programou isso é mais louco que eu, confia',
    'É o que acontece quando não pagam bem o programador da IA',
    'Devo admitir... sua rainha é muito linda, me submeto',
    'Sabe o que é esse EEKS ? Não? Pois é, acho que o programador dessa IA também não...',
    'Sai do fake, Magnus Carlsen, tá fazendo o que aqui?',
    'O nível de loucura do cara é tão alto a partir do momento que encontraram lances brilhantes para uma variante de uma peça que move duas vezes e promove para rei...',
    'Não acredito! Você realmente usou o gambito Cristóvão Agostinho de Lado 34-5 Da quarta casa Realeza ao Quadrado do capítulo 3.1453 Gambitos de Rudolf Eduardo Chapéu!',
    'Por isso não gosto de xadrez, não gosto de reis, prefiro rainhas',
    'Se queria meu rei, tua rainha está solteira?'
]

const ENDED_VICTORY_CHAT_BOT = [
        'Perdeu para um monte de 1 e 0 hahah',
        'Sua espécie inventou computadores para isso.',
        'Não leve para o lado pessoal... Eu levei',
        'Obrigado por participar da coleta de dados',

]

const CHECK_CHUCK_CHAT_BOT = [
    'Com licença senhora, gostaria de fazer seu cartão da loja?',
    'A rainha está em casa, senhor?',
    'Não se preocupe comigo, se preocupe com o Roberto...',
    'Bora brincar de otomanos?',
    'CONSTANTINOPLA, ESTAMOS ENTRANDO!',
    'Em nome do reino, entregue sua rainha... E seu reinado, se quiser também',
    'OLÁ',
    'Tem um minutinho para ouvir a palavra da derrota?',
    'Boa noite, temos interesse na sua monarca',
    'Isto é um assalto, passe sua rainha',
    'Não precisa entrar em pânico... ainda',
    'Boa noite, buscamos um tal de rei por aqui, vio ou morto... provavelmente morto',
    'Não se preocupe, vai doer mais em você do que em mim :)',
    'Não queremos guerra, não verdade eu quero, mas isso não entra no caso',
    'Vai para algum lugar?',
    'Segundo a regra 2.45, sua rainha é muito gata.',
    'Uma coxinha e um refrigerante podemos negociar'
]

const PROMOTE_QUEEN_CHUCK_CHAT_BOT = [
    'Apaixonei',
    'Duas são melhores que uma hihi',
    'Mais uma rainha para mim',
    'Vida longa a rainha',
    'Minha monarca',
    'Quem devo temer? Você ou ela?',
    'O tabuleiro ficou mais bonito.',
    'Agora estamos conversando. >:)',
    'Tenho boas esperanças com isso...',
    'Adoro garotas assim'
]

const DRAW_ENEMY_CHAT_BOT = [
    'Você calculou isso? hah',
    'Está tão contente porquê? Acabou de perder...',
    'Jogou tudo fora para eu não ganhar? hah',
    'Você me faz rir muito',
    'Acho que sua majestade não gostou, parabens',
    'Obrigado por acabar com essa tortura chamada código mal feito',
    'Acabou de assumir que não sabe perder e ganhar hahah',
    '...Ok, tenha um bom dia hah'
]

const DRAW_CHUCK_CHAT_BOT = [
    'Meu movimentos são muito bem calculados, não quis te humilhar',
    'Era o melhor para nós dois hah...',
    'Se eu não ganho, você também não vai...',
    'Espero não me arrepender disso',
    'Minha maior piada: Sua cara de decepção',
    'Não esperava isso? Meu movimentos são imprevisíveis...',
    'Pronto, agora saia do computador e aproveite o dia',
    'Mais tempo para fazer a majestade rir',
    'Adoro finais inesperados'
]

// não toque
const QueenAffinity = 9999