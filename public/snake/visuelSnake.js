// ==========================================
// GESTION DE LA MUSIQUE ET DES LUMIÈRES
// ==========================================

const canvasVisu = document.getElementById('visualizer-canvas');
const ctxVisu = canvasVisu.getContext('2d');
const music = document.getElementById('game-music');

let audioCtx, analyser, source, dataArray;
let isAudioInitialized = false;
let width, height;

// 1. CONFIGURATION DES FAISCEAUX
const beams = [
    { x: 0.1, color: '0, 255, 136', speed: 0.002, angle: 0.2 },
    { x: 0.3, color: '0, 100, 255', speed: -0.003, angle: -0.1 },
    { x: 0.5, color: '180, 0, 255', speed: 0.001, angle: 0 },
    { x: 0.7, color: '0, 100, 255', speed: 0.002, angle: 0.1 },
    { x: 0.9, color: '0, 255, 136', speed: -0.002, angle: -0.2 }
];

// 2. CLASSE PARTICULE
class Particle {
    constructor() {
        this.reset();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + 20; 
        this.radius = Math.random() * 5 + 2; 
        this.speed = Math.random() * 1 + 0.5;
        this.hue = Math.random() * 360;
        this.drift = (Math.random() - 0.5) * 1; 
    }

    update(bassIntensity) {
        let boost = bassIntensity * 20; 
        this.y -= (this.speed + boost);
        this.x += this.drift;
        if (this.y < -50) this.reset();
    }

    draw(bassIntensity) {
        let alpha = 0.1 + bassIntensity; 
        let r = this.radius * (0.5 + bassIntensity * 10); 
        ctxVisu.beginPath();
        const h = (this.hue + bassIntensity * 100) % 360; 
        const gradient = ctxVisu.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
        gradient.addColorStop(0, `hsla(${h}, 100%, 80%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${h}, 100%, 50%, 0)`);
        ctxVisu.fillStyle = gradient;
        ctxVisu.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctxVisu.fill();
    }
}

const particles = [];
const PARTICLE_COUNT = 60;

function resize() {
    width = canvasVisu.width = window.innerWidth;
    height = canvasVisu.height = window.innerHeight;
    particles.length = 0;
    for(let i=0; i<PARTICLE_COUNT; i++) particles.push(new Particle());
}
window.addEventListener('resize', resize);
resize();

// 3. SYSTÈME AUDIO
function startAudioSystem() {
    if (isAudioInitialized) return;
    music.volume = 0.6; 
    music.play().then(() => {
        setupAnalyser();
    }).catch(e => {});
}

function setupAnalyser() {
    if(isAudioInitialized) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaElementSource(music);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256; 
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    isAudioInitialized = true;
}

// --- NOUVEAU : GESTION PAUSE (ESPACE) ---
window.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
        // Empêcher le scroll de la page quand on appuie sur espace
        e.preventDefault(); 

        if (music.paused) {
            music.play();
            // Si le système audio n'était pas encore lancé (cas rare), on le lance
            if (!isAudioInitialized) startAudioSystem();
        } else {
            music.pause();
        }
    }
});

// Déclencheur initial
['click', 'keydown'].forEach(evt => {
    window.addEventListener(evt, startAudioSystem, { once: true });
});
startAudioSystem();

// 4. ANIMATION
function drawScene() {
    requestAnimationFrame(drawScene);

    let bassIntensity = 0;

    // On ne calcule l'intensité que si la musique JOUE
    if(isAudioInitialized && !music.paused) {
        analyser.getByteFrequencyData(dataArray);
        let bassSum = 0;
        for(let i=0; i<4; i++) bassSum += dataArray[i];
        let rawBass = (bassSum / 4) / 255; 
        bassIntensity = Math.pow(rawBass, 5); 
    } else {
        // Si musique en pause, intensité forcée à 0
        bassIntensity = 0;
    }

    if (bassIntensity < 0.15) {
        bassIntensity = 0;
    }

    ctxVisu.clearRect(0, 0, width, height);
    ctxVisu.globalCompositeOperation = 'screen'; 

    const now = Date.now();

    beams.forEach(beam => {
        if(bassIntensity === 0) return;

        ctxVisu.save();
        ctxVisu.translate(width * beam.x, height + 50);
        const movement = Math.sin(now * beam.speed) * 0.3;
        ctxVisu.rotate(beam.angle + movement);
        
        const h = height * (bassIntensity * 3); 
        const wTop = 50 + (bassIntensity * 300);
        const wBot = 5;
        
        const g = ctxVisu.createLinearGradient(0, 0, 0, -h);
        g.addColorStop(0, `rgba(${beam.color}, ${bassIntensity})`);
        g.addColorStop(1, `rgba(${beam.color}, 0)`);
        
        ctxVisu.fillStyle = g;
        ctxVisu.beginPath();
        ctxVisu.moveTo(-wBot, 0); ctxVisu.lineTo(-wTop, -h);
        ctxVisu.lineTo(wTop, -h); ctxVisu.lineTo(wBot, 0);
        ctxVisu.fill();
        ctxVisu.restore();
    });

    ctxVisu.globalCompositeOperation = 'lighter'; 
    particles.forEach(p => {
        // Si la musique est en pause, les particules s'arrêtent de bouger
        // ou bougent très lentement (optionnel)
        p.update(bassIntensity);
        p.draw(bassIntensity);
    });
}

drawScene();

window.addEventListener('beforeunload', () => music.pause());