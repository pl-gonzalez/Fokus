const html = document.querySelector('html')
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const botoes = document.querySelectorAll('.app__card-button')
const startPauseBt = document.querySelector('#start-pause')
const musicaFocoInput = document.querySelector('#alternar-musica')
const playPauseBt = document.querySelector('#start-pause span')
const playPauseIcon = document.querySelector('.app__card-primary-butto-icon')
const timer = document.querySelector('#timer')


const musica = new Audio('/sons/luna-rise-part-one.mp3')
const tempZero = new Audio('/sons/beep.mp3')
const tempPlay = new Audio('/sons/play.wav')
const tempPause = new Audio('/sons/pause.mp3')
musica.loop = true

let tempoDecorridoEmSegundos = 1500
let intervaloId = null


//inputs do tipo checkbox sao 'change'
musicaFocoInput.addEventListener('change', () => {
    if(musica.paused){
        musica.play()
    }
    else{
        musica.pause()
    }
})

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500
    alteraContexto('foco') 
    focoBt.classList.add('active')
})
curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300
    alteraContexto('descanso-curto')
    curtoBt.classList.add('active')
})
longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900
    alteraContexto('descanso-longo')
    longoBt.classList.add('active')
})

function alteraContexto(contexto){
    mostrarTempo()
    botoes.forEach(function (contexto){
        contexto.classList.remove('active')
    })
    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `/imagens/${contexto}.png`)

    switch(contexto){
        case 'foco':
            titulo.innerHTML = `Otimize sua produtividade,<br>
                            <strong class="app__title-strong">mergulhe no que importa.</strong>`

            break;
        
        case "descanso-curto":
            titulo.innerHTML = `Que tal dar uma respirada? 
                            <strong class="app__title-strong">Faça uma pausa curta!</strong>`
        
            break;
        
        case "descanso-longo":
            titulo.innerHTML = `Hora de voltar à superfície.
                            <strong class="app__title-strong">Faça uma pausa longa.</strong>`
            break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0){
        tempZero.play()
        zerar()
        alert('Tempo finalizado!')
        return
    }
    tempoDecorridoEmSegundos -= 1
    mostrarTempo()
}

startPauseBt.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar() {
    if(intervaloId){
        zerar()
        return
    }
    tempPlay.play()
    intervaloId = setInterval(contagemRegressiva, 1000)
    playPauseBt.textContent = 'Pausar'
    playPauseIcon.setAttribute('src', `/imagens/pause.png`)
}

function zerar() {
    tempPause.play()
    clearInterval(intervaloId)
    playPauseBt.textContent = 'Começar'
    playPauseIcon.setAttribute('src', `/imagens/play_arrow.png`)
    intervaloId = null
}

function mostrarTempo(){
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'})
    timer.innerHTML = `${tempoFormatado}`
}

mostrarTempo()