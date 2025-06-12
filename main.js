const canvas = document.getElementById('hearts');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const hearts = [];
const numHearts = 30;
const photosContainer = document.getElementById('photos');

// Lista de caminhos para suas fotos
const photoUrls = [
    'image1.JPG',
    'image7.JPG',
    'image3.JPG',
    'image4.JPG',
    'image5.JPG',
    'image6.JPG',
    'image8.JPG',
    'image9.JPG'
   
];

const photos = [];
let expandedPhoto = null;

// Função para desenhar um coração estilizado
function drawHeart(ctx, x, y, size, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(
        x, y,
        x - size / 2, y,
        x - size / 2, y + size / 4
    );
    ctx.bezierCurveTo(
        x - size / 2, y + size / 2,
        x, y + size / 1.2,
        x, y + size
    );
    ctx.bezierCurveTo(
        x, y + size / 1.2,
        x + size / 2, y + size / 2,
        x + size / 2, y + size / 4
    );
    ctx.bezierCurveTo(
        x + size / 2, y,
        x, y,
        x, y + size / 4
    );
    ctx.closePath();
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

// Corações com propriedades variadas
for (let i = 0; i < numHearts; i++) {
    hearts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 30 + 20,
        speed: Math.random() * 1.2 + 0.5,
        alpha: Math.random() * 0.5 + 0.5,
        color: `hsl(${Math.random() * 20 + 340}, 80%, 65%)`
    });
}

// Fotos com estilo moderno
for (let i = 0; i < photoUrls.length; i++) {
    const img = new Image();
    img.src = photoUrls[i];
    img.className = 'photo';
    img.style.position = 'absolute';
    img.style.width = '120px';
    img.style.height = '120px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '24px';
    img.style.boxShadow = '0 8px 32px rgba(255,0,80,0.25)';
    img.style.transition = 'transform 0.3s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.3s, left 0.3s, top 0.3s, width 0.3s, height 0.3s, border-radius 0.3s';
    let startX = Math.random() * (window.innerWidth - 120);
    let startY = Math.random() * (window.innerHeight - 120);
    img.style.left = `${startX}px`;
    img.style.top = `${startY}px`;
    img.addEventListener('mouseenter', () => {
        if (expandedPhoto !== img) {
            img.style.transform = 'scale(1.12) rotate(-3deg)';
            img.style.boxShadow = '0 16px 48px rgba(255,0,80,0.35)';
        }
    });
    img.addEventListener('mouseleave', () => {
        if (expandedPhoto !== img) {
            img.style.transform = '';
            img.style.boxShadow = '0 8px 32px rgba(255,0,80,0.25)';
        }
    });
    img.addEventListener('click', () => {
        if (expandedPhoto === img) {
            // Volta ao normal
            expandedPhoto = null;
            img.style.zIndex = '';
            img.style.width = '120px';
            img.style.height = '120px';
            img.style.left = img.dataset.originalLeft;
            img.style.top = img.dataset.originalTop;
            img.style.borderRadius = '24px';
            img.style.transform = '';
            img.style.boxShadow = '0 8px 32px rgba(255,0,80,0.25)';
            photos.forEach(photo => photo.movable = true);
        } else {
            // Expande a imagem
            if (expandedPhoto) {
                // Volta a anterior ao normal
                expandedPhoto.click();
            }
            expandedPhoto = img;
            img.dataset.originalLeft = img.style.left;
            img.dataset.originalTop = img.style.top;
            img.style.zIndex = '1000';
            img.style.width = '340px';
            img.style.height = '340px';
            img.style.left = `${(window.innerWidth - 340) / 2}px`;
            img.style.top = `${(window.innerHeight - 340) / 2}px`;
            img.style.borderRadius = '40px';
            img.style.transform = 'scale(1.04)';
            img.style.boxShadow = '0 24px 64px rgba(255,0,80,0.45)';
            photos.forEach(photo => photo.movable = (photo.element !== img));
        }

        // Chuva de "eu te amo, feliz dia dos namorados" + fogos para image8.JPG e image9.JPG
        if (photoUrls[i] === 'image8.JPG' || photoUrls[i] === 'image9.JPG') {
            startLoveRain();
            startFireworks();
        }
    });
    // Movimento diagonal: cada foto tem velocidade em X e Y (mais lento)
    const directionX = Math.random() > 0.5 ? 1 : -1;
    const directionY = Math.random() > 0.5 ? 1 : -1;
    photos.push({
        element: img,
        speedX: (Math.random() * 0.5 + 0.15) * directionX, // velocidade reduzida
        speedY: (Math.random() * 0.5 + 0.15) * directionY, // velocidade reduzida
        movable: true
    });
    photosContainer.appendChild(img);
}

// --- Chuva de "eu te amo, feliz dia dos namorados" ---
let loveRainActive = false;
function startLoveRain() {
    if (loveRainActive) return;
    loveRainActive = true;
    const rainContainer = document.createElement('div');
    rainContainer.style.position = 'fixed';
    rainContainer.style.left = '0';
    rainContainer.style.top = '0';
    rainContainer.style.width = '100vw';
    rainContainer.style.height = '100vh';
    rainContainer.style.pointerEvents = 'none';
    rainContainer.style.zIndex = '2000';
    rainContainer.id = 'love-rain';
    document.body.appendChild(rainContainer);

    const messages = [];
    for (let i = 0; i < 40; i++) {
        const msg = document.createElement('div');
        msg.textContent = 'eu te amo, feliz dia dos namorados';
        msg.style.position = 'absolute';
        msg.style.left = `${Math.random() * (window.innerWidth - 320)}px`;
        msg.style.top = `${-Math.random() * 100}px`;
        msg.style.fontSize = `${Math.random() * 16 + 18}px`;
        msg.style.fontWeight = 'bold';
        msg.style.color = `hsl(${Math.random() * 20 + 340}, 80%, 65%)`;
        msg.style.textShadow = '0 2px 8px #fff, 0 0 16px #ff0080';
        msg.style.opacity = '0.92';
        msg.style.userSelect = 'none';
        msg.style.transition = 'opacity 0.5s';
        rainContainer.appendChild(msg);
        messages.push({
            el: msg,
            x: parseFloat(msg.style.left),
            y: parseFloat(msg.style.top),
            speed: Math.random() * 1.5 + 1.2,
            drift: (Math.random() - 0.5) * 0.7
        });
    }

    function animateRain() {
        let allGone = true;
        for (const m of messages) {
            m.y += m.speed;
            m.x += m.drift;
            m.el.style.top = `${m.y}px`;
            m.el.style.left = `${m.x}px`;
            if (m.y < window.innerHeight + 40) {
                allGone = false;
            } else {
                m.el.style.opacity = '0';
            }
        }
        if (!allGone) {
            requestAnimationFrame(animateRain);
        } else {
            setTimeout(() => {
                rainContainer.remove();
                loveRainActive = false;
            }, 800);
        }
    }
    animateRain();
}

// --- Fogos de artifício simples ---
let fireworksActive = false;
function startFireworks() {
    if (fireworksActive) return;
    fireworksActive = true;
    const fwCanvas = document.createElement('canvas');
    fwCanvas.style.position = 'fixed';
    fwCanvas.style.left = '0';
    fwCanvas.style.top = '0';
    fwCanvas.style.width = '100vw';
    fwCanvas.style.height = '100vh';
    fwCanvas.style.pointerEvents = 'none';
    fwCanvas.style.zIndex = '2100';
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
    document.body.appendChild(fwCanvas);

    const fwCtx = fwCanvas.getContext('2d');
    const particles = [];

    function createFirework() {
        const x = Math.random() * fwCanvas.width * 0.8 + fwCanvas.width * 0.1;
        const y = Math.random() * fwCanvas.height * 0.4 + fwCanvas.height * 0.2;
        const color = `hsl(${Math.random() * 360}, 90%, 60%)`;
        for (let i = 0; i < 48; i++) {
            const angle = (i / 48) * 2 * Math.PI;
            const speed = Math.random() * 4 + 2.5;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color
            });
        }
    }

    let fireworkCount = 0;
    function animateFireworks() {
        fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            fwCtx.save();
            fwCtx.globalAlpha = p.alpha;
            fwCtx.beginPath();
            fwCtx.arc(p.x, p.y, 2.2, 0, 2 * Math.PI);
            fwCtx.fillStyle = p.color;
            fwCtx.shadowColor = p.color;
            fwCtx.shadowBlur = 16;
            fwCtx.fill();
            fwCtx.restore();

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.04; // gravity
            p.alpha -= 0.018 + Math.random() * 0.01;
            if (p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }
        if (fireworkCount < 5 && Math.random() < 0.18) {
            createFirework();
            fireworkCount++;
        }
        if (particles.length > 0 || fireworkCount < 5) {
            requestAnimationFrame(animateFireworks);
        } else {
            setTimeout(() => {
                fwCanvas.remove();
                fireworksActive = false;
            }, 800);
        }
    }
    animateFireworks();
}

function drawHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(heart => {
        drawHeart(ctx, heart.x, heart.y, heart.size, heart.color, heart.alpha);
        heart.y -= heart.speed;
        if (heart.y < -heart.size) {
            heart.y = canvas.height + heart.size;
            heart.x = Math.random() * canvas.width;
        }
    });

    photos.forEach(photo => {
        if (photo.movable) {
            let x = parseFloat(photo.element.style.left);
            let y = parseFloat(photo.element.style.top);
            x += photo.speedX;
            y += photo.speedY;
            if (x > window.innerWidth - 120 || x < 0) {
                photo.speedX = -photo.speedX;
            }
            if (y > window.innerHeight - 120 || y < 0) {
                photo.speedY = -photo.speedY;
            }
            photo.element.style.left = `${x}px`;
            photo.element.style.top = `${y}px`;
        }
    });

    requestAnimationFrame(drawHearts);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Se alguma foto estiver expandida, centraliza novamente
    if (expandedPhoto) {
        expandedPhoto.style.left = `${(window.innerWidth - 340) / 2}px`;
        expandedPhoto.style.top = `${(window.innerHeight - 340) / 2}px`;
    }
});

drawHearts();

const starCanvas = document.createElement('canvas');
starCanvas.style.position = 'fixed';
starCanvas.style.top = '0';
starCanvas.style.left = '0';
starCanvas.style.width = '100vw';
starCanvas.style.height = '100vh';
starCanvas.style.zIndex = '-2';
starCanvas.width = window.innerWidth;
starCanvas.height = window.innerHeight;
document.body.insertBefore(starCanvas, document.body.firstChild);

const starCtx = starCanvas.getContext('2d');
const stars = [];
const shootingStars = [];

function createStars() {
    stars.length = 0;
    for (let i = 0; i < 180; i++) {
        stars.push({
            x: Math.random() * starCanvas.width,
            y: Math.random() * starCanvas.height,
            r: Math.random() * 1.2 + 0.2,
            alpha: Math.random() * 0.5 + 0.5
        });
    }
}

function createShootingStar() {
    if (Math.random() < 0.012) {
        const y = Math.random() * starCanvas.height * 0.7;
        shootingStars.push({
            x: Math.random() * starCanvas.width * 0.8,
            y: y,
            len: Math.random() * 80 + 80,
            speed: Math.random() * 8 + 8,
            alpha: 1,
            life: 0
        });
    }
}

function drawStarsBg() {
    // Fundo preto sólido
    starCtx.fillStyle = '#000';
    starCtx.fillRect(0, 0, starCanvas.width, starCanvas.height);

    // Estrelas fixas
    for (const s of stars) {
        starCtx.save();
        starCtx.globalAlpha = s.alpha;
        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
        starCtx.fillStyle = '#fff';
        starCtx.shadowColor = '#fff';
        starCtx.shadowBlur = 8;
        starCtx.fill();
        starCtx.restore();
    }

    // Estrelas cadentes
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        starCtx.save();
        starCtx.globalAlpha = ss.alpha;
        starCtx.strokeStyle = 'white';
        starCtx.lineWidth = 2;
        starCtx.shadowColor = '#fff';
        starCtx.shadowBlur = 12;
        starCtx.beginPath();
        starCtx.moveTo(ss.x, ss.y);
        starCtx.lineTo(ss.x + ss.len, ss.y + ss.len * 0.2);
        starCtx.stroke();
        starCtx.restore();

        ss.x += ss.speed;
        ss.y += ss.speed * 0.2;
        ss.alpha -= 0.012;
        ss.life += 1;
        if (ss.alpha <= 0 || ss.x > starCanvas.width || ss.y > starCanvas.height) {
            shootingStars.splice(i, 1);
        }
    }
}

function animateStars() {
    drawStarsBg();
    createShootingStar();
    requestAnimationFrame(animateStars);
}

window.addEventListener('resize', () => {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
    createStars();
});

createStars();
animateStars();
