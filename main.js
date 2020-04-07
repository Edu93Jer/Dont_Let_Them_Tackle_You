const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const images = {
  background: './imagenes/campo2.jpg',
  placapumFront: './imagenes/placapum.png',
  placapumRight: './imagenes/placapum1.png',
  placapumLeft: './imagenes/placapum2.png',
  mario: './imagenes/mario7.png',
  luigi: './imagenes/luigi4.png',
}

///////////////////////////////////////////////////////////////////////////////////

class Background {
  constructor() {
    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.img = new Image()
    this.img.src = images.background
    this.img.onload = () => ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
}

class Jugadores {
  constructor(x, y, images) {
    this.x = x
    this.y = y
    this.width = 80
    this.height = 120
    this.img = new Image()
    this.img.src = images
  }
  left() {
    this.x -= 10
  }
  right() {
    this.x += 10
  }
  up() {
    this.y -= 10
  }
  down() {
    this.y += 10
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
  limite() {
    if (this.x > 443) {
      return (this.x -= 10)
    } else if (this.x < 30) {
      return (this.x += 10)
    } else if (this.y > 510) {
      return (this.y -= 10)
    } else if (this.y < 70) {
      return (this.y += 10)
    }
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
      this.y += 2
      ctx.drawImage(this.placapumFront, this.x, this.y, this.width, this.height)
    } else if (this.direction === 'right') {
      this.x -= 1.5
      ctx.drawImage(this.placapumRight, this.x, this.y, this.width, this.height)
    } else if (this.direction === 'left') {
      this.x += 1.5
      ctx.drawImage(this.placapumLeft, this.x, this.y, this.width, this.height)
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////

const campo = new Background()
const marioBros = new Jugadores(175, 350, images.mario)
const luigiBros = new Jugadores(275, 350, images.luigi)
//const placapumF = new Placapums(0, -100, images.placapumFront, y++)
//const placapumR = new Placapums(canvas.width - 100, 0, images.placapumRight, x--)
//const placapumL = new Placapums(-100, 0, images.placapumLeft, x++)

let frames = 0

//let interval

const arreDePlacapums = []

///////////////////////////////////////////////////////////////////////////////////
document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37:
      marioBros.left()
      break
    case 39:
      marioBros.right()
      break
    case 38:
      marioBros.up()
      break
    case 40:
      marioBros.down()
      break
    case 65:
      luigiBros.left()
      break
    case 68:
      luigiBros.right()
      break
    case 87:
      luigiBros.up()
      break
    case 83:
      luigiBros.down()
      break
  }
}

function generarPlacapums() {
  const numeroAleatorioX = Math.floor(Math.random() * (500 - 1) + 1) //aqui nos dara un numero random para despues utilizarlo en x, este numero va del ancho del canvas - la imagen.width por eso nos da 500 y el otro minimo es el origen de x o sea 0
  const numeroAleatorioYL = Math.floor(Math.random() * (650 - 1) + 1)
  const numeroAleatorioYR = Math.floor(Math.random() * (650 - 1) + 1)
  if (frames % 350 === 0) {
    //esto nos da la frecuencia con la que se van generando los pipes
    arreDePlacapums.push(new Placapums(numeroAleatorioX, -70, images.placapumFront, 'front')) // cada uno de los push agrega un pide diferente
    arreDePlacapums.push(new Placapums(-70, numeroAleatorioYL, images.placapumLeft, 'left'))
    arreDePlacapums.push(
      new Placapums(canvas.width - 30, numeroAleatorioYR, images.placapumRight, 'right')
    )
  }
}

function drawPlacapums() {
  arreDePlacapums.forEach((elementoDeArray) => elementoDeArray.draw())
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  frames++
  campo.draw()
  marioBros.draw()
  luigiBros.draw()
  generarPlacapums()
  drawPlacapums()
  marioBros.limite()
  luigiBros.limite()
  requestAnimationFrame(update)
}
requestAnimationFrame(update)

// function start() {
//   if (interval) return
//   interval = setInterval(update, 1000 / 60)
// }

const ruler = () => {
  canvas.addEventListener('mousedown', function (clientX) {
    let rect = canvas.getBoundingClientRect()
    let clickX = event.clientX - rect.left
    let clickY = event.clientY - rect.top
    console.log(`clicked on (${Math.floor(clickX)},${Math.floor(clickY)})`)
    console.log(frames)
  })
}

ruler()
