const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const images = {
  background: 'imagenes/campo2.jpg',
  placapumFront: 'imagenes/Placapum.png',
  placapumRight: 'imagenes/placapum1.png',
  placapumLeft: 'imagenes/placapum2.png',
  mario: 'imagenes/mario-sprite-png-6.png',
  luigi: 'imagenes/luigi-sprite-png-1.png',
  placapumsLogo: 'imagenes/Placapum.png',
  vsLogo: 'imagenes/versuslogo.png',
  vidasMario: 'imagenes/lifeRed.png',
  vidasLuigi: 'imagenes/lifeGreen.png',
  marioWinner: 'imagenes/pngocean.com (4).png',
  luigiWinner: 'imagenes/pngocean.com (5).png',
  winner: 'imagenes/winner2.png',
  start: 'imagenes/space.png',
  marioLobby: 'imagenes/mario7.png',
  luigiLobby: 'imagenes/luigi4.png',
}

const audios = {
  lobby: 'audios/odissey.mp3',
  play: 'audios/slide 64.mp3',
  stepsMario: 'audios/pisada1.wav',
  stepsLuigi: 'audios/pisada2.wav',
  stepsPlacapums: 'audios/pisada4.wav',
  coalision: 'audios/choque1.wav',
  rebota: 'audios/rebota.wav',
  winner: 'audios/winner.mp3',
}

////////////////////////////////////////////////////////////////////////////////////////////

class Sonidos {
  constructor(source, vol) {
    this.audio = new Audio(source)
    this.audio.volume = vol
  }
  play() {
    this.audio.play()
  }
  pause() {
    this.audio.pause()
  }
  load() {
    this.audio.load()
  }
}

class Background {
  constructor() {
    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.img = new Image()
    this.img.src = images.background
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
}

class Lifes {
  constructor(x, y, width, height, imagen) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.img = new Image()
    this.img.src = imagen
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
}

class Logo {
  constructor(x, y, width, height, src) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.img = new Image()
    this.img.src = src
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
}

class Winners {
  constructor(x, y, width, height, imagen) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.img = new Image()
    this.img.src = imagen
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
}

class Jugadores {
  constructor(images, sx, sy, sw, sh, x, y, width, height, imagenLo) {
    this.x = x
    this.y = y
    this.sx = sx
    this.sy = sy
    this.sw = sw
    this.sh = sh
    this.speed = 5
    this.velY = 0
    this.velX = 0
    this.width = width
    this.height = height
    this.vidas = 3
    this.receiveDamage = true
    this.img = new Image()
    this.img.src = images
    this.imgLobby = new Image()
    this.imgLobby.src = imagenLo
  }
  draw() {
    ctx.drawImage(this.imgLobby, this.x, this.y, this.width, this.height)
  }
  limite() {
    if (this.x > 443) {
      return (this.x -= 15), rebotaSound.play()
    } else if (this.x < 30) {
      return (this.x += 15), rebotaSound.play()
    } else if (this.y > 510) {
      return (this.y -= 15), rebotaSound.play()
    } else if (this.y < 70) {
      return (this.y += 15), rebotaSound.play()
    }
  }
  isTouching(placapum) {
    return (
      this.x < placapum.x + placapum.width &&
      this.x + this.width > placapum.x &&
      this.y < placapum.y + placapum.height &&
      this.y + this.height > placapum.y
    )
  }
}

class Placapums {
  constructor(x, y, imagen, direction) {
    this.x = x //esto es para que nos genere los placapums fuera del canvas, entonces seria el canvas.width + this.width.
    this.y = y //esto es para que nos genere los placapums fuera del canvas, y no aparezcan de la nada, entonces seria el canvas.height + this.height..
    this.width = 90
    this.height = 90
    this.placapumFront = new Image()
    this.placapumFront.src = imagen
    this.placapumRight = new Image()
    this.placapumRight.src = imagen
    this.placapumLeft = new Image()
    this.placapumLeft.src = imagen
    this.direction = direction
  }
  draw() {
    if (this.direction === 'front') {
      this.y += 4.5 // esta es la velocidad a la que se desplaza cada uno
      ctx.drawImage(this.placapumFront, this.x, this.y, this.width, this.height)
    } else if (this.direction === 'right') {
      this.x -= 4.5 // queria hacer de esta velocidad un numero rando que vaya cambiando cada vez que imprima
      ctx.drawImage(this.placapumRight, this.x, this.y, this.width, this.height)
    } else if (this.direction === 'left') {
      this.x += 4.5 // intente hacerlo asi pero no funciono this.x += Math.floor(Math.random() * (650 - 1) + 1)
      ctx.drawImage(this.placapumLeft, this.x, this.y, this.width, this.height)
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////

let interval

let animate = 0

const cycleLoop = [1, 0, 1, 2]

let lobbyInstructions

let frames = 0

const friccion = 0.8

const keys = []

const arreDePlacapums = []

const campo = new Background()
const marioBros = new Jugadores(
  images.mario,
  cycleLoop[animate] * 44,
  0,
  44,
  53,
  145,
  285,
  80,
  120,
  images.marioLobby
)
const luigiBros = new Jugadores(
  images.luigi,
  cycleLoop[animate] * 46,
  0,
  46,
  62,
  335,
  285,
  80,
  120,
  images.luigiLobby
)
const logoPlacaplums = new Logo(205, 105, 140, 130, images.placapumsLogo)
const logoVS = new Logo(230, 240, 100, 90, images.vsLogo)
const pressStart = new Logo(140, 420, 270, 90, images.start)

const vidaR1 = new Lifes(20, 10, 35, 35, images.vidasMario)
const vidaR2 = new Lifes(75, 10, 35, 35, images.vidasMario)
const vidaR3 = new Lifes(130, 10, 35, 35, images.vidasMario)

const vidaG1 = new Lifes(490, 10, 40, 40, images.vidasLuigi)
const vidaG2 = new Lifes(435, 10, 40, 40, images.vidasLuigi)
const vidaG3 = new Lifes(375, 10, 40, 40, images.vidasLuigi)

const marioWin = new Winners(125, 170, 300, 300, images.marioWinner)
const luigiWin = new Winners(125, 170, 300, 300, images.luigiWinner)
const stmpWin = new Winners(120, 340, 350, 200, images.winner)

const lobbySound = new Sonidos('audios/odissey.mp3', 0.1)
const gameSound = new Sonidos('audios/slide 64.mp3', 0.03)
const stepsMarioSound = new Sonidos('audios/pisada1.wav', 0.1)
const stepsLuigiSound = new Sonidos('audios/pisada2.wav', 0.1)
const stepsPlacapumsSound = new Sonidos('audios/pisada4.wav', 0.2)
const coalisionSoundMario = new Sonidos('audios/hurtluigi.wav', 0.2)
const coalisionSoundLuigi = new Sonidos('audios/hurtmario.wav', 0.2)
const rebotaSound = new Sonidos('audios/rebota.wav', 0.3)
const winnerSound = new Sonidos('audios/winner.mp3', 0.05)

/////////////////////////////////////////////////////////////////////////////////////////

function marioMovement() {
  if (keys[68]) {
    if (marioBros.velX < marioBros.speed) {
      marioBros.velX++
      stepsMarioSound.play()
      marioBros.sy = 103
    }
  }

  if (keys[65]) {
    if (marioBros.velX > -marioBros.speed) {
      marioBros.velX--
      stepsMarioSound.play()
      marioBros.sy = 53
    }
  }

  if (keys[83]) {
    if (marioBros.velY < marioBros.speed) {
      marioBros.velY++
      stepsMarioSound.play()
      marioBros.sy = 0
    }
  }

  if (keys[87]) {
    if (marioBros.velY > -marioBros.speed) {
      marioBros.velY--
      stepsMarioSound.play()
      marioBros.sy = 152
    }
  }

  marioBros.x += marioBros.velX
  marioBros.velX *= friccion

  marioBros.y += marioBros.velY
  marioBros.velY *= friccion
}

function luigiMovement() {
  if (keys[39]) {
    if (luigiBros.velX < luigiBros.speed) {
      luigiBros.velX++
      stepsLuigiSound.play()
      luigiBros.sy = 124
    }
  }

  if (keys[37]) {
    if (luigiBros.velX > -luigiBros.speed) {
      luigiBros.velX--
      stepsLuigiSound.play()
      luigiBros.sy = 62
    }
  }

  if (keys[40]) {
    if (luigiBros.velY < luigiBros.speed) {
      luigiBros.velY++
      stepsLuigiSound.play()
      luigiBros.sy = 0
    }
  }

  if (keys[38]) {
    if (luigiBros.velY > -luigiBros.speed) {
      luigiBros.velY--
      stepsLuigiSound.play()
      luigiBros.sy = 186
    }
  }

  luigiBros.x += luigiBros.velX
  luigiBros.velX *= friccion

  luigiBros.y += luigiBros.velY
  luigiBros.velY *= friccion
}

function checkCollisionMario() {
  arreDePlacapums.forEach((placapum) => {
    if (marioBros.isTouching(placapum) && marioBros.receiveDamage === true) {
      marioBros.receiveDamage = false
      marioBros.vidas -= 1
      coalisionSoundMario.play()
      console.log(`${marioBros.vidas} Mario`)
      setTimeout(() => (marioBros.receiveDamage = true), 3000)
    }
  })
}

function checkCollisionLuigi() {
  arreDePlacapums.forEach((placapum) => {
    if (luigiBros.isTouching(placapum) && luigiBros.receiveDamage === true) {
      luigiBros.receiveDamage = false
      luigiBros.vidas -= 1
      coalisionSoundLuigi.play()
      console.log(`${luigiBros.vidas} Luigi`)
      setTimeout(() => (luigiBros.receiveDamage = true), 3000)
    }
  })
}

function checkCollisionOtherPlayerL() {
  if (marioBros.isTouching(luigiBros))
    return (marioBros.velX = -2), (marioBros.velY = +2), rebotaSound.play()
}

function checkCollisionOtherPlayerM() {
  if (luigiBros.isTouching(marioBros)) return (luigiBros.velX = +2), (luigiBros.velY = -2)
}

function generarPlacapums() {
  const numeroAleatorioX = Math.floor(Math.random() * (500 - 1) + 1) //aqui nos dara un numero random para despues utilizarlo en x, este numero va del ancho del canvas - la imagen.width por eso nos da 500 y el otro minimo es el origen de x o sea 0
  const numeroAleatorioYL = Math.floor(Math.random() * (650 - 1) + 1)
  const numeroAleatorioYR = Math.floor(Math.random() * (650 - 1) + 1)
  if (frames % 200 === 0) {
    //esto nos da la frecuencia con la que se van generando los pipes, queria encontrar una forma de hacer que se imprimieran cada uno de manera aleatoria, tipo hacer que saliera el de arriba cada segundo durante 15segundos, despues cambiar a salir cada uno de arriba cada 3 segundos durante 10 segundos, etc... asi con cada uno de los lados

    arreDePlacapums.push(new Placapums(numeroAleatorioX, -70, images.placapumFront, 'front')) // cada uno de los push agrega un pide diferente al array
    arreDePlacapums.push(new Placapums(-70, numeroAleatorioYL, images.placapumLeft, 'left')) // su 'X' es negativa porquecomienza afuera del canvas del lado izquierdo, su 'Y' es aleatorio ya que cada vez que genere uno, saldra en diferente altura
    arreDePlacapums.push(
      new Placapums(canvas.width - 30, numeroAleatorioYR, images.placapumRight, 'right')
    ) // su imagen cambia para solo generar una clase y en cada instancia colocarle la correspondiente, el string que tenemos al final dijimos era el parametro diretion lo igualamos al momento de imprimir por su clase Placapums en el metdodo draw()
  }
}

function drawPlacapums() {
  arreDePlacapums.forEach((elementoDeArray) => elementoDeArray.draw())
}

function drawMarioLifes() {
  switch (marioBros.vidas) {
    case 3:
      vidaR1.draw()
      vidaR2.draw()
      vidaR3.draw()
      break
    case 2:
      vidaR1.draw()
      vidaR2.draw()
      break
    case 1:
      vidaR1.draw()
      break
    case 0:
      gameSound.pause()
      luigiWin.draw()
      stmpWin.draw()
      winnerSound.load()
      winnerSound.play()
      gameOver()
      break
  }
}

function drawLuigiLifes() {
  switch (luigiBros.vidas) {
    case 3:
      vidaG3.draw()
      vidaG2.draw()
      vidaG1.draw()
      break
    case 2:
      vidaG3.draw()
      vidaG2.draw()
      break
    case 1:
      vidaG3.draw()
      break
    case 0:
      gameSound.pause()
      marioWin.draw()
      stmpWin.draw()
      winnerSound.load()
      winnerSound.play()
      gameOver()
      break
  }
}

function dibujaSpriteLuigi() {
  ctx.drawImage(
    luigiBros.img,
    cycleLoop[animate] * 46.66,
    luigiBros.sy,
    luigiBros.sw,
    luigiBros.sh,
    luigiBros.x,
    luigiBros.y,
    luigiBros.width,
    luigiBros.height
  )
}

function dibujaSpriteMario() {
  ctx.drawImage(
    marioBros.img,
    cycleLoop[animate] * 44.16,
    marioBros.sy,
    marioBros.sw,
    marioBros.sh,
    marioBros.x,
    marioBros.y,
    marioBros.width,
    marioBros.height
  )
}

function spriteFrames() {
  if (frames % 5 === 0) {
    animate++
    if (animate === 4) animate = 0
  }
}

///////////////////////////////////////////////////////////////////////////////////////////

function gameOver() {
  clearInterval(interval)
}

function start() {
  if (interval) return
  interval = setInterval(update, 1000 / 60)
  gameSound.load()
  gameSound.play()
}

function restart() {
  window.location.reload()
}

window.onload = drawStart
function drawStart() {
  campo.draw()
  pressStart.draw()
  marioBros.draw()
  luigiBros.draw()
  logoPlacaplums.draw()
  logoVS.draw()
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  frames++
  campo.draw()
  spriteFrames()
  generarPlacapums()
  drawPlacapums()
  marioMovement()
  luigiMovement()
  drawMarioLifes()
  drawLuigiLifes()
  marioBros.limite()
  luigiBros.limite()
  dibujaSpriteLuigi()
  dibujaSpriteMario()
  checkCollisionMario()
  checkCollisionLuigi()
  checkCollisionOtherPlayerL()
  checkCollisionOtherPlayerM()
}

//para movimiento
document.addEventListener('keydown', (e) => {
  keys[e.keyCode] = true
})

//para movimiento
document.addEventListener('keyup', (e) => {
  keys[e.keyCode] = false
})

document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 32:
      lobbySound.pause()
      start()
      break
    case 13:
      restart()
      break
  }
}

document.onclick = function (e) {
  if (lobbyInstructions == true) return
  lobbyInstructions = false
  lobbySound.play()
}
