const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20; // Tamanho de cada "bloco" da cobrinha
let score = 0; // Pontuação
let highscore = localStorage.getItem("highscore") ? parseInt(localStorage.getItem("highscore")) : 0; // Recorde
// Posição inicial da cobrinha 
const initialPosition = { x: 9 * box, y: 10 * box };
let snake = [{ ...initialPosition }]; // A cobrinha começa no meio da tela
let food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
};
let d; // Direção
let primeiravida = localStorage.getItem("primeiravida"); // Segunda vida
let typedKeys = ""; // Acompanhando as teclas digitadas
let secondLifeActive = false; // Flag de segunda vida
// Obtenha o elemento de áudio
const backgroundMusic = document.getElementById("backgroundMusic");
// Iniciar a música quando o jogo começar (quando uma tecla for pressionada)
document.addEventListener("keydown", () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play(); // Começa a música se estiver pausada
    }
});
// Função para mudar a direção da cobrinha
document.addEventListener("keydown", direction);
function direction(event) {
    if (event.keyCode == 37 && d != "RIGHT") {
        d = "LEFT";
    } else if (event.keyCode == 38 && d != "DOWN") {
        d = "UP";
    } else if (event.keyCode == 39 && d != "LEFT") {
        d = "RIGHT";
    } else if (event.keyCode == 40 && d != "UP") {
        d = "DOWN";
    }
    // Digitar "bonus" reinicia o jogo
    typedKeys += event.key.toLowerCase();
    if (typedKeys.includes("bonus")) {
        restartGame();
        typedKeys = "";
        alert('EXTRA LIFE');
    }
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Atualiza posição da cobrinha
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;
    // Se a cobrinha comer a comida
    if (snakeX == food.x && snakeY == food.y) {
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box,
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
        snakeX >= canvas.width ||
        snakeY < 0 ||
        snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        if (!primeiravida) {
            localStorage.setItem("primeiravida", true);
            window.location.reload();
        } else {
            clearInterval(game);
            backgroundMusic.pause(); // Pausar a música quando o jogo acabar
            backgroundMusic.currentTime = 0; // Reseta o tempo da música
            alert("Game Over!");
        }
    }
    snake.unshift(newHead);
    // Desenhar a cobrinha
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = "#00FF00"; // Cor verde
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
    // Desenhar a comida
    ctx.fillStyle = "#FF0000"; // Cor da comida 
    ctx.fillRect(food.x, food.y, box, box);
    // Atualizar os elementos da pontuação
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
function restartGame() {
    // Reiniciar o jogo
    snake = [{ ...initialPosition }];
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
    score ; // Resetando a pontuação
    d = undefined;
    typedKeys = "";
    secondLifeActive = false;
    // Reiniciar o jogo
    game = setInterval(draw, 85);
}
let game = setInterval(draw, 85); // Jogo continua sendo desenhado a cada 85m
