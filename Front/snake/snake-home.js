// ============================================
// CONFIGURATION DU SNAKE DÉCORATIF
// ============================================

const CONFIG = {
	segmentSize: 20,
	snakeLength: 15,
	speed: 1.5,
	turnChance: 0.02,

	// Couleurs
	headColor: "#00ff88",
	bodyColorStart: "#00cc6a",
	bodyColorEnd: "#006633",
	eyeColor: "#ffffff",
	pupilColor: "#000000",

	// Lien vers le jeu
	gameUrl: "snake/snake.html",
};

// ============================================
// CLASSE SNAKE DÉCORATIF
// ============================================

class DecorativeSnake {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.resize();

		// Position et direction initiales
		this.x = this.canvas.width / 2;
		this.y = this.canvas.height / 2;
		this.angle = Math.random() * Math.PI * 2;
		this.targetAngle = this.angle;

		// Corps du snake
		this.segments = [];
		for (let i = 0; i < CONFIG.snakeLength; i++) {
			this.segments.push({
				x: this.x - i * CONFIG.segmentSize * Math.cos(this.angle),
				y: this.y - i * CONFIG.segmentSize * Math.sin(this.angle),
			});
		}

		// Événements
		window.addEventListener("resize", () => this.resize());
		this.canvas.addEventListener("click", (e) => this.handleClick(e));
		this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));

		this.isHovering = false;

		// Démarrer l'animation
		this.animate();
	}

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	handleClick(e) {
		if (this.isPointOnSnake(e.clientX, e.clientY)) {
			// Aller vers le jeu
			window.location.href = CONFIG.gameUrl;
		}
	}

	handleMouseMove(e) {
		const wasHovering = this.isHovering;
		this.isHovering = this.isPointOnSnake(e.clientX, e.clientY);

		if (this.isHovering && !wasHovering) {
			document.body.style.cursor = "pointer";
		} else if (!this.isHovering && wasHovering) {
			document.body.style.cursor = "default";
		}
	}

	isPointOnSnake(px, py) {
		for (let i = 0; i < this.segments.length; i++) {
			const seg = this.segments[i];
			const size = i === 0 ? CONFIG.segmentSize * 1.3 : CONFIG.segmentSize;
			const dist = Math.sqrt((px - seg.x) ** 2 + (py - seg.y) ** 2);
			if (dist < size) {
				return true;
			}
		}
		return false;
	}

	update() {
		// Changer de direction aléatoirement
		if (Math.random() < CONFIG.turnChance) {
			this.targetAngle += ((Math.random() - 0.5) * Math.PI) / 2;
		}

		// Tourner doucement vers l'angle cible
		let angleDiff = this.targetAngle - this.angle;
		while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
		while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
		this.angle += angleDiff * 0.1;

		// Avancer
		this.x += Math.cos(this.angle) * CONFIG.speed;
		this.y += Math.sin(this.angle) * CONFIG.speed;

		// Rebondir sur les bords
		const margin = CONFIG.segmentSize * 2;
		if (this.x < margin) {
			this.x = margin;
			this.targetAngle = Math.random() * Math.PI - Math.PI / 2;
		}
		if (this.x > this.canvas.width - margin) {
			this.x = this.canvas.width - margin;
			this.targetAngle = Math.PI + (Math.random() * Math.PI - Math.PI / 2);
		}
		if (this.y < margin) {
			this.y = margin;
			this.targetAngle = Math.random() * Math.PI;
		}
		if (this.y > this.canvas.height - margin) {
			this.y = this.canvas.height - margin;
			this.targetAngle = -Math.random() * Math.PI;
		}

		// Mettre à jour les segments (suivent la tête)
		this.segments.unshift({ x: this.x, y: this.y });
		this.segments.pop();
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Dessiner le corps (du dernier au premier pour que la tête soit au-dessus)
		for (let i = this.segments.length - 1; i >= 0; i--) {
			const seg = this.segments[i];
			const t = i / (this.segments.length - 1);

			if (i === 0) {
				// Tête
				this.drawHead(seg.x, seg.y);
			} else {
				// Corps
				const size = CONFIG.segmentSize * (1 - t * 0.4);
				const color = this.lerpColor(
					CONFIG.bodyColorStart,
					CONFIG.bodyColorEnd,
					t
				);

				this.ctx.beginPath();
				this.ctx.arc(seg.x, seg.y, size / 2, 0, Math.PI * 2);
				this.ctx.fillStyle = color;
				this.ctx.fill();

				// Ombre intérieure
				this.ctx.beginPath();
				this.ctx.arc(seg.x, seg.y, size / 2, 0, Math.PI * 2);
				const gradient = this.ctx.createRadialGradient(
					seg.x - size / 6,
					seg.y - size / 6,
					0,
					seg.x,
					seg.y,
					size / 2
				);
				gradient.addColorStop(0, "rgba(255,255,255,0.3)");
				gradient.addColorStop(1, "rgba(0,0,0,0.2)");
				this.ctx.fillStyle = gradient;
				this.ctx.fill();
			}
		}

		// Effet de survol
		if (this.isHovering) {
			this.drawHoverEffect();
		}
	}

	drawHead(x, y) {
		const size = CONFIG.segmentSize * 1.3;

		// Tête
		this.ctx.beginPath();
		this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
		this.ctx.fillStyle = CONFIG.headColor;
		this.ctx.fill();

		// Brillance
		const gradient = this.ctx.createRadialGradient(
			x - size / 6,
			y - size / 6,
			0,
			x,
			y,
			size / 2
		);
		gradient.addColorStop(0, "rgba(255,255,255,0.4)");
		gradient.addColorStop(1, "rgba(0,0,0,0.1)");
		this.ctx.fillStyle = gradient;
		this.ctx.fill();

		// Yeux
		const eyeOffset = size / 4;
		const eyeSize = size / 5;
		const pupilSize = size / 10;

		// Direction du regard
		const nextSeg = this.segments[1] || this.segments[0];
		const lookAngle = Math.atan2(y - nextSeg.y, x - nextSeg.x);

		// Oeil gauche
		const leftEyeX = x + Math.cos(lookAngle - 0.5) * eyeOffset;
		const leftEyeY = y + Math.sin(lookAngle - 0.5) * eyeOffset;

		this.ctx.beginPath();
		this.ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
		this.ctx.fillStyle = CONFIG.eyeColor;
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.arc(
			leftEyeX + Math.cos(lookAngle) * 2,
			leftEyeY + Math.sin(lookAngle) * 2,
			pupilSize,
			0,
			Math.PI * 2
		);
		this.ctx.fillStyle = CONFIG.pupilColor;
		this.ctx.fill();

		// Oeil droit
		const rightEyeX = x + Math.cos(lookAngle + 0.5) * eyeOffset;
		const rightEyeY = y + Math.sin(lookAngle + 0.5) * eyeOffset;

		this.ctx.beginPath();
		this.ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
		this.ctx.fillStyle = CONFIG.eyeColor;
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.arc(
			rightEyeX + Math.cos(lookAngle) * 2,
			rightEyeY + Math.sin(lookAngle) * 2,
			pupilSize,
			0,
			Math.PI * 2
		);
		this.ctx.fillStyle = CONFIG.pupilColor;
		this.ctx.fill();
	}

	drawHoverEffect() {
		// Glow autour du snake
		for (let i = 0; i < this.segments.length; i++) {
			const seg = this.segments[i];
			const size =
				i === 0 ? CONFIG.segmentSize * 1.5 : CONFIG.segmentSize * 1.2;

			this.ctx.beginPath();
			this.ctx.arc(seg.x, seg.y, size, 0, Math.PI * 2);
			this.ctx.strokeStyle = "rgba(0, 255, 136, 0.3)";
			this.ctx.lineWidth = 5;
			this.ctx.stroke();
		}
	}

	lerpColor(color1, color2, t) {
		const c1 = this.hexToRgb(color1);
		const c2 = this.hexToRgb(color2);

		const r = Math.round(c1.r + (c2.r - c1.r) * t);
		const g = Math.round(c1.g + (c2.g - c1.g) * t);
		const b = Math.round(c1.b + (c2.b - c1.b) * t);

		return `rgb(${r}, ${g}, ${b})`;
	}

	hexToRgb(hex) {
		const result = /^#? ([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
			  }
			: { r: 0, g: 0, b: 0 };
	}

	animate() {
		this.update();
		this.draw();
		requestAnimationFrame(() => this.animate());
	}
}

// Démarrer
const canvas = document.getElementById("snake-canvas");
const snake = new DecorativeSnake(canvas);
