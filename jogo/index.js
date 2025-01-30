const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // Tamanho de cada "bloco" da cobrinha
let score = 0; // Pontuação
let highscore = localStorage.getItem("highscore") ? parseInt(localStorage.getItem("highscore")) : 0; // Recorde

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
};

let d; // Direção

document.addEventListener("keydown", direction);
function direction(event) {
    if (event.key === "a" && d != "RIGHT") { // 'A' para mover para a esquerda
        d = "LEFT";
    } else if (event.key === "w" && d != "DOWN") { // 'W' para mover para cima
        d = "UP";
    } else if (event.key === "d" && d != "LEFT") { // 'D' para mover para a direita
        d = "RIGHT";
    } else if (event.key === "s" && d != "UP") { // 'S' para mover para baixo
        d = "DOWN";
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atualizar a posição da cobrinha
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box,
        };
        score++;
        if (score > highscore) {
            highscore = score;
            localStorage.setItem("highscore", highscore);
        }
    } else {
        snake.pop(); // Remove a última parte da cobrinha
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    // Verificar se a cobrinha colidiu com o corpo ou as bordas
    if (
        snakeX < 0 ||
        snakeX >= 400 ||
        snakeY < 0 ||
        snakeY >= 400 ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
    }

    snake.unshift(newHead);

    // Aqui a cobrinha agora será verde, sem diferenciação entre cabeça e corpo
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = "#00FF00"; // Cor verde
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#FF0000"; // Cor da comida (vermelha)
    ctx.fillRect(food.x, food.y, box, box);

    document.getElementById("score").textContent = score;
    document.getElementById("highscore").textContent = highscore;
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

let game = setInterval(draw, 100); // Jogo continua sendo desenhado a cada 100ms
