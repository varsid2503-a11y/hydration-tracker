const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 500;

let player = { x: 125, y: 400, w: 40, h: 70, speed: 7 };
let traffic = [];
let score = 0;
let gameActive = true;
let keys = {};
let highScore = localStorage.getItem('racingHighScore') || 0;
document.getElementById('highScore').innerText = "Best: " + highScore;

// Handle Keys
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

function spawnTraffic() {
    if (Math.random() < 0.02) { // 2% chance every frame to spawn a car
        let lane = Math.floor(Math.random() * 3); // 3 random lanes
        traffic.push({
            x: lane * 100 + 30, // Centers car in lane
            y: -100, 
            w: 40, 
            h: 70, 
            speed: 3 + (score / 100) // Gets faster as you score!
        });
    }
}

function checkCollision(p, t) {
    return p.x < t.x + t.w &&
           p.x + p.w > t.x &&
           p.y < t.y + t.h &&
           p.y + p.h > t.y;
}

function update() {
    let roadOffset = 0;

function drawRoad() {
    ctx.fillStyle = "#444";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Darker road
    
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.setLineDash([30, 30]); // Dashed lines
    ctx.lineDashOffset = -roadOffset;
    
    // Draw two lane lines
    ctx.beginPath();
    ctx.moveTo(100, 0); ctx.lineTo(100, canvas.height);
    ctx.moveTo(200, 0); ctx.lineTo(200, canvas.height);
    ctx.stroke();
    
    roadOffset += 15; // This controls the "speed" of the road
}

    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoad();

    // 1. Move Player
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.w) player.x += player.speed;

    // 2. Draw Player
    ctx.fillStyle = '#00b4d8'; // Your Blue
    ctx.fillRect(player.x, player.y, player.w, player.h);

    // 3. Handle Traffic
    spawnTraffic();
    traffic.forEach((car, index) => {
        car.y += car.speed;
        ctx.fillStyle = '#ff4d4d'; // Red Enemy Cars
        ctx.fillRect(car.x, car.y, car.w, car.h);

        // Check for Crash
        if (checkCollision(player, car)) {
           if (checkCollision(player, car)) {
    gameActive = false;

    // Check if we set a new record
    if (score > highScore) {
        localStorage.setItem('racingHighScore', score);
        alert("NEW HIGH SCORE: " + score + "!");
    } else {
        alert("GAME OVER! Score: " + score);
    }
    
    location.reload(); 
}// Restart game
        }

        // Remove old cars & add score
        if (car.y > canvas.height) {
            traffic.splice(index, 1);
            score += 10;
            document.getElementById('score').innerText = "Score: " + score;
        }
    });

    requestAnimationFrame(update);
}

update();

const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

// Touch Start (Mobile)
leftBtn.addEventListener('touchstart', () => keys['ArrowLeft'] = true);
rightBtn.addEventListener('touchstart', () => keys['ArrowRight'] = true);

// Touch End (Mobile)
leftBtn.addEventListener('touchend', () => keys['ArrowLeft'] = false);
rightBtn.addEventListener('touchend', () => keys['ArrowRight'] = false);

// Also works for Mouse Clicks (for testing on PC)
leftBtn.addEventListener('mousedown', () => keys['ArrowLeft'] = true);
rightBtn.addEventListener('mousedown', () => keys['ArrowRight'] = true);
window.addEventListener('mouseup', () => {
    keys['ArrowLeft'] = false;
    keys['ArrowRight'] = false;
});