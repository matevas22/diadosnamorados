const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const shootingStars = [];
const numStars = 200;

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

// Cria estrelas normais
for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: randomBetween(0.5, 2.5),
        speed: randomBetween(0.1, 0.6),
        alpha: randomBetween(0.3, 1)
    });
}

// Cria uma estrela cadente
function createShootingStar() {
    const y = randomBetween(0, canvas.height / 2);
    shootingStars.push({
        x: randomBetween(canvas.width * 0.3, canvas.width),
        y: y,
        len: randomBetween(80, 200),
        speed: randomBetween(8, 16),
        size: randomBetween(1, 2),
        alpha: 1,
        life: 0
    });
}

// Fundo gradiente
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0a0a1a");
    gradient.addColorStop(1, "#1a1a2e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStars() {
    drawBackground();

    // Estrelas normais
    stars.forEach(star => {
        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        // Movimento lento
        star.x -= star.speed;
        if (star.x < 0) {
            star.x = canvas.width;
            star.y = Math.random() * canvas.height;
        }
    });

    // Estrelas cadentes
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.len * -0.7, s.y + s.len * 0.7);
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.restore();

        s.x -= s.speed;
        s.y += s.speed;
        s.alpha -= 0.01;
        s.life++;

        if (s.alpha <= 0 || s.x < 0 || s.y > canvas.height) {
            shootingStars.splice(i, 1);
        }
    }

    // Chance de criar estrela cadente
    if (Math.random() < 0.015) createShootingStar();

    requestAnimationFrame(drawStars);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

drawStars();