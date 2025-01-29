const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tamanho do bloco e a direção inicial da cobrinha
const blockSize = 20;
let snake = [{ x: 160, y: 160 }]; // Começando no centro
let direction = "RIGHT";
let food = { x: 80, y: 80 };
let score = 0;

// Controle da direção
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    } else if (event.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    } else if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    }
}

// Função para desenhar a cobrinha
function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = "green";
        ctx.fillRect(segment.x, segment.y, blockSize, blockSize);
    });
}

// Função para desenhar a comida
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, blockSize, blockSize);
}

// Função para mover a cobrinha
function moveSnake() {
    let head = { ...snake[0] };

    if (direction === "UP") {
        head.y -= blockSize;
    } else if (direction === "DOWN") {
        head.y += blockSize;
    } else if (direction === "LEFT") {
        head.x -= blockSize;
    } else if (direction === "RIGHT") {
        head.x += blockSize;
    }

    snake.unshift(head);
    
    // Verifica se a cobrinha comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}

// Função para gerar nova comida em uma posição aleatória
function generateFood() {
    const x = Math.floor(Math.random() * (canvas.width / blockSize)) * blockSize;
    const y = Math.floor(Math.random() * (canvas.height / blockSize)) * blockSize;
    food = { x, y };
}

// Função para verificar colisões
function checkCollisions() {
    const head = snake[0];
    
    // Colisão com as bordas
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    // Colisão com o corpo da cobrinha
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }

    return false;
}

// Função para desenhar o jogo
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();

    moveSnake();

    if (checkCollisions()) {
        alert("Game Over! Pontuação: " + score);
        document.location.reload(); // Reinicia o jogo
    }
}

// Atualizar a tela a cada 100 milissegundos
setInterval(drawGame, 100);
