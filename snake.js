function drawRect(param) {
  context.beginPath()
  context.rect(param.x, param.y, param.width, param.height)
  context.fillStyle = param.fillColor
  context.fill()
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height)
}

function creatGameMap(columns, rows) {
  const map = []
  for (let x = 0; x < columns; x++) {
    const row = []
    for (let y = 0; y < rows; y++) {
      row.push({
        x: x,
        y: y,
        snake: false,
        food: false,
        poison: false
      })
    }
    map.push(row)
  }
  return map
}

function getRandomFreeCell(map) {
  const freeCells = []
  for (const cell of map.flat()) {
    if (cell.snake || cell.food || cell.poison) {
      continue
    }
    freeCells.push(cell)
  }
  const index = Math.floor(Math.random() * freeCells.length)
  return freeCells[index]
}

function drawGameMap(map) {
  for (const cell of map.flat()) {
    const param = {
      x: GAME_PADDING + cell.x * (CELL_SIZE + CELL_MARGIN),
      y: GAME_PADDING + cell.y * (CELL_SIZE + CELL_MARGIN),
      width: CELL_SIZE,
      height: CELL_SIZE,
      fillColor: FREE_COLOR
    }
    if (cell.food) {
      param.fillColor = FOOD_COLOR
    }
    if (cell.poison) {
      param.fillColor = POISON_COLOR
    }
    if (cell.snake) {
      param.fillColor = SNAKE_COLOR
    }
    drawRect(param)
  }
}

function getCell(x, y) {
  if (x < 0) {
    x += COLUMNS
  }
  if (x >= COLUMNS) {
    x -= COLUMNS
  }
  if (y < 0) {
    y += ROWS
  }
  if (y >= ROWS) {
    y -= ROWS
  }

  for (const cell of map.flat()) {
    if (cell.x === x && cell.y === y) {
      return cell
    }
  }
}

function moveSnake() {
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = snake[i - 1]
  }
  if (snakeDirect === 'left') {
    snake[0] = getCell(snake[0].x - 1, snake[0].y)
  } else if (snakeDirect === 'right') {
    snake[0] = getCell(snake[0].x + 1, snake[0].y)
  } else if (snakeDirect === 'up') {
    snake[0] = getCell(snake[0].x, snake[0].y - 1)
  } else if (snakeDirect === 'down') {
    snake[0] = getCell(snake[0].x, snake[0].y + 1)
  }
  for (const cell of map.flat()) {
    cell.snake = false
  }
  for (const cell of snake) {
    cell.snake = true
  }
}

function showState() {
  context.font = "30px Roboto"
  context.fillStyle = "black"
  context.textAlign = "left"
  context.fillText(`Cooldown: ${cooldown}`, 10, 50)
  context.fillText(`Points: ${snake.length * 5}`, 10, 100)
}

function drawPaused() {
  context.beginPath()
  context.rect(0, 0, canvas.width, canvas.height)
  context.fillStyle = 'rgba(255, 255, 255, 0.7)'
  context.fill()

  context.font = "60px Roboto"
  context.fillStyle = "black"
  context.textAlign = "center"
  context.fillText(`Your points: ${snake.length * 5}`, canvas.width / 2, canvas.height / 2)
  context.font = "40px Roboto"
  context.fillText("Press enter to continue", canvas.width / 2, canvas.height / 2 + 50)
}

function init() {
  map = creatGameMap(COLUMNS, ROWS)
  getRandomFreeCell(map).food = true
  getRandomFreeCell(map).poison = true

  const cell = getRandomFreeCell(map)
  snake = [cell]

  cell.snake = true

  snakeDirect = 'up'
  nextSnakeDirect = 'up'
  play = true
  cooldown = START_COOLDOWN
}