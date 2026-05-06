// pesquisei como usar o typecasting, já que o intelisense não tava funcionando.
// O typecasting é basicamente um jeito de tratar um valor de tipo desconhecido como o desejado.
// Por exemplo, a variável personagem pode ser um canvas, ou um Null (caso ele não consiga achar o elemento), então é preciso especificar: "Isso aqui é um canvas"
const personagem = /** @type {HTMLCanvasElement} */ ( document.getElementById("personagem"))
const ctx = personagem.getContext("2d")

const spriteSheet = document.getElementById("spritesheet")

let viewportSize_X, viewportSize_Y

// configurações
const size = 10 // tamanho
const speed = 30 // velocidade

// funcionalidade
let posx = 0
let posy = 0

const directionalKeys = {
    down: ["ArrowDown", "s"],
    left: ["ArrowLeft", "a"],
    up: ["ArrowUp", "w"],
    right: ["ArrowRight", "d"]
}

const spriteHeight = 32 * size
const spriteWidth = 24 * size

let value = 1;
let dir = .3;
let step = 1

// aos poucos, retorna uma sequencia de 1, 2, 3, 2, 1, 2... 
function next() {
  value += dir;
  if (value > 3 || value < 1) {
    dir *= -1;
  }

  return Math.round(value);
}
StartGame()

// função que roda toda vez que a janela muda de tamanho
function Draw(row)
{
    step = next()
    
    ctx.clearRect(0,0, personagem.width, personagem.height)
    ctx.imageSmoothingEnabled = false; // desliga o anti-aliasing (pixels borrados)
 //   console.log(step-1, row)
    ctx.drawImage(
        // imagem
        spriteSheet, 
        // recorte (24, 32)
        24*(step-1), 33*(row-1), 24, 32,
        // posição
        posx, posy, 
        // tamanho
        spriteWidth, spriteHeight
    )
}

function ViewportSizeUpdate()
{
    viewportSize_X = window.innerWidth-30
    viewportSize_Y = window.innerHeight-30

    personagem.width = viewportSize_X;
    personagem.height = viewportSize_Y;

    UpdatePosition(0,0, 1)
}

function GetDirection(key)
{
    let x = 0
    let y = 0
    let row
    if (directionalKeys.down.includes(key))
    {
        y = -1
        row = 3
    }
    else if (directionalKeys.left.includes(key))
    {
        x = -1
        row = 4
    }
    else if (directionalKeys.up.includes(key))
    {
        y = 1
        row = 1
    }
    else if (directionalKeys.right.includes(key))
    {
        x = 1
        row = 2
    }

    // retorna um array com um incremento da posição X e Y
    // fiz dessa maneira pois tinha mais liberdade sobre cada eixo
    return [x*speed, y*speed, row]
}

// math.clamp é uma função presente em diversas linguagens que limitam um número em um intervalo, copiei a formula e adaptei para o java script!
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function UpdatePosition(x, y, row)
{
    posx = clamp(posx + x, 0, personagem.width- spriteWidth)
    posy = clamp(posy - y, 0, personagem.height- spriteHeight)
    
    Draw(row)
}

// iniciar
function StartGame()
{
    document.addEventListener("keydown", (event)=>{
        const key = event.key
    
        // pega o array retornado pela função e decompacta seus valores
        const [x, y, row] = GetDirection(key)
        if (x === 0 && y === 0)
            return

        UpdatePosition(x, y, row)
    })
    window.addEventListener("resize", ViewportSizeUpdate)
    ViewportSizeUpdate()
    UpdatePosition(0,0)
}