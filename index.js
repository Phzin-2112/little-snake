const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");




const box = 20; // Tamanho de cada "bloco" da cobrinha
let score = 0; // Pontuação
let highscore = localStorage.getItem("highscore") ? parseInt(localStorage.getItem("highscore")) : 0; // Recorde




// Posição inicial da cobrinha no meio da tela
const initialPosition = { x: 9 * box, y: 10 * box };
let snake = [{ ...initialPosition }]; // A cobrinha começa no meio da tela




let food = {
    x: Math.floor(Math.random() * 22 + 1) * box,
    y: Math.floor(Math.random() * 24 + 1) * box,
};




let d; // Direção
let primeiravida = localStorage.getItem("primeiravida"); // Flag para a segunda vida
let typedKeys = ""; // Acompanhando as teclas digitadas
let secondLifeActive = false; // Flag de segunda vida




document.addEventListener("keydown", direction);




function direction(event) {
    if (event.keyCode == 37 && d != "d") {
        d = "LEFT";
    } else if (event.keyCode == 38 && d != "s") {
        d = "UP";
    } else if (event.keyCode == 39 && d != "a") {
        d = "RIGHT";
    } else if (event.keyCode == 40 && d != "w") {
        d = "DOWN";
    }
    else if (event.key === "a" && d != "RIGHT") { 
        d = "LEFT";
    } else if (event.key === "w" && d != "DOWN") { 
        d = "UP";
    } else if (event.key === "d" && d != "LEFT") { 
        d = "RIGHT";
    } else if (event.key === "s" && d != "UP") { 
        d = "DOWN";
    }




    // Reiniciar o jogo com codigo
    typedKeys += event.key.toLowerCase();
    if (typedKeys.includes("phzin")) {
        restartGame(); // Reiniciar o jogo quando "reset" for digitado
        typedKeys = ""; // Resetar as teclas digitadas após reiniciar
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
            x: Math.floor(Math.random() * 22 + 1) * box,
            y: Math.floor(Math.random() * 24 + 1) * box,
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
        snakeX >= 1000 ||
        snakeY < 0 ||
        snakeY >= 600 ||
        collision(newHead, snake)
    ) {
        if (!primeiravida) {
            localStorage.setItem("primeiravida", true);
            window.location.reload();
        } else {
            clearInterval(game);
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
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box,
    };
    score ;
    d = undefined;
    typedKeys = "";
    secondLifeActive = false;
    // Reiniciar o jogo
    game = setInterval(draw, 100);
}




let game = setInterval(draw, 100); // Jogo continua sendo desenhado a cada 100ms
