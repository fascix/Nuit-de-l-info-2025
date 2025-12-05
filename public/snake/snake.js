// ============================================
// CONFIGURATION FACILEMENT MODIFIABLE
// ============================================

const CONFIG = {
	gridSize: 8,
	gameSpeed: 300,
	cubeSize: 10,
	initialSnakeLength: 3,
	cameraRotationSpeed: 0.05,
};

// ============================================
// PERSONNALISATION DES TILES (CASES)
// ============================================

const TILE_CONFIG = {
	faceColors: [
		0x00ff00, // Face 0 - VERT vif
		0x0066ff, // Face 1 - BLEU vif
		0xff0000, // Face 2 - ROUGE vif
		0xffff00, // Face 3 - JAUNE vif
		0xff00ff, // Face 4 - ROSE/MAGENTA vif
		0x00ffff, // Face 5 - CYAN vif
	],

	faceColorNames: ["VERT", "BLEU", "ROUGE", "JAUNE", "ROSE", "CYAN"],

	tileOpacity: 0.5,
	tileGap: 0.05,
	tileBorderColor: 0xffffff,
	tileBorderOpacity: 0.8,

	createTile: function (x, y, faceIndex, tileSize) {
		const geometry = new THREE.PlaneGeometry(
			tileSize - this.tileGap,
			tileSize - this.tileGap
		);

		const material = new THREE.MeshPhongMaterial({
			color: this.faceColors[faceIndex],
			transparent: true,
			opacity: this.tileOpacity,
			side: THREE.DoubleSide,
		});

		const tile = new THREE.Mesh(geometry, material);

		const edges = new THREE.EdgesGeometry(geometry);
		const lineMaterial = new THREE.LineBasicMaterial({
			color: this.tileBorderColor,
			transparent: true,
			opacity: this.tileBorderOpacity,
		});
		const border = new THREE.LineSegments(edges, lineMaterial);
		tile.add(border);

		return tile;
	},
};

// ============================================
// PERSONNALISATION DU SNAKE
// ============================================

const SNAKE_CONFIG = {
	headColor: 0x00ff88,
	headEmissive: 0x00ff88,
	headEmissiveIntensity: 0.5,

	bodyColor: 0x00cc6a,
	bodyEmissive: 0x00cc6a,
	bodyEmissiveIntensity: 0.3,

	sizeRatio: 0.7,

	createHead: function (size) {
		const geometry = new THREE.SphereGeometry(
			(size * this.sizeRatio) / 2,
			16,
			16
		);
		const material = new THREE.MeshPhongMaterial({
			color: this.headColor,
			emissive: this.headEmissive,
			emissiveIntensity: this.headEmissiveIntensity,
		});

		const head = new THREE.Mesh(geometry, material);

		const eyeGeometry = new THREE.SphereGeometry(size * 0.1, 8, 8);
		const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
		const pupilGeometry = new THREE.SphereGeometry(size * 0.05, 8, 8);
		const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

		const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
		const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
		const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
		const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);

		leftEye.position.set(-size * 0.15, size * 0.1, size * 0.25);
		rightEye.position.set(size * 0.15, size * 0.1, size * 0.25);
		leftPupil.position.set(-size * 0.15, size * 0.1, size * 0.32);
		rightPupil.position.set(size * 0.15, size * 0.1, size * 0.32);

		head.add(leftEye, rightEye, leftPupil, rightPupil);

		return head;
	},

	createBodySegment: function (size) {
		const geometry = new THREE.SphereGeometry(
			(size * this.sizeRatio) / 2.2,
			12,
			12
		);
		const material = new THREE.MeshPhongMaterial({
			color: this.bodyColor,
			emissive: this.bodyEmissive,
			emissiveIntensity: this.bodyEmissiveIntensity,
		});
		return new THREE.Mesh(geometry, material);
	},
};

// ============================================
// PERSONNALISATION DES COLLECTIBLES
// ============================================

const COLLECTIBLE_CONFIG = {
	currentType: "apple",
	points: 10,
	rotationSpeed: 0.03,

	types: {
		apple: {
			createMesh: function (size) {
				const group = new THREE.Group();

				const appleGeometry = new THREE.SphereGeometry(size * 0.35, 16, 16);
				const appleMaterial = new THREE.MeshPhongMaterial({
					color: 0xff0000,
					emissive: 0xff0000,
					emissiveIntensity: 0.3,
				});
				const apple = new THREE.Mesh(appleGeometry, appleMaterial);

				const stemGeometry = new THREE.CylinderGeometry(
					0.02,
					0.02,
					size * 0.15,
					8
				);
				const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
				const stem = new THREE.Mesh(stemGeometry, stemMaterial);
				stem.position.y = size * 0.35;

				const leafGeometry = new THREE.SphereGeometry(size * 0.1, 8, 8);
				leafGeometry.scale(1, 0.3, 1);
				const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 });
				const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
				leaf.position.set(size * 0.1, size * 0.35, 0);
				leaf.rotation.z = -0.5;

				group.add(apple, stem, leaf);
				return group;
			},
		},

		star: {
			createMesh: function (size) {
				const shape = new THREE.Shape();
				const outerRadius = size * 0.35;
				const innerRadius = size * 0.15;
				const spikes = 5;

				for (let i = 0; i < spikes * 2; i++) {
					const radius = i % 2 === 0 ? outerRadius : innerRadius;
					const angle = (i * Math.PI) / spikes - Math.PI / 2;
					const x = Math.cos(angle) * radius;
					const y = Math.sin(angle) * radius;

					if (i === 0) shape.moveTo(x, y);
					else shape.lineTo(x, y);
				}
				shape.closePath();

				const extrudeSettings = { depth: size * 0.1, bevelEnabled: false };
				const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
				const material = new THREE.MeshPhongMaterial({
					color: 0xffd700,
					emissive: 0xffd700,
					emissiveIntensity: 0.5,
				});

				const star = new THREE.Mesh(geometry, material);
				star.rotation.x = Math.PI / 2;
				return star;
			},
		},

		gem: {
			createMesh: function (size) {
				const geometry = new THREE.OctahedronGeometry(size * 0.3, 0);
				const material = new THREE.MeshPhongMaterial({
					color: 0x00ffff,
					emissive: 0x00ffff,
					emissiveIntensity: 0.5,
					transparent: true,
					opacity: 0.8,
				});
				return new THREE.Mesh(geometry, material);
			},
		},
	},

	createCollectible: function (size) {
		const type = this.types[this.currentType];
		const mesh = type.createMesh(size);
		mesh.userData.type = this.currentType;
		return mesh;
	},
};

// ============================================
// CLASSE PRINCIPALE DU JEU
// ============================================

class SnakeCubeGame {
	constructor() {
		this.scene = null;
		this.camera = null;
		this.renderer = null;
		this.cube = null;
		this.tiles = [];
		this.snake = [];
		this.snakeMeshes = [];
		this.collectible = null;
		this.collectibleMesh = null;
		this.direction = { dx: 1, dy: 0 };
		this.nextDirection = null;
		this.currentFace = 0;
		this.score = 0;
		this.gameRunning = false;
		this.paused = false;
		this.lastMoveTime = 0;
		this.animationTime = 0;

		this.init();
	}

	init() {
		this.setupScene();
		this.setupLights();
		this.setupCube();
		this.setupEventListeners();
		this.startGame();
		this.animate();
	}

	setupScene() {
		this.scene = new THREE.Scene();

		// Fond étoilé
		const starsGeometry = new THREE.BufferGeometry();
		const starVertices = [];
		for (let i = 0; i < 1000; i++) {
			starVertices.push(
				(Math.random() - 0.5) * 200,
				(Math.random() - 0.5) * 200,
				(Math.random() - 0.5) * 200
			);
		}
		starsGeometry.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(starVertices, 3)
		);
		const starsMaterial = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 0.1,
		});
		const stars = new THREE.Points(starsGeometry, starsMaterial);
		this.scene.add(stars);

		this.camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		document
			.getElementById("game-container")
			.appendChild(this.renderer.domElement);
	}

	setupLights() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		this.scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(10, 20, 10);
		this.scene.add(directionalLight);

		this.cameraLight = new THREE.PointLight(0xffffff, 0.4, 50);
		this.scene.add(this.cameraLight);
	}

	setupCube() {
		this.cube = new THREE.Group();
		const halfSize = CONFIG.cubeSize / 2;
		const tileSize = CONFIG.cubeSize / CONFIG.gridSize;

		const faceTransforms = [
			{ pos: [0, 0, halfSize], rot: [0, 0, 0] },
			{ pos: [0, 0, -halfSize], rot: [0, Math.PI, 0] },
			{ pos: [halfSize, 0, 0], rot: [0, Math.PI / 2, 0] },
			{ pos: [-halfSize, 0, 0], rot: [0, -Math.PI / 2, 0] },
			{ pos: [0, halfSize, 0], rot: [-Math.PI / 2, 0, 0] },
			{ pos: [0, -halfSize, 0], rot: [Math.PI / 2, 0, 0] },
		];

		this.tiles = [];

		faceTransforms.forEach((transform, faceIndex) => {
			const faceGroup = new THREE.Group();
			this.tiles[faceIndex] = [];

			for (let y = 0; y < CONFIG.gridSize; y++) {
				this.tiles[faceIndex][y] = [];
				for (let x = 0; x < CONFIG.gridSize; x++) {
					const tile = TILE_CONFIG.createTile(x, y, faceIndex, tileSize);

					tile.position.x = (x - CONFIG.gridSize / 2 + 0.5) * tileSize;
					tile.position.y = (y - CONFIG.gridSize / 2 + 0.5) * tileSize;
					tile.position.z = 0.01;

					tile.userData = { face: faceIndex, x, y };
					this.tiles[faceIndex][y][x] = tile;
					faceGroup.add(tile);
				}
			}

			faceGroup.position.set(...transform.pos);
			faceGroup.rotation.set(...transform.rot);
			this.cube.add(faceGroup);
		});

		this.scene.add(this.cube);
	}

	setupEventListeners() {
		window.addEventListener("resize", () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		});

		window.addEventListener("keydown", (e) => this.handleKeyDown(e));

		document.getElementById("restart-btn").addEventListener("click", () => {
			document.getElementById("game-over").classList.add("hidden");
			this.startGame();
		});
	}

	getControlMapping() {
		const cameraDir = new THREE.Vector3();
		this.camera.getWorldDirection(cameraDir);

		const cameraUp = this.camera.up.clone();
		const cameraRight = new THREE.Vector3()
			.crossVectors(cameraDir, cameraUp)
			.normalize();

		let upVec, rightVec;

		switch (this.currentFace) {
			case 0:
				upVec = new THREE.Vector3(0, 1, 0);
				rightVec = new THREE.Vector3(1, 0, 0);
				break;
			case 1:
				upVec = new THREE.Vector3(0, 1, 0);
				rightVec = new THREE.Vector3(-1, 0, 0);
				break;
			case 2:
				upVec = new THREE.Vector3(0, 1, 0);
				rightVec = new THREE.Vector3(0, 0, -1);
				break;
			case 3:
				upVec = new THREE.Vector3(0, 1, 0);
				rightVec = new THREE.Vector3(0, 0, 1);
				break;
			case 4:
				upVec = new THREE.Vector3(0, 0, -1);
				rightVec = new THREE.Vector3(1, 0, 0);
				break;
			case 5:
				upVec = new THREE.Vector3(0, 0, 1);
				rightVec = new THREE.Vector3(1, 0, 0);
				break;
		}

		const camUpDotFaceUp = cameraUp.dot(upVec);
		const camUpDotFaceRight = cameraUp.dot(rightVec);
		const camRightDotFaceUp = cameraRight.dot(upVec);
		const camRightDotFaceRight = cameraRight.dot(rightVec);

		let up, down, left, right;

		if (Math.abs(camUpDotFaceUp) > Math.abs(camUpDotFaceRight)) {
			if (camUpDotFaceUp > 0) {
				up = { dx: 0, dy: 1 };
				down = { dx: 0, dy: -1 };
			} else {
				up = { dx: 0, dy: -1 };
				down = { dx: 0, dy: 1 };
			}

			if (camRightDotFaceRight > 0) {
				right = { dx: 1, dy: 0 };
				left = { dx: -1, dy: 0 };
			} else {
				right = { dx: -1, dy: 0 };
				left = { dx: 1, dy: 0 };
			}
		} else {
			if (camUpDotFaceRight > 0) {
				up = { dx: 1, dy: 0 };
				down = { dx: -1, dy: 0 };
			} else {
				up = { dx: -1, dy: 0 };
				down = { dx: 1, dy: 0 };
			}

			if (camRightDotFaceUp > 0) {
				right = { dx: 0, dy: 1 };
				left = { dx: 0, dy: -1 };
			} else {
				right = { dx: 0, dy: -1 };
				left = { dx: 0, dy: 1 };
			}
		}

		return { up, down, left, right };
	}

	handleKeyDown(e) {
		if (e.code === "Space") {
			this.paused = !this.paused;
			return;
		}

		if (this.paused || !this.gameRunning) return;

		const mapping = this.getControlMapping();
		const currentDir = this.direction;
		let newDir = null;

		switch (e.code) {
			case "ArrowUp":
				if (
					currentDir.dy !== -mapping.up.dy ||
					currentDir.dx !== -mapping.up.dx
				) {
					newDir = mapping.up;
				}
				break;
			case "ArrowDown":
				if (
					currentDir.dy !== -mapping.down.dy ||
					currentDir.dx !== -mapping.down.dx
				) {
					newDir = mapping.down;
				}
				break;
			case "ArrowLeft":
				if (
					currentDir.dx !== -mapping.left.dx ||
					currentDir.dy !== -mapping.left.dy
				) {
					newDir = mapping.left;
				}
				break;
			case "ArrowRight":
				if (
					currentDir.dx !== -mapping.right.dx ||
					currentDir.dy !== -mapping.right.dy
				) {
					newDir = mapping.right;
				}
				break;
		}

		if (newDir) {
			this.nextDirection = newDir;
		}
	}

	getCameraPositionForFace(face) {
		const distance = 20;
		switch (face) {
			case 0:
				return new THREE.Vector3(0, 2, distance);
			case 1:
				return new THREE.Vector3(0, 2, -distance);
			case 2:
				return new THREE.Vector3(distance, 2, 0);
			case 3:
				return new THREE.Vector3(-distance, 2, 0);
			case 4:
				return new THREE.Vector3(0, distance, 0.1);
			case 5:
				return new THREE.Vector3(0, -distance, 0.1);
			default:
				return new THREE.Vector3(0, 2, distance);
		}
	}

	updateCamera() {
		const targetPos = this.getCameraPositionForFace(this.currentFace);

		this.camera.position.lerp(targetPos, CONFIG.cameraRotationSpeed);
		this.camera.lookAt(0, 0, 0);

		const targetUp =
			this.currentFace === 4
				? new THREE.Vector3(0, 0, -1)
				: this.currentFace === 5
				? new THREE.Vector3(0, 0, 1)
				: new THREE.Vector3(0, 1, 0);
		this.camera.up.lerp(targetUp, CONFIG.cameraRotationSpeed);

		this.cameraLight.position.copy(this.camera.position);
	}

	startGame() {
		this.score = 0;
		this.updateScore();
		this.gameRunning = true;
		this.paused = false;
		this.currentFace = 0;

		this.snakeMeshes.forEach((mesh) => this.scene.remove(mesh));
		this.snakeMeshes = [];

		if (this.collectibleMesh) {
			this.scene.remove(this.collectibleMesh);
			this.collectibleMesh = null;
		}

		this.snake = [];
		const startX = Math.floor(CONFIG.gridSize / 2);
		const startY = Math.floor(CONFIG.gridSize / 2);

		for (let i = 0; i < CONFIG.initialSnakeLength; i++) {
			this.snake.push({ face: 0, x: startX - i, y: startY });
		}

		this.direction = { dx: 1, dy: 0 };
		this.nextDirection = null;

		const camPos = this.getCameraPositionForFace(0);
		this.camera.position.copy(camPos);
		this.camera.up.set(0, 1, 0);
		this.camera.lookAt(0, 0, 0);

		this.createSnakeMeshes();
		this.spawnCollectible();
	}

	createSnakeMeshes() {
		this.snakeMeshes.forEach((mesh) => this.scene.remove(mesh));
		this.snakeMeshes = [];

		const tileSize = CONFIG.cubeSize / CONFIG.gridSize;

		this.snake.forEach((segment, index) => {
			const mesh =
				index === 0
					? SNAKE_CONFIG.createHead(tileSize)
					: SNAKE_CONFIG.createBodySegment(tileSize);

			this.positionMeshOnCube(mesh, segment.face, segment.x, segment.y);
			this.scene.add(mesh);
			this.snakeMeshes.push(mesh);
		});
	}

	positionMeshOnCube(mesh, face, x, y) {
		const halfSize = CONFIG.cubeSize / 2;
		const tileSize = CONFIG.cubeSize / CONFIG.gridSize;

		const localX = (x - CONFIG.gridSize / 2 + 0.5) * tileSize;
		const localY = (y - CONFIG.gridSize / 2 + 0.5) * tileSize;
		const offset = halfSize + tileSize * 0.5;

		mesh.rotation.set(0, 0, 0);

		switch (face) {
			case 0:
				mesh.position.set(localX, localY, offset);
				break;
			case 1:
				mesh.position.set(-localX, localY, -offset);
				mesh.rotation.y = Math.PI;
				break;
			case 2:
				mesh.position.set(offset, localY, -localX);
				mesh.rotation.y = Math.PI / 2;
				break;
			case 3:
				mesh.position.set(-offset, localY, localX);
				mesh.rotation.y = -Math.PI / 2;
				break;
			case 4:
				mesh.position.set(localX, offset, -localY);
				mesh.rotation.x = -Math.PI / 2;
				break;
			case 5:
				mesh.position.set(localX, -offset, localY);
				mesh.rotation.x = Math.PI / 2;
				break;
		}
	}

	spawnCollectible() {
		if (this.collectibleMesh) {
			this.scene.remove(this.collectibleMesh);
		}

		let pos;
		let attempts = 0;
		do {
			pos = {
				face: Math.floor(Math.random() * 6),
				x: Math.floor(Math.random() * CONFIG.gridSize),
				y: Math.floor(Math.random() * CONFIG.gridSize),
			};
			attempts++;
		} while (this.isSnakePosition(pos.face, pos.x, pos.y) && attempts < 100);

		this.collectible = pos;

		const tileSize = CONFIG.cubeSize / CONFIG.gridSize;
		this.collectibleMesh = COLLECTIBLE_CONFIG.createCollectible(tileSize);
		this.positionMeshOnCube(this.collectibleMesh, pos.face, pos.x, pos.y);

		// Halo lumineux
		const glowGeometry = new THREE.SphereGeometry(tileSize * 0.6, 16, 16);
		const glowMaterial = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			transparent: true,
			opacity: 0.2,
		});
		const glow = new THREE.Mesh(glowGeometry, glowMaterial);
		this.collectibleMesh.add(glow);

		this.scene.add(this.collectibleMesh);

		// Mettre à jour l'indicateur UI avec la couleur
		const colorName = TILE_CONFIG.faceColorNames[pos.face];
		const colorHex =
			"#" + TILE_CONFIG.faceColors[pos.face].toString(16).padStart(6, "0");
		const appleIndicator = document.getElementById("apple-face");
		appleIndicator.textContent = colorName;
		appleIndicator.style.color = colorHex;
		appleIndicator.style.textShadow = "0 0 10px " + colorHex;
	}

	isSnakePosition(face, x, y) {
		return this.snake.some((s) => s.face === face && s.x === x && s.y === y);
	}

	moveSnake() {
		if (this.nextDirection) {
			this.direction = this.nextDirection;
			this.nextDirection = null;
		}

		const head = this.snake[0];
		let newHead = this.getNextPosition(head);

		if (newHead.face !== this.currentFace) {
			this.currentFace = newHead.face;
		}

		for (let i = 0; i < this.snake.length - 1; i++) {
			if (
				this.snake[i].face === newHead.face &&
				this.snake[i].x === newHead.x &&
				this.snake[i].y === newHead.y
			) {
				this.gameOver();
				return;
			}
		}

		this.snake.unshift(newHead);

		if (
			newHead.face === this.collectible.face &&
			newHead.x === this.collectible.x &&
			newHead.y === this.collectible.y
		) {
			this.score += COLLECTIBLE_CONFIG.points;
			this.updateScore();
			this.spawnCollectible();
		} else {
			this.snake.pop();
		}

		this.createSnakeMeshes();
	}

	getNextPosition(pos) {
		let newX = pos.x + this.direction.dx;
		let newY = pos.y + this.direction.dy;
		let newFace = pos.face;

		const g = CONFIG.gridSize - 1;

		if (newX < 0) {
			const result = this.transitionLeft(pos.face, pos.y);
			return { face: result.face, x: result.x, y: result.y };
		} else if (newX > g) {
			const result = this.transitionRight(pos.face, pos.y);
			return { face: result.face, x: result.x, y: result.y };
		} else if (newY < 0) {
			const result = this.transitionUp(pos.face, pos.x);
			return { face: result.face, x: result.x, y: result.y };
		} else if (newY > g) {
			const result = this.transitionDown(pos.face, pos.x);
			return { face: result.face, x: result.x, y: result.y };
		}

		return { face: newFace, x: newX, y: newY };
	}

	transitionLeft(face, y) {
		const g = CONFIG.gridSize - 1;
		switch (face) {
			case 0:
				this.direction = { dx: -1, dy: 0 };
				return { face: 3, x: g, y: y };
			case 1:
				this.direction = { dx: -1, dy: 0 };
				return { face: 2, x: g, y: y };
			case 2:
				this.direction = { dx: -1, dy: 0 };
				return { face: 0, x: g, y: y };
			case 3:
				this.direction = { dx: -1, dy: 0 };
				return { face: 1, x: g, y: y };
			case 4:
				this.direction = { dx: 0, dy: 1 };
				return { face: 3, x: y, y: 0 };
			case 5:
				this.direction = { dx: 0, dy: -1 };
				return { face: 3, x: g - y, y: g };
		}
	}

	transitionRight(face, y) {
		const g = CONFIG.gridSize - 1;
		switch (face) {
			case 0:
				this.direction = { dx: 1, dy: 0 };
				return { face: 2, x: 0, y: y };
			case 1:
				this.direction = { dx: 1, dy: 0 };
				return { face: 3, x: 0, y: y };
			case 2:
				this.direction = { dx: 1, dy: 0 };
				return { face: 1, x: 0, y: y };
			case 3:
				this.direction = { dx: 1, dy: 0 };
				return { face: 0, x: 0, y: y };
			case 4:
				this.direction = { dx: 0, dy: 1 };
				return { face: 2, x: g - y, y: 0 };
			case 5:
				this.direction = { dx: 0, dy: -1 };
				return { face: 2, x: y, y: g };
		}
	}

	transitionUp(face, x) {
		const g = CONFIG.gridSize - 1;
		switch (face) {
			case 0:
				this.direction = { dx: 0, dy: -1 };
				return { face: 4, x: x, y: g };
			case 1:
				this.direction = { dx: 0, dy: 1 };
				return { face: 4, x: g - x, y: 0 };
			case 2:
				this.direction = { dx: -1, dy: 0 };
				return { face: 4, x: g, y: g - x };
			case 3:
				this.direction = { dx: 1, dy: 0 };
				return { face: 4, x: 0, y: x };
			case 4:
				this.direction = { dx: 0, dy: 1 };
				return { face: 1, x: g - x, y: 0 };
			case 5:
				this.direction = { dx: 0, dy: -1 };
				return { face: 0, x: x, y: g };
		}
	}

	transitionDown(face, x) {
		const g = CONFIG.gridSize - 1;
		switch (face) {
			case 0:
				this.direction = { dx: 0, dy: 1 };
				return { face: 5, x: x, y: 0 };
			case 1:
				this.direction = { dx: 0, dy: -1 };
				return { face: 5, x: g - x, y: g };
			case 2:
				this.direction = { dx: -1, dy: 0 };
				return { face: 5, x: g, y: x };
			case 3:
				this.direction = { dx: 1, dy: 0 };
				return { face: 5, x: 0, y: g - x };
			case 4:
				this.direction = { dx: 0, dy: 1 };
				return { face: 0, x: x, y: 0 };
			case 5:
				this.direction = { dx: 0, dy: -1 };
				return { face: 1, x: g - x, y: g };
		}
	}

	updateScore() {
		document.getElementById("score-value").textContent = this.score;
	}

	gameOver() {
		this.gameRunning = false;
		document.getElementById("final-score").textContent = this.score;
		document.getElementById("game-over").classList.remove("hidden");
	}

	animate() {
		requestAnimationFrame(() => this.animate());

		const now = Date.now();
		this.animationTime += 0.016;

		if (
			this.gameRunning &&
			!this.paused &&
			now - this.lastMoveTime > CONFIG.gameSpeed
		) {
			this.moveSnake();
			this.lastMoveTime = now;
		}

		this.updateCamera();

		// Animation de la pomme
		if (this.collectibleMesh) {
			this.collectibleMesh.rotation.y += COLLECTIBLE_CONFIG.rotationSpeed;
			const pulse = Math.sin(this.animationTime * 3) * 0.1 + 1;
			this.collectibleMesh.scale.set(pulse, pulse, pulse);
		}

		this.renderer.render(this.scene, this.camera);
	}
}

// Démarrer le jeu
const game = new SnakeCubeGame();
