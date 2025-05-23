const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 200, y: 200 }];
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
let direction = "RIGHT";
let score = 0;
let records = JSON.parse(localStorage.getItem("records")) || [];
let maxRecord = records.length ? Math.max(...records) : 0;

document.addEventListener("keydown", (event) => {
    const key = event.keyCode;
    if (key == 37 && direction !== "RIGHT") changeDirection("LEFT");
    else if (key == 38 && direction !== "DOWN") changeDirection("UP");
    else if (key == 39 && direction !== "LEFT") changeDirection("RIGHT");
    else if (key == 40 && direction !== "UP") changeDirection("DOWN");
});

function changeDirection(newDirection) {
    if ((newDirection === "LEFT" && direction !== "RIGHT") ||
        (newDirection === "UP" && direction !== "DOWN") ||
        (newDirection === "RIGHT" && direction !== "LEFT") ||
        (newDirection === "DOWN" && direction !== "UP")) {
        direction = newDirection;
        draw()
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar comida
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Dibujar serpiente
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "lightgreen";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Nueva posición de la serpiente
    let newX = snake[0].x;
    let newY = snake[0].y;

    if (direction === "LEFT") newX -= box;
    if (direction === "UP") newY -= box;
    if (direction === "RIGHT") newX += box;
    if (direction === "DOWN") newY += box;

    // Colisión con la comida
    if (newX === food.x && newY === food.y) {
        score++;
        document.getElementById("scoreValue").textContent = score;
        food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    } else {
        snake.pop();
    }

    // Colisión con paredes o con sí misma
    if (newX < 0 || newY < 0 || newX >= canvas.width || newY >= canvas.height || snake.some(part => part.x === newX && part.y === newY)) {
        gameOver();
        return;
    }

    snake.unshift({ x: newX, y: newY });
}

function gameOver() {
    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameOverScreen").style.display = "block";

    // Guardar récord
    records.push(score);
    records.sort((a, b) => b - a);
    localStorage.setItem("records", JSON.stringify(records));

    maxRecord = Math.max(...records);
    document.getElementById("recordValue").textContent = maxRecord;
}

function restartGame() {
    location.reload();
}

function viewRecords() {
    alert("Récords: " + records.join(", "));
}

setInterval(draw, 400);
